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

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const trackEvent = (name: string, data?: Record<string, unknown>) => {
    // Integração com analytics pode ser adicionada aqui
    if (import.meta.env.DEV) {
      logger.debug('[Analytics] Event:', name, data);
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
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within AnalyticsProvider');
  }
  return context;
}

export default AnalyticsProvider;
