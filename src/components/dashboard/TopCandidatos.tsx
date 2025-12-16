import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, TrendingUp, ChevronRight, Sparkles } from 'lucide-react';
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

interface TopCandidatosProps {
  processos: {
    candidatoId: string;
    candidatoNome: string;
    vagaTitulo: string;
    matchScore: number;
    etapaAtual: string;
    diasNaEtapa: number;
    origem: string;
  }[];
}

const etapaLabels: Record<string, string> = {
  'novos': 'Novo',
  'triagem': 'Triagem',
  'pre_selecao': 'Pré-seleção',
  'entrevista_rh': 'Entrevista RH',
  'teste_tecnico': 'Teste Técnico',
  'entrevista_gestor': 'Entrevista Gestor',
  'entrevista_final': 'Entrevista Final',
  'proposta': 'Proposta',
};

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-emerald-600 dark:text-emerald-400';
  if (score >= 80) return 'text-blue-600 dark:text-blue-400';
  if (score >= 70) return 'text-amber-600 dark:text-amber-400';
  return 'text-muted-foreground';
};

const getScoreProgressColor = (score: number) => {
  if (score >= 90) return 'bg-emerald-500';
  if (score >= 80) return 'bg-blue-500';
  if (score >= 70) return 'bg-amber-500';
  return 'bg-muted-foreground';
};

const getInitials = (name: string) => {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

const getDestaque = (score: number, etapa: string, diasNaEtapa: number): string | undefined => {
  if (score >= 95) return 'Match Excepcional';
  if (etapa === 'entrevista_gestor' && diasNaEtapa <= 2) return 'Avançando rápido';
  if (etapa === 'entrevista_final') return 'Fase final';
  return undefined;
};

export function TopCandidatos({ processos }: TopCandidatosProps) {
  // Ordenar por match score e pegar os top 5
  const topCandidatos: TopCandidato[] = processos
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5)
    .map((p, index) => ({
      id: p.candidatoId,
      nome: p.candidatoNome,
      vaga: p.vagaTitulo,
      matchScore: p.matchScore,
      etapa: p.etapaAtual,
      diasNaEtapa: p.diasNaEtapa,
      origem: p.origem,
      destaque: getDestaque(p.matchScore, p.etapaAtual, p.diasNaEtapa),
    }));

  if (topCandidatos.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <Trophy className="h-8 w-8 text-muted-foreground/50 mb-3" />
          <p className="text-sm text-muted-foreground">
            Nenhum candidato em processo ainda.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10">
              <Trophy className="h-4 w-4 text-amber-500" />
            </div>
            <CardTitle className="text-base font-semibold">Top Candidatos</CardTitle>
            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
              <Sparkles className="h-2.5 w-2.5 mr-0.5" />
              IA
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-xs h-7">
            Ver todos
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {topCandidatos.map((candidato, index) => (
          <div
            key={candidato.id}
            className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group"
          >
            {/* Ranking */}
            <div className="flex items-center justify-center w-6 h-6 shrink-0">
              {index === 0 ? (
                <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
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
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 h-4 shrink-0 border-primary/30 text-primary">
                    {candidato.destaque}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="truncate">{candidato.vaga}</span>
                <span>•</span>
                <span>{etapaLabels[candidato.etapa] || candidato.etapa}</span>
              </div>
            </div>

            {/* Score */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              <div className="flex items-center gap-1">
                <TrendingUp className={cn("h-3 w-3", getScoreColor(candidato.matchScore))} />
                <span className={cn("text-sm font-bold", getScoreColor(candidato.matchScore))}>
                  {candidato.matchScore}%
                </span>
              </div>
              <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                <div 
                  className={cn("h-full rounded-full transition-all", getScoreProgressColor(candidato.matchScore))}
                  style={{ width: `${candidato.matchScore}%` }}
                />
              </div>
            </div>

            <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
