/**
 * @fileoverview Enneagram personality calculator
 */

import {
  EnneagramResult,
  EnneagramType,
  EnneagramWing,
  EnneagramTriad,
  EnneagramInstinct,
  EnneagramHealthLevel,
  EnneagramTypeScore,
  PersonalityAnswer,
  ENNEAGRAM_TYPE_INFO,
} from '@/types/personality';

import { ENNEAGRAM_QUESTIONS } from '@/data/personalityQuestions';
import { normalizeScore } from './utils';

export function calculateEnneagramResult(answers: PersonalityAnswer[]): EnneagramResult {
  const typeScores: Record<number, number[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] };

  ENNEAGRAM_QUESTIONS.forEach(question => {
    const answer = answers.find(a => a.questionId === question.id);
    if (!answer || !question.dimension) return;
    const typeNum = parseInt(question.dimension);
    if (typeScores[typeNum]) typeScores[typeNum].push(answer.value);
  });

  const typeResults: EnneagramTypeScore[] = Object.entries(typeScores).map(([typeStr, scores]) => {
    const typeNum = parseInt(typeStr) as EnneagramType;
    const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 1;
    return {
      type: typeNum,
      name: ENNEAGRAM_TYPE_INFO[typeNum]?.name || `Tipo ${typeNum}`,
      score: normalizeScore(avgScore, 1, 5),
      isCore: false,
      isWing: false,
    };
  }).sort((a, b) => b.score - a.score);

  const firstResult = typeResults[0];
  if (!firstResult) throw new Error('No type results calculated');
  const coreType = firstResult.type;
  firstResult.isCore = true;

  const leftWing = (coreType === 1 ? 9 : coreType - 1) as EnneagramType;
  const rightWing = (coreType === 9 ? 1 : coreType + 1) as EnneagramType;
  const leftScore = typeResults.find(t => t.type === leftWing)?.score || 0;
  const rightScore = typeResults.find(t => t.type === rightWing)?.score || 0;
  const wing: EnneagramType = leftScore > rightScore ? leftWing : rightWing;
  const wingInfluence = Math.max(leftScore, rightScore);

  const wingResult = typeResults.find(t => t.type === wing);
  if (wingResult) wingResult.isWing = true;

  const wingLabel = `${coreType}w${wing}` as EnneagramWing;
  const triad = getTriad(coreType);
  const dominantInstinct = calculateDominantInstinct();
  const healthLevel = calculateHealthLevel(firstResult.score);
  const typeInfo = ENNEAGRAM_TYPE_INFO[coreType] || { name: `Tipo ${coreType}`, description: '', motivation: '', fear: '' };

  return {
    coreType,
    typeName: typeInfo.name || `Tipo ${coreType}`,
    typeDescription: typeInfo.description || '',
    wing: wingLabel,
    wingInfluence,
    triad,
    dominantInstinct,
    instinctStack: [dominantInstinct, 'social', 'sexual'].filter((v, i, a) => a.indexOf(v) === i) as EnneagramInstinct[],
    healthLevel,
    typeScores: typeResults,
    integration: getIntegrationPattern(coreType),
    coreMotivation: typeInfo.motivation || '',
    coreFear: typeInfo.fear || '',
    coreDesire: DESIRES[coreType],
    basicVice: VICES[coreType],
    basicVirtue: VIRTUES[coreType],
    strengths: STRENGTHS[coreType],
    challenges: CHALLENGES[coreType],
    blindSpots: BLIND_SPOTS[coreType],
    communicationStyle: COMMUNICATION[coreType],
    leadershipStyle: LEADERSHIP[coreType],
    conflictBehavior: CONFLICT[coreType],
    careerFit: CAREERS[coreType],
    developmentPath: DEVELOPMENT[coreType],
    compatibleTypes: COMPATIBLE[coreType],
    challengingTypes: CHALLENGING[coreType],
    consistencyScore: calculateConsistency(typeResults),
    confidence: Math.min(95, firstResult.score),
    completedAt: new Date().toISOString(),
  };
}

function getTriad(type: EnneagramType): EnneagramTriad {
  if ([8, 9, 1].includes(type)) return 'instintivo';
  if ([2, 3, 4].includes(type)) return 'emocional';
  return 'mental';
}

function calculateDominantInstinct(): EnneagramInstinct { return 'autopreservacao'; }

function calculateHealthLevel(coreScore: number): EnneagramHealthLevel {
  if (coreScore > 85) return 'muito_saudavel';
  if (coreScore > 70) return 'saudavel';
  if (coreScore > 50) return 'medio';
  if (coreScore > 30) return 'nao_saudavel';
  return 'muito_nao_saudavel';
}

function getIntegrationPattern(type: EnneagramType) {
  const patterns: Record<EnneagramType, { stress: EnneagramType; growth: EnneagramType }> = {
    1: { stress: 4, growth: 7 }, 2: { stress: 8, growth: 4 }, 3: { stress: 9, growth: 6 },
    4: { stress: 2, growth: 1 }, 5: { stress: 7, growth: 8 }, 6: { stress: 3, growth: 9 },
    7: { stress: 1, growth: 5 }, 8: { stress: 5, growth: 2 }, 9: { stress: 6, growth: 3 },
  };
  const p = patterns[type];
  return {
    stressDirection: p.stress,
    growthDirection: p.growth,
    stressBehaviors: [`Manifesta características negativas do tipo ${p.stress}`],
    growthBehaviors: [`Desenvolve qualidades positivas do tipo ${p.growth}`],
  };
}

function calculateConsistency(typeResults: EnneagramTypeScore[]): number {
  if (typeResults.length < 2) return 100;
  const first = typeResults[0]; const second = typeResults[1];
  if (!first || !second) return 100;
  const gap = first.score - second.score;
  if (gap > 20) return 95; if (gap > 10) return 80; if (gap > 5) return 65; return 50;
}

// Data maps
const DESIRES: Record<EnneagramType, string> = {
  1: 'Ser bom, íntegro e ter razão', 2: 'Ser amado e apreciado', 3: 'Ser valioso e admirado',
  4: 'Ser único e autêntico', 5: 'Ser competente e capaz', 6: 'Ter segurança e suporte',
  7: 'Ser feliz e satisfeito', 8: 'Se proteger e estar no controle', 9: 'Ter paz interior e harmonia',
};

const VICES: Record<EnneagramType, string> = {
  1: 'Ira (raiva reprimida)', 2: 'Orgulho', 3: 'Vaidade (engano)', 4: 'Inveja', 5: 'Avareza',
  6: 'Medo (ansiedade)', 7: 'Gula', 8: 'Luxúria (excesso)', 9: 'Preguiça (acomodação)',
};

const VIRTUES: Record<EnneagramType, string> = {
  1: 'Serenidade', 2: 'Humildade', 3: 'Autenticidade', 4: 'Equanimidade', 5: 'Desapego',
  6: 'Coragem', 7: 'Sobriedade', 8: 'Inocência', 9: 'Ação',
};

const STRENGTHS: Record<EnneagramType, string[]> = {
  1: ['Ético', 'Organizado', 'Justo', 'Dedicado', 'Íntegro'],
  2: ['Generoso', 'Empático', 'Caloroso', 'Prestativo', 'Atencioso'],
  3: ['Eficiente', 'Adaptável', 'Motivador', 'Ambicioso', 'Produtivo'],
  4: ['Criativo', 'Autêntico', 'Profundo', 'Expressivo', 'Sensível'],
  5: ['Analítico', 'Perspicaz', 'Objetivo', 'Inovador', 'Independente'],
  6: ['Leal', 'Responsável', 'Atencioso', 'Preparado', 'Colaborativo'],
  7: ['Otimista', 'Versátil', 'Entusiasta', 'Criativo', 'Espontâneo'],
  8: ['Direto', 'Protetor', 'Corajoso', 'Decidido', 'Líder natural'],
  9: ['Pacificador', 'Receptivo', 'Estável', 'Diplomático', 'Harmonioso'],
};

const CHALLENGES: Record<EnneagramType, string[]> = {
  1: ['Crítico demais', 'Perfeccionista', 'Inflexível', 'Ressentido'],
  2: ['Manipulador', 'Possessivo', 'Martir', 'Dependente'],
  3: ['Workaholic', 'Superficial', 'Calculista', 'Competitivo demais'],
  4: ['Melancólico', 'Invejoso', 'Temperamental', 'Centrado em si'],
  5: ['Isolado', 'Avarento', 'Arrogante', 'Distante'],
  6: ['Ansioso', 'Indeciso', 'Desconfiado', 'Reativo'],
  7: ['Impulsivo', 'Disperso', 'Evitativo', 'Superficial'],
  8: ['Intimidador', 'Controlador', 'Confrontador', 'Impaciente'],
  9: ['Passivo', 'Complacente', 'Procrastinador', 'Autoesquecido'],
};

const BLIND_SPOTS: Record<EnneagramType, string[]> = {
  1: ['Não percebe sua própria raiva', 'Rigidez vista como virtude'],
  2: ['Não reconhece suas próprias necessidades', 'Ajuda com expectativas ocultas'],
  3: ['Desconexão com sentimentos reais', 'Confunde imagem com identidade'],
  4: ['Drama pode afastar pessoas', 'Foco no que falta, não no que tem'],
  5: ['Isolamento visto como autossuficiência', 'Conhecimento ≠ ação'],
  6: ['Busca de segurança pode paralisar', 'Projeção de medos nos outros'],
  7: ['Evitação de dor impede crescimento', 'Otimismo excessivo nega realidade'],
  8: ['Vulnerabilidade vista como fraqueza', 'Intensidade pode assustar'],
  9: ['Passividade confundida com paz', 'Fusão com outros perde identidade'],
};

const COMMUNICATION: Record<EnneagramType, string> = {
  1: 'Direto, focado em melhorias e padrões', 2: 'Caloroso, focado em relacionamentos e necessidades',
  3: 'Eficiente, orientado a objetivos e resultados', 4: 'Expressivo, focado em autenticidade e profundidade',
  5: 'Conciso, focado em dados e análise', 6: 'Cauteloso, focado em riscos e contingências',
  7: 'Entusiasta, focado em possibilidades e opções', 8: 'Assertivo, direto e sem rodeios',
  9: 'Harmonioso, buscando consenso e entendimento',
};

const LEADERSHIP: Record<EnneagramType, string> = {
  1: 'Líder ético que define padrões elevados', 2: 'Líder servidor que desenvolve pessoas',
  3: 'Líder orientado a resultados que motiva pela performance', 4: 'Líder criativo que inspira autenticidade',
  5: 'Líder estratégico que analisa e planeja', 6: 'Líder colaborativo que constrói equipes coesas',
  7: 'Líder visionário que inspira com possibilidades', 8: 'Líder decisivo que protege e mobiliza',
  9: 'Líder inclusivo que busca consenso',
};

const CONFLICT: Record<EnneagramType, string> = {
  1: 'Confronta com base em princípios, pode parecer rígido',
  2: 'Evita conflitos diretos, pode ser passivo-agressivo',
  3: 'Foca em resolver eficientemente, pode ignorar emoções',
  4: 'Reage emocionalmente, pode dramatizar',
  5: 'Se retrai para analisar, pode parecer indiferente',
  6: 'Busca apoio do grupo, pode escalar ou evitar',
  7: 'Tenta minimizar ou mudar de assunto',
  8: 'Confronta diretamente, pode escalar rapidamente',
  9: 'Evita a todo custo, pode se desligar',
};

const CAREERS: Record<EnneagramType, string[]> = {
  1: ['Auditor', 'Juiz', 'Editor', 'Consultor de qualidade', 'Professor'],
  2: ['RH', 'Enfermeiro', 'Assistente social', 'Coach', 'Terapeuta'],
  3: ['Vendas', 'Marketing', 'Executivo', 'Empreendedor', 'Consultor'],
  4: ['Artista', 'Designer', 'Escritor', 'Terapeuta', 'Músico'],
  5: ['Pesquisador', 'Analista', 'Cientista', 'Programador', 'Professor'],
  6: ['Gestor de riscos', 'Advogado', 'Policial', 'Gerente de projetos', 'RH'],
  7: ['Empreendedor', 'Publicitário', 'Consultor', 'Viajante', 'Apresentador'],
  8: ['CEO', 'Político', 'Advogado', 'Empreendedor', 'Diretor'],
  9: ['Mediador', 'Diplomata', 'RH', 'Terapeuta', 'Bibliotecário'],
};

const DEVELOPMENT: Record<EnneagramType, string[]> = {
  1: ['Aceitar imperfeição', 'Desenvolver paciência', 'Expressar emoções', 'Relaxar padrões'],
  2: ['Reconhecer próprias necessidades', 'Pedir ajuda', 'Estabelecer limites', 'Amor próprio'],
  3: ['Conectar com sentimentos', 'Valorizar ser sobre fazer', 'Autenticidade', 'Desacelerar'],
  4: ['Apreciar o ordinário', 'Agir apesar das emoções', 'Estabilidade', 'Gratidão'],
  5: ['Engajar com o mundo', 'Compartilhar conhecimento', 'Conexão emocional', 'Generosidade'],
  6: ['Confiar em si mesmo', 'Tomar decisões', 'Enfrentar medos', 'Autonomia'],
  7: ['Completar projetos', 'Processar emoções', 'Compromisso', 'Profundidade'],
  8: ['Mostrar vulnerabilidade', 'Suavizar abordagem', 'Ouvir mais', 'Paciência'],
  9: ['Expressar opiniões', 'Tomar iniciativa', 'Enfrentar conflitos', 'Priorizar-se'],
};

const COMPATIBLE: Record<EnneagramType, EnneagramType[]> = {
  1: [7, 9, 2], 2: [4, 8, 9], 3: [6, 9, 1], 4: [2, 5, 9], 5: [4, 8, 9],
  6: [3, 9, 8], 7: [1, 5, 9], 8: [2, 5, 6], 9: [3, 6, 1],
};

const CHALLENGING: Record<EnneagramType, EnneagramType[]> = {
  1: [4, 8], 2: [5, 1], 3: [4, 8], 4: [1, 3], 5: [2, 7],
  6: [7, 5], 7: [4, 6], 8: [4, 5], 9: [3, 8],
};
