import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, Clock, MapPin, Video, Users, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Entrevista } from '@/data/agendaData';
import { tipoConfig, parseDate } from './constants';

interface Props {
  entrevista: Entrevista;
}

export const EntrevistaDetailsView = ({ entrevista }: Props) => {
  const tipoData = tipoConfig[entrevista.tipo as keyof typeof tipoConfig] || tipoConfig.presencial;
  const TipoIcon = tipoData.icon;

  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-lg font-semibold text-primary">
            {entrevista.candidatoNome.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </span>
        </div>
        <div>
          <h3 className="font-semibold text-lg">{entrevista.candidatoNome}</h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Briefcase className="h-4 w-4" /><span>{entrevista.vagaTitulo}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Data</Label>
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>{format(parseDate(entrevista.data), 'dd/MM/yyyy', { locale: ptBR })}</span>
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Horário</Label>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{entrevista.horaInicio} - {entrevista.horaFim}</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Tipo</Label>
          <Badge variant="secondary" className={cn(tipoData.color)}>
            <TipoIcon className="h-3 w-3 mr-1" />{tipoData.label}
          </Badge>
        </div>
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Etapa</Label>
          <Badge variant="outline">{entrevista.etapa || 'N/A'}</Badge>
        </div>
      </div>
      {(entrevista.local || entrevista.linkOnline) && (
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">{entrevista.tipo === 'presencial' ? 'Local' : 'Link'}</Label>
          <div className="flex items-center gap-2 text-sm">
            {entrevista.tipo === 'presencial' ? (
              <><MapPin className="h-4 w-4 text-muted-foreground" /><span>{entrevista.local}</span></>
            ) : (
              <><Video className="h-4 w-4 text-muted-foreground" />
                <a href={entrevista.linkOnline} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline truncate">
                  {entrevista.linkOnline}
                </a>
              </>
            )}
          </div>
        </div>
      )}
      <div className="space-y-1">
        <Label className="text-muted-foreground text-xs">Entrevistadores</Label>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{entrevista.entrevistadores.map(e => e.nome).join(', ') || 'Nenhum'}</span>
        </div>
      </div>
      {entrevista.notas && (
        <div className="space-y-1">
          <Label className="text-muted-foreground text-xs">Observações</Label>
          <p className="text-sm text-muted-foreground bg-muted p-2 rounded">{entrevista.notas}</p>
        </div>
      )}
    </div>
  );
};
