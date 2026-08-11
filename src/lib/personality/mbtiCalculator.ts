/**
 * @fileoverview MBTI personality calculator
 */

import {
  MBTIResult,
  MBTIType,
  MBTIDichotomyScore,
  MBTICognitiveFunction,
  PersonalityAnswer,
  MBTI_TYPE_INFO,
} from '@/types/personality';

import { MBTI_QUESTIONS } from '@/data/personalityQuestions';
import { normalizeScore } from './utils';

export function calculateMBTIResult(answers: PersonalityAnswer[]): MBTIResult {
  const dichotomyScores: Record<string, { left: number[]; right: number[] }> = {
    EI: { left: [], right: [] },
    SN: { left: [], right: [] },
    TF: { left: [], right: [] },
    JP: { left: [], right: [] },
  };

  MBTI_QUESTIONS.forEach(question => {
    const answer = answers.find(a => a.questionId === question.id);
    if (!answer || !question.dimension) return;
    const dim = dichotomyScores[question.dimension];
    if (!dim) return;
    if (question.reverse) { dim.right.push(answer.value); } else { dim.left.push(answer.value); }
  });

  const dichotomies: MBTIDichotomyScore[] = [
    calculateDichotomy('EI', 'Extroversão', 'Introversão', dichotomyScores['EI']!),
    calculateDichotomy('SN', 'Sensação', 'Intuição', dichotomyScores['SN']!),
    calculateDichotomy('TF', 'Pensamento', 'Sentimento', dichotomyScores['TF']!),
    calculateDichotomy('JP', 'Julgamento', 'Percepção', dichotomyScores['JP']!),
  ];

  const type = (
    (dichotomies[0]?.dominantSide || 'E') +
    (dichotomies[1]?.dominantSide || 'S') +
    (dichotomies[2]?.dominantSide || 'T') +
    (dichotomies[3]?.dominantSide || 'J')
  ) as MBTIType;

  const typeInfo = MBTI_TYPE_INFO[type];
  const cognitiveFunctions = calculateCognitiveFunctions(type);
  const avgClarity = dichotomies.reduce((sum, d) => sum + d.clarity, 0) / 4;

  return {
    type,
    typeName: typeInfo?.name || type,
    typeNickname: typeInfo?.nickname || '',
    dichotomies,
    cognitiveFunctions,
    description: typeInfo?.description || '',
    strengths: getMBTIStrengths(type),
    weaknesses: getMBTIWeaknesses(type),
    careerSuggestions: getMBTICareerSuggestions(type),
    communicationTips: getMBTICommunicationTips(),
    workEnvironment: getMBTIWorkEnvironment(type),
    leadershipStyle: getMBTILeadershipStyle(type),
    conflictStyle: getMBTIConflictStyle(type),
    stressPatterns: getMBTIStressPatterns(),
    growthAreas: getMBTIGrowthAreas(),
    compatibility: {
      bestMatches: getMBTIBestMatches(type),
      challengingMatches: getMBTIChallengingMatches(type),
    },
    consistencyScore: Math.round(avgClarity),
    confidence: Math.round(avgClarity * 0.95),
    completedAt: new Date().toISOString(),
  };
}

function calculateDichotomy(
  dimension: 'EI' | 'SN' | 'TF' | 'JP',
  leftLabel: string,
  rightLabel: string,
  scores: { left: number[]; right: number[] }
): MBTIDichotomyScore {
  const leftAvg = scores.left.length > 0 ? scores.left.reduce((a, b) => a + b, 0) / scores.left.length : 4;
  const rightAvg = scores.right.length > 0 ? scores.right.reduce((a, b) => a + b, 0) / scores.right.length : 4;
  const leftNorm = normalizeScore(leftAvg, 1, 7);
  const rightNorm = normalizeScore(rightAvg, 1, 7);
  const totalScore = Math.round((100 - leftNorm + rightNorm) / 2);
  const clarity = Math.abs(totalScore - 50) * 2;
  const leftLetter = dimension[0] as 'E' | 'S' | 'T' | 'J';
  const rightLetter = dimension[1] as 'I' | 'N' | 'F' | 'P';
  const dominantSide = totalScore < 50 ? leftLetter : rightLetter;

  return { dimension, leftLabel, rightLabel, leftScore: totalScore, clarity, dominantSide };
}

function calculateCognitiveFunctions(type: MBTIType): MBTICognitiveFunction[] {
  const functionStacks: Record<MBTIType, string[]> = {
    INTJ: ['Ni', 'Te', 'Fi', 'Se'], INTP: ['Ti', 'Ne', 'Si', 'Fe'],
    ENTJ: ['Te', 'Ni', 'Se', 'Fi'], ENTP: ['Ne', 'Ti', 'Fe', 'Si'],
    INFJ: ['Ni', 'Fe', 'Ti', 'Se'], INFP: ['Fi', 'Ne', 'Si', 'Te'],
    ENFJ: ['Fe', 'Ni', 'Se', 'Ti'], ENFP: ['Ne', 'Fi', 'Te', 'Si'],
    ISTJ: ['Si', 'Te', 'Fi', 'Ne'], ISFJ: ['Si', 'Fe', 'Ti', 'Ne'],
    ESTJ: ['Te', 'Si', 'Ne', 'Fi'], ESFJ: ['Fe', 'Si', 'Ne', 'Ti'],
    ISTP: ['Ti', 'Se', 'Ni', 'Fe'], ISFP: ['Fi', 'Se', 'Ni', 'Te'],
    ESTP: ['Se', 'Ti', 'Fe', 'Ni'], ESFP: ['Se', 'Fi', 'Te', 'Ni'],
  };
  const functionLabels: Record<string, string> = {
    Ni: 'Intuição Introvertida', Ne: 'Intuição Extrovertida',
    Si: 'Sensação Introvertida', Se: 'Sensação Extrovertida',
    Ti: 'Pensamento Introvertido', Te: 'Pensamento Extrovertido',
    Fi: 'Sentimento Introvertido', Fe: 'Sentimento Extrovertido',
  };
  const functionDescriptions: Record<string, string> = {
    Ni: 'Foco em padrões futuros e insights profundos',
    Ne: 'Exploração de possibilidades e conexões',
    Si: 'Memória detalhada e respeito pela tradição',
    Se: 'Atenção ao momento presente e experiências',
    Ti: 'Análise lógica interna e frameworks',
    Te: 'Organização eficiente e tomada de decisão objetiva',
    Fi: 'Valores pessoais profundos e autenticidade',
    Fe: 'Harmonia social e consideração pelos outros',
  };
  const roles: ('dominant' | 'auxiliary' | 'tertiary' | 'inferior')[] = ['dominant', 'auxiliary', 'tertiary', 'inferior'];
  const stack = functionStacks[type] || ['Ni', 'Te', 'Fi', 'Se'];

  return stack.map((func, index) => ({
    function: func,
    label: functionLabels[func] || func,
    strength: Math.max(20, 100 - (index * 25)),
    description: functionDescriptions[func] || '',
    role: roles[index] || 'inferior' as const,
  }));
}

// Data maps for MBTI traits
const MBTI_STRENGTHS: Record<string, string[]> = {
  INTJ: ['Pensamento estratégico', 'Visão de longo prazo', 'Independência', 'Determinação'],
  INTP: ['Análise profunda', 'Criatividade lógica', 'Objetividade', 'Conhecimento amplo'],
  ENTJ: ['Liderança natural', 'Eficiência', 'Confiança', 'Planejamento estratégico'],
  ENTP: ['Inovação', 'Debate intelectual', 'Adaptabilidade', 'Visão de possibilidades'],
  INFJ: ['Empatia profunda', 'Visão', 'Integridade', 'Dedicação'],
  INFP: ['Criatividade', 'Valores fortes', 'Empatia', 'Autenticidade'],
  ENFJ: ['Carisma', 'Inspiração', 'Diplomacia', 'Organização'],
  ENFP: ['Entusiasmo', 'Criatividade', 'Empatia', 'Flexibilidade'],
  ISTJ: ['Confiabilidade', 'Meticulosidade', 'Disciplina', 'Comprometimento'],
  ISFJ: ['Lealdade', 'Praticidade', 'Cuidado', 'Observação'],
  ESTJ: ['Organização', 'Liderança prática', 'Responsabilidade', 'Diligência'],
  ESFJ: ['Hospitalidade', 'Cooperação', 'Lealdade', 'Harmonia'],
  ISTP: ['Praticidade', 'Análise', 'Calma sob pressão', 'Habilidade técnica'],
  ISFP: ['Sensibilidade artística', 'Gentileza', 'Flexibilidade', 'Autenticidade'],
  ESTP: ['Ação rápida', 'Persuasão', 'Observação', 'Pragmatismo'],
  ESFP: ['Energia', 'Praticidade', 'Generosidade', 'Otimismo'],
};

const MBTI_WEAKNESSES: Record<string, string[]> = {
  INTJ: ['Pode parecer arrogante', 'Impaciente com ineficiência', 'Dificuldade com emoções'],
  INTP: ['Pode parecer distante', 'Dificuldade com decisões', 'Pode ser excessivamente crítico'],
  ENTJ: ['Pode ser dominador', 'Impaciente', 'Insensível às emoções'],
  ENTP: ['Pode ser argumentativo', 'Dificuldade em finalizar', 'Pode ser insensível'],
  INFJ: ['Perfeccionista', 'Muito reservado', 'Sensível demais às críticas'],
  INFP: ['Muito idealista', 'Pode ser impraticável', 'Evita conflitos'],
  ENFJ: ['Pode ser muito idealista', 'Dificuldade em receber críticas', 'Pode ser manipulador'],
  ENFP: ['Dificuldade com rotina', 'Pode ser desorganizado', 'Pensa demais'],
  ISTJ: ['Pode ser inflexível', 'Resistente a mudanças', 'Muito rígido'],
  ISFJ: ['Evita conflitos', 'Dificuldade em dizer não', 'Pode ser submisso'],
  ESTJ: ['Pode ser inflexível', 'Muito focado em regras', 'Insensível'],
  ESFJ: ['Pode ser dependente de aprovação', 'Dificuldade com críticas', 'Muito tradicional'],
  ISTP: ['Pode parecer insensível', 'Dificuldade com compromissos', 'Reservado demais'],
  ISFP: ['Pode ser imprevisível', 'Evita planejamento', 'Muito sensível'],
  ESTP: ['Impaciente', 'Pode correr riscos demais', 'Pode ser insensível'],
  ESFP: ['Dificuldade com planejamento', 'Pode ser superficial', 'Busca atenção'],
};

const MBTI_CAREERS: Record<string, string[]> = {
  INTJ: ['Estrategista', 'Cientista', 'Analista de Sistemas', 'Advogado', 'Engenheiro'],
  INTP: ['Programador', 'Pesquisador', 'Analista', 'Professor universitário', 'Filósofo'],
  ENTJ: ['CEO', 'Consultor estratégico', 'Advogado corporativo', 'Empreendedor'],
  ENTP: ['Empreendedor', 'Advogado', 'Consultor', 'Cientista', 'Marketeiro'],
  INFJ: ['Psicólogo', 'Escritor', 'Conselheiro', 'RH estratégico', 'Coach'],
  INFP: ['Escritor', 'Artista', 'Psicólogo', 'Designer', 'Terapeuta'],
  ENFJ: ['Professor', 'Treinador', 'RH', 'Político', 'Coach'],
  ENFP: ['Jornalista', 'Consultor', 'Psicólogo', 'Artista', 'Empreendedor'],
  ISTJ: ['Contador', 'Auditor', 'Gerente de projetos', 'Militar', 'Engenheiro'],
  ISFJ: ['Enfermeiro', 'Professor', 'Administrador', 'Assistente social', 'RH'],
  ESTJ: ['Gerente', 'Administrador', 'Juiz', 'Oficial militar', 'Diretor financeiro'],
  ESFJ: ['Enfermeiro', 'Professor', 'Vendedor', 'Assistente administrativo', 'RH'],
  ISTP: ['Engenheiro', 'Técnico', 'Piloto', 'Mecânico', 'Atleta'],
  ISFP: ['Designer', 'Artista', 'Veterinário', 'Cozinheiro', 'Fisioterapeuta'],
  ESTP: ['Empreendedor', 'Vendedor', 'Policial', 'Corretor', 'Atleta'],
  ESFP: ['Ator', 'Vendedor', 'Designer', 'Relações públicas', 'Coach'],
};

const MBTI_BEST_MATCHES: Record<string, MBTIType[]> = {
  INTJ: ['ENFP', 'ENTP'], INTP: ['ENTJ', 'ENFJ'], ENTJ: ['INTP', 'INFP'], ENTP: ['INFJ', 'INTJ'],
  INFJ: ['ENTP', 'ENFP'], INFP: ['ENTJ', 'ENFJ'], ENFJ: ['INFP', 'INTP'], ENFP: ['INTJ', 'INFJ'],
  ISTJ: ['ESFP', 'ESTP'], ISFJ: ['ESTP', 'ESFP'], ESTJ: ['ISFP', 'ISTP'], ESFJ: ['ISTP', 'ISFP'],
  ISTP: ['ESFJ', 'ESTJ'], ISFP: ['ESTJ', 'ESFJ'], ESTP: ['ISFJ', 'ISTJ'], ESFP: ['ISTJ', 'ISFJ'],
};

function getMBTIStrengths(type: MBTIType): string[] { return MBTI_STRENGTHS[type] || []; }
function getMBTIWeaknesses(type: MBTIType): string[] { return MBTI_WEAKNESSES[type] || []; }
function getMBTICareerSuggestions(type: MBTIType): string[] { return MBTI_CAREERS[type] || []; }

function getMBTICommunicationTips(): string[] {
  return ['Adapte seu estilo ao interlocutor', 'Seja claro e direto quando necessário', 'Ouça ativamente antes de responder', 'Valide as emoções dos outros'];
}

function getMBTIWorkEnvironment(type: MBTIType): string {
  const EI = type[0]; const JP = type[3];
  if (EI === 'I' && JP === 'J') return 'Ambiente estruturado e quieto, com autonomia para trabalhar';
  if (EI === 'I' && JP === 'P') return 'Ambiente flexível e quieto, com liberdade para explorar';
  if (EI === 'E' && JP === 'J') return 'Ambiente organizado com muita interação e colaboração';
  return 'Ambiente dinâmico e social, com variedade de tarefas';
}

function getMBTILeadershipStyle(type: MBTIType): string {
  const TF = type[2]; const EI = type[0];
  if (EI === 'E' && TF === 'T') return 'Liderança direta e orientada a resultados';
  if (EI === 'E' && TF === 'F') return 'Liderança carismática e inspiradora';
  if (EI === 'I' && TF === 'T') return 'Liderança estratégica e analítica';
  return 'Liderança empática e orientada a pessoas';
}

function getMBTIConflictStyle(type: MBTIType): string {
  return type[2] === 'T'
    ? 'Aborda conflitos de forma lógica e objetiva, focando na solução'
    : 'Aborda conflitos considerando sentimentos e buscando harmonia';
}

function getMBTIStressPatterns(): string[] {
  return ['Pode se isolar quando sobrecarregado', 'Tendência a trabalhar demais sob pressão', 'Pode se tornar mais crítico consigo e com outros'];
}

function getMBTIGrowthAreas(): string[] {
  return ['Desenvolver a função inferior', 'Praticar flexibilidade cognitiva', 'Buscar perspectivas diferentes', 'Equilibrar trabalho e vida pessoal'];
}

function getMBTIBestMatches(type: MBTIType): MBTIType[] { return MBTI_BEST_MATCHES[type] || []; }

function getMBTIChallengingMatches(type: MBTIType): MBTIType[] {
  const opposite = type.split('').map((l, i) => {
    if (i === 0) return l === 'E' ? 'I' : 'E';
    if (i === 1) return l === 'S' ? 'N' : 'S';
    if (i === 2) return l === 'T' ? 'F' : 'T';
    return l === 'J' ? 'P' : 'J';
  }).join('') as MBTIType;
  return [opposite];
}
