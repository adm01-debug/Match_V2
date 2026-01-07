/**
 * @fileoverview Motion Button Component
 * @description Button com micro-interações usando Framer Motion
 */

import { motion, HTMLMotionProps, Transition } from 'framer-motion';
import { forwardRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface MotionButtonProps 
  extends Omit<HTMLMotionProps<'button'>, 'children'>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  motionVariant?: 'bounce' | 'pulse' | 'shake' | 'glow';
}

const springTransition: Transition = { 
  type: 'spring' as const, 
  stiffness: 400, 
  damping: 17 
};

export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ children, variant, size, motionVariant = 'bounce', className, ...props }, ref) => {
    const getMotionProps = () => {
      switch (motionVariant) {
        case 'pulse':
          return {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
          };
        case 'shake':
          return {
            whileHover: { x: [0, -2, 2, -2, 2, 0] },
            whileTap: { scale: 0.95 },
          };
        case 'glow':
          return {
            whileHover: { boxShadow: '0 0 20px hsl(var(--primary) / 0.5)' },
            whileTap: { scale: 0.98 },
          };
        default: // bounce
          return {
            whileHover: { scale: 1.05 },
            whileTap: { scale: 0.95 },
          };
      }
    };

    const motionProps = getMotionProps();
    
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        transition={springTransition}
        {...motionProps}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

MotionButton.displayName = 'MotionButton';

export default MotionButton;
