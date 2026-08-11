/**
 * @fileoverview Funções puras de cálculo de resultados para ferramentas comportamentais.
 * Separadas do componente Player para permitir testes unitários e reuso.
 */

import type { BehavioralQuestion, BehavioralResult } from '@/types/behavioral';

interface CalcContext {
  toolId: string;
  candidatoId?: string;
  timeElapsed: number;
  answers: Record<string, number | string>;
  questions: BehavioralQuestion[];
}

/**
 * Cálculo padrão baseado em dimensões declaradas nas questões.
 */
export function calculateStandardResults(ctx: CalcContext): BehavioralResult {
  const { toolId, candidatoId, timeElapsed, answers, questions } = ctx;

  const scores: Record<string, number> = {};
  const dimensionCounts: Record<string, number> = {};

  questions.forEach((q) => {
    const answer = answers[q.id];
    if (answer === undefined) return;

    const dimension = q.dimension;
    if (!scores[dimension]) {
      scores[dimension] = 0;
      dimensionCounts[dimension] = 0;
    }

    if (q.type === 'scale') {
      scores[dimension] = (scores[dimension] || 0) + Number(answer);
      dimensionCounts[dimension] = (dimensionCounts[dimension] || 0) + 1;
    } else if (q.type === 'forced_choice' || q.type === 'situational') {
      const selectedOption = q.options?.[Number(answer)];
      if (selectedOption) {
        const optDim = selectedOption.dimension;
        scores[optDim] = (scores[optDim] || 0) + selectedOption.score;
        dimensionCounts[optDim] = (dimensionCounts[optDim] || 0) + 1;
      }
    }
  });

  const percentages: Record<string, number> = {};
  Object.keys(scores).forEach((dim) => {
    const count = dimensionCounts[dim] || 1;
    const maxPossible = count * 4;
    percentages[dim] = Math.round(((scores[dim] || 0) / Math.max(maxPossible, 1)) * 100);
  });

  const sortedDimensions = Object.entries(percentages).sort(([, a], [, b]) => b - a);
  const primary = sortedDimensions[0]?.[0] || '';
  const secondary = sortedDimensions[1]?.[0] || '';
  const primaryScore = sortedDimensions[0]?.[1] || 0;
  const secondaryScore = sortedDimensions[1]?.[1] || 0;
  const confidence = Math.min(100, Math.round(primaryScore - secondaryScore + 50));

  return {
    toolId,
    candidatoId,
    completedAt: new Date().toISOString(),
    timeSpent: timeElapsed,
    scores: percentages,
    primaryProfile: primary,
    secondaryProfile: secondary,
    rawAnswers: answers,
    confidence,
  };
}

/**
 * Cálculo especializado para ferramentas avançadas
 * (generational, stress_profile, triune_brain).
 */
export function calculateAdvancedResults(ctx: CalcContext): BehavioralResult {
  const { toolId, candidatoId, timeElapsed, answers } = ctx;

  const baseResult: BehavioralResult = {
    toolId,
    candidatoId,
    completedAt: new Date().toISOString(),
    timeSpent: timeElapsed,
    scores: {},
    primaryProfile: '',
    rawAnswers: answers,
  };

  if (toolId === 'generational') {
    const genScores: Record<string, number> = {
      silent: 0,
      baby_boomer: 0,
      gen_x: 0,
      millennial: 0,
      gen_z: 0,
      gen_alpha: 0,
    };
    const genMap = ['baby_boomer', 'gen_x', 'millennial', 'gen_z'];

    Object.entries(answers).forEach(([, answerIndex]) => {
      if (typeof answerIndex !== 'number') return;
      const selectedGen = genMap[answerIndex];
      if (selectedGen) genScores[selectedGen] = (genScores[selectedGen] || 0) + 4;
    });

    const maxScore = Object.keys(answers).length * 4;
    const normalized: Record<string, number> = {};
    Object.entries(genScores).forEach(([gen, score]) => {
      normalized[gen] = Math.round((score / Math.max(maxScore, 1)) * 100);
    });

    const sorted = Object.entries(normalized).sort(([, a], [, b]) => b - a);
    return {
      ...baseResult,
      scores: normalized,
      primaryProfile: sorted[0]?.[0] || 'millennial',
      secondaryProfile: sorted[1]?.[0],
      confidence: Math.min(100, (sorted[0]?.[1] || 0) - (sorted[1]?.[1] || 0) + 50),
    };
  }

  if (toolId === 'stress_profile') {
    const discScores: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 };
    const profiles = ['D', 'I', 'S', 'C'];

    Object.entries(answers).forEach(([, answerIndex]) => {
      if (typeof answerIndex !== 'number') return;
      const selected = profiles[answerIndex];
      if (selected) discScores[selected] = (discScores[selected] || 0) + 4;
    });

    const maxScore = Object.keys(answers).length * 4;
    const normalized: Record<string, number> = {};
    Object.entries(discScores).forEach(([profile, score]) => {
      normalized[profile] = Math.round((score / Math.max(maxScore, 1)) * 100);
    });

    const sorted = Object.entries(normalized).sort(([, a], [, b]) => b - a);
    return {
      ...baseResult,
      scores: normalized,
      primaryProfile: sorted[0]?.[0] || 'S',
      secondaryProfile: sorted[1]?.[0],
    };
  }

  if (toolId === 'triune_brain') {
    const brainScores: Record<string, number> = { reptiliano: 0, limbico: 0, neocortex: 0 };
    const brains = ['reptiliano', 'limbico', 'neocortex'];

    Object.entries(answers).forEach(([, answerIndex]) => {
      if (typeof answerIndex !== 'number') return;
      const selected = brains[answerIndex];
      if (selected) brainScores[selected] = (brainScores[selected] || 0) + 4;
    });

    const total = Object.values(brainScores).reduce((a, b) => a + b, 0);
    const normalized: Record<string, number> = {};
    Object.entries(brainScores).forEach(([brain, score]) => {
      normalized[brain] = Math.round((score / Math.max(total, 1)) * 100);
    });

    const sorted = Object.entries(normalized).sort(([, a], [, b]) => b - a);
    return {
      ...baseResult,
      scores: normalized,
      primaryProfile: sorted[0]?.[0] || 'limbico',
      secondaryProfile: sorted[1]?.[0],
    };
  }

  return baseResult;
}

const ADVANCED_TOOLS = new Set(['generational', 'stress_profile', 'triune_brain']);

export function calculateBehavioralResults(ctx: CalcContext): BehavioralResult {
  if (ADVANCED_TOOLS.has(ctx.toolId)) {
    return calculateAdvancedResults(ctx);
  }
  return calculateStandardResults(ctx);
}
