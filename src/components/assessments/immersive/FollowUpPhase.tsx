import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImmersiveScenario } from '@/config/behavioralPillars';

interface Props {
  followUp: NonNullable<ImmersiveScenario['followUp']>;
  followUpResponse: string | null;
  onSelect: (id: string) => void;
  onConfirm: () => void;
}

export function FollowUpPhase({ followUp, followUpResponse, onSelect, onConfirm }: Props) {
  return (
    <motion.div key="followup" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="max-w-3xl w-full">
      <Card className="border-2 border-warning/30 shadow-2xl">
        <CardHeader>
          <Badge variant="outline" className="w-fit text-warning border-warning/30">
            Pergunta de Acompanhamento
          </Badge>
          <CardTitle className="text-xl">{followUp.pergunta}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            {followUp.opcoes.map((option, index) => (
              <motion.button
                key={option.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSelect(option.id)}
                className={cn(
                  "w-full p-4 text-left rounded-lg border-2 transition-all duration-200",
                  "hover:border-warning/50 hover:bg-warning/5",
                  followUpResponse === option.id
                    ? "border-warning bg-warning/10 shadow-md"
                    : "border-border bg-card"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                    followUpResponse === option.id
                      ? "border-warning bg-warning text-warning-foreground"
                      : "border-muted-foreground/30"
                  )}>
                    {followUpResponse === option.id && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 bg-warning-foreground rounded-full" />
                    )}
                  </div>
                  <span className="flex-1">{option.texto}</span>
                </div>
              </motion.button>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <Button size="lg" onClick={onConfirm} disabled={!followUpResponse} className="gap-2">
              Continuar
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
