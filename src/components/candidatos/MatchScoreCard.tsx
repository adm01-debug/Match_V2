/**
 * @fileoverview MatchScoreCard component
 * @module MatchScoreCard
 */

import { memo, useMemo } from 'react';
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
  Award,
  LucideIcon
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

interface RecomendacaoConfig {
  label: string;
  color: string;
  icon: LucideIcon;
  textColor: string;
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  if (score >= 40) return 'text-warning';
  return 'text-destructive';
}

function getScoreBorderColor(score: number): string {
  if (score >= 80) return 'border-success';
  if (score >= 60) return 'border-warning';
  if (score >= 40) return 'border-warning';
  return 'border-destructive';
}

function getRecomendacaoConfig(recomendacao: string): RecomendacaoConfig {
  switch (recomendacao) {
    case 'forte':
      return {
        label: 'Altamente Recomendado',
        color: 'bg-success',
        icon: CheckCircle2,
        textColor: 'text-success',
      };
    case 'moderado':
      return {
        label: 'Recomendado com Ressalvas',
        color: 'bg-warning',
        icon: AlertTriangle,
        textColor: 'text-warning',
      };
    case 'fraco':
      return {
        label: 'Considerar Alternativas',
        color: 'bg-warning',
        icon: TrendingDown,
        textColor: 'text-warning',
      };
    default:
      return {
        label: 'Não Recomendado',
        color: 'bg-destructive',
        icon: XCircle,
        textColor: 'text-destructive',
      };
  }
}

function generateSkillKey(skill: string, index: number, prefix: string): string {
  return `${prefix}-${skill.toLowerCase().replace(/\s+/g, '-')}-${index}`;
}

interface ScoreBarProps {
  icon: LucideIcon;
  label: string;
  score: number;
}

function ScoreBar({ icon: Icon, label, score }: ScoreBarProps) {
  const color = getScoreColor(score);
  
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      <div className="flex-1">
        <div className="flex justify-between text-sm mb-1">
          <span>{label}</span>
          <span className={color}>{score}%</span>
        </div>
        <Progress 
          value={score} 
          className="h-2" 
          aria-label={`${label}: ${score}%`}
        />
      </div>
    </div>
  );
}

function MatchScoreCardComponent({ matchResult, candidatoNome, vagaTitulo }: MatchScoreCardProps) {
  const recomendacaoConfig = useMemo(
    () => getRecomendacaoConfig(matchResult.recomendacao),
    [matchResult.recomendacao]
  );
  
  const scoreColor = useMemo(
    () => getScoreColor(matchResult.scoreTotal),
    [matchResult.scoreTotal]
  );
  
  const scoreBorderColor = useMemo(
    () => getScoreBorderColor(matchResult.scoreTotal),
    [matchResult.scoreTotal]
  );

  const RecomendacaoIcon = recomendacaoConfig.icon;

  return (
    <Card 
      role="article" 
      aria-label={`Score de match: ${matchResult.scoreTotal}% - ${candidatoNome} para ${vagaTitulo}`}
      className="overflow-hidden"
    >
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
          <div data-testid="match-score-card" className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" aria-hidden="true" />
            <span>Match Score</span>
          </div>
          <Badge className={cn(recomendacaoConfig.color, "text-white")}>
            <RecomendacaoIcon className="h-3 w-3 mr-1" aria-hidden="true" />
            {recomendacaoConfig.label}
          </Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          <span className="sr-only">Candidato:</span> {candidatoNome} 
          <span aria-hidden="true"> → </span>
          <span className="sr-only">para vaga:</span> {vagaTitulo}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Score Principal */}
        <div className="flex items-center justify-center py-4">
          <div 
            className={cn(
              "w-32 h-32 rounded-full border-8 flex items-center justify-center",
              scoreBorderColor
            )}
            role="img"
            aria-label={`Score total: ${matchResult.scoreTotal}%`}
          >
            <div className="text-center">
              <span className={cn("text-4xl font-bold", scoreColor)}>
                {matchResult.scoreTotal}
              </span>
              <span className="text-lg text-muted-foreground" aria-hidden="true">%</span>
            </div>
          </div>
        </div>

        {/* Breakdown dos Scores */}
        <div className="space-y-3" role="group" aria-label="Detalhamento do score">
          <ScoreBar 
            icon={Sparkles} 
            label="Habilidades" 
            score={matchResult.scoreHabilidades} 
          />
          <ScoreBar 
            icon={Briefcase} 
            label="Experiência" 
            score={matchResult.scoreExperiencia} 
          />
          <ScoreBar 
            icon={GraduationCap} 
            label="Formação" 
            score={matchResult.scoreFormacao} 
          />
        </div>

        {/* Análise */}
        {matchResult.analise && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm">{matchResult.analise}</p>
          </div>
        )}

        {/* Habilidades */}
        <div className="space-y-3">
          {matchResult.habilidadesMatch.length > 0 && (
            <div role="group" aria-label="Habilidades compatíveis">
              <p className="text-sm font-medium text-green-600 mb-2 flex items-center gap-1">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Habilidades Compatíveis ({matchResult.habilidadesMatch.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {matchResult.habilidadesMatch.map((skill, i) => (
                  <Badge 
                    key={generateSkillKey(skill, i, 'match')} 
                    variant="outline" 
                    className="border-green-500 text-green-700 text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {matchResult.habilidadesFaltantes.length > 0 && (
            <div role="group" aria-label="Habilidades faltantes">
              <p className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
                <XCircle className="h-4 w-4" aria-hidden="true" />
                Habilidades Faltantes ({matchResult.habilidadesFaltantes.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {matchResult.habilidadesFaltantes.map((skill, i) => (
                  <Badge 
                    key={generateSkillKey(skill, i, 'missing')} 
                    variant="outline" 
                    className="border-red-500 text-red-700 text-xs"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {matchResult.habilidadesExtras.length > 0 && (
            <div role="group" aria-label="Habilidades extras">
              <p className="text-sm font-medium text-blue-600 mb-2 flex items-center gap-1">
                <Award className="h-4 w-4" aria-hidden="true" />
                Habilidades Extras ({matchResult.habilidadesExtras.length})
              </p>
              <div className="flex flex-wrap gap-1">
                {matchResult.habilidadesExtras.map((skill, i) => (
                  <Badge 
                    key={generateSkillKey(skill, i, 'extra')} 
                    variant="outline" 
                    className="border-blue-500 text-blue-700 text-xs"
                  >
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
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                Pontos Fortes
              </p>
              <ul className="space-y-1" aria-label="Lista de pontos fortes">
                {matchResult.pontosFortes.map((ponto, i) => (
                  <li 
                    key={`forte-${i}-${ponto.slice(0, 10)}`} 
                    className="text-xs text-green-600 dark:text-green-300"
                  >
                    • {ponto}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {matchResult.pontosAtencao.length > 0 && (
            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                Pontos de Atenção
              </p>
              <ul className="space-y-1" aria-label="Lista de pontos de atenção">
                {matchResult.pontosAtencao.map((ponto, i) => (
                  <li 
                    key={`atencao-${i}-${ponto.slice(0, 10)}`} 
                    className="text-xs text-orange-600 dark:text-orange-300"
                  >
                    • {ponto}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

MatchScoreCardComponent.displayName = 'MatchScoreCard';

export const MatchScoreCard = memo(MatchScoreCardComponent);
export default MatchScoreCard;
