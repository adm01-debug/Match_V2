import type { GenerationType } from '@/types/advancedBehavioral';
import type { GenerationalResult } from './types';

export function calculateGenerationalResult(
  answers: Record<string, number | string>,
  toolId: string,
  timeSpent: number
): GenerationalResult {
  const generationScores: Record<string, number> = {
    silent: 0,
    baby_boomer: 0,
    gen_x: 0,
    millennial: 0,
    gen_z: 0,
    gen_alpha: 0,
  };

  Object.entries(answers).forEach(([, answerIndex]) => {
    if (typeof answerIndex !== 'number') return;
    const genMap = ['silent_boomer', 'gen_x', 'millennial', 'gen_z'];
    const selectedGen = genMap[answerIndex];
    if (!selectedGen) return;

    const add = (key: string, val: number) => {
      generationScores[key] = (generationScores[key] ?? 0) + val;
    };
    if (selectedGen === 'silent_boomer') {
      add('silent', 2);
      add('baby_boomer', 2);
    } else if (selectedGen === 'gen_x') {
      add('gen_x', 4);
    } else if (selectedGen === 'millennial') {
      add('millennial', 4);
    } else if (selectedGen === 'gen_z') {
      add('gen_z', 3);
      add('gen_alpha', 1);
    }
  });

  const maxScore = Object.keys(answers).length * 4;
  const normalizedScores: Record<string, number> = {};
  Object.entries(generationScores).forEach(([gen, score]) => {
    normalizedScores[gen] = Math.round((score / Math.max(maxScore, 1)) * 100);
  });

  const sorted = Object.entries(normalizedScores).sort(([, a], [, b]) => b - a);
  const primary = (sorted[0]?.[0] as GenerationType) || 'millennial';
  const secondary = sorted[1]?.[0] as GenerationType;
  const primaryScore = sorted[0]?.[1] || 0;
  const secondaryScore = sorted[1]?.[1] || 0;
  const confidence = Math.min(100, Math.round(primaryScore - secondaryScore + 50));

  return {
    toolId,
    completedAt: new Date().toISOString(),
    timeSpent,
    scores: normalizedScores,
    primaryProfile: primary,
    secondaryProfile: secondary,
    rawAnswers: answers,
    generationType: primary,
    confidence,
    secondaryGeneration: secondary,
    generationScores: normalizedScores,
  };
}
