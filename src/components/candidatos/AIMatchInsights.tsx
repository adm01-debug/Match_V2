import { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, Lightbulb, AlertCircle } from 'lucide-react';

interface MatchInsight { 
  id?: string;
  category: string; 
  score: number; 
  details: string; 
  highlights?: string[]; 
  concerns?: string[]; 
}

interface AIMatchInsightsProps { 
  candidatoNome: string; 
  vagaTitulo: string; 
  overallScore: number; 
  insights: MatchInsight[]; 
  recommendations: string[]; 
  generatedAt?: string;
  isLoading?: boolean;
}

type ScoreLevel = 'high' | 'medium' | 'low';

const SCORE_CONFIG: Record<ScoreLevel, { color: string; badge: string; variant: 'default' | 'secondary' | 'destructive' }> = { 
  high: { color: 'text-success', badge: 'Excelente', variant: 'default' }, 
  medium: { color: 'text-warning', badge: 'Bom', variant: 'secondary' }, 
  low: { color: 'text-destructive', badge: 'Regular', variant: 'destructive' },
};

function getScoreLevel(score: number): ScoreLevel {
  if (score >= 80) return 'high';
  if (score >= 60) return 'medium';
  return 'low';
}

function getInsightKey(insight: MatchInsight, index: number): string {
  return insight.id ?? `insight-${insight.category.toLowerCase().replace(/\s+/g, '-')}-${index}`;
}

function AIMatchInsightsComponent({ 
  candidatoNome, 
  vagaTitulo, 
  overallScore, 
  insights, 
  recommendations, 
  generatedAt,
  isLoading,
}: AIMatchInsightsProps) {
  const scoreLevel = useMemo(() => getScoreLevel(overallScore), [overallScore]);
  const scoreConfig = SCORE_CONFIG[scoreLevel];
  const clampedScore = Math.min(100, Math.max(0, overallScore));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" aria-hidden="true" />
            Análise de IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-32 bg-muted rounded-lg" />
            <div className="h-24 bg-muted rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasInsights = insights && insights.length > 0;
  const hasRecommendations = recommendations && recommendations.length > 0;

  return (
    <Card role="region" aria-label="Análise de compatibilidade por IA">
      <CardHeader>
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          <span className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
            Análise de IA
          </span>
          {generatedAt && (
            <span className="text-xs text-muted-foreground font-normal">
              Gerado em {generatedAt}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div 
          className="text-center p-6 bg-muted rounded-lg"
          role="region"
          aria-label={`Compatibilidade geral: ${clampedScore}%`}
        >
          <p className="text-sm text-muted-foreground mb-2">Compatibilidade Geral</p>
          <div 
            className={`text-5xl font-bold ${scoreConfig.color}`}
            aria-label={`${clampedScore} por cento`}
          >
            {clampedScore}%
          </div>
          <Badge 
            className="mt-2" 
            variant={scoreConfig.variant}
            aria-label={`Classificação: ${scoreConfig.badge}`}
          >
            {scoreConfig.badge}
          </Badge>
          <p className="text-xs text-muted-foreground mt-3">
            {candidatoNome} × {vagaTitulo}
          </p>
        </div>

        {/* Category Analysis */}
        {hasInsights ? (
          <div className="space-y-4" role="region" aria-label="Análise por categoria">
            <h4 className="font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" aria-hidden="true" />
              Análise por Categoria
            </h4>
            <div role="list">
              {insights.map((insight, index) => {
                const insightLevel = getScoreLevel(insight.score);
                const insightConfig = SCORE_CONFIG[insightLevel];
                const key = getInsightKey(insight, index);
                
                return (
                  <div 
                    key={key} 
                    className="p-4 bg-muted/50 rounded-lg space-y-2 mb-3"
                    role="listitem"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{insight.category}</span>
                      <span 
                        className={`font-bold ${insightConfig.color}`}
                        aria-label={`${insight.score} por cento`}
                      >
                        {insight.score}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(100, Math.max(0, insight.score))} 
                      className="h-2"
                      aria-label={`Progresso: ${insight.score}%`}
                    />
                    <p className="text-sm text-muted-foreground">{insight.details}</p>
                    
                    {insight.highlights && insight.highlights.length > 0 && (
                      <div className="flex items-start gap-2 mt-2">
                        <CheckCircle 
                          className="h-4 w-4 text-success mt-0.5 flex-shrink-0" 
                          aria-hidden="true"
                        />
                        <div className="text-sm" role="list" aria-label="Pontos fortes">
                          {insight.highlights.join(', ')}
                        </div>
                      </div>
                    )}
                    
                    {insight.concerns && insight.concerns.length > 0 && (
                      <div className="flex items-start gap-2 mt-1">
                        <AlertTriangle 
                          className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" 
                          aria-hidden="true"
                        />
                        <div className="text-sm text-muted-foreground" role="list" aria-label="Pontos de atenção">
                          {insight.concerns.join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
            <AlertCircle className="h-8 w-8 mb-2" aria-hidden="true" />
            <p>Nenhuma análise detalhada disponível</p>
          </div>
        )}

        {/* Recommendations */}
        {hasRecommendations && (
          <div className="space-y-3" role="region" aria-label="Recomendações">
            <h4 className="font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-warning" aria-hidden="true" />
              Recomendações
            </h4>
            <ul className="space-y-2" role="list">
              {recommendations.map((rec, index) => (
                <li key={`rec-${index}`} className="flex items-start gap-2 text-sm">
                  <span className="text-primary" aria-hidden="true">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center" role="note">
          Esta análise foi gerada por IA e deve ser usada como apoio, não como decisão final.
        </p>
      </CardContent>
    </Card>
  );
}

AIMatchInsightsComponent.displayName = 'AIMatchInsights';

export const AIMatchInsights = memo(AIMatchInsightsComponent);
export default AIMatchInsights;
