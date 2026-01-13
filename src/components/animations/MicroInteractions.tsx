/**
 * Micro Interaction Animations Library
 * @module components/animations/MicroInteractions
 */

import { memo, ReactNode } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';

// Animation Variants
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 }
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 }
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: 0 }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

// Animated Components
interface AnimatedProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export const FadeInUp = memo(({ children, className, delay = 0, duration = 0.3 }: AnimatedProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeInUp}
    transition={{ duration, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
));

FadeInUp.displayName = 'FadeInUp';

export const FadeInDown = memo(({ children, className, delay = 0, duration = 0.3 }: AnimatedProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={fadeInDown}
    transition={{ duration, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
));

FadeInDown.displayName = 'FadeInDown';

export const ScaleIn = memo(({ children, className, delay = 0, duration = 0.3 }: AnimatedProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={scaleIn}
    transition={{ duration, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
));

ScaleIn.displayName = 'ScaleIn';

// Hover Effects
interface HoverEffectProps {
  children: ReactNode;
  className?: string;
  scale?: number;
  lift?: number;
}

export const HoverScale = memo(({ children, className, scale = 1.02 }: HoverEffectProps) => (
  <motion.div
    whileHover={{ scale }}
    whileTap={{ scale: 0.98 }}
    className={className}
  >
    {children}
  </motion.div>
));

HoverScale.displayName = 'HoverScale';

export const HoverLift = memo(({ children, className, lift = -4 }: HoverEffectProps) => (
  <motion.div
    whileHover={{ y: lift, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.2)' }}
    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    className={className}
  >
    {children}
  </motion.div>
));

HoverLift.displayName = 'HoverLift';

export const HoverGlow = memo(({ children, className }: Omit<HoverEffectProps, 'scale' | 'lift'>) => (
  <motion.div
    whileHover={{ 
      boxShadow: '0 0 20px rgba(var(--primary), 0.3)',
      borderColor: 'hsl(var(--primary))'
    }}
    transition={{ duration: 0.2 }}
    className={cn('border border-transparent rounded-lg', className)}
  >
    {children}
  </motion.div>
));

HoverGlow.displayName = 'HoverGlow';

// Stagger Lists
interface StaggerListProps {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
}

export const StaggerList = memo(({ children, className, itemClassName }: StaggerListProps) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={staggerContainer}
    className={className}
  >
    {children.map((child, index) => (
      <motion.div
        key={index}
        variants={fadeInUp}
        className={itemClassName}
      >
        {child}
      </motion.div>
    ))}
  </motion.div>
));

StaggerList.displayName = 'StaggerList';

// Pulse Animation
export const Pulse = memo(({ children, className }: Omit<AnimatedProps, 'delay' | 'duration'>) => (
  <motion.div
    animate={{ 
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1]
    }}
    transition={{ 
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut'
    }}
    className={className}
  >
    {children}
  </motion.div>
));

Pulse.displayName = 'Pulse';

// Shake Animation (for errors)
export const Shake = memo(({ children, className, trigger = false }: AnimatedProps & { trigger?: boolean }) => (
  <motion.div
    animate={trigger ? {
      x: [-10, 10, -10, 10, 0],
      transition: { duration: 0.4 }
    } : {}}
    className={className}
  >
    {children}
  </motion.div>
));

Shake.displayName = 'Shake';

// Success Check Animation
export const SuccessCheck = memo(({ size = 40, className }: { size?: number; className?: string }) => (
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
    className={cn('flex items-center justify-center', className)}
  >
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 50 50"
      className="text-green-500"
    >
      <motion.circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.path
        d="M15 25 L22 32 L35 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      />
    </motion.svg>
  </motion.div>
));

SuccessCheck.displayName = 'SuccessCheck';

// Loading Dots
export const LoadingDots = memo(({ className }: { className?: string }) => (
  <div className={cn('flex items-center gap-1', className)}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        className="w-2 h-2 bg-current rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          delay: i * 0.2
        }}
      />
    ))}
  </div>
));

LoadingDots.displayName = 'LoadingDots';

// Skeleton Shimmer
export const ShimmerEffect = memo(({ className }: { className?: string }) => (
  <motion.div
    className={cn(
      'relative overflow-hidden bg-muted rounded',
      className
    )}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
      animate={{ x: ['-100%', '100%'] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear'
      }}
    />
  </motion.div>
));

ShimmerEffect.displayName = 'ShimmerEffect';

// Number Counter Animation
interface CounterProps {
  from: number;
  to: number;
  className?: string;
}

export const AnimatedCounter = memo(({ from, to, className }: CounterProps) => (
  <motion.span
    className={className}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {Math.round(
        from + (to - from) * Math.min(1, 1)
      )}
    </motion.span>
  </motion.span>
));

AnimatedCounter.displayName = 'AnimatedCounter';

// Page Transition Wrapper
export const PageTransition = memo(({ children, className }: Omit<AnimatedProps, 'delay' | 'duration'>) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
    className={className}
  >
    {children}
  </motion.div>
));

PageTransition.displayName = 'PageTransition';

// Notification Badge Bounce
export const NotificationBadge = memo(({ count, className }: { count: number; className?: string }) => (
  <AnimatePresence>
    {count > 0 && (
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        className={cn(
          'absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center',
          'bg-destructive text-destructive-foreground text-xs font-bold rounded-full',
          className
        )}
      >
        {count > 99 ? '99+' : count}
      </motion.span>
    )}
  </AnimatePresence>
));

NotificationBadge.displayName = 'NotificationBadge';

export default {
  FadeInUp,
  FadeInDown,
  ScaleIn,
  HoverScale,
  HoverLift,
  HoverGlow,
  StaggerList,
  Pulse,
  Shake,
  SuccessCheck,
  LoadingDots,
  ShimmerEffect,
  AnimatedCounter,
  PageTransition,
  NotificationBadge
};
