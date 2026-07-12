import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { pulseTransition, shimmerTransition, type IllustrationProps } from './shared';

export const DashboardEmptyIllustration = ({ className }: IllustrationProps) => (
  <motion.svg
    className={cn('w-48 h-48', className)}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.circle
      cx="100" cy="100" r="80"
      className="fill-muted/50"
      animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
      transition={pulseTransition}
    />
    <motion.rect
      x="35" y="45" width="55" height="45" rx="6"
      className="fill-background stroke-border" strokeWidth="2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' as const }}
    />
    <motion.rect
      x="110" y="45" width="55" height="45" rx="6"
      className="fill-background stroke-border" strokeWidth="2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2, ease: 'easeOut' as const }}
    />
    <motion.rect
      x="35" y="105" width="55" height="45" rx="6"
      className="fill-background stroke-border" strokeWidth="2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' as const }}
    />
    <motion.rect
      x="110" y="105" width="55" height="45" rx="6"
      className="fill-background stroke-border" strokeWidth="2"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.4, ease: 'easeOut' as const }}
    />
    <rect x="45" y="55" width="25" height="8" rx="2" className="fill-muted-foreground/20" />
    <motion.rect
      x="45" y="70" width="35" height="12" rx="3"
      className="fill-primary/30"
      animate={{ opacity: [0.3, 0.5, 0.3] }}
      transition={shimmerTransition}
    />
    <rect x="120" y="55" width="25" height="8" rx="2" className="fill-muted-foreground/20" />
    <motion.rect
      x="120" y="70" width="35" height="12" rx="3"
      className="fill-accent/30"
      animate={{ opacity: [0.3, 0.5, 0.3] }}
      transition={{ ...shimmerTransition, delay: 0.3 }}
    />
    <rect x="45" y="115" width="25" height="8" rx="2" className="fill-muted-foreground/20" />
    <motion.rect
      x="45" y="130" width="35" height="12" rx="3"
      className="fill-secondary/40"
      animate={{ opacity: [0.4, 0.6, 0.4] }}
      transition={{ ...shimmerTransition, delay: 0.6 }}
    />
    <rect x="120" y="115" width="25" height="8" rx="2" className="fill-muted-foreground/20" />
    <motion.rect
      x="120" y="130" width="35" height="12" rx="3"
      className="fill-primary/20"
      animate={{ opacity: [0.2, 0.4, 0.2] }}
      transition={{ ...shimmerTransition, delay: 0.9 }}
    />
    <motion.path
      d="M170 35L173 42L180 45L173 48L170 55L167 48L160 45L167 42Z"
      className="fill-primary"
      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.8, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' as const }}
    />
  </motion.svg>
);
