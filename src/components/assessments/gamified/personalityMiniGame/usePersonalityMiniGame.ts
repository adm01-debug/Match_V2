import { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import type { MiniGameQuestion, MiniGameResult } from './types';
import { QUICK_TIME_BONUS } from './types';

export type Phase = 'ready' | 'playing' | 'feedback' | 'complete';

interface UsePersonalityMiniGameArgs {
  games: MiniGameQuestion[];
  onComplete: (results: MiniGameResult[], totalXP: number) => void;
}

export function usePersonalityMiniGame({ games, onComplete }: UsePersonalityMiniGameArgs) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<MiniGameResult[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [phase, setPhase] = useState<Phase>('ready');
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionStart, setQuestionStart] = useState(0);
  const [showXP, setShowXP] = useState<number | null>(null);
  const [streak, setStreak] = useState(0);

  const handleSelectRef = useRef<((optionId: string) => void) | null>(null);
  const currentGame = games[currentIndex];
  const progress = (currentIndex / games.length) * 100;

  useEffect(() => {
    if (phase !== 'playing' || !currentGame?.timeLimit) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          const firstOptionId = currentGame.options[0]?.id;
          if (firstOptionId) {
            setTimeout(() => {
              if (phase === 'playing') handleSelectRef.current?.(firstOptionId);
            }, 0);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, currentGame?.timeLimit, currentGame?.options]);

  const startGame = useCallback(() => {
    setPhase('playing');
    setQuestionStart(Date.now());
    setTimeLeft(currentGame?.timeLimit || 10);
  }, [currentGame]);

  const handleSelect = useCallback(
    (optionId: string) => {
      if (phase !== 'playing' || !currentGame) return;
      const responseTime = Date.now() - questionStart;
      const isQuick = responseTime < 2000;
      const option = currentGame.options.find((o) => o.id === optionId);

      let earnedXP = currentGame.xpReward;
      if (isQuick) {
        earnedXP += QUICK_TIME_BONUS;
        setStreak((prev) => prev + 1);
      } else {
        setStreak(0);
      }
      if (streak >= 3) earnedXP = Math.round(earnedXP * 1.5);

      setShowXP(earnedXP);
      setTimeout(() => setShowXP(null), 1000);

      if (isQuick && streak >= 2) {
        confetti({
          particleCount: 50,
          spread: 70,
          colors: ['#fbbf24', '#f59e0b', '#d97706'],
          origin: { y: 0.6 },
        });
      }

      const result: MiniGameResult = {
        gameId: currentGame.id,
        selectedOption: optionId,
        responseTime,
        earnedXP,
        trait: option?.trait,
      };

      setResults((prev) => [...prev, result]);
      setTotalXP((prev) => prev + earnedXP);
      setPhase('feedback');

      setTimeout(() => {
        if (currentIndex < games.length - 1) {
          setCurrentIndex((prev) => prev + 1);
          setPhase('playing');
          setQuestionStart(Date.now());
          setTimeLeft(games[currentIndex + 1]?.timeLimit || 10);
        } else {
          setPhase('complete');
          confetti({ particleCount: 100, spread: 100, origin: { y: 0.5 } });
          onComplete(results, totalXP + earnedXP);
        }
      }, 1000);
    },
    [phase, currentGame, questionStart, streak, currentIndex, games, results, totalXP, onComplete]
  );

  useEffect(() => {
    handleSelectRef.current = handleSelect;
  }, [handleSelect]);

  return {
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
  };
}
