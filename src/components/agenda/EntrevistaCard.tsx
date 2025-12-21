import { Entrevista } from '@/data/agendaData';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  MapPin, 
  Video, 
  Phone, 
  Clock, 
  Users,
  Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EntrevistaCardProps {
  entrevista: Entrevista;
  onClick?: () => void;
}

const tipoConfig = {
  presencial: { icon: MapPin, label: 'Presencial', color: 'bg-blue-500/10 text-blue-600' },
  online: { icon: Video, label: 'Online', color: 'bg-purple-500/10 text-purple-600' },
  telefone: { icon: Phone, label: 'Telefone', color: 'bg-green-500/10 text-green-600' },
};

const statusConfig = {
  agendada: { label: 'Agendada', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  confirmada: { label: 'Confirmada', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
  realizada: { label: 'Realizada', color: 'bg-muted text-muted-foreground border-muted' },
  cancelada: { label: 'Cancelada', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
  reagendada: { label: 'Reagendada', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
};

const EntrevistaCard = ({ entrevista, onClick }: EntrevistaCardProps) => {
  const TipoIcon = tipoConfig[entrevista.tipo].icon;
  const tipoStyle = tipoConfig[entrevista.tipo];
  const statusStyle = statusConfig[entrevista.status];

  return (
    <Card role="article" aria-label="Card entrevista" 
      className={cn(
        "p-3 cursor-pointer hover:shadow-md transition-all border-l-4",
        entrevista.status === 'confirmada' && "border-l-green-500",
        entrevista.status === 'agendada' && "border-l-yellow-500",
        entrevista.status === 'realizada' && "border-l-muted-foreground",
        entrevista.status === 'cancelada' && "border-l-red-500",
        entrevista.status === 'reagendada' && "border-l-orange-500"
      )}
      onClick={onClick}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">
              {entrevista.horaInicio} - {entrevista.horaFim}
            </span>
          </div>
          <Badge variant="outline" className={cn("text-xs", statusStyle.color)}>
            {statusStyle.label}
          </Badge>
        </div>

        <div>
          <h4 className="font-semibold text-foreground">{entrevista.candidatoNome}</h4>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Briefcase className="h-3 w-3" />
            <span>{entrevista.vagaTitulo}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={cn("text-xs", tipoStyle.color)}>
            <TipoIcon className="h-3 w-3 mr-1" />
            {tipoStyle.label}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {entrevista.etapa}
          </Badge>
        </div>

        {(entrevista.local || entrevista.linkOnline) && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {entrevista.tipo === 'presencial' ? (
              <>
                <MapPin className="h-3 w-3" />
                <span>{entrevista.local}</span>
              </>
            ) : entrevista.tipo === 'online' ? (
              <>
                <Video className="h-3 w-3" />
                <span className="truncate">{entrevista.linkOnline}</span>
              </>
            ) : null}
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{entrevista.entrevistadores.join(', ')}</span>
        </div>
      </div>
    </Card>
  );
};

export default EntrevistaCard;
