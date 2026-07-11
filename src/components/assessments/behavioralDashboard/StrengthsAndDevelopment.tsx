import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, TrendingUp, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { pilarIcons } from './dashboardUtils';

interface PilarScore {
  id: string;
  nome: string;
  descricao: string;
  cor: string;
  score: number;
}

interface Props {
  topPilares: PilarScore[];
  developmentPilares: PilarScore[];
}

export function StrengthsAndDevelopment({ topPilares, developmentPilares }: Props) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border-success/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-success">
            <CheckCircle2 className="h-5 w-5" />
            Pontos Fortes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topPilares.map((pilar) => {
            const Icon = pilarIcons[pilar.id] || Target;
            return (
              <div key={pilar.id} className="flex items-center gap-3">
                <div className={cn('p-2 rounded-lg', pilar.cor)}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{pilar.nome}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">{pilar.descricao}</p>
                </div>
                <Badge className="bg-success">{pilar.score.toFixed(0)}%</Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <Card className={developmentPilares.length > 0 ? 'border-warning/30' : ''}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-warning">
            <TrendingUp className="h-5 w-5" />
            Áreas de Desenvolvimento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {developmentPilares.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Não foram identificadas áreas críticas de desenvolvimento.
            </p>
          ) : (
            developmentPilares.map((pilar) => {
              const Icon = pilarIcons[pilar.id] || Target;
              return (
                <div key={pilar.id} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{pilar.nome}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      Sugestão: Desenvolver através de mentoria e feedback estruturado
                    </p>
                  </div>
                  <Badge variant="outline" className="text-warning border-warning/30">
                    {pilar.score.toFixed(0)}%
                  </Badge>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
