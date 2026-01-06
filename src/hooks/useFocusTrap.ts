/**
 * @module useFocusTrap
 * @description Hook para capturar foco em modais/dialogs para acessibilidade
 */
import { useEffect, useRef, useCallback } from 'react';

const FOCUSABLE_SELECTOR = [
  'button:not([disabled]):not([aria-hidden="true"])',
  '[href]:not([aria-hidden="true"])',
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden="true"])',
  'select:not([disabled]):not([aria-hidden="true"])',
  'textarea:not([disabled]):not([aria-hidden="true"])',
  '[tabindex]:not([tabindex="-1"]):not([aria-hidden="true"])',
].join(', ');

interface UseFocusTrapOptions {
  autoFocus?: boolean;
  restoreFocus?: boolean;
  initialFocus?: React.RefObject<HTMLElement>;
}

export const useFocusTrap = (
  isActive: boolean, 
  options: UseFocusTrapOptions = {}
) => {
  const { 
    autoFocus = true, 
    restoreFocus = true,
    initialFocus,
  } = options;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    
    const elements = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    return Array.from(elements).filter(el => {
      const style = getComputedStyle(el);
      return style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             el.offsetParent !== null;
    });
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (e.shiftKey) {
      if (activeElement === firstElement || !containerRef.current?.contains(activeElement)) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (activeElement === lastElement || !containerRef.current?.contains(activeElement)) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }, [getFocusableElements]);

  const handleFocusOut = useCallback((e: FocusEvent) => {
    if (!containerRef.current) return;
    
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    
    if (relatedTarget && !containerRef.current.contains(relatedTarget)) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        e.preventDefault();
        focusableElements[0]?.focus();
      }
    }
  }, [getFocusableElements]);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    
    if (restoreFocus) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }

    container.addEventListener('keydown', handleKeyDown);
    container.addEventListener('focusout', handleFocusOut);

    if (autoFocus) {
      requestAnimationFrame(() => {
        if (initialFocus?.current) {
          initialFocus.current.focus();
        } else {
          const focusableElements = getFocusableElements();
          if (focusableElements.length > 0) {
            focusableElements[0]?.focus();
          } else {
            container.setAttribute('tabindex', '-1');
            container.focus();
          }
        }
      });
    }

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('focusout', handleFocusOut);
      
      if (restoreFocus && previousActiveElement.current) {
        if (document.body.contains(previousActiveElement.current)) {
          previousActiveElement.current.focus();
        }
      }
    };
  }, [isActive, autoFocus, restoreFocus, initialFocus, handleKeyDown, handleFocusOut, getFocusableElements]);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;

    const observer = new MutationObserver(() => {
      const focusableElements = getFocusableElements();
      
      if (!container.contains(document.activeElement)) {
        if (focusableElements.length > 0) {
          focusableElements[0]?.focus();
        }
      }
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'hidden', 'aria-hidden', 'tabindex'],
    });

    return () => observer.disconnect();
  }, [isActive, getFocusableElements]);

  return containerRef;
};

export type UseFocusTrapReturn = ReturnType<typeof useFocusTrap>;

export default useFocusTrap;
