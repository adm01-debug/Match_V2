import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initWebVitals } from './lib/webVitals';
import { initSentry } from './lib/sentry';

// Inicializa Sentry o mais cedo possível para capturar erros de boot
initSentry();

// A25 — captura global de erros fora do ciclo React
// Encaminha para logger (que já reenvia para Sentry quando habilitado)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const err = reason instanceof Error ? reason : new Error(
      typeof reason === 'string' ? reason : JSON.stringify(reason ?? 'unknown')
    );
    void import('./services/logger').then(({ logger }) => {
      logger.error('Unhandled promise rejection', err, 'GlobalHandler');
    }).catch(() => undefined);
  });

  window.addEventListener('error', (event) => {
    // Ignora erros de recursos (img/script) — só interessam runtime errors
    if (!(event.error instanceof Error) && !event.message) return;
    const err = event.error instanceof Error ? event.error : new Error(event.message);
    void import('./services/logger').then(({ logger }) => {
      logger.error('Uncaught window error', err, 'GlobalHandler');
    }).catch(() => undefined);
  });
}

// Dev safety: if a Service Worker was previously registered, disable it in non-PROD
// to avoid caching mismatched bundles that can cause React hook crashes.
if (!import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
  });

  // Best-effort cache cleanup (ignore if not available)
  if ('caches' in window) {
    caches.keys().then((keys) => {
      keys
        .filter((k) => k.startsWith('match-ats-'))
        .forEach((k) => caches.delete(k));
    });
  }
}

// Registrar Service Worker para PWA
// Importante: forçar update/skipWaiting para evitar cache antigo causar "tela branca"
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Força checagem de atualização
        registration.update().catch(() => undefined);

        // Se existir SW aguardando, ativa imediatamente
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        // Recarrega quando o novo SW assumir controle
        let reloading = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (reloading) return;
          reloading = true;
          window.location.reload();
        });
      })
      .catch(() => {
        // Service Worker registration failed - app continues normally
      });
  });
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Inicia coleta de Web Vitals após primeiro paint (não bloqueia render)
void initWebVitals();
