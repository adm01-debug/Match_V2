/**
 * @fileoverview Focus Trap Component
 * Traps focus within a container for modals and dialogs
 */

import { useEffect, useRef, ReactNode, useCallback } from "react";

interface FocusTrapProps {
  children: ReactNode;
  active?: boolean;
  returnFocusOnDeactivate?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  onEscape?: () => void;
}

const FOCUSABLE_SELECTORS = [
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'a[href]',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
].join(', ');

export function FocusTrap({
  children,
  active = true,
  returnFocusOnDeactivate = true,
  initialFocusRef,
  onEscape
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];
    return Array.from(
      containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    ).filter(el => el.offsetParent !== null);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!active) return;

    if (event.key === 'Escape' && onEscape) {
      event.preventDefault();
      onEscape();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) return;

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }, [active, getFocusableElements, onEscape]);

  // Store previously focused element and set initial focus
  useEffect(() => {
    if (!active) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement;

    // Set initial focus
    const setInitialFocus = () => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        const focusableElements = getFocusableElements();
        const firstFocusable = focusableElements[0];
        if (firstFocusable) {
          firstFocusable.focus();
        } else {
          containerRef.current?.focus();
        }
      }
    };

    // Small delay to ensure DOM is ready
    const timeoutId = setTimeout(setInitialFocus, 10);

    return () => {
      clearTimeout(timeoutId);
      if (returnFocusOnDeactivate && previouslyFocusedRef.current) {
        previouslyFocusedRef.current.focus();
      }
    };
  }, [active, initialFocusRef, returnFocusOnDeactivate, getFocusableElements]);

  // Add keyboard listener
  useEffect(() => {
    if (!active) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, handleKeyDown]);

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      style={{ outline: 'none' }}
      data-focus-trap
    >
      {children}
    </div>
  );
}

/**
 * Hook for managing focus within a component
 */
export function useFocusManagement() {
  const focusFirst = useCallback((container: HTMLElement | null) => {
    if (!container) return;
    const focusable = container.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
    focusable?.focus();
  }, []);

  const focusLast = useCallback((container: HTMLElement | null) => {
    if (!container) return;
    const focusables = container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
    const last = focusables[focusables.length - 1];
    last?.focus();
  }, []);

  const focusById = useCallback((id: string) => {
    const element = document.getElementById(id);
    element?.focus();
  }, []);

  const moveFocus = useCallback((
    container: HTMLElement | null, 
    direction: 'next' | 'previous'
  ) => {
    if (!container) return;
    
    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
    );
    const currentIndex = focusables.findIndex(el => el === document.activeElement);
    
    if (currentIndex === -1) {
      focusFirst(container);
      return;
    }

    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % focusables.length
      : (currentIndex - 1 + focusables.length) % focusables.length;
    
    focusables[newIndex]?.focus();
  }, [focusFirst]);

  return {
    focusFirst,
    focusLast,
    focusById,
    moveFocus,
  };
}

export default FocusTrap;
