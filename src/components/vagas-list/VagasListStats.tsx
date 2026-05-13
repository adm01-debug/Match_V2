import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Users, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VagasListStatsProps {
  counts: {
    publicada: number;
    totalCandidatos: number;
    emProcesso: number;
    urgentes: number;
  };
}

export const VagasListStats = memo(function VagasListStats({ counts }: VagasListStatsProps) {
  const stats = [
    { icon: Briefcase, value: counts.publicada, label: "Vagas Abertas", color: "from-primary/20 to-primary/5 text-primary", iconBg: "bg-primary/10" },
    { icon: Users, value: counts.totalCandidatos, label: "Total Candidatos", color: "from-accent/20 to-accent/5 text-accent", iconBg: "bg-accent/10" },
    { icon: Target, value: counts.emProcesso, label: "Em Processo", color: "from-success/20 to-success/5 text-success", iconBg: "bg-success/10" },
    { icon: TrendingUp, value: counts.urgentes, label: "Urgentes", color: "from-warning/20 to-warning/5 text-warning", iconBg: "bg-warning/10" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card className={cn("border-0 bg-gradient-to-br shadow-sm", stat.color)}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn("p-3 rounded-xl", stat.iconBg)}><stat.icon className="h-5 w-5" /></div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
});
