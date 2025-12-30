import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Clock, AlertTriangle, TrendingUp, ArrowRight } from 'lucide-react';

interface StageVelocity {
  stage: string;
  avgDays: number;
  targetDays: number;
  candidatesInStage: number;
  bottleneck: boolean;
}

interface PipelineVelocityProps {
  stages: StageVelocity[];
  totalAvgDays: number;
  prediction?: { daysToHire: number; confidence: number };
}

export function PipelineVelocity({ stages, totalAvgDays, prediction }: PipelineVelocityProps) {
  const bottlenecks = stages.filter(s => s.bottleneck);
  const maxDays = Math.max(...stages.map(s => s.avgDays), ...stages.map(s => s.targetDays));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Velocidade do Pipeline
            </CardTitle>
            <CardDescription>Tempo médio em cada etapa</CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{totalAvgDays} dias</div>
            <span className="text-sm text-muted-foreground">tempo total médio</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Bottleneck Alert */}
        {bottlenecks.length > 0 && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Gargalo detectado em: {bottlenecks.map(b => b.stage).join(', ')}</span>
            </div>
          </div>
        )}

        {/* Pipeline Flow */}
        <div className="space-y-3">
          {stages.map((stage, i) => {
            const progress = (stage.avgDays / maxDays) * 100;
            const targetProgress = (stage.targetDays / maxDays) * 100;
            const isOverTarget = stage.avgDays > stage.targetDays;

            return (
              <div key={stage.stage}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{stage.stage}</span>
                    {stage.bottleneck && <Badge variant="destructive" className="text-xs">Gargalo</Badge>}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">{stage.candidatesInStage} candidatos</span>
                    <span className={isOverTarget ? 'text-red-600 font-medium' : 'text-muted-foreground'}>
                      {stage.avgDays}d / {stage.targetDays}d
                    </span>
                  </div>
                </div>
                <div className="relative h-3">
                  <Progress value={progress} className={`h-3 ${stage.bottleneck ? '[&>div]:bg-red-500' : ''}`} />
                  <div
                    className="absolute top-0 w-0.5 h-3 bg-gray-600"
                    style={{ left: `${targetProgress}%` }}
                    title={`Meta: ${stage.targetDays} dias`}
                  />
                </div>
                {i < stages.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Prediction */}
        {prediction && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="font-medium">Previsão de Contratação</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold">{prediction.daysToHire} dias</div>
                <span className="text-xs text-muted-foreground">{prediction.confidence}% confiança</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
