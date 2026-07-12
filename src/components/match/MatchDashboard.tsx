/**
 * @fileoverview Dashboard de Matches
 * @description Mostra todos os matches calculados entre empresa e candidatos
 */

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Heart, 
  Star, 
  Sparkles,
  ArrowRight,
  Trophy,
  Zap,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { type MatchResult } from '@/types/match';

interface MatchDashboardProps {
  matches: MatchResult[];
  onSelectMatch: (match: MatchResult) => void;
  viewType: 'empresa' | 'candidato';
}

const recomendacaoConfig = {
  match_perfeito: {
    label: 'Match Perfeito',
    emoji: '💜',
    gradient: 'from-primary to-accent',
    bgClass: 'bg-primary/10',
    textClass: 'text-primary'
  },
  match_forte: {
    label: 'Match Forte',
    emoji: '🔥',
    gradient: 'from-warning to-destructive',
    bgClass: 'bg-warning/10',
    textClass: 'text-warning'
  },
  match_moderado: {
    label: 'Promissor',
    emoji: '✨',
    gradient: 'from-info to-primary',
    bgClass: 'bg-info/10',
    textClass: 'text-info'
  },
  revisar: {
    label: 'Explorar',
    emoji: '🤔',
    gradient: 'from-warning to-accent',
    bgClass: 'bg-warning/10',
    textClass: 'text-warning'
  },
  nao_recomendado: {
    label: 'Baixa',
    emoji: '💭',
    gradient: 'from-muted to-muted-foreground',
    bgClass: 'bg-muted',
    textClass: 'text-muted-foreground'
  }
};

export function MatchDashboard({ 
  matches, 
  onSelectMatch,
  viewType 
}: MatchDashboardProps) {
  // Ordenar por score
  const sortedMatches = [...matches].sort((a, b) => b.scoreTotal - a.scoreTotal);
  
  // Stats
  const matchesPerfeitos = matches.filter(m => m.recomendacao === 'match_perfeito').length;
  const matchesFortes = matches.filter(m => m.recomendacao === 'match_forte').length;
  const mediaScore = matches.length > 0 
    ? Math.round(matches.reduce((acc, m) => acc + m.scoreTotal, 0) / matches.length)
    : 0;

  if (matches.length === 0) {
    return (
      <Card className="p-12 text-center border-dashed">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-muted flex items-center justify-center">
            <Heart className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">Nenhum match ainda</h3>
          <p className="text-muted-foreground">
            {viewType === 'empresa' 
              ? 'Candidatos que responderem o quiz aparecerão aqui com seu score de compatibilidade'
              : 'Empresas que definiram sua cultura aparecerão aqui para você avaliar'}
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/20 rounded-lg">
              <Trophy className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{matchesPerfeitos}</p>
              <p className="text-xs text-muted-foreground">Matches Perfeitos</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Zap className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{matchesFortes}</p>
              <p className="text-xs text-muted-foreground">Matches Fortes</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Star className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{mediaScore}%</p>
              <p className="text-xs text-muted-foreground">Score Médio</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Matches List */}
      <div className="space-y-4">
        {sortedMatches.map((match, index) => {
          const config = recomendacaoConfig[match.recomendacao];
          
          return (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="overflow-hidden hover:shadow-lg transition-all cursor-pointer group border-2 hover:border-primary/30"
                onClick={() => onSelectMatch(match)}
              >
                <div className="flex">
                  {/* Score Indicator */}
                  <div className={cn(
                    "w-24 flex flex-col items-center justify-center p-4 text-white",
                    "bg-gradient-to-b",
                    config.gradient
                  )}>
                    <span className="text-3xl font-bold">{match.scoreTotal}</span>
                    <span className="text-xs opacity-90">%</span>
                  </div>
                  
                  <CardContent className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        {/* Header */}
                        <div className="flex items-center gap-2">
                          <Badge className={cn(config.bgClass, config.textClass, 'border-0')}>
                            {config.emoji} {config.label}
                          </Badge>
                          {match.scoreTotal >= 80 && (
                            <Sparkles className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                        
                        {/* Valores Alinhados */}
                        <div className="flex flex-wrap gap-1">
                          {match.pontosFortes.slice(0, 4).map((ponto, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {ponto}
                            </Badge>
                          ))}
                          {match.pontosFortes.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{match.pontosFortes.length - 4}
                            </Badge>
                          )}
                        </div>
                        
                        {/* Pontos de Atenção */}
                        {match.pontosAtencao.length > 0 && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <AlertCircle className="h-3 w-3 text-orange-500" />
                            <span>Atenção: {match.pontosAtencao.join(', ')}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Action */}
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    {/* Progress Breakdown */}
                    <div className="mt-4 grid grid-cols-3 gap-4 text-center text-xs">
                      <div>
                        <Progress 
                          value={(match.matchesPerfeitos.length / 20) * 100} 
                          className="h-1.5 mb-1"
                        />
                        <span className="text-muted-foreground">
                          {match.matchesPerfeitos.length} perfeitos
                        </span>
                      </div>
                      <div>
                        <Progress 
                          value={(match.matchesAltos.length / 20) * 100} 
                          className="h-1.5 mb-1 [&>div]:bg-emerald-500"
                        />
                        <span className="text-muted-foreground">
                          {match.matchesAltos.length} altos
                        </span>
                      </div>
                      <div>
                        <Progress 
                          value={(match.conflitos.length / 20) * 100} 
                          className="h-1.5 mb-1 [&>div]:bg-orange-500"
                        />
                        <span className="text-muted-foreground">
                          {match.conflitos.length} atenção
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
