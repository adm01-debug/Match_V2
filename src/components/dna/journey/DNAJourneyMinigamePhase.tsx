import React from 'react';
import { Progress } from '@/components/ui/progress';
import { MiniGameSelector, MiniGameResult } from '../BehavioralMiniGame';

interface Props {
  gameType: 'value-tower' | 'reaction' | 'pressure' | 'emotional-radar';
  currentIndex: number;
  totalGames: number;
  currentStep: number;
  totalSteps: number;
  onGameComplete: (result: MiniGameResult) => void;
}

export const DNAJourneyMinigamePhase: React.FC<Props> = ({
  gameType,
  currentIndex,
  totalGames,
  currentStep,
  totalSteps,
  onGameComplete,
}) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-900 via-accent to-slate-900 pt-20 p-4">
    <div className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-sm p-4">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        <span className="text-sm text-accent">
          Desafio {currentIndex + 1}/{totalGames}
        </span>
        <Progress value={(currentStep / totalSteps) * 100} className="flex-1 h-2" />
      </div>
    </div>

    <MiniGameSelector gameType={gameType} onComplete={onGameComplete} />
  </div>
);
