import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { pulseTransition, floatTransition, shimmerTransition, type IllustrationProps } from './shared';

export const TestsEmptyIllustration = ({ className }: IllustrationProps) => (
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
      <rect x="55" y="45" width="90" height="115" rx="6" className="fill-background stroke-border" strokeWidth="2" />
      <rect x="65" y="60" width="50" height="6" rx="2" className="fill-muted-foreground/30" />
      <motion.g
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' as const }}
      >
        <rect x="65" y="80" width="12" height="12" rx="2" className="fill-primary/20 stroke-primary" strokeWidth="1.5" />
        <path d="M68 86L71 89L76 84" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
      <motion.rect
        x="82" y="83" width="55" height="6" rx="2"
        className="fill-muted-foreground/20"
        animate={{ opacity: [0.2, 0.4, 0.2] }}
        transition={shimmerTransition}
      />
      <rect x="65" y="100" width="12" height="12" rx="2" className="stroke-border" strokeWidth="1.5" />
      <rect x="82" y="103" width="50" height="6" rx="2" className="fill-muted-foreground/20" />
      <rect x="65" y="120" width="12" height="12" rx="2" className="stroke-border" strokeWidth="1.5" />
      <rect x="82" y="123" width="45" height="6" rx="2" className="fill-muted-foreground/20" />
    </motion.g>
    <motion.g
      animate={{ rotate: [-5, 5, -5], x: [0, 2, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' as const }}
      style={{ transformOrigin: '145px 60px' }}
    >
      <g transform="translate(130, 35) rotate(45)">
        <rect x="0" y="0" width="8" height="45" rx="1" className="fill-primary" />
        <polygon points="4,45 0,55 8,55" className="fill-primary" />
      </g>
    </motion.g>
  </motion.svg>
);
