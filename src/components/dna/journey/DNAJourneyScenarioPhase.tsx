import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ImmersiveScenarioPlayer } from '../ImmersiveScenarioPlayer';
import { DNAHelix3D } from '../DNAHelix3D';
import type { DNAHelix } from '@/types/behavioralDNA';
import type { JourneyScenario } from './dnaJourneyScenarios';

interface Props {
  scenario: JourneyScenario;
  currentIndex: number;
  totalScenarios: number;
  currentStep: number;
  totalSteps: number;
  helixScores: DNAHelix;
  showDNAPreview: boolean;
  onTogglePreview: () => void;
  onChoice: (impact: DNAHelix) => void;
  onSkip: () => void;
}

export const DNAJourneyScenarioPhase: React.FC<Props> = ({
  scenario,
  currentIndex,
  totalScenarios,
  currentStep,
  totalSteps,
  helixScores,
  showDNAPreview,
  onTogglePreview,
  onChoice,
  onSkip,
}) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-accent to-slate-900">
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm p-4">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <span className="text-sm text-accent">
          Cenário {currentIndex + 1}/{totalScenarios}
        </span>
        <Progress value={(currentStep / totalSteps) * 100} className="flex-1 h-2" />
        <Button variant="ghost" size="sm" onClick={onTogglePreview} className="text-accent">
          <Sparkles className="w-4 h-4" />
        </Button>
      </div>
    </div>

    <AnimatePresence>
      {showDNAPreview && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed right-4 top-20 z-40"
        >
          <Card className="bg-black/80 backdrop-blur-xl border-accent/30 p-4">
            <DNAHelix3D helix={helixScores} size="sm" />
          </Card>
        </motion.div>
      )}
    </AnimatePresence>

    <div className="pt-20">
      <ImmersiveScenarioPlayer
        scenario={scenario}
        onComplete={(choiceId) => {
          const choice = scenario.choices.find((c) => c.id === choiceId);
          if (choice) onChoice(choice.helixImpact);
        }}
        onSkip={onSkip}
      />
    </div>
  </div>
);
