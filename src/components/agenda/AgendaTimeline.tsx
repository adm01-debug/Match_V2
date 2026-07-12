/**
 * Interactive Agenda Timeline Component
 * @module components/agenda/AgendaTimeline
 */

import { memo, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Video, 
  MapPin, 
  Clock, 
  User,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Play,
  Calendar as CalendarIcon
} from 'lucide-react';
import { format, isToday, isTomorrow, differenceInMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AgendaEvent {
  id: string;
  titulo: string;
  tipo: 'video' | 'presencial' | 'telefone';
  candidato: {
    id: string;
    nome: string;
    foto?: string;
  };
  vaga: string;
  dataHoraInicio: Date;
  dataHoraFim: Date;
  local?: string;
  linkOnline?: string;
  status: 'agendado' | 'confirmado' | 'em_andamento' | 'concluido' | 'cancelado';
  entrevistadores: string[];
}

interface AgendaTimelineProps {
  events: AgendaEvent[];
  selectedDate: Date;
  onEventClick?: (event: AgendaEvent) => void;
  onEventAction?: (eventId: string, action: string) => void;
}

const getStatusInfo = (status: AgendaEvent['status']) => {
  switch (status) {
    case 'confirmado':
      return { icon: CheckCircle2, color: 'text-success', bg: 'bg-success/10', label: 'Confirmado' };
    case 'em_andamento':
      return { icon: Play, color: 'text-info', bg: 'bg-info/10', label: 'Em andamento' };
    case 'concluido':
      return { icon: CheckCircle2, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Concluído' };
    case 'cancelado':
      return { icon: XCircle, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Cancelado' };
    default:
      return { icon: AlertCircle, color: 'text-warning', bg: 'bg-warning/10', label: 'Agendado' };
  }
};

const getTypeInfo = (tipo: AgendaEvent['tipo']) => {
  switch (tipo) {
    case 'video':
      return { icon: Video, label: 'Videochamada' };
    case 'presencial':
      return { icon: MapPin, label: 'Presencial' };
    case 'telefone':
      return { icon: Phone, label: 'Telefone' };
  }
};

const TimeSlot = memo(({ hour, events, onEventClick, onEventAction }: { 
  hour: number; 
  events: AgendaEvent[];
  onEventClick?: (event: AgendaEvent) => void;
  onEventAction?: (eventId: string, action: string) => void;
}) => {
  const hourStr = hour.toString().padStart(2, '0') + ':00';

  return (
    <div className="relative flex min-h-[80px]">
      {/* Time Label */}
      <div className="w-16 flex-shrink-0 text-sm text-muted-foreground font-mono pt-2">
        {hourStr}
      </div>

      {/* Horizontal Line */}
      <div className="absolute left-16 right-0 top-3 h-px bg-border" />

      {/* Events */}
      <div className="flex-1 space-y-2 py-2 pl-4">
        <AnimatePresence mode="popLayout">
          {events.map((event, index) => (
            <TimelineEventCard
              key={event.id}
              event={event}
              index={index}
              onEventClick={onEventClick}
              onEventAction={onEventAction}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
});

TimeSlot.displayName = 'TimeSlot';

const TimelineEventCard = memo(({ 
  event, 
  index,
  onEventClick,
  onEventAction
}: { 
  event: AgendaEvent; 
  index: number;
  onEventClick?: (event: AgendaEvent) => void;
  onEventAction?: (eventId: string, action: string) => void;
}) => {
  const statusInfo = getStatusInfo(event.status);
  const typeInfo = getTypeInfo(event.tipo);
  const StatusIcon = statusInfo.icon;
  const TypeIcon = typeInfo.icon;

  const minutesUntilStart = differenceInMinutes(event.dataHoraInicio, new Date());
  const isStartingSoon = minutesUntilStart > 0 && minutesUntilStart <= 15;
  const isNow = event.status === 'em_andamento';

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card 
        className={cn(
          'cursor-pointer transition-all hover:shadow-md group',
          isNow && 'ring-2 ring-info animate-pulse',
          isStartingSoon && 'ring-2 ring-warning',
          event.status === 'cancelado' && 'opacity-50'
        )}
        onClick={() => onEventClick?.(event)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Time Block */}
            <div className="text-center min-w-[60px]">
              <div className="text-lg font-bold">
                {format(event.dataHoraInicio, 'HH:mm')}
              </div>
              <div className="text-xs text-muted-foreground">
                até {format(event.dataHoraFim, 'HH:mm')}
              </div>
              <Badge 
                variant="outline" 
                className={cn('mt-2', statusInfo.color, statusInfo.bg)}
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusInfo.label}
              </Badge>
            </div>

            {/* Divider */}
            <div className="w-px h-full min-h-[60px] bg-border self-stretch" />

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={event.candidato.foto} alt={event.candidato.nome} />
                  <AvatarFallback className="text-xs">
                    {event.candidato.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="font-medium truncate">{event.candidato.nome}</p>
                  <p className="text-xs text-muted-foreground truncate">{event.vaga}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <TypeIcon className="h-4 w-4" />
                  <span>{typeInfo.label}</span>
                </div>
                {event.entrevistadores.length > 0 && (
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{event.entrevistadores.length} entrevistador(es)</span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                {event.tipo === 'video' && event.linkOnline && (
                  <Button
                    size="sm"
                    variant="default"
                    className="h-7 gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(event.linkOnline, '_blank');
                    }}
                  >
                    <Video className="h-3 w-3" />
                    Entrar
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEventAction?.(event.id, 'reschedule');
                  }}
                >
                  <CalendarIcon className="h-3 w-3" />
                  Reagendar
                </Button>
              </div>
            </div>

            {/* Starting Soon Indicator */}
            {isStartingSoon && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 text-warning animate-pulse">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-medium">{minutesUntilStart}min</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Começa em {minutesUntilStart} minutos</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

TimelineEventCard.displayName = 'TimelineEventCard';

export const AgendaTimeline = memo(({
  events,
  selectedDate,
  onEventClick,
  onEventAction
}: AgendaTimelineProps) => {
  // Group events by hour
  const eventsByHour = useMemo(() => {
    const grouped: Record<number, AgendaEvent[]> = {};
    
    // Initialize hours from 8 to 18
    for (let h = 8; h <= 18; h++) {
      grouped[h] = [];
    }

    events.forEach(event => {
      const hour = event.dataHoraInicio.getHours();
      if (grouped[hour]) {
        grouped[hour].push(event);
      }
    });

    return grouped;
  }, [events]);

  const dateLabel = useMemo(() => {
    if (isToday(selectedDate)) return 'Hoje';
    if (isTomorrow(selectedDate)) return 'Amanhã';
    return format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR });
  }, [selectedDate]);

  return (
    <div className="space-y-4">
      {/* Date Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold capitalize">{dateLabel}</h3>
          <p className="text-sm text-muted-foreground">
            {events.length} {events.length === 1 ? 'entrevista' : 'entrevistas'} agendadas
          </p>
        </div>
        {events.length > 0 && (
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
              <CheckCircle2 className="h-3 w-3 text-success" />
              {events.filter(e => e.status === 'confirmado').length} confirmadas
            </Badge>
            <Badge variant="outline" className="gap-1">
              <AlertCircle className="h-3 w-3 text-warning" />
              {events.filter(e => e.status === 'agendado').length} pendentes
            </Badge>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="border rounded-lg bg-card p-4 space-y-1">
        {Object.entries(eventsByHour).map(([hour, hourEvents]) => (
          <TimeSlot
            key={hour}
            hour={parseInt(hour)}
            events={hourEvents}
            onEventClick={onEventClick}
            onEventAction={onEventAction}
          />
        ))}
      </div>

      {/* Empty State */}
      {events.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <CalendarIcon className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h4 className="text-lg font-medium mb-1">Nenhuma entrevista agendada</h4>
          <p className="text-muted-foreground">
            Não há entrevistas para este dia. Que tal agendar uma?
          </p>
        </motion.div>
      )}
    </div>
  );
});

AgendaTimeline.displayName = 'AgendaTimeline';

export default AgendaTimeline;
