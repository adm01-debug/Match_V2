// ============================================
// HOOKS INDEX - Exportação centralizada
// ============================================

// Candidatos
export {
  useCandidatos,
  useCandidato,
  useCandidatosStats,
  useCreateCandidato,
  useUpdateCandidato,
  useDeleteCandidato,
  useCandidatosSelect,
  STATUS_CANDIDATO,
  ORIGENS_CANDIDATO,
} from './useCandidatos';

// Vagas
export {
  useVagas,
  useVaga,
  useVagasSelect,
  useVagasUrgentes,
  useCreateVaga,
  useUpdateVaga,
  useDeleteVaga,
} from './useVagas';

// Processos Seletivos
export {
  useProcessos,
  useProcessosCandidato,
} from './useProcessos';

export {
  useProcessosSeletivos,
} from './useProcessosSeletivos';

// Entrevistas
export {
  useEntrevistas,
  useEntrevistasStats,
  useEntrevistasEvolucao,
  useEntrevistasPizza,
  useCreateEntrevista,
  useUpdateEntrevista,
  useCandidatosDisponiveis,
} from './useEntrevistas';

// Provas e Testes
export {
  useProvas,
  useProvasAtivas,
  useProva,
  useCreateProva,
  useUpdateProva,
  useDeleteProva,
  useDuplicateProva,
  useBaterias,
  useProvasStats,
} from './useProvas';

export {
  useQuestoes,
} from './useQuestoes';

export {
  useBateriasProvas,
} from './useBateriasProvas';

export {
  useResultadosProvas,
} from './useResultadosProvas';

// Avaliações
export {
  useAvaliacoes,
  useAvaliacoesProcesso,
  useAvaliacao,
  COMPETENCIAS_TECNICAS,
  COMPETENCIAS_COMPORTAMENTAIS,
  PARECERES,
} from './useAvaliacoes';

// Dashboard
export {
  useDashboard,
} from './useDashboard';

export {
  useDashboardData,
} from './useDashboardData';

// Comunicação
export {
  useComunicacoes,
} from './useComunicacoes';

// Indicações
export {
  useIndicacoes,
} from './useIndicacoes';

// Candidaturas
export {
  useCandidaturas,
} from './useCandidaturas';

// Match Scores
export {
  useMatchScores,
} from './useMatchScores';

// Profiles
export {
  useProfiles,
} from './useProfiles';

// Views
export {
  useViews,
} from './useViews';

// Histórico
export {
  useHistoricoEtapas,
} from './useHistoricoEtapas';

// Candidato Perfil
export {
  useCandidatoPerfil,
} from './useCandidatoPerfil';

// Notifications
export {
  useRealtimeNotifications,
} from './useRealtimeNotifications';

// Analytics
export {
  useAnalytics,
} from './useAnalytics';

// UI Hooks
export { useMobile } from './use-mobile';
export { useToast, toast } from './use-toast';
