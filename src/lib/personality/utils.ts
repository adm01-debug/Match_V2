/**
 * @fileoverview Shared utilities for personality calculators
 */

import type { PersonalityAnswer } from '@/types/personality';

export function calculateConsistency(answers: PersonalityAnswer[], validationPairs: Record<string, string>): number {
  let consistentPairs = 0;
  let totalPairs = 0;

  Object.entries(validationPairs).forEach(([questionId, pairId]) => {
    const answer1 = answers.find(a => a.questionId === questionId);
    const answer2 = answers.find(a => a.questionId === pairId);
    
    if (answer1 && answer2) {
      totalPairs++;
      const diff = Math.abs(answer1.value - (6 - answer2.value));
      if (diff <= 1) consistentPairs++;
    }
  });

  return totalPairs > 0 ? Math.round((consistentPairs / totalPairs) * 100) : 100;
}

export function getLevel(score: number): 'muito_baixo' | 'baixo' | 'medio' | 'alto' | 'muito_alto' {
  if (score <= 20) return 'muito_baixo';
  if (score <= 40) return 'baixo';
  if (score <= 60) return 'medio';
  if (score <= 80) return 'alto';
  return 'muito_alto';
}

export function normalizeScore(raw: number, min: number, max: number): number {
  return Math.round(((raw - min) / (max - min)) * 100);
}
