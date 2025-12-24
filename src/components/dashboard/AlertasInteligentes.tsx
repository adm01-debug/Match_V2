import { memo , memo} from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Clock, UserX, Calendar, AlertCircle, ChevronRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Alerta {
  id: string;
  tipo: 'urgente' | 'atencao' | 'info';
  categoria: 'candidato' | 'prazo' | 'processo' | 'meta';
  titulo: string;
  descricao: string;
  quantidade?: number;
  tempoRestante?: string;
}

interface AlertasInteligentesProps {
  acoesPendentes: {
    tipo: string;
    quantidade: number;
    descricao: string;
    alerta: boolean;
  }[];
  vagasUrgentes: {
    titulo: string;
    diasAberta: number;
    prioridade: string;
  }[];
}

const tipoConfig = {
  urgente: {
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/30',
    badgeClass: 'bg-red-500 text-white',
  },
  atencao: {
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30',
    badgeClass: 'bg-amber-500 text-white',
  },
  info: {
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    badgeClass: 'bg-blue-500 text-white',
  },
};

const categoriaIcon = {
  candidato: UserX,
  prazo: Clock,
  processo: Calendar,
  meta: AlertCircle,
};

function generateAlertas(
  acoesPendentes: AlertasInteligentesProps['acoesPendentes'],
  vagasUrgentes: AlertasInteligentesProps['vagasUrgentes']
): Alerta[] {
  const alertas: Alerta[] = [];

  // Alertas de ações pendentes
  const feedbackPendente = acoesPendentes.find(a => a.tipo === 'feedback');
  if (feedbackPendente && feedbackPendente.quantidade > 5) {
    alertas.push({
      id: 'feedback-urgente',
      tipo: 'urgente',
      categoria: 'candidato',
      titulo: 'Candidatos aguardando feedback',
      descricao: `${feedbackPendente.quantidade} candidatos há mais de 3 dias sem retorno. Isso impacta a experiência.`,
      quantidade: feedbackPendente.quantidade,
    });
  }

  // Alertas de vagas
  const vagasMuitoAbertas = vagasUrgentes.filter(v => v.diasAberta > 15);
  if (vagasMuitoAbertas.length > 0) {
    alertas.push({
      id: 'vagas-abertas',
      tipo: 'atencao',
      categoria: 'prazo',
      titulo: 'Vagas abertas há muito tempo',
      descricao: `${vagasMuitoAbertas.length} vaga(s) abertas há mais de 15 dias. Considere revisar requisitos.`,
      quantidade: vagasMuitoAbertas.length,
    });
  }

  // Alerta de prioridade
  const vagasUrgentesCount = vagasUrgentes.filter(v => v.prioridade === 'urgente').length;
  if (vagasUrgentesCount > 0) {
    alertas.push({
      id: 'vagas-urgentes',
      tipo: 'urgente',
      categoria: 'processo',
      titulo: 'Vagas com prioridade urgente',
      descricao: `${vagasUrgentesCount} vaga(s) marcadas como urgentes precisam de atenção imediata.`,
      quantidade: vagasUrgentesCount,
    });
  }

  // Alerta de propostas
  const propostaPendente = acoesPendentes.find(a => a.tipo === 'proposta');
  if (propostaPendente && propostaPendente.quantidade > 0) {
    alertas.push({
      id: 'propostas',
      tipo: 'atencao',
      categoria: 'candidato',
      titulo: 'Propostas aguardando resposta',
      descricao: `${propostaPendente.quantidade} candidato(s) ainda não responderam. Faça follow-up.`,
      quantidade: propostaPendente.quantidade,
    });
  }

  // Alerta de entrevistas
  const entrevistasAgendar = acoesPendentes.find(a => a.tipo === 'agendar');
  if (entrevistasAgendar && entrevistasAgendar.quantidade > 5) {
    alertas.push({
      id: 'entrevistas',
      tipo: 'info',
      categoria: 'processo',
      titulo: 'Entrevistas para agendar',
      descricao: `${entrevistasAgendar.quantidade} entrevistas pendentes de agendamento.`,
      quantidade: entrevistasAgendar.quantidade,
    });
  }

  return alertas.slice(0, 4);
}

export function AlertasInteligentes({ acoesPendentes, vagasUrgentes }: AlertasInteligentesProps) {
  const alertas = generateAlertas(acoesPendentes, vagasUrgentes);

  if (alertas.length === 0) {
    return (
      <Card role="article" aria-label="Alertas inteligentes">
        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
          <div data-testid="alertas-inteligentes" className="p-3 rounded-full bg-emerald-500/10 mb-3">
            <Zap className="h-6 w-6 text-emerald-500" />
          </div>
          <p className="font-medium text-foreground">Tudo em dia!</p>
          <p className="text-sm text-muted-foreground">Nenhum alerta no momento.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="h-5 w-5 text-primary" />
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-red-500 border-2 border-background flex items-center justify-center text-[9px] font-bold text-white">
                {alertas.length}
              </span>
            </div>
            <CardTitle className="text-base font-semibold">Alertas Inteligentes</CardTitle>
          </div>
          <Button variant="ghost" size="sm" className="text-xs h-7">
            Ver todos
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {alertas.map((alerta) => {
          const config = tipoConfig[alerta.tipo];
          const Icon = categoriaIcon[alerta.categoria];

          return (
            <div
              key={alerta.id}
              className={cn(
                "p-3 rounded-lg border transition-all hover:shadow-sm cursor-pointer group",
                config.bgColor,
                config.borderColor
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("p-1.5 rounded-lg shrink-0", config.bgColor)}>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{alerta.titulo}</span>
                    {alerta.quantidade && (
                      <Badge className={cn("text-[10px] px-1.5 py-0", config.badgeClass)}>
                        {alerta.quantidade}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {alerta.descricao}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
