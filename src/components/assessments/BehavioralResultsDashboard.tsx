/**
 * @fileoverview Dashboard de Resultados Comportamentais.
 * Orquestrador enxuto — cada seção vive em `behavioralDashboard/*`.
 */

import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  BEHAVIORAL_PILLARS,
  type PredictiveFitAnalysis,
  type AuthenticityMetrics,
} from '@/config/behavioralPillars';
import { getScoreColor, getScoreLabel } from './behavioralDashboard/dashboardUtils';
import { PredictiveFitCard } from './behavioralDashboard/PredictiveFitCard';
import { BehavioralRadarChart } from './behavioralDashboard/BehavioralRadarChart';
import { PilarBreakdown } from './behavioralDashboard/PilarBreakdown';
import { StrengthsAndDevelopment } from './behavioralDashboard/StrengthsAndDevelopment';
import { AuthenticityCard } from './behavioralDashboard/AuthenticityCard';

interface BehavioralResultsDashboardProps {
  candidatoNome: string;
  vagaTitulo?: string;
  scores: Record<string, number>;
  companyProfile?: Record<string, number>;
  authenticity?: AuthenticityMetrics;
  predictiveFit?: PredictiveFitAnalysis;
  respostas?: Array<{
    scenarioId: string;
    selectedOption: string;
    timeToRespond: number;
    tags: string[];
  }>;
}

export function BehavioralResultsDashboard({
  candidatoNome,
  vagaTitulo,
  scores,
  companyProfile,
  authenticity,
  predictiveFit,
  respostas,
}: BehavioralResultsDashboardProps) {
  const overallScore = useMemo(() => {
    const values = Object.values(scores);
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }, [scores]);

  const radarData = useMemo(
    () =>
      BEHAVIORAL_PILLARS.map((pilar) => ({
        pilar: pilar.nome.split(' ')[0] ?? pilar.nome,
        fullName: pilar.nome,
        score: scores[pilar.id] || 0,
        empresa: companyProfile ? (companyProfile[pilar.id] || 5) * 10 : undefined,
      })),
    [scores, companyProfile]
  );

  const topPilares = useMemo(
    () =>
      BEHAVIORAL_PILLARS.map((p) => ({ ...p, score: scores[p.id] || 0 }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3),
    [scores]
  );

  const developmentPilares = useMemo(
    () =>
      BEHAVIORAL_PILLARS.map((p) => ({ ...p, score: scores[p.id] || 0 }))
        .filter((p) => p.score < 50)
        .sort((a, b) => a.score - b.score)
        .slice(0, 3),
    [scores]
  );

  const tagFrequency = useMemo(() => {
    if (!respostas) return [];
    const freq: Record<string, number> = {};
    respostas.forEach((r) => {
      r.tags.forEach((tag) => {
        freq[tag] = (freq[tag] || 0) + 1;
      });
    });
    return Object.entries(freq)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));
  }, [respostas]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">{candidatoNome}</h2>
          <p className="text-muted-foreground">
            Avaliação Comportamental {vagaTitulo && `• ${vagaTitulo}`}
          </p>
        </div>
        <div className="text-right">
          <div className={cn('text-4xl font-bold', getScoreColor(overallScore))}>
            {overallScore.toFixed(0)}
          </div>
          <Badge variant="outline" className={getScoreColor(overallScore)}>
            {getScoreLabel(overallScore)}
          </Badge>
        </div>
      </div>

      {predictiveFit && <PredictiveFitCard predictiveFit={predictiveFit} />}

      <div className="grid lg:grid-cols-2 gap-6">
        <BehavioralRadarChart data={radarData} hasCompanyProfile={!!companyProfile} />
        <PilarBreakdown scores={scores} companyProfile={companyProfile} />
      </div>

      <StrengthsAndDevelopment
        topPilares={topPilares}
        developmentPilares={developmentPilares}
      />

      {authenticity && <AuthenticityCard authenticity={authenticity} />}

      {tagFrequency.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Padrões Comportamentais Identificados</CardTitle>
            <CardDescription>
              Tags mais frequentes baseadas nas respostas aos cenários
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tagFrequency.map(({ tag, count }) => (
                <Badge key={tag} variant="secondary" className="text-sm px-3 py-1">
                  {tag}
                  <span className="ml-1 text-xs text-muted-foreground">({count}x)</span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default BehavioralResultsDashboard;
