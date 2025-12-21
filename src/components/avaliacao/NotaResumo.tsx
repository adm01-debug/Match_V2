import { memo } from 'react';
import { cn } from '@/lib/utils';

interface NotaResumoProps {
  titulo: string;
  nota: number;
  maxNota?: number;
  tipo?: 'tecnica' | 'comportamental' | 'geral';
}

export function NotaResumo({ titulo, nota, maxNota = 5, tipo = 'geral' }: NotaResumoProps) {
  const percentual = (nota / maxNota) * 100;

  const getCorBarra = () => {
    if (percentual >= 80) return 'bg-green-500';
    if (percentual >= 60) return 'bg-yellow-500';
    if (percentual >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getCorTexto = () => {
    if (percentual >= 80) return 'text-green-600';
    if (percentual >= 60) return 'text-yellow-600';
    if (percentual >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getIcone = () => {
    switch (tipo) {
      case 'tecnica':
        return '🔧';
      case 'comportamental':
        return '💡';
      default:
        return '⭐';
    }
  };

  return (
    <div role="region" aria-label="Resumo nota" className="p-4 rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <span>{getIcone()}</span>
          {titulo}
        </span>
        <span className={cn('text-2xl font-bold', getCorTexto())}>
          {nota.toFixed(1)}
        </span>
      </div>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', getCorBarra())}
          style={{ width: `${percentual}%` }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">1</span>
        <span className="text-xs text-muted-foreground">{maxNota}</span>
      </div>
    </div>
  );
}
