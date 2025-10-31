/**
 * React Hook for Translation and Localization
 */

import { useState, useCallback } from 'react';
import {
  translationService,
  type TranslationOptions,
  type TranslationResult,
  type LocalizationOptions,
  type LanguageCode,
} from '@/lib/translation-service';

interface UseTranslationReturn {
  translate: (text: string, options: TranslationOptions) => Promise<TranslationResult>;
  translateBatch: (texts: string[], options: TranslationOptions) => Promise<TranslationResult[]>;
  localize: (content: Record<string, any>, options: LocalizationOptions) => Promise<Record<string, any>>;
  detectLanguage: (text: string) => Promise<{ language: string; confidence: number }>;
  isTranslating: boolean;
  error: string | null;
  supportedLanguages: typeof translationService.getSupportedLanguages extends () => infer R ? R : never;
}

export function useTranslation(): UseTranslationReturn {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translate = useCallback(async (text: string, options: TranslationOptions) => {
    setIsTranslating(true);
    setError(null);

    try {
      const result = await translationService.translateText(text, options);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Translation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const translateBatch = useCallback(async (texts: string[], options: TranslationOptions) => {
    setIsTranslating(true);
    setError(null);

    try {
      const results = await translationService.translateBatch(texts, options);
      return results;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Batch translation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const localize = useCallback(async (content: Record<string, any>, options: LocalizationOptions) => {
    setIsTranslating(true);
    setError(null);

    try {
      const result = await translationService.localizeContent(content, options);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Localization failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  const detectLanguage = useCallback(async (text: string) => {
    setIsTranslating(true);
    setError(null);

    try {
      const result = await translationService.detectLanguage(text);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Language detection failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsTranslating(false);
    }
  }, []);

  return {
    translate,
    translateBatch,
    localize,
    detectLanguage,
    isTranslating,
    error,
    supportedLanguages: translationService.getSupportedLanguages(),
  };
}
