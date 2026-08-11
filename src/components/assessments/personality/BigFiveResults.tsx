import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Heart, Users, Lightbulb, ArrowRight } from 'lucide-react';
import type { BigFiveResult } from '@/types/personality';

export function BigFiveResults({ result }: { result: BigFiveResult }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Dimensões OCEAN
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {result.dimensions.map((dim) => (
            <div key={dim.dimension} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">{dim.label}</span>
                  <Badge variant="outline" className="ml-2 text-xs">
                    Percentil {dim.percentile}
                  </Badge>
                </div>
                <span className="text-2xl font-bold">{dim.score}%</span>
              </div>
              <Progress value={dim.score} className="h-3" />
              <div className="flex flex-wrap gap-1 mt-1">
                {dim.strengths.slice(0, 3).map((s, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <InsightCard icon={<Target className="h-4 w-4" />} title="Estilo de Trabalho" text={result.workStyle} />
        <InsightCard icon={<Heart className="h-4 w-4" />} title="Comunicação" text={result.communicationStyle} />
        <InsightCard icon={<Users className="h-4 w-4" />} title="Papel na Equipe" text={result.teamRole} />
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Desenvolvimento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              {result.developmentAreas.slice(0, 3).map((area, i) => (
                <li key={i} className="flex items-start gap-2">
                  <ArrowRight className="h-3 w-3 mt-1 shrink-0" />
                  {area}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InsightCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
}
