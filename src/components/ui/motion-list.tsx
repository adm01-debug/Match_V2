/**
 * @fileoverview Motion List Component
 * @description Lista com animação stagger usando Framer Motion
 */

import { motion, Variants, Transition } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MotionListProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

interface MotionListItemProps {
  children: ReactNode;
  className?: string;
  index?: number;
}

const springTransition: Transition = { 
  type: 'spring' as const, 
  stiffness: 300, 
  damping: 24 
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
  },
};

export function MotionList({ children, className }: MotionListProps) {
  return (
    <motion.div
      className={cn('space-y-4', className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export function MotionListItem({ children, className }: MotionListItemProps) {
  return (
    <motion.div
      className={className}
      variants={itemVariants}
      transition={springTransition}
      whileHover={{ x: 4 }}
    >
      {children}
    </motion.div>
  );
}

// Grid version
export function MotionGrid({ children, className }: MotionListProps) {
  return (
    <motion.div
      className={cn('grid gap-4', className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.div>
  );
}

export function MotionGridItem({ children, className }: MotionListItemProps) {
  return (
    <motion.div
      className={className}
      variants={itemVariants}
      transition={springTransition}
      whileHover={{ 
        y: -4,
        boxShadow: '0 10px 40px -10px hsl(var(--primary) / 0.15)',
      }}
    >
      {children}
    </motion.div>
  );
}

export default MotionList;
