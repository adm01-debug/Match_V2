/**
 * @fileoverview Centralized exports for all data modules
 * @module data
 */

// Agenda data and types
export {
  type AgendaTipoEntrevista,
  type AgendaStatusEntrevista,
  type TipoEntrevista,
  type StatusEntrevista,
  type Entrevistador,
  type Entrevista,
  type EntrevistaFeedback,
  type Local,
  tipoConfig,
  statusConfig,
  statusStyles,
  entrevistadoresDisponiveis,
  locaisDisponiveis,
  mockEntrevistas,
  getStatusStyle,
  getTipoStyle,
  formatDuration,
  parseTimeString,
} from './agendaData';

// Avaliacao data
export {
  type Competencia,
  competencias,
  notasDescricao,
} from './avaliacaoData';

// Behavioral assessments data
export {
  discQuestions,
  vakdQuestions,
  metaprogramsQuestions,
  mentalTriggersQuestions,
  sleightOfMouthQuestions,
  emotionalStatesQuestions,
  valuesQuestions,
  emotionalIntelligenceQuestions,
  cognitiveBiasesQuestions,
  rapportQuestions,
  getQuestionsForTool,
} from './behavioralAssessmentsData';

// Candidato perfil data
export {
  type ArquivoAnexo,
  type CandidatoPerfil,
  emptyCandidatoPerfil,
  mockCandidatoPerfil,
} from './candidatoPerfilData';

// Email templates data
export {
  type EmailTemplate,
  type VariavelDisponivel,
  emailTemplatesMock,
  variaveisDisponiveis,
} from './emailTemplatesData';
