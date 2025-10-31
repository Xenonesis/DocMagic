'use client';

/**
 * Features Demo Page
 * Demonstrates all 5 new features in action
 */

import { useState } from 'react';
import { Mic, Languages, Wand2, Lightbulb, GitCompare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { VoiceInputButton } from '@/components/ui/voice-input-button';
import { TranslationPanel } from '@/components/ui/translation-panel';
import { PersonalizationPanel } from '@/components/ui/personalization-panel';
import { SmartSuggestionsPanel } from '@/components/ui/smart-suggestions-panel';
import { DocumentComparisonPanel } from '@/components/ui/document-comparison-panel';
import { Badge } from '@/components/ui/badge';
import type { UserPreferences } from '@/lib/personalization-service';

export default function FeaturesPage() {
  const [content, setContent] = useState(
    `Senior Software Engineer with 5 years of experience in full-stack development. 

Skilled in JavaScript, React, Node.js, and cloud technologies. Built scalable applications serving millions of users.

Looking for opportunities to work on challenging projects with innovative teams.`
  );

  const [preferences, setPreferences] = useState<UserPreferences>({
    industry: 'Technology',
    role: 'Senior Software Engineer',
    experienceLevel: 'senior',
    tonePreference: 'professional',
    stylePreference: 'concise',
  });

  const handleVoiceTranscript = (transcript: string) => {
    setContent((prev) => prev + ' ' + transcript);
  };

  const handleTranslated = (translatedContent: string) => {
    setContent(translatedContent);
  };

  const handlePersonalized = (personalizedContent: string) => {
    setContent(personalizedContent);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Advanced Features Demo</h1>
        <p className="text-muted-foreground text-lg">
          Experience our 5 powerful new features for enhanced document creation
        </p>
      </div>

      <div className="grid gap-6 mb-8">
        {/* Feature Overview Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Mic className="h-5 w-5 text-blue-500" />
                <CardTitle className="text-lg">Voice-to-Text</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Dictate content using speech recognition in 23+ languages
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Languages className="h-5 w-5 text-green-500" />
                <CardTitle className="text-lg">Multi-Language</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Translate and localize documents to 25+ languages with AI
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-purple-500" />
                <CardTitle className="text-lg">Personalization</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Adapt tone, style, and content based on industry and preferences
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <CardTitle className="text-lg">Smart Suggestions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Real-time AI recommendations for better wording and structure
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <GitCompare className="h-5 w-5 text-orange-500" />
                <CardTitle className="text-lg">Version Comparison</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Side-by-side comparison of document versions with detailed diff
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Interactive Demo */}
      <Tabs defaultValue="editor" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor">Live Editor</TabsTrigger>
          <TabsTrigger value="suggestions">Smart Suggestions</TabsTrigger>
        </TabsList>

        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Editor</CardTitle>
              <CardDescription>
                Try out voice input, translation, and personalization features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                  placeholder="Start typing or use voice input..."
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <VoiceInputButton
                  onTranscript={handleVoiceTranscript}
                  buttonVariant="default"
                />
                
                <TranslationPanel
                  content={content}
                  onTranslated={handleTranslated}
                />
                
                <PersonalizationPanel
                  content={content}
                  documentType="resume"
                  onPersonalized={handlePersonalized}
                  defaultPreferences={preferences}
                />
                
                <DocumentComparisonPanel
                  originalContent={content}
                  originalLabel="Current Version"
                  modifiedLabel="New Version"
                />
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="secondary">{content.length} characters</Badge>
                <Badge variant="secondary">{content.split(/\s+/).filter(Boolean).length} words</Badge>
                <Badge variant="secondary">{content.split(/\n/).length} lines</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Current Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[400px] font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </div>

            <div>
              <SmartSuggestionsPanel
                content={content}
                documentType="resume"
                preferences={preferences}
                onApplySuggestion={(suggestion) => {
                  console.log('Apply suggestion:', suggestion);
                  // In a real implementation, this would apply the suggestion to the content
                }}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Feature Details */}
      <div className="mt-12 space-y-6">
        <h2 className="text-2xl font-bold">Feature Details</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mic className="h-5 w-5" />
                Voice-to-Text Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Powered by Web Speech API with support for:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>23+ languages and dialects</li>
                <li>Real-time transcription with interim results</li>
                <li>Continuous recording mode</li>
                <li>Automatic punctuation detection</li>
                <li>Confidence scoring</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Languages className="h-5 w-5" />
                Multi-Language Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                AI-powered translation and localization:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>25+ supported languages</li>
                <li>Context-aware translation</li>
                <li>Format preservation (markdown, HTML)</li>
                <li>Batch translation support</li>
                <li>Regional localization</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Content Personalization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Intelligent content adaptation:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Industry-specific optimization</li>
                <li>Tone and style customization</li>
                <li>Experience level adaptation</li>
                <li>Keyword emphasis</li>
                <li>Target audience alignment</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Smart Content Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Real-time AI recommendations:
              </p>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Better wording suggestions</li>
                <li>Industry-specific terminology</li>
                <li>Missing section detection</li>
                <li>Impact scoring and prioritization</li>
                <li>Auto-refresh capability</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="h-5 w-5" />
                Document Comparison Tool
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Advanced diff analysis and comparison:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Side-by-side comparison view</li>
                  <li>Unified diff format</li>
                  <li>Inline highlighting</li>
                  <li>Multiple comparison modes (chars, words, lines)</li>
                </ul>
                <ul className="list-disc list-inside text-sm space-y-1">
                  <li>Detailed statistics (additions, deletions, modifications)</li>
                  <li>Similarity percentage calculation</li>
                  <li>Common section detection</li>
                  <li>Export to .diff format</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
