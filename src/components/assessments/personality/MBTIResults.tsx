import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { MBTIResult } from '@/types/personality';

export function MBTIResults({ result }: { result: MBTIResult }) {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10">
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-primary mb-2">{result.type}</div>
            <p className="text-xl font-medium">{result.typeName}</p>
            <p className="text-muted-foreground">{result.typeNickname}</p>
            <p className="mt-4 max-w-xl mx-auto text-sm">{result.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Preferências Cognitivas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {result.dichotomies.map((dic) => (
            <div key={dic.dimension} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className={dic.leftScore < 50 ? 'font-bold text-primary' : 'text-muted-foreground'}>
                  {dic.leftLabel}
                </span>
                <span className={dic.leftScore >= 50 ? 'font-bold text-primary' : 'text-muted-foreground'}>
                  {dic.rightLabel}
                </span>
              </div>
              <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-primary/30 rounded-full"
                  style={{ width: `${100 - dic.leftScore}%` }}
                />
                <div
                  className="absolute inset-y-0 right-0 bg-primary/30 rounded-full"
                  style={{ width: `${dic.leftScore}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-lg"
                  style={{ left: `calc(${dic.leftScore}% - 8px)` }}
                />
              </div>
              <div className="text-xs text-center text-muted-foreground">Clareza: {dic.clarity}%</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Funções Cognitivas</CardTitle>
          <CardDescription>Stack cognitivo do seu tipo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.cognitiveFunctions.map((func) => (
              <div key={func.function} className="flex items-center gap-4">
                <div className="w-16 text-center">
                  <div className="text-lg font-mono font-bold">{func.function}</div>
                  <div className="text-xs text-muted-foreground capitalize">{func.role}</div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>{func.label}</span>
                    <span>{func.strength}%</span>
                  </div>
                  <Progress value={func.strength} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-success">Pontos Fortes</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {result.strengths.map((s, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-success">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base text-warning">Áreas de Crescimento</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {result.growthAreas.map((a, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-warning">→</span>
                  {a}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
