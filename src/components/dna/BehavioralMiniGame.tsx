import React from 'react';
import type { MiniGameResult } from './miniGames/types';
import { ValueTowerGame } from './miniGames/ValueTowerGame';
import { ReactionGame } from './miniGames/ReactionGame';
import { PressureGame } from './miniGames/PressureGame';
import { EmotionalRadarGame } from './miniGames/EmotionalRadarGame';

export type { MiniGameResult } from './miniGames/types';
export { ValueTowerGame, ReactionGame, PressureGame, EmotionalRadarGame };

interface MiniGameSelectorProps {
  gameType: 'value-tower' | 'reaction' | 'pressure' | 'emotional-radar';
  onComplete: (result: MiniGameResult) => void;
}

export const MiniGameSelector: React.FC<MiniGameSelectorProps> = ({ gameType, onComplete }) => {
  switch (gameType) {
    case 'value-tower':
      return <ValueTowerGame onComplete={onComplete} />;
    case 'reaction':
      return <ReactionGame onComplete={onComplete} />;
    case 'pressure':
      return <PressureGame onComplete={onComplete} />;
    case 'emotional-radar':
      return <EmotionalRadarGame onComplete={onComplete} />;
    default:
      return null;
  }
};

export default MiniGameSelector;
