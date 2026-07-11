/**
 * @fileoverview Motor de Avaliação Gamificada
 * Sistema que transforma avaliações em experiências lúdicas e envolventes.
 * Orquestra as fases (intro → playing → complete) usando o hook useAssessmentEngine.
 */

import { memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAssessmentEngine } from '@/hooks/useAssessmentEngine';
import {
  AssessmentAnswer,
  AssessmentStats,
  EngineTheme,
  GamifiedQuestion,
  themeStyles,
} from './engineConfig';
import { GamifiedIntroPhase } from './phases/GamifiedIntroPhase';
import { GamifiedPlayingPhase } from './phases/GamifiedPlayingPhase';
import { GamifiedCompletePhase } from './phases/GamifiedCompletePhase';
import { FloatingXPAnimation } from './FloatingXPAnimation';

export type { GamifiedQuestion, AssessmentAnswer, AssessmentStats } from './engineConfig';

interface GamifiedAssessmentEngineProps {
  questions: GamifiedQuestion[];
  onComplete: (answers: Record<string, AssessmentAnswer>, stats: AssessmentStats) => void;
  onExit?: () => void;
  title?: string;
  subtitle?: string;
  theme?: EngineTheme;
}

export const GamifiedAssessmentEngine = memo(function GamifiedAssessmentEngine({
  questions,
  onComplete,
  onExit,
  title = 'Avaliação Gamificada',
  subtitle = 'Descubra seu perfil de forma divertida',
  theme = 'playful',
}: GamifiedAssessmentEngineProps) {
  const {
    phase,
    currentIndex,
    currentQuestion,
    progress,
    totalXP,
    combo,
    fastAnswers,
    earnedBadges,
    showXPGain,
    level,
    handleAnswer,
    handleStart,
  } = useAssessmentEngine({ questions, onComplete });

  const styles = themeStyles[theme];

  return (
    <div className={cn('min-h-screen flex items-center justify-center p-4', styles.bg)}>
      <AnimatePresence mode="wait">
        {phase === 'intro' && (
          <GamifiedIntroPhase
            title={title}
            subtitle={subtitle}
            totalQuestions={questions.length}
            theme={theme}
            onStart={handleStart}
            onExit={onExit}
          />
        )}

        {phase === 'playing' && currentQuestion && (
          <GamifiedPlayingPhase
            currentQuestion={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            progress={progress}
            totalXP={totalXP}
            combo={combo}
            level={level}
            theme={theme}
            onAnswer={handleAnswer}
          />
        )}

        {phase === 'complete' && (
          <GamifiedCompletePhase
            totalXP={totalXP}
            combo={combo}
            fastAnswers={fastAnswers}
            earnedBadges={earnedBadges}
            theme={theme}
            onExit={onExit}
          />
        )}
      </AnimatePresence>

      <FloatingXPAnimation xpGain={showXPGain} />
    </div>
  );
});

GamifiedAssessmentEngine.displayName = 'GamifiedAssessmentEngine';
