/**
 * @fileoverview Hooks para resultados de avaliações comportamentais imersivas
 * @module useBehavioralAssessmentResults
 *
 * Tabela: avaliacoes_comportamentais_resultados (10 Pilares Comportamentais).
 * Ver useBehavioralAssessments.ts para a tabela behavioral_assessment_results
 * (ferramentas DISC, VAK, etc).
 */

export type { BehavioralAssessmentResult, CompanyBehavioralProfile } from './behavioralResults/types';
export { useCandidateBehavioralResults, useAllBehavioralResults } from './behavioralResults/queries';
export { useSaveBehavioralResult } from './behavioralResults/mutations';
export { useCompanyBehavioralProfiles, useSaveCompanyProfile } from './behavioralResults/companyProfile';
export { useBehavioralAssessment } from './behavioralResults/session';
