/**
 * @fileoverview Motion Icon Component
 * @description Ícone com micro-interações
 */

import { motion, Transition } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MotionIconProps {
  children: ReactNode;
  className?: string;
  effect?: 'spin' | 'bounce' | 'pulse' | 'shake' | 'none';
  onClick?: () => void;
}

const springTransition: Transition = { 
  type: 'spring' as const, 
  stiffness: 500, 
  damping: 20 
};

export function MotionIcon({ 
  children, 
  className, 
  effect = 'bounce',
  onClick,
}: MotionIconProps) {
  const getHoverAnimation = () => {
    switch (effect) {
      case 'spin':
        return { rotate: 360 };
      case 'bounce':
        return { y: -3 };
      case 'pulse':
        return { scale: 1.2 };
      case 'shake':
        return { x: [0, -3, 3, -3, 3, 0] };
      default:
        return {};
    }
  };

  return (
    <motion.span
      className={cn('inline-flex items-center justify-center', className)}
      whileHover={getHoverAnimation()}
      whileTap={{ scale: 0.9 }}
      transition={effect === 'shake' ? { duration: 0.4 } : springTransition}
      onClick={onClick}
    >
      {children}
    </motion.span>
  );
}

// Loading spinner
export function MotionSpinner({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn('h-5 w-5 rounded-full border-2 border-primary border-t-transparent', className)}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    />
  );
}

// Pulsing dot
export function MotionPulse({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn('h-2 w-2 rounded-full bg-primary', className)}
      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}

// Success checkmark animation
export function MotionCheck({ className }: { className?: string }) {
  return (
    <motion.svg
      className={cn('h-6 w-6 text-green-500', className)}
      viewBox="0 0 24 24"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.path
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      />
    </motion.svg>
  );
}

export default MotionIcon;
