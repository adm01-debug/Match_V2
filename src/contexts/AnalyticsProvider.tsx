/**
 * @fileoverview Provider de analytics para tracking
 * @module AnalyticsProvider
 */

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '@/hooks/useAnalytics';

const AnalyticsContext = createContext<ReturnType<typeof useAnalytics> | null>(null);

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const analytics = useAnalytics();

  useEffect(() => {
    const pageName = getPageName(location.pathname);
    analytics.trackPageView(pageName, location.pathname);
  }, [location.pathname, analytics]);

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

  if (routes[pathname]) return routes[pathname];
  if (pathname.startsWith('/vagas/')) return 'Detalhes Vaga';
  if (pathname.startsWith('/candidato/')) return 'Perfil Candidato';
  if (pathname.startsWith('/testes/')) return 'Editor Prova';
  if (pathname.startsWith('/portal/')) return 'Portal Candidato';

  return 'Página Desconhecida';
}

export default AnalyticsProvider;
