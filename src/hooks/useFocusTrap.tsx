/**
 * Focus Trap Hook
 * Traps keyboard focus within a container for accessibility
 */
import { useEffect, useRef, useCallback } from 'react';

interface UseFocusTrapOptions {
  enabled?: boolean;
  initialFocus?: boolean;
  returnFocus?: boolean;
}

export function useFocusTrap<T extends HTMLElement>({
  enabled = true,
  initialFocus = true,
  returnFocus = true,
}: UseFocusTrapOptions = {}) {
  const containerRef = useRef<T>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(focusableSelectors)
    ).filter(el => el.offsetParent !== null); // Only visible elements
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!enabled || e.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (e.shiftKey) {
      // Shift + Tab: go backwards
      if (activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab: go forwards
      if (activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }, [enabled, getFocusableElements]);

  useEffect(() => {
    if (!enabled) return;

    // Store current focus
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Set initial focus
    if (initialFocus) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        // Try to find autofocus element first
        const autofocusElement = focusableElements.find(
          el => el.hasAttribute('autofocus') || el.hasAttribute('data-autofocus')
        );
        (autofocusElement || focusableElements[0])?.focus();
      }
    }

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);

      // Return focus on unmount
      if (returnFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [enabled, initialFocus, returnFocus, handleKeyDown, getFocusableElements]);

  return { containerRef, getFocusableElements };
}

export default useFocusTrap;
