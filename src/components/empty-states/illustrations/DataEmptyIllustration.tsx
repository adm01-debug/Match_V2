import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { pulseTransition, floatTransition, shimmerTransition, type IllustrationProps } from './shared';

export const DataEmptyIllustration = ({ className }: IllustrationProps) => (
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
    <motion.g animate={{ y: [0, -8, 0] }} transition={floatTransition}>
      <path
        d="M40 70H80L90 60H160C165.523 60 170 64.4772 170 70V140C170 145.523 165.523 150 160 150H40C34.4772 150 30 145.523 30 140V80C30 74.4772 34.4772 70 40 70Z"
        className="fill-background stroke-border"
        strokeWidth="2"
      />
      <path d="M40 70H80L90 60" className="stroke-border" strokeWidth="2" />
      <motion.rect
        x="55" y="90" width="90" height="8" rx="3"
        className="fill-muted-foreground/15"
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={shimmerTransition}
      />
      <motion.rect
        x="55" y="105" width="70" height="8" rx="3"
        className="fill-muted-foreground/15"
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ ...shimmerTransition, delay: 0.2 }}
      />
      <motion.rect
        x="55" y="120" width="80" height="8" rx="3"
        className="fill-muted-foreground/15"
        animate={{ opacity: [0.15, 0.3, 0.15] }}
        transition={{ ...shimmerTransition, delay: 0.4 }}
      />
    </motion.g>
    <motion.g
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }}
    >
      <circle cx="160" cy="50" r="18" className="fill-primary/20" />
      <path d="M160 43V57M153 50H167" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
    </motion.g>
  </motion.svg>
);
