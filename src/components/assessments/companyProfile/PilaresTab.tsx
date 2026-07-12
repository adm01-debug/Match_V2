import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { AlertTriangle, CheckCircle2, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BEHAVIORAL_PILLARS } from '@/config/behavioralPillars';

interface PilaresTabProps {
  pilaresValorizados: Record<string, number>;
  onChange: (pilarId: string, value: number[]) => void;
  topPilares: (typeof BEHAVIORAL_PILLARS)[number][];
  lowPilares: (typeof BEHAVIORAL_PILLARS)[number][];
}

export function PilaresTab({ pilaresValorizados, onChange, topPilares, lowPilares }: PilaresTabProps) {
  return (
    <div className="space-y-4 mt-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Importância de Cada Pilar (1-10)
          </CardTitle>
          <CardDescription>Defina o peso de cada pilar comportamental para esta posição</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {BEHAVIORAL_PILLARS.map((pilar) => {
            const pilarValue = pilaresValorizados[pilar.id] ?? 5;
            return (
              <motion.div key={pilar.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn('w-3 h-3 rounded-full', pilar.cor)} />
                    <span className="font-medium">{pilar.nome}</span>
                  </div>
                  <Badge variant={pilarValue >= 8 ? 'default' : 'outline'} className={pilarValue >= 8 ? 'bg-primary' : ''}>
                    {pilarValue}/10
                  </Badge>
                </div>
                <Slider value={[pilarValue]} onValueChange={(v) => onChange(pilar.id, v)} min={1} max={10} step={1} className="w-full" />
                <p className="text-xs text-muted-foreground line-clamp-1">{pilar.descricao}</p>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="border-success/30 bg-success/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2 text-success">
              <CheckCircle2 className="h-4 w-4" />
              Mais Valorizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topPilares.map((pilar) => (
                <Badge key={pilar.id} className={cn(pilar.cor, 'text-white')}>
                  {pilar.nome} ({pilaresValorizados[pilar.id] ?? 5})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {lowPilares.length > 0 && (
          <Card className="border-warning/30 bg-warning/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2 text-warning">
                <AlertTriangle className="h-4 w-4" />
                Menos Prioritários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {lowPilares.map((pilar) => (
                  <Badge key={pilar.id} variant="outline">
                    {pilar.nome} ({pilaresValorizados[pilar.id] ?? 5})
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
