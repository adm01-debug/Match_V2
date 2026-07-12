import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { pulseTransition, floatTransition, type IllustrationProps } from './shared';

export const ComunicacaoEmptyIllustration = ({ className }: IllustrationProps) => (
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
      <rect x="40" y="65" width="120" height="80" rx="8" className="fill-background stroke-border" strokeWidth="2" />
      <path d="M40 73L100 110L160 73" className="stroke-border" strokeWidth="2" strokeLinecap="round" />
      <path d="M40 137L80 105" className="stroke-border" strokeWidth="2" strokeLinecap="round" />
      <path d="M160 137L120 105" className="stroke-border" strokeWidth="2" strokeLinecap="round" />
    </motion.g>
    <motion.g
      animate={{ scale: [1, 1.15, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }}
    >
      <circle cx="150" cy="60" r="18" className="fill-primary" />
      <text x="150" y="66" textAnchor="middle" className="fill-primary-foreground text-sm font-bold">0</text>
    </motion.g>
    <motion.circle
      cx="55" cy="150" r="12"
      className="fill-accent/30"
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.5 }}
    />
  </motion.svg>
);
