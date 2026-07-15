/**
 * @fileoverview A26 — Enriquece breadcrumbs do Sentry com eventos de navegação
 * do React Router, permitindo reconstituir a jornada do usuário até o crash.
 * @module components/common/SentryRouteBreadcrumbs
 */
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { addBreadcrumb } from '@/lib/sentry';

export function SentryRouteBreadcrumbs(): null {
  const location = useLocation();
  const previous = useRef<string | null>(null);

  useEffect(() => {
    const to = `${location.pathname}${location.search}`;
    const from = previous.current;
    addBreadcrumb({
      category: 'navigation',
      message: from ? `${from} → ${to}` : `entered ${to}`,
      level: 'info',
      data: {
        from: from ?? undefined,
        to,
        hash: location.hash || undefined,
      },
    });
    previous.current = to;
  }, [location.pathname, location.search, location.hash]);

  return null;
}
