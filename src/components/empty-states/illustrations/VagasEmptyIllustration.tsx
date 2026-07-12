import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { pulseTransition, floatTransition, shimmerTransition, type IllustrationProps } from './shared';

export const VagasEmptyIllustration = ({ className }: IllustrationProps) => (
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
      <rect x="50" y="60" width="100" height="80" rx="8" className="fill-background stroke-border" strokeWidth="2" />
      <rect x="60" y="75" width="60" height="8" rx="2" className="fill-muted-foreground/30" />
      <motion.rect
        x="60" y="90" width="80" height="6" rx="2"
        className="fill-muted-foreground/20"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={shimmerTransition}
      />
      <motion.rect
        x="60" y="102" width="70" height="6" rx="2"
        className="fill-muted-foreground/20"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={{ ...shimmerTransition, delay: 0.3 }}
      />
      <rect x="60" y="120" width="40" height="10" rx="4" className="fill-primary/30" />
    </motion.g>
    <motion.g
      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
    >
      <circle cx="140" cy="50" r="20" className="fill-primary/20" />
      <path d="M135 50L139 54L147 46" className="stroke-primary" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </motion.g>
    <motion.g
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.5 }}
    >
      <circle cx="160" cy="150" r="15" className="fill-accent/30" />
      <path d="M155 150H165M160 145V155" className="stroke-accent-foreground" strokeWidth="2" strokeLinecap="round" />
    </motion.g>
  </motion.svg>
);
