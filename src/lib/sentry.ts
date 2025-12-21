// Configuração do Sentry para monitoramento de erros
// Para usar: npm install @sentry/react @sentry/browser

import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

export function initSentry() {
  if (!SENTRY_DSN) {
    console.log('[Sentry] DSN não configurado, monitoramento desabilitado');
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    // Release tracking
    release: `match-ats@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,
    // Ignore errors
    ignoreErrors: [
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      'Non-Error exception captured',
      'Non-Error promise rejection captured',
    ],
    // Before send hook
    beforeSend(event, hint) {
      // Filtrar erros de desenvolvimento
      if (import.meta.env.DEV) {
        console.log('[Sentry] Error captured:', event);
        return null; // Não enviar em dev
      }
      return event;
    },
  });

  console.log('[Sentry] Inicializado com sucesso');
}

// Capturar erro manualmente
export function captureError(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

// Capturar mensagem
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

// Identificar usuário
export function identifyUser(user: { id: string; email?: string; name?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
}

// Limpar usuário (logout)
export function clearUser() {
  Sentry.setUser(null);
}

// Adicionar breadcrumb customizado
export function addBreadcrumb(message: string, category: string, data?: Record<string, unknown>) {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: 'info',
  });
}

// Wrapper para componentes React
export const SentryErrorBoundary = Sentry.ErrorBoundary;

// HOC para profiling
export const withProfiler = Sentry.withProfiler;

export default Sentry;
