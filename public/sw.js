// Service Worker - Match ATS
// Nota: versão do cache incrementada para evitar "tela branca" por assets antigos.
const CACHE_VERSION = 'v2';
const STATIC_CACHE = `match-ats-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `match-ats-dynamic-${CACHE_VERSION}`;

// Arquivos essenciais para offline fallback
const STATIC_ASSETS = ['/', '/index.html', '/manifest.json', '/favicon.svg', '/favicon.ico'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      // console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Permite que o cliente force atualização imediata do SW
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.origin !== location.origin) return;

  // Navegações (SPA): sempre tentar rede primeiro para evitar HTML/JS desatualizado.
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request));
    return;
  }

  // Assets buildados (hash): cache-first é ok; mas sempre revalida em segundo plano.
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  // Demais recursos locais: cache-first conservador.
  event.respondWith(cacheFirst(request));
});

async function networkFirst(request) {
  try {
    const response = await fetch(request);
    // Só cacheia respostas OK e documentos
    if (response && response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (_error) {
    const cached = await caches.match(request);
    if (cached) return cached;

    // Fallback para app shell
    const fallback = await caches.match('/index.html');
    return fallback || new Response('Offline', { status: 503 });
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (_error) {
    return new Response('Offline', { status: 503 });
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request)
    .then(async (response) => {
      if (response && response.ok) {
        const cache = await caches.open(STATIC_CACHE);
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  return cached || (await fetchPromise) || new Response('Offline', { status: 503 });
}

// Background Sync para operações offline
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // console.log('[SW] Syncing data...');
  // Implementar sincronização de dados offline
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};
  const options = {
    body: data.body || 'Nova notificação',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [200, 100, 200],
    data: data.url || '/',
  };

  event.waitUntil(self.registration.showNotification(data.title || 'Match ATS', options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data));
});

