/**
 * Centralized route constants for Match ATS
 * @description All application routes defined in one place
 */

export const ROUTES = {
  // Public
  HOME: '/',
  AUTH: '/auth',
  NOT_FOUND: '*',

  // Dashboard
  DASHBOARD: '/',
  
  // Vagas
  VAGAS: '/vagas',
  VAGA_NOVA: '/vagas/nova',
  VAGA_DETALHES: (id: string) => `/vagas/${id}`,
  VAGA_EDITAR: (id: string) => `/vagas/${id}/editar`,

  // Pipeline
  PIPELINE: '/pipeline',
  
  // Candidatos
  TALENTOS: '/talentos',
  CANDIDATO_PERFIL: (id: string) => `/candidato/${id}`,
  AVALIACAO: (processoId: string) => `/avaliacao/${processoId}`,

  // Testes
  TESTES: '/testes',
  TESTE_NOVO: '/testes/nova',
  TESTE_EDITAR: (id: string) => `/testes/${id}/editar`,
  TESTE_APLICAR: (provaId: string) => `/testes/${provaId}/aplicar`,
  
  // Avaliações Comportamentais
  AVALIACOES_COMPORTAMENTAIS: '/avaliacoes-comportamentais',

  // Agenda
  AGENDA: '/agenda',

  // Comunicação
  COMUNICACAO: '/comunicacao',

  // Indicações
  INDICACOES: '/indicacoes',

  // Relatórios
  RELATORIOS: '/relatorios',
  
  // Analytics Avançado
  ANALYTICS: '/analytics',

  // Admin
  ADMIN: '/admin',

  // Parser
  PARSER_CURRICULO: '/parser-curriculo',
  
  // Gamification
  GAMIFICATION: '/gamification',
  
  // Ofertas
  OFERTAS: '/ofertas',
  
  // Portal Gestor
  GESTOR: '/gestor',
  
  // Diagnóstico
  DIAGNOSTICO: '/diagnostico',
  EDGE_FUNCTIONS_TEST: '/edge-functions-test',

  // Auth Pages
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/auth/reset-password',
  AUTH_2FA: '/auth/2fa',
  
  // Security
  SECURITY_ROLES: '/security/roles',
  SECURITY_RATE_LIMIT: '/security/rate-limit',
  CONFIGURACOES_SEGURANCA: '/configuracoes/seguranca',

  // Portal do Candidato
  PORTAL: {
    HOME: '/portal',
    DASHBOARD: '/portal/dashboard',
    PERFIL: '/portal/perfil',
    VAGAS: '/portal/vagas',
    VAGA_DETALHES: (id: string) => `/portal/vagas?vaga=${id}`,
  },
} as const;

export type RouteKey = keyof typeof ROUTES;
