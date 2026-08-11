import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--accent))', 'hsl(var(--accent))', 'hsl(var(--accent))', 'hsl(var(--destructive))', 'hsl(var(--success))', 'hsl(var(--info))'];

interface SourceData {
  source: string;
  candidatos: number;
  contratados: number;
  custo: number;
  taxaConversao: number;
}

interface AnalyticsSourcesTabProps {
  data: SourceData[];
}

export function AnalyticsSourcesTab({ data }: AnalyticsSourcesTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" />Efetividade por Fonte</CardTitle>
          <CardDescription>Comparativo de performance das fontes de recrutamento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Fonte</th>
                  <th className="text-right py-3 px-4">Candidatos</th>
                  <th className="text-right py-3 px-4">Contratados</th>
                  <th className="text-right py-3 px-4">Taxa Conversão</th>
                  <th className="text-right py-3 px-4">Custo Total</th>
                  <th className="text-right py-3 px-4">Custo/Contratação</th>
                  <th className="text-right py-3 px-4">ROI</th>
                </tr>
              </thead>
              <tbody>
                {data.map((source, index) => {
                  const custoPorContratacao = source.contratados > 0 ? source.custo / source.contratados : 0;
                  const roi = ((source.contratados * 5000 - source.custo) / source.custo * 100);
                  return (
                    <motion.tr key={source.source} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.05 }} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4 font-medium">{source.source}</td>
                      <td className="text-right py-3 px-4">{source.candidatos}</td>
                      <td className="text-right py-3 px-4">{source.contratados}</td>
                      <td className="text-right py-3 px-4">
                        <Badge variant="secondary" className={cn(source.taxaConversao >= 10 ? "bg-success text-success" : source.taxaConversao >= 5 ? "bg-warning text-warning" : "bg-warning text-warning")}>{source.taxaConversao}%</Badge>
                      </td>
                      <td className="text-right py-3 px-4">R$ {source.custo.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">R$ {custoPorContratacao.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">
                        <span className={cn("font-medium", roi >= 100 ? "text-success" : "text-warning")}>{roi.toFixed(0)}%</span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Distribuição de Candidatos</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="candidatos" nameKey="source" label={(entry) => entry.source}>
                  {data.map((_, index) => (<Cell key={index} fill={COLORS[index % COLORS.length]} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Taxa de Conversão por Fonte</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" unit="%" /><YAxis dataKey="source" type="category" width={80} /><Tooltip />
                <Bar dataKey="taxaConversao" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Conversão" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
