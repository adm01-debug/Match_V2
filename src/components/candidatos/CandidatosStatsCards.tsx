import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck, UserX, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, Variants } from 'framer-motion';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

interface QuickStats {
  novos: number;
  emProcesso: number;
  aprovados: number;
  reprovados: number;
}

interface CandidatosStatsCardsProps {
  quickStats: QuickStats;
}

export const CandidatosStatsCards = memo(function CandidatosStatsCards({ quickStats }: CandidatosStatsCardsProps) {
  const stats = [
    { icon: Users, label: 'Novos', value: quickStats.novos, color: 'info' },
    { icon: Clock, label: 'Em Processo', value: quickStats.emProcesso, color: 'warning' },
    { icon: UserCheck, label: 'Aprovados', value: quickStats.aprovados, color: 'success' },
    { icon: UserX, label: 'Reprovados', value: quickStats.reprovados, color: 'destructive' },
  ] as const;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      {stats.map((stat) => (
        <motion.div key={stat.label} variants={itemVariants}>
          <Card variant="glass" hover="lift" className="group overflow-hidden">
            <CardContent className="p-4 md:p-5 relative">
              <div className={cn(
                "absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 -translate-y-1/2 translate-x-1/2",
                stat.color === 'info' && "bg-info",
                stat.color === 'warning' && "bg-warning",
                stat.color === 'success' && "bg-success",
                stat.color === 'destructive' && "bg-destructive"
              )} />
              <div className="flex items-center gap-3 relative">
                <div className={cn(
                  "p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110",
                  stat.color === 'info' && "bg-info/10 text-info",
                  stat.color === 'warning' && "bg-warning/10 text-warning",
                  stat.color === 'success' && "bg-success/10 text-success",
                  stat.color === 'destructive' && "bg-destructive/10 text-destructive"
                )}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl md:text-3xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
});
