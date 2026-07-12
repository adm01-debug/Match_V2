import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Heart, Mic2, Compass, Zap } from 'lucide-react';
import { DNAHelix, DNA_STRANDS } from '@/types/behavioralDNA';

interface DNAHelix3DProps {
  helix: DNAHelix;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const HELIX_ICONS = {
  strategic: Brain,
  emotional: Heart,
  influence: Mic2,
  values: Compass,
  adaptive: Zap
};

export const DNAHelix3D: React.FC<DNAHelix3DProps> = ({ 
  helix, 
  size = 'md',
  animated = true 
}) => {
  const sizeClasses = {
    sm: 'w-48 h-48',
    md: 'w-64 h-64',
    lg: 'w-80 h-80'
  };


  return (
    <div className={`relative ${sizeClasses[size]} mx-auto`}>
      {/* Central DNA Animation */}
      <motion.div
        className="absolute inset-0"
        animate={animated ? { rotate: 360 } : {}}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        {DNA_STRANDS.map((strand, index) => {
          const angle = (index * 72) * (Math.PI / 180);
          const radius = size === 'sm' ? 60 : size === 'md' ? 80 : 100;
          const x = Math.cos(angle) * radius + radius + 20;
          const y = Math.sin(angle) * radius + radius + 20;
          const value = helix[strand.id];
          const Icon = HELIX_ICONS[strand.id];

          return (
            <motion.div
              key={strand.id}
              className="absolute flex flex-col items-center"
              style={{ left: x - 20, top: y - 20 }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: strand.color }}
              >
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span 
                className="mt-1 text-xs font-bold"
                style={{ color: strand.color }}
              >
                {Math.round(value)}
              </span>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Center Score */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="bg-gradient-to-br from-accent to-accent rounded-full flex items-center justify-center shadow-xl"
          style={{ width: size === 'sm' ? 60 : size === 'md' ? 80 : 100, height: size === 'sm' ? 60 : size === 'md' ? 80 : 100 }}
          animate={animated ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-white font-bold text-xl">
            DNA
          </span>
        </motion.div>
      </div>
    </div>
  );
};

interface DNAHelixMiniProps {
  helix: DNAHelix;
}

export const DNAHelixMini: React.FC<DNAHelixMiniProps> = ({ helix }) => {
  return (
    <div className="flex items-center gap-1">
      {DNA_STRANDS.map(strand => {
        const value = helix[strand.id];
        const Icon = HELIX_ICONS[strand.id];
        
        return (
          <div
            key={strand.id}
            className="relative group"
            title={`${strand.name}: ${Math.round(value)}`}
          >
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity"
              style={{ backgroundColor: `${strand.color}30` }}
            >
              <Icon className="w-4 h-4" style={{ color: strand.color }} />
            </div>
            <div 
              className="absolute -bottom-1 left-0 right-0 h-1 rounded-full"
              style={{ 
                backgroundColor: `${strand.color}30`,
                width: '100%'
              }}
            >
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  backgroundColor: strand.color,
                  width: `${value}%`
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

interface DNABarProps {
  helix: DNAHelix;
  showLabels?: boolean;
}

export const DNABar: React.FC<DNABarProps> = ({ helix, showLabels = true }) => {
  return (
    <div className="space-y-3">
      {DNA_STRANDS.map(strand => {
        const value = helix[strand.id];
        const Icon = HELIX_ICONS[strand.id];
        
        return (
          <div key={strand.id} className="space-y-1">
            {showLabels && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: strand.color }} />
                  <span className="text-muted-foreground">{strand.name}</span>
                </div>
                <span className="font-medium" style={{ color: strand.color }}>
                  {Math.round(value)}%
                </span>
              </div>
            )}
            <div 
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: `${strand.color}20` }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: strand.color }}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DNAHelix3D;
