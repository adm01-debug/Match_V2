/**
 * @module useReducedMotion
 * @description Hook para detectar preferência de movimento reduzido
 * @returns Hook state and methods
 * @example
 * const result = useReducedMotion();
 */
import { useState, useEffect } from 'react';

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

export type UseReducedMotionReturn = ReturnType<typeof useReducedMotion>;
