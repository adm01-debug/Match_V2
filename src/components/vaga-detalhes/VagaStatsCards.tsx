import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Clock, Calendar, CheckCircle2, Briefcase } from 'lucide-react';

interface VagaStatsCardsProps {
  stats: {
    total: number;
    emTriagem: number;
    emEntrevista: number;
    aprovados: number;
  };
  quantidade: number;
}

export const VagaStatsCards = memo(function VagaStatsCards({ stats, quantidade }: VagaStatsCardsProps) {
  const items = [
    { label: "Candidatos", value: stats.total, icon: Users, color: "text-blue-500" },
    { label: "Em Triagem", value: stats.emTriagem, icon: Clock, color: "text-amber-500" },
    { label: "Em Entrevista", value: stats.emEntrevista, icon: Calendar, color: "text-purple-500" },
    { label: "Aprovados", value: stats.aprovados, icon: CheckCircle2, color: "text-green-500" },
    { label: "Vagas", value: quantidade, icon: Briefcase, color: "text-gray-500" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <item.icon className={`h-5 w-5 ${item.color}`} />
              <div>
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});
