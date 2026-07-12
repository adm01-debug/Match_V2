import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Calendar, Clock, Users, AlertTriangle, ArrowRight, Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { SugestedSlot } from './types';

interface Props {
  slot: SugestedSlot;
  index: number;
  isSelected: boolean;
  onSelect: (slot: SugestedSlot) => void;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-success';
  if (score >= 70) return 'text-warning';
  return 'text-warning';
};

const getScoreBg = (score: number) => {
  if (score >= 90) return 'bg-success/10 border-success/20';
  if (score >= 70) return 'bg-warning/10 border-warning/20';
  return 'bg-warning/10 border-warning/20';
};

export function SuggestedSlotCard({ slot, index, isSelected, onSelect }: Props) {
  const hasProximity = !slot.hasConflict && slot.conflicts && slot.conflicts.length > 0;
  const isTop = index === 0 && !slot.hasConflict && !slot.conflicts?.length;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        'relative p-4 rounded-xl border-2 cursor-pointer transition-all',
        slot.hasConflict
          ? 'border-destructive/50 bg-destructive/5'
          : isSelected
            ? 'border-primary bg-primary/5 shadow-lg'
            : 'border-border hover:border-primary/50 hover:shadow-md',
        !slot.hasConflict && getScoreBg(slot.score),
      )}
      onClick={() => onSelect(slot)}
      data-testid="suggested-slot"
    >
      {slot.hasConflict && (
        <div className="absolute -top-2 -left-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="destructive" className="animate-pulse">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Conflito
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="font-medium mb-1">Conflitos de horário:</p>
                <ul className="text-sm space-y-1">
                  {slot.conflicts?.map((c, i) => (
                    <li key={i}>• {c.message}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {hasProximity && (
        <div className="absolute -top-2 -left-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/30">
                  <Clock className="h-3 w-3 mr-1" />
                  Atenção
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="font-medium mb-1">Aviso:</p>
                <ul className="text-sm space-y-1">
                  {slot.conflicts?.map((c, i) => (
                    <li key={i}>• {c.message}</li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {isTop && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
            <Star className="h-3 w-3 mr-1" />
            Recomendado
          </Badge>
        </div>
      )}

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">
                {format(slot.data, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {slot.horaInicio} - {slot.horaFim}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div className="flex -space-x-2">
              {slot.entrevistadores.slice(0, 3).map(e => (
                <Avatar key={e.id} className="h-6 w-6 border-2 border-background">
                  <AvatarFallback className="text-xs bg-primary/20">
                    {e.nome.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              ))}
              {slot.entrevistadores.length > 3 && (
                <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                  +{slot.entrevistadores.length - 3}
                </div>
              )}
            </div>
            <span className="text-sm text-muted-foreground">
              {slot.entrevistadores.map(e => e.nome.split(' ')[0]).join(', ')}
            </span>
          </div>

          <div className="flex flex-wrap gap-1">
            {slot.reasons.map((reason, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {reason}
              </Badge>
            ))}
          </div>
        </div>

        <div className="text-right">
          <div className={cn('text-2xl font-bold', slot.hasConflict ? 'text-destructive' : getScoreColor(slot.score))}>
            {slot.score}%
          </div>
          <Progress value={slot.score} className="w-16 h-1.5 mt-1" />
          <span className="text-xs text-muted-foreground">match</span>
        </div>
      </div>

      {isSelected && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t"
        >
          <Button className="w-full bg-gradient-to-r from-primary to-purple-600">
            Confirmar este horário
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
