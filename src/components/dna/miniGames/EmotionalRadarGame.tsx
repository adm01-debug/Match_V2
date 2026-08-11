import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { MiniGameProps } from './types';

const EMOTIONS = [
  { face: '😊', emotion: 'Alegria', options: ['Alegria', 'Surpresa', 'Satisfação'] },
  { face: '😤', emotion: 'Frustração', options: ['Raiva', 'Frustração', 'Irritação'] },
  { face: '😰', emotion: 'Ansiedade', options: ['Medo', 'Ansiedade', 'Preocupação'] },
  { face: '🤔', emotion: 'Dúvida', options: ['Confusão', 'Dúvida', 'Curiosidade'] },
  { face: '😌', emotion: 'Calma', options: ['Calma', 'Indiferença', 'Aceitação'] },
  { face: '🥺', emotion: 'Vulnerabilidade', options: ['Tristeza', 'Vulnerabilidade', 'Empatia'] },
];

export const EmotionalRadarGame: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [startTime] = useState(Date.now());
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);

  const handleAnswer = (answer: string) => {
    const currentEmotion = EMOTIONS[currentIndex];
    if (!currentEmotion) return;

    const isCorrect = answer === currentEmotion.emotion;
    if (isCorrect) setCorrect((c) => c + 1);
    setShowResult(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      setShowResult(null);
      if (currentIndex + 1 >= EMOTIONS.length) {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        const finalCorrect = correct + (isCorrect ? 1 : 0);
        const score = Math.round((finalCorrect / EMOTIONS.length) * 100);
        onComplete({
          gameType: 'emotional-radar',
          score,
          timeSpent,
          details: { correct: finalCorrect, total: EMOTIONS.length },
        });
      } else {
        setCurrentIndex((i) => i + 1);
      }
    }, 800);
  };

  const emotion = EMOTIONS[currentIndex];
  if (!emotion) return null;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Radar Emocional</h2>
        <p className="text-muted-foreground">Identifique a emoção predominante</p>
      </div>

      <motion.div key={currentIndex} initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center py-8">
        <span className="text-9xl">{emotion.face}</span>
      </motion.div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 flex items-center justify-center z-10 ${
              showResult === 'correct' ? 'bg-success/30' : 'bg-destructive/30'
            }`}
          >
            <span className="text-6xl">{showResult === 'correct' ? '✅' : '❌'}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-3 gap-3">
        {emotion.options.map((option) => (
          <Button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={showResult !== null}
            className="h-16"
            variant="outline"
          >
            {option}
          </Button>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4">
        <div className="flex items-center gap-2 text-success">
          <Heart className="w-5 h-5" />
          <span>
            {correct}/{currentIndex}
          </span>
        </div>
        <div className="flex gap-1">
          {EMOTIONS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < currentIndex ? 'bg-primary' : i === currentIndex ? 'bg-foreground' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
