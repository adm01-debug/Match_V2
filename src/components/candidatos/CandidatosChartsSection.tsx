import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendingUp, PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { motion } from 'framer-motion';
import { Candidato, getStatusConfig, statusOptions } from '@/types/candidate';
import { subDays, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CandidatosChartsSectionProps {
  candidatos: Candidato[];
}

export function CandidatosChartsSection({ candidatos }: CandidatosChartsSectionProps) {
  const statusStats = useMemo(() => {
    const counts: Record<string, number> = {};
    candidatos.forEach(c => {
      const status = c.status || 'novo';
      counts[status] = (counts[status] || 0) + 1;
    });
    
    return statusOptions
      .filter(opt => opt.value !== 'todos')
      .map(opt => ({
        name: opt.label,
        value: counts[opt.value] || 0,
        color: getStatusConfig(opt.value).chartColor,
      }))
      .filter(item => item.value > 0);
  }, [candidatos]);

  const evolutionData = useMemo(() => {
    const last30Days: { date: string; label: string; count: number; accumulated: number }[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      last30Days.push({
        date: format(date, 'yyyy-MM-dd'),
        label: format(date, 'dd/MM', { locale: ptBR }),
        count: 0,
        accumulated: 0,
      });
    }
    
    candidatos.forEach(c => {
      if (!c.created_at) return;
      const candidatoDate = format(new Date(c.created_at), 'yyyy-MM-dd');
      const dayData = last30Days.find(d => d.date === candidatoDate);
      if (dayData) {
        dayData.count++;
      }
    });
    
    let accumulatedCount = candidatos.filter(c => {
      if (!c.created_at) return true;
      const candidatoDate = new Date(c.created_at);
      return candidatoDate < subDays(today, 29);
    }).length;
    
    last30Days.forEach(day => {
      accumulatedCount += day.count;
      day.accumulated = accumulatedCount;
    });
    
    return last30Days.filter((_, i) => i % 3 === 0 || i === last30Days.length - 1);
  }, [candidatos]);

  if (candidatos.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="grid grid-cols-1 lg:grid-cols-3 gap-4"
    >
      <Card variant="glass" className="lg:col-span-2 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Evolução de Candidatos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolutionData}>
                <defs>
                  <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="accumulated" name="Total Acumulado" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorAcc)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card variant="glass" className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <PieChartIcon className="h-4 w-4 text-primary" />
            Distribuição por Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}