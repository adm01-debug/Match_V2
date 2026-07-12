import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Timer, Brain, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ImmersiveScenario } from '@/config/behavioralPillars';
import { tipoLabels } from './types';

interface Props {
  scenario: ImmersiveScenario;
  scenarioIndex: number;
  totalScenarios: number;
  onStart: () => void;
  onSkip?: () => void;
}

export function IntroPhase({ scenario, scenarioIndex, totalScenarios, onStart, onSkip }: Props) {
  const tipoInfo = tipoLabels[scenario.tipo] || tipoLabels['dilema_etico'];
  const TipoIcon = tipoInfo?.icon || AlertTriangle;

  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="max-w-2xl w-full"
    >
      <Card className="border-2 border-primary/20 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className={cn("p-4 rounded-full bg-muted", tipoInfo?.color || 'text-primary')}>
              <TipoIcon className="h-8 w-8" />
            </div>
          </div>
          <div className="space-y-1">
            <Badge variant="outline" className={tipoInfo?.color || ''}>
              {tipoInfo?.label || 'Cenário'}
            </Badge>
            <CardTitle className="text-2xl">{scenario.titulo}</CardTitle>
          </div>
          <p className="text-muted-foreground">{scenario.contexto}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Timer className="h-4 w-4" />
              <span>{scenario.tempoLimite || 120}s para decidir</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>{scenario.opcoes.length} opções</span>
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-warning">Importante</p>
                <p className="text-muted-foreground">
                  Não existe resposta certa ou errada. Responda como você realmente agiria,
                  não como acha que deveria agir.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {onSkip && (
              <Button variant="ghost" onClick={onSkip} className="flex-1">Pular</Button>
            )}
            <Button onClick={onStart} className="flex-1 gap-2">
              Começar <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            Cenário {scenarioIndex + 1} de {totalScenarios}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
