import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, AlertTriangle, Users, Clock, Calendar, Zap } from 'lucide-react';

interface Props {
  stats: {
    totalVagas: number;
    vagasUrgentes: number;
    totalCandidatos: number;
    pendentesAvaliacao: number;
    entrevistasHoje: number;
    tempoMedioContratacao: number;
  };
}

export function HiringManagerStats({ stats }: Props) {
  const cards = [
    { icon: Briefcase, label: 'Minhas Vagas', value: stats.totalVagas, color: 'text-primary' },
    { icon: AlertTriangle, label: 'Urgentes', value: stats.vagasUrgentes, color: 'text-warning', highlight: stats.vagasUrgentes > 0 },
    { icon: Users, label: 'Em Processo', value: stats.totalCandidatos, color: 'text-success' },
    { icon: Clock, label: 'Pendentes', value: stats.pendentesAvaliacao, color: 'text-warning', highlight: stats.pendentesAvaliacao > 0 },
    { icon: Calendar, label: 'Entrevistas Hoje', value: stats.entrevistasHoje, color: 'text-accent-foreground' },
    { icon: Zap, label: 'Tempo Médio', value: `${stats.tempoMedioContratacao}d`, color: 'text-primary' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map(({ icon: Icon, label, value, color, highlight }) => (
        <Card key={label} className={highlight ? 'border-warning/30 bg-warning/5' : ''}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Icon className={`h-5 w-5 ${color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-xl font-bold">{value}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
