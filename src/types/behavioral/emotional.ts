/**
 * @fileoverview Estados Emocionais, Valores e Inteligência Emocional
 */

// ============================================================
// Estados Emocionais & Âncoras
// ============================================================
export type EmotionalState =
  | 'confianca'
  | 'motivacao'
  | 'calma'
  | 'foco'
  | 'criatividade'
  | 'determinacao'
  | 'empatia'
  | 'entusiasmo'
  | 'resiliencia'
  | 'curiosidade';

export interface EmotionalStateResult {
  readonly estadosPredominantes: EmotionalState[];
  readonly estadosDesafiadores: EmotionalState[];
  readonly regulacaoEmocional: number;
  readonly conscienciaEmocional: number;
  readonly expressaoEmocional: number;
  readonly gatilhosPositivos: string[];
  readonly gatilhosNegativos: string[];
  readonly estrategiasRegulacao: string[];
  readonly ancorasNaturais: {
    estado: EmotionalState;
    gatilho: string;
    intensidade: number;
  }[];
}

// ============================================================
// Valores & Critérios
// ============================================================
export type ValueCategory =
  | 'realizacao'
  | 'seguranca'
  | 'relacionamento'
  | 'autonomia'
  | 'crescimento'
  | 'contribuicao'
  | 'reconhecimento'
  | 'equilibrio'
  | 'desafio'
  | 'criatividade';

export interface ValuesResult {
  readonly valoresPrioritarios: {
    valor: ValueCategory;
    peso: number;
    evidencias: string[];
  }[];
  readonly criteriosDecisao: {
    criterio: string;
    importancia: number;
    descricao: string;
  }[];
  readonly motivadoresInternos: string[];
  readonly motivadoresExternos: string[];
  readonly conflitosValores: string[];
  readonly alinhamentoCultural: number;
}

export const VALUES_INFO: Record<ValueCategory, {
  nome: string;
  descricao: string;
  manifestacoes: string[];
  perguntasExploratorias: string[];
}> = {
  realizacao: {
    nome: 'Realização',
    descricao: 'Busca por resultados e conquistas',
    manifestacoes: ['Define metas ambiciosas', 'Celebra conquistas', 'Busca superação'],
    perguntasExploratorias: ['O que significa sucesso para você?', 'Qual sua maior conquista?']
  },
  seguranca: {
    nome: 'Segurança',
    descricao: 'Necessidade de estabilidade e previsibilidade',
    manifestacoes: ['Planeja cuidadosamente', 'Evita riscos', 'Busca garantias'],
    perguntasExploratorias: ['O que te dá tranquilidade?', 'Como você lida com incertezas?']
  },
  relacionamento: {
    nome: 'Relacionamento',
    descricao: 'Valorização de conexões e pertencimento',
    manifestacoes: ['Cultiva amizades', 'Trabalha em equipe', 'Valoriza lealdade'],
    perguntasExploratorias: ['Como são seus relacionamentos no trabalho?', 'O que busca em uma equipe?']
  },
  autonomia: {
    nome: 'Autonomia',
    descricao: 'Necessidade de independência e liberdade',
    manifestacoes: ['Prefere trabalhar sozinho', 'Toma decisões próprias', 'Resiste a controle'],
    perguntasExploratorias: ['Como você prefere ser gerenciado?', 'Qual seu estilo de trabalho ideal?']
  },
  crescimento: {
    nome: 'Crescimento',
    descricao: 'Busca por desenvolvimento e aprendizado',
    manifestacoes: ['Busca novos conhecimentos', 'Aceita desafios', 'Investe em si mesmo'],
    perguntasExploratorias: ['O que você quer aprender?', 'Como você se desenvolve?']
  },
  contribuicao: {
    nome: 'Contribuição',
    descricao: 'Desejo de fazer diferença e ajudar',
    manifestacoes: ['Ajuda os outros', 'Busca propósito', 'Valoriza impacto'],
    perguntasExploratorias: ['Qual legado quer deixar?', 'Como você contribui para sua equipe?']
  },
  reconhecimento: {
    nome: 'Reconhecimento',
    descricao: 'Necessidade de ser valorizado e apreciado',
    manifestacoes: ['Busca feedback', 'Gosta de elogios', 'Valoriza status'],
    perguntasExploratorias: ['Como você gosta de ser reconhecido?', 'O que significa valorização?']
  },
  equilibrio: {
    nome: 'Equilíbrio',
    descricao: 'Busca por harmonia entre vida pessoal e profissional',
    manifestacoes: ['Define limites', 'Prioriza bem-estar', 'Busca qualidade de vida'],
    perguntasExploratorias: ['Como você equilibra trabalho e vida pessoal?', 'O que é qualidade de vida?']
  },
  desafio: {
    nome: 'Desafio',
    descricao: 'Motivação por situações desafiadoras',
    manifestacoes: ['Busca dificuldades', 'Se entedia com rotina', 'Gosta de resolver problemas'],
    perguntasExploratorias: ['Que tipo de desafio te motiva?', 'Como você lida com obstáculos?']
  },
  criatividade: {
    nome: 'Criatividade',
    descricao: 'Expressão criativa e inovação',
    manifestacoes: ['Propõe ideias novas', 'Pensa fora da caixa', 'Inova constantemente'],
    perguntasExploratorias: ['Como você expressa sua criatividade?', 'Qual foi sua ideia mais inovadora?']
  }
};

// ============================================================
// Inteligência Emocional (EQ) - 5 Pilares de Goleman
// ============================================================
export interface EQResult {
  readonly autoconsciencia: {
    score: number;
    conscienciaEmocional: number;
    autoavaliacao: number;
    autoconfianca: number;
    descricao: string;
  };
  readonly autorregulacao: {
    score: number;
    autocontrole: number;
    confiabilidade: number;
    adaptabilidade: number;
    inovacao: number;
    descricao: string;
  };
  readonly motivacao: {
    score: number;
    orientacaoRealizacao: number;
    comprometimento: number;
    iniciativa: number;
    otimismo: number;
    descricao: string;
  };
  readonly empatia: {
    score: number;
    compreensaoOutros: number;
    desenvolvimentoOutros: number;
    orientacaoServico: number;
    conscienciaPolitica: number;
    descricao: string;
  };
  readonly habilidadesSociais: {
    score: number;
    influencia: number;
    comunicacao: number;
    lideranca: number;
    catalisadorMudanca: number;
    colaboracao: number;
    descricao: string;
  };
  readonly scoreGeral: number;
  readonly pontosFortes: string[];
  readonly areasDesenvolvimento: string[];
  readonly recomendacoes: string[];
}
