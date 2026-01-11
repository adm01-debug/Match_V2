/**
 * @fileoverview Types for the advanced selection system
 * @module types/selection
 */

// ============================================
// FASE 1: PERFIS E CRITÉRIOS
// ============================================

export interface ValorCultural {
  id: string;
  nome: string;
  descricao?: string;
  icone: string;
  cor: string;
  ativo: boolean;
  ordem: number;
}

export interface Competencia {
  id: string;
  nome: string;
  descricao?: string;
  tipo: 'tecnica' | 'comportamental' | 'cultural';
  categoria?: string;
  indicadoresComportamentais?: string[];
  perguntasSugeridas?: string[];
  ativo: boolean;
}

export interface PerfilCargo {
  id: string;
  vagaId?: string;
  nome: string;
  descricao?: string;
  // Perfil DISC
  perfilDominancia: number;
  perfilInfluencia: number;
  perfilEstabilidade: number;
  perfilConformidade: number;
  toleranciaPerfil: number;
  // Pesos
  pesoTecnico: number;
  pesoBehavioral: number;
  pesoCultural: number;
  notaMinimaAprovacao: number;
  // Relacionamentos
  criterios?: CriterioSelecao[];
  valores?: PerfilValor[];
}

export interface CriterioSelecao {
  id: string;
  perfilCargoId: string;
  competenciaId?: string;
  nome: string;
  descricao?: string;
  tipo: 'eliminatorio' | 'classificatorio';
  peso: number;
  notaMinima?: number;
  ordem: number;
  ativo: boolean;
  competencia?: Competencia;
}

export interface PerfilValor {
  id: string;
  perfilCargoId: string;
  valorCulturalId: string;
  peso: number;
  obrigatorio: boolean;
  valorCultural?: ValorCultural;
}

// ============================================
// FASE 2: ASSESSMENTS
// ============================================

export type TipoAssessment = 'disc' | 'cultural' | 'situacional' | 'valores';
export type TipoQuestaoAssessment = 'escala' | 'escolha_forcada' | 'multipla' | 'situacional';

export interface Assessment {
  id: string;
  titulo: string;
  descricao?: string;
  tipo: TipoAssessment;
  instrucoes?: string;
  duracaoEstimada: number;
  totalQuestoes: number;
  ativo: boolean;
  versao: number;
  questoes?: AssessmentQuestao[];
}

export interface AssessmentQuestao {
  id: string;
  assessmentId: string;
  texto: string;
  tipo: TipoQuestaoAssessment;
  opcoes?: AssessmentOpcao[];
  dimensao?: string;
  peso?: number;
  ordem: number;
  obrigatoria: boolean;
}

export interface AssessmentOpcao {
  texto: string;
  dimensao?: string;
  valor: number;
}

export interface AssessmentResposta {
  id: string;
  assessmentId: string;
  candidatoId: string;
  processoId?: string;
  respostas: Record<string, number | string>;
  resultados?: DISCResultado | CulturalResultado;
  tempoGasto?: number;
  iniciadoEm: string;
  finalizadoEm?: string;
  status: 'em_andamento' | 'finalizado' | 'expirado';
}

export interface DISCResultado {
  dominancia: number;
  influencia: number;
  estabilidade: number;
  conformidade: number;
  perfilPrimario: 'D' | 'I' | 'S' | 'C';
  perfilSecundario?: 'D' | 'I' | 'S' | 'C';
  descricao: string;
  pontosFortes: string[];
  areasDesenvolvimento: string[];
}

export interface CulturalResultado {
  scores: Record<string, number>;
  fitGeral: number;
  alinhamentos: { valor: string; score: number; status: 'alto' | 'medio' | 'baixo' }[];
  observacoes: string;
}

// ============================================
// TEMPLATES DE ENTREVISTA
// ============================================

export interface TemplateEntrevista {
  id: string;
  nome: string;
  descricao?: string;
  tipoEntrevista: 'tecnica' | 'comportamental' | 'cultural' | 'final';
  departamento?: string;
  nivel?: string;
  duracaoSugerida: number;
  ativo: boolean;
  perguntas?: TemplatePergunta[];
}

export interface TemplatePergunta {
  id: string;
  templateId: string;
  competenciaId?: string;
  pergunta: string;
  tipo: 'tecnica' | 'comportamental' | 'situacional';
  criteriosAvaliacao?: string[];
  respostaIdeal?: string;
  pontuacaoMaxima: number;
  obrigatoria: boolean;
  ordem: number;
  competencia?: Competencia;
}

export interface EntrevistaResposta {
  id: string;
  entrevistaId: string;
  templateId?: string;
  perguntaId?: string;
  respostaCandidato?: string;
  nota?: number;
  observacoes?: string;
  avaliadorId?: string;
}

// ============================================
// FASE 3: SCORECARD E AUTOMAÇÃO
// ============================================

export interface Scorecard {
  id: string;
  processoId: string | null;
  candidatoId: string | null;
  perfilCargoId?: string | null;
  // Scores
  scoreTecnico?: number | null;
  scoreComportamental?: number | null;
  scoreCultural?: number | null;
  scoreExperiencia?: number | null;
  scoreFinal?: number | null;
  // DISC do Candidato
  discDominancia?: number | null;
  discInfluencia?: number | null;
  discEstabilidade?: number | null;
  discConformidade?: number | null;
  fitPerfil?: number | null;
  // Análise
  pontosFortes?: string[] | null;
  pontosDesenvolvimento?: string[] | null;
  riscos?: string[] | null;
  recomendacao?: 'aprovar' | 'reprovar' | 'avaliar_mais' | null;
  justificativa?: string | null;
  geradoPor: 'sistema' | 'manual' | 'ai' | null;
  atualizadoEm: string | null;
  // Relacionamentos
  competencias?: ScorecardCompetencia[];
  candidatoNome?: string;
  vagaTitulo?: string;
}

export interface ScorecardCompetencia {
  id: string;
  scorecardId: string | null;
  competenciaId?: string | null;
  criterioId?: string | null;
  nome: string;
  tipo?: string | null;
  nota?: number | null;
  peso: number;
  evidencias?: string[] | null;
  fonte?: 'prova' | 'entrevista' | 'assessment' | 'avaliacao' | null;
}

export interface RegraAutomacao {
  id: string;
  nome: string;
  descricao?: string;
  tipo: 'aprovacao_automatica' | 'reprovacao_automatica' | 'notificacao' | 'mudanca_etapa';
  condicoes: RegraCondicao[];
  acoes: RegraAcao[];
  prioridade: number;
  ativo: boolean;
  aplicavelA: string[];
}

export interface RegraCondicao {
  campo: string;
  operador: 'igual' | 'maior' | 'menor' | 'entre' | 'contem';
  valor: number | string | number[];
}

export interface RegraAcao {
  tipo: 'mudar_status' | 'mudar_etapa' | 'notificar' | 'criar_tarefa';
  parametros: Record<string, unknown>;
}

export interface ComparativoCandidatos {
  id: string;
  vagaId: string;
  candidatosIds: string[];
  criteriosComparados?: string[];
  resultado?: ComparativoResultado;
  geradoPor?: string;
  createdAt: string;
}

export interface ComparativoResultado {
  ranking: {
    posicao: number;
    candidatoId: string;
    candidatoNome: string;
    scoreFinal: number;
    scores: Record<string, number>;
  }[];
  analise: string;
  recomendacao: string;
}

// ============================================
// DISC CONSTANTS
// ============================================

export const DISC_PROFILES = {
  D: {
    nome: 'Dominância',
    cor: 'red',
    descricao: 'Orientado a resultados, direto, decidido, competitivo',
    pontosFortes: ['Liderança', 'Tomada de decisão', 'Foco em resultados', 'Resolução de problemas'],
    desafios: ['Impaciência', 'Pode ser autoritário', 'Baixa tolerância a detalhes'],
  },
  I: {
    nome: 'Influência',
    cor: 'yellow',
    descricao: 'Entusiástico, otimista, colaborativo, expressivo',
    pontosFortes: ['Comunicação', 'Networking', 'Criatividade', 'Motivação de equipes'],
    desafios: ['Pode perder foco', 'Dificuldade com detalhes', 'Decisões emocionais'],
  },
  S: {
    nome: 'Estabilidade',
    cor: 'green',
    descricao: 'Paciente, confiável, trabalho em equipe, bom ouvinte',
    pontosFortes: ['Confiabilidade', 'Trabalho em equipe', 'Paciência', 'Suporte'],
    desafios: ['Resistência a mudanças', 'Dificuldade em dizer não', 'Evita conflitos'],
  },
  C: {
    nome: 'Conformidade',
    cor: 'blue',
    descricao: 'Analítico, preciso, sistemático, focado em qualidade',
    pontosFortes: ['Atenção a detalhes', 'Qualidade', 'Análise', 'Planejamento'],
    desafios: ['Perfeccionismo', 'Lentidão em decisões', 'Pode ser crítico demais'],
  },
} as const;

export type DISCProfile = keyof typeof DISC_PROFILES;
