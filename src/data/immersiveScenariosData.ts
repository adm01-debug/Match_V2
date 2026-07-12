/**
 * @fileoverview Barrel — cenários imersivos expandidos por pilar.
 * Cobertura equilibrada dos 10 pilares comportamentais.
 * Cada catálogo vive em `src/data/immersiveScenarios/`, permitindo
 * carregar apenas os cenários do pilar em uso.
 */

import type { ImmersiveScenario } from '@/config/behavioralPillars';

import { RESILIENCE_SCENARIOS } from './immersiveScenarios/resilience';
import { INTEGRITY_SCENARIOS } from './immersiveScenarios/integrity';
import { COLLABORATION_SCENARIOS } from './immersiveScenarios/collaboration';
import { LEADERSHIP_SCENARIOS } from './immersiveScenarios/leadership';
import { ADAPTABILITY_SCENARIOS } from './immersiveScenarios/adaptability';
import { PROACTIVITY_SCENARIOS } from './immersiveScenarios/proactivity';
import { COMMUNICATION_SCENARIOS } from './immersiveScenarios/communication';
import { CRITICAL_THINKING_SCENARIOS } from './immersiveScenarios/criticalThinking';
import { EMOTIONAL_INTELLIGENCE_SCENARIOS } from './immersiveScenarios/emotionalIntelligence';
import { RESULTS_ORIENTATION_SCENARIOS } from './immersiveScenarios/resultsOrientation';

export { RESILIENCE_SCENARIOS } from './immersiveScenarios/resilience';
export { INTEGRITY_SCENARIOS } from './immersiveScenarios/integrity';
export { COLLABORATION_SCENARIOS } from './immersiveScenarios/collaboration';
export { LEADERSHIP_SCENARIOS } from './immersiveScenarios/leadership';
export { ADAPTABILITY_SCENARIOS } from './immersiveScenarios/adaptability';
export { PROACTIVITY_SCENARIOS } from './immersiveScenarios/proactivity';
export { COMMUNICATION_SCENARIOS } from './immersiveScenarios/communication';
export { CRITICAL_THINKING_SCENARIOS } from './immersiveScenarios/criticalThinking';
export { EMOTIONAL_INTELLIGENCE_SCENARIOS } from './immersiveScenarios/emotionalIntelligence';
export { RESULTS_ORIENTATION_SCENARIOS } from './immersiveScenarios/resultsOrientation';

/**
 * Todos os cenários consolidados em uma única lista
 */
export const ALL_EXPANDED_SCENARIOS: ImmersiveScenario[] = [
  ...RESILIENCE_SCENARIOS,
  ...INTEGRITY_SCENARIOS,
  ...COLLABORATION_SCENARIOS,
  ...LEADERSHIP_SCENARIOS,
  ...ADAPTABILITY_SCENARIOS,
  ...PROACTIVITY_SCENARIOS,
  ...COMMUNICATION_SCENARIOS,
  ...CRITICAL_THINKING_SCENARIOS,
  ...EMOTIONAL_INTELLIGENCE_SCENARIOS,
  ...RESULTS_ORIENTATION_SCENARIOS,
];

/**
 * Mapa de cenários por pilar para acesso rápido
 */
export const SCENARIOS_BY_PILLAR: Record<string, ImmersiveScenario[]> = {
  resiliencia: RESILIENCE_SCENARIOS,
  integridade: INTEGRITY_SCENARIOS,
  colaboracao: COLLABORATION_SCENARIOS,
  lideranca: LEADERSHIP_SCENARIOS,
  adaptabilidade: ADAPTABILITY_SCENARIOS,
  proatividade: PROACTIVITY_SCENARIOS,
  comunicacao: COMMUNICATION_SCENARIOS,
  pensamento_critico: CRITICAL_THINKING_SCENARIOS,
  inteligencia_emocional: EMOTIONAL_INTELLIGENCE_SCENARIOS,
  orientacao_resultados: RESULTS_ORIENTATION_SCENARIOS,
};

/**
 * Seleciona cenários balanceados garantindo cobertura de todos os pilares
 * quando `count >= 10` e `requireAllPillars` estiver ativo.
 */
export function selectBalancedScenarios(
  count: number,
  requireAllPillars: boolean = true,
): ImmersiveScenario[] {
  if (requireAllPillars && count >= 10) {
    const selected: ImmersiveScenario[] = [];
    const pillars = Object.keys(SCENARIOS_BY_PILLAR);

    pillars.forEach((pilar) => {
      const scenarios = SCENARIOS_BY_PILLAR[pilar];
      if (scenarios && scenarios.length > 0) {
        const randomIndex = Math.floor(Math.random() * scenarios.length);
        const scenario = scenarios[randomIndex];
        if (scenario) selected.push(scenario);
      }
    });

    while (selected.length < count) {
      const randomPillar = pillars[Math.floor(Math.random() * pillars.length)];
      if (randomPillar) {
        const scenarios = SCENARIOS_BY_PILLAR[randomPillar];
        if (scenarios && scenarios.length > 0) {
          const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
          if (randomScenario && !selected.find((s) => s.id === randomScenario.id)) {
            selected.push(randomScenario);
          }
        }
      }
    }

    return selected.sort(() => Math.random() - 0.5);
  }

  const shuffled = [...ALL_EXPANDED_SCENARIOS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default {
  ALL_EXPANDED_SCENARIOS,
  SCENARIOS_BY_PILLAR,
  selectBalancedScenarios,
  RESILIENCE_SCENARIOS,
  INTEGRITY_SCENARIOS,
  COLLABORATION_SCENARIOS,
  LEADERSHIP_SCENARIOS,
  ADAPTABILITY_SCENARIOS,
  PROACTIVITY_SCENARIOS,
  COMMUNICATION_SCENARIOS,
  CRITICAL_THINKING_SCENARIOS,
  EMOTIONAL_INTELLIGENCE_SCENARIOS,
  RESULTS_ORIENTATION_SCENARIOS,
};
