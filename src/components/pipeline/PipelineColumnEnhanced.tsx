/**
 * Enhanced Pipeline Column with animations and visual feedback
 * @module components/pipeline/PipelineColumnEnhanced
 */

import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  MoreVertical,
  Mail,
  Calendar,
  Eye,
  Star,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Candidate {
  id: string;
  nome: string;
  foto?: string;
  matchScore?: number;
  diasNaEtapa?: number;
  email?: string;
  tags?: string[];
}

interface PipelineColumnEnhancedProps {
  id: string;
  title: string;
  color: string;
  icon: React.ReactNode;
  candidates: Candidate[];
  totalTarget?: number;
  onCandidateClick?: (candidate: Candidate) => void;
  onAction?: (candidateId: string, action: string) => void;
}

const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-success bg-success/10';
  if (score >= 60) return 'text-warning bg-warning/10';
  return 'text-destructive bg-destructive/10';
};

const CandidateCard = memo(({ 
  candidate, 
  index, 
  onCandidateClick, 
  onAction 
}: { 
  candidate: Candidate; 
  index: number;
  onCandidateClick?: (candidate: Candidate) => void;
  onAction?: (candidateId: string, action: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Draggable draggableId={candidate.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            'group relative bg-card border rounded-lg p-3 mb-2 cursor-grab active:cursor-grabbing',
            'transition-all duration-200 hover:shadow-md hover:border-primary/30',
            snapshot.isDragging && 'shadow-lg ring-2 ring-primary/50'
          )}
        >
          {/* Match Score Indicator */}
          {candidate.matchScore && (
            <div className={cn(
              'absolute -top-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold',
              getScoreColor(candidate.matchScore)
            )}>
              {candidate.matchScore}
            </div>
          )}

          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-background">
              <AvatarImage src={candidate.foto} alt={candidate.nome} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {candidate.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{candidate.nome}</p>
              
              {candidate.diasNaEtapa !== undefined && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3" />
                  <span>{candidate.diasNaEtapa} dias na etapa</span>
                </div>
              )}

              {candidate.tags && candidate.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {candidate.tags.slice(0, 2).map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs py-0">
                      {tag}
                    </Badge>
                  ))}
                  {candidate.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs py-0">
                      +{candidate.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    'h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity',
                    isHovered && 'opacity-100'
                  )}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={() => onCandidateClick?.(candidate)}>
                  <Eye className="h-4 w-4 mr-2" />
                  Ver perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction?.(candidate.id, 'email')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Enviar email
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction?.(candidate.id, 'schedule')}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Agendar
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onAction?.(candidate.id, 'favorite')}>
                  <Star className="h-4 w-4 mr-2" />
                  Favoritar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Drag Hint Animation */}
          <AnimatePresence>
            {isHovered && !snapshot.isDragging && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
              >
                <div className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-lg absolute inset-0" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Draggable>
  );
});

CandidateCard.displayName = 'CandidateCard';

export const PipelineColumnEnhanced = memo(({
  id,
  title,
  color,
  icon,
  candidates,
  totalTarget = 10,
  onCandidateClick,
  onAction
}: PipelineColumnEnhancedProps) => {
  const progress = Math.min((candidates.length / totalTarget) * 100, 100);
  const avgMatchScore = candidates.length > 0
    ? Math.round(candidates.reduce((sum, c) => sum + (c.matchScore || 0), 0) / candidates.length)
    : 0;

  return (
    <Card className="flex-shrink-0 w-[300px] flex flex-col max-h-[calc(100vh-200px)] bg-gradient-to-b from-card to-card/50">
      <CardHeader className="pb-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div 
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: `${color}20`, color }}
            >
              {icon}
            </div>
            <CardTitle className="text-base font-medium">{title}</CardTitle>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary" className="font-mono">
                  {candidates.length}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>{candidates.length} candidatos nesta etapa</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Column Stats */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            <span>Média: {avgMatchScore}%</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>Meta: {totalTarget}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <Progress value={progress} className="h-1.5" />
          <p className="text-xs text-muted-foreground text-right">
            {Math.round(progress)}% da meta
          </p>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-3 pt-0">
        <Droppable droppableId={id}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={cn(
                'h-full overflow-y-auto space-y-1 rounded-lg p-2 transition-colors min-h-[100px]',
                snapshot.isDraggingOver && 'bg-primary/5 ring-2 ring-primary/20 ring-dashed'
              )}
            >
              <AnimatePresence mode="popLayout">
                {candidates.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-32 text-muted-foreground"
                  >
                    <Sparkles className="h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">Nenhum candidato</p>
                    <p className="text-xs">Arraste candidatos para cá</p>
                  </motion.div>
                ) : (
                  candidates.map((candidate, index) => (
                    <CandidateCard
                      key={candidate.id}
                      candidate={candidate}
                      index={index}
                      onCandidateClick={onCandidateClick}
                      onAction={onAction}
                    />
                  ))
                )}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
});

PipelineColumnEnhanced.displayName = 'PipelineColumnEnhanced';

export default PipelineColumnEnhanced;
