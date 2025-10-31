'use client';

/**
 * Translation Panel Component
 * UI for translating document content to different languages
 */

import { useState } from 'react';
import { Languages, Loader2, Check, X } from 'lucide-react';
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
import { useTranslation } from '@/hooks/use-translation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface TranslationPanelProps {
  content: string;
  onTranslated: (translatedContent: string, targetLanguage: string) => void;
  className?: string;
}

export function TranslationPanel({
  content,
  onTranslated,
  className,
}: TranslationPanelProps) {
  const [open, setOpen] = useState(false);
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [sourceLanguage, setSourceLanguage] = useState('auto');
  const [preserveFormatting, setPreserveFormatting] = useState(true);
  const [translatedText, setTranslatedText] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const { translate, isTranslating, error, supportedLanguages } = useTranslation();

  const handleTranslate = async () => {
    if (!content) return;

    try {
      const result = await translate(content, {
        targetLanguage,
        sourceLanguage: sourceLanguage === 'auto' ? undefined : sourceLanguage,
        preserveFormatting,
      });

      setTranslatedText(result.translatedText);
      setShowPreview(true);
    } catch (err) {
      // Error is handled by the hook
      console.error('Translation failed:', err);
    }
  };

  const handleApply = () => {
    if (translatedText) {
      onTranslated(translatedText, targetLanguage);
      setOpen(false);
      setShowPreview(false);
      setTranslatedText('');
    }
  };

  const handleCancel = () => {
    setShowPreview(false);
    setTranslatedText('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Languages className="mr-2 h-4 w-4" />
          Translate
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Translate Document</DialogTitle>
          <DialogDescription>
            Translate your document content to another language using AI-powered translation.
          </DialogDescription>
        </DialogHeader>

        {!showPreview ? (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="source-language">Source Language</Label>
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger id="source-language">
                    <SelectValue placeholder="Select source language" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="auto">Auto-detect</SelectItem>
                    {supportedLanguages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name} ({lang.nativeName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-language">Target Language</Label>
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger id="target-language">
                    <SelectValue placeholder="Select target language" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {supportedLanguages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name} ({lang.nativeName})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="preserve-formatting"
                checked={preserveFormatting}
                onCheckedChange={(checked) => setPreserveFormatting(checked as boolean)}
              />
              <Label
                htmlFor="preserve-formatting"
                className="text-sm font-normal cursor-pointer"
              >
                Preserve formatting (markdown, line breaks, etc.)
              </Label>
            </div>

            <div className="space-y-2">
              <Label>Content Preview</Label>
              <Textarea
                value={content.substring(0, 500) + (content.length > 500 ? '...' : '')}
                readOnly
                className="min-h-[150px] font-mono text-sm"
              />
              {content.length > 500 && (
                <p className="text-xs text-muted-foreground">
                  Showing first 500 characters of {content.length} total
                </p>
              )}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <Alert>
              <Check className="h-4 w-4" />
              <AlertDescription>
                Translation completed successfully! Review the translated content below.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Translated Content</Label>
              <Textarea
                value={translatedText}
                onChange={(e) => setTranslatedText(e.target.value)}
                className="min-h-[300px] font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                You can edit the translation before applying it.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          {!showPreview ? (
            <>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleTranslate} disabled={isTranslating || !content}>
                {isTranslating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Translating...
                  </>
                ) : (
                  'Translate'
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </Button>
              <Button onClick={handleApply}>
                <Check className="mr-2 h-4 w-4" />
                Apply Translation
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
