import { useCallback } from 'react';

/**
 * Hook para anúncios de acessibilidade
 * @description Hook para anúncios de acessibilidade
 * @returns {Object} Query result with data, isLoading, error, and mutations
 * @example
 * const { data, isLoading } = useAnnounce();
 */
export const useAnnounce = () => {
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const el = document.createElement('div');
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', priority);
    el.setAttribute('aria-atomic', 'true');
    el.className = 'sr-only';
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
  }, []);

  return announce;
};

export type UseAnnounceReturn = ReturnType<typeof useAnnounce>;
