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

  // Admin
  ADMIN: '/admin',

  // Parser
  PARSER_CURRICULO: '/parser-curriculo',

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
