/**
 * @module useFocusTrap
 * @description Hook para capturar foco em modais/dialogs para acessibilidade
 * @example
 * const containerRef = useFocusTrap(isOpen);
 * return <div ref={containerRef}>...</div>;
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
  /** Foco inicial no primeiro elemento (padrão: true) */
  autoFocus?: boolean;
  /** Restaurar foco no elemento anterior quando desativar (padrão: true) */
  restoreFocus?: boolean;
  /** Elemento específico para focar inicialmente */
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

  // Obter elementos focáveis
  const getFocusableElements = useCallback((): HTMLElement[] => {
    if (!containerRef.current) return [];
    
    const elements = containerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
    return Array.from(elements).filter(el => {
      // Verificar se elemento está visível
      const style = getComputedStyle(el);
      return style.display !== 'none' && 
             style.visibility !== 'hidden' && 
             el.offsetParent !== null;
    });
  }, []);

  // Handler de teclado
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement;

    if (e.shiftKey) {
      // Shift+Tab: ir para trás
      if (activeElement === firstElement || !containerRef.current?.contains(activeElement)) {
        e.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab: ir para frente
      if (activeElement === lastElement || !containerRef.current?.contains(activeElement)) {
        e.preventDefault();
        firstElement?.focus();
      }
    }
  }, [getFocusableElements]);

  // Handler para cliques fora
  const handleFocusOut = useCallback((e: FocusEvent) => {
    if (!containerRef.current) return;
    
    const relatedTarget = e.relatedTarget as HTMLElement | null;
    
    // Se o foco está saindo do container, trazer de volta
    if (relatedTarget && !containerRef.current.contains(relatedTarget)) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length > 0) {
        e.preventDefault();
        focusableElements[0].focus();
      }
    }
  }, [getFocusableElements]);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    
    // Salvar elemento ativo anterior
    if (restoreFocus) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }

    // Adicionar handlers
    container.addEventListener('keydown', handleKeyDown);
    container.addEventListener('focusout', handleFocusOut);

    // Focar elemento inicial
    if (autoFocus) {
      // Aguardar um frame para elementos serem renderizados
      requestAnimationFrame(() => {
        if (initialFocus?.current) {
          initialFocus.current.focus();
        } else {
          const focusableElements = getFocusableElements();
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          } else {
            // Se não há elementos focáveis, focar o container
            container.setAttribute('tabindex', '-1');
            container.focus();
          }
        }
      });
    }

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      container.removeEventListener('focusout', handleFocusOut);
      
      // Restaurar foco anterior
      if (restoreFocus && previousActiveElement.current) {
        // Verificar se elemento ainda existe e está no DOM
        if (document.body.contains(previousActiveElement.current)) {
          previousActiveElement.current.focus();
        }
      }
    };
  }, [isActive, autoFocus, restoreFocus, initialFocus, handleKeyDown, handleFocusOut, getFocusableElements]);

  // Observer para detectar mudanças no conteúdo
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const observer = new MutationObserver(() => {
      // Recalcular elementos quando DOM muda
      const focusableElements = getFocusableElements();
      
      // Se elemento ativo foi removido, focar primeiro disponível
      if (!containerRef.current?.contains(document.activeElement)) {
        if (focusableElements.length > 0) {
          focusableElements[0].focus();
        }
      }
    });

    observer.observe(containerRef.current, {
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
