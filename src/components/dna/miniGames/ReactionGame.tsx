import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Timer, Zap } from 'lucide-react';
import type { MiniGameProps } from './types';

export const ReactionGame: React.FC<MiniGameProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'ready' | 'wait' | 'click' | 'done'>('ready');
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [waitStart, setWaitStart] = useState(0);
  const [round, setRound] = useState(0);
  const totalRounds = 5;

  const startRound = () => {
    setPhase('wait');
    const delay = 1000 + Math.random() * 3000;
    setTimeout(() => {
      setWaitStart(Date.now());
      setPhase('click');
    }, delay);
  };

  const handleClick = () => {
    let newTimes = reactionTimes;
    if (phase === 'wait') {
      newTimes = [...reactionTimes, 1000];
    } else if (phase === 'click') {
      newTimes = [...reactionTimes, Date.now() - waitStart];
    }
    setReactionTimes(newTimes);

    if (round + 1 >= totalRounds) {
      setPhase('done');
      const avgTime = newTimes.reduce((a, b) => a + b, 0) / newTimes.length;
      const score = Math.max(0, 100 - avgTime / 5);
      onComplete({
        gameType: 'reaction',
        score: Math.round(score),
        timeSpent: newTimes.reduce((a, b) => a + b, 0) / 1000,
        details: { reactionTimes: newTimes, averageTime: avgTime },
      });
    } else {
      setRound((r) => r + 1);
      setPhase('ready');
    }
  };

  const bgColor = phase === 'wait' ? 'bg-destructive/20' : phase === 'click' ? 'bg-success' : 'bg-primary/10';

  return (
    <div className="max-w-md mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Reflexos</h2>
        <p className="text-muted-foreground">Clique quando a tela ficar verde</p>
        <p className="text-sm text-muted-foreground mt-2">Rodada {round + 1} de {totalRounds}</p>
      </div>

      <motion.div
        className={`h-64 rounded-2xl flex items-center justify-center cursor-pointer transition-colors ${bgColor}`}
        onClick={phase === 'ready' ? startRound : handleClick}
        animate={phase === 'click' ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.2 }}
      >
        {phase === 'ready' && (
          <div className="text-center">
            <Play className="w-12 h-12 text-foreground mx-auto mb-2" />
            <span className="text-foreground">Clique para começar</span>
          </div>
        )}
        {phase === 'wait' && (
          <div className="text-center">
            <Timer className="w-12 h-12 text-destructive mx-auto mb-2 animate-pulse" />
            <span className="text-destructive">Aguarde...</span>
          </div>
        )}
        {phase === 'click' && (
          <div className="text-center">
            <Zap className="w-16 h-16 text-foreground mx-auto animate-bounce" />
            <span className="text-foreground text-2xl font-bold">AGORA!</span>
          </div>
        )}
      </motion.div>

      <div className="flex justify-center gap-2 flex-wrap">
        {reactionTimes.map((time, i) => (
          <div
            key={i}
            className={`px-3 py-1 rounded-full text-sm ${
              time < 300
                ? 'bg-success/20 text-success'
                : time < 500
                ? 'bg-warning/20 text-warning'
                : 'bg-destructive/20 text-destructive'
            }`}
          >
            {time}ms
          </div>
        ))}
      </div>
    </div>
  );
};
