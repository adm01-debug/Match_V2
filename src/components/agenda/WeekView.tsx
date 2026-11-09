/**
 * @fileoverview WeekView component
 * @module WeekView
 */

import { memo } from 'react';
import type { JSX } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Entrevista } from '@/data/agendaData';
import { Clock, Video, MapPin, Phone } from 'lucide-react';

interface WeekViewProps {
  currentDate: Date;
  entrevistas: Entrevista[];
  onSelectEntrevista: (entrevista: Entrevista) => void;
  onSelectDate: (date: Date) => void;
}

const tipoIcon: Record<string, typeof MapPin> = {
  presencial: MapPin,
  online: Video,
  telefone: Phone,
  tecnica: Video,
  rh: Video,
  cultural: Video,
  final: Video,
  triagem: Phone,
};

const statusColors: Record<string, string> = {
  agendada: 'bg-warning/20 border-warning text-warning',
  confirmada: 'bg-success/20 border-success text-success',
  realizada: 'bg-muted border-muted-foreground/20 text-muted-foreground',
  cancelada: 'bg-destructive/20 border-destructive text-destructive',
  reagendada: 'bg-warning/20 border-warning text-warning',
  remarcada: 'bg-warning/20 border-warning text-warning',
  no_show: 'bg-destructive/20 border-destructive text-destructive',
};

const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 - 19:00

export function WeekView({ currentDate, entrevistas, onSelectEntrevista, onSelectDate }: WeekViewProps): JSX.Element {
  const weekStart = startOfWeek(currentDate, { locale: ptBR });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getEntrevistaPosition = (hora: string) => {
    const parts = hora.split(':').map(Number);
    const h = parts[0] ?? 0;
    const m = parts[1] ?? 0;
    return ((h - 8) * 60 + m) / 60;
  };

  const getEntrevistaDuration = (horaInicio: string, horaFim: string) => {
    const startParts = horaInicio.split(':').map(Number);
    const endParts = horaFim.split(':').map(Number);
    const h1 = startParts[0] ?? 0;
    const m1 = startParts[1] ?? 0;
    const h2 = endParts[0] ?? 0;
    const m2 = endParts[1] ?? 0;
    return ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;
  };

  return (
    <div data-testid="week-view" role="region" aria-label="Visualização semana" className="overflow-auto">
      <div className="min-w-[800px]">
        {/* Header */}
        <div className="grid grid-cols-8 border-b">
          <div className="p-2 text-xs text-muted-foreground font-medium border-r">Horário</div>
          {weekDays.map((day) => {
            const isToday = isSameDay(day, new Date());
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  "p-2 text-center border-r cursor-pointer hover:bg-accent",
                  isToday && "bg-primary/10"
                )}
                onClick={() => onSelectDate(day)}
              >
                <div className="text-xs text-muted-foreground">
                  {format(day, 'EEE', { locale: ptBR })}
                </div>
                <div className={cn(
                  "text-lg font-semibold",
                  isToday && "text-primary"
                )}>
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="relative">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b h-16">
              <div className="p-2 text-xs text-muted-foreground border-r flex items-start justify-end pr-2">
                {String(hour).padStart(2, '0')}:00
              </div>
              {weekDays.map((day) => {
                const dayEntrevistas = entrevistas.filter((e) => 
                  isSameDay(new Date(e.data), day)
                );
                
                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="border-r relative"
                  >
                    {dayEntrevistas
                      .filter((e) => {
                        const [h] = e.horaInicio.split(':').map(Number);
                        return h === hour;
                      })
                      .map((entrevista) => {
                        const top = (getEntrevistaPosition(entrevista.horaInicio) - (hour - 8)) * 64;
                        const height = getEntrevistaDuration(entrevista.horaInicio, entrevista.horaFim) * 64;
                        const Icon = tipoIcon[entrevista.tipo] ?? MapPin;

                        return (
                          <div
                            key={entrevista.id}
                            className={cn(
                              "absolute left-0.5 right-0.5 rounded-md border-l-2 p-1 cursor-pointer hover:opacity-80 transition-opacity overflow-hidden",
                              statusColors[entrevista.status] ?? 'bg-warning/20 border-warning text-warning'
                            )}
                            style={{
                              top: `${top}px`,
                              height: `${Math.max(height, 24)}px`,
                            }}
                            onClick={() => onSelectEntrevista(entrevista)}
                          >
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 flex-shrink-0" />
                              <span className="text-[10px] font-medium truncate">
                                {entrevista.horaInicio}
                              </span>
                            </div>
                            <div className="text-[10px] font-semibold truncate">
                              {entrevista.candidatoNome.split(' ')[0]}
                            </div>
                            {height > 40 && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <Icon className="h-2.5 w-2.5" />
                                <span className="text-[9px] truncate">{entrevista.vagaTitulo}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

WeekView.displayName = "WeekView";

export default memo(WeekView);
