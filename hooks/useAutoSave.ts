import { useEffect, useRef, useCallback, useState } from 'react';

export interface UseAutoSaveOptions {
  debounceMs?: number;
}

/**
 * Generic reusable hook for auto-saving data to localStorage
 *
 * Features:
 * - Accepts a storage key (string) and initial state
 * - Returns [state, setState] tuple
 * - On first mount:
 *   - Checks localStorage for existing data
 *   - If exists, parses and uses it as initial state
 * - On state change:
 *   - Automatically saves updated value to localStorage
 * - Uses JSON safely
 * - Handles SSR (typeof window check)
 * - Doesn't crash if JSON parse fails
 * - Debounces saves to prevent excessive writes
 *
 * @param storageKey - The key to use in localStorage
 * @param initialState - The default value if no saved data exists
 * @param options - Configuration options (debounceMs)
 *
 * @returns Tuple of [state, setState]
 *
 * Example:
 * ```tsx
 * const [data, setData] = useAutoSave('myDraft', defaultData, { debounceMs: 500 });
 * ```
 */
export function useAutoSave<T>(
  storageKey: string,
  initialState: T,
  options: UseAutoSaveOptions = {}
): [T, (value: T | ((prev: T) => T)) => void] {
  const { debounceMs = 1000 } = options;
  
  // State for storing the actual value and tracking if we've initialized
  const [state, setState] = useState<T>(initialState);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // Initialize state from localStorage on mount
  useEffect(() => {
    if (isInitializedRef.current) return;
    if (typeof window === 'undefined') return;

    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData) as T;
        setState(parsed);
      }
    } catch (error) {
      // Silently fail - JSON parse error or localStorage access error
      console.warn(`Failed to load autosave for key "${storageKey}":`, error);
    }

    isInitializedRef.current = true;
  }, [storageKey]);

  // Save function with debouncing
  const saveToLocalStorage = useCallback((valueToSave: T) => {
    if (typeof window === 'undefined') return;

    // Clear existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new debounce timer
    debounceTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(valueToSave));
      } catch (error) {
        // Silently fail - localStorage might be disabled or full
        console.warn(`Failed to save autosave for key "${storageKey}":`, error);
      }
    }, debounceMs);
  }, [storageKey, debounceMs]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Create a custom setState that saves to localStorage
  const setStateWithAutoSave = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prevState) => {
        const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prevState) : value;
        saveToLocalStorage(newValue);
        return newValue;
      });
    },
    [saveToLocalStorage]
  );

  return [state, setStateWithAutoSave];
}
