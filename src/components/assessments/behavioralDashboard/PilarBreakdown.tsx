import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BEHAVIORAL_PILLARS } from '@/config/behavioralPillars';
import { pilarIcons, getScoreColor } from './dashboardUtils';

interface Props {
  scores: Record<string, number>;
  companyProfile?: Record<string, number>;
}

export function PilarBreakdown({ scores, companyProfile }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Detalhamento por Pilar</CardTitle>
        <CardDescription>Scores individuais e comparação com expectativa</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
        {BEHAVIORAL_PILLARS.map((pilar) => {
          const score = scores[pilar.id] || 0;
          const empresaPeso = companyProfile ? (companyProfile[pilar.id] || 5) * 10 : null;
          const gap = empresaPeso !== null ? score - empresaPeso : null;
          const Icon = pilarIcons[pilar.id] || Target;

          return (
            <motion.div
              key={pilar.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-1"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={cn('p-1.5 rounded', pilar.cor)}>
                    <Icon className="h-3 w-3 text-white" />
                  </div>
                  <span className="text-sm font-medium">{pilar.nome}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('font-bold', getScoreColor(score))}>
                    {score.toFixed(0)}%
                  </span>
                  {gap !== null && (
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-xs',
                        gap > 10
                          ? 'text-success border-success/30'
                          : gap < -10
                          ? 'text-destructive border-destructive/30'
                          : 'text-muted-foreground'
                      )}
                    >
                      {gap > 0 && '+'}
                      {gap.toFixed(0)}
                      {gap > 10 ? (
                        <TrendingUp className="h-3 w-3 ml-1 inline" />
                      ) : gap < -10 ? (
                        <TrendingDown className="h-3 w-3 ml-1 inline" />
                      ) : (
                        <Minus className="h-3 w-3 ml-1 inline" />
                      )}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="relative h-2 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className={cn('absolute inset-y-0 left-0 rounded-full', pilar.cor)}
                />
                {empresaPeso !== null && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-foreground"
                    style={{ left: `${empresaPeso}%` }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
