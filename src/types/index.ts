/**
 * @fileoverview Main type exports for Match ATS
 * @module types
 */

export * from './recruitment';
// Exclude Prova from tests to avoid duplicate export
export { 
  type NivelCargo,
  type CategoriaProva,
  type Departamento,
  type Questao,
  type ResultadoProva,
  type BateriaProvas
} from './tests';
export * from './api';
export * from './forms';
// Selection types - exclude Competencia to avoid conflict with recruitment
export { 
  type ValorCultural,
  type PerfilCargo,
  type CriterioSelecao,
  type PerfilValor,
  type TipoAssessment,
  type TipoQuestaoAssessment,
  type Assessment,
  type AssessmentQuestao,
  type AssessmentOpcao,
  type AssessmentResposta,
  type DISCResultado,
  type CulturalResultado,
  type TemplateEntrevista,
  type TemplatePergunta,
  type EntrevistaResposta,
  type Scorecard,
  type ScorecardCompetencia,
  type RegraAutomacao,
  type RegraCondicao,
  type RegraAcao,
  type ComparativoCandidatos,
  type ComparativoResultado,
  type DISCProfile,
  DISC_PROFILES
} from './selection';
