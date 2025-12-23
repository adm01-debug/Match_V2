import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Sparkles,
  Briefcase,
  GraduationCap,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface MatchResult {
  scoreTotal: number;
  scoreHabilidades: number;
  scoreExperiencia: number;
  scoreFormacao: number;
  habilidadesMatch: string[];
  habilidadesFaltantes: string[];
  habilidadesExtras: string[];
  analise: string;
  recomendacao: 'forte' | 'moderado' | 'fraco' | 'nao_recomendado';
  pontosFortes: string[];
  pontosAtencao: string[];
}

interface MatchScoreCardProps {
  matchResult: MatchResult;
  candidatoNome: string;
  vagaTitulo: string;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-green-500';
  if (score >= 60) return 'text-yellow-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
};

const getScoreBgColor = (score: number) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-yellow-500';
  if (score >= 40) return 'bg-orange-500';
  return 'bg-red-500';
};

const getRecomendacaoConfig = (recomendacao: string) => {
  switch (recomendacao) {
    case 'forte':
      return { 
        label: 'Altamente Recomendado', 
        color: 'bg-green-500', 
        icon: CheckCircle2,
        textColor: 'text-green-700'
      };
    case 'moderado':
      return { 
        label: 'Recomendado com Ressalvas', 
        color: 'bg-yellow-500', 
        icon: AlertTriangle,
        textColor: 'text-yellow-700'
      };
    case 'fraco':
      return { 
        label: 'Considerar Alternativas', 
        color: 'bg-orange-500', 
        icon: TrendingDown,
        textColor: 'text-orange-700'
      };
    default:
      return { 
        label: 'Não Recomendado', 
        color: 'bg-red-500', 
        icon: XCircle,
        textColor: 'text-red-700'
      };
  }
};

export function MatchScoreCard({ matchResult, candidatoNome, vagaTitulo }: MatchScoreCardProps) {
  const recomendacaoConfig = getRecomendacaoConfig(matchResult.recomendacao);
  const RecomendacaoIcon = recomendacaoConfig.icon;

  return (
    <Card role="article" aria-label="Score de match" className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Match Score
          </div>
          <Badge className={cn(recomendacaoConfig.color, "text-white")}>
            <RecomendacaoIcon className="h-3 w-3 mr-1" />
            {recomendacaoConfig.label}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {candidatoNome} → {vagaTitulo}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Score Principal */}
        <div className="flex items-center justify-center py-4">
          <div className="relative">
            <div className={cn(
              "w-32 h-32 rounded-full border-8 flex items-center justify-center",
              matchResult.scoreTotal >= 80 ? "border-green-500" :
              matchResult.scoreTotal >= 60 ? "border-yellow-500" :
              matchResult.scoreTotal >= 40 ? "border-orange-500" : "border-red-500"
            )}>
              <div className="text-center">
                <span className={cn("text-4xl font-bold", getScoreColor(matchResult.scoreTotal))}>
                  {matchResult.scoreTotal}
                </span>
                <span className="text-lg text-muted-foreground">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown dos Scores */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Habilidades</span>
                <span className={getScoreColor(matchResult.scoreHabilidades)}>
                  {matchResult.scoreHabilidades}%
                </span>
              </div>
              <Progress value={matchResult.scoreHabilidades} className="h-2" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Briefcase className="h-4 w-4 text-primary" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Experiência</span>
                <span className={getScoreColor(matchResult.scoreExperiencia)}>
                  {matchResult.scoreExperiencia}%
                </span>
              </div>
              <Progress value={matchResult.scoreExperiencia} className="h-2" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <GraduationCap className="h-4 w-4 text-primary" />
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span>Formação</span>
                <span className={getScoreColor(matchResult.scoreFormacao)}>
                  {matchResult.scoreFormacao}%
                </span>
              </div>
              <Progress value={matchResult.scoreFormacao} className="h-2" />
            </div>
          </div>
        </div>

        {/* Análise */}
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm">{matchResult.analise}</p>
        </div>

        {/* Habilidades */}
        <div className="space-y-3">
          {matchResult.habilidadesMatch.length > 0 && (
            <div>
              <p className="text-sm font-medium text-green-600 mb-2 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" />
                Habilidades Compatíveis ({matchResult.habilidadesMatch.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {matchResult.habilidadesMatch.map((skill, i) => (
                  <Badge key={i} variant="outline" className="border-green-500 text-green-700 text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {matchResult.habilidadesFaltantes.length > 0 && (
            <div>
              <p className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
                <XCircle className="h-4 w-4" />
                Habilidades Faltantes ({matchResult.habilidadesFaltantes.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {matchResult.habilidadesFaltantes.map((skill, i) => (
                  <Badge key={i} variant="outline" className="border-red-500 text-red-700 text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {matchResult.habilidadesExtras.length > 0 && (
            <div>
              <p className="text-sm font-medium text-blue-600 mb-2 flex items-center gap-1">
                <Award className="h-4 w-4" />
                Habilidades Extras ({matchResult.habilidadesExtras.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {matchResult.habilidadesExtras.map((skill, i) => (
                  <Badge key={i} variant="outline" className="border-blue-500 text-blue-700 text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pontos Fortes e Atenção */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matchResult.pontosFortes.length > 0 && (
            <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <p className="text-sm font-medium text-green-700 dark:text-green-400 mb-2 flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Pontos Fortes
              </p>
              <ul className="space-y-1">
                {matchResult.pontosFortes.map((ponto, i) => (
                  <li key={i} className="text-xs text-green-600 dark:text-green-300">• {ponto}</li>
                ))}
              </ul>
            </div>
          )}

          {matchResult.pontosAtencao.length > 0 && (
            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                Pontos de Atenção
              </p>
              <ul className="space-y-1">
                {matchResult.pontosAtencao.map((ponto, i) => (
                  <li key={i} className="text-xs text-orange-600 dark:text-orange-300">• {ponto}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

MatchScoreCard.displayName = "MatchScoreCard";

export default memo(MatchScoreCard);
