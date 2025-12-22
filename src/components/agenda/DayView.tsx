import { useMemo,  memo  } from 'react';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Entrevista } from '@/data/agendaData';
import { Clock, Video, MapPin, Phone, Users, Briefcase } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DayViewProps {
  currentDate: Date;
  entrevistas: Entrevista[];
  onSelectEntrevista: (entrevista: Entrevista) => void;
}

const tipoConfig = {
  presencial: { icon: MapPin, label: 'Presencial', color: 'bg-blue-500/10 text-blue-600' },
  online: { icon: Video, label: 'Online', color: 'bg-purple-500/10 text-purple-600' },
  telefone: { icon: Phone, label: 'Telefone', color: 'bg-green-500/10 text-green-600' },
};

const statusColors = {
  agendada: 'border-l-yellow-500 bg-yellow-500/5',
  confirmada: 'border-l-green-500 bg-green-500/5',
  realizada: 'border-l-muted-foreground bg-muted/20',
  cancelada: 'border-l-red-500 bg-red-500/5',
  reagendada: 'border-l-orange-500 bg-orange-500/5',
};

const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 - 19:00

export function DayView({ currentDate, entrevistas, onSelectEntrevista }: DayViewProps) {
  const dayEntrevistas = entrevistas
    .filter((e) => isSameDay(new Date(e.data), currentDate))
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  const getEntrevistaPosition = (hora: string) => {
    const [h, m] = hora.split(':').map(Number);
    return ((h - 8) * 60 + m) / 60;
  };

  const getEntrevistaDuration = (horaInicio: string, horaFim: string) => {
    const [h1, m1] = horaInicio.split(':').map(Number);
    const [h2, m2] = horaFim.split(':').map(Number);
    return ((h2 * 60 + m2) - (h1 * 60 + m1)) / 60;
  };

  const isToday = isSameDay(currentDate, new Date());

  return (
    <div role="region" aria-label="Visualização dia" className="space-y-4">
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
            const [h] = e.horaInicio.split(':').map(Number);
            return h === hour;
          });

          return (
            <div key={hour} className="flex border-b h-20">
              <div className="w-16 flex-shrink-0 text-sm text-muted-foreground text-right pr-3 pt-1">
                {String(hour).padStart(2, '0')}:00
              </div>
              <div className="flex-1 relative">
                {hourEntrevistas.map((entrevista) => {
                  const TipoIcon = tipoConfig[entrevista.tipo].icon;
                  const duration = getEntrevistaDuration(entrevista.horaInicio, entrevista.horaFim);
                  const height = Math.max(duration * 80, 60);

                  return (
                    <div
                      key={entrevista.id}
                      className={cn(
                        "absolute left-0 right-2 rounded-lg border-l-4 p-3 cursor-pointer hover:shadow-md transition-shadow",
                        statusColors[entrevista.status]
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
                        <Badge variant="secondary" className={cn("text-xs", tipoConfig[entrevista.tipo].color)}>
                          <TipoIcon className="h-3 w-3 mr-1" />
                          {tipoConfig[entrevista.tipo].label}
                        </Badge>
                      </div>
                      {height > 70 && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                          <Users className="h-3 w-3" />
                          <span>{entrevista.entrevistadores.join(', ')}</span>
                        </div>
                      )}
                    </div>
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
