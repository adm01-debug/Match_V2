import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { pulseTransition, floatTransition, type IllustrationProps } from './shared';

export const AgendaEmptyIllustration = ({ className }: IllustrationProps) => (
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
      <rect x="45" y="55" width="110" height="100" rx="8" className="fill-background stroke-border" strokeWidth="2" />
      <rect x="45" y="55" width="110" height="25" rx="8" className="fill-primary/20" />
      <rect x="45" y="72" width="110" height="8" className="fill-primary/20" />
      <circle cx="60" cy="68" r="4" className="fill-primary" />
      <circle cx="140" cy="68" r="4" className="fill-primary" />
      {[0, 1, 2, 3, 4].map((row) =>
        [0, 1, 2, 3, 4, 5, 6].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={52 + col * 14}
            y={90 + row * 12}
            width="10"
            height="8"
            rx="2"
            className={row === 2 && col === 3 ? 'fill-primary' : 'fill-muted-foreground/15'}
          />
        ))
      )}
    </motion.g>
    <motion.g
      animate={{ rotate: [0, 10, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
      style={{ transformOrigin: '160px 50px' }}
    >
      <circle cx="160" cy="50" r="15" className="fill-accent/30" />
      <path d="M160 45V50L164 53" className="stroke-accent-foreground" strokeWidth="2" strokeLinecap="round" />
    </motion.g>
  </motion.svg>
);
