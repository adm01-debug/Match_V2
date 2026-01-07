/**
 * @fileoverview Motion Hover Effects
 * @description Efeitos de hover com Framer Motion
 */

import { motion, Transition } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface MotionHoverProps {
  children: ReactNode;
  className?: string;
  effect?: 'scale' | 'lift' | 'glow' | 'tilt' | 'bounce';
}

const springTransition: Transition = { 
  type: 'spring' as const, 
  stiffness: 400, 
  damping: 25 
};

export const MotionHoverScale = forwardRef<HTMLDivElement, MotionHoverProps>(
  ({ children, className }, ref) => (
    <motion.div
      ref={ref}
      className={cn('cursor-pointer', className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={springTransition}
    >
      {children}
    </motion.div>
  )
);
MotionHoverScale.displayName = 'MotionHoverScale';

export const MotionHoverLift = forwardRef<HTMLDivElement, MotionHoverProps>(
  ({ children, className }, ref) => (
    <motion.div
      ref={ref}
      className={cn('cursor-pointer', className)}
      whileHover={{ 
        y: -6, 
        boxShadow: '0 20px 40px -15px hsl(var(--primary) / 0.2)' 
      }}
      whileTap={{ y: 0 }}
      transition={springTransition}
    >
      {children}
    </motion.div>
  )
);
MotionHoverLift.displayName = 'MotionHoverLift';

export const MotionHoverGlow = forwardRef<HTMLDivElement, MotionHoverProps>(
  ({ children, className }, ref) => (
    <motion.div
      ref={ref}
      className={cn('cursor-pointer', className)}
      whileHover={{ 
        boxShadow: '0 0 30px hsl(var(--primary) / 0.4)' 
      }}
      transition={springTransition}
    >
      {children}
    </motion.div>
  )
);
MotionHoverGlow.displayName = 'MotionHoverGlow';

export const MotionHoverTilt = forwardRef<HTMLDivElement, MotionHoverProps>(
  ({ children, className }, ref) => (
    <motion.div
      ref={ref}
      className={cn('cursor-pointer perspective-1000', className)}
      whileHover={{ rotateX: 5, rotateY: 5 }}
      transition={springTransition}
    >
      {children}
    </motion.div>
  )
);
MotionHoverTilt.displayName = 'MotionHoverTilt';

export const MotionHoverBounce = forwardRef<HTMLDivElement, MotionHoverProps>(
  ({ children, className }, ref) => (
    <motion.div
      ref={ref}
      className={cn('cursor-pointer', className)}
      whileHover={{ y: [0, -8, 0] }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
);
MotionHoverBounce.displayName = 'MotionHoverBounce';

// Universal hover wrapper
export function MotionHover({ children, className, effect = 'scale' }: MotionHoverProps) {
  switch (effect) {
    case 'lift':
      return <MotionHoverLift className={className}>{children}</MotionHoverLift>;
    case 'glow':
      return <MotionHoverGlow className={className}>{children}</MotionHoverGlow>;
    case 'tilt':
      return <MotionHoverTilt className={className}>{children}</MotionHoverTilt>;
    case 'bounce':
      return <MotionHoverBounce className={className}>{children}</MotionHoverBounce>;
    default:
      return <MotionHoverScale className={className}>{children}</MotionHoverScale>;
  }
}

export default MotionHover;
