/**
 * @fileoverview Barrel — dados das 14 ferramentas comportamentais.
 * Cada catálogo de questões vive em seu próprio módulo dentro de
 * `src/data/behavioralAssessments/`, permitindo tree-shaking por ferramenta.
 */

import type { BehavioralQuestion } from '@/types/behavioral';
import {
  generationalQuestions,
  stressProfileQuestions,
  triuneBrainQuestions,
} from './advancedBehavioralData';

export { discQuestions } from './behavioralAssessments/disc';
export { vakdQuestions } from './behavioralAssessments/vakd';
export { metaprogramsQuestions } from './behavioralAssessments/metaprograms';
export { mentalTriggersQuestions } from './behavioralAssessments/mentalTriggers';
export { sleightOfMouthQuestions } from './behavioralAssessments/sleightOfMouth';
export { emotionalStatesQuestions } from './behavioralAssessments/emotionalStates';
export { valuesQuestions } from './behavioralAssessments/values';
export { emotionalIntelligenceQuestions } from './behavioralAssessments/emotionalIntelligence';
export { cognitiveBiasesQuestions } from './behavioralAssessments/cognitiveBiases';
export { rapportQuestions } from './behavioralAssessments/rapport';

import { discQuestions } from './behavioralAssessments/disc';
import { vakdQuestions } from './behavioralAssessments/vakd';
import { metaprogramsQuestions } from './behavioralAssessments/metaprograms';
import { mentalTriggersQuestions } from './behavioralAssessments/mentalTriggers';
import { sleightOfMouthQuestions } from './behavioralAssessments/sleightOfMouth';
import { emotionalStatesQuestions } from './behavioralAssessments/emotionalStates';
import { valuesQuestions } from './behavioralAssessments/values';
import { emotionalIntelligenceQuestions } from './behavioralAssessments/emotionalIntelligence';
import { cognitiveBiasesQuestions } from './behavioralAssessments/cognitiveBiases';
import { rapportQuestions } from './behavioralAssessments/rapport';

export function getQuestionsForTool(toolId: string): BehavioralQuestion[] {
  switch (toolId) {
    // Ferramentas originais (10)
    case 'disc':
      return discQuestions;
    case 'vakd':
      return vakdQuestions;
    case 'metaprograms':
      return metaprogramsQuestions;
    case 'mental_triggers':
      return mentalTriggersQuestions;
    case 'sleight_of_mouth':
      return sleightOfMouthQuestions;
    case 'emotional_states':
      return emotionalStatesQuestions;
    case 'values':
      return valuesQuestions;
    case 'emotional_intelligence':
      return emotionalIntelligenceQuestions;
    case 'cognitive_biases':
      return cognitiveBiasesQuestions;
    case 'rapport':
      return rapportQuestions;
    // Novas ferramentas avançadas (4)
    case 'generational':
      return generationalQuestions;
    case 'stress_profile':
      return stressProfileQuestions;
    case 'triune_brain':
      return triuneBrainQuestions;
    case 'disc_compatibility':
      return []; // Usa resultado do DISC, não tem questões próprias
    default:
      return [];
  }
}
