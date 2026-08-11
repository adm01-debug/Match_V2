import { motion } from 'framer-motion';
import { Flame, Sparkles, Star, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import type { MiniGameQuestion } from './types';
import {
  QuickChoiceRenderer,
  ThisOrThatRenderer,
  WordAssociationRenderer,
} from './GameRenderers';

interface Props {
  game: MiniGameQuestion;
  currentIndex: number;
  totalGames: number;
  progress: number;
  timeLeft: number;
  totalXP: number;
  streak: number;
  onSelect: (optionId: string) => void;
}

export function PlayingPhase({
  game,
  currentIndex,
  totalGames,
  progress,
  timeLeft,
  totalXP,
  streak,
  onSelect,
}: Props) {
  return (
    <motion.div
      key={`game-${currentIndex}`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="w-full max-w-xl"
    >
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-warning/10 border border-warning/20">
              <Star className="h-4 w-4 text-warning" />
              <span className="font-bold text-warning">{totalXP} XP</span>
            </div>
            {streak >= 2 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-destructive/10 border border-destructive/20"
              >
                <Flame className="h-4 w-4 text-destructive" />
                <span className="font-bold text-destructive">x{streak}</span>
              </motion.div>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {currentIndex + 1}/{totalGames}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {game.timeLimit && (
        <motion.div
          className={cn(
            'flex items-center justify-center gap-2 mb-6 text-2xl font-mono font-bold',
            timeLeft <= 3 ? 'text-destructive' : 'text-foreground'
          )}
          animate={timeLeft <= 3 ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.5, repeat: timeLeft <= 3 ? Infinity : 0 }}
        >
          <Timer className="h-6 w-6" />
          {timeLeft}s
        </motion.div>
      )}

      <div className="bg-card/50 backdrop-blur-sm rounded-3xl border p-8 mb-6">
        <h3 className="text-2xl font-bold text-center mb-8">{game.prompt}</h3>
        {game.type === 'quick-choice' && <QuickChoiceRenderer game={game} onSelect={onSelect} />}
        {game.type === 'this-or-that' && <ThisOrThatRenderer game={game} onSelect={onSelect} />}
        {game.type === 'word-association' && (
          <WordAssociationRenderer game={game} onSelect={onSelect} />
        )}
        {(game.type === 'scenario-pick' || game.type === 'priority-sort') && (
          <QuickChoiceRenderer game={game} onSelect={onSelect} />
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <Sparkles className="inline h-4 w-4 mr-1 text-warning" />
        +{game.xpReward} XP por resposta
      </div>
    </motion.div>
  );
}
