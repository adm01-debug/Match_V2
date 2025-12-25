/**
 * @fileoverview Match Score Calculator component
 * @module MatchScoreCalculator
 */

import { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, Award } from 'lucide-react';

/**
 * Props for MatchScoreCalculator component
 */
interface MatchScoreCalculatorProps {
  /** Candidate ID */
  candidatoId?: string;
  /** Job position ID */
  vagaId?: string;
  /** Pre-calculated score (0-100) */
  score?: number;
  /** Show detailed breakdown */
  showDetails?: boolean;
}

/**
 * Calculates and displays match score between candidate and job position
 */
const MatchScoreCalculator = memo(function MatchScoreCalculator({
  candidatoId,
  vagaId,
  score = 0,
  showDetails = false,
}: MatchScoreCalculatorProps) {
  const scoreColor = useMemo(() => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  }, [score]);

  const scoreLabel = useMemo(() => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Bom';
    if (score >= 40) return 'Regular';
    return 'Baixo';
  }, [score]);

  return (
    <Card data-testid="match-score-calculator">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="h-5 w-5" aria-hidden="true" />
          Match Score
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={`text-3xl font-bold ${scoreColor}`}>
              {score}%
            </span>
            <Badge variant={score >= 60 ? 'default' : 'secondary'}>
              {scoreLabel}
            </Badge>
          </div>
          
          <Progress 
            value={score} 
            className="h-2"
            aria-label={`Match score: ${score}%`}
          />

          {showDetails && (
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm text-muted-foreground">Habilidades</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="text-sm text-muted-foreground">Experiência</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

MatchScoreCalculator.displayName = 'MatchScoreCalculator';

export default MatchScoreCalculator;
