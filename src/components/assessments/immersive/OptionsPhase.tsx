import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImmersiveScenario } from '@/config/behavioralPillars';

interface Props {
  scenario: ImmersiveScenario;
  timeLeft: number;
  selectedOption: string | null;
  hoveredOption: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
  onConfirm: () => void;
}

export function OptionsPhase({ scenario, timeLeft, selectedOption, hoveredOption, onHover, onSelect, onConfirm }: Props) {
  const timerColor = timeLeft > 30 ? 'text-foreground' : timeLeft > 10 ? 'text-warning' : 'text-destructive';
  const timerProgress = ((scenario.tempoLimite || 120) - timeLeft) / (scenario.tempoLimite || 120) * 100;

  return (
    <motion.div key="options" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="max-w-4xl w-full">
      <Card className="border-2 border-primary/10 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{scenario.titulo}</CardTitle>
            <div className={cn("flex items-center gap-2 font-mono text-lg font-bold", timerColor)}>
              <Clock className="h-5 w-5" />
              <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
            </div>
          </div>
          <Progress value={timerProgress} className="h-1" />
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm mb-6 line-clamp-3">
            {scenario.narrativa.slice(0, 200)}...
          </p>

          <div className="grid gap-3">
            {scenario.opcoes.map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelect(option.id)}
                onMouseEnter={() => onHover(option.id)}
                onMouseLeave={() => onHover(null)}
                className={cn(
                  "w-full p-4 text-left rounded-lg border-2 transition-all duration-200",
                  "hover:border-primary/50 hover:bg-primary/5",
                  selectedOption === option.id
                    ? "border-primary bg-primary/10 shadow-md"
                    : "border-border bg-card",
                  hoveredOption === option.id && selectedOption !== option.id
                    ? "border-muted-foreground/30"
                    : ""
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                    selectedOption === option.id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30"
                  )}>
                    {selectedOption === option.id && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 bg-primary-foreground rounded-full" />
                    )}
                  </div>
                  <span className="flex-1">{option.texto}</span>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button size="lg" onClick={onConfirm} disabled={!selectedOption} className="gap-2">
              Confirmar Decisão
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
