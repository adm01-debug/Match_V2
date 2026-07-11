/**
 * @fileoverview Animação flutuante de ganho de XP.
 */

import { AnimatePresence, motion } from 'framer-motion';

interface FloatingXPAnimationProps {
  xpGain: { amount: number; x: number; y: number } | null;
}

export function FloatingXPAnimation({ xpGain }: FloatingXPAnimationProps) {
  return (
    <AnimatePresence>
      {xpGain && (
        <motion.div
          initial={{ opacity: 1, y: 0, scale: 1 }}
          animate={{ opacity: 0, y: -50, scale: 1.5 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            left: xpGain.x - 30,
            top: xpGain.y - 20,
            pointerEvents: 'none',
          }}
          className="text-yellow-500 font-bold text-xl z-50"
        >
          +{xpGain.amount} XP
        </motion.div>
      )}
    </AnimatePresence>
  );
}
