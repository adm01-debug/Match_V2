/**
 * @fileoverview Form Auto-Save Hook
 * Provides auto-save functionality for forms with debouncing and status tracking
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { useDebounce } from "./useDebounce";

type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseFormAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
  onError?: (error: Error) => void;
  onSuccess?: () => void;
}

interface UseFormAutoSaveReturn {
  status: AutoSaveStatus;
  lastSavedAt: Date | null;
  save: () => Promise<void>;
  isPending: boolean;
  error: Error | null;
}

export function useFormAutoSave<T>({
  data,
  onSave,
  debounceMs = 2000,
  enabled = true,
  onError,
  onSuccess
}: UseFormAutoSaveOptions<T>): UseFormAutoSaveReturn {
  const [status, setStatus] = useState<AutoSaveStatus>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  const debouncedData = useDebounce(data, debounceMs);
  const initialDataRef = useRef<T>(data);
  const lastSavedDataRef = useRef<string>('');
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const save = useCallback(async () => {
    const currentDataString = JSON.stringify(data);
    
    // Skip if data hasn't changed
    if (currentDataString === lastSavedDataRef.current) {
      return;
    }

    if (!isMountedRef.current) return;
    
    setStatus('saving');
    setError(null);

    try {
      await onSave(data);
      
      if (!isMountedRef.current) return;
      
      lastSavedDataRef.current = currentDataString;
      setStatus('saved');
      setLastSavedAt(new Date());
      onSuccess?.();

      // Reset to idle after showing saved state
      setTimeout(() => {
        if (isMountedRef.current) {
          setStatus('idle');
        }
      }, 2000);
    } catch (err) {
      if (!isMountedRef.current) return;
      
      const error = err instanceof Error ? err : new Error('Auto-save failed');
      setError(error);
      setStatus('error');
      onError?.(error);
    }
  }, [data, onSave, onError, onSuccess]);

  // Auto-save when debounced data changes
  useEffect(() => {
    if (!enabled) return;

    const currentDataString = JSON.stringify(debouncedData);
    const initialDataString = JSON.stringify(initialDataRef.current);
    
    // Don't save if data matches initial state (first render)
    if (currentDataString === initialDataString && !lastSavedAt) {
      return;
    }

    // Don't save if data hasn't changed since last save
    if (currentDataString === lastSavedDataRef.current) {
      return;
    }

    save();
  }, [debouncedData, enabled, save, lastSavedAt]);

  return {
    status,
    lastSavedAt,
    save,
    isPending: status === 'saving',
    error
  };
}

/**
 * Hook for tracking form dirty state
 */
export function useFormDirtyState<T>(currentData: T, initialData: T) {
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const current = JSON.stringify(currentData);
    const initial = JSON.stringify(initialData);
    setIsDirty(current !== initial);
  }, [currentData, initialData]);

  return isDirty;
}

/**
 * Hook for form submission with loading and error states
 */
export function useFormSubmit<T>() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = useCallback(async (
    submitFn: () => Promise<T>,
    options?: {
      onSuccess?: (result: T) => void;
      onError?: (error: Error) => void;
    }
  ) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setIsSuccess(false);

    try {
      const result = await submitFn();
      setIsSuccess(true);
      options?.onSuccess?.(result);
      
      // Reset success state after delay
      setTimeout(() => setIsSuccess(false), 3000);
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Submission failed');
      setSubmitError(error);
      options?.onError?.(error);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setSubmitError(null);
    setIsSuccess(false);
  }, []);

  return {
    isSubmitting,
    submitError,
    isSuccess,
    handleSubmit,
    reset
  };
}

export default useFormAutoSave;
