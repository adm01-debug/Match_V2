import { useMemo,  memo  } from 'react';
import { ProcessoSeletivo, EtapaProcesso } from "@/types/recruitment";
import { CandidatoKanbanCard } from "./CandidatoKanbanCard";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PipelineColumnProps {
  etapa: {
    id: EtapaProcesso;
    label: string;
    cor: string;
  };
  processos: ProcessoSeletivo[];
  onCardClick?: (processo: ProcessoSeletivo) => void;
}

export const PipelineColumn = memo(function PipelineColumn({ etapa, processos, onCardClick }: PipelineColumnProps, (prev, next) => JSON.stringify(prev) === JSON.stringify(next)) {
  const { setNodeRef, isOver } = useDroppable({
    id: etapa.id,
  });

  return (
    <div data-testid="component"><div
      className={cn(
        "flex flex-col bg-muted/30 rounded-xl min-w-[260px] max-w-[260px] h-full border",
        isOver && "border-primary bg-primary/5"
      )}
    >
      {/* Header */}
      <div role="region" aria-label="Coluna pipeline" className="p-3 border-b bg-card rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: etapa.cor }}
            />
            <span className="font-medium text-sm text-foreground">{etapa.label}</span>
          </div>
          <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
            {processos.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <ScrollArea className="flex-1">
        <div
          ref={setNodeRef}
          className={cn(
            "p-2 space-y-2 min-h-[200px]",
            processos.length === 0 && "flex items-center justify-center"
          )}
        >
          <SortableContext
            items={processos.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            {processos.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-8">
                Nenhum candidato
              </p>
            ) : (
              processos.map((processo) => (
                <CandidatoKanbanCard
                  key={processo.id}
                  processo={processo}
                  onClick={() => onCardClick?.(processo)}
                />
              ))
            )}
          </SortableContext>
        </div>
      </ScrollArea>
    </div>
  );
});

PipelineColumn.displayName = "PipelineColumn";
