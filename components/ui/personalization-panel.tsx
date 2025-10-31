'use client';

/**
 * Personalization Panel Component
 * UI for configuring and applying content personalization
 */

import { useState } from 'react';
import { Wand2, Loader2, Settings2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePersonalization } from '@/hooks/use-personalization';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { UserPreferences } from '@/lib/personalization-service';

interface PersonalizationPanelProps {
  content: string;
  documentType: 'resume' | 'cover-letter' | 'cv' | 'presentation' | 'report' | 'email' | 'other';
  onPersonalized: (personalizedContent: string) => void;
  className?: string;
  defaultPreferences?: Partial<UserPreferences>;
}

export function PersonalizationPanel({
  content,
  documentType,
  onPersonalized,
  className,
  defaultPreferences,
}: PersonalizationPanelProps) {
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState<UserPreferences>({
    industry: defaultPreferences?.industry || '',
    role: defaultPreferences?.role || '',
    experienceLevel: defaultPreferences?.experienceLevel || 'mid',
    tonePreference: defaultPreferences?.tonePreference || 'professional',
    stylePreference: defaultPreferences?.stylePreference || 'concise',
    targetAudience: defaultPreferences?.targetAudience || '',
    keywords: defaultPreferences?.keywords || [],
    avoidWords: defaultPreferences?.avoidWords || [],
  });
  const [keywordInput, setKeywordInput] = useState('');
  const [avoidWordInput, setAvoidWordInput] = useState('');
  const [result, setResult] = useState<any>(null);

  const {
    personalize,
    isProcessing,
    error,
    commonIndustries,
    toneOptions,
    styleOptions,
  } = usePersonalization();

  const handlePersonalize = async () => {
    if (!content) return;

    try {
      const personalizationResult = await personalize(content, {
        preferences,
        documentType,
        preserveStructure: true,
      });

      setResult(personalizationResult);
    } catch (err) {
      console.error('Personalization failed:', err);
    }
  };

  const handleApply = () => {
    if (result?.personalizedContent) {
      onPersonalized(result.personalizedContent);
      setOpen(false);
      setResult(null);
    }
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      setPreferences({
        ...preferences,
        keywords: [...(preferences.keywords || []), keywordInput.trim()],
      });
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setPreferences({
      ...preferences,
      keywords: (preferences.keywords || []).filter((k) => k !== keyword),
    });
  };

  const handleAddAvoidWord = () => {
    if (avoidWordInput.trim()) {
      setPreferences({
        ...preferences,
        avoidWords: [...(preferences.avoidWords || []), avoidWordInput.trim()],
      });
      setAvoidWordInput('');
    }
  };

  const handleRemoveAvoidWord = (word: string) => {
    setPreferences({
      ...preferences,
      avoidWords: (preferences.avoidWords || []).filter((w) => w !== word),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Wand2 className="mr-2 h-4 w-4" />
          Personalize
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            Personalize Your Content
          </DialogTitle>
          <DialogDescription>
            Customize the tone, style, and content to match your preferences and industry.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={result ? 'result' : 'settings'} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="settings">
              <Settings2 className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="result" disabled={!result}>
              <Sparkles className="mr-2 h-4 w-4" />
              Result
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry</Label>
                <Select
                  value={preferences.industry}
                  onValueChange={(value) =>
                    setPreferences({ ...preferences, industry: value })
                  }
                >
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {commonIndustries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role/Position</Label>
                <Input
                  id="role"
                  placeholder="e.g., Senior Software Engineer"
                  value={preferences.role}
                  onChange={(e) =>
                    setPreferences({ ...preferences, role: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Experience Level</Label>
                <Select
                  value={preferences.experienceLevel}
                  onValueChange={(value: any) =>
                    setPreferences({ ...preferences, experienceLevel: value })
                  }
                >
                  <SelectTrigger id="experience">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select
                  value={preferences.tonePreference}
                  onValueChange={(value: any) =>
                    setPreferences({ ...preferences, tonePreference: value })
                  }
                >
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {toneOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Writing Style</Label>
                <Select
                  value={preferences.stylePreference}
                  onValueChange={(value: any) =>
                    setPreferences({ ...preferences, stylePreference: value })
                  }
                >
                  <SelectTrigger id="style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {styleOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex flex-col">
                          <span>{option.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {option.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Input
                  id="audience"
                  placeholder="e.g., Hiring Managers in Tech"
                  value={preferences.targetAudience}
                  onChange={(e) =>
                    setPreferences({ ...preferences, targetAudience: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Keywords to Emphasize</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a keyword"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
                />
                <Button type="button" onClick={handleAddKeyword} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {preferences.keywords?.map((keyword) => (
                  <Badge key={keyword} variant="secondary">
                    {keyword}
                    <button
                      onClick={() => handleRemoveKeyword(keyword)}
                      className="ml-2 hover:text-destructive"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Words to Avoid</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Add a word to avoid"
                  value={avoidWordInput}
                  onChange={(e) => setAvoidWordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddAvoidWord()}
                />
                <Button type="button" onClick={handleAddAvoidWord} size="sm">
                  Add
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {preferences.avoidWords?.map((word) => (
                  <Badge key={word} variant="destructive">
                    {word}
                    <button
                      onClick={() => handleRemoveAvoidWord(word)}
                      className="ml-2 hover:text-white"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </TabsContent>

          <TabsContent value="result" className="space-y-4 py-4">
            {result && (
              <>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <Alert>
                    <AlertDescription className="flex items-center justify-between">
                      <span>Tone Match</span>
                      <Badge variant="secondary">
                        {Math.round(result.toneScore * 100)}%
                      </Badge>
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <AlertDescription className="flex items-center justify-between">
                      <span>Relevance Score</span>
                      <Badge variant="secondary">
                        {Math.round(result.relevanceScore * 100)}%
                      </Badge>
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="space-y-2">
                  <Label>Personalized Content</Label>
                  <Textarea
                    value={result.personalizedContent}
                    readOnly
                    className="min-h-[300px] font-mono text-sm"
                  />
                </div>

                {result.changes && result.changes.length > 0 && (
                  <div className="space-y-2">
                    <Label>Key Changes Made</Label>
                    <div className="space-y-2 max-h-[200px] overflow-y-auto">
                      {result.changes.slice(0, 5).map((change: any, index: number) => (
                        <div key={index} className="p-3 border rounded-lg">
                          <div className="font-medium text-sm mb-1">
                            {change.section}
                          </div>
                          <div className="text-xs text-muted-foreground mb-2">
                            {change.reason}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="p-2 bg-red-50 dark:bg-red-950 rounded">
                              <div className="font-medium mb-1">Original:</div>
                              <div className="line-through">{change.original}</div>
                            </div>
                            <div className="p-2 bg-green-50 dark:bg-green-950 rounded">
                              <div className="font-medium mb-1">Personalized:</div>
                              <div>{change.personalized}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {result.suggestions && result.suggestions.length > 0 && (
                  <div className="space-y-2">
                    <Label>Additional Suggestions</Label>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {result.suggestions.map((suggestion: string, index: number) => (
                        <li key={index}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          {!result ? (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handlePersonalize} disabled={isProcessing || !content}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Personalizing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Personalize
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setResult(null)}>
                Back to Settings
              </Button>
              <Button onClick={handleApply}>
                <Sparkles className="mr-2 h-4 w-4" />
                Apply Changes
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
