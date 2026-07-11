import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { MiniGameProps } from './types';

const PRESSURE_SCENARIOS = [
  { text: 'Deadline apertado, entregar incompleto ou pedir mais tempo?', a: 'Entregar', b: 'Pedir tempo' },
  { text: 'Conflito na equipe, intervir agora ou esperar esfriar?', a: 'Intervir', b: 'Esperar' },
  { text: 'Erro descoberto após entrega, admitir ou corrigir silenciosamente?', a: 'Admitir', b: 'Corrigir' },
  { text: 'Oportunidade arriscada, agir rápido ou analisar mais?', a: 'Agir', b: 'Analisar' },
  { text: 'Feedback negativo inesperado, defender ou aceitar?', a: 'Defender', b: 'Aceitar' },
];

export const PressureGame: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5);
  const [answers, setAnswers] = useState<string[]>([]);
  const [startTime] = useState(Date.now());

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentIndex + 1 >= PRESSURE_SCENARIOS.length) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      const timeouts = newAnswers.filter((a) => a === 'timeout').length;
      const score = Math.round(100 - timeouts * 15);
      onComplete({ gameType: 'pressure', score, timeSpent, details: { answers: newAnswers, timeouts } });
    } else {
      setCurrentIndex((i) => i + 1);
      setTimeLeft(5);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      handleAnswer('timeout');
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const scenario = PRESSURE_SCENARIOS[currentIndex];
  if (!scenario) return null;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Sob Pressão</h2>
        <p className="text-muted-foreground">Decida rápido! Você tem 5 segundos</p>
      </div>

      <div className="relative">
        <Progress value={(timeLeft / 5) * 100} className="h-2" />
        <div className={`absolute right-0 top-4 text-2xl font-bold ${timeLeft <= 2 ? 'text-destructive animate-pulse' : 'text-foreground'}`}>
          {timeLeft}s
        </div>
      </div>

      <Card className="p-8">
        <p className="text-xl text-foreground text-center mb-8">{scenario.text}</p>
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => handleAnswer('a')} className="h-20 text-lg" variant="outline">
            {scenario.a}
          </Button>
          <Button onClick={() => handleAnswer('b')} className="h-20 text-lg" variant="outline">
            {scenario.b}
          </Button>
        </div>
      </Card>

      <div className="flex justify-center gap-2">
        {PRESSURE_SCENARIOS.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full ${
              i < currentIndex ? 'bg-primary' : i === currentIndex ? 'bg-foreground' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
