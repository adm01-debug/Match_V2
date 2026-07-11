import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { User, Briefcase, DollarSign } from 'lucide-react';
import { statusConfig, type Indicacao, type IndicacaoStatus } from './types';

interface Props {
  indicacao: Indicacao;
  onStatusChange: (id: string, status: IndicacaoStatus) => void;
}

export function IndicacaoCard({ indicacao, onStatusChange }: Props) {
  const StatusIcon = statusConfig[indicacao.status].icon;
  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold truncate">{indicacao.candidato_nome}</h3>
                <p className="text-sm text-muted-foreground truncate">{indicacao.candidato_email}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="gap-1">
                <Briefcase className="h-3 w-3" />
                {indicacao.vaga_titulo}
              </Badge>
              <Badge className={statusConfig[indicacao.status].color}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig[indicacao.status].label}
              </Badge>
              {indicacao.bonus && indicacao.bonus > 0 && (
                <Badge className="bg-success/20 text-success">
                  <DollarSign className="h-3 w-3 mr-1" />
                  R$ {indicacao.bonus}
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Indicado por <span className="font-medium">{indicacao.indicador_nome}</span> em{' '}
              {format(new Date(indicacao.created_at), 'dd/MM/yyyy', { locale: ptBR })}
            </p>
          </div>
          <div className="shrink-0">
            <Select
              value={indicacao.status}
              onValueChange={value => onStatusChange(indicacao.id, value as IndicacaoStatus)}
            >
              <SelectTrigger className="w-[140px]" aria-label="Alterar status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_analise">Em Análise</SelectItem>
                <SelectItem value="aprovado">Aprovado</SelectItem>
                <SelectItem value="contratado">Contratado</SelectItem>
                <SelectItem value="reprovado">Reprovado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
