import type { BehavioralResult } from '@/types/behavioral';
import { calculateGenerationalResult } from './generational';
import { calculateStressProfileResult } from './stressProfile';
import { calculateTriuneBrainResult } from './triuneBrain';
import { extractDISCFromResults } from './crossFramework';

export * from './types';
export { calculateGenerationalResult } from './generational';
export { calculateStressProfileResult } from './stressProfile';
export { calculateTriuneBrainResult } from './triuneBrain';
export { performCrossFrameworkAnalysis, extractDISCFromResults } from './crossFramework';

export function calculateAdvancedResult(
  toolId: string,
  answers: Record<string, number | string>,
  timeSpent: number,
  existingResults?: BehavioralResult[]
): BehavioralResult {
  const existingDISC = existingResults ? extractDISCFromResults(existingResults) : undefined;

  switch (toolId) {
    case 'generational':
      return calculateGenerationalResult(answers, toolId, timeSpent);
    case 'stress_profile':
      return calculateStressProfileResult(answers, toolId, timeSpent, existingDISC);
    case 'triune_brain':
      return calculateTriuneBrainResult(answers, toolId, timeSpent);
    default:
      return {
        toolId,
        completedAt: new Date().toISOString(),
        timeSpent,
        scores: {},
        primaryProfile: '',
        rawAnswers: answers,
      };
  }
}
