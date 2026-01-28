/**
 * @fileoverview Tipos e interfaces para testes de personalidade
 * Inclui Big Five (OCEAN), MBTI e Eneagrama
 */

// ================================
// BIG FIVE (OCEAN)
// ================================

export interface BigFiveFacet {
  name: string;
  score: number; // 0-100
  description: string;
}

export interface BigFiveDimension {
  dimension: 'openness' | 'conscientiousness' | 'extraversion' | 'agreeableness' | 'neuroticism';
  label: string;
  score: number; // 0-100
  percentile: number; // 0-100
  level: 'muito_baixo' | 'baixo' | 'medio' | 'alto' | 'muito_alto';
  facets: BigFiveFacet[];
  strengths: string[];
  challenges: string[];
}

export interface BigFiveResult {
  dimensions: BigFiveDimension[];
  dominantTraits: string[];
  personalitySummary: string;
  workStyle: string;
  communicationStyle: string;
  leadershipStyle: string;
  teamRole: string;
  stressResponse: string;
  developmentAreas: string[];
  consistencyScore: number; // 0-100
  confidence: number; // 0-100
  completedAt: string;
}

// ================================
// MBTI (16 Personalidades)
// ================================

export type MBTIDichotomy = 
  | 'E' | 'I'  // Extraversion vs Introversion
  | 'S' | 'N'  // Sensing vs Intuition
  | 'T' | 'F'  // Thinking vs Feeling
  | 'J' | 'P'; // Judging vs Perceiving

export type MBTIType = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP';

export interface MBTIDichotomyScore {
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  leftLabel: string;
  rightLabel: string;
  leftScore: number; // 0-100 (0 = full left, 100 = full right)
  clarity: number; // 0-100 (how clear the preference is)
  dominantSide: MBTIDichotomy;
}

export interface MBTICognitiveFunction {
  function: string; // Ni, Ne, Si, Se, Ti, Te, Fi, Fe
  label: string;
  strength: number; // 0-100
  description: string;
  role: 'dominant' | 'auxiliary' | 'tertiary' | 'inferior';
}

export interface MBTIResult {
  type: MBTIType;
  typeName: string;
  typeNickname: string;
  dichotomies: MBTIDichotomyScore[];
  cognitiveFunctions: MBTICognitiveFunction[];
  description: string;
  strengths: string[];
  weaknesses: string[];
  careerSuggestions: string[];
  communicationTips: string[];
  workEnvironment: string;
  leadershipStyle: string;
  conflictStyle: string;
  stressPatterns: string[];
  growthAreas: string[];
  compatibility: {
    bestMatches: MBTIType[];
    challengingMatches: MBTIType[];
  };
  consistencyScore: number;
  confidence: number;
  completedAt: string;
}

// ================================
// ENEAGRAMA
// ================================

export type EnneagramType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export type EnneagramWing = `${EnneagramType}w${EnneagramType}`;

export type EnneagramTriad = 'instintivo' | 'emocional' | 'mental';

export type EnneagramInstinct = 'autopreservacao' | 'social' | 'sexual';

export type EnneagramHealthLevel = 
  | 'muito_saudavel' 
  | 'saudavel' 
  | 'medio' 
  | 'nao_saudavel' 
  | 'muito_nao_saudavel';

export interface EnneagramTypeScore {
  type: EnneagramType;
  name: string;
  score: number; // 0-100
  isCore: boolean;
  isWing: boolean;
}

export interface EnneagramIntegration {
  stressDirection: EnneagramType;
  growthDirection: EnneagramType;
  stressBehaviors: string[];
  growthBehaviors: string[];
}

export interface EnneagramResult {
  coreType: EnneagramType;
  typeName: string;
  typeDescription: string;
  wing: EnneagramWing;
  wingInfluence: number; // 0-100
  triad: EnneagramTriad;
  dominantInstinct: EnneagramInstinct;
  instinctStack: EnneagramInstinct[];
  healthLevel: EnneagramHealthLevel;
  typeScores: EnneagramTypeScore[];
  integration: EnneagramIntegration;
  coreMotivation: string;
  coreFear: string;
  coreDesire: string;
  basicVice: string;
  basicVirtue: string;
  strengths: string[];
  challenges: string[];
  blindSpots: string[];
  communicationStyle: string;
  leadershipStyle: string;
  conflictBehavior: string;
  careerFit: string[];
  developmentPath: string[];
  compatibleTypes: EnneagramType[];
  challengingTypes: EnneagramType[];
  consistencyScore: number;
  confidence: number;
  completedAt: string;
}

// ================================
// QUESTÕES
// ================================

export interface PersonalityQuestion {
  id: string;
  text: string;
  framework: 'bigfive' | 'mbti' | 'enneagram';
  dimension?: string; // Ex: 'openness', 'EI', '1'
  facet?: string;
  reverse?: boolean; // Se a pontuação deve ser invertida
  options: {
    value: number;
    label: string;
  }[];
  validationPair?: string; // ID de questão para validação de consistência
}

export interface PersonalityAnswer {
  questionId: string;
  value: number;
  responseTime: number; // ms
}

// ================================
// ASSESSMENT CONSOLIDADO
// ================================

export interface PersonalityAssessment {
  id: string;
  candidatoId?: string;
  processoId?: string;
  frameworks: {
    bigFive?: BigFiveResult;
    mbti?: MBTIResult;
    enneagram?: EnneagramResult;
  };
  answers: PersonalityAnswer[];
  totalTime: number;
  startedAt: string;
  completedAt: string;
  overallConsistency: number;
  crossFrameworkInsights?: string[];
}

// ================================
// METADATA DOS TIPOS
// ================================

export const MBTI_TYPE_INFO: Record<MBTIType, { name: string; nickname: string; description: string }> = {
  INTJ: { 
    name: 'Arquiteto', 
    nickname: 'O Estrategista',
    description: 'Pensadores imaginativos e estratégicos, com um plano para tudo.'
  },
  INTP: { 
    name: 'Lógico', 
    nickname: 'O Pensador',
    description: 'Inventores inovadores com uma sede insaciável por conhecimento.'
  },
  ENTJ: { 
    name: 'Comandante', 
    nickname: 'O Líder',
    description: 'Líderes ousados, imaginativos e com forte vontade.'
  },
  ENTP: { 
    name: 'Inovador', 
    nickname: 'O Visionário',
    description: 'Pensadores espertos e curiosos que não resistem a um desafio intelectual.'
  },
  INFJ: { 
    name: 'Advogado', 
    nickname: 'O Conselheiro',
    description: 'Idealistas quietos e místicos, porém muito inspiradores e incansáveis.'
  },
  INFP: { 
    name: 'Mediador', 
    nickname: 'O Curador',
    description: 'Pessoas poéticas, bondosas e altruístas, sempre prontas a ajudar uma boa causa.'
  },
  ENFJ: { 
    name: 'Protagonista', 
    nickname: 'O Professor',
    description: 'Líderes carismáticos e inspiradores, capazes de hipnotizar seus ouvintes.'
  },
  ENFP: { 
    name: 'Ativista', 
    nickname: 'O Campeão',
    description: 'Espíritos livres entusiastas, criativos e sociáveis.'
  },
  ISTJ: { 
    name: 'Logístico', 
    nickname: 'O Inspetor',
    description: 'Indivíduos práticos e focados em fatos, cuja confiabilidade não pode ser questionada.'
  },
  ISFJ: { 
    name: 'Defensor', 
    nickname: 'O Protetor',
    description: 'Protetores muito dedicados e calorosos, sempre prontos a defender seus entes queridos.'
  },
  ESTJ: { 
    name: 'Executivo', 
    nickname: 'O Supervisor',
    description: 'Administradores excelentes, insuperáveis em gerenciar coisas ou pessoas.'
  },
  ESFJ: { 
    name: 'Cônsul', 
    nickname: 'O Provedor',
    description: 'Pessoas extremamente atenciosas, sociais e populares, sempre prontas a ajudar.'
  },
  ISTP: { 
    name: 'Virtuoso', 
    nickname: 'O Artesão',
    description: 'Experimentadores ousados e práticos, mestres em todos os tipos de ferramentas.'
  },
  ISFP: { 
    name: 'Aventureiro', 
    nickname: 'O Compositor',
    description: 'Artistas flexíveis e charmosos, sempre prontos para explorar e experimentar algo novo.'
  },
  ESTP: { 
    name: 'Empreendedor', 
    nickname: 'O Promotor',
    description: 'Pessoas inteligentes, enérgicas e muito perceptivas, que realmente gostam de viver no limite.'
  },
  ESFP: { 
    name: 'Animador', 
    nickname: 'O Performer',
    description: 'Pessoas espontâneas, enérgicas e entusiastas - a vida nunca é chata perto deles.'
  },
};

export const ENNEAGRAM_TYPE_INFO: Record<EnneagramType, { 
  name: string; 
  description: string; 
  motivation: string;
  fear: string;
}> = {
  1: { 
    name: 'O Perfeccionista', 
    description: 'Éticos, dedicados e confiáveis. Lutam por melhorar tudo.',
    motivation: 'Ser bom, ter integridade, melhorar o mundo',
    fear: 'Ser corrupto, mau ou imperfeito'
  },
  2: { 
    name: 'O Prestativo', 
    description: 'Generosos, carinhosos e possessivos. Querem ser amados.',
    motivation: 'Ser amado e apreciado',
    fear: 'Ser indesejado ou não ser necessário'
  },
  3: { 
    name: 'O Realizador', 
    description: 'Adaptáveis, excitáveis e orientados ao sucesso.',
    motivation: 'Ser valioso e bem-sucedido',
    fear: 'Ser sem valor ou fracassado'
  },
  4: { 
    name: 'O Individualista', 
    description: 'Expressivos, dramáticos e autocentrados. Buscam identidade.',
    motivation: 'Encontrar identidade e significado',
    fear: 'Não ter identidade ou significado pessoal'
  },
  5: { 
    name: 'O Investigador', 
    description: 'Perspicazes, inovadores e isolados. Buscam conhecimento.',
    motivation: 'Ser competente e capaz',
    fear: 'Ser inútil, incapaz ou incompetente'
  },
  6: { 
    name: 'O Leal', 
    description: 'Engajados, responsáveis e ansiosos. Buscam segurança.',
    motivation: 'Ter segurança e suporte',
    fear: 'Estar sem suporte ou orientação'
  },
  7: { 
    name: 'O Entusiasta', 
    description: 'Espontâneos, versáteis e distraídos. Buscam experiências.',
    motivation: 'Ser feliz, satisfeito e livre',
    fear: 'Ser privado ou preso na dor'
  },
  8: { 
    name: 'O Desafiador', 
    description: 'Autoconfiantes, decididos e confrontadores. Buscam controle.',
    motivation: 'Proteger a si mesmo, estar no controle',
    fear: 'Ser controlado ou prejudicado por outros'
  },
  9: { 
    name: 'O Pacificador', 
    description: 'Receptivos, tranquilizadores e complacentes. Buscam paz.',
    motivation: 'Manter paz interior e harmonia',
    fear: 'Perda e separação, fragmentação'
  },
};

export const BIG_FIVE_DIMENSION_INFO: Record<string, { 
  label: string; 
  description: string;
  highTraits: string[];
  lowTraits: string[];
}> = {
  openness: {
    label: 'Abertura à Experiência',
    description: 'Curiosidade intelectual, criatividade e preferência por novidade.',
    highTraits: ['Criativo', 'Curioso', 'Imaginativo', 'Aventureiro'],
    lowTraits: ['Prático', 'Convencional', 'Rotineiro', 'Concreto']
  },
  conscientiousness: {
    label: 'Conscienciosidade',
    description: 'Organização, disciplina e orientação para metas.',
    highTraits: ['Organizado', 'Confiável', 'Disciplinado', 'Ambicioso'],
    lowTraits: ['Flexível', 'Espontâneo', 'Casual', 'Adaptável']
  },
  extraversion: {
    label: 'Extroversão',
    description: 'Sociabilidade, assertividade e busca por estimulação externa.',
    highTraits: ['Sociável', 'Energético', 'Assertivo', 'Comunicativo'],
    lowTraits: ['Reservado', 'Reflexivo', 'Independente', 'Introspectivo']
  },
  agreeableness: {
    label: 'Amabilidade',
    description: 'Cooperação, confiança e preocupação com harmonia social.',
    highTraits: ['Cooperativo', 'Confiável', 'Empático', 'Altruísta'],
    lowTraits: ['Competitivo', 'Direto', 'Cético', 'Pragmático']
  },
  neuroticism: {
    label: 'Neuroticismo',
    description: 'Tendência a experienciar emoções negativas e instabilidade.',
    highTraits: ['Sensível', 'Emotivo', 'Vigilante', 'Intenso'],
    lowTraits: ['Calmo', 'Estável', 'Resiliente', 'Equilibrado']
  }
};
