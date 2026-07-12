/**
 * @fileoverview Mini-games de Personalidade — orquestrador enxuto.
 * Lógica em `personalityMiniGame/usePersonalityMiniGame`, fases em subcomponentes.
 */

import { memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ReadyPhase } from './personalityMiniGame/ReadyPhase';
import { PlayingPhase } from './personalityMiniGame/PlayingPhase';
import { FeedbackPhase } from './personalityMiniGame/FeedbackPhase';
import { CompletePhase } from './personalityMiniGame/CompletePhase';
import { usePersonalityMiniGame } from './personalityMiniGame/usePersonalityMiniGame';
import type { MiniGameQuestion, MiniGameResult, MiniGameType } from './personalityMiniGame/types';

export type { MiniGameQuestion, MiniGameResult, MiniGameType };

interface PersonalityMiniGameProps {
  games: MiniGameQuestion[];
  onComplete: (results: MiniGameResult[], totalXP: number) => void;
  onExit?: () => void;
}

export const PersonalityMiniGame = memo(function PersonalityMiniGame({
  games,
  onComplete,
  onExit,
}: PersonalityMiniGameProps) {
  const {
    phase,
    currentGame,
    currentIndex,
    progress,
    timeLeft,
    totalXP,
    streak,
    showXP,
    startGame,
    handleSelect,
  } = usePersonalityMiniGame({ games, onComplete });

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-6">
      <AnimatePresence mode="wait">
        {phase === 'ready' && (
          <ReadyPhase totalGames={games.length} onStart={startGame} onExit={onExit} />
        )}

        {phase === 'playing' && currentGame && (
          <PlayingPhase
            game={currentGame}
            currentIndex={currentIndex}
            totalGames={games.length}
            progress={progress}
            timeLeft={timeLeft}
            totalXP={totalXP}
            streak={streak}
            onSelect={handleSelect}
          />
        )}

        {phase === 'feedback' && <FeedbackPhase showXP={showXP} />}

        {phase === 'complete' && (
          <CompletePhase totalXP={totalXP} totalGames={games.length} onExit={onExit} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showXP && (
          <motion.div
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -50 }}
            exit={{ opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-warning pointer-events-none z-50"
          >
            +{showXP}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

PersonalityMiniGame.displayName = 'PersonalityMiniGame';

export default PersonalityMiniGame;
