/**
 * @fileoverview SVG Illustrations for Empty States
 * Ilustrações personalizadas com animações suaves
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IllustrationProps {
  className?: string;
}

// Variantes de animação para elementos SVG
const floatAnimation = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const pulseAnimation = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.5, 0.8, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const shimmerAnimation = {
  animate: {
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Ilustração para lista de vagas vazia
export const VagasEmptyIllustration = ({ className }: IllustrationProps) => (
  <motion.svg
    className={cn("w-48 h-48", className)}
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
      {...pulseAnimation}
    />
    <motion.g {...floatAnimation}>
      <rect x="50" y="60" width="100" height="80" rx="8" className="fill-background stroke-border" strokeWidth="2" />
      <rect x="60" y="75" width="60" height="8" rx="2" className="fill-muted-foreground/30" />
      <motion.rect x="60" y="90" width="80" height="6" rx="2" className="fill-muted-foreground/20" {...shimmerAnimation} />
      <motion.rect x="60" y="102" width="70" height="6" rx="2" className="fill-muted-foreground/20" animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
      <rect x="60" y="120" width="40" height="10" rx="4" className="fill-primary/30" />
    </motion.g>
    <motion.g animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
      <circle cx="140" cy="50" r="20" className="fill-primary/20" />
      <path d="M135 50L139 54L147 46" className="stroke-primary" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </motion.g>
    <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
      <circle cx="160" cy="150" r="15" className="fill-accent/30" />
      <path d="M155 150H165M160 145V155" className="stroke-accent-foreground" strokeWidth="2" strokeLinecap="round" />
    </motion.g>
  </motion.svg>
);

// Ilustração para candidatos
export const CandidatosEmptyIllustration = ({ className }: IllustrationProps) => (
  <motion.svg
    className={cn("w-48 h-48", className)}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.circle cx="100" cy="100" r="80" className="fill-muted/50" {...pulseAnimation} />
    <motion.g {...floatAnimation}>
      <circle cx="100" cy="75" r="25" className="fill-muted-foreground/20 stroke-border" strokeWidth="2" />
      <path d="M60 140C60 118.461 77.4609 100 99 100H101C122.539 100 140 118.461 140 140V145H60V140Z" className="fill-muted-foreground/20 stroke-border" strokeWidth="2" />
    </motion.g>
    <motion.g animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
      <circle cx="155" cy="55" r="18" className="fill-primary/20" />
      <path d="M155 48V62M148 55H162" className="stroke-primary" strokeWidth="3" strokeLinecap="round" />
    </motion.g>
    <motion.circle cx="50" cy="140" r="12" className="fill-accent/30" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }} />
    <motion.circle cx="160" cy="130" r="10" className="fill-secondary/40" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }} />
  </motion.svg>
);

// Ilustração para pipeline
export const PipelineEmptyIllustration = ({ className }: IllustrationProps) => (
  <motion.svg
    className={cn("w-48 h-48", className)}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.circle cx="100" cy="100" r="80" className="fill-muted/50" {...pulseAnimation} />
    {/* Kanban columns */}
    <rect x="30" y="55" width="40" height="90" rx="4" className="fill-background stroke-border" strokeWidth="2" />
    <rect x="80" y="55" width="40" height="90" rx="4" className="fill-background stroke-border" strokeWidth="2" />
    <rect x="130" y="55" width="40" height="90" rx="4" className="fill-background stroke-border" strokeWidth="2" />
    
    {/* Column headers */}
    <rect x="35" y="60" width="30" height="6" rx="2" className="fill-muted-foreground/30" />
    <rect x="85" y="60" width="30" height="6" rx="2" className="fill-muted-foreground/30" />
    <rect x="135" y="60" width="30" height="6" rx="2" className="fill-muted-foreground/30" />
    
    {/* Animated Cards */}
    <motion.rect x="35" y="75" width="30" height="20" rx="3" className="fill-primary/20" animate={{ y: [75, 72, 75] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} />
    <motion.rect x="35" y="100" width="30" height="20" rx="3" className="fill-primary/15" animate={{ y: [100, 97, 100] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }} />
    <motion.rect x="85" y="75" width="30" height="20" rx="3" className="fill-accent/20" animate={{ y: [75, 72, 75] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }} />
    <motion.rect x="135" y="75" width="30" height="20" rx="3" className="fill-secondary/30" animate={{ y: [75, 72, 75] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }} />
    
    {/* Arrow with bounce */}
    <motion.g animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
      <path d="M90 155L100 165L110 155M100 165V145" className="stroke-primary" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </motion.g>
  </motion.svg>
);

// Ilustração para agenda
export const AgendaEmptyIllustration = ({ className }: IllustrationProps) => (
  <motion.svg
    className={cn("w-48 h-48", className)}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.circle cx="100" cy="100" r="80" className="fill-muted/50" {...pulseAnimation} />
    
    <motion.g {...floatAnimation}>
      {/* Calendar */}
      <rect x="45" y="55" width="110" height="100" rx="8" className="fill-background stroke-border" strokeWidth="2" />
      <rect x="45" y="55" width="110" height="25" rx="8" className="fill-primary/20" />
      <rect x="45" y="72" width="110" height="8" className="fill-primary/20" />
      
      {/* Calendar header dots */}
      <circle cx="60" cy="68" r="4" className="fill-primary" />
      <circle cx="140" cy="68" r="4" className="fill-primary" />
      
      {/* Calendar grid */}
      {[0, 1, 2, 3, 4].map((row) => (
        [0, 1, 2, 3, 4, 5, 6].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={52 + col * 14}
            y={90 + row * 12}
            width="10"
            height="8"
            rx="2"
            className={`${row === 2 && col === 3 ? 'fill-primary' : 'fill-muted-foreground/15'}`}
          />
        ))
      ))}
    </motion.g>
    
    <motion.g animate={{ rotate: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} style={{ transformOrigin: '160px 50px' }}>
      <circle cx="160" cy="50" r="15" className="fill-accent/30" />
      <path d="M160 45V50L164 53" className="stroke-accent-foreground" strokeWidth="2" strokeLinecap="round" />
    </motion.g>
  </motion.svg>
);

// Ilustração para testes/provas
export const TestsEmptyIllustration = ({ className }: IllustrationProps) => (
  <motion.svg
    className={cn("w-48 h-48", className)}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.circle cx="100" cy="100" r="80" className="fill-muted/50" {...pulseAnimation} />
    
    <motion.g {...floatAnimation}>
      {/* Document */}
      <rect x="55" y="45" width="90" height="115" rx="6" className="fill-background stroke-border" strokeWidth="2" />
      
      {/* Lines */}
      <rect x="65" y="60" width="50" height="6" rx="2" className="fill-muted-foreground/30" />
      
      {/* Checkboxes with animation */}
      <motion.g animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <rect x="65" y="80" width="12" height="12" rx="2" className="fill-primary/20 stroke-primary" strokeWidth="1.5" />
        <path d="M68 86L71 89L76 84" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </motion.g>
      <motion.rect x="82" y="83" width="55" height="6" rx="2" className="fill-muted-foreground/20" {...shimmerAnimation} />
      
      <rect x="65" y="100" width="12" height="12" rx="2" className="stroke-border" strokeWidth="1.5" />
      <rect x="82" y="103" width="50" height="6" rx="2" className="fill-muted-foreground/20" />
      
      <rect x="65" y="120" width="12" height="12" rx="2" className="stroke-border" strokeWidth="1.5" />
      <rect x="82" y="123" width="45" height="6" rx="2" className="fill-muted-foreground/20" />
    </motion.g>
    
    {/* Pencil with writing animation */}
    <motion.g
      animate={{ rotate: [-5, 5, -5], x: [0, 2, 0] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
      style={{ transformOrigin: '145px 60px' }}
    >
      <g transform="translate(130, 35) rotate(45)">
        <rect x="0" y="0" width="8" height="45" rx="1" className="fill-primary" />
        <polygon points="4,45 0,55 8,55" className="fill-primary" />
      </g>
    </motion.g>
  </motion.svg>
);

// Ilustração para comunicação
export const ComunicacaoEmptyIllustration = ({ className }: IllustrationProps) => (
  <motion.svg
    className={cn("w-48 h-48", className)}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.circle cx="100" cy="100" r="80" className="fill-muted/50" {...pulseAnimation} />
    
    <motion.g {...floatAnimation}>
      {/* Envelope */}
      <rect x="40" y="65" width="120" height="80" rx="8" className="fill-background stroke-border" strokeWidth="2" />
      <motion.path
        d="M40 73L100 110L160 73"
        className="stroke-border"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
      />
      <path d="M40 137L80 105" className="stroke-border" strokeWidth="2" strokeLinecap="round" />
      <path d="M160 137L120 105" className="stroke-border" strokeWidth="2" strokeLinecap="round" />
    </motion.g>
    
    {/* Notification badge with pulse */}
    <motion.g animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
      <circle cx="150" cy="60" r="18" className="fill-primary" />
      <text x="150" y="66" textAnchor="middle" className="fill-primary-foreground text-sm font-bold">0</text>
    </motion.g>
    
    <motion.circle cx="55" cy="150" r="12" className="fill-accent/30" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }} />
  </motion.svg>
);

// Ilustração para indicações
export const IndicacoesEmptyIllustration = ({ className }: IllustrationProps) => (
  <motion.svg
    className={cn("w-48 h-48", className)}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.circle cx="100" cy="100" r="80" className="fill-muted/50" {...pulseAnimation} />
    
    {/* Central user with pulse */}
    <motion.g animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }}>
      <circle cx="100" cy="85" r="20" className="fill-primary/30 stroke-primary" strokeWidth="2" />
      <circle cx="100" cy="78" r="8" className="fill-primary/40" />
      <path d="M88 95C88 89 93 85 100 85C107 85 112 89 112 95" className="fill-primary/40" />
    </motion.g>
    
    {/* Animated connection lines */}
    <motion.line
      x1="75" y1="85" x2="55" y2="65"
      className="stroke-primary/50"
      strokeWidth="2"
      strokeDasharray="4 2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5 }}
    />
    <motion.line
      x1="125" y1="85" x2="145" y2="65"
      className="stroke-primary/50"
      strokeWidth="2"
      strokeDasharray="4 2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5, delay: 0.3 }}
    />
    <motion.line
      x1="100" y1="110" x2="100" y2="135"
      className="stroke-primary/50"
      strokeWidth="2"
      strokeDasharray="4 2"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 0.5, delay: 0.6 }}
    />
    
    {/* Connected users with bounce */}
    <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }}>
      <circle cx="50" cy="55" r="15" className="fill-accent/30 stroke-border" strokeWidth="2" />
      <path d="M50 50V60M45 55H55" className="stroke-muted-foreground" strokeWidth="2" strokeLinecap="round" />
    </motion.g>
    <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}>
      <circle cx="150" cy="55" r="15" className="fill-accent/30 stroke-border" strokeWidth="2" />
      <path d="M150 50V60M145 55H155" className="stroke-muted-foreground" strokeWidth="2" strokeLinecap="round" />
    </motion.g>
    <motion.g animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>
      <circle cx="100" cy="145" r="15" className="fill-accent/30 stroke-border" strokeWidth="2" />
      <path d="M100 140V150M95 145H105" className="stroke-muted-foreground" strokeWidth="2" strokeLinecap="round" />
    </motion.g>
  </motion.svg>
);

// Ilustração para relatórios
export const ReportsEmptyIllustration = ({ className }: IllustrationProps) => (
  <motion.svg
    className={cn("w-48 h-48", className)}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.circle cx="100" cy="100" r="80" className="fill-muted/50" {...pulseAnimation} />
    
    {/* Chart background */}
    <rect x="40" y="50" width="120" height="100" rx="8" className="fill-background stroke-border" strokeWidth="2" />
    
    {/* Grid lines */}
    <line x1="50" y1="80" x2="150" y2="80" className="stroke-muted-foreground/20" strokeWidth="1" />
    <line x1="50" y1="100" x2="150" y2="100" className="stroke-muted-foreground/20" strokeWidth="1" />
    <line x1="50" y1="120" x2="150" y2="120" className="stroke-muted-foreground/20" strokeWidth="1" />
    
    {/* Animated Bars */}
    <motion.rect x="60" y="135" width="15" height="0" rx="2" className="fill-primary/40" animate={{ height: 40, y: 95 }} transition={{ duration: 0.8, delay: 0.1 }} />
    <motion.rect x="85" y="135" width="15" height="0" rx="2" className="fill-primary/60" animate={{ height: 60, y: 75 }} transition={{ duration: 0.8, delay: 0.2 }} />
    <motion.rect x="110" y="135" width="15" height="0" rx="2" className="fill-primary/50" animate={{ height: 50, y: 85 }} transition={{ duration: 0.8, delay: 0.3 }} />
    <motion.rect x="135" y="135" width="15" height="0" rx="2" className="fill-primary" animate={{ height: 70, y: 65 }} transition={{ duration: 0.8, delay: 0.4 }} />
    
    {/* Trend line */}
    <motion.path
      d="M67 90L92 70L117 80L142 55"
      className="stroke-accent"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, delay: 0.5 }}
    />
    
    {/* Arrow up with bounce */}
    <motion.g animate={{ y: [0, -5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
      <path d="M155 50L165 40L175 50M165 40V60" className="stroke-primary" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </motion.g>
  </motion.svg>
);

// Ilustração para busca sem resultados
export const SearchEmptyIllustration = ({ className }: IllustrationProps) => (
  <motion.svg
    className={cn("w-48 h-48", className)}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.circle cx="100" cy="100" r="80" className="fill-muted/50" {...pulseAnimation} />
    
    {/* Magnifying glass with shake */}
    <motion.g animate={{ rotate: [-3, 3, -3], x: [-2, 2, -2] }} transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}>
      <circle cx="90" cy="85" r="35" className="fill-background stroke-border" strokeWidth="3" />
      <circle cx="90" cy="85" r="25" className="stroke-muted-foreground/30" strokeWidth="2" />
      <line x1="115" y1="110" x2="145" y2="140" className="stroke-border" strokeWidth="8" strokeLinecap="round" />
      <line x1="115" y1="110" x2="145" y2="140" className="stroke-primary" strokeWidth="5" strokeLinecap="round" />
      
      {/* X mark with fade */}
      <motion.path
        d="M80 75L100 95M100 75L80 95"
        className="stroke-muted-foreground"
        strokeWidth="3"
        strokeLinecap="round"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </motion.g>
    
    {/* Question marks floating */}
    <motion.text x="50" y="60" className="fill-muted-foreground/40 text-lg" animate={{ y: [60, 55, 60] }} transition={{ duration: 2, repeat: Infinity }}>?</motion.text>
    <motion.text x="140" y="80" className="fill-muted-foreground/40 text-lg" animate={{ y: [80, 75, 80] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>?</motion.text>
  </motion.svg>
);

// Ilustração genérica para dados vazios
export const DataEmptyIllustration = ({ className }: IllustrationProps) => (
  <motion.svg
    className={cn("w-48 h-48", className)}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.circle cx="100" cy="100" r="80" className="fill-muted/50" {...pulseAnimation} />
    
    <motion.g {...floatAnimation}>
      {/* Folder */}
      <path
        d="M40 70H80L90 60H160C165.523 60 170 64.4772 170 70V140C170 145.523 165.523 150 160 150H40C34.4772 150 30 145.523 30 140V80C30 74.4772 34.4772 70 40 70Z"
        className="fill-background stroke-border"
        strokeWidth="2"
      />
      <path d="M40 70H80L90 60" className="stroke-border" strokeWidth="2" />
      
      {/* Empty state lines with shimmer */}
      <motion.rect x="55" y="90" width="90" height="8" rx="3" className="fill-muted-foreground/15" {...shimmerAnimation} />
      <motion.rect x="55" y="105" width="70" height="8" rx="3" className="fill-muted-foreground/15" animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
      <motion.rect x="55" y="120" width="80" height="8" rx="3" className="fill-muted-foreground/15" animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} />
    </motion.g>
    
    {/* Plus icon with pulse */}
    <motion.g animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
      <circle cx="160" cy="50" r="18" className="fill-primary/20" />
      <path d="M160 43V57M153 50H167" className="stroke-primary" strokeWidth="2" strokeLinecap="round" />
    </motion.g>
  </motion.svg>
);

// Ilustração para dashboard
export const DashboardEmptyIllustration = ({ className }: IllustrationProps) => (
  <motion.svg
    className={cn("w-48 h-48", className)}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.circle cx="100" cy="100" r="80" className="fill-muted/50" {...pulseAnimation} />
    
    {/* Grid of cards with stagger animation */}
    <motion.rect x="35" y="45" width="55" height="45" rx="6" className="fill-background stroke-border" strokeWidth="2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }} />
    <motion.rect x="110" y="45" width="55" height="45" rx="6" className="fill-background stroke-border" strokeWidth="2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.2 }} />
    <motion.rect x="35" y="105" width="55" height="45" rx="6" className="fill-background stroke-border" strokeWidth="2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.3 }} />
    <motion.rect x="110" y="105" width="55" height="45" rx="6" className="fill-background stroke-border" strokeWidth="2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.4 }} />
    
    {/* Card contents */}
    <rect x="45" y="55" width="25" height="8" rx="2" className="fill-muted-foreground/20" />
    <motion.rect x="45" y="70" width="35" height="12" rx="3" className="fill-primary/30" {...shimmerAnimation} />
    
    <rect x="120" y="55" width="25" height="8" rx="2" className="fill-muted-foreground/20" />
    <motion.rect x="120" y="70" width="35" height="12" rx="3" className="fill-accent/30" animate={{ opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />
    
    <rect x="45" y="115" width="25" height="8" rx="2" className="fill-muted-foreground/20" />
    <motion.rect x="45" y="130" width="35" height="12" rx="3" className="fill-secondary/40" animate={{ opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} />
    
    <rect x="120" y="115" width="25" height="8" rx="2" className="fill-muted-foreground/20" />
    <motion.rect x="120" y="130" width="35" height="12" rx="3" className="fill-primary/20" animate={{ opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }} />
    
    {/* Sparkle with twinkle */}
    <motion.path
      d="M170 35L173 42L180 45L173 48L170 55L167 48L160 45L167 42Z"
      className="fill-primary"
      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.8, 1] }}
      transition={{ duration: 1, repeat: Infinity }}
    />
  </motion.svg>
);

// Ilustração para notificações vazias
export const NotificationsEmptyIllustration = ({ className }: IllustrationProps) => (
  <motion.svg
    className={cn("w-48 h-48", className)}
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
  >
    <motion.circle cx="100" cy="100" r="80" className="fill-muted/50" {...pulseAnimation} />
    
    {/* Bell with gentle swing */}
    <motion.g
      animate={{ rotate: [-5, 5, -5] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
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
      
      {/* Bell top */}
      <circle cx="100" cy="45" r="5" className="fill-primary" />
    </motion.g>
    
    {/* ZZZ with float animation */}
    <motion.text x="145" y="65" className="fill-muted-foreground/40 text-sm font-bold" animate={{ y: [65, 60, 65], opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 2, repeat: Infinity }}>Z</motion.text>
    <motion.text x="155" y="55" className="fill-muted-foreground/30 text-xs font-bold" animate={{ y: [55, 50, 55], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}>z</motion.text>
    <motion.text x="162" y="48" className="fill-muted-foreground/20 text-xs font-bold" animate={{ y: [48, 43, 48], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}>z</motion.text>
  </motion.svg>
);
