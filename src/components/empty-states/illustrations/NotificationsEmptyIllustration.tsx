import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { pulseTransition, type IllustrationProps } from './shared';

export const NotificationsEmptyIllustration = ({ className }: IllustrationProps) => (
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
      animate={{ rotate: [-5, 5, -5] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
      style={{ transformOrigin: '100px 45px' }}
    >
      <path
        d="M100 45C78 45 60 63 60 85V115L50 130H150L140 115V85C140 63 122 45 100 45Z"
        className="fill-background stroke-border"
        strokeWidth="2"
      />
      <path
        d="M85 130C85 138.284 91.7157 145 100 145C108.284 145 115 138.284 115 130"
        className="stroke-border"
        strokeWidth="2"
      />
      <circle cx="100" cy="45" r="5" className="fill-primary" />
    </motion.g>
    <motion.text
      x="145" y="65"
      className="fill-muted-foreground/40 text-sm font-bold"
      animate={{ y: [0, -5, 0], opacity: [0.4, 0.6, 0.4] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const }}
    >Z</motion.text>
    <motion.text
      x="155" y="55"
      className="fill-muted-foreground/30 text-xs font-bold"
      animate={{ y: [0, -5, 0], opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.3 }}
    >z</motion.text>
    <motion.text
      x="162" y="48"
      className="fill-muted-foreground/20 text-xs font-bold"
      animate={{ y: [0, -5, 0], opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' as const, delay: 0.6 }}
    >z</motion.text>
  </motion.svg>
);
