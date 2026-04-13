import { memo } from 'react';
import { motion } from 'framer-motion';
import { Draggable } from '@hello-pangea/dnd';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MatchScoreBadge } from '@/components/ui/match-score-badge';
import { HighlightMatch, getMatchIndices } from '@/components/ui/highlight-match';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { GripVertical, Clock, MoreHorizontal, User, Calendar, Sparkles, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { FuseMatch } from '@/hooks/useFuzzySearch';

const cardVariants = {
  hidden: { opacity: 0, y: 10, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 20 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

interface PipelineCandidateCardProps {
  processo: {
    id: string;
    candidatoNome: string;
    candidatoFoto?: string;
    candidatoId?: string;
    vagaTitulo: string;
    matchScore: number;
    diasNaEtapa: number;
  };
  index: number;
  isCompact: boolean;
  matches?: readonly FuseMatch[];
  onNavigate: (path: string) => void;
}

export const PipelineCandidateCard = memo(function PipelineCandidateCard({ processo, index, isCompact, matches, onNavigate }: PipelineCandidateCardProps) {
  return (
    <Draggable key={processo.id} draggableId={processo.id} index={index}>
      {(provided, snapshot) => (
        <motion.div
          ref={provided.innerRef}
          {...provided.draggableProps}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          layout
          className={cn(
            "group relative bg-card/95 backdrop-blur-sm border shadow-sm",
            "hover:shadow-xl hover:border-primary/40 transition-all duration-300",
            "cursor-grab active:cursor-grabbing",
            isCompact ? "rounded-lg p-2.5" : "rounded-xl p-4",
            snapshot.isDragging && "shadow-2xl ring-2 ring-primary scale-[1.02] z-50 rotate-1"
          )}
        >
          <div {...provided.dragHandleProps} className={cn("absolute opacity-0 group-hover:opacity-100 transition-all duration-200", isCompact ? "top-2 right-2" : "top-3 right-3")}>
            <GripVertical className={cn(isCompact ? "h-3 w-3" : "h-4 w-4", "text-muted-foreground/50")} />
          </div>

          <div className={cn("flex items-start", isCompact ? "gap-2" : "gap-3")}>
            <Avatar className={cn("border-2 border-background shadow-md ring-2 ring-primary/10", isCompact ? "h-8 w-8" : "h-11 w-11")}>
              <AvatarImage src={processo.candidatoFoto} />
              <AvatarFallback className={cn("bg-gradient-to-br from-primary/30 to-accent/30 text-primary font-bold", isCompact ? "text-xs" : "text-sm")}>
                {processo.candidatoNome?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className={cn("font-semibold truncate group-hover:text-primary transition-colors", isCompact ? "text-xs" : "text-sm")}>
                <HighlightMatch text={processo.candidatoNome} indices={getMatchIndices(matches, 'candidatoNome')} />
              </p>
              {!isCompact && (
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                  <Briefcase className="h-3 w-3 flex-shrink-0" />
                  <HighlightMatch text={processo.vagaTitulo} indices={getMatchIndices(matches, 'vagaTitulo')} highlightClassName="bg-primary/15 text-primary font-medium rounded-sm" />
                </p>
              )}
            </div>
          </div>

          <div className={cn("flex items-center justify-between", isCompact ? "mt-2" : "mt-4")}>
            {processo.matchScore > 0 ? (
              isCompact ? (
                <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">{processo.matchScore}%</span>
              ) : (
                <MatchScoreBadge score={processo.matchScore} variant="minimal" size="sm" />
              )
            ) : (
              <span className={cn(isCompact ? "text-[10px]" : "text-xs", "text-muted-foreground/50")}>{isCompact ? "-" : "Sem score"}</span>
            )}
            <span className={cn(
              "flex items-center rounded-full",
              isCompact ? "text-[10px] gap-1 px-1.5 py-0.5" : "text-xs gap-1.5 px-2 py-1",
              processo.diasNaEtapa > 10 ? "bg-destructive/10 text-destructive" : processo.diasNaEtapa > 5 ? "bg-warning/10 text-warning" : "bg-muted/50 text-muted-foreground"
            )}>
              <Clock className={cn(isCompact ? "h-2.5 w-2.5" : "h-3 w-3")} />
              {processo.diasNaEtapa}d
            </span>
          </div>

          {!isCompact && (
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 bg-background/80 backdrop-blur-sm hover:bg-primary/10">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-card/95 backdrop-blur-xl border-border/50">
                  <DropdownMenuItem onClick={() => onNavigate(`/candidato/${processo.candidatoId}`)} className="cursor-pointer">
                    <User className="h-4 w-4 mr-2" />Ver perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate(`/agenda?processo=${processo.id}`)} className="cursor-pointer">
                    <Calendar className="h-4 w-4 mr-2" />Agendar entrevista
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate(`/avaliacao/${processo.id}`)} className="cursor-pointer">
                    <Sparkles className="h-4 w-4 mr-2" />Avaliar candidato
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          <div className={cn("absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none", isCompact ? "rounded-lg" : "rounded-xl")} />
        </motion.div>
      )}
    </Draggable>
  );
});
