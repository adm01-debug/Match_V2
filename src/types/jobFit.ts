/**
 * @fileoverview Tipos para o sistema de Perfil Ideal + Job Fit
 * @module types/jobFit
 * 
 * Define o perfil comportamental ideal por vaga e calcula
 * compatibilidade automática entre candidatos e vagas.
 */

import type { DISCProfile } from './behavioral';
import type { BrainType, GenerationType, StressResponse } from './advancedBehavioral';

// ============================================================
// PERFIL COMPORTAMENTAL IDEAL DA VAGA
// ============================================================

export interface PerfilIdealDISC {
  dominancia: { min: number; ideal: number; max: number; peso: number };
  influencia: { min: number; ideal: number; max: number; peso: number };
  estabilidade: { min: number; ideal: number; max: number; peso: number };
  conformidade: { min: number; ideal: number; max: number; peso: number };
}

export interface PerfilIdealComportamental {
  id: string;
  vagaId: string;
  vagaTitulo: string;
  
  // DISC Profile ideal
  discIdeal: PerfilIdealDISC;
  discPrimarioPreferido?: DISCProfile[];
  
  // Cérebro Trino preferido
  cerebroDominante?: BrainType;
  equilibrioCerebral?: 'balanced' | 'dominated' | 'dual';
  
  // Geração (se relevante para a vaga)
  geracaoPreferida?: GenerationType[];
  
  // Resiliência sob stress
  resilienciaMinima?: number; // 0-100
  stressResponseAceitavel?: StressResponse[];
  
  // Competências comportamentais (pesos 0-100)
  competencias: {
    lideranca: number;
    comunicacao: number;
    trabalhoEquipe: number;
    resolucaoProblemas: number;
    adaptabilidade: number;
    orientacaoResultados: number;
    criatividade: number;
    atencaoDetalhes: number;
    autonomia: number;
    empatia: number;
  };
  
  // Deal breakers (eliminatórios)
  dealbreakers: {
    discProfilesIncompativeis?: DISCProfile[];
    resilienciaMinimaObrigatoria?: number;
    competenciasObrigatorias?: { competencia: keyof PerfilIdealComportamental['competencias']; minimo: number }[];
  };
  
  // Metadata
  criadoPor?: string;
  criadoEm: string;
  atualizadoEm: string;
}

// ============================================================
// RESULTADO DO JOB FIT
// ============================================================

export type JobFitNivel = 'excelente' | 'alto' | 'moderado' | 'baixo' | 'incompativel';

export interface JobFitDetalhe {
  categoria: string;
  nome: string;
  scoreCanditato: number;
  scoreIdeal: number;
  diferenca: number;
  status: 'match' | 'proximo' | 'distante' | 'critico';
  comentario: string;
}

export interface JobFitResult {
  id: string;
  candidatoId: string;
  candidatoNome: string;
  vagaId: string;
  vagaTitulo: string;
  perfilIdealId: string;
  
  // Scores principais
  scoreTotalFit: number; // 0-100
  scoreDISC: number;
  scoreCompetencias: number;
  scoreResiliencia: number;
  scoreCerebroTrino?: number;
  
  // Classificação
  nivel: JobFitNivel;
  
  // Detalhamento
  matchesPositivos: JobFitDetalhe[];
  alertas: JobFitDetalhe[];
  dealbreakersViolados: string[];
  
  // Análise textual
  resumoExecutivo: string;
  recomendacao: 'contratar' | 'considerar' | 'reserva' | 'nao_recomendado';
  justificativa: string;
  
  // Dicas para entrevista
  perguntasValidacao: string[];
  areasAprofundar: string[];
  
  calculadoEm: string;
}

// ============================================================
// RED FLAGS E ALERTAS
// ============================================================

export type RedFlagSeveridade = 'critico' | 'alto' | 'medio' | 'baixo';
export type RedFlagCategoria = 
  | 'comportamental'
  | 'resiliencia'
  | 'compatibilidade'
  | 'consistencia'
  | 'stress'
  | 'cultural';

export interface RedFlagRule {
  id: string;
  nome: string;
  descricao: string;
  categoria: RedFlagCategoria;
  severidade: RedFlagSeveridade;
  condicao: {
    tipo: 'disc_baixo' | 'competencia_baixa' | 'combinacao_risco' | 'inconsistencia' | 'stress_alto';
    parametros: Record<string, unknown>;
  };
  mensagem: string;
  recomendacao: string;
  perguntasEntrevista: string[];
}

export interface RedFlagDetectado {
  ruleId: string;
  ruleName: string;
  severidade: RedFlagSeveridade;
  categoria: RedFlagCategoria;
  mensagem: string;
  recomendacao: string;
  perguntasEntrevista: string[];
  dadosEvidence: Record<string, unknown>;
  detectadoEm: string;
}

// ============================================================
// COMPARATIVO DE CANDIDATOS
// ============================================================

export interface CandidatoComparativo {
  id: string;
  nome: string;
  foto?: string;
  
  // Resultados comportamentais
  discPrimario?: DISCProfile;
  discScores?: { D: number; I: number; S: number; C: number };
  
  cerebroDominante?: BrainType;
  cerebroScores?: { reptiliano: number; limbico: number; neocortex: number };
  
  geracao?: GenerationType;
  
  resiliencia?: number;
  stressResponse?: StressResponse;
  
  competencias?: Record<string, number>;
  
  // Job Fit (se calculado)
  jobFitScore?: number;
  jobFitNivel?: JobFitNivel;
  
  // Red Flags
  redFlags?: RedFlagDetectado[];
  
  // Metadados
  avaliacoesCompletadas: string[];
  dataUltimaAvaliacao?: string;
}

export interface ComparativoCandidatos {
  id: string;
  vagaId?: string;
  vagaTitulo?: string;
  candidatos: CandidatoComparativo[];
  criteriosComparados: string[];
  melhorCandidatoId?: string;
  analiseComparativa: string;
  rankingFinal: { candidatoId: string; posicao: number; justificativa: string }[];
  geradoEm: string;
}

// ============================================================
// RELATÓRIO EXECUTIVO
// ============================================================

export interface RelatorioExecutivoSecao {
  titulo: string;
  conteudo: string;
  dados?: Record<string, unknown>;
  icone?: string;
  cor?: string;
}

export interface RelatorioExecutivo {
  id: string;
  candidatoId: string;
  candidatoNome: string;
  vagaId?: string;
  vagaTitulo?: string;
  
  // Resumo geral
  scoreFinalConsolidado: number;
  classificacaoGeral: 'excepcional' | 'acima_media' | 'adequado' | 'abaixo_media' | 'nao_recomendado';
  manchetePrincipal: string;
  
  // Seções do relatório
  secoes: {
    perfilComportamental: RelatorioExecutivoSecao;
    pontosFortes: RelatorioExecutivoSecao;
    areasDesenvolvimento: RelatorioExecutivoSecao;
    fitCultural: RelatorioExecutivoSecao;
    riscos: RelatorioExecutivoSecao;
    recomendacaoFinal: RelatorioExecutivoSecao;
  };
  
  // Gráficos/dados para visualização
  dadosVisuais: {
    radarCompetencias: { label: string; valor: number; ideal?: number }[];
    discChart: { D: number; I: number; S: number; C: number };
    cerebroChart?: { reptiliano: number; limbico: number; neocortex: number };
    compatibilidadeVaga?: number;
  };
  
  // Ferramentas utilizadas
  ferramentasAvaliadas: string[];
  
  // Recomendação estruturada
  decisaoSugerida: 'aprovar' | 'entrevistar' | 'reserva' | 'recusar';
  confiancaDecisao: number; // 0-100
  proximosPassos: string[];
  
  geradoEm: string;
  geradoPor?: string;
}

// ============================================================
// HELPERS
// ============================================================

export function getJobFitNivelInfo(nivel: JobFitNivel): {
  label: string;
  cor: string;
  icone: string;
  descricao: string;
} {
  const info = {
    excelente: {
      label: 'Excelente',
      cor: 'text-green-600 bg-green-100',
      icone: 'CheckCircle2',
      descricao: 'Altamente compatível com a vaga'
    },
    alto: {
      label: 'Alto',
      cor: 'text-emerald-600 bg-emerald-100',
      icone: 'ThumbsUp',
      descricao: 'Boa compatibilidade com a vaga'
    },
    moderado: {
      label: 'Moderado',
      cor: 'text-yellow-600 bg-yellow-100',
      icone: 'AlertTriangle',
      descricao: 'Compatibilidade parcial - requer avaliação adicional'
    },
    baixo: {
      label: 'Baixo',
      cor: 'text-orange-600 bg-orange-100',
      icone: 'AlertCircle',
      descricao: 'Compatibilidade limitada com a vaga'
    },
    incompativel: {
      label: 'Incompatível',
      cor: 'text-red-600 bg-red-100',
      icone: 'XCircle',
      descricao: 'Não recomendado para esta vaga'
    }
  };
  return info[nivel];
}

export function getRedFlagSeveridadeInfo(severidade: RedFlagSeveridade): {
  label: string;
  cor: string;
  icone: string;
} {
  const info = {
    critico: { label: 'Crítico', cor: 'text-red-700 bg-red-100 border-red-300', icone: 'AlertOctagon' },
    alto: { label: 'Alto', cor: 'text-orange-700 bg-orange-100 border-orange-300', icone: 'AlertTriangle' },
    medio: { label: 'Médio', cor: 'text-yellow-700 bg-yellow-100 border-yellow-300', icone: 'AlertCircle' },
    baixo: { label: 'Baixo', cor: 'text-blue-700 bg-blue-100 border-blue-300', icone: 'Info' }
  };
  return info[severidade];
}
