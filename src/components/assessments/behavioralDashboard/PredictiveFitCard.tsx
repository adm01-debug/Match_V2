import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, CheckCircle2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PredictiveFitAnalysis } from '@/config/behavioralPillars';

interface Props {
  predictiveFit: PredictiveFitAnalysis;
}

export function PredictiveFitCard({ predictiveFit }: Props) {
  const borderMap: Record<string, string> = {
    fortemente_recomendado: 'border-success/50 bg-success/5',
    recomendado: 'border-primary/50 bg-primary/5',
    cautela: 'border-warning/50 bg-warning/5',
    nao_recomendado: 'border-destructive/50 bg-destructive/5',
  };

  const badgeMap: Record<string, string> = {
    fortemente_recomendado: 'bg-success',
    recomendado: 'bg-primary',
    cautela: 'bg-warning',
    nao_recomendado: 'bg-destructive',
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={cn('border-2', borderMap[predictiveFit.recomendacao] ?? 'border-border')}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Análise Preditiva de Fit
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">{predictiveFit.fitGeral}%</span>
              <Badge className={cn(badgeMap[predictiveFit.recomendacao] ?? 'bg-muted')}>
                {predictiveFit.recomendacao.replace(/_/g, ' ').toUpperCase()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">{predictiveFit.justificativa}</p>

          <div className="grid md:grid-cols-2 gap-4">
            {predictiveFit.potencializadores.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-sm flex items-center gap-2 text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  Pontos Fortes para a Vaga
                </p>
                {predictiveFit.potencializadores.map((p, i) => (
                  <div key={i} className="text-sm pl-6">
                    <span className="font-medium">{p.pilar}:</span> {p.descricao}
                  </div>
                ))}
              </div>
            )}

            {predictiveFit.riscos.length > 0 && (
              <div className="space-y-2">
                <p className="font-medium text-sm flex items-center gap-2 text-warning">
                  <AlertTriangle className="h-4 w-4" />
                  Pontos de Atenção
                </p>
                {predictiveFit.riscos.map((r, i) => (
                  <div key={i} className="text-sm pl-6">
                    <Badge
                      variant="outline"
                      className={cn(
                        r.severidade === 'alto'
                          ? 'text-destructive border-destructive/30'
                          : r.severidade === 'medio'
                          ? 'text-warning border-warning/30'
                          : 'text-primary border-primary/30'
                      )}
                    >
                      {r.pilar}
                    </Badge>
                    <span className="ml-2">{r.descricao}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
