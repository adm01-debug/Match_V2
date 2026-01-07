/**
 * @fileoverview Motion Fade Components
 * @description Componentes de fade in/out com Framer Motion
 */

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MotionFadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

const directionOffsets = {
  up: { y: 20 },
  down: { y: -20 },
  left: { x: 20 },
  right: { x: -20 },
  none: {},
};

export function MotionFadeIn({ 
  children, 
  className, 
  delay = 0, 
  duration = 0.4,
  direction = 'up',
}: MotionFadeProps) {
  const offset = directionOffsets[direction];
  
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, ...offset }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        duration, 
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}

interface MotionFadePresenceProps {
  children: ReactNode;
  className?: string;
  isVisible: boolean;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}

export function MotionFadePresence({ 
  children, 
  className, 
  isVisible,
  direction = 'up',
}: MotionFadePresenceProps) {
  const offset = directionOffsets[direction];
  
  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          className={cn(className)}
          initial={{ opacity: 0, ...offset }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, ...offset }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Scale fade variant
export function MotionScaleFade({ 
  children, 
  className, 
  delay = 0,
}: MotionFadeProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.3, 
        delay,
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
    >
      {children}
    </motion.div>
  );
}

// Blur fade variant
export function MotionBlurFade({ 
  children, 
  className, 
  delay = 0,
}: MotionFadeProps) {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, filter: 'blur(8px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
}

export default MotionFadeIn;
