/**
 * @fileoverview CompetenciaRating component
 * @module CompetenciaRating
 */

import { useMemo,  memo  , useCallback} from 'react';
import { Star, Info } from 'lucide-react';
import { Competencia } from '@/types/recruitment';
import { notasDescricao } from '@/data/avaliacaoData';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CompetenciaRatingProps {
  competencia: Competencia;
  nota: number;
  observacao?: string;
  onNotaChange: (nota: number) => void;
  onObservacaoChange: (observacao: string) => void;
}

export function CompetenciaRating({
  competencia,
  nota,
  observacao,
  onNotaChange,
  onObservacaoChange,
}: CompetenciaRatingProps) {
  return (
    <div data-testid="component"><div role="region" aria-label="Avaliação competência" className="space-y-3 p-4 rounded-lg border border-border bg-card">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-foreground">{competencia.nome}</h4>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{competencia.descricao}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className="text-sm text-muted-foreground">{competencia.descricao}</p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => onNotaChange(value)}
                className={cn(
                  'p-1 rounded transition-all hover:scale-110',
                  nota >= value ? 'text-yellow-500' : 'text-muted-foreground/30'
                )}
              >
                <Star
                  className={cn(
                    'h-6 w-6',
                    nota >= value && 'fill-yellow-500'
                  )}
                />
              </button>
            ))}
          </div>
          {nota > 0 && (
            <span className="text-xs text-muted-foreground">
              {notasDescricao[nota].label}
            </span>
          )}
        </div>
      </div>

      <Textarea
        placeholder="Observações sobre esta competência (opcional)"
        value={observacao || ''}
        onChange={(e) => onObservacaoChange(e.target.value)}
        className="min-h-[60px] text-sm"
      />
    </div>
  );
}

CompetenciaRating.displayName = "CompetenciaRating";

export default memo(CompetenciaRating, (prev, next) => JSON.stringify(prev) === JSON.stringify(next));
