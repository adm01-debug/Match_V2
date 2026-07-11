import { Card, CardContent } from '@/components/ui/card';
import { Users, Clock, Trophy, DollarSign } from 'lucide-react';

interface Props {
  total: number;
  emAnalise: number;
  contratados: number;
  bonusTotal: number;
}

export function IndicacoesStats({ total, emAnalise, contratados, bonusTotal }: Props) {
  const items = [
    { label: 'Total Indicações', value: total, Icon: Users, color: 'primary' },
    { label: 'Em Análise', value: emAnalise, Icon: Clock, color: 'warning' },
    { label: 'Contratados', value: contratados, Icon: Trophy, color: 'success' },
    {
      label: 'Bônus Pagos',
      value: `R$ ${bonusTotal.toLocaleString('pt-BR')}`,
      Icon: DollarSign,
      color: 'success',
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {items.map(({ label, value, Icon, color }) => (
        <Card key={label} className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="p-4 flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-${color}/20`}>
              <Icon className={`h-5 w-5 text-${color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
