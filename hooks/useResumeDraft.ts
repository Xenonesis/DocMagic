import { useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

const DRAFT_STORAGE_KEY = 'resumeDraft';
const DRAFT_TIMESTAMP_KEY = 'resumeDraftTimestamp';

export interface UseResumeDraftOptions {
  showNotifications?: boolean;
  debounceMs?: number;
}

/**
 * Custom hook to manage resume draft auto-save persistence using localStorage
 *
 * Features:
 * - Automatically saves resume data to localStorage on every change
 * - Loads draft from localStorage on component mount
 * - Shows toast notification when draft is restored
 * - Provides method to clear draft after successful submission
 * - SSR-safe with window check
 *
 * @param data - The resume data to persist
 * @param onDataChange - Callback to set the restored data
 * @param options - Configuration options
 *
 * @returns Object with methods: clearDraft, restoreDraft, hasDraft
 *
 * Example:
 * const { clearDraft, hasDraft } = useResumeDraft(resumeData, setResumeData);
 */
export function useResumeDraft<T>(
  data: T | null | undefined,
  onDataChange: (data: T) => void,
  options: UseResumeDraftOptions = {}
) {
  const { showNotifications = true, debounceMs = 1000 } = options;
  const { toast } = useToast();

  // Store debounce timer
  let debounceTimer: NodeJS.Timeout | null = null;

  /**
   * Check if draft exists in localStorage
   */
  const hasDraft = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;

    try {
      return localStorage.getItem(DRAFT_STORAGE_KEY) !== null;
    } catch {
      // localStorage might be disabled or full
      return false;
    }
  }, []);

  /**
   * Load draft from localStorage and restore it to state
   */
  const restoreDraft = useCallback((): T | null => {
    if (typeof window === 'undefined') return null;

    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!savedDraft) return null;

      const parsedDraft = JSON.parse(savedDraft) as T;

      if (showNotifications) {
        toast({
          title: '✨ Draft Restored',
          description: 'Your resume draft has been restored from your last session.',
        });
      }

      return parsedDraft;
    } catch (error) {
      console.error('Error restoring draft:', error);
      return null;
    }
  }, [showNotifications, toast]);

  /**
   * Save data to localStorage with debouncing
   */
  const saveDraft = useCallback((dataToSave: T) => {
    if (typeof window === 'undefined') return;

    // Clear existing debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set new debounce timer
    debounceTimer = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(dataToSave));
        localStorage.setItem(DRAFT_TIMESTAMP_KEY, new Date().toISOString());
      } catch (error) {
        console.error('Error saving draft:', error);
        // Silently fail - don't interrupt user experience
      }
    }, debounceMs);
  }, [debounceMs]);

  /**
   * Clear draft from localStorage (call after successful submission)
   */
  const clearDraft = useCallback((): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
    } catch (error) {
      console.error('Error clearing draft:', error);
    }
  }, []);

  /**
   * Load draft on component mount
   */
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Attempt to restore draft on mount (always try)
    const draft = restoreDraft();
    if (draft) {
      onDataChange(draft);
    }
  }, []); // Empty dependency array - run once on mount

  /**
   * Auto-save on data change
   */
  useEffect(() => {
    if (data) {
      saveDraft(data);
    }
  }, [data, saveDraft]);

  return {
    clearDraft,
    restoreDraft,
    hasDraft,
  };
}
