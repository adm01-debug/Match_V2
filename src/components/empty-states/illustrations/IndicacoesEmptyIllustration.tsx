import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { pulseTransition, type IllustrationProps } from './shared';

export const IndicacoesEmptyIllustration = ({ className }: IllustrationProps) => (
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
    <motion.g
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
    >
      <circle cx="100" cy="85" r="20" className="fill-primary/30 stroke-primary" strokeWidth="2" />
      <circle cx="100" cy="78" r="8" className="fill-primary/40" />
      <path d="M88 95C88 89 93 85 100 85C107 85 112 89 112 95" className="fill-primary/40" />
    </motion.g>
    <line x1="75" y1="85" x2="55" y2="65" className="stroke-primary/50" strokeWidth="2" strokeDasharray="4 2" />
    <line x1="125" y1="85" x2="145" y2="65" className="stroke-primary/50" strokeWidth="2" strokeDasharray="4 2" />
    <line x1="100" y1="110" x2="100" y2="135" className="stroke-primary/50" strokeWidth="2" strokeDasharray="4 2" />
    <motion.g
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
    >
      <circle cx="50" cy="55" r="15" className="fill-accent/30 stroke-border" strokeWidth="2" />
      <path d="M50 50V60M45 55H55" className="stroke-muted-foreground" strokeWidth="2" strokeLinecap="round" />
    </motion.g>
    <motion.g
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.3 }}
    >
      <circle cx="150" cy="55" r="15" className="fill-accent/30 stroke-border" strokeWidth="2" />
      <path d="M150 50V60M145 55H155" className="stroke-muted-foreground" strokeWidth="2" strokeLinecap="round" />
    </motion.g>
    <motion.g
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.6 }}
    >
      <circle cx="100" cy="145" r="15" className="fill-accent/30 stroke-border" strokeWidth="2" />
      <path d="M100 140V150M95 145H105" className="stroke-muted-foreground" strokeWidth="2" strokeLinecap="round" />
    </motion.g>
  </motion.svg>
);
