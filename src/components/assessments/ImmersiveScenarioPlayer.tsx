/**
 * @fileoverview Player de Cenários Imersivos
 */

import { AnimatePresence, motion } from 'framer-motion';
import type { ImmersiveScenario } from '@/config/behavioralPillars';
import { useScenarioPlayer } from './immersive/useScenarioPlayer';
import { IntroPhase } from './immersive/IntroPhase';
import { NarrativePhase } from './immersive/NarrativePhase';
import { OptionsPhase } from './immersive/OptionsPhase';
import { FollowUpPhase } from './immersive/FollowUpPhase';
import type { ScenarioResponse } from './immersive/types';

export type { ScenarioResponse } from './immersive/types';

interface ImmersiveScenarioPlayerProps {
  scenario: ImmersiveScenario;
  onComplete: (response: ScenarioResponse) => void;
  onSkip?: () => void;
  scenarioIndex: number;
  totalScenarios: number;
}

export function ImmersiveScenarioPlayer({
  scenario, onComplete, onSkip, scenarioIndex, totalScenarios,
}: ImmersiveScenarioPlayerProps) {
  const {
    phase, selectedOption, hoveredOption, setHoveredOption,
    timeLeft, followUpResponse, setFollowUpResponse,
    handleOptionSelect, handleConfirm, startScenario,
  } = useScenarioPlayer(scenario, onComplete);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <IntroPhase
            scenario={scenario}
            scenarioIndex={scenarioIndex}
            totalScenarios={totalScenarios}
            onStart={startScenario}
            onSkip={onSkip}
          />
        )}
        {phase === 'narrative' && <NarrativePhase scenario={scenario} />}
        {phase === 'options' && (
          <OptionsPhase
            scenario={scenario}
            timeLeft={timeLeft}
            selectedOption={selectedOption}
            hoveredOption={hoveredOption}
            onHover={setHoveredOption}
            onSelect={handleOptionSelect}
            onConfirm={handleConfirm}
          />
        )}
        {phase === 'followup' && scenario.followUp && (
          <FollowUpPhase
            followUp={scenario.followUp}
            followUpResponse={followUpResponse}
            onSelect={setFollowUpResponse}
            onConfirm={handleConfirm}
          />
        )}
        {phase === 'transitioning' && (
          <motion.div
            key="transitioning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
            />
            <p className="text-muted-foreground">Processando sua resposta...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ImmersiveScenarioPlayer;
