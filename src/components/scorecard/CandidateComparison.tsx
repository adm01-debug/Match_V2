/**
 * @module CandidateComparison
 * @description Comparativo visual entre candidatos para uma vaga
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Medal,
  Users,
  BarChart3,
  ArrowRight,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useScorecards, useCompareCandidates } from '@/hooks/useScorecards';
import type { Scorecard } from '@/types/selection';
import { toast } from 'sonner';

interface CandidateComparisonProps {
  vagaId: string;
  vagaTitulo: string;
}

const getRankingIcon = (posicao: number) => {
  switch (posicao) {
    case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2: return <Medal className="h-5 w-5 text-gray-400" />;
    case 3: return <Medal className="h-5 w-5 text-amber-600" />;
    default: return <span className="text-muted-foreground font-medium">#{posicao}</span>;
  }
};

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBg = (score: number) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

export function CandidateComparison({ vagaId, vagaTitulo }: CandidateComparisonProps) {
  const { data: scorecards = [], isLoading } = useScorecards(vagaId);
  const compareMutation = useCompareCandidates();
  
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [comparisonResult, setComparisonResult] = useState<{
    ranking: Array<{
      posicao: number;
      candidatoId: string;
      candidatoNome: string;
      scoreFinal: number;
      scores: Record<string, number>;
    }>;
  } | null>(null);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  const toggleSelection = (candidatoId: string) => {
    setSelectedIds(prev => 
      prev.includes(candidatoId)
        ? prev.filter(id => id !== candidatoId)
        : [...prev, candidatoId]
    );
  };

  const handleCompare = async () => {
    if (selectedIds.length < 2) {
      toast.error('Selecione pelo menos 2 candidatos para comparar');
      return;
    }

    try {
      const result = await compareMutation.mutateAsync({
        vagaId,
        candidatosIds: selectedIds,
      });
      setComparisonResult(result);
      toast.success('Comparação gerada com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar comparação');
    }
  };

  const toggleDetails = (id: string) => {
    setShowDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (scorecards.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold text-lg mb-2">Nenhum candidato com scorecard</h3>
          <p className="text-muted-foreground">
            Gere scorecards para os candidatos antes de compará-los.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Comparativo de Candidatos</CardTitle>
                <CardDescription>{vagaTitulo}</CardDescription>
              </div>
            </div>
            <Button
              onClick={handleCompare}
              disabled={selectedIds.length < 2 || compareMutation.isPending}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              {compareMutation.isPending ? 'Comparando...' : `Comparar (${selectedIds.length})`}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Resultado da Comparação */}
      {comparisonResult && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Ranking Gerado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {comparisonResult.ranking.map((item) => (
                <div 
                  key={item.candidatoId}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    item.posicao === 1 ? 'bg-yellow-50 border border-yellow-200 dark:bg-yellow-950/20' :
                    item.posicao === 2 ? 'bg-gray-50 dark:bg-gray-900/50' :
                    'bg-background'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 flex justify-center">
                      {getRankingIcon(item.posicao)}
                    </div>
                    <Avatar>
                      <AvatarFallback>{item.candidatoNome.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{item.candidatoNome}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          T: {item.scores.tecnico || 0}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          C: {item.scores.comportamental || 0}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          Cult: {item.scores.cultural || 0}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${getScoreColor(item.scoreFinal)}`}>
                      {item.scoreFinal}
                    </div>
                    <p className="text-xs text-muted-foreground">Score Final</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Candidatos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Selecione os Candidatos</CardTitle>
          <CardDescription>
            {selectedIds.length} de {scorecards.length} selecionados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {scorecards.map((scorecard: Scorecard) => (
            <div key={scorecard.id} className="border rounded-lg overflow-hidden">
              <div 
                className={`flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50 transition-colors ${
                  selectedIds.includes(scorecard.candidatoId!) ? 'bg-primary/5' : ''
                }`}
                onClick={() => scorecard.candidatoId && toggleSelection(scorecard.candidatoId)}
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={selectedIds.includes(scorecard.candidatoId!)}
                    onCheckedChange={() => scorecard.candidatoId && toggleSelection(scorecard.candidatoId)}
                  />
                  <Avatar>
                    <AvatarFallback>
                      {scorecard.candidatoNome?.slice(0, 2).toUpperCase() || '??'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{scorecard.candidatoNome}</p>
                    <div className="flex gap-1 mt-1">
                      {scorecard.recomendacao === 'aprovar' && (
                        <Badge className="bg-green-500 text-white text-xs">Aprovar</Badge>
                      )}
                      {scorecard.recomendacao === 'reprovar' && (
                        <Badge className="bg-red-500 text-white text-xs">Reprovar</Badge>
                      )}
                      {scorecard.recomendacao === 'avaliar_mais' && (
                        <Badge className="bg-yellow-500 text-white text-xs">Avaliar+</Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getScoreColor(scorecard.scoreFinal || 0)}`}>
                      {scorecard.scoreFinal ?? '-'}
                    </div>
                    <p className="text-xs text-muted-foreground">Score Final</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleDetails(scorecard.id);
                    }}
                  >
                    {showDetails[scorecard.id] ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Detalhes expandidos */}
              {showDetails[scorecard.id] && (
                <div className="px-4 pb-4 pt-2 border-t bg-muted/30">
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Técnico</p>
                      <p className={`font-bold ${getScoreColor(scorecard.scoreTecnico || 0)}`}>
                        {scorecard.scoreTecnico ?? '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Comportamental</p>
                      <p className={`font-bold ${getScoreColor(scorecard.scoreComportamental || 0)}`}>
                        {scorecard.scoreComportamental ?? '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Cultural</p>
                      <p className={`font-bold ${getScoreColor(scorecard.scoreCultural || 0)}`}>
                        {scorecard.scoreCultural ?? '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Experiência</p>
                      <p className={`font-bold ${getScoreColor(scorecard.scoreExperiencia || 0)}`}>
                        {scorecard.scoreExperiencia ?? '-'}
                      </p>
                    </div>
                  </div>
                  
                  {scorecard.pontosFortes && scorecard.pontosFortes.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Pontos Fortes:</p>
                      <div className="flex flex-wrap gap-1">
                        {scorecard.pontosFortes.map((p, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{p}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {scorecard.riscos && scorecard.riscos.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Riscos:</p>
                      <div className="flex flex-wrap gap-1">
                        {scorecard.riscos.map((r, i) => (
                          <Badge key={i} variant="destructive" className="text-xs">{r}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
