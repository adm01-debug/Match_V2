import type { PredictiveFitAnalysis } from '@/config/behavioralPillars';
import type { ScenarioResponse } from '@/components/assessments/ImmersiveScenarioPlayer';

export interface BehavioralAssessmentResult {
  id?: string;
  candidato_id?: string;
  processo_id?: string;
  vaga_id?: string;

  score_resiliencia: number;
  score_integridade: number;
  score_colaboracao: number;
  score_lideranca: number;
  score_adaptabilidade: number;
  score_proatividade: number;
  score_comunicacao: number;
  score_pensamento_critico: number;
  score_inteligencia_emocional: number;
  score_orientacao_resultados: number;
  score_geral: number;

  tempo_medio_resposta?: number;
  variacao_tempo?: number;
  respostas_socialmente_desejaveis?: number;
  consistencia_interna?: number;
  total_hesitacoes?: number;

  fit_geral?: number;
  fit_por_pilar?: Record<string, { empresa: number; candidato: number; gap: number }>;
  riscos?: PredictiveFitAnalysis['riscos'];
  potencializadores?: PredictiveFitAnalysis['potencializadores'];
  recomendacao?: string;
  justificativa_fit?: string;

  respostas: ScenarioResponse[];

  cenarios_respondidos?: number;
  cenarios_pulados?: number;
  duracao_total?: number;
  status: 'em_andamento' | 'completo' | 'abandonado';
  iniciado_em?: string;
  finalizado_em?: string;
}

export interface CompanyBehavioralProfile {
  id?: string;
  vaga_id?: string;
  nome: string;
  descricao?: string;
  peso_resiliencia: number;
  peso_integridade: number;
  peso_colaboracao: number;
  peso_lideranca: number;
  peso_adaptabilidade: number;
  peso_proatividade: number;
  peso_comunicacao: number;
  peso_pensamento_critico: number;
  peso_inteligencia_emocional: number;
  peso_orientacao_resultados: number;
  dealbreakers?: Array<{ pilarId: string; minimo: number }>;
  dimensoes_culturais?: Record<string, number>;
  ativo?: boolean;
}

export const EMPTY_PILLAR_SCORES = {
  score_resiliencia: 0,
  score_integridade: 0,
  score_colaboracao: 0,
  score_lideranca: 0,
  score_adaptabilidade: 0,
  score_proatividade: 0,
  score_comunicacao: 0,
  score_pensamento_critico: 0,
  score_inteligencia_emocional: 0,
  score_orientacao_resultados: 0,
  score_geral: 0,
} as const;
