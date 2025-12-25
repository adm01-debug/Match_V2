/**
 * @fileoverview Provider de analytics para tracking
 * @module AnalyticsProvider
 */

import React, { createContext, useContext, useEffect, ReactNode , useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';

interface AnalyticsContextType {
  trackPageView: (pageName: string, path?: string) => void;
  trackEvent: (event: {
    category: string;
    action: string;
    label?: string;
    value?: number;
  }) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const analytics = useAnalytics();

  // Track page views automaticamente
  useEffect(() => {
    const pageName = getPageName(location.pathname);
    analytics.trackPageView(pageName, location.pathname);
  }, [location.pathname]);

  return (
    <AnalyticsContext.Provider value={analytics}>
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

// Helper para extrair nome da página da rota
function getPageName(pathname: string): string {
  const routes: Record<string, string> = {
    '/': 'Dashboard',
    '/vagas': 'Vagas',
    '/pipeline': 'Pipeline',
    '/talentos': 'Candidatos',
    '/testes': 'Testes',
    '/agenda': 'Agenda',
    '/comunicacao': 'Comunicação',
    '/relatorios': 'Relatórios',
    '/indicacoes': 'Indicações',
    '/admin': 'Administração',
    '/auth': 'Login',
    '/portal': 'Portal Candidato',
  };

  // Verificar rotas exatas
  if (routes[pathname]) return routes[pathname];

  // Verificar rotas com parâmetros
  if (pathname.startsWith('/vagas/')) return 'Detalhes Vaga';
  if (pathname.startsWith('/candidato/')) return 'Perfil Candidato';
  if (pathname.startsWith('/testes/')) return 'Editor Prova';
  if (pathname.startsWith('/portal/')) return 'Portal Candidato';

  return 'Página Desconhecida';
}

export default AnalyticsProvider;

AnalyticsProvider.displayName = 'AnalyticsProvider';
