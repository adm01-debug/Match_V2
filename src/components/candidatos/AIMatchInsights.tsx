import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';

interface MatchInsight { category: string; score: number; details: string; highlights?: string[]; concerns?: string[]; }
interface AIMatchInsightsProps { candidatoNome: string; vagaTitulo: string; overallScore: number; insights: MatchInsight[]; recommendations: string[]; generatedAt?: string; }

const SCORE_COLORS = { high: 'text-green-500', medium: 'text-yellow-500', low: 'text-red-500' };
const getScoreColor = (score: number) => score >= 80 ? SCORE_COLORS.high : score >= 60 ? SCORE_COLORS.medium : SCORE_COLORS.low;
const getScoreBadge = (score: number) => score >= 80 ? 'Excelente' : score >= 60 ? 'Bom' : 'Regular';

export function AIMatchInsights({ candidatoNome, vagaTitulo, overallScore, insights, recommendations, generatedAt }: AIMatchInsightsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary" />Análise de IA</span>
          {generatedAt && <span className="text-xs text-muted-foreground font-normal">Gerado em {generatedAt}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-6 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Compatibilidade Geral</p>
          <div className={`text-5xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}%</div>
          <Badge className="mt-2" variant={overallScore >= 80 ? 'default' : 'secondary'}>{getScoreBadge(overallScore)}</Badge>
          <p className="text-xs text-muted-foreground mt-3">{candidatoNome} × {vagaTitulo}</p>
        </div>

        <div className="space-y-4">
          <h4 className="font-medium flex items-center gap-2"><TrendingUp className="h-4 w-4" />Análise por Categoria</h4>
          {insights.map((insight, i) => (
            <div key={i} className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">{insight.category}</span>
                <span className={`font-bold ${getScoreColor(insight.score)}`}>{insight.score}%</span>
              </div>
              <Progress value={insight.score} className="h-2" />
              <p className="text-sm text-muted-foreground">{insight.details}</p>
              {insight.highlights && insight.highlights.length > 0 && (
                <div className="flex items-start gap-2 mt-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                  <div className="text-sm">{insight.highlights.join(', ')}</div>
                </div>
              )}
              {insight.concerns && insight.concerns.length > 0 && (
                <div className="flex items-start gap-2 mt-1">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div className="text-sm text-muted-foreground">{insight.concerns.join(', ')}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {recommendations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-500" />Recomendações</h4>
            <ul className="space-y-2">
              {recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-primary">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center">Esta análise foi gerada por IA e deve ser usada como apoio, não como decisão final.</p>
      </CardContent>
    </Card>
  );
}

export default AIMatchInsights;
