/**
 * @fileoverview Fase de jogo (HUD + questão) do motor de avaliação gamificada.
 */

import { motion } from 'framer-motion';
import { Award, Flame, Star, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  AssessmentAnswer,
  ComboState,
  EngineTheme,
  GamifiedQuestion,
  themeStyles,
} from '@/components/assessments/gamified/engineConfig';

interface GamifiedPlayingPhaseProps {
  currentQuestion: GamifiedQuestion;
  currentIndex: number;
  totalQuestions: number;
  progress: number;
  totalXP: number;
  combo: ComboState;
  level: number;
  theme: EngineTheme;
  onAnswer: (questionId: string, answer: AssessmentAnswer['answer'], event?: React.MouseEvent) => void;
}

export function GamifiedPlayingPhase({
  currentQuestion,
  currentIndex,
  totalQuestions,
  progress,
  totalXP,
  combo,
  level,
  theme,
  onAnswer,
}: GamifiedPlayingPhaseProps) {
  const styles = themeStyles[theme];

  return (
    <motion.div
      key={`question-${currentIndex}`}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="max-w-2xl w-full"
    >
      {/* HUD */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <Progress value={progress} className="h-3" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            {currentIndex + 1}/{totalQuestions}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20">
            <Star className="h-4 w-4 text-warning" />
            <span className="font-bold text-warning">{totalXP} XP</span>
          </div>

          {combo.count >= 2 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-warning/10 border border-warning/20"
            >
              <Flame className="h-4 w-4 text-warning" />
              <span className="font-bold text-warning">x{combo.multiplier.toFixed(1)} Combo!</span>
            </motion.div>
          )}

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <Award className="h-4 w-4 text-primary" />
            <span className="font-medium">Nível {level}</span>
          </div>
        </div>
      </div>

      <div className={cn('rounded-3xl p-8 shadow-2xl border', styles.card)}>
        <Badge variant="outline" className="mb-4">
          {currentQuestion.category}
        </Badge>

        <h2 className="text-2xl font-bold mb-8">{currentQuestion.text}</h2>

        {currentQuestion.type === 'choice' && currentQuestion.options && (
          <div className="grid gap-3">
            {currentQuestion.options.map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={(e) => onAnswer(currentQuestion.id, option.id, e)}
                className={cn(
                  'w-full p-5 text-left rounded-2xl border-2 transition-all',
                  'hover:border-primary hover:bg-primary/5 hover:scale-[1.02]',
                  'active:scale-[0.98]',
                  'flex items-center gap-4'
                )}
              >
                {option.emoji && <span className="text-3xl">{option.emoji}</span>}
                <span className="text-lg">{option.text}</span>
              </motion.button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'swipe' && currentQuestion.options && (
          <div className="flex gap-4 justify-center">
            {currentQuestion.options.slice(0, 2).map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={(e) => onAnswer(currentQuestion.id, option.id, e)}
                className={cn(
                  'flex-1 p-8 rounded-3xl border-2 transition-all',
                  'hover:scale-105 active:scale-95',
                  index === 0
                    ? 'hover:border-destructive hover:bg-destructive/10'
                    : 'hover:border-success hover:bg-success/10'
                )}
              >
                <div className="text-center">
                  <span className="text-5xl mb-4 block">{option.emoji}</span>
                  <span className="text-lg font-medium">{option.text}</span>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {currentQuestion.type === 'scale' && (
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <motion.button
                key={value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: value * 0.05 }}
                onClick={(e) => onAnswer(currentQuestion.id, value, e)}
                className={cn(
                  'w-16 h-16 rounded-2xl border-2 transition-all',
                  'hover:border-primary hover:bg-primary/10 hover:scale-110',
                  'active:scale-95',
                  'flex items-center justify-center text-2xl font-bold'
                )}
              >
                {value}
              </motion.button>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-warning" />
            <span>+{currentQuestion.xpReward} XP base</span>
            {combo.multiplier > 1 && (
              <span className="text-warning">(x{combo.multiplier.toFixed(1)})</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
