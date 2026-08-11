import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Briefcase, Sparkles, Calendar as CalendarIcon, ChevronRight } from 'lucide-react';
import { HighlightMatch, getMatchIndices } from '@/components/ui/highlight-match';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { motion, Variants } from 'framer-motion';
import type { FuseMatch } from '@/hooks/useFuzzySearch';

const cardHoverVariants: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -4, transition: { duration: 0.2 } }
};

interface MatchScore {
  score_total: number;
}

interface Candidato {
  id: string;
  nome: string;
  email: string;
  status: string | null;
  experiencias: unknown[] | null;
  habilidades: string[] | null;
  created_at: string | null;
}

interface CandidatoCardProps {
  candidato: Candidato;
  bestScore: MatchScore | null;
  statusConfig: { label: string; color: string };
  matches?: readonly FuseMatch[];
  getScoreColor: (score: number) => string;
}

export const CandidatoCard = memo(function CandidatoCard({ 
  candidato, bestScore, statusConfig, matches, getScoreColor 
}: CandidatoCardProps) {
  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      className="cursor-pointer"
    >
      <Card variant="glass" className="h-full overflow-hidden border-border/50 hover:border-primary/30 transition-colors">
        <CardContent className="p-5 relative">
          {bestScore && bestScore.score_total >= 80 && (
            <div className="absolute top-0 right-0 w-24 h-24 bg-success/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          )}
          
          <div className="relative">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg truncate">
                  <HighlightMatch
                    text={candidato.nome}
                    indices={getMatchIndices(matches, 'nome')}
                  />
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  <HighlightMatch
                    text={candidato.email}
                    indices={getMatchIndices(matches, 'email')}
                    highlightClassName="bg-primary/15 text-primary font-medium rounded-sm"
                  />
                </p>
              </div>
              <Badge className={cn("shrink-0 ml-2", statusConfig.color)} size="sm">
                {statusConfig.label}
              </Badge>
            </div>

            {bestScore && (
              <div className={cn(
                "p-3 rounded-xl mb-4 flex items-center justify-between border",
                getScoreColor(bestScore.score_total)
              )}>
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span className="text-sm font-medium">Match Score</span>
                </div>
                <span className="text-lg font-bold">{bestScore.score_total}%</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                <span>{(candidato.experiencias as unknown[])?.length || 0} experiências</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>{candidato.habilidades?.length || 0} habilidades</span>
              </div>
            </div>

            {candidato.habilidades && candidato.habilidades.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {candidato.habilidades.slice(0, 3).map((skill, i) => (
                  <Badge key={i} variant="secondary" size="sm" className="bg-secondary/50">
                    {skill}
                  </Badge>
                ))}
                {candidato.habilidades.length > 3 && (
                  <Badge variant="outline" size="sm">
                    +{candidato.habilidades.length - 3}
                  </Badge>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                {candidato.created_at ? format(new Date(candidato.created_at), "dd/MM/yyyy", { locale: ptBR }) : '-'}
              </span>
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                Ver detalhes
                <ChevronRight className="h-3 w-3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
