/**
 * @fileoverview Tipos do framework "10 Pilares do Comportamento"
 */

export interface BehavioralPillar {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
  dimensoes: string[];
  indicadores: string[];
  perguntasChave: string[];
}

export interface ScenarioOption {
  id: string;
  texto: string;
  /** Impacto nos pilares: { pilarId: pontuação (-3 a +3) } */
  impacto: Record<string, number>;
  /** Tags para análise qualitativa */
  tags: string[];
  /** Se é uma resposta "socialmente desejável" */
  socialmenteDesejavel?: boolean;
}

export interface ImmersiveScenario {
  id: string;
  titulo: string;
  contexto: string;
  narrativa: string;
  tipo:
    | 'dilema_etico'
    | 'situacao_pressao'
    | 'conflito_interpessoal'
    | 'decisao_estrategica'
    | 'crise'
    | 'inovacao';
  pilaresAvaliados: string[];
  opcoes: ScenarioOption[];
  tempoLimite?: number;
  followUp?: {
    condicao: string;
    pergunta: string;
    opcoes: ScenarioOption[];
  };
}

export interface CompanyProfile {
  id: string;
  nome: string;
  descricao: string;
  valores: string[];
  cultura: 'startup' | 'corporativa' | 'hibrida' | 'tradicional' | 'inovadora';
  ritmo: 'intenso' | 'moderado' | 'tranquilo';
  hierarquia: 'horizontal' | 'vertical' | 'matricial';
  pilaresValorizados: Record<string, number>;
  dealbreakers: string[];
}

/**
 * Índice de Autenticidade
 * Detecta padrões de resposta "socialmente desejáveis"
 */
export interface AuthenticityMetrics {
  tempoMedioResposta: number;
  variacaoTempo: number;
  respostasSocialmenteDesejaveis: number;
  consistenciaInterna: number;
  complexidadeResposta: number;
  contradicoes: string[];
}

/**
 * Análise Preditiva de Fit
 */
export interface PredictiveFitAnalysis {
  fitGeral: number;
  fitPorPilar: Record<string, { empresa: number; candidato: number; gap: number }>;
  riscos: Array<{
    pilar: string;
    severidade: 'baixo' | 'medio' | 'alto';
    descricao: string;
  }>;
  potencializadores: Array<{
    pilar: string;
    descricao: string;
  }>;
  recomendacao:
    | 'fortemente_recomendado'
    | 'recomendado'
    | 'neutro'
    | 'cautela'
    | 'nao_recomendado';
  justificativa: string;
}
