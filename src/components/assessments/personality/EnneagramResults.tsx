import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Heart, Shield } from 'lucide-react';
import type { EnneagramResult } from '@/types/personality';

export function EnneagramResults({ result }: { result: EnneagramResult }) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-warning/10 to-primary/10">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-2">Tipo {result.coreType}</div>
            <p className="text-xl font-medium">{result.typeName}</p>
            <Badge className="mt-2">{result.wing}</Badge>
            <p className="mt-4 max-w-xl mx-auto text-sm">{result.typeDescription}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Distribuição dos Tipos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {result.typeScores
              .sort((a, b) => b.score - a.score)
              .map((type) => (
                <div
                  key={type.type}
                  className={`p-3 rounded-lg border ${
                    type.isCore
                      ? 'border-primary bg-primary/5'
                      : type.isWing
                      ? 'border-warning/50 bg-warning/5'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold">Tipo {type.type}</span>
                    <span className="text-lg font-bold">{type.score}%</span>
                  </div>
                  <Progress value={type.score} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{type.name}</p>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="h-4 w-4 text-success" />
              Motivação Central
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{result.coreMotivation}</p>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">
              <strong>Desejo básico:</strong> {result.coreDesire}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-destructive" />
              Medo Central
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{result.coreFear}</p>
            <Separator className="my-3" />
            <p className="text-xs text-muted-foreground">
              <strong>Vício básico:</strong> {result.basicVice}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Padrões de Integração</CardTitle>
          <CardDescription>Como você se comporta sob stress e em crescimento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-destructive mb-2">
                Sob Stress → Tipo {result.integration.stressDirection}
              </h4>
              <ul className="space-y-1">
                {result.integration.stressBehaviors.map((b, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-destructive">↓</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-success mb-2">
                Em Crescimento → Tipo {result.integration.growthDirection}
              </h4>
              <ul className="space-y-1">
                {result.integration.growthBehaviors.map((b, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-success">↑</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Stack de Instintos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {result.instinctStack.map((instinct, idx) => (
              <Badge
                key={instinct}
                variant={idx === 0 ? 'default' : 'secondary'}
                className="capitalize"
              >
                {idx + 1}. {instinct.replace('autopreservacao', 'Auto-preservação')}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
