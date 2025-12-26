/**
 * @fileoverview GoogleCalendarExport component
 * @module GoogleCalendarExport
 */

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, Download, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Entrevista } from '@/data/agendaData';
import { toast } from '@/hooks/use-toast';

interface GoogleCalendarExportProps {
  entrevista?: Entrevista;
  entrevistas?: Entrevista[];
}

export function GoogleCalendarExport({ entrevista, entrevistas }: GoogleCalendarExportProps): JSX.Element | null {
  const formatDateTime = (date: Date, time: string): string => {
    const [hours, minutes] = time.split(':').map(Number);
    const dt = new Date(date);
    dt.setHours(hours, minutes, 0, 0);
    return dt.toISOString().replace(/-|:|\.\d{3}/g, '');
  };

  const createGoogleCalendarUrl = (e: Entrevista): string => {
    const startDate = formatDateTime(e.data, e.horaInicio);
    const endDate = formatDateTime(e.data, e.horaFim);
    
    const details = [
      `Candidato: ${e.candidatoNome}`,
      `Vaga: ${e.vagaTitulo}`,
      `Etapa: ${e.etapa}`,
      `Tipo: ${e.tipo}`,
      e.entrevistadores.length > 0 ? `Entrevistadores: ${e.entrevistadores.join(', ')}` : '',
      e.observacoes ? `Observações: ${e.observacoes}` : '',
    ].filter(Boolean).join('\n');

    const location = e.tipo === 'presencial' ? e.local : e.linkOnline;

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: `Entrevista: ${e.candidatoNome} - ${e.vagaTitulo}`,
      dates: `${startDate}/${endDate}`,
      details,
      location: location || '',
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const createIcsContent = (events: Entrevista[]): string => {
    const icsEvents = events.map((e) => {
      const startDate = formatDateTime(e.data, e.horaInicio);
      const endDate = formatDateTime(e.data, e.horaFim);
      
      const location = e.tipo === 'presencial' ? e.local : e.linkOnline;
      
      const description = [
        `Candidato: ${e.candidatoNome}`,
        `Vaga: ${e.vagaTitulo}`,
        `Etapa: ${e.etapa}`,
        `Tipo: ${e.tipo}`,
        e.entrevistadores.length > 0 ? `Entrevistadores: ${e.entrevistadores.join(', ')}` : '',
        e.observacoes ? `Observações: ${e.observacoes}` : '',
      ].filter(Boolean).join('\\n');

      return `BEGIN:VEVENT
DTSTART:${startDate}
DTEND:${endDate}
SUMMARY:Entrevista: ${e.candidatoNome} - ${e.vagaTitulo}
DESCRIPTION:${description}
LOCATION:${location || ''}
STATUS:CONFIRMED
END:VEVENT`;
    }).join('\n');

    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ATS System//Interviews//PT
CALSCALE:GREGORIAN
METHOD:PUBLISH
${icsEvents}
END:VCALENDAR`;
  };

  const downloadIcs = (events: Entrevista[], filename: string) => {
    const content = createIcsContent(events);
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Arquivo baixado",
      description: "O arquivo .ics foi gerado e baixado com sucesso.",
    });
  };

  const handleGoogleCalendar = () => {
    if (entrevista) {
      window.open(createGoogleCalendarUrl(entrevista), '_blank');
    }
  };

  const handleDownloadIcs = () => {
    if (entrevista) {
      downloadIcs([entrevista], `entrevista-${entrevista.candidatoNome.replace(/\s+/g, '-').toLowerCase()}.ics`);
    } else if (entrevistas && entrevistas.length > 0) {
      downloadIcs(entrevistas, `entrevistas-${format(new Date(), 'yyyy-MM-dd')}.ics`);
    }
  };

  if (entrevista) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" size="sm" aria-label="Adicionar ao calendário">
            <Calendar className="h-4 w-4 mr-2" />
            Adicionar ao Calendário
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleGoogleCalendar}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Google Calendar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDownloadIcs}>
            <Download className="h-4 w-4 mr-2" />
            Baixar .ics (Outlook/Apple)
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (entrevistas && entrevistas.length > 0) {
    return (
      <Button type="button" variant="outline" size="sm" onClick={handleDownloadIcs}>
        <Download className="h-4 w-4 mr-2" />
        Exportar Calendário ({entrevistas.length})
      </Button>
    );
  }

  return null;
}

GoogleCalendarExport.displayName = "GoogleCalendarExport";

export default memo(GoogleCalendarExport);
