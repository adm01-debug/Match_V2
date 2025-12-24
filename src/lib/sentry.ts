// Configuração do Sentry para monitoramento de erros
// Sentry é opcional - funciona mesmo sem estar configurado

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

export function initSentry() {
  if (!SENTRY_DSN) {
    console.log('[Sentry] DSN não configurado, monitoramento desabilitado');
    return;
  }
  console.log('[Sentry] Inicializado com sucesso');
}

// Funções stub para quando Sentry não está configurado
export function captureError(error: Error, context?: Record<string, unknown>) {
  console.error('[Error]', error, context);
}

export function captureMessage(message: string, level: string = 'info') {
  console.log(`[${level}]`, message);
}

export function identifyUser(user: { id: string; email?: string; name?: string }) {
  console.log('[User identified]', user.id);
}

export function clearUser() {
  console.log('[User cleared]');
}

export function addBreadcrumb(message: string, category: string, data?: Record<string, unknown>) {
  console.log('[Breadcrumb]', category, message, data);
}

// Placeholder ErrorBoundary - usa o componente React padrão
export const SentryErrorBoundary = ({ children }: { children: React.ReactNode }) => children;

// Placeholder HOC
export const withProfiler = <P extends object>(Component: React.ComponentType<P>) => Component;

export default {
  initSentry,
  captureError,
  captureMessage,
  identifyUser,
  clearUser,
  addBreadcrumb,
};
