import { DISC_STRESS_INFO } from '@/types/advancedBehavioral';
import type { StressProfileResult } from './types';

export function calculateStressProfileResult(
  answers: Record<string, number | string>,
  toolId: string,
  timeSpent: number,
  existingDISCProfile?: 'D' | 'I' | 'S' | 'C'
): StressProfileResult {
  const discScores: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 };

  Object.entries(answers).forEach(([, answerIndex]) => {
    if (typeof answerIndex !== 'number') return;
    const profiles: ('D' | 'I' | 'S' | 'C')[] = ['D', 'I', 'S', 'C'];
    const selectedProfile = profiles[answerIndex];
    if (selectedProfile) {
      discScores[selectedProfile] = (discScores[selectedProfile] ?? 0) + 4;
    }
  });

  const sorted = Object.entries(discScores).sort(([, a], [, b]) => b - a);
  const stressProfile = (sorted[0]?.[0] || existingDISCProfile || 'S') as 'D' | 'I' | 'S' | 'C';
  const stressInfo = DISC_STRESS_INFO[stressProfile];

  const maxScore = Object.keys(answers).length * 4;
  const topScore = sorted[0]?.[1] || 0;
  const stressIntensity = Math.round((topScore / Math.max(maxScore, 1)) * 100);
  const vulnerabilityAreas = stressInfo?.gatilhos || [];

  const totalScore = Object.values(discScores).reduce((a, b) => a + b, 0) || 1;
  const distribution = Object.values(discScores).map((s) => (s / totalScore) * 100);
  const variance = distribution.reduce((acc, val) => acc + Math.pow(val - 25, 2), 0) / 4;
  const resilience = Math.max(0, Math.min(100, 100 - Math.sqrt(variance)));

  const normalizedScores: Record<string, number> = {};
  Object.entries(discScores).forEach(([profile, score]) => {
    normalizedScores[profile] = Math.round((score / Math.max(maxScore, 1)) * 100);
  });

  return {
    toolId,
    completedAt: new Date().toISOString(),
    timeSpent,
    scores: normalizedScores,
    primaryProfile: stressProfile,
    secondaryProfile: sorted[1]?.[0],
    rawAnswers: answers,
    discProfile: stressProfile,
    stressResponse: stressInfo?.respostaPrimaria || 'freeze',
    stressIntensity,
    vulnerabilityAreas,
    resilience: Math.round(resilience),
  };
}
