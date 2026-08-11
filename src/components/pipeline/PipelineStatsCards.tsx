import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Users, TrendingUp, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PipelineStats {
  total: number;
  emAndamento: number;
  contratados: number;
  reprovados: number;
}

interface PipelineStatsCardsProps {
  stats: PipelineStats;
}

const statItems = [
  { label: "Total em Processo", key: 'total' as const, icon: Users, color: "from-primary/20 to-primary/5", iconColor: "text-primary" },
  { label: "Em Andamento", key: 'emAndamento' as const, icon: TrendingUp, color: "from-info/20 to-info/5", iconColor: "text-info" },
  { label: "Contratados", key: 'contratados' as const, icon: CheckCircle2, color: "from-success/20 to-success/5", iconColor: "text-success" },
  { label: "Reprovados", key: 'reprovados' as const, icon: XCircle, color: "from-destructive/20 to-destructive/5", iconColor: "text-destructive" },
] as const;

export const PipelineStatsCards = memo(function PipelineStatsCards({ stats }: PipelineStatsCardsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {statItems.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.05 }}
        >
          <Card className={cn(
            "relative overflow-hidden border-border/50 bg-gradient-to-br backdrop-blur-sm",
            stat.color,
            "hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
          )}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stats[stat.key]}</p>
                </div>
                <div className={cn("p-3 rounded-xl bg-background/50 backdrop-blur-sm", stat.iconColor)}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
});
