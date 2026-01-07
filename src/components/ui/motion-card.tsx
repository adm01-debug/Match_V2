/**
 * @fileoverview Motion Card Component
 * @description Card com micro-interações usando Framer Motion
 */

import { motion, HTMLMotionProps, Transition } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MotionCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: 'default' | 'hover' | 'tap' | 'lift';
}

const springTransition: Transition = { 
  type: 'spring' as const, 
  stiffness: 400, 
  damping: 25 
};

export const MotionCard = forwardRef<HTMLDivElement, MotionCardProps>(
  ({ children, variant = 'default', className, ...props }, ref) => {
    const getAnimationProps = () => {
      switch (variant) {
        case 'hover':
          return {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            whileHover: { scale: 1.02, boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.2)' },
            whileTap: { scale: 0.98 },
          };
        case 'tap':
          return {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            whileTap: { scale: 0.95 },
          };
        case 'lift':
          return {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            whileHover: { y: -4, boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.25)' },
          };
        default:
          return {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
          };
      }
    };

    const animProps = getAnimationProps();
    
    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-lg border bg-card text-card-foreground shadow-sm transition-colors',
          className
        )}
        transition={springTransition}
        {...animProps}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

MotionCard.displayName = 'MotionCard';

// Variantes de animação para listas de cards
export const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
  },
};

export default MotionCard;
