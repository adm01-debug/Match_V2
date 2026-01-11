/**
 * @module ScorecardView
 * @description Visualização unificada do scorecard de um candidato
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  Trophy, 
  Brain, 
  Heart, 
  Briefcase, 
  GraduationCap,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import type { Scorecard } from '@/types/selection';
import { useGenerateScorecardAI } from '@/hooks/useScorecards';
import { toast } from 'sonner';

interface ScorecardViewProps {
  scorecard: Scorecard;
  onRefresh?: () => void;
}

const getScoreColor = (score?: number | null) => {
  if (!score) return 'text-muted-foreground';
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

const getScoreBgColor = (score?: number | null) => {
  if (!score) return 'bg-muted';
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};

const RECOMMENDATION_CONFIG = {
  aprovar: {
    icon: CheckCircle,
    color: 'text-green-600 bg-green-100 border-green-300',
    label: 'Aprovar',
  },
  reprovar: {
    icon: XCircle,
    color: 'text-red-600 bg-red-100 border-red-300',
    label: 'Reprovar',
  },
  avaliar_mais: {
    icon: AlertCircle,
    color: 'text-yellow-600 bg-yellow-100 border-yellow-300',
    label: 'Avaliar Mais',
  },
};

export function ScorecardView({ scorecard, onRefresh }: ScorecardViewProps) {
  const generateAI = useGenerateScorecardAI();
  
  const handleRegenerateAI = async () => {
    if (!scorecard.processoId || !scorecard.candidatoId) {
      toast.error('Dados insuficientes para gerar scorecard');
      return;
    }
    
    try {
      await generateAI.mutateAsync({
        processoId: scorecard.processoId,
        candidatoId: scorecard.candidatoId,
      });
      toast.success('Scorecard regenerado com IA!');
      onRefresh?.();
    } catch (error) {
      toast.error('Erro ao regenerar scorecard');
    }
  };

  const scores = [
    { key: 'tecnico', label: 'Técnico', icon: GraduationCap, value: scorecard.scoreTecnico },
    { key: 'comportamental', label: 'Comportamental', icon: Brain, value: scorecard.scoreComportamental },
    { key: 'cultural', label: 'Cultural', icon: Heart, value: scorecard.scoreCultural },
    { key: 'experiencia', label: 'Experiência', icon: Briefcase, value: scorecard.scoreExperiencia },
  ];

  const recommendation = scorecard.recomendacao ? RECOMMENDATION_CONFIG[scorecard.recomendacao] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground">
                <Trophy className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  Scorecard - {scorecard.candidatoNome}
                </CardTitle>
                <CardDescription>
                  {scorecard.vagaTitulo}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {scorecard.geradoPor === 'ai' && (
                <Badge variant="secondary" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  Gerado por IA
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerateAI}
                disabled={generateAI.isPending}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${generateAI.isPending ? 'animate-spin' : ''}`} />
                Regenerar com IA
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Score Final */}
          <div className="text-center py-4">
            <div className={`text-6xl font-bold ${getScoreColor(scorecard.scoreFinal)}`}>
              {scorecard.scoreFinal ?? '-'}
            </div>
            <p className="text-muted-foreground mt-1">Score Final</p>
            <div className="relative h-3 bg-muted rounded-full overflow-hidden mt-4 max-w-md mx-auto">
              <div
                className={`absolute inset-y-0 left-0 ${getScoreBgColor(scorecard.scoreFinal)} rounded-full transition-all duration-700`}
                style={{ width: `${scorecard.scoreFinal || 0}%` }}
              />
            </div>
          </div>

          {/* Recomendação */}
          {recommendation && (
            <div className={`flex items-center gap-3 p-4 rounded-lg border-2 ${recommendation.color}`}>
              <recommendation.icon className="h-6 w-6" />
              <div>
                <p className="font-semibold">Recomendação: {recommendation.label}</p>
                {scorecard.justificativa && (
                  <p className="text-sm mt-1 opacity-80">{scorecard.justificativa}</p>
                )}
              </div>
            </div>
          )}

          {/* Scores por Dimensão */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {scores.map(score => (
              <Card key={score.key} className="text-center p-4">
                <score.icon className={`h-8 w-8 mx-auto mb-2 ${getScoreColor(score.value)}`} />
                <p className={`text-2xl font-bold ${getScoreColor(score.value)}`}>
                  {score.value ?? '-'}
                </p>
                <p className="text-xs text-muted-foreground">{score.label}</p>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DISC do Candidato */}
      {(scorecard.discDominancia || scorecard.discInfluencia || scorecard.discEstabilidade || scorecard.discConformidade) && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5" />
              Perfil DISC
            </CardTitle>
            {scorecard.fitPerfil && (
              <Badge variant="outline" className={getScoreColor(scorecard.fitPerfil)}>
                Fit com Perfil: {scorecard.fitPerfil}%
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-red-600">{scorecard.discDominancia || 0}%</div>
                <p className="text-xs text-muted-foreground">D - Dominância</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{scorecard.discInfluencia || 0}%</div>
                <p className="text-xs text-muted-foreground">I - Influência</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{scorecard.discEstabilidade || 0}%</div>
                <p className="text-xs text-muted-foreground">S - Estabilidade</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{scorecard.discConformidade || 0}%</div>
                <p className="text-xs text-muted-foreground">C - Conformidade</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Análise */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Pontos Fortes */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-green-600">
              <TrendingUp className="h-5 w-5" />
              Pontos Fortes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(scorecard.pontosFortes || []).map((ponto, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                  {ponto}
                </li>
              ))}
              {(!scorecard.pontosFortes || scorecard.pontosFortes.length === 0) && (
                <p className="text-sm text-muted-foreground italic">Não identificados</p>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Desenvolvimento */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-blue-600">
              <GraduationCap className="h-5 w-5" />
              Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(scorecard.pontosDesenvolvimento || []).map((ponto, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
                  {ponto}
                </li>
              ))}
              {(!scorecard.pontosDesenvolvimento || scorecard.pontosDesenvolvimento.length === 0) && (
                <p className="text-sm text-muted-foreground italic">Não identificados</p>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Riscos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg text-orange-600">
              <AlertTriangle className="h-5 w-5" />
              Riscos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {(scorecard.riscos || []).map((risco, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 shrink-0" />
                  {risco}
                </li>
              ))}
              {(!scorecard.riscos || scorecard.riscos.length === 0) && (
                <p className="text-sm text-muted-foreground italic">Nenhum risco identificado</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Competências Avaliadas */}
      {scorecard.competencias && scorecard.competencias.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Competências Avaliadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {scorecard.competencias.map(comp => (
                <div key={comp.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{comp.tipo}</Badge>
                    <span className="font-medium">{comp.nome}</span>
                    {comp.fonte && (
                      <Badge variant="secondary" className="text-xs">
                        via {comp.fonte}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">Peso: {comp.peso}x</span>
                    <span className={`font-bold text-lg ${getScoreColor(comp.nota)}`}>
                      {comp.nota ?? '-'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Última atualização: {scorecard.atualizadoEm ? new Date(scorecard.atualizadoEm).toLocaleString('pt-BR') : 'N/A'}</p>
        <p>Gerado por: {scorecard.geradoPor}</p>
      </div>
    </div>
  );
}
