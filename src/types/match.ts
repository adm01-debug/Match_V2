/**
 * @fileoverview Tipos do sistema "Deu Match" - O Tinder Corporativo.
 * Dados em `@/data/valoresCulturais`, helpers em `@/lib/matchHelpers`.
 * Re-exportados aqui para preservar a API pública.
 * @module types/match
 */

// ============================================================
// VALORES CULTURAIS
// ============================================================

export type ValorCulturalId =
  | 'inovacao'
  | 'colaboracao'
  | 'excelencia'
  | 'transparencia'
  | 'diversidade'
  | 'sustentabilidade'
  | 'agilidade'
  | 'autonomia'
  | 'aprendizado'
  | 'cliente_foco'
  | 'integridade'
  | 'paixao'
  | 'resiliencia'
  | 'equidade'
  | 'bem_estar'
  | 'meritocracia'
  | 'empreendedorismo'
  | 'tradicao'
  | 'criatividade'
  | 'resultado';

export interface ValorCulturalDefinicao {
  id: ValorCulturalId;
  nome: string;
  descricao: string;
  perguntaEmpresa: string;
  perguntaCandidato: string;
  icone: string;
  cor: string;
  opostos: ValorCulturalId[];
  complementares: ValorCulturalId[];
}

// ============================================================
// PERFIL CULTURAL
// ============================================================

export interface RespostaValorEmpresa {
  valorId: ValorCulturalId;
  intensidade: number;
  exemplo?: string;
}

export interface PerfilCulturalEmpresa {
  id: string;
  empresaNome: string;
  empresaLogo?: string;
  descricaoCultura: string;
  valores: RespostaValorEmpresa[];
  valoresPrioritarios: ValorCulturalId[];
  criadoEm: string;
  atualizadoEm: string;
  respondioPor?: string;
}

export interface RespostaValorCandidato {
  valorId: ValorCulturalId;
  intensidade: number;
  comentario?: string;
}

export interface PerfilCulturalCandidato {
  id: string;
  candidatoId: string;
  candidatoNome: string;
  valores: RespostaValorCandidato[];
  valoresPrioritarios: ValorCulturalId[];
  criadoEm: string;
  atualizadoEm: string;
}

// ============================================================
// MATCH
// ============================================================

export interface MatchDetalhe {
  valorId: ValorCulturalId;
  valorNome: string;
  intensidadeEmpresa: number;
  intensidadeCandidato: number;
  alinhamento: 'perfeito' | 'alto' | 'medio' | 'baixo' | 'conflito';
  diferencaAbsoluta: number;
  comentario: string;
}

export interface MatchResult {
  id: string;
  candidatoId: string;
  empresaPerfilId: string;
  vagaId?: string;

  scoreTotal: number;
  scoreValores: number;
  scoreCompatibilidade: number;

  matchesPerfeitos: MatchDetalhe[];
  matchesAltos: MatchDetalhe[];
  matchesMedios: MatchDetalhe[];
  conflitos: MatchDetalhe[];

  pontosFortes: string[];
  pontosAtencao: string[];
  recomendacao: 'match_perfeito' | 'match_forte' | 'match_moderado' | 'revisar' | 'nao_recomendado';
  analiseTexto: string;

  calculadoEm: string;
}

// ============================================================
// QUIZ
// ============================================================

export interface QuizQuestao {
  id: string;
  valorId: ValorCulturalId;
  pergunta: string;
  tipo: 'escala' | 'escolha' | 'ranking';
  opcoes?: { valor: number; texto: string }[];
}

export interface QuizEmpresa {
  id: string;
  titulo: string;
  descricao: string;
  questoes: QuizQuestao[];
  tempoEstimado: number;
}

export interface QuizCandidato {
  id: string;
  titulo: string;
  descricao: string;
  questoes: QuizQuestao[];
  tempoEstimado: number;
}

// ============================================================
// RE-EXPORTS (API pública preservada)
// ============================================================

export { VALORES_CULTURAIS } from '@/data/valoresCulturais';
export { calcularAlinhamento, getValorPorId, getCorAlinhamento } from '@/lib/matchHelpers';
