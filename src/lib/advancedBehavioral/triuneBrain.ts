import type { BrainType } from '@/types/advancedBehavioral';
import type { TriuneBrainResult } from './types';

const DECISION_STYLES: Record<BrainType, string> = {
  reptiliano: 'Decide baseado em segurança e proteção - evita riscos, busca garantias',
  limbico: 'Decide baseado em emoção e conexão - precisa sentir que é certo',
  neocortex: 'Decide baseado em lógica e dados - analisa, compara, calcula',
};

export function calculateTriuneBrainResult(
  answers: Record<string, number | string>,
  toolId: string,
  timeSpent: number
): TriuneBrainResult {
  const brainScores: Record<BrainType, number> = {
    reptiliano: 0,
    limbico: 0,
    neocortex: 0,
  };

  Object.entries(answers).forEach(([, answerIndex]) => {
    if (typeof answerIndex !== 'number') return;
    const brains: BrainType[] = ['reptiliano', 'limbico', 'neocortex'];
    const selectedBrain = brains[answerIndex];
    if (selectedBrain) brainScores[selectedBrain] += 4;
  });

  const total = Object.values(brainScores).reduce((a, b) => a + b, 0);
  const reptilianoScore = Math.round((brainScores.reptiliano / Math.max(total, 1)) * 100);
  const limbicoScore = Math.round((brainScores.limbico / Math.max(total, 1)) * 100);
  const neocortexScore = Math.round((brainScores.neocortex / Math.max(total, 1)) * 100);

  const sorted = Object.entries(brainScores).sort(([, a], [, b]) => b - a);
  const dominant = (sorted[0]?.[0] as BrainType) || 'limbico';
  const secondary = (sorted[1]?.[0] as BrainType) || 'neocortex';

  const maxScore = sorted[0]?.[1] || 0;
  const secondScore = sorted[1]?.[1] || 0;
  const thirdScore = sorted[2]?.[1] || 0;

  let balance: 'balanced' | 'dominated' | 'dual' = 'dominated';
  if (maxScore - thirdScore < 2) balance = 'balanced';
  else if (maxScore - secondScore < 2) balance = 'dual';

  return {
    toolId,
    completedAt: new Date().toISOString(),
    timeSpent,
    scores: { reptiliano: reptilianoScore, limbico: limbicoScore, neocortex: neocortexScore },
    primaryProfile: dominant,
    secondaryProfile: secondary,
    rawAnswers: answers,
    dominant,
    secondary,
    reptilianoScore,
    limbicoScore,
    neocortexScore,
    balance,
    decisionStyle: DECISION_STYLES[dominant],
  };
}
