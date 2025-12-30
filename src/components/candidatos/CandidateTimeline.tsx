import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { UserPlus, FileText, Calendar, Mail, MessageSquare, CheckCircle, XCircle, Clock, Star } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TimelineEvent { id: string; type: 'applied' | 'stage_change' | 'interview' | 'email' | 'note' | 'evaluation' | 'offer' | 'rejected' | 'hired'; title: string; description?: string; date: string; user?: string; metadata?: Record<string, any>; }

const EVENT_ICONS: Record<string, any> = {
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

const EVENT_COLORS: Record<string, string> = {
  applied: 'bg-blue-500',
  stage_change: 'bg-purple-500',
  interview: 'bg-orange-500',
  email: 'bg-gray-500',
  note: 'bg-yellow-500',
  evaluation: 'bg-pink-500',
  offer: 'bg-green-500',
  rejected: 'bg-red-500',
  hired: 'bg-emerald-500',
};

interface CandidateTimelineProps { events: TimelineEvent[]; candidatoId?: string; maxHeight?: string; }

export function CandidateTimeline({ events, maxHeight = '400px' }: CandidateTimelineProps) {
  const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Histórico do Candidato</CardTitle></CardHeader>
      <CardContent>
        <ScrollArea className="pr-4" style={{ maxHeight }}>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {sortedEvents.map((event) => {
                const Icon = EVENT_ICONS[event.type] || FileText;
                const color = EVENT_COLORS[event.type] || 'bg-gray-500';
                return (
                  <div key={event.id} className="relative pl-10">
                    <div className={`absolute left-2 w-5 h-5 rounded-full ${color} flex items-center justify-center`}><Icon className="h-3 w-3 text-white" /></div>
                    <div className="bg-muted/50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm">{event.title}</p>
                        <span className="text-xs text-muted-foreground">{format(new Date(event.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</span>
                      </div>
                      {event.description && <p className="text-sm text-muted-foreground">{event.description}</p>}
                      {event.user && <p className="text-xs text-muted-foreground mt-1">por {event.user}</p>}
                      {event.metadata?.['stage'] && <Badge variant="outline" className="mt-2">{event.metadata['stage']}</Badge>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
        {events.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhum evento registrado.</p>}
      </CardContent>
    </Card>
  );
}

export default CandidateTimeline;
