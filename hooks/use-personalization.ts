/**
 * React Hook for Content Personalization
 */

import { useState, useCallback } from 'react';
import {
  personalizationService,
  type UserPreferences,
  type PersonalizationOptions,
  type PersonalizationResult,
  type ContentSuggestion,
} from '@/lib/personalization-service';

interface UsePersonalizationReturn {
  personalize: (content: string, options: PersonalizationOptions) => Promise<PersonalizationResult>;
  generateSuggestions: (content: string, options: PersonalizationOptions) => Promise<ContentSuggestion[]>;
  adaptTone: (content: string, preferences: UserPreferences) => Promise<{ adaptedContent: string; changes: string[] }>;
  optimizeForIndustry: (content: string, industry: string, role?: string) => Promise<{ optimizedContent: string; industryTerms: string[]; improvements: string[] }>;
  isProcessing: boolean;
  error: string | null;
  commonIndustries: string[];
  toneOptions: ReturnType<typeof personalizationService.getToneOptions>;
  styleOptions: ReturnType<typeof personalizationService.getStyleOptions>;
}

export function usePersonalization(): UsePersonalizationReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const personalize = useCallback(async (content: string, options: PersonalizationOptions) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await personalizationService.personalizeContent(content, options);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Personalization failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const generateSuggestions = useCallback(async (content: string, options: PersonalizationOptions) => {
    setIsProcessing(true);
    setError(null);

    try {
      const suggestions = await personalizationService.generateSuggestions(content, options);
      return suggestions;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Suggestion generation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const adaptTone = useCallback(async (content: string, preferences: UserPreferences) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await personalizationService.adaptToneAndStyle(content, preferences);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Tone adaptation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const optimizeForIndustry = useCallback(async (content: string, industry: string, role?: string) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await personalizationService.optimizeForIndustry(content, industry, role);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Industry optimization failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    personalize,
    generateSuggestions,
    adaptTone,
    optimizeForIndustry,
    isProcessing,
    error,
    commonIndustries: personalizationService.getCommonIndustries(),
    toneOptions: personalizationService.getToneOptions(),
    styleOptions: personalizationService.getStyleOptions(),
  };
}
