/**
 * @module useAnalytics
 * @description Hook para gerenciar analytics e métricas
 */

import { useCallback } from 'react';

type EventCategory = 
  | 'vagas'
  | 'candidatos'
  | 'pipeline'
  | 'entrevistas'
  | 'testes'
  | 'comunicacao'
  | 'navigation'
  | 'user';

interface AnalyticsEvent {
  category: EventCategory;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, unknown>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function sendEvent(_event: AnalyticsEvent): void {
  // Analytics tracking disabled - implement gtag/posthog when needed
}

export function useAnalytics() {
  const trackPageView = useCallback((pageName: string, path?: string) => {
    sendEvent({
      category: 'navigation',
      action: 'page_view',
      label: pageName,
      metadata: { path: path || window.location.pathname },
    });
  }, []);

  const trackEvent = useCallback((event: AnalyticsEvent) => {
    sendEvent(event);
  }, []);

  const trackVaga = useCallback((action: string, vagaId: string, vagaTitulo?: string) => {
    sendEvent({
      category: 'vagas',
      action,
      label: vagaTitulo,
      metadata: { vagaId },
    });
  }, []);

  const trackCandidato = useCallback((action: string, candidatoId: string) => {
    sendEvent({
      category: 'candidatos',
      action,
      metadata: { candidatoId },
    });
  }, []);

  const trackPipeline = useCallback((action: string, etapaOrigem?: string, etapaDestino?: string) => {
    sendEvent({
      category: 'pipeline',
      action,
      metadata: { etapaOrigem, etapaDestino },
    });
  }, []);

  const trackSearch = useCallback((termo: string, resultados: number) => {
    sendEvent({
      category: 'navigation',
      action: 'search',
      label: termo,
      value: resultados,
    });
  }, []);

  const trackError = useCallback((error: Error, context?: string) => {
    sendEvent({
      category: 'user',
      action: 'error',
      label: error.message,
      metadata: { context, stack: error.stack },
    });
  }, []);

  return {
    trackPageView,
    trackEvent,
    trackVaga,
    trackCandidato,
    trackPipeline,
    trackSearch,
    trackError,
  };
}

export default useAnalytics;
