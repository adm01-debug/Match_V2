/**
 * @fileoverview Sentry initialization for frontend error tracking
 * @module lib/sentry
 */
import * as Sentry from '@sentry/react';

let initialized = false;

export function initSentry(): void {
  if (initialized) return;
  const dsn = import.meta.env['VITE_SENTRY_DSN'] as string | undefined;
  if (!dsn) return; // Sentry desativado quando DSN não configurado

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    release: (import.meta.env['VITE_APP_VERSION'] as string | undefined) ?? 'dev',
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: import.meta.env.PROD ? 0.1 : 0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
    ],
    beforeSend(event) {
      // Nunca vazar tokens do Supabase em URLs
      if (event.request?.url) {
        event.request.url = event.request.url.replace(/access_token=[^&]+/g, 'access_token=***');
      }
      return event;
    },
  });
  initialized = true;
}

export function captureException(error: unknown, context?: Record<string, unknown>): void {
  if (!initialized) return;
  Sentry.captureException(error, context ? { extra: context } : undefined);
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'error'): void {
  if (!initialized) return;
  Sentry.captureMessage(message, level);
}

export function setUser(user: { id: string; email?: string } | null): void {
  if (!initialized) return;
  Sentry.setUser(user);
}

export function addBreadcrumb(breadcrumb: {
  category?: string;
  message?: string;
  level?: 'info' | 'warning' | 'error' | 'debug';
  data?: Record<string, unknown>;
}): void {
  if (!initialized) return;
  Sentry.addBreadcrumb({
    category: breadcrumb.category ?? 'app',
    message: breadcrumb.message,
    level: breadcrumb.level ?? 'info',
    data: breadcrumb.data,
    timestamp: Date.now() / 1000,
  });
}

export const isSentryEnabled = (): boolean => initialized;
