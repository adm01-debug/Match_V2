import { memo, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Users, Target, UserCheck } from 'lucide-react';
import { KPICard } from "@/components/dashboard/KPICard";
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardKPIsProps {
  kpis: any;
}

export const DashboardKPIs = memo(function DashboardKPIs({ kpis }: DashboardKPIsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
    >
      <Suspense fallback={<Skeleton className="h-44 rounded-2xl" />}>
        <KPICard title="Vagas Abertas" value={kpis.vagasAbertas} subtitle={`+${kpis.vagasNovas} novas`} icon={Briefcase} variant="primary" trend={kpis.vagasNovas > 0 ? { value: `+${kpis.vagasNovas}`, positive: true } : undefined} index={0} />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-44 rounded-2xl" />}>
        <KPICard title="Candidatos" value={kpis.candidatosTotal} subtitle={`+${kpis.candidatosNovos} novos`} icon={Users} variant="primary" trend={kpis.candidatosNovos > 0 ? { value: `+${kpis.candidatosNovos}`, positive: true } : undefined} index={1} />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-44 rounded-2xl" />}>
        <KPICard title="Em Processo" value={kpis.emProcesso} subtitle={`${kpis.vagasEmProcesso} vagas`} icon={Target} variant="warning" index={2} />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-44 rounded-2xl" />}>
        <KPICard title="Contratados" value={kpis.contratadosMes} subtitle={`${Math.round((kpis.contratadosMes / Math.max(kpis.metaContratacao, 1)) * 100)}% da meta`} icon={UserCheck} variant="success" index={3} />
      </Suspense>
    </motion.div>
  );
});
