import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { pulseTransition, type IllustrationProps } from './shared';

export const ReportsEmptyIllustration = ({ className }: IllustrationProps) => (
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
    <rect x="40" y="50" width="120" height="100" rx="8" className="fill-background stroke-border" strokeWidth="2" />
    <line x1="50" y1="80" x2="150" y2="80" className="stroke-muted-foreground/20" strokeWidth="1" />
    <line x1="50" y1="100" x2="150" y2="100" className="stroke-muted-foreground/20" strokeWidth="1" />
    <line x1="50" y1="120" x2="150" y2="120" className="stroke-muted-foreground/20" strokeWidth="1" />
    <motion.rect
      x="60" y="135" width="15" rx="2"
      className="fill-primary/40"
      initial={{ height: 0 }}
      animate={{ height: 40, y: 95 }}
      transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' as const }}
    />
    <motion.rect
      x="85" y="135" width="15" rx="2"
      className="fill-primary/60"
      initial={{ height: 0 }}
      animate={{ height: 60, y: 75 }}
      transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' as const }}
    />
    <motion.rect
      x="110" y="135" width="15" rx="2"
      className="fill-primary/50"
      initial={{ height: 0 }}
      animate={{ height: 50, y: 85 }}
      transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' as const }}
    />
    <motion.rect
      x="135" y="135" width="15" rx="2"
      className="fill-primary"
      initial={{ height: 0 }}
      animate={{ height: 70, y: 65 }}
      transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' as const }}
    />
    <motion.path
      d="M67 90L92 70L117 80L142 55"
      className="stroke-accent"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut' as const }}
    />
    <motion.g
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }}
    >
      <path d="M155 50L165 40L175 50M165 40V60" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </motion.g>
  </motion.svg>
);
