/**
 * @fileoverview Tipos para módulo completo de Personalidade
 * @module types/personality
 * 
 * Inclui:
 * - Big Five (OCEAN)
 * - 16 Tipos de Personalidade (baseado em Jung/MBTI)
 * - Integração com DNA Comportamental
 */

// ============================================================
// BIG FIVE (OCEAN) - Os 5 Grandes Fatores de Personalidade
// ============================================================

export type BigFiveTrait = 'O' | 'C' | 'E' | 'A' | 'N';

export interface BigFiveScores {
  readonly openness: number; // Abertura à experiência (0-100)
  readonly conscientiousness: number; // Conscienciosidade (0-100)
  readonly extraversion: number; // Extroversão (0-100)
  readonly agreeableness: number; // Amabilidade (0-100)
  readonly neuroticism: number; // Neuroticismo (0-100)
}

export interface BigFiveFacets {
  // Abertura à Experiência
  readonly imaginacao: number;
  readonly interessesArtisticos: number;
  readonly emocionalidade: number;
  readonly aventura: number;
  readonly intelectoCuriosidade: number;
  readonly liberalismo: number;
  
  // Conscienciosidade
  readonly autoEficacia: number;
  readonly organizacao: number;
  readonly obediencia: number;
  readonly buscaRealizacao: number;
  readonly autodisciplina: number;
  readonly cautela: number;
  
  // Extroversão
  readonly amizade: number;
  readonly gregarinade: number;
  readonly assertividade: number;
  readonly nivelAtividade: number;
  readonly buscaEmocoes: number;
  readonly alegria: number;
  
  // Amabilidade
  readonly confianca: number;
  readonly moralidade: number;
  readonly altruismo: number;
  readonly cooperacao: number;
  readonly modestia: number;
  readonly simpatia: number;
  
  // Neuroticismo
  readonly ansiedade: number;
  readonly raiva: number;
  readonly depressao: number;
  readonly autoconsciencia: number;
  readonly imodeacao: number;
  readonly vulnerabilidade: number;
}

export interface BigFiveResult {
  readonly scores: BigFiveScores;
  readonly facets: Partial<BigFiveFacets>;
  readonly traitPrimario: BigFiveTrait;
  readonly traitSecundario: BigFiveTrait;
  readonly perfil: string;
  readonly descricao: string;
  readonly pontosFortes: string[];
  readonly areasDesenvolvimento: string[];
  readonly compatibilidadeCarreira: string[];
  readonly ambienteIdeal: string;
  readonly estiloTrabalho: string;
  readonly relacionamentoEquipe: string;
}

export const BIG_FIVE_INFO: Record<BigFiveTrait, {
  nome: string;
  nomeCompleto: string;
  descricaoAlta: string;
  descricaoBaixa: string;
  caracteristicasAltas: string[];
  caracteristicasBaixas: string[];
  cor: string;
  icone: string;
  carreirasCompativeis: string[];
}> = {
  O: {
    nome: 'Abertura',
    nomeCompleto: 'Abertura à Experiência',
    descricaoAlta: 'Curioso, criativo, aberto a novas ideias e experiências',
    descricaoBaixa: 'Prático, convencional, prefere rotinas e familiaridade',
    caracteristicasAltas: [
      'Altamente imaginativo e criativo',
      'Aprecia arte e beleza',
      'Busca novas experiências',
      'Pensamento abstrato',
      'Intelectualmente curioso'
    ],
    caracteristicasBaixas: [
      'Prefere rotinas estabelecidas',
      'Prático e realista',
      'Convencional em suas abordagens',
      'Focado no concreto',
      'Resistente a mudanças'
    ],
    cor: 'from-purple-500 to-indigo-600',
    icone: 'Sparkles',
    carreirasCompativeis: ['Designer', 'Artista', 'Pesquisador', 'Escritor', 'Cientista']
  },
  C: {
    nome: 'Conscienciosidade',
    nomeCompleto: 'Conscienciosidade',
    descricaoAlta: 'Organizado, responsável, orientado a objetivos',
    descricaoBaixa: 'Flexível, espontâneo, menos preocupado com detalhes',
    caracteristicasAltas: [
      'Altamente organizado',
      'Confiável e pontual',
      'Orientado a metas',
      'Autodisciplinado',
      'Atento aos detalhes'
    ],
    caracteristicasBaixas: [
      'Espontâneo e flexível',
      'Pode ser desorganizado',
      'Menos focado em metas',
      'Prefere improvisação',
      'Pode procrastinar'
    ],
    cor: 'from-blue-500 to-cyan-600',
    icone: 'Target',
    carreirasCompativeis: ['Gerente', 'Contador', 'Engenheiro', 'Médico', 'Advogado']
  },
  E: {
    nome: 'Extroversão',
    nomeCompleto: 'Extroversão',
    descricaoAlta: 'Sociável, assertivo, busca estímulos externos',
    descricaoBaixa: 'Reservado, introspectivo, prefere ambientes calmos',
    caracteristicasAltas: [
      'Sociável e comunicativo',
      'Energizado por interações',
      'Assertivo e dominante',
      'Busca excitação',
      'Otimista e entusiasta'
    ],
    caracteristicasBaixas: [
      'Reservado e quieto',
      'Prefere solidão',
      'Introspectivo',
      'Ouvinte atento',
      'Pensativo antes de agir'
    ],
    cor: 'from-yellow-500 to-orange-600',
    icone: 'Users',
    carreirasCompativeis: ['Vendedor', 'Político', 'Apresentador', 'Professor', 'Relações Públicas']
  },
  A: {
    nome: 'Amabilidade',
    nomeCompleto: 'Amabilidade',
    descricaoAlta: 'Cooperativo, empático, preocupado com outros',
    descricaoBaixa: 'Competitivo, direto, focado em resultados próprios',
    caracteristicasAltas: [
      'Altruísta e prestativo',
      'Empático e compassivo',
      'Cooperativo',
      'Confiante nos outros',
      'Harmonioso'
    ],
    caracteristicasBaixas: [
      'Competitivo',
      'Cético e desconfiado',
      'Direto e franco',
      'Focado em si mesmo',
      'Pode ser confrontador'
    ],
    cor: 'from-green-500 to-emerald-600',
    icone: 'Heart',
    carreirasCompativeis: ['Psicólogo', 'Enfermeiro', 'Assistente Social', 'RH', 'Terapeuta']
  },
  N: {
    nome: 'Neuroticismo',
    nomeCompleto: 'Neuroticismo (Estabilidade Emocional)',
    descricaoAlta: 'Sensível, reativo emocionalmente, propenso ao estresse',
    descricaoBaixa: 'Emocionalmente estável, calmo, resiliente',
    caracteristicasAltas: [
      'Sensível ao estresse',
      'Experimenta emoções intensas',
      'Propenso à ansiedade',
      'Pode ser temperamental',
      'Autocrítico'
    ],
    caracteristicasBaixas: [
      'Emocionalmente estável',
      'Calmo sob pressão',
      'Resiliente',
      'Otimista',
      'Seguro de si'
    ],
    cor: 'from-red-500 to-pink-600',
    icone: 'Brain',
    carreirasCompativeis: ['Artista', 'Escritor', 'Terapeuta', 'Músico', 'Ator']
  }
};

// ============================================================
// 16 TIPOS DE PERSONALIDADE (Baseado em Jung/MBTI)
// ============================================================

export type CognitiveFunction = 'Se' | 'Si' | 'Ne' | 'Ni' | 'Te' | 'Ti' | 'Fe' | 'Fi';
export type EnergyDirection = 'E' | 'I'; // Extroversão ou Introversão
export type InformationGathering = 'S' | 'N'; // Sensação ou Intuição
export type DecisionMaking = 'T' | 'F'; // Pensamento ou Sentimento
export type LifestyleApproach = 'J' | 'P'; // Julgamento ou Percepção

export type PersonalityType16 = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface PersonalityType16Result {
  readonly type: PersonalityType16;
  readonly dimensions: {
    readonly energyDirection: { E: number; I: number };
    readonly informationGathering: { S: number; N: number };
    readonly decisionMaking: { T: number; F: number };
    readonly lifestyleApproach: { J: number; P: number };
  };
  readonly cognitiveFunctions: {
    readonly dominant: CognitiveFunction;
    readonly auxiliary: CognitiveFunction;
    readonly tertiary: CognitiveFunction;
    readonly inferior: CognitiveFunction;
  };
  readonly descricao: string;
  readonly titulo: string;
  readonly arquetipo: string;
  readonly pontosFortes: string[];
  readonly pontosADesenvolver: string[];
  readonly motivadores: string[];
  readonly estressores: string[];
  readonly comunicacao: string;
  readonly lideranca: string;
  readonly carreiraIdeal: string[];
  readonly relacionamentos: string;
  readonly famosos: string[];
  readonly raridade: number; // Percentual da população
}

export const PERSONALITY_16_INFO: Record<PersonalityType16, {
  titulo: string;
  arquetipo: string;
  descricao: string;
  emojis: string;
  cor: string;
  corSecundaria: string;
  cognitiveFunctions: CognitiveFunction[];
  pontosFortes: string[];
  areasDesenvolvimento: string[];
  carreirasIdeais: string[];
  famosos: string[];
  raridade: number;
  compatibilidadeIdeal: PersonalityType16[];
  desafiosComum: PersonalityType16[];
}> = {
  // ANALISTAS
  INTJ: {
    titulo: 'O Arquiteto',
    arquetipo: 'Estrategista Visionário',
    descricao: 'Pensadores imaginativos e estratégicos, com um plano para tudo.',
    emojis: '🧠♟️',
    cor: 'from-purple-600 to-indigo-700',
    corSecundaria: 'bg-purple-500/20',
    cognitiveFunctions: ['Ni', 'Te', 'Fi', 'Se'],
    pontosFortes: ['Pensamento estratégico', 'Independência', 'Determinação', 'Visão de longo prazo'],
    areasDesenvolvimento: ['Habilidades sociais', 'Flexibilidade', 'Paciência com outros'],
    carreirasIdeais: ['CEO', 'Cientista', 'Arquiteto', 'Engenheiro de Software'],
    famosos: ['Elon Musk', 'Isaac Newton', 'Nikola Tesla'],
    raridade: 2.1,
    compatibilidadeIdeal: ['ENFP', 'ENTP'],
    desafiosComum: ['ESFP', 'ESFJ']
  },
  INTP: {
    titulo: 'O Lógico',
    arquetipo: 'Pensador Analítico',
    descricao: 'Inventores inovadores com sede insaciável por conhecimento.',
    emojis: '🔬💡',
    cor: 'from-cyan-600 to-blue-700',
    corSecundaria: 'bg-cyan-500/20',
    cognitiveFunctions: ['Ti', 'Ne', 'Si', 'Fe'],
    pontosFortes: ['Análise lógica', 'Criatividade', 'Objetividade', 'Originalidade'],
    areasDesenvolvimento: ['Expressão emocional', 'Ação prática', 'Sensibilidade social'],
    carreirasIdeais: ['Pesquisador', 'Programador', 'Filósofo', 'Analista de Dados'],
    famosos: ['Albert Einstein', 'Bill Gates', 'Marie Curie'],
    raridade: 3.3,
    compatibilidadeIdeal: ['ENTJ', 'ENFJ'],
    desafiosComum: ['ESFJ', 'ISFJ']
  },
  ENTJ: {
    titulo: 'O Comandante',
    arquetipo: 'Líder Nato',
    descricao: 'Líderes audaciosos, imaginativos e determinados.',
    emojis: '👔🎯',
    cor: 'from-red-600 to-rose-700',
    corSecundaria: 'bg-red-500/20',
    cognitiveFunctions: ['Te', 'Ni', 'Se', 'Fi'],
    pontosFortes: ['Liderança', 'Eficiência', 'Confiança', 'Visão estratégica'],
    areasDesenvolvimento: ['Empatia', 'Paciência', 'Delegação'],
    carreirasIdeais: ['Executivo', 'Empreendedor', 'Advogado', 'Consultor'],
    famosos: ['Steve Jobs', 'Margaret Thatcher', 'Napoleon Bonaparte'],
    raridade: 1.8,
    compatibilidadeIdeal: ['INTP', 'INFP'],
    desafiosComum: ['ISFP', 'INFP']
  },
  ENTP: {
    titulo: 'O Inovador',
    arquetipo: 'Debatedor Curioso',
    descricao: 'Pensadores inteligentes e curiosos que não resistem a um desafio intelectual.',
    emojis: '🎭💫',
    cor: 'from-orange-500 to-amber-600',
    corSecundaria: 'bg-orange-500/20',
    cognitiveFunctions: ['Ne', 'Ti', 'Fe', 'Si'],
    pontosFortes: ['Inovação', 'Argumentação', 'Adaptabilidade', 'Carisma'],
    areasDesenvolvimento: ['Foco', 'Conclusão de projetos', 'Sensibilidade'],
    carreirasIdeais: ['Empreendedor', 'Advogado', 'Inventor', 'Consultor'],
    famosos: ['Leonardo da Vinci', 'Thomas Edison', 'Sócrates'],
    raridade: 3.2,
    compatibilidadeIdeal: ['INTJ', 'INFJ'],
    desafiosComum: ['ISFJ', 'ISTJ']
  },
  
  // DIPLOMATAS
  INFJ: {
    titulo: 'O Advogado',
    arquetipo: 'Visionário Idealista',
    descricao: 'Idealistas quietos e místicos, mas muito inspiradores e incansáveis.',
    emojis: '🔮✨',
    cor: 'from-emerald-600 to-teal-700',
    corSecundaria: 'bg-emerald-500/20',
    cognitiveFunctions: ['Ni', 'Fe', 'Ti', 'Se'],
    pontosFortes: ['Empatia profunda', 'Visão', 'Convicção', 'Criatividade'],
    areasDesenvolvimento: ['Autocuidado', 'Limites pessoais', 'Praticidade'],
    carreirasIdeais: ['Conselheiro', 'Psicólogo', 'Escritor', 'RH'],
    famosos: ['Martin Luther King Jr.', 'Nelson Mandela', 'Madre Teresa'],
    raridade: 1.5,
    compatibilidadeIdeal: ['ENTP', 'ENFP'],
    desafiosComum: ['ESTP', 'ISTP']
  },
  INFP: {
    titulo: 'O Mediador',
    arquetipo: 'Poeta Idealista',
    descricao: 'Almas poéticas, bondosas e altruístas, sempre prontas para ajudar uma boa causa.',
    emojis: '🌸🎨',
    cor: 'from-pink-500 to-rose-600',
    corSecundaria: 'bg-pink-500/20',
    cognitiveFunctions: ['Fi', 'Ne', 'Si', 'Te'],
    pontosFortes: ['Empatia', 'Criatividade', 'Autenticidade', 'Idealismo'],
    areasDesenvolvimento: ['Assertividade', 'Praticidade', 'Tomada de decisão'],
    carreirasIdeais: ['Escritor', 'Artista', 'Psicólogo', 'Designer'],
    famosos: ['William Shakespeare', 'J.R.R. Tolkien', 'Johnny Depp'],
    raridade: 4.4,
    compatibilidadeIdeal: ['ENTJ', 'ENFJ'],
    desafiosComum: ['ESTJ', 'ENTJ']
  },
  ENFJ: {
    titulo: 'O Protagonista',
    arquetipo: 'Mentor Carismático',
    descricao: 'Líderes carismáticos e inspiradores, capazes de hipnotizar seus ouvintes.',
    emojis: '🌟👑',
    cor: 'from-yellow-500 to-amber-600',
    corSecundaria: 'bg-yellow-500/20',
    cognitiveFunctions: ['Fe', 'Ni', 'Se', 'Ti'],
    pontosFortes: ['Carisma', 'Empatia', 'Liderança inspiradora', 'Comunicação'],
    areasDesenvolvimento: ['Autocuidado', 'Objetividade', 'Aceitar críticas'],
    carreirasIdeais: ['Treinador', 'Professor', 'Político', 'RH'],
    famosos: ['Barack Obama', 'Oprah Winfrey', 'Martin Luther King Jr.'],
    raridade: 2.5,
    compatibilidadeIdeal: ['INTP', 'INFP'],
    desafiosComum: ['ISTP', 'ESTP']
  },
  ENFP: {
    titulo: 'O Ativista',
    arquetipo: 'Espírito Livre',
    descricao: 'Espíritos livres entusiastas, criativos e sociáveis.',
    emojis: '🦋🌈',
    cor: 'from-amber-500 to-yellow-600',
    corSecundaria: 'bg-amber-500/20',
    cognitiveFunctions: ['Ne', 'Fi', 'Te', 'Si'],
    pontosFortes: ['Entusiasmo', 'Criatividade', 'Sociabilidade', 'Otimismo'],
    areasDesenvolvimento: ['Foco', 'Organização', 'Seguir em frente'],
    carreirasIdeais: ['Empreendedor', 'Jornalista', 'Ator', 'Marketing'],
    famosos: ['Robin Williams', 'Will Smith', 'Robert Downey Jr.'],
    raridade: 8.1,
    compatibilidadeIdeal: ['INTJ', 'INFJ'],
    desafiosComum: ['ISTJ', 'ESTJ']
  },
  
  // SENTINELAS
  ISTJ: {
    titulo: 'O Logístico',
    arquetipo: 'Guardião Tradicional',
    descricao: 'Indivíduos práticos e focados em fatos, cuja confiabilidade não pode ser questionada.',
    emojis: '📋✅',
    cor: 'from-slate-600 to-gray-700',
    corSecundaria: 'bg-slate-500/20',
    cognitiveFunctions: ['Si', 'Te', 'Fi', 'Ne'],
    pontosFortes: ['Confiabilidade', 'Organização', 'Dedicação', 'Honestidade'],
    areasDesenvolvimento: ['Flexibilidade', 'Expressão emocional', 'Abertura a mudanças'],
    carreirasIdeais: ['Contador', 'Auditor', 'Militar', 'Administrador'],
    famosos: ['George Washington', 'Angela Merkel', 'Warren Buffett'],
    raridade: 11.6,
    compatibilidadeIdeal: ['ESFP', 'ESTP'],
    desafiosComum: ['ENFP', 'ENTP']
  },
  ISFJ: {
    titulo: 'O Defensor',
    arquetipo: 'Protetor Dedicado',
    descricao: 'Protetores muito dedicados e calorosos, sempre prontos para defender seus entes queridos.',
    emojis: '🛡️💝',
    cor: 'from-blue-500 to-indigo-600',
    corSecundaria: 'bg-blue-500/20',
    cognitiveFunctions: ['Si', 'Fe', 'Ti', 'Ne'],
    pontosFortes: ['Lealdade', 'Confiabilidade', 'Empatia', 'Atenção aos detalhes'],
    areasDesenvolvimento: ['Assertividade', 'Aceitar mudanças', 'Autocuidado'],
    carreirasIdeais: ['Enfermeiro', 'Professor', 'Assistente Social', 'RH'],
    famosos: ['Rainha Elizabeth II', 'Rosa Parks', 'Madre Teresa'],
    raridade: 13.8,
    compatibilidadeIdeal: ['ESTP', 'ESFP'],
    desafiosComum: ['ENTP', 'INTP']
  },
  ESTJ: {
    titulo: 'O Executivo',
    arquetipo: 'Administrador Nato',
    descricao: 'Administradores excelentes, insuperáveis em gerenciar coisas – ou pessoas.',
    emojis: '📊💼',
    cor: 'from-red-500 to-orange-600',
    corSecundaria: 'bg-red-500/20',
    cognitiveFunctions: ['Te', 'Si', 'Ne', 'Fi'],
    pontosFortes: ['Organização', 'Liderança', 'Dedicação', 'Confiabilidade'],
    areasDesenvolvimento: ['Flexibilidade', 'Empatia', 'Delegação'],
    carreirasIdeais: ['Gerente', 'Juiz', 'Policial', 'Diretor'],
    famosos: ['Henry Ford', 'Michelle Obama', 'John D. Rockefeller'],
    raridade: 8.7,
    compatibilidadeIdeal: ['ISFP', 'ISTP'],
    desafiosComum: ['INFP', 'ENFP']
  },
  ESFJ: {
    titulo: 'O Cônsul',
    arquetipo: 'Anfitrião Carinhoso',
    descricao: 'Pessoas extraordinariamente carinhosas, sociais e populares, sempre prontas a ajudar.',
    emojis: '🤝🏠',
    cor: 'from-green-500 to-teal-600',
    corSecundaria: 'bg-green-500/20',
    cognitiveFunctions: ['Fe', 'Si', 'Ne', 'Ti'],
    pontosFortes: ['Cooperação', 'Lealdade', 'Sensibilidade', 'Sociabilidade'],
    areasDesenvolvimento: ['Independência', 'Aceitar críticas', 'Flexibilidade'],
    carreirasIdeais: ['Assistente Social', 'Enfermeiro', 'Professor', 'Eventos'],
    famosos: ['Taylor Swift', 'Bill Clinton', 'Jennifer Lopez'],
    raridade: 12.3,
    compatibilidadeIdeal: ['ISTP', 'ISFP'],
    desafiosComum: ['INTP', 'INTJ']
  },
  
  // EXPLORADORES
  ISTP: {
    titulo: 'O Virtuoso',
    arquetipo: 'Artesão Prático',
    descricao: 'Experimentadores ousados e práticos, mestres em todo tipo de ferramenta.',
    emojis: '🔧🏍️',
    cor: 'from-gray-600 to-zinc-700',
    corSecundaria: 'bg-gray-500/20',
    cognitiveFunctions: ['Ti', 'Se', 'Ni', 'Fe'],
    pontosFortes: ['Resolução de problemas', 'Praticidade', 'Adaptabilidade', 'Calma'],
    areasDesenvolvimento: ['Expressão emocional', 'Planejamento', 'Compromisso'],
    carreirasIdeais: ['Engenheiro', 'Mecânico', 'Piloto', 'Técnico'],
    famosos: ['Michael Jordan', 'Clint Eastwood', 'Bruce Lee'],
    raridade: 5.4,
    compatibilidadeIdeal: ['ESTJ', 'ESFJ'],
    desafiosComum: ['ENFJ', 'INFJ']
  },
  ISFP: {
    titulo: 'O Aventureiro',
    arquetipo: 'Artista Sensível',
    descricao: 'Artistas flexíveis e charmosos, sempre prontos para explorar e experimentar algo novo.',
    emojis: '🎨🌺',
    cor: 'from-pink-500 to-purple-600',
    corSecundaria: 'bg-pink-500/20',
    cognitiveFunctions: ['Fi', 'Se', 'Ni', 'Te'],
    pontosFortes: ['Criatividade', 'Sensibilidade', 'Harmonia', 'Espontaneidade'],
    areasDesenvolvimento: ['Planejamento', 'Assertividade', 'Lidar com conflitos'],
    carreirasIdeais: ['Designer', 'Músico', 'Chef', 'Fotógrafo'],
    famosos: ['Michael Jackson', 'Prince', 'Frida Kahlo'],
    raridade: 8.8,
    compatibilidadeIdeal: ['ESTJ', 'ENTJ'],
    desafiosComum: ['ENTJ', 'ESTJ']
  },
  ESTP: {
    titulo: 'O Empreendedor',
    arquetipo: 'Doer Energético',
    descricao: 'Pessoas inteligentes, enérgicas e muito perceptivas, que verdadeiramente gostam de viver no limite.',
    emojis: '🎲🚀',
    cor: 'from-orange-500 to-red-600',
    corSecundaria: 'bg-orange-500/20',
    cognitiveFunctions: ['Se', 'Ti', 'Fe', 'Ni'],
    pontosFortes: ['Ação rápida', 'Adaptabilidade', 'Pragmatismo', 'Persuasão'],
    areasDesenvolvimento: ['Paciência', 'Planejamento', 'Sensibilidade'],
    carreirasIdeais: ['Vendedor', 'Empreendedor', 'Atleta', 'Marketing'],
    famosos: ['Donald Trump', 'Madonna', 'Ernest Hemingway'],
    raridade: 4.3,
    compatibilidadeIdeal: ['ISFJ', 'ISTJ'],
    desafiosComum: ['INFJ', 'INFP']
  },
  ESFP: {
    titulo: 'O Animador',
    arquetipo: 'Entertainer Nato',
    descricao: 'Entertainers espontâneos, energéticos e entusiasmados – a vida nunca é chata perto deles.',
    emojis: '🎉🎭',
    cor: 'from-yellow-400 to-orange-500',
    corSecundaria: 'bg-yellow-500/20',
    cognitiveFunctions: ['Se', 'Fi', 'Te', 'Ni'],
    pontosFortes: ['Entusiasmo', 'Sociabilidade', 'Praticidade', 'Otimismo'],
    areasDesenvolvimento: ['Foco', 'Planejamento', 'Lidar com críticas'],
    carreirasIdeais: ['Ator', 'Vendedor', 'Professor', 'Eventos'],
    famosos: ['Marilyn Monroe', 'Elvis Presley', 'Jamie Oliver'],
    raridade: 8.5,
    compatibilidadeIdeal: ['ISTJ', 'ISFJ'],
    desafiosComum: ['INTJ', 'INTP']
  }
};

// ============================================================
// INTEGRAÇÃO DNA + PERSONALIDADE
// ============================================================

export interface PersonalityDNAIntegration {
  readonly bigFive: BigFiveResult;
  readonly type16: PersonalityType16Result;
  readonly dnaCorrelations: {
    readonly pilar: string;
    readonly correlacaoBigFive: BigFiveTrait[];
    readonly correlacaoType16: string;
    readonly intensidade: number; // 0-100
  }[];
  readonly sinergias: string[];
  readonly conflitosInternos: string[];
  readonly recomendacoesDesenvolvimento: string[];
  readonly perfilUnificado: string;
  readonly arquetipoCombinado: string;
}

// ============================================================
// QUESTÕES PARA TESTES
// ============================================================

export interface PersonalityQuestion {
  readonly id: string;
  readonly texto: string;
  readonly textoContrario?: string; // Para escala bipolar
  readonly dimensao: BigFiveTrait | CognitiveFunction | 'E_I' | 'S_N' | 'T_F' | 'J_P';
  readonly tipo: 'likert' | 'bipolar' | 'escolha_forcada' | 'situacional';
  readonly peso: number;
  readonly faceta?: keyof BigFiveFacets;
  readonly opcoes?: {
    texto: string;
    valor: number;
    dimensao?: string;
  }[];
}

export interface PersonalityTestConfig {
  readonly id: string;
  readonly nome: string;
  readonly tipo: 'big_five' | 'type_16' | 'integrado';
  readonly descricao: string;
  readonly tempoEstimado: number;
  readonly totalQuestoes: number;
  readonly instrucoes: string;
  readonly questoes: PersonalityQuestion[];
}

// ============================================================
// COMPATIBILIDADE E MATCHING
// ============================================================

export interface PersonalityMatch {
  readonly candidatoType: PersonalityType16;
  readonly vagaType: PersonalityType16;
  readonly compatibilidade: number; // 0-100
  readonly pontosAlinhamento: string[];
  readonly pontosAtencao: string[];
  readonly recomendacoes: string[];
  readonly dinamicaEquipe: string;
}

export interface TeamPersonalityAnalysis {
  readonly membros: {
    id: string;
    nome: string;
    type: PersonalityType16;
    bigFive: BigFiveScores;
  }[];
  readonly distribuicaoTipos: Record<PersonalityType16, number>;
  readonly equilibrio: {
    analistas: number;
    diplomatas: number;
    sentinelas: number;
    exploradores: number;
  };
  readonly sinergias: string[];
  readonly lacunas: string[];
  readonly recomendacoesContratacao: PersonalityType16[];
  readonly dinamicaGeral: string;
}
