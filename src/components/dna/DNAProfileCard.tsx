import React from 'react';
import { motion } from 'framer-motion';
import { User, Building2, Star, AlertTriangle, Target, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DNAProfile, DNA_ARCHETYPES } from '@/types/behavioralDNA';
import { DNABar, DNAHelixMini } from './DNAHelix3D';

interface DNAProfileCardProps {
  profile: DNAProfile;
  variant?: 'full' | 'compact' | 'minimal';
  onClick?: () => void;
}

export const DNAProfileCard: React.FC<DNAProfileCardProps> = ({ 
  profile, 
  variant = 'compact',
  onClick 
}) => {
  const archetype = DNA_ARCHETYPES.find(a => a.id === profile.archetype);
  const Icon = profile.type === 'candidate' ? User : Building2;

  if (variant === 'minimal') {
    return (
      <Card 
        className="p-4 hover:shadow-lg transition-all cursor-pointer"
        onClick={onClick}
      >
        <div className="flex items-center gap-4">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${archetype?.color}20` }}
          >
            {archetype?.emoji}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{profile.name}</h3>
            <p className="text-sm text-muted-foreground">{archetype?.name}</p>
          </div>
          <DNAHelixMini helix={profile.helix} />
        </div>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card 
        className={`overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-xl' : ''} transition-all`}
        onClick={onClick}
      >
        {/* Header with Gradient */}
        <div 
          className="p-4"
          style={{ 
            background: `linear-gradient(135deg, ${archetype?.color}30, ${archetype?.color}10)` 
          }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shadow-lg"
              style={{ backgroundColor: `${archetype?.color}40` }}
            >
              {archetype?.emoji}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {profile.type === 'candidate' ? 'Candidato' : 'Empresa'}
                </span>
              </div>
              <h3 className="text-lg font-bold">{profile.name}</h3>
              <p className="text-sm" style={{ color: archetype?.color }}>
                {archetype?.name}
              </p>
            </div>
            {onClick && (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* DNA Code */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Código DNA</span>
            <code className="text-sm font-mono font-bold" style={{ color: archetype?.color }}>
              {profile.dnaCode}
            </code>
          </div>
        </div>

        {/* DNA Bars */}
        <div className="p-4">
          <DNABar helix={profile.helix} showLabels={false} />
        </div>

        {/* Strengths Preview */}
        <div className="px-4 pb-4">
          <div className="flex flex-wrap gap-1">
            {profile.strengths.slice(0, 3).map((strength, i) => (
              <Badge 
                key={i} 
                variant="secondary"
                className="text-xs"
              >
                {strength}
              </Badge>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  // Full variant
  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div 
        className="p-6"
        style={{ 
          background: `linear-gradient(135deg, ${archetype?.color}30, ${archetype?.color}10)` 
        }}
      >
        <div className="flex items-start gap-4">
          <motion.div 
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl shadow-xl"
            style={{ backgroundColor: `${archetype?.color}40` }}
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            {archetype?.emoji}
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {profile.type === 'candidate' ? 'Candidato' : 'Empresa'}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-1">{profile.name}</h2>
            <p className="text-lg font-medium" style={{ color: archetype?.color }}>
              {archetype?.name}
            </p>
            <p className="text-sm text-muted-foreground mt-2">{archetype?.description}</p>
          </div>
        </div>

        {/* DNA Code */}
        <div className="mt-6 inline-flex items-center gap-2 bg-black/10 dark:bg-white/10 px-4 py-2 rounded-full">
          <span className="text-sm text-muted-foreground">Código DNA:</span>
          <code className="text-lg font-mono font-bold" style={{ color: archetype?.color }}>
            {profile.dnaCode}
          </code>
        </div>
      </div>

      {/* DNA Bars */}
      <div className="p-6 border-b">
        <h3 className="text-sm font-semibold text-muted-foreground mb-4">Perfil Comportamental</h3>
        <DNABar helix={profile.helix} />
      </div>

      {/* Strengths & Challenges */}
      <div className="grid md:grid-cols-2 gap-6 p-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-success" />
            <h3 className="font-semibold">Pontos Fortes</h3>
          </div>
          <ul className="space-y-2">
            {profile.strengths.map((strength, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-success mt-2" />
                <span className="text-sm">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-warning" />
            <h3 className="font-semibold">Desafios</h3>
          </div>
          <ul className="space-y-2">
            {profile.challenges.map((challenge, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2" />
                <span className="text-sm">{challenge}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Ideal Environment */}
      <div className="p-6 bg-muted/30">
        <div className="flex items-center gap-2 mb-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Ambiente Ideal</h3>
        </div>
        <p className="text-sm text-muted-foreground">{profile.idealEnvironment}</p>
      </div>
    </Card>
  );
};

export default DNAProfileCard;
