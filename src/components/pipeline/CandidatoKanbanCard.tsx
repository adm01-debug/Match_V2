/**
 * @fileoverview CandidatoKanbanCard component
 * @module CandidatoKanbanCard
 */

import { memo, useCallback, useMemo } from 'react';
import { Badge } from "@/components/ui/badge";
import { ProcessoSeletivo, FonteCandidato } from "@/types/recruitment";
import { User, Clock, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface CandidatoKanbanCardProps {
  processo: ProcessoSeletivo;
  onClick?: () => void;
}

const origemLabels: Record<FonteCandidato, string> = {
  portal: "Portal",
  linkedin: "LinkedIn",
  indeed: "Indeed",
  catho: "Catho",
  infojobs: "InfoJobs",
  indicacao: "Indicação",
  espontaneo: "Espontâneo",
  outros: "Outros",
};

function getScoreColor(score: number): string {
  if (score >= 80) return "bg-success/10 text-success border-success/20";
  if (score >= 60) return "bg-warning/10 text-warning border-warning/20";
  return "bg-destructive/10 text-destructive border-destructive/20";
}

function getDaysColor(days: number): string {
  if (days > 10) return "text-destructive";
  if (days > 5) return "text-warning";
  return "";
}

function CandidatoKanbanCardComponent({ processo, onClick }: CandidatoKanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: processo.id });

  const style = useMemo(() => ({
    transform: CSS.Transform.toString(transform),
    transition,
  }), [transform, transition]);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  }, [onClick]);

  const scoreColor = useMemo(() => getScoreColor(processo.matchScore), [processo.matchScore]);
  const daysColor = useMemo(() => getDaysColor(processo.diasNaEtapa), [processo.diasNaEtapa]);
  const origemLabel = origemLabels[processo.origem] ?? processo.origem;
  const daysLabel = processo.diasNaEtapa === 1 ? 'dia' : 'dias';

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative p-3 bg-card rounded-lg border shadow-sm cursor-grab active:cursor-grabbing",
        "hover:shadow-md hover:border-primary/30 transition-all duration-200",
        isDragging && "opacity-50 shadow-lg scale-105 z-50"
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Candidato ${processo.candidatoNome}, score ${processo.matchScore}%, há ${processo.diasNaEtapa} ${daysLabel} na etapa`}
      aria-grabbed={isDragging}
      data-testid="candidato-kanban-card"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div 
            className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0"
            aria-hidden="true"
          >
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium text-sm text-foreground truncate">
            {processo.candidatoNome}
          </span>
        </div>
        <Badge 
          variant="outline" 
          className={cn("shrink-0 text-xs", scoreColor)}
          aria-label={`Score de compatibilidade: ${processo.matchScore}%`}
        >
          ⭐ {processo.matchScore}%
        </Badge>
      </div>

      <div className="space-y-1.5 text-xs text-muted-foreground">
        <p className="truncate">
          <span className="sr-only">Origem: </span>
          {origemLabel}
        </p>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" aria-hidden="true" />
          <span className={daysColor}>
            Há {processo.diasNaEtapa} {daysLabel}
          </span>
        </div>
      </div>

      <div 
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}

CandidatoKanbanCardComponent.displayName = "CandidatoKanbanCard";

export const CandidatoKanbanCard = memo(CandidatoKanbanCardComponent);
export default CandidatoKanbanCard;
