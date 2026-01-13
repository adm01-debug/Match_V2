/**
 * @fileoverview Card de visualização para resultado dos 16 Tipos de Personalidade
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Heart, Star, TrendingUp, 
  TrendingDown, Briefcase, Award
} from 'lucide-react';
import { type PersonalityType16Result, PERSONALITY_16_INFO } from '@/types/personality';
import { cn } from '@/lib/utils';

interface Type16ResultCardProps {
  result: PersonalityType16Result;
  candidatoNome?: string;
  showDetails?: boolean;
  variant?: 'compact' | 'full' | 'hero';
}

export const Type16ResultCard = memo(function Type16ResultCard({
  result,
  candidatoNome,
  showDetails = true,
  variant = 'full'
}: Type16ResultCardProps) {
  const info = PERSONALITY_16_INFO[result.type];
  
  const dimensionLabels = {
    energyDirection: { left: 'Introversão', right: 'Extroversão', leftKey: 'I', rightKey: 'E' },
    informationGathering: { left: 'Intuição', right: 'Sensação', leftKey: 'N', rightKey: 'S' },
    decisionMaking: { left: 'Sentimento', right: 'Pensamento', leftKey: 'F', rightKey: 'T' },
    lifestyleApproach: { left: 'Percepção', right: 'Julgamento', leftKey: 'P', rightKey: 'J' },
  };

  if (variant === 'compact') {
    return (
      <Card className="overflow-hidden">
        <div className={cn(
          "h-2 bg-gradient-to-r",
          info.cor
        )} />
        <CardContent className="pt-4">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-16 h-16 rounded-xl bg-gradient-to-br flex flex-col items-center justify-center text-white shadow-lg",
              info.cor
            )}>
              <span className="text-xl">{info.emojis}</span>
              <span className="text-sm font-bold">{result.type}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold">{info.titulo}</h4>
              <p className="text-sm text-muted-foreground">{info.arquetipo}</p>
              <Badge variant="secondary" className="mt-1 text-xs">
                {info.raridade}% da população
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'hero') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl"
      >
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br opacity-90",
          info.cor
        )} />
        <div className="absolute inset-0 bg-[url('/pattern-dots.svg')] opacity-10" />
        
        <div className="relative p-8 text-white">
          <div className="flex items-start justify-between">
            <div>
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-6xl"
              >
                {info.emojis}
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-4xl font-bold"
              >
                {result.type}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-light mt-1"
              >
                {info.titulo}
              </motion.p>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-white/80 mt-2"
              >
                {info.arquetipo}
              </motion.p>
            </div>
            
            <div className="text-right">
              <Badge className="bg-white/20 text-white border-0">
                <Star className="w-3 h-3 mr-1" />
                {info.raridade}% da população
              </Badge>
            </div>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-lg text-white/90 max-w-2xl"
          >
            {info.descricao}
          </motion.p>

          {/* Dimensions Mini */}
          <div className="mt-6 grid grid-cols-4 gap-2">
            {(Object.keys(dimensionLabels) as (keyof typeof dimensionLabels)[]).map((dim) => {
              const label = dimensionLabels[dim];
              const dimData = result.dimensions[dim];
              const leftValue = dimData[label.leftKey as keyof typeof dimData] as number;
              const rightValue = dimData[label.rightKey as keyof typeof dimData] as number;
              const dominant = leftValue > rightValue ? label.leftKey : label.rightKey;
              
              return (
                <div key={dim} className="bg-white/10 rounded-lg p-2 text-center">
                  <span className="text-2xl font-bold">{dominant}</span>
                  <p className="text-xs text-white/70">
                    {leftValue > rightValue ? label.left : label.right}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Header with gradient */}
      <div className={cn(
        "p-6 bg-gradient-to-br text-white",
        info.cor
      )}>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-4xl">{info.emojis}</span>
            <h2 className="mt-2 text-3xl font-bold">{result.type}</h2>
            <p className="text-xl font-light">{info.titulo}</p>
            <p className="text-white/80">{info.arquetipo}</p>
          </div>
          <Badge className="bg-white/20 border-0">
            {info.raridade}% da população
          </Badge>
        </div>
        
        {candidatoNome && (
          <p className="mt-4 text-sm text-white/80">
            Perfil de {candidatoNome}
          </p>
        )}
      </div>
      
      <CardContent className="space-y-6 pt-6">
        {/* Description */}
        <p className="text-muted-foreground">{info.descricao}</p>

        {/* Dimensions */}
        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2">
            <Brain className="w-4 h-4 text-primary" />
            Dimensões de Personalidade
          </h4>
          
          {(Object.keys(dimensionLabels) as (keyof typeof dimensionLabels)[]).map((dim) => {
            const label = dimensionLabels[dim];
            const dimData = result.dimensions[dim];
            const leftValue = dimData[label.leftKey as keyof typeof dimData] as number;
            const rightValue = dimData[label.rightKey as keyof typeof dimData] as number;
            
            return (
              <div key={dim} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className={cn(
                    leftValue > rightValue && "font-medium text-primary"
                  )}>
                    {label.leftKey}: {label.left}
                  </span>
                  <span className={cn(
                    rightValue > leftValue && "font-medium text-primary"
                  )}>
                    {label.right}: {label.rightKey}
                  </span>
                </div>
                <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="absolute left-0 h-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                    style={{ width: `${leftValue}%` }}
                  />
                  <div 
                    className="absolute right-0 h-full bg-gradient-to-l from-secondary to-secondary/60 transition-all"
                    style={{ width: `${rightValue}%` }}
                  />
                  <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-background" />
                </div>
              </div>
            );
          })}
        </div>

        {showDetails && (
          <>
            {/* Strengths & Development */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                <h4 className="font-medium text-green-700 dark:text-green-400 flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4" />
                  Pontos Fortes
                </h4>
                <ul className="space-y-2">
                  {result.pontosFortes.map((ponto, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span>
                      {ponto}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <h4 className="font-medium text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-3">
                  <TrendingDown className="w-4 h-4" />
                  Áreas para Desenvolver
                </h4>
                <ul className="space-y-2">
                  {result.pontosADesenvolver.map((area, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-amber-500 mt-1">→</span>
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Careers */}
            <div className="p-4 rounded-lg bg-muted/50 border">
              <h4 className="font-medium flex items-center gap-2 mb-3">
                <Briefcase className="w-4 h-4 text-primary" />
                Carreiras Ideais
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.carreiraIdeal.map((carreira, i) => (
                  <Badge key={i} variant="secondary">
                    {carreira}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Famous People */}
            <div className="p-4 rounded-lg border bg-background">
              <h4 className="font-medium flex items-center gap-2 mb-3">
                <Award className="w-4 h-4 text-primary" />
                Personalidades Famosas
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.famosos.map((famoso, i) => (
                  <Badge key={i} variant="outline" className="bg-primary/5">
                    <Star className="w-3 h-3 mr-1 text-yellow-500" />
                    {famoso}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Compatibility */}
            <div className="p-4 rounded-lg border bg-muted/30">
              <h4 className="font-medium flex items-center gap-2 mb-3">
                <Heart className="w-4 h-4 text-pink-500" />
                Compatibilidade
              </h4>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Maior compatibilidade</p>
                  <div className="flex gap-1">
                    {info.compatibilidadeIdeal.map(type => (
                      <Badge key={type} variant="default" className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Pode ter desafios</p>
                  <div className="flex gap-1">
                    {info.desafiosComum.map(type => (
                      <Badge key={type} variant="outline" className="text-muted-foreground">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
});

export default Type16ResultCard;
