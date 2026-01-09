/**
 * @fileoverview Premium FunilChart component
 * @module FunilChart
 */

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FunilEtapa } from "@/types/recruitment";
import { TrendingDown, Users } from "lucide-react";

interface FunilChartProps {
  data: FunilEtapa[];
}

const stageColors = [
  "from-info to-info/80",
  "from-accent to-accent/80", 
  "from-warning to-warning/80",
  "from-stage-teste to-stage-teste/80",
  "from-success to-success/80",
  "from-stage-aprovado to-stage-aprovado/80",
  "from-primary to-primary/80",
];

export const FunilChart = memo(function FunilChart({ data }: FunilChartProps) {
  const maxQuantidade = useMemo(() => 
    Math.max(...data.map((d) => d.quantidade), 1),
    [data]
  );

  const chartData = useMemo(() => 
    data.map((item, index) => {
      const prevItem = index > 0 ? data[index - 1] : null;
      return {
        ...item,
        width: (item.quantidade / maxQuantidade) * 100,
        color: stageColors[index % stageColors.length],
        conversionRate: prevItem ? Math.round((item.quantidade / prevItem.quantidade) * 100) : 100
      };
    }),
    [data, maxQuantidade]
  );

  const totalCandidatos = data[0]?.quantidade || 0;
  const totalContratados = data[data.length - 1]?.quantidade || 0;
  const taxaConversaoTotal = totalCandidatos > 0 
    ? Math.round((totalContratados / totalCandidatos) * 100) 
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <Card className="h-full border-border/50 shadow-elevated overflow-hidden">
        {/* Header accent */}
        <div className="h-1 bg-gradient-to-r from-info via-accent via-warning via-success to-primary" />
        
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-accent/10">
                <TrendingDown className="h-5 w-5 text-accent" />
              </div>
              <CardTitle className="text-base font-semibold">Funil de Recrutamento</CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-bold text-foreground">{taxaConversaoTotal}%</p>
                <p className="text-xs text-muted-foreground">Taxa de conversão</p>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {chartData.map((item, index) => (
            <motion.div 
              key={item.etapa} 
              className="space-y-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <div data-testid="funil-chart" className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{item.etapa}</span>
                  {index > 0 && item.conversionRate < 50 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-warning/10 text-warning font-medium">
                      {item.conversionRate}% conv.
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="font-bold text-foreground tabular-nums">{item.quantidade}</span>
                </div>
              </div>
              
              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${item.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.width}%` }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                />
                
                {/* Shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "200%" }}
                  transition={{ duration: 1.5, delay: index * 0.1 + 0.6, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          ))}

          {/* Summary footer */}
          <motion.div 
            className="pt-4 mt-4 border-t border-border/50 flex items-center justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-info to-primary" />
              <span>{totalCandidatos} candidatos → {totalContratados} contratados</span>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

FunilChart.displayName = "FunilChart";
