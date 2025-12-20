// Hook de Analytics
// Pode ser integrado com Google Analytics, PostHog, Mixpanel, etc.

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

// Provider type (pode ser expandido)
type AnalyticsProvider = 'console' | 'gtag' | 'posthog';

const PROVIDER: AnalyticsProvider = 'console'; // Mudar para 'gtag' em produção

/**
 * Envia evento para o provider de analytics
 */
function sendEvent(event: AnalyticsEvent): void {
  const { category, action, label, value, metadata } = event;

  switch (PROVIDER) {
    case 'gtag':
      // Google Analytics 4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', action, {
          event_category: category,
          event_label: label,
          value,
          ...metadata,
        });
      }
      break;

    case 'posthog':
      // PostHog
      if (typeof window !== 'undefined' && (window as any).posthog) {
        (window as any).posthog.capture(action, {
          category,
          label,
          value,
          ...metadata,
        });
      }
      break;

    case 'console':
    default:
      // Development - log no console
      if (process.env.NODE_ENV === 'development') {
        console.log('[Analytics]', { category, action, label, value, metadata });
      }
  }
}

/**
 * Hook para tracking de analytics
 */
export function useAnalytics() {
  // Track de página vista
  const trackPageView = useCallback((pageName: string, path?: string) => {
    sendEvent({
      category: 'navigation',
      action: 'page_view',
      label: pageName,
      metadata: { path: path || window.location.pathname },
    });
  }, []);

  // Track de eventos genéricos
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    sendEvent(event);
  }, []);

  // Track de vaga
  const trackVaga = useCallback((action: string, vagaId: string, vagaTitulo?: string) => {
    sendEvent({
      category: 'vagas',
      action,
      label: vagaTitulo,
      metadata: { vagaId },
    });
  }, []);

  // Track de candidato
  const trackCandidato = useCallback((action: string, candidatoId: string) => {
    sendEvent({
      category: 'candidatos',
      action,
      metadata: { candidatoId },
    });
  }, []);

  // Track de pipeline
  const trackPipeline = useCallback((action: string, etapaOrigem?: string, etapaDestino?: string) => {
    sendEvent({
      category: 'pipeline',
      action,
      metadata: { etapaOrigem, etapaDestino },
    });
  }, []);

  // Track de busca
  const trackSearch = useCallback((termo: string, resultados: number) => {
    sendEvent({
      category: 'navigation',
      action: 'search',
      label: termo,
      value: resultados,
    });
  }, []);

  // Track de erro
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
