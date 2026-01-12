/**
 * @fileoverview Candidate Activity Heatmap Component
 * Shows candidate activity patterns across time periods
 */

import { memo, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Activity } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeatmapCell {
  date: string;
  value: number;
  label?: string;
}

interface CandidateHeatmapProps {
  data?: HeatmapCell[];
  title?: string;
  weeks?: number;
  colorScale?: string[];
  className?: string;
}

const defaultColorScale = [
  "bg-muted/30",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/60",
  "bg-primary/80",
  "bg-primary",
];

const DAYS_OF_WEEK = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// Generate mock data for demo
function generateMockData(weeks: number): HeatmapCell[] {
  const data: HeatmapCell[] = [];
  const today = new Date();
  
  for (let i = weeks * 7 - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate activity patterns (more on weekdays)
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseValue = isWeekend ? Math.random() * 3 : Math.random() * 10;
    const value = Math.floor(baseValue);
    
    const dateStr = date.toISOString().split('T')[0];
    if (dateStr) {
      data.push({
        date: dateStr,
        value,
        label: `${value} atividades`,
      });
    }
  }
  
  return data;
}

export const CandidateHeatmap = memo(function CandidateHeatmap({
  data,
  title = "Atividade de Candidatos",
  weeks = 12,
  colorScale = defaultColorScale,
  className,
}: CandidateHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);
  
  const heatmapData = useMemo(() => data || generateMockData(weeks), [data, weeks]);
  
  const maxValue = useMemo(() => 
    Math.max(...heatmapData.map(d => d.value), 1), [heatmapData]
  );
  
  const getColorClass = (value: number) => {
    if (value === 0) return colorScale[0];
    const index = Math.min(
      Math.ceil((value / maxValue) * (colorScale.length - 1)),
      colorScale.length - 1
    );
    return colorScale[index];
  };
  
  // Organize data into weeks
  const weeksData = useMemo(() => {
    const result: HeatmapCell[][] = [];
    for (let i = 0; i < heatmapData.length; i += 7) {
      result.push(heatmapData.slice(i, i + 7));
    }
    return result;
  }, [heatmapData]);
  
  const totalActivity = useMemo(() => 
    heatmapData.reduce((sum, d) => sum + d.value, 0), [heatmapData]
  );
  
  const avgActivity = useMemo(() => 
    Math.round(totalActivity / heatmapData.length), [totalActivity, heatmapData.length]
  );
  
  const peakDay = useMemo(() => {
    const dayTotals = Array(7).fill(0);
    heatmapData.forEach((d, i) => {
      dayTotals[i % 7] += d.value;
    });
    const maxIndex = dayTotals.indexOf(Math.max(...dayTotals));
    return DAYS_OF_WEEK[maxIndex];
  }, [heatmapData]);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <Activity className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                Últimas {weeks} semanas
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-lg font-bold text-primary">{totalActivity}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Média/dia</p>
              <p className="text-lg font-bold">{avgActivity}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Pico</p>
              <p className="text-lg font-bold text-accent">{peakDay}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex gap-2">
          {/* Day labels */}
          <div className="flex flex-col gap-0.5 pr-2 pt-5">
            {DAYS_OF_WEEK.map((day, i) => (
              <div 
                key={day} 
                className={cn(
                  "text-xs text-muted-foreground h-4 flex items-center",
                  i % 2 !== 0 && "invisible"
                )}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="flex-1 overflow-x-auto">
            <div className="flex gap-0.5">
              {weeksData.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-0.5">
                  {/* Month label for first week of month */}
                  <div className="h-4 text-xs text-muted-foreground">
                    {weekIndex === 0 || (week[0] && new Date(week[0].date).getDate() <= 7) ? (
                      <span>
                        {week[0] && new Date(week[0].date).toLocaleDateString('pt-BR', { month: 'short' })}
                      </span>
                    ) : null}
                  </div>
                  
                  {/* Week cells */}
                  {week.map((cell, dayIndex) => (
                    <Tooltip key={dayIndex}>
                      <TooltipTrigger asChild>
                        <motion.div
                          className={cn(
                            "w-4 h-4 rounded-sm cursor-pointer transition-all",
                            getColorClass(cell.value),
                            hoveredCell?.date === cell.date && "ring-2 ring-primary ring-offset-1"
                          )}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: weekIndex * 0.02 + dayIndex * 0.01 }}
                          whileHover={{ scale: 1.3 }}
                          onHoverStart={() => setHoveredCell(cell)}
                          onHoverEnd={() => setHoveredCell(null)}
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" className="text-xs">
                        <div className="flex flex-col gap-1">
                          <span className="font-medium">
                            {new Date(cell.date).toLocaleDateString('pt-BR', {
                              weekday: 'long',
                              day: 'numeric',
                              month: 'long'
                            })}
                          </span>
                          <span className="text-muted-foreground">
                            {cell.value} {cell.value === 1 ? 'atividade' : 'atividades'}
                          </span>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
          <span>Menos</span>
          <div className="flex gap-0.5">
            {colorScale.map((color, i) => (
              <div
                key={i}
                className={cn("w-3 h-3 rounded-sm", color)}
              />
            ))}
          </div>
          <span>Mais</span>
        </div>
      </CardContent>
    </Card>
  );
});

interface MiniHeatmapProps {
  data?: number[];
  days?: number;
  className?: string;
}

export const MiniHeatmap = memo(function MiniHeatmap({
  data,
  days = 30,
  className,
}: MiniHeatmapProps) {
  const heatmapData = useMemo(() => {
    if (data) return data;
    return Array.from({ length: days }, () => Math.floor(Math.random() * 10));
  }, [data, days]);
  
  const maxValue = Math.max(...heatmapData, 1);
  
  return (
    <div className={cn("flex gap-px", className)}>
      {heatmapData.map((value, i) => {
        const intensity = value / maxValue;
        return (
          <motion.div
            key={i}
            className="w-1.5 h-4 rounded-sm"
            style={{
              backgroundColor: `hsl(var(--primary) / ${Math.max(0.1, intensity)})`,
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: i * 0.02 }}
          />
        );
      })}
    </div>
  );
});

CandidateHeatmap.displayName = 'CandidateHeatmap';
MiniHeatmap.displayName = 'MiniHeatmap';
