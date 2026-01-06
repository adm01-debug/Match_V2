/**
 * @fileoverview Configuração do Sentry para monitoramento
 * @module sentry
 */

import type { ReactNode, ComponentType } from 'react';

// Sentry é opcional - funciona mesmo sem estar configurado
const SENTRY_DSN = import.meta.env['VITE_SENTRY_DSN'] as string | undefined;
const IS_DEV = import.meta.env.DEV;

let initialized = false;

export interface SentryConfig {
  dsn?: string;
  environment?: string;
  release?: string;
}

export function initSentry(_config?: SentryConfig): void {
  if (initialized) return;
  initialized = true;
  
  if (!SENTRY_DSN) {
    // Sentry not configured
    return;
  }
  
  // TODO: Implementar integração real com Sentry quando necessário
  // import * as Sentry from '@sentry/react';
  // Sentry.init({ dsn: SENTRY_DSN, ... });
}

export function captureError(error: Error | string | null | undefined, context?: Record<string, unknown>): void {
  void context;
  if (IS_DEV && error) {
    // Dev logging only
  }
  // TODO: Sentry.captureException(error, { extra: context });
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info'): void {
  if (IS_DEV) {
    const logMethod = level === 'error' ? 'error' : level === 'warning' ? 'warn' : 'log';
    console[logMethod](`[Sentry ${level}]`, message);
  }
  // TODO: Sentry.captureMessage(message, level);
}

export function setUser(user: { id: string; email?: string; name?: string }): void {
  // TODO: Sentry.setUser(user);
  void user;
}

export function identifyUser(user: { id: string; email?: string; name?: string }): void {
  // Alias for setUser
  setUser(user);
}

export function clearUser(): void {
  // TODO: Sentry.setUser(null);
}

export function addBreadcrumb(
  message: string, 
  category: string, 
  data?: Record<string, unknown>
): void {
  // TODO: Sentry.addBreadcrumb({ message, category, data });
  void message;
  void category;
  void data;
}

// Placeholder ErrorBoundary - usa o componente React padrão
export function SentryErrorBoundary({ children }: { children: ReactNode }): ReactNode {
  return children;
}

// Placeholder HOC - retorna o componente sem modificação
export function withProfiler<P extends object>(
  Component: ComponentType<P>
): ComponentType<P> {
  return Component;
}

export default {
  initSentry,
  captureError,
  captureMessage,
  identifyUser,
  setUser,
  clearUser,
  addBreadcrumb,
};
