/**
 * @fileoverview TopCandidatos component
 * @module TopCandidatos
 */

import { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MatchScoreBadge } from '@/components/ui/match-score-badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { Trophy, Star, ChevronRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TopCandidato {
  id: string;
  nome: string;
  vaga: string;
  matchScore: number;
  etapa: string;
  diasNaEtapa: number;
  origem: string;
  destaque?: string;
}

interface ProcessoData {
  candidatoId: string;
  candidatoNome: string;
  vagaTitulo: string;
  matchScore: number;
  etapaAtual: string;
  diasNaEtapa: number;
  origem: string;
}

interface TopCandidatosProps {
  processos: ProcessoData[];
  maxItems?: number;
  onViewAll?: () => void;
  onSelectCandidato?: (id: string) => void;
}

function getInitials(name: string): string {
  if (!name) return '??';
  return name
    .split(' ')
    .map(n => n[0])
    .filter(Boolean)
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function getDestaque(score: number, etapa: string, diasNaEtapa: number): string | undefined {
  if (score >= 95) return 'Match Excepcional';
  if (etapa === 'entrevista_gestor' && diasNaEtapa <= 2) return 'Avançando rápido';
  if (etapa === 'entrevista_final') return 'Fase final';
  return undefined;
}

function TopCandidatosComponent({ 
  processos, 
  maxItems = 5,
  onViewAll,
  onSelectCandidato 
}: TopCandidatosProps) {
  // Ordenar por match score e pegar os top N - IMUTÁVEL
  const topCandidatos = useMemo((): TopCandidato[] => {
    return [...processos]
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, maxItems)
      .map((p) => ({
        id: p.candidatoId,
        nome: p.candidatoNome,
        vaga: p.vagaTitulo,
        matchScore: p.matchScore,
        etapa: p.etapaAtual,
        diasNaEtapa: p.diasNaEtapa,
        origem: p.origem,
        destaque: getDestaque(p.matchScore, p.etapaAtual, p.diasNaEtapa),
      }));
  }, [processos, maxItems]);

  if (topCandidatos.length === 0) {
    return (
      <Card role="region" aria-label="Top candidatos">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Trophy className="h-8 w-8 text-muted-foreground/50 mb-3" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Nenhum candidato em processo ainda.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card role="region" aria-label="Top candidatos por score">
      <CardHeader className="pb-3">
        <div data-testid="top-candidatos" className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10" aria-hidden="true">
              <Trophy className="h-4 w-4 text-amber-500" />
            </div>
            <CardTitle className="text-base font-semibold">Top Candidatos</CardTitle>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              <Sparkles className="h-2.5 w-2.5 mr-0.5" aria-hidden="true" />
              IA
            </Badge>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs h-7"
            onClick={onViewAll}
            aria-label="Ver todos os candidatos"
          >
            Ver todos
            <ChevronRight className="h-3 w-3 ml-1" aria-hidden="true" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3" role="list" aria-label="Lista dos melhores candidatos">
          {topCandidatos.map((candidato, index) => (
            <li
              key={candidato.id}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group"
              onClick={() => onSelectCandidato?.(candidato.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCandidato?.(candidato.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`${candidato.nome}, score ${candidato.matchScore}%, ${candidato.vaga}`}
            >
              {/* Ranking */}
              <div 
                className="flex items-center justify-center w-6 h-6 shrink-0"
                aria-label={`Posição ${index + 1}`}
              >
                {index === 0 ? (
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" aria-hidden="true" />
                ) : (
                  <span className="text-sm font-bold text-muted-foreground">
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarFallback className={cn(
                  "text-xs font-medium",
                  index === 0 ? "bg-amber-500/20 text-amber-700" : "bg-muted"
                )}>
                  {getInitials(candidato.nome)}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-medium text-sm truncate">{candidato.nome}</span>
                  {candidato.destaque && (
                    <Badge 
                      variant="outline" 
                      className="text-[9px] px-1.5 py-0 h-4 shrink-0 border-primary/30 text-primary"
                    >
                      {candidato.destaque}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="truncate">{candidato.vaga}</span>
                  <span aria-hidden="true">•</span>
                  <StatusBadge status={candidato.etapa} size="sm" showIcon={false} />
                </div>
              </div>

              {/* Score */}
              <div className="shrink-0">
                <MatchScoreBadge 
                  score={candidato.matchScore} 
                  variant="pill" 
                  size="sm"
                />
              </div>

              <ChevronRight 
                className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" 
                aria-hidden="true"
              />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

TopCandidatosComponent.displayName = 'TopCandidatos';

export const TopCandidatos = memo(TopCandidatosComponent);
export default TopCandidatos;
