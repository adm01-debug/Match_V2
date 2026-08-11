import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Clock, Zap, Target, AlertTriangle } from 'lucide-react';
import { BEHAVIORAL_PILLARS, type AuthenticityMetrics } from '@/config/behavioralPillars';

interface Props {
  authenticity: AuthenticityMetrics;
}

export function AuthenticityCard({ authenticity }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Eye className="h-5 w-5 text-primary" />
          Índice de Autenticidade
        </CardTitle>
        <CardDescription>
          Análise de padrões de resposta para detectar respostas genuínas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Clock className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">
              {(authenticity.tempoMedioResposta / 1000).toFixed(1)}s
            </p>
            <p className="text-xs text-muted-foreground">Tempo médio de resposta</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Zap className="h-6 w-6 mx-auto mb-2 text-warning" />
            <p className="text-2xl font-bold">{authenticity.respostasSocialmenteDesejaveis}</p>
            <p className="text-xs text-muted-foreground">Respostas "ideais"</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <Target className="h-6 w-6 mx-auto mb-2 text-success" />
            <p className="text-2xl font-bold">
              {(authenticity.consistenciaInterna * 100).toFixed(0)}%
            </p>
            <p className="text-xs text-muted-foreground">Consistência interna</p>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-destructive" />
            <p className="text-2xl font-bold">{authenticity.contradicoes.length}</p>
            <p className="text-xs text-muted-foreground">Contradições detectadas</p>
          </div>
        </div>

        {authenticity.contradicoes.length > 0 && (
          <div className="mt-4 p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <p className="font-medium text-warning mb-2">Inconsistências detectadas em:</p>
            <div className="flex flex-wrap gap-2">
              {authenticity.contradicoes.map((pilar) => (
                <Badge
                  key={pilar}
                  variant="outline"
                  className="text-warning border-warning/30"
                >
                  {BEHAVIORAL_PILLARS.find((p) => p.id === pilar)?.nome || pilar}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
