/**
 * @fileoverview CandidatoKanbanCard component with premium design
 * @module CandidatoKanbanCard
 */

import { memo, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProcessoSeletivo, FonteCandidato } from "@/types/recruitment";
import { Clock, GripVertical, Briefcase, Star } from "lucide-react";
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

const origemColors: Record<FonteCandidato, string> = {
  portal: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  linkedin: "bg-sky-500/10 text-sky-600 border-sky-500/20",
  indeed: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  catho: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  infojobs: "bg-green-500/10 text-green-600 border-green-500/20",
  indicacao: "bg-pink-500/10 text-pink-600 border-pink-500/20",
  espontaneo: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
  outros: "bg-gray-500/10 text-gray-600 border-gray-500/20",
};

function getScoreColor(score: number): string {
  if (score >= 80) return "bg-gradient-to-r from-success/20 to-success/10 text-success border-success/30";
  if (score >= 60) return "bg-gradient-to-r from-warning/20 to-warning/10 text-warning border-warning/30";
  return "bg-gradient-to-r from-destructive/20 to-destructive/10 text-destructive border-destructive/30";
}

function getDaysStatus(days: number): { color: string; urgent: boolean } {
  if (days > 10) return { color: "text-destructive", urgent: true };
  if (days > 5) return { color: "text-warning", urgent: false };
  return { color: "text-muted-foreground", urgent: false };
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
  const daysStatus = useMemo(() => getDaysStatus(processo.diasNaEtapa), [processo.diasNaEtapa]);
  const origemLabel = origemLabels[processo.origem] ?? processo.origem;
  const origemColor = origemColors[processo.origem] ?? origemColors.outros;
  const daysLabel = processo.diasNaEtapa === 1 ? 'dia' : 'dias';

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative p-4 rounded-xl border shadow-sm cursor-grab active:cursor-grabbing",
        "bg-gradient-to-br from-card via-card to-card/80",
        "hover:shadow-lg hover:border-primary/30 transition-all duration-200",
        isDragging && "opacity-60 shadow-2xl scale-105 z-50 ring-2 ring-primary"
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Candidato ${processo.candidatoNome}, score ${processo.matchScore}%, há ${processo.diasNaEtapa} ${daysLabel} na etapa`}
      aria-grabbed={isDragging}
      data-testid="candidato-kanban-card"
      {...attributes}
      {...listeners}
    >
      {/* Drag handle indicator */}
      <div 
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground/50" />
      </div>

      {/* Header with avatar and name */}
      <div className="flex items-start gap-3 mb-3">
        <Avatar className="h-11 w-11 border-2 border-background shadow-sm ring-2 ring-primary/10">
          <AvatarImage src={processo.candidatoFoto} />
          <AvatarFallback className="bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold">
            {processo.candidatoNome?.charAt(0) || '?'}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
            {processo.candidatoNome}
          </h4>
          <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
            <Briefcase className="h-3 w-3 flex-shrink-0" />
            {processo.vagaTitulo}
          </p>
        </div>
      </div>

      {/* Score badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <Badge 
          variant="outline" 
          className={cn("text-xs font-bold px-2.5 py-0.5", scoreColor)}
          aria-label={`Score de compatibilidade: ${processo.matchScore}%`}
        >
          <Star className="h-3 w-3 mr-1 fill-current" />
          {processo.matchScore}%
        </Badge>
        <Badge 
          variant="outline" 
          className={cn("text-[10px] px-2 py-0.5", origemColor)}
        >
          {origemLabel}
        </Badge>
      </div>

      {/* Time in stage */}
      <div className="flex items-center justify-between text-xs">
        <div className={cn("flex items-center gap-1", daysStatus.color)}>
          <Clock className={cn("h-3 w-3", daysStatus.urgent && "animate-pulse")} aria-hidden="true" />
          <span className="font-medium">
            Há {processo.diasNaEtapa} {daysLabel}
          </span>
        </div>
        {daysStatus.urgent && (
          <span className="text-[10px] text-destructive font-medium bg-destructive/10 px-2 py-0.5 rounded-full">
            Atenção
          </span>
        )}
      </div>

      {/* Hover overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
    </motion.div>
  );
}

CandidatoKanbanCardComponent.displayName = "CandidatoKanbanCard";

export const CandidatoKanbanCard = memo(CandidatoKanbanCardComponent);
export default CandidatoKanbanCard;
