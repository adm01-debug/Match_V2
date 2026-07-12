import { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  UserPlus, FileText, Calendar, Mail, MessageSquare, 
  CheckCircle, XCircle, Clock, Star, LucideIcon 
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

type EventType = 'applied' | 'stage_change' | 'interview' | 'email' | 'note' | 'evaluation' | 'offer' | 'rejected' | 'hired';

interface TimelineEvent {
  id: string;
  type: EventType;
  title: string;
  description?: string;
  date: string;
  user?: string;
  metadata?: Record<string, unknown>;
}

interface CandidateTimelineProps {
  events: TimelineEvent[];
  candidatoId?: string;
  maxHeight?: string;
  isLoading?: boolean;
}

const EVENT_ICONS: Record<EventType, LucideIcon> = {
  applied: UserPlus,
  stage_change: FileText,
  interview: Calendar,
  email: Mail,
  note: MessageSquare,
  evaluation: Star,
  offer: CheckCircle,
  rejected: XCircle,
  hired: CheckCircle,
};

const EVENT_COLORS: Record<EventType, string> = {
  applied: 'bg-info',
  stage_change: 'bg-accent',
  interview: 'bg-warning',
  email: 'bg-muted-foreground',
  note: 'bg-warning',
  evaluation: 'bg-accent',
  offer: 'bg-success',
  rejected: 'bg-destructive',
  hired: 'bg-success',
};

const EVENT_LABELS: Record<EventType, string> = {
  applied: 'Candidatura',
  stage_change: 'Mudança de etapa',
  interview: 'Entrevista',
  email: 'E-mail',
  note: 'Nota',
  evaluation: 'Avaliação',
  offer: 'Proposta',
  rejected: 'Rejeitado',
  hired: 'Contratado',
};

function formatEventDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch {
    return dateStr;
  }
}

function CandidateTimelineComponent({ 
  events, 
  maxHeight = '400px',
  isLoading = false 
}: CandidateTimelineProps) {
  const sortedEvents = useMemo(() => 
    [...events].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ),
    [events]
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" aria-hidden="true" />
            Histórico do Candidato
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 animate-pulse">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4">
                <div className="w-5 h-5 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" aria-hidden="true" />
          Histórico do Candidato
          {events.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {events.length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Nenhum evento registrado.
          </p>
        ) : (
          <ScrollArea className="pr-4" style={{ maxHeight }}>
            <div 
              className="relative"
              role="list"
              aria-label="Linha do tempo de eventos"
            >
              <div 
                className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" 
                aria-hidden="true"
              />
              <div className="space-y-6">
                {sortedEvents.map((event) => {
                  const Icon = EVENT_ICONS[event.type] ?? FileText;
                  const color = EVENT_COLORS[event.type] ?? 'bg-muted-foreground';
                  const label = EVENT_LABELS[event.type] ?? event.type;
                  const formattedDate = formatEventDate(event.date);
                  const stageValue = event.metadata?.['stage'];

                  return (
                    <article 
                      key={event.id} 
                      className="relative pl-10"
                      role="listitem"
                      aria-label={`${label}: ${event.title}`}
                    >
                      <div 
                        className={cn(
                          "absolute left-2 w-5 h-5 rounded-full flex items-center justify-center",
                          color
                        )}
                        aria-hidden="true"
                      >
                        <Icon className="h-3 w-3 text-white" />
                      </div>
                      
                      <div className="bg-muted/50 rounded-lg p-3">
                        <div className="flex items-start justify-between gap-2 mb-1 flex-wrap">
                          <p className="font-medium text-sm">{event.title}</p>
                          <time 
                            className="text-xs text-muted-foreground whitespace-nowrap"
                            dateTime={event.date}
                          >
                            {formattedDate}
                          </time>
                        </div>
                        
                        {event.description && (
                          <p className="text-sm text-muted-foreground">
                            {event.description}
                          </p>
                        )}
                        
                        {event.user && (
                          <p className="text-xs text-muted-foreground mt-1">
                            por {event.user}
                          </p>
                        )}
                        
                        {typeof stageValue === 'string' && stageValue && (
                          <Badge variant="outline" className="mt-2">
                            {stageValue}
                          </Badge>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

CandidateTimelineComponent.displayName = 'CandidateTimeline';

export const CandidateTimeline = memo(CandidateTimelineComponent);
export default CandidateTimeline;
