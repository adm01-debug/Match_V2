/**
 * @fileoverview Barrel export do framework "10 Pilares do Comportamento".
 * Estrutura modularizada em `src/config/behavioralPillars/` para permitir
 * tree-shaking e leitura isolada por domínio (tipos, pilares, cenários, cultura).
 */

export type {
  BehavioralPillar,
  ScenarioOption,
  ImmersiveScenario,
  CompanyProfile,
  AuthenticityMetrics,
  PredictiveFitAnalysis,
} from './behavioralPillars/types';

export { BEHAVIORAL_PILLARS } from './behavioralPillars/pillars';
export { IMMERSIVE_SCENARIOS } from './behavioralPillars/scenarios';
export { COMPANY_CULTURE_DIMENSIONS } from './behavioralPillars/cultureDimensions';

import { BEHAVIORAL_PILLARS } from './behavioralPillars/pillars';
import { IMMERSIVE_SCENARIOS } from './behavioralPillars/scenarios';
import { COMPANY_CULTURE_DIMENSIONS } from './behavioralPillars/cultureDimensions';

export default {
  BEHAVIORAL_PILLARS,
  IMMERSIVE_SCENARIOS,
  COMPANY_CULTURE_DIMENSIONS,
};
