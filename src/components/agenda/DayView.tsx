/**
 * @fileoverview DayView component
 * @module DayView
 */

import { memo } from 'react';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Entrevista } from '@/data/agendaData';
import { Clock, Video, MapPin, Phone, Users, Briefcase, HelpCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { LucideIcon } from 'lucide-react';

interface DayViewProps {
  currentDate: Date;
  entrevistas: Entrevista[];
  onSelectEntrevista: (entrevista: Entrevista) => void;
}

interface TipoConfigItem {
  icon: LucideIcon;
  label: string;
  color: string;
}

const tipoConfig: Record<string, TipoConfigItem> = {
  presencial: { icon: MapPin, label: 'Presencial', color: 'bg-info/10 text-info' },
  online: { icon: Video, label: 'Online', color: 'bg-primary/10 text-primary' },
  telefone: { icon: Phone, label: 'Telefone', color: 'bg-success/10 text-success' },
  tecnica: { icon: Users, label: 'Técnica', color: 'bg-info/10 text-info' },
  rh: { icon: Users, label: 'RH', color: 'bg-success/10 text-success' },
  cultural: { icon: Users, label: 'Cultural', color: 'bg-primary/10 text-primary' },
  final: { icon: Users, label: 'Final', color: 'bg-warning/10 text-warning' },
  triagem: { icon: Phone, label: 'Triagem', color: 'bg-muted-foreground/10 text-foreground' },
};

const defaultTipoConfig: TipoConfigItem = {
  icon: HelpCircle,
  label: 'Outro',
  color: 'bg-muted-foreground/10 text-foreground',
};

const statusColors: Record<string, string> = {
  agendada: 'border-l-warning bg-warning/5',
  confirmada: 'border-l-success bg-success/5',
  realizada: 'border-l-muted-foreground bg-muted/20',
  cancelada: 'border-l-destructive bg-destructive/5',
  reagendada: 'border-l-warning bg-warning/5',
  remarcada: 'border-l-warning bg-warning/5',
  no_show: 'border-l-destructive bg-destructive/5',
};

const defaultStatusColor = 'border-l-gray-500 bg-muted-foreground/5';

const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 - 19:00

/**
 * Parse time string safely, returning 0 for invalid values
 */
function parseTimeComponent(value: string | undefined): number {
  if (!value) return 0;
  const num = parseInt(value, 10);
  return isNaN(num) ? 0 : num;
}

/**
 * Parse hora string "HH:MM" to { hours, minutes }
 */
function parseHora(hora: string): { hours: number; minutes: number } {
  const parts = hora?.split(':') ?? [];
  return {
    hours: parseTimeComponent(parts[0]),
    minutes: parseTimeComponent(parts[1]),
  };
}

export function DayView({ currentDate, entrevistas, onSelectEntrevista }: DayViewProps): JSX.Element {
  const dayEntrevistas = entrevistas
    .filter((e) => {
      try {
        return isSameDay(new Date(e.data), currentDate);
      } catch {
        return false;
      }
    })
    .sort((a, b) => (a.horaInicio ?? '').localeCompare(b.horaInicio ?? ''));

  const getEntrevistaDuration = (horaInicio: string, horaFim: string): number => {
    const start = parseHora(horaInicio);
    const end = parseHora(horaFim);
    const startMinutes = start.hours * 60 + start.minutes;
    const endMinutes = end.hours * 60 + end.minutes;
    return Math.max((endMinutes - startMinutes) / 60, 0.5);
  };

  const isToday = isSameDay(currentDate, new Date());

  const getTipoConfig = (tipo: string): TipoConfigItem => {
    return tipoConfig[tipo] ?? defaultTipoConfig;
  };

  const getStatusColor = (status: string): string => {
    return statusColors[status] ?? defaultStatusColor;
  };

  const getEntrevistadoresText = (entrevista: Entrevista): string => {
    if (!entrevista.entrevistadores || entrevista.entrevistadores.length === 0) {
      return 'Sem entrevistadores';
    }
    return entrevista.entrevistadores
      .map((e) => (typeof e === 'string' ? e : e.nome))
      .join(', ');
  };

  return (
    <div data-testid="day-view" role="region" aria-label="Visualização dia" className="space-y-4">
      {/* Day header */}
      <div className={cn(
        "text-center py-4 rounded-lg",
        isToday && "bg-primary/10"
      )}>
        <div className="text-sm text-muted-foreground">
          {format(currentDate, 'EEEE', { locale: ptBR })}
        </div>
        <div className={cn(
          "text-3xl font-bold",
          isToday && "text-primary"
        )}>
          {format(currentDate, 'd')}
        </div>
        <div className="text-sm text-muted-foreground">
          {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {hours.map((hour) => {
          const hourEntrevistas = dayEntrevistas.filter((e) => {
            const { hours: h } = parseHora(e.horaInicio ?? '');
            return h === hour;
          });

          return (
            <div key={hour} className="flex border-b h-20">
              <div className="w-16 flex-shrink-0 text-sm text-muted-foreground text-right pr-3 pt-1">
                {String(hour).padStart(2, '0')}:00
              </div>
              <div className="flex-1 relative">
                {hourEntrevistas.map((entrevista) => {
                  const tipoInfo = getTipoConfig(entrevista.tipo);
                  const TipoIcon = tipoInfo.icon;
                  const duration = getEntrevistaDuration(entrevista.horaInicio, entrevista.horaFim);
                  const height = Math.max(duration * 80, 60);

                  return (
                    <button
                      type="button"
                      key={entrevista.id}
                      className={cn(
                        "absolute left-0 right-2 rounded-lg border-l-4 p-3 cursor-pointer hover:shadow-md transition-shadow text-left w-full",
                        getStatusColor(entrevista.status)
                      )}
                      style={{ height: `${height}px` }}
                      onClick={() => onSelectEntrevista(entrevista)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                              {entrevista.horaInicio} - {entrevista.horaFim}
                            </span>
                          </div>
                          <h4 className="font-semibold text-foreground">
                            {entrevista.candidatoNome}
                          </h4>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Briefcase className="h-3 w-3" />
                            <span>{entrevista.vagaTitulo}</span>
                          </div>
                        </div>
                        <Badge variant="secondary" className={cn("text-xs", tipoInfo.color)}>
                          <TipoIcon className="h-3 w-3 mr-1" />
                          {tipoInfo.label}
                        </Badge>
                      </div>
                      {height > 70 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                          <Users className="h-3 w-3" />
                          <span>{getEntrevistadoresText(entrevista)}</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {dayEntrevistas.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>Nenhuma entrevista agendada para este dia</p>
        </div>
      )}
    </div>
  );
}

DayView.displayName = "DayView";

export default memo(DayView);
