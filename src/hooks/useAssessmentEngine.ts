/**
 * @fileoverview Hook do motor de avaliação gamificada — gerencia estado, XP, combos e badges.
 */

import { useCallback, useState } from 'react';
import confetti from 'canvas-confetti';
import { useGamification } from '@/hooks/useGamification';
import {
  AssessmentAnswer,
  AssessmentStats,
  ComboState,
  COMBO_THRESHOLD,
  EnginePhase,
  FAST_ANSWER_THRESHOLD,
  GamifiedQuestion,
} from '@/components/assessments/gamified/engineConfig';

interface UseAssessmentEngineParams {
  questions: GamifiedQuestion[];
  onComplete: (answers: Record<string, AssessmentAnswer>, stats: AssessmentStats) => void;
}

export function useAssessmentEngine({ questions, onComplete }: UseAssessmentEngineParams) {
  const { addXP, level } = useGamification();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AssessmentAnswer>>({});
  const [phase, setPhase] = useState<EnginePhase>('intro');
  const [totalXP, setTotalXP] = useState(0);
  const [showXPGain, setShowXPGain] = useState<{ amount: number; x: number; y: number } | null>(null);
  const [combo, setCombo] = useState<ComboState>({ count: 0, multiplier: 1, lastAnswerTime: 0 });
  const [fastAnswers, setFastAnswers] = useState(0);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [startTime] = useState(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  const triggerConfetti = useCallback((type: 'small' | 'big' | 'combo') => {
    const configs = {
      small: { particleCount: 30, spread: 60, origin: { y: 0.7 } },
      big: { particleCount: 100, spread: 100, origin: { y: 0.6 } },
      combo: {
        particleCount: 50,
        spread: 90,
        colors: ['#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3', '#54a0ff'],
        origin: { y: 0.5 },
      },
    };
    confetti(configs[type]);
  }, []);

  const handleAnswer = useCallback(
    (questionId: string, answer: AssessmentAnswer['answer'], event?: React.MouseEvent) => {
      const now = Date.now();
      const responseTime = now - questionStartTime;
      const isFastAnswer = responseTime < FAST_ANSWER_THRESHOLD;
      const maintainsCombo = now - combo.lastAnswerTime < COMBO_THRESHOLD || combo.count === 0;

      let xpGained = currentQuestion?.xpReward || 10;

      let newFastAnswers = fastAnswers;
      if (isFastAnswer && currentQuestion?.timeBonus) {
        xpGained += currentQuestion.timeBonus;
        newFastAnswers = fastAnswers + 1;
        setFastAnswers(newFastAnswers);
      }

      const newCombo = maintainsCombo
        ? { count: combo.count + 1, multiplier: Math.min(4, 1 + combo.count * 0.5), lastAnswerTime: now }
        : { count: 1, multiplier: 1, lastAnswerTime: now };

      xpGained = Math.round(xpGained * newCombo.multiplier);
      setCombo(newCombo);

      if (event) {
        setShowXPGain({ amount: xpGained, x: event.clientX, y: event.clientY });
        setTimeout(() => setShowXPGain(null), 1000);
      }

      if (newCombo.count >= 3) triggerConfetti('combo');
      else if (isFastAnswer) triggerConfetti('small');

      let newBadges = [...earnedBadges];
      if (newCombo.count === 5 && !earnedBadges.includes('combo-master')) {
        newBadges = [...newBadges, 'combo-master'];
        setEarnedBadges(newBadges);
      }
      if (newFastAnswers >= 5 && !earnedBadges.includes('speed-demon')) {
        newBadges = [...newBadges, 'speed-demon'];
        setEarnedBadges(newBadges);
      }

      const newTotalXP = totalXP + xpGained;
      setTotalXP(newTotalXP);
      addXP(xpGained, 'avaliacao');

      const newAnswers = { ...answers, [questionId]: { answer, responseTime, combo: newCombo.count } };
      setAnswers(newAnswers);

      if (currentIndex < questions.length - 1) {
        setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setQuestionStartTime(Date.now());
        }, 500);
      } else {
        triggerConfetti('big');
        setTimeout(() => {
          setPhase('complete');
          onComplete(newAnswers, {
            totalXP: newTotalXP,
            comboMax: Math.max(combo.count, newCombo.count),
            fastAnswers: newFastAnswers,
            timeElapsed: Date.now() - startTime,
            accuracy: 100,
            badges: newBadges,
          });
        }, 1000);
      }
    },
    [
      currentQuestion,
      questionStartTime,
      combo,
      fastAnswers,
      earnedBadges,
      currentIndex,
      questions.length,
      addXP,
      triggerConfetti,
      answers,
      totalXP,
      startTime,
      onComplete,
    ]
  );

  const handleStart = useCallback(() => {
    setPhase('playing');
    setQuestionStartTime(Date.now());
    triggerConfetti('small');
  }, [triggerConfetti]);

  return {
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
  };
}
