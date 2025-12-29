/**
 * @fileoverview EntrevistaCard component
 * @module EntrevistaCard
 */

import { memo } from 'react';
import { Entrevista } from '@/data/agendaData';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { 
  MapPin, 
  Video, 
  Phone, 
  Clock, 
  Users,
  Briefcase,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface EntrevistaCardProps {
  entrevista: Entrevista;
  onClick?: () => void;
}

interface TipoConfigItem {
  icon: LucideIcon;
  label: string;
  color: string;
}

interface StatusConfigItem {
  label: string;
  color: string;
}

const tipoConfig: Record<string, TipoConfigItem> = {
  presencial: { icon: MapPin, label: 'Presencial', color: 'bg-blue-500/10 text-blue-600' },
  online: { icon: Video, label: 'Online', color: 'bg-purple-500/10 text-purple-600' },
  telefone: { icon: Phone, label: 'Telefone', color: 'bg-green-500/10 text-green-600' },
  tecnica: { icon: Users, label: 'Técnica', color: 'bg-indigo-500/10 text-indigo-600' },
  rh: { icon: Users, label: 'RH', color: 'bg-green-500/10 text-green-600' },
  cultural: { icon: Users, label: 'Cultural', color: 'bg-pink-500/10 text-pink-600' },
  final: { icon: Users, label: 'Final', color: 'bg-orange-500/10 text-orange-600' },
  triagem: { icon: Phone, label: 'Triagem', color: 'bg-gray-500/10 text-gray-600' },
};

const defaultTipoConfig: TipoConfigItem = {
  icon: HelpCircle,
  label: 'Outro',
  color: 'bg-gray-500/10 text-gray-600',
};

const statusConfig: Record<string, StatusConfigItem> = {
  agendada: { label: 'Agendada', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' },
  confirmada: { label: 'Confirmada', color: 'bg-green-500/10 text-green-600 border-green-500/20' },
  realizada: { label: 'Realizada', color: 'bg-muted text-muted-foreground border-muted' },
  cancelada: { label: 'Cancelada', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
  reagendada: { label: 'Reagendada', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
  remarcada: { label: 'Remarcada', color: 'bg-orange-500/10 text-orange-600 border-orange-500/20' },
  no_show: { label: 'No Show', color: 'bg-red-500/10 text-red-600 border-red-500/20' },
};

const defaultStatusConfig: StatusConfigItem = {
  label: 'Pendente',
  color: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
};

const borderColors: Record<string, string> = {
  confirmada: 'border-l-green-500',
  agendada: 'border-l-yellow-500',
  realizada: 'border-l-muted-foreground',
  cancelada: 'border-l-red-500',
  reagendada: 'border-l-orange-500',
  remarcada: 'border-l-orange-500',
  no_show: 'border-l-red-500',
};

function EntrevistaCard({ entrevista, onClick }: EntrevistaCardProps) {
  const tipoStyle = tipoConfig[entrevista.tipo] ?? defaultTipoConfig;
  const statusStyle = statusConfig[entrevista.status] ?? defaultStatusConfig;
  const TipoIcon = tipoStyle.icon;
  const borderColor = borderColors[entrevista.status] ?? 'border-l-gray-500';

  const getEntrevistadoresText = (): string => {
    if (!entrevista.entrevistadores || entrevista.entrevistadores.length === 0) {
      return 'Sem entrevistadores';
    }
    return entrevista.entrevistadores
      .map((e) => (typeof e === 'string' ? e : e.nome))
      .join(', ');
  };

  return (
    <Card 
      data-testid="entrevista-card"
      role="article" 
      aria-label={`Entrevista com ${entrevista.candidatoNome}`}
      className={cn(
        "p-3 cursor-pointer hover:shadow-md transition-all border-l-4",
        borderColor
      )}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <span className="font-medium text-sm">
              {entrevista.horaInicio ?? '--:--'} - {entrevista.horaFim ?? '--:--'}
            </span>
          </div>
          <Badge variant="outline" className={cn("text-xs", statusStyle.color)}>
            {statusStyle.label}
          </Badge>
        </div>

        <div>
          <h4 className="font-semibold text-foreground">{entrevista.candidatoNome}</h4>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Briefcase className="h-3 w-3" aria-hidden="true" />
            <span>{entrevista.vagaTitulo}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className={cn("text-xs", tipoStyle.color)}>
            <TipoIcon className="h-3 w-3 mr-1" aria-hidden="true" />
            {tipoStyle.label}
          </Badge>
          {entrevista.etapa && (
            <Badge variant="outline" className="text-xs">
              {entrevista.etapa}
            </Badge>
          )}
        </div>

        {(entrevista.local || entrevista.linkOnline) && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            {entrevista.tipo === 'presencial' && entrevista.local ? (
              <>
                <MapPin className="h-3 w-3" aria-hidden="true" />
                <span>{entrevista.local}</span>
              </>
            ) : entrevista.linkOnline ? (
              <>
                <Video className="h-3 w-3" aria-hidden="true" />
                <span className="truncate max-w-[200px]">{entrevista.linkOnline}</span>
              </>
            ) : null}
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" aria-hidden="true" />
          <span>{getEntrevistadoresText()}</span>
        </div>
      </div>
    </Card>
  );
}

EntrevistaCard.displayName = "EntrevistaCard";

export default memo(EntrevistaCard);
