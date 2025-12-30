import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, TrendingUp } from "lucide-react";
import type { MatchResult } from "@/types/resumeParser";
import { cn } from "@/lib/utils";

interface MatchScoreCardProps {
  match: MatchResult;
  className?: string;
}

export function MatchScoreCard({ match, className }: MatchScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  const getRecommendationBadge = () => {
    switch (match.recommendation) {
      case "strong": return <Badge className="bg-green-500">Forte Candidato</Badge>;
      case "moderate": return <Badge className="bg-yellow-500">Candidato Moderado</Badge>;
      case "weak": return <Badge className="bg-red-500">Baixa Compatibilidade</Badge>;
    }
  };

  const breakdownItems = [
    { label: "Skills", value: match.breakdown.skillsMatch },
    { label: "Experiência", value: match.breakdown.experienceMatch },
    { label: "Educação", value: match.breakdown.educationMatch },
    { label: "Localização", value: match.breakdown.locationMatch },
  ];

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Score de Match
          </CardTitle>
          {getRecommendationBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score principal */}
        <div className="text-center">
          <span className={cn("text-5xl font-bold", getScoreColor(match.score))}>
            {match.score}
          </span>
          <span className="text-2xl text-muted-foreground">/100</span>
        </div>

        {/* Breakdown */}
        <div className="space-y-3">
          {breakdownItems.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{item.label}</span>
                <span className={getScoreColor(item.value)}>{item.value}%</span>
              </div>
              <Progress value={item.value} className="h-2" />
            </div>
          ))}
        </div>

        {/* Highlights */}
        {match.highlights.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-green-700">Pontos Fortes</h4>
            <ul className="space-y-1">
              {match.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Gaps */}
        {match.gaps.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-red-700">Lacunas</h4>
            <ul className="space-y-1">
              {match.gaps.map((g, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                  {g}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
