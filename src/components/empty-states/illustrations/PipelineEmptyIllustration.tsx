import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { pulseTransition, type IllustrationProps } from './shared';

export const PipelineEmptyIllustration = ({ className }: IllustrationProps) => (
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
    <rect x="30" y="55" width="40" height="90" rx="4" className="fill-background stroke-border" strokeWidth="2" />
    <rect x="80" y="55" width="40" height="90" rx="4" className="fill-background stroke-border" strokeWidth="2" />
    <rect x="130" y="55" width="40" height="90" rx="4" className="fill-background stroke-border" strokeWidth="2" />
    <rect x="35" y="60" width="30" height="6" rx="2" className="fill-muted-foreground/30" />
    <rect x="85" y="60" width="30" height="6" rx="2" className="fill-muted-foreground/30" />
    <rect x="135" y="60" width="30" height="6" rx="2" className="fill-muted-foreground/30" />
    <motion.rect
      x="35" y="75" width="30" height="20" rx="3"
      className="fill-primary/20"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
    />
    <motion.rect
      x="35" y="100" width="30" height="20" rx="3"
      className="fill-primary/15"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.2 }}
    />
    <motion.rect
      x="85" y="75" width="30" height="20" rx="3"
      className="fill-accent/20"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.4 }}
    />
    <motion.rect
      x="135" y="75" width="30" height="20" rx="3"
      className="fill-secondary/30"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.6 }}
    />
    <motion.g
      animate={{ y: [0, 5, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }}
    >
      <path d="M90 155L100 165L110 155M100 165V145" className="stroke-primary" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </motion.g>
  </motion.svg>
);
