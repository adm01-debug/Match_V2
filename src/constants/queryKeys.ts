/**
 * Centralized React Query keys for Match ATS
 * @description All query keys defined in one place for consistency
 */

export const queryKeys = {
  // Vagas
  vagas: {
    all: ['vagas'] as const,
    lists: () => [...queryKeys.vagas.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.vagas.lists(), filters] as const,
    details: () => [...queryKeys.vagas.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.vagas.details(), id] as const,
  },

  // Candidatos
  candidatos: {
    all: ['candidatos'] as const,
    lists: () => [...queryKeys.candidatos.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.candidatos.lists(), filters] as const,
    details: () => [...queryKeys.candidatos.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.candidatos.details(), id] as const,
    perfil: (id: string) => [...queryKeys.candidatos.all, 'perfil', id] as const,
  },

  // Processos Seletivos
  processos: {
    all: ['processos'] as const,
    lists: () => [...queryKeys.processos.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.processos.lists(), filters] as const,
    details: () => [...queryKeys.processos.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.processos.details(), id] as const,
    byVaga: (vagaId: string) => [...queryKeys.processos.all, 'byVaga', vagaId] as const,
    byCandidato: (candidatoId: string) => [...queryKeys.processos.all, 'byCandidato', candidatoId] as const,
  },

  // Entrevistas
  entrevistas: {
    all: ['entrevistas'] as const,
    lists: () => [...queryKeys.entrevistas.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.entrevistas.lists(), filters] as const,
    details: () => [...queryKeys.entrevistas.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.entrevistas.details(), id] as const,
    hoje: () => [...queryKeys.entrevistas.all, 'hoje'] as const,
  },

  // Avaliações
  avaliacoes: {
    all: ['avaliacoes'] as const,
    byProcesso: (processoId: string) => [...queryKeys.avaliacoes.all, 'byProcesso', processoId] as const,
    byCandidato: (candidatoId: string) => [...queryKeys.avaliacoes.all, 'byCandidato', candidatoId] as const,
  },

  // Provas
  provas: {
    all: ['provas'] as const,
    lists: () => [...queryKeys.provas.all, 'list'] as const,
    list: (filters?: Record<string, unknown>) => [...queryKeys.provas.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.provas.all, 'detail', id] as const,
  },

  // Questões
  questoes: {
    all: ['questoes'] as const,
    byProva: (provaId: string) => [...queryKeys.questoes.all, 'byProva', provaId] as const,
  },

  // Resultados
  resultados: {
    all: ['resultados'] as const,
    byProva: (provaId: string) => [...queryKeys.resultados.all, 'byProva', provaId] as const,
    byCandidato: (candidatoId: string) => [...queryKeys.resultados.all, 'byCandidato', candidatoId] as const,
  },

  // Dashboard
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
    funil: () => [...queryKeys.dashboard.all, 'funil'] as const,
    vagasUrgentes: () => [...queryKeys.dashboard.all, 'vagasUrgentes'] as const,
    topCandidatos: () => [...queryKeys.dashboard.all, 'topCandidatos'] as const,
  },

  // Comunicações
  comunicacoes: {
    all: ['comunicacoes'] as const,
    byCandidato: (candidatoId: string) => [...queryKeys.comunicacoes.all, 'byCandidato', candidatoId] as const,
  },

  // Match Scores
  matchScores: {
    all: ['matchScores'] as const,
    byCandidatoVaga: (candidatoId: string, vagaId: string) => 
      [...queryKeys.matchScores.all, candidatoId, vagaId] as const,
  },

  // Indicações
  indicacoes: {
    all: ['indicacoes'] as const,
    lists: () => [...queryKeys.indicacoes.all, 'list'] as const,
  },

  // Profiles
  profiles: {
    all: ['profiles'] as const,
    me: () => [...queryKeys.profiles.all, 'me'] as const,
  },

  // Views
  views: {
    all: ['views'] as const,
    candidatosPipeline: () => [...queryKeys.views.all, 'candidatosPipeline'] as const,
    candidatosDetalhados: () => [...queryKeys.views.all, 'candidatosDetalhados'] as const,
  },
} as const;

export type QueryKeys = typeof queryKeys;
