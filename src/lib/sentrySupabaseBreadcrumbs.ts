/**
 * @fileoverview A27 — Breadcrumbs de chamadas Supabase (HTTP) para Sentry.
 * Intercepta `window.fetch` e adiciona breadcrumbs de categoria `supabase`
 * (auth, rest, storage, functions, realtime) com método, endpoint compacto,
 * status HTTP e latência. Sanitiza tokens em URLs.
 * @module lib/sentrySupabaseBreadcrumbs
 */
import { addBreadcrumb } from '@/lib/sentry';

let installed = false;

function classify(url: string): { category: string; endpoint: string } | null {
  try {
    const u = new URL(url);
    const p = u.pathname;
    if (p.startsWith('/auth/')) return { category: 'supabase.auth', endpoint: p };
    if (p.startsWith('/rest/')) return { category: 'supabase.rest', endpoint: p.replace(/^\/rest\/v1\//, '') };
    if (p.startsWith('/storage/')) return { category: 'supabase.storage', endpoint: p };
    if (p.startsWith('/functions/')) return { category: 'supabase.functions', endpoint: p.replace(/^\/functions\/v1\//, '') };
    if (p.startsWith('/realtime/')) return { category: 'supabase.realtime', endpoint: p };
    return null;
  } catch {
    return null;
  }
}

function sanitize(url: string): string {
  return url.replace(/access_token=[^&]+/g, 'access_token=***')
            .replace(/apikey=[^&]+/g, 'apikey=***');
}

export function installSupabaseFetchBreadcrumbs(): void {
  if (installed || typeof window === 'undefined') return;
  const supabaseUrl = import.meta.env['VITE_SUPABASE_URL'] as string | undefined;
  if (!supabaseUrl) return;

  const origin = (() => { try { return new URL(supabaseUrl).origin; } catch { return null; } })();
  if (!origin) return;

  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string'
      ? input
      : input instanceof URL
        ? input.toString()
        : input.url;

    if (!url.startsWith(origin)) return originalFetch(input, init);

    const info = classify(url);
    const method = (init?.method || (input instanceof Request ? input.method : 'GET') || 'GET').toUpperCase();
    const start = performance.now();
    try {
      const res = await originalFetch(input, init);
      if (info) {
        addBreadcrumb({
          category: info.category,
          message: `${method} ${info.endpoint} → ${res.status}`,
          level: res.ok ? 'info' : 'warning',
          data: {
            method,
            endpoint: info.endpoint,
            status: res.status,
            duration_ms: Math.round(performance.now() - start),
            url: sanitize(url),
          },
        });
      }
      return res;
    } catch (err) {
      if (info) {
        addBreadcrumb({
          category: info.category,
          message: `${method} ${info.endpoint} → network error`,
          level: 'error',
          data: {
            method,
            endpoint: info.endpoint,
            duration_ms: Math.round(performance.now() - start),
            url: sanitize(url),
            error: err instanceof Error ? err.message : String(err),
          },
        });
      }
      throw err;
    }
  };
  installed = true;
}
