import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ComposedChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import { Clock, DollarSign, Briefcase } from 'lucide-react';

interface PerformanceTabProps {
  timeToHireData: Array<{ mes: string; tempo: number; meta: number }>;
  costPerHireData: Array<{ mes: string; custo: number; vagas: number }>;
  departmentData: Array<{ departamento: string; vagas: number; preenchidas: number; tempoMedio: number; custoMedio: number }>;
}

export function AnalyticsPerformanceTab({ timeToHireData, costPerHireData, departmentData }: PerformanceTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Time to Hire (dias)</CardTitle>
            <CardDescription>Tempo médio de contratação por mês</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={timeToHireData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" /><YAxis /><Tooltip /><Legend />
                <Bar dataKey="tempo" fill="hsl(var(--primary))" name="Tempo Real" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="meta" stroke="hsl(var(--success))" strokeDasharray="5 5" name="Meta" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><DollarSign className="h-5 w-5" />Cost per Hire (R$)</CardTitle>
            <CardDescription>Custo médio por contratação</CardDescription>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costPerHireData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" /><YAxis /><Tooltip formatter={(value) => `R$ ${Number(value).toLocaleString()}`} /><Legend />
                <Area type="monotone" dataKey="custo" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.3} name="Custo" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Briefcase className="h-5 w-5" />Performance por Departamento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {departmentData.map((dept, index) => (
              <motion.div key={dept.departamento} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="p-4 rounded-xl border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{dept.departamento}</h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-muted-foreground" />{dept.tempoMedio}d</span>
                    <span className="flex items-center gap-1"><DollarSign className="h-4 w-4 text-muted-foreground" />R$ {dept.custoMedio.toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Progress value={(dept.preenchidas / dept.vagas) * 100} className="flex-1 h-2" />
                  <span className="text-sm font-medium">{dept.preenchidas}/{dept.vagas} vagas</span>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
