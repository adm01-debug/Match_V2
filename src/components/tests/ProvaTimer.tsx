/**
 * @fileoverview ProvaTimer component
 * @module ProvaTimer
 */

import { memo,  useState, useEffect, useCallback  , memo} from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProvaTimerProps {
  duracaoMinutos: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export function ProvaTimer({ duracaoMinutos, onTimeUp, isPaused = false }: ProvaTimerProps) {
  const [tempoRestante, setTempoRestante] = useState(duracaoMinutos * 60);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, onTimeUp]);

  const minutos = Math.floor(tempoRestante / 60);
  const segundos = tempoRestante % 60;
  const percentual = (tempoRestante / (duracaoMinutos * 60)) * 100;
  const isUrgent = percentual <= 20;
  const isWarning = percentual <= 50 && !isUrgent;

  return (
    <div data-testid="prova-timer" role="region" aria-label="Timer prova" className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg transition-colors",
      isUrgent && "bg-red-500/20 text-red-600 animate-pulse",
      isWarning && "bg-yellow-500/20 text-yellow-600",
      !isUrgent && !isWarning && "bg-muted"
    )}>
      {isUrgent ? (
        <AlertTriangle className="h-5 w-5" />
      ) : (
        <Clock className="h-5 w-5" />
      )}
      <span>
        {String(minutos).padStart(2, '0')}:{String(segundos).padStart(2, '0')}
      </span>
    </div>
  );
}


ProvaTimer.displayName = "ProvaTimer";