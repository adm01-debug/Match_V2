import { memo } from 'react';
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

export function CandidatoKanbanCard({ processo, onClick }: CandidatoKanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: processo.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-success/10 text-success border-success/20";
    if (score >= 60) return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group p-3 bg-card rounded-lg border shadow-sm cursor-grab active:cursor-grabbing",
        "hover:shadow-md hover:border-primary/30 transition-all duration-200",
        isDragging && "opacity-50 shadow-lg scale-105 z-50"
      )}
      onClick={onClick}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="font-medium text-sm text-foreground truncate">
            {processo.candidatoNome}
          </span>
        </div>
        <Badge variant="outline" className={cn("shrink-0 text-xs", getScoreColor(processo.matchScore))}>
          ⭐ {processo.matchScore}%
        </Badge>
      </div>

      <div className="space-y-1.5 text-xs text-muted-foreground">
        <p className="truncate">{origemLabels[processo.origem]}</p>
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          <span className={cn(
            processo.diasNaEtapa > 5 && "text-warning",
            processo.diasNaEtapa > 10 && "text-destructive"
          )}>
            Há {processo.diasNaEtapa} dia{processo.diasNaEtapa !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
