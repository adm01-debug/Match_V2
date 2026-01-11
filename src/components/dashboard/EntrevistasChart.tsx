/**
 * @fileoverview Premium EntrevistasChart component
 * @module EntrevistasChart
 */

import { memo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Sparkles } from 'lucide-react';
import { useEntrevistasEvolucao, useEntrevistasPizza } from '@/hooks/useEntrevistas';

interface TooltipPayloadItem {
  color: string;
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <motion.div 
        data-testid="entrevistas-chart" 
        className="bg-card/95 backdrop-blur-lg border border-border/50 rounded-xl shadow-xl p-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <p className="font-semibold text-sm mb-2 text-foreground">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold" style={{ color: entry.color }}>
              {entry.value}
            </span>
          </div>
        ))}
      </motion.div>
    );
  }
  return null;
};

const EntrevistasChartComponent = memo(function EntrevistasChart() {
  const { data: evolucaoData, isLoading: loadingEvolucao } = useEntrevistasEvolucao();
  const { data: pizzaData, isLoading: loadingPizza } = useEntrevistasPizza();

  const isLoading = loadingEvolucao || loadingPizza;

  if (isLoading) {
    return (
      <Card variant="premium" className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            Evolução de Entrevistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[320px] w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  const chartData = evolucaoData || [];
  const pieData = pizzaData || [
    { name: 'Aprovados', value: 0, color: 'hsl(var(--success))' },
    { name: 'Reprovados', value: 0, color: 'hsl(var(--destructive))' },
    { name: 'Pendentes', value: 0, color: 'hsl(var(--warning))' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 24 }}
    >
      <Card variant="premium" hover="lift" className="h-full">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5"
                whileHover={{ scale: 1.05, rotate: 5 }}
              >
                <TrendingUp className="h-5 w-5 text-primary" />
              </motion.div>
              <div>
                <CardTitle className="text-base font-semibold">Evolução de Entrevistas</CardTitle>
                <p className="text-xs text-muted-foreground">Últimos 6 meses</p>
              </div>
            </div>
            <Badge variant="glass-primary" size="sm" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Atualizado
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="area" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 bg-muted/50 p-1 rounded-xl">
              <TabsTrigger value="area" className="rounded-lg flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <BarChart3 className="h-4 w-4" />
                Evolução
              </TabsTrigger>
              <TabsTrigger value="pizza" className="rounded-lg flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
                <PieChartIcon className="h-4 w-4" />
                Distribuição
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="area" className="mt-0">
              {chartData.length === 0 ? (
                <div className="h-[280px] flex flex-col items-center justify-center text-muted-foreground">
                  <div className="p-4 rounded-full bg-muted/50 mb-3">
                    <BarChart3 className="h-8 w-8" />
                  </div>
                  <p>Nenhum dado de entrevistas realizadas</p>
                </div>
              ) : (
                <>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorAprovados" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorReprovados" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" strokeOpacity={0.5} />
                        <XAxis 
                          dataKey="mes" 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <YAxis 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                          axisLine={{ stroke: 'hsl(var(--border))' }}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey="aprovados" 
                          name="Aprovados"
                          stroke="hsl(var(--success))" 
                          strokeWidth={2.5}
                          fill="url(#colorAprovados)"
                          dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, strokeWidth: 2 }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="reprovados" 
                          name="Reprovados"
                          stroke="hsl(var(--destructive))" 
                          strokeWidth={2.5}
                          fill="url(#colorReprovados)"
                          dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, strokeWidth: 2 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="total" 
                          name="Total"
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-6 mt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-success shadow-[0_0_8px_hsl(var(--success)/0.5)]" />
                      <span className="text-sm text-muted-foreground">Aprovados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-destructive shadow-[0_0_8px_hsl(var(--destructive)/0.5)]" />
                      <span className="text-sm text-muted-foreground">Reprovados</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-0.5 bg-primary" style={{ borderStyle: 'dashed' }} />
                      <span className="text-sm text-muted-foreground">Total</span>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
            
            <TabsContent value="pizza" className="mt-0">
              {pieData.every(d => d.value === 0) ? (
                <div className="h-[280px] flex flex-col items-center justify-center text-muted-foreground">
                  <div className="p-4 rounded-full bg-muted/50 mb-3">
                    <PieChartIcon className="h-8 w-8" />
                  </div>
                  <p>Nenhum dado de entrevistas realizadas</p>
                </div>
              ) : (
                <>
                  <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={70}
                          outerRadius={110}
                          paddingAngle={4}
                          dataKey="value"
                          labelLine={false}
                        >
                          {pieData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.color}
                              stroke="hsl(var(--background))"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number, name: string) => [value, name]}
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '12px',
                            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.2)'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Summary Cards */}
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {pieData.map((item, index) => (
                      <motion.div 
                        key={item.name} 
                        className="p-3 rounded-xl text-center border"
                        style={{ 
                          background: `linear-gradient(135deg, ${item.color}15, ${item.color}05)`,
                          borderColor: `${item.color}30`
                        }}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <motion.div 
                          className="text-xl font-bold" 
                          style={{ color: item.color }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.2, type: 'spring' as const }}
                        >
                          {item.value}
                        </motion.div>
                        <div className="text-xs text-muted-foreground font-medium">{item.name}</div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
});

EntrevistasChartComponent.displayName = "EntrevistasChart";

export const EntrevistasChart = EntrevistasChartComponent;
export default EntrevistasChart;
