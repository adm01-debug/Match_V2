import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Sparkles, TrendingUp, TrendingDown, Target, Briefcase, AlertCircle, CheckCircle2, Lightbulb } from 'lucide-react';

interface AIInsightsProps {
  candidateName: string;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  jobRecommendations?: Array<{ title: string; matchScore: number; reason: string }>;
  skillGaps?: string[];
  competencyBreakdown?: Array<{ name: string; score: number; benchmark: number }>;
  className?: string;
}

export function AIInsights({
  candidateName,
  overallScore,
  strengths,
  improvements,
  jobRecommendations = [],
  skillGaps = [],
  competencyBreakdown = [],
  className,
}: AIInsightsProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return 'default';
    if (score >= 60) return 'secondary';
    return 'destructive';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header com Score Geral */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/20">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Análise IA - {candidateName}</h3>
                <p className="text-sm text-muted-foreground">Insights gerados por inteligência artificial</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}</div>
              <Badge variant={getScoreBadge(overallScore)}>Score Geral</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Pontos Fortes */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-green-600">
              <TrendingUp className="h-4 w-4" />
              Pontos Fortes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {strengths.map((strength, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Áreas de Melhoria */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-yellow-600">
              <TrendingDown className="h-4 w-4" />
              Áreas de Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {improvements.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Competências Detalhadas */}
      {competencyBreakdown.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Análise de Competências
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {competencyBreakdown.map((comp, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{comp.name}</span>
                  <span className={getScoreColor(comp.score)}>{comp.score}%</span>
                </div>
                <div className="relative">
                  <Progress value={comp.score} className="h-2" />
                  <div
                    className="absolute top-0 w-0.5 h-2 bg-gray-400"
                    style={{ left: `${comp.benchmark}%` }}
                    title={`Benchmark: ${comp.benchmark}%`}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Benchmark do mercado: {comp.benchmark}%
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Gaps de Skills */}
      {skillGaps.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-orange-600">
              <Lightbulb className="h-4 w-4" />
              Skills Recomendadas para Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {skillGaps.map((skill, i) => (
                <Badge key={i} variant="outline" className="border-orange-300 text-orange-700">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vagas Recomendadas */}
      {jobRecommendations.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Vagas Recomendadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {jobRecommendations.map((job, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{job.title}</div>
                  <div className="text-sm text-muted-foreground">{job.reason}</div>
                </div>
                <Badge variant={getScoreBadge(job.matchScore)}>
                  {job.matchScore}% match
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
