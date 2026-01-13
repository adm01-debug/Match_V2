import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';


// Desabilitar definitivamente o cursor customizado ("bolinha")
// e remover CSS legado caso tenha ficado no cache.
try {
  localStorage.setItem('custom-cursor-enabled', 'false');
} catch {
  // ignore
}

if (typeof document !== 'undefined') {
  document.body.style.cursor = '';
  document.getElementById('custom-cursor-style')?.remove();
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
