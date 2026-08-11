/**
 * @fileoverview Configurações do React Query
 * @module queryConfig
 */

export const queryConfig = {
  defaultStaleTime: 5 * 60 * 1000,
  defaultGcTime: 10 * 60 * 1000,
  retryCount: 3,
  retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 30000),
};

export const mutationConfig = {
  retryCount: 2,
  retryDelay: 1000,
};
