import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { pulseTransition, type IllustrationProps } from './shared';

export const SearchEmptyIllustration = ({ className }: IllustrationProps) => (
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
      animate={{ rotate: [-3, 3, -3], x: [-2, 2, -2] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2, ease: 'easeInOut' as const }}
    >
      <circle cx="90" cy="85" r="35" className="fill-background stroke-border" strokeWidth="3" />
      <circle cx="90" cy="85" r="25" className="stroke-muted-foreground/30" strokeWidth="2" />
      <line x1="115" y1="110" x2="145" y2="140" className="stroke-border" strokeWidth="8" strokeLinecap="round" />
      <line x1="115" y1="110" x2="145" y2="140" className="stroke-primary" strokeWidth="5" strokeLinecap="round" />
      <motion.path
        d="M80 75L100 95M100 75L80 95"
        className="stroke-muted-foreground"
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }}
      />
    </motion.g>
    <motion.text
      x="50" y="60"
      className="fill-muted-foreground/40 text-lg"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
    >?</motion.text>
    <motion.text
      x="140" y="80"
      className="fill-muted-foreground/40 text-lg"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.5 }}
    >?</motion.text>
  </motion.svg>
);
