/**
 * @module useFocusTrap
 * @description Hook para capturar foco em modais
 * @returns Hook state and methods
 * @example
 * const result = useFocusTrap();
 */
import { useEffect, useRef } from 'react';

/**
 * Hook para trap de foco em modais
 * @description Hook para trap de foco em modais
 * @returns {Object} Query result with data, isLoading, error, and mutations
 * @example
 * const { data, isLoading } = useFocusTrap();
 */
export const useFocusTrap = (isActive: boolean) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [isActive]);

  return containerRef;
};

export type UseFocusTrapReturn = ReturnType<typeof useFocusTrap>;
