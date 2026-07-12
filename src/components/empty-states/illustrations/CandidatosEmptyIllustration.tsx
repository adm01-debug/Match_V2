import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { pulseTransition, floatTransition, type IllustrationProps } from './shared';

export const CandidatosEmptyIllustration = ({ className }: IllustrationProps) => (
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
      <circle cx="100" cy="75" r="25" className="fill-muted-foreground/20 stroke-border" strokeWidth="2" />
      <path d="M60 140C60 118.461 77.4609 100 99 100H101C122.539 100 140 118.461 140 140V145H60V140Z" className="fill-muted-foreground/20 stroke-border" strokeWidth="2" />
    </motion.g>
    <motion.g
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }}
    >
      <circle cx="155" cy="55" r="18" className="fill-primary/20" />
      <path d="M155 48V62M148 55H162" className="stroke-primary" strokeWidth="3" strokeLinecap="round" />
    </motion.g>
    <motion.circle
      cx="50" cy="140" r="12"
      className="fill-accent/30"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.3 }}
    />
    <motion.circle
      cx="160" cy="130" r="10"
      className="fill-secondary/40"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.6 }}
    />
  </motion.svg>
);
