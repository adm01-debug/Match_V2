/**
 * @fileoverview Level Up Celebration Modal
 * @module LevelUpCelebration
 */

import { memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { levels } from '@/hooks/useGamification';

interface LevelUpCelebrationProps {
  isVisible: boolean;
  oldLevel: number;
  newLevel: number;
  onClose: () => void;
}

const levelColors: Record<number, string> = {
  1: 'from-slate-400 to-slate-600',
  2: 'from-green-400 to-green-600',
  3: 'from-blue-400 to-blue-600',
  4: 'from-purple-400 to-purple-600',
  5: 'from-amber-400 to-amber-600',
  6: 'from-orange-400 to-orange-600',
  7: 'from-red-400 to-red-600',
  8: 'from-pink-400 to-pink-600',
  9: 'from-violet-400 to-violet-600',
  10: 'from-yellow-300 to-yellow-500',
};

export const LevelUpCelebration = memo(function LevelUpCelebration({
  isVisible,
  oldLevel,
  newLevel,
  onClose,
}: LevelUpCelebrationProps) {
  const newLevelInfo = levels.find(l => l.level === newLevel) || levels[0];

  useEffect(() => {
    if (isVisible) {
      // Epic confetti burst
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();

      // Star burst from center
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 100,
          origin: { y: 0.5 },
          shapes: ['star'],
          colors,
          scalar: 1.5,
        });
      }, 500);

      // Auto close
      const timer = setTimeout(onClose, 6000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative flex flex-col items-center gap-6 p-10 max-w-md"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Floating particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-primary/50"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}

            {/* Level Up Badge */}
            <motion.div
              className={cn(
                "relative w-32 h-32 rounded-full flex items-center justify-center",
                "bg-gradient-to-br shadow-2xl",
                levelColors[newLevel] || levelColors[1]
              )}
              animate={{
                boxShadow: [
                  '0 0 30px rgba(255,215,0,0.3)',
                  '0 0 60px rgba(255,215,0,0.6)',
                  '0 0 30px rgba(255,215,0,0.3)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {/* Rotating ring */}
              <motion.div
                className="absolute inset-[-4px] rounded-full border-4 border-dashed border-white/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              />

              {/* Level number */}
              <motion.span
                className="text-5xl font-black text-white drop-shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                {newLevel}
              </motion.span>

              {/* Icon */}
              <motion.span
                className="absolute -top-4 text-4xl"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
              >
                {newLevelInfo?.icon || '🌟'}
              </motion.span>
            </motion.div>

            {/* Arrow up animation */}
            <motion.div
              className="flex items-center gap-2 text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-lg">{oldLevel}</span>
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <ArrowUp className="h-5 w-5 text-green-500" />
              </motion.div>
              <span className="text-lg font-bold text-primary">{newLevel}</span>
            </motion.div>

            {/* Text */}
            <div className="text-center space-y-2">
              <motion.div
                className="flex items-center justify-center gap-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Level Up!
                </span>
                <Sparkles className="h-5 w-5 text-yellow-500" />
              </motion.div>

              <motion.h2
                className="text-3xl font-bold"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {newLevelInfo?.title || 'Novo Nível'}
              </motion.h2>

              <motion.p
                className="text-muted-foreground"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Parabéns! Você alcançou um novo nível de excelência.
              </motion.p>
            </div>

            {/* Continue button */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <Button onClick={onClose} size="lg" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Continuar
              </Button>
            </motion.div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-0 right-0 p-2 rounded-full hover:bg-muted/50 transition-colors"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

LevelUpCelebration.displayName = 'LevelUpCelebration';
