/**
 * @fileoverview Big Five personality calculator
 */

import {
  BigFiveResult,
  BigFiveDimension,
  BigFiveFacet,
  PersonalityAnswer,
  BIG_FIVE_DIMENSION_INFO,
} from '@/types/personality';

import { BIG_FIVE_QUESTIONS } from '@/data/personalityQuestions';
import { calculateConsistency, getLevel, normalizeScore } from './utils';

export function calculateBigFiveResult(answers: PersonalityAnswer[]): BigFiveResult {
  const dimensions: Record<string, { scores: number[]; facets: Record<string, number[]> }> = {
    openness: { scores: [], facets: {} },
    conscientiousness: { scores: [], facets: {} },
    extraversion: { scores: [], facets: {} },
    agreeableness: { scores: [], facets: {} },
    neuroticism: { scores: [], facets: {} },
  };

  BIG_FIVE_QUESTIONS.forEach(question => {
    const answer = answers.find(a => a.questionId === question.id);
    if (!answer || !question.dimension) return;

    let value = answer.value;
    if (question.reverse) value = 6 - value;

    const dim = dimensions[question.dimension];
    if (dim) {
      dim.scores.push(value);
      if (question.facet) {
        if (!dim.facets[question.facet]) dim.facets[question.facet] = [];
        dim.facets[question.facet]!.push(value);
      }
    }
  });

  const dimensionResults: BigFiveDimension[] = Object.entries(dimensions).map(([dimId, data]) => {
    const avgScore = data.scores.length > 0
      ? data.scores.reduce((a, b) => a + b, 0) / data.scores.length
      : 3;
    const normalizedScore_ = normalizeScore(avgScore, 1, 5);
    const info = BIG_FIVE_DIMENSION_INFO[dimId] || { label: dimId, description: '', highTraits: [], lowTraits: [] };

    const facets: BigFiveFacet[] = Object.entries(data.facets).map(([facetId, scores]) => {
      const facetAvg = scores.reduce((a, b) => a + b, 0) / scores.length;
      const facetScore = normalizeScore(facetAvg, 1, 5);
      return {
        name: formatFacetName(facetId),
        score: facetScore,
        description: getFacetDescription(facetScore),
      };
    });

    const level = getLevel(normalizedScore_);
    const isHigh = normalizedScore_ > 60;

    return {
      dimension: dimId as BigFiveDimension['dimension'],
      label: info?.label || dimId,
      score: normalizedScore_,
      percentile: calculatePercentile(normalizedScore_),
      level,
      facets,
      strengths: isHigh ? (info?.highTraits || []) : (info?.lowTraits || []),
      challenges: isHigh 
        ? ['Pode parecer desorganizado para alguns (O)', 'Muito idealista (A)']
        : ['Pode parecer inflexível (C)', 'Pode parecer distante (E)'],
    };
  });

  const sortedDims = [...dimensionResults].sort((a, b) => Math.abs(b.score - 50) - Math.abs(a.score - 50));
  const dominantTraits = sortedDims.slice(0, 3).map(d => {
    const prefix = d.score > 60 ? 'Alto' : d.score < 40 ? 'Baixo' : 'Médio';
    return `${prefix} ${d.label}`;
  });

  const validationPairs: Record<string, string> = {};
  BIG_FIVE_QUESTIONS.forEach(q => {
    if (q.validationPair) validationPairs[q.id] = q.validationPair;
  });
  const consistencyScore = calculateConsistency(answers, validationPairs);

  return {
    dimensions: dimensionResults,
    dominantTraits,
    personalitySummary: generatePersonalitySummary(dimensionResults),
    workStyle: generateWorkStyle(dimensionResults),
    communicationStyle: generateCommunicationStyle(dimensionResults),
    leadershipStyle: generateLeadershipStyle(dimensionResults),
    teamRole: generateTeamRole(dimensionResults),
    stressResponse: generateStressResponse(dimensionResults),
    developmentAreas: generateDevelopmentAreas(dimensionResults),
    consistencyScore,
    confidence: Math.min(consistencyScore, 95),
    completedAt: new Date().toISOString(),
  };
}

function formatFacetName(facetId: string): string {
  const names: Record<string, string> = {
    'imagination': 'Imaginação', 'artistic': 'Interesses Artísticos', 'emotionality': 'Emotividade',
    'adventurousness': 'Aventura', 'intellect': 'Intelecto', 'liberalism': 'Liberalismo',
    'self-efficacy': 'Autoeficácia', 'orderliness': 'Ordem', 'dutifulness': 'Senso de Dever',
    'achievement': 'Busca por Realização', 'self-discipline': 'Autodisciplina', 'cautiousness': 'Cautela',
    'friendliness': 'Amigabilidade', 'gregariousness': 'Gregário', 'assertiveness': 'Assertividade',
    'activity-level': 'Nível de Atividade', 'excitement-seeking': 'Busca por Emoções', 'cheerfulness': 'Alegria',
    'trust': 'Confiança', 'morality': 'Moralidade', 'altruism': 'Altruísmo',
    'cooperation': 'Cooperação', 'modesty': 'Modéstia', 'sympathy': 'Simpatia',
    'anxiety': 'Ansiedade', 'anger': 'Raiva', 'depression': 'Depressão',
    'self-consciousness': 'Autoconsciência', 'immoderation': 'Imoderação', 'vulnerability': 'Vulnerabilidade',
  };
  return names[facetId] || facetId;
}

function getFacetDescription(score: number): string {
  const level = score > 70 ? 'alta' : score < 30 ? 'baixa' : 'moderada';
  return `Tendência ${level} nesta faceta`;
}

function calculatePercentile(score: number): number {
  return Math.min(99, Math.max(1, score + Math.floor(Math.random() * 10) - 5));
}

function generatePersonalitySummary(dimensions: BigFiveDimension[]): string {
  const high = dimensions.filter(d => d.score > 65);
  const low = dimensions.filter(d => d.score < 35);
  let summary = 'Você possui um perfil ';
  if (high.length > 0) summary += `com destaque em ${high.map(d => d.label).join(' e ')}. `;
  if (low.length > 0) summary += `Apresenta menor intensidade em ${low.map(d => d.label).join(' e ')}.`;
  return summary || 'Você possui um perfil equilibrado entre as dimensões de personalidade.';
}

function generateWorkStyle(dimensions: BigFiveDimension[]): string {
  const C = dimensions.find(d => d.dimension === 'conscientiousness')?.score || 50;
  const E = dimensions.find(d => d.dimension === 'extraversion')?.score || 50;
  const O = dimensions.find(d => d.dimension === 'openness')?.score || 50;
  if (C > 70 && E < 40) return 'Metódico e focado, prefere trabalhar de forma independente e estruturada.';
  if (E > 70 && C > 60) return 'Colaborativo e organizado, lidera bem projetos em equipe.';
  if (O > 70) return 'Criativo e inovador, busca constantemente novas abordagens.';
  return 'Adaptável e equilibrado, ajusta seu estilo conforme a situação.';
}

function generateCommunicationStyle(dimensions: BigFiveDimension[]): string {
  const E = dimensions.find(d => d.dimension === 'extraversion')?.score || 50;
  const A = dimensions.find(d => d.dimension === 'agreeableness')?.score || 50;
  if (E > 70 && A > 70) return 'Expressivo e empático, conecta-se facilmente com outros.';
  if (E > 70 && A < 40) return 'Direto e assertivo, comunica-se com clareza e objetividade.';
  if (E < 40 && A > 70) return 'Atencioso e reservado, ouve mais do que fala.';
  return 'Equilibrado, adapta o estilo de comunicação ao contexto.';
}

function generateLeadershipStyle(dimensions: BigFiveDimension[]): string {
  const E = dimensions.find(d => d.dimension === 'extraversion')?.score || 50;
  const C = dimensions.find(d => d.dimension === 'conscientiousness')?.score || 50;
  const A = dimensions.find(d => d.dimension === 'agreeableness')?.score || 50;
  if (E > 70 && C > 70) return 'Líder carismático e organizado, inspira e estrutura a equipe.';
  if (C > 70 && A > 70) return 'Líder servidor, focado em apoiar o desenvolvimento da equipe.';
  if (E > 70 && A < 50) return 'Líder visionário, define direção com autoridade.';
  return 'Liderança situacional, adapta-se às necessidades do momento.';
}

function generateTeamRole(dimensions: BigFiveDimension[]): string {
  const O = dimensions.find(d => d.dimension === 'openness')?.score || 50;
  const C = dimensions.find(d => d.dimension === 'conscientiousness')?.score || 50;
  const E = dimensions.find(d => d.dimension === 'extraversion')?.score || 50;
  if (O > 70) return 'Inovador - gera ideias e soluções criativas';
  if (C > 70) return 'Implementador - transforma ideias em ação';
  if (E > 70) return 'Coordenador - conecta pessoas e recursos';
  return 'Especialista - contribui com conhecimento técnico';
}

function generateStressResponse(dimensions: BigFiveDimension[]): string {
  const N = dimensions.find(d => d.dimension === 'neuroticism')?.score || 50;
  if (N > 70) return 'Pode experimentar estresse intensamente. Recomenda-se técnicas de regulação emocional.';
  if (N < 30) return 'Geralmente resiliente sob pressão. Mantém a calma em situações difíceis.';
  return 'Resposta moderada ao estresse, com capacidade de recuperação.';
}

function generateDevelopmentAreas(dimensions: BigFiveDimension[]): string[] {
  const areas: string[] = [];
  dimensions.forEach(dim => {
    if (dim.dimension === 'neuroticism' && dim.score > 60) areas.push('Desenvolver técnicas de gerenciamento de estresse');
    if (dim.dimension === 'conscientiousness' && dim.score < 40) areas.push('Trabalhar organização e gestão do tempo');
    if (dim.dimension === 'agreeableness' && dim.score < 40) areas.push('Praticar empatia e colaboração');
    if (dim.dimension === 'openness' && dim.score < 40) areas.push('Explorar novas perspectivas e ideias');
    if (dim.dimension === 'extraversion' && dim.score < 30) areas.push('Desenvolver habilidades de networking');
  });
  return areas.length > 0 ? areas : ['Manter desenvolvimento contínuo em todas as áreas'];
}
