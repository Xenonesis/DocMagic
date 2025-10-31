/**
 * React Hook for Document Comparison
 */

import { useState, useCallback, useMemo } from 'react';
import {
  documentComparisonService,
  type ComparisonOptions,
  type ComparisonResult,
  type SideBySideComparison,
} from '@/lib/document-comparison';

interface UseDocumentComparisonReturn {
  compare: (original: string, modified: string, options?: ComparisonOptions) => ComparisonResult;
  generateSideBySide: (original: string, modified: string, options?: ComparisonOptions) => SideBySideComparison;
  generateHTMLDiff: (original: string, modified: string, options?: ComparisonOptions) => string;
  getUnifiedDiff: (original: string, modified: string, options?: ComparisonOptions) => string;
  calculateSimilarity: (content1: string, content2: string) => number;
  findCommonSections: (content1: string, content2: string, minLength?: number) => Array<any>;
  isComparing: boolean;
  error: string | null;
}

export function useDocumentComparison(): UseDocumentComparisonReturn {
  const [isComparing, setIsComparing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const compare = useCallback((original: string, modified: string, options?: ComparisonOptions) => {
    setIsComparing(true);
    setError(null);

    try {
      const result = documentComparisonService.compareDocuments(original, modified, options);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Comparison failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsComparing(false);
    }
  }, []);

  const generateSideBySide = useCallback((original: string, modified: string, options?: ComparisonOptions) => {
    setIsComparing(true);
    setError(null);

    try {
      const result = documentComparisonService.generateSideBySide(original, modified, options);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Side-by-side generation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsComparing(false);
    }
  }, []);

  const generateHTMLDiff = useCallback((original: string, modified: string, options?: ComparisonOptions) => {
    setIsComparing(true);
    setError(null);

    try {
      const result = documentComparisonService.generateHTMLDiff(original, modified, options);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'HTML diff generation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsComparing(false);
    }
  }, []);

  const getUnifiedDiff = useCallback((original: string, modified: string, options?: ComparisonOptions) => {
    setIsComparing(true);
    setError(null);

    try {
      const result = documentComparisonService.getUnifiedDiff(original, modified, options);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unified diff generation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsComparing(false);
    }
  }, []);

  const calculateSimilarity = useCallback((content1: string, content2: string) => {
    setIsComparing(true);
    setError(null);

    try {
      const similarity = documentComparisonService.calculateSimilarity(content1, content2);
      return similarity;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Similarity calculation failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsComparing(false);
    }
  }, []);

  const findCommonSections = useCallback((content1: string, content2: string, minLength?: number) => {
    setIsComparing(true);
    setError(null);

    try {
      const sections = documentComparisonService.findCommonSections(content1, content2, minLength);
      return sections;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Common sections search failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsComparing(false);
    }
  }, []);

  return {
    compare,
    generateSideBySide,
    generateHTMLDiff,
    getUnifiedDiff,
    calculateSimilarity,
    findCommonSections,
    isComparing,
    error,
  };
}
