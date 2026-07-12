/**
 * @fileoverview Vieses Cognitivos e Rapport
 */

export type CognitiveBias =
  | 'confirmacao'
  | 'ancoragem'
  | 'disponibilidade'
  | 'excesso_confianca'
  | 'aversao_perda'
  | 'efeito_manada'
  | 'retrospectiva'
  | 'projecao'
  | 'atribuicao'
  | 'enquadramento';

export interface CognitiveBiasResult {
  readonly viesesIdentificados: {
    vies: CognitiveBias;
    intensidade: number;
    exemplos: string[];
    impacto: string;
  }[];
  readonly conscienciaCognitiva: number;
  readonly flexibilidadePensamento: number;
  readonly tomadaDecisao: {
    estilo: 'analitico' | 'intuitivo' | 'misto';
    velocidade: 'rapida' | 'moderada' | 'deliberada';
    toleranciaRisco: 'baixa' | 'media' | 'alta';
  };
  readonly estrategiasMitigacao: string[];
}

export const COGNITIVE_BIASES_INFO: Record<CognitiveBias, {
  nome: string;
  descricao: string;
  exemplos: string[];
  comoMitigar: string[];
}> = {
  confirmacao: {
    nome: 'Viés de Confirmação',
    descricao: 'Tendência a buscar informações que confirmam crenças existentes',
    exemplos: ['Ignora feedbacks contrários', 'Busca só opiniões similares'],
    comoMitigar: ['Busque ativamente visões contrárias', 'Questione suas premissas']
  },
  ancoragem: {
    nome: 'Ancoragem',
    descricao: 'Dependência excessiva da primeira informação recebida',
    exemplos: ['Foca no primeiro número apresentado', 'Dificuldade em ajustar estimativas'],
    comoMitigar: ['Considere múltiplas referências', 'Revise estimativas sistematicamente']
  },
  disponibilidade: {
    nome: 'Heurística de Disponibilidade',
    descricao: 'Julgamentos baseados em exemplos que vêm facilmente à mente',
    exemplos: ['Superestima eventos recentes', 'Ignora estatísticas'],
    comoMitigar: ['Use dados objetivos', 'Considere a base rate']
  },
  excesso_confianca: {
    nome: 'Excesso de Confiança',
    descricao: 'Superestimação das próprias habilidades e conhecimentos',
    exemplos: ['Subestima dificuldades', 'Não pede ajuda'],
    comoMitigar: ['Busque feedback', 'Documente acertos e erros']
  },
  aversao_perda: {
    nome: 'Aversão à Perda',
    descricao: 'Perdas parecem maiores que ganhos equivalentes',
    exemplos: ['Evita riscos excessivamente', 'Mantém posições perdedoras'],
    comoMitigar: ['Analise objetivamente', 'Considere custo de oportunidade']
  },
  efeito_manada: {
    nome: 'Efeito Manada',
    descricao: 'Seguir a maioria sem análise própria',
    exemplos: ['Segue tendências cegamente', 'Dificuldade em ir contra o grupo'],
    comoMitigar: ['Analise independentemente', 'Questione consensos']
  },
  retrospectiva: {
    nome: 'Viés de Retrospectiva',
    descricao: 'Tendência a ver eventos passados como previsíveis',
    exemplos: ['"Eu sabia que isso ia acontecer"', 'Subestima incerteza passada'],
    comoMitigar: ['Documente previsões antes', 'Revise com humildade']
  },
  projecao: {
    nome: 'Viés de Projeção',
    descricao: 'Projetar sentimentos atuais no futuro',
    exemplos: ['Decisões baseadas em humor', 'Dificuldade em prever mudanças'],
    comoMitigar: ['Considere contextos diferentes', 'Planeje para cenários']
  },
  atribuicao: {
    nome: 'Erro de Atribuição',
    descricao: 'Atribuir comportamento a traços em vez de situações',
    exemplos: ['Julga pessoas rapidamente', 'Ignora contexto'],
    comoMitigar: ['Considere fatores situacionais', 'Evite julgamentos rápidos']
  },
  enquadramento: {
    nome: 'Efeito de Enquadramento',
    descricao: 'Decisões influenciadas pela forma de apresentação',
    exemplos: ['Reage diferente a "90% sucesso" vs "10% falha"', 'Manipulado por framing'],
    comoMitigar: ['Reframe informações', 'Analise múltiplas perspectivas']
  }
};

// ============================================================
// Rapport & Espelhamento
// ============================================================
export interface RapportResult {
  readonly habilidadesRapport: {
    espelhamentoFisico: number;
    espelhamentoVerbal: number;
    escutaAtiva: number;
    sintonia: number;
    flexibilidade: number;
  };
  readonly estiloConexao: 'caloroso' | 'profissional' | 'reservado' | 'adaptavel';
  readonly velocidadeConexao: 'rapida' | 'moderada' | 'gradual';
  readonly sinaisConfianca: string[];
  readonly barreirasConexao: string[];
  readonly recomendacoes: string[];
  readonly scoreGeral: number;
}
