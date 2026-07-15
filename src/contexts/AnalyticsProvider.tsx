/**
 * @fileoverview Analytics Provider - wrapper para tracking de analytics
 * @module contexts/AnalyticsProvider
 */

import { logger } from '@/services/logger';
import { ReactNode, createContext, useContext } from 'react';

interface AnalyticsContextType {
  trackEvent: (name: string, data?: Record<string, unknown>) => void;
  trackPageView: (path: string) => void;
}

const noopAnalytics: AnalyticsContextType = {
  trackEvent: () => {},
  trackPageView: () => {},
};

const AnalyticsContext = createContext<AnalyticsContextType>(noopAnalytics);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const trackEvent = (name: string, data?: Record<string, unknown>) => {
    // Integração com analytics pode ser adicionada aqui
    if (import.meta.env.DEV) {
      logger.debug(`[Analytics] Event: ${name}`, data);
    }
  };

  const trackPageView = (path: string) => {
    // Integração com analytics pode ser adicionada aqui
    if (import.meta.env.DEV) {
      logger.debug('[Analytics] Page View:', path);
    }
  };

  return (
    <AnalyticsContext.Provider value={{ trackEvent, trackPageView }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalyticsContext() {
  return useContext(AnalyticsContext);
}

export default AnalyticsProvider;
