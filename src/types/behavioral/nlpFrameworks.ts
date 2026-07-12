/**
 * @fileoverview DISC, VAK/D e Metaprogramas — frameworks base de PNL
 */

// ============================================================
// DISC - Perfis Comportamentais
// ============================================================
export type DISCProfile = 'D' | 'I' | 'S' | 'C';

export interface DISCResult {
  readonly dominancia: number;
  readonly influencia: number;
  readonly estabilidade: number;
  readonly conformidade: number;
  readonly perfilPrimario: DISCProfile;
  readonly perfilSecundario: DISCProfile;
  readonly descricao: string;
  readonly pontosFortes: string[];
  readonly areasDesenvolvimento: string[];
  readonly estiloTrabalho: string;
  readonly comunicacao: string;
  readonly motivadores: string[];
  readonly estressores: string[];
}

export const DISC_PROFILES_INFO: Record<DISCProfile, {
  nome: string;
  titulo: string;
  descricao: string;
  caracteristicas: string[];
  cor: string;
}> = {
  D: {
    nome: 'Dominância',
    titulo: 'Executor',
    descricao: 'Focado em resultados, direto, decidido, competitivo',
    caracteristicas: ['Orientado a resultados', 'Toma decisões rápidas', 'Aceita desafios', 'Gosta de estar no controle'],
    cor: 'bg-red-500'
  },
  I: {
    nome: 'Influência',
    titulo: 'Comunicador',
    descricao: 'Entusiasta, otimista, colaborativo, expressivo',
    caracteristicas: ['Sociável e persuasivo', 'Entusiasta', 'Colaborativo', 'Otimista'],
    cor: 'bg-yellow-500'
  },
  S: {
    nome: 'Estabilidade',
    titulo: 'Planejador',
    descricao: 'Calmo, paciente, previsível, consistente',
    caracteristicas: ['Confiável', 'Bom ouvinte', 'Trabalha bem em equipe', 'Paciente'],
    cor: 'bg-green-500'
  },
  C: {
    nome: 'Conformidade',
    titulo: 'Analista',
    descricao: 'Preciso, analítico, sistemático, cauteloso',
    caracteristicas: ['Focado em qualidade', 'Sistemático', 'Analítico', 'Atento aos detalhes'],
    cor: 'bg-blue-500'
  }
};

// ============================================================
// VAK/D - Sistemas Representacionais
// ============================================================
export type VAKDChannel = 'visual' | 'auditivo' | 'cinestesico' | 'digital';

export interface VAKDResult {
  readonly visual: number;
  readonly auditivo: number;
  readonly cinestesico: number;
  readonly digital: number;
  readonly canalPrimario: VAKDChannel;
  readonly canalSecundario: VAKDChannel;
  readonly descricao: string;
  readonly comoAprende: string[];
  readonly comoSeComunica: string[];
  readonly palavrasChave: string[];
  readonly ambienteIdeal: string;
}

export const VAKD_CHANNELS_INFO: Record<VAKDChannel, {
  nome: string;
  descricao: string;
  indicadores: string[];
  dicasComunicacao: string[];
  cor: string;
  icone: string;
}> = {
  visual: {
    nome: 'Visual',
    descricao: 'Processa informações através de imagens e representações visuais',
    indicadores: ['Usa expressões como "vejo", "parece", "claramente"', 'Prefere diagramas e gráficos', 'Memória visual forte'],
    dicasComunicacao: ['Use recursos visuais', 'Mostre exemplos', 'Desenhe ou diagramme'],
    cor: 'bg-purple-500',
    icone: 'Eye'
  },
  auditivo: {
    nome: 'Auditivo',
    descricao: 'Processa informações através de sons e conversas',
    indicadores: ['Usa expressões como "ouço", "soa bem", "ressoa"', 'Prefere discussões verbais', 'Aprende ouvindo'],
    dicasComunicacao: ['Explique verbalmente', 'Use tom de voz variado', 'Permita discussões'],
    cor: 'bg-blue-500',
    icone: 'Ear'
  },
  cinestesico: {
    nome: 'Cinestésico',
    descricao: 'Processa informações através de sensações e experiências físicas',
    indicadores: ['Usa expressões como "sinto", "toque", "concreto"', 'Prefere aprender fazendo', 'Valoriza conforto físico'],
    dicasComunicacao: ['Proporcione experiências práticas', 'Permita movimento', 'Use exemplos concretos'],
    cor: 'bg-green-500',
    icone: 'Hand'
  },
  digital: {
    nome: 'Digital/Auditivo Digital',
    descricao: 'Processa informações através de lógica e análise interna',
    indicadores: ['Usa expressões como "penso", "analiso", "faz sentido"', 'Prefere dados e fatos', 'Analítico e lógico'],
    dicasComunicacao: ['Apresente dados e estatísticas', 'Use lógica sequencial', 'Forneça documentação'],
    cor: 'bg-cyan-500',
    icone: 'Brain'
  }
};

// ============================================================
// Metaprogramas
// ============================================================
export type MetaprogramType =
  | 'aproximacao_afastamento'
  | 'interno_externo'
  | 'opcoes_procedimentos'
  | 'global_especifico'
  | 'proativo_reativo'
  | 'igual_diferente'
  | 'tempo';

export interface MetaprogramResult {
  readonly aproximacaoAfastamento: { aproximacao: number; afastamento: number; descricao: string };
  readonly internoExterno: { interno: number; externo: number; descricao: string };
  readonly opcoesProcedimentos: { opcoes: number; procedimentos: number; descricao: string };
  readonly globalEspecifico: { global: number; especifico: number; descricao: string };
  readonly proativoReativo: { proativo: number; reativo: number; descricao: string };
  readonly igualDiferente: { igual: number; diferente: number; descricao: string };
  readonly tempo: { passado: number; presente: number; futuro: number; descricao: string };
  readonly resumo: string;
  readonly recomendacoes: string[];
}

export const METAPROGRAMS_INFO: Record<MetaprogramType, {
  nome: string;
  polos: string[];
  descricao: string;
  perguntasExemplo: string[];
}> = {
  aproximacao_afastamento: {
    nome: 'Motivação',
    polos: ['Aproximação (busca prazer)', 'Afastamento (evita dor)'],
    descricao: 'Como a pessoa é motivada - pelo que quer alcançar ou pelo que quer evitar',
    perguntasExemplo: ['O que você busca em um emprego?', 'Por que esse tipo de trabalho é importante para você?']
  },
  interno_externo: {
    nome: 'Referência',
    polos: ['Interno (próprios critérios)', 'Externo (feedback de outros)'],
    descricao: 'Onde a pessoa busca validação e critérios de decisão',
    perguntasExemplo: ['Como você sabe que fez um bom trabalho?', 'Quem decide se algo está bom?']
  },
  opcoes_procedimentos: {
    nome: 'Razão',
    polos: ['Opções (alternativas)', 'Procedimentos (passo a passo)'],
    descricao: 'Como a pessoa prefere trabalhar - com flexibilidade ou seguindo processos',
    perguntasExemplo: ['Por que você escolheu seu trabalho atual?', 'Como você aborda uma nova tarefa?']
  },
  global_especifico: {
    nome: 'Escopo',
    polos: ['Global (visão geral)', 'Específico (detalhes)'],
    descricao: 'Nível de detalhe preferido para processar informações',
    perguntasExemplo: ['Me conte sobre seu último projeto', 'Como você descreve seu trabalho?']
  },
  proativo_reativo: {
    nome: 'Ação',
    polos: ['Proativo (inicia)', 'Reativo (responde)'],
    descricao: 'Tendência para iniciar ações ou esperar e responder',
    perguntasExemplo: ['Como você lida com novas situações?', 'O que você faz quando há um problema?']
  },
  igual_diferente: {
    nome: 'Mudança',
    polos: ['Igualdade (similaridades)', 'Diferença (mudanças)'],
    descricao: 'Como a pessoa percebe e processa mudanças',
    perguntasExemplo: ['Compare seu trabalho atual com o anterior', 'O que você busca em mudanças?']
  },
  tempo: {
    nome: 'Orientação Temporal',
    polos: ['Passado', 'Presente', 'Futuro'],
    descricao: 'Foco temporal predominante da pessoa',
    perguntasExemplo: ['Me fale sobre suas experiências', 'Onde você se vê em 5 anos?']
  }
};
