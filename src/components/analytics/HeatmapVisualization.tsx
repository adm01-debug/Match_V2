/**
 * Heatmap Visualization Component
 * Shows activity distribution in a calendar-like grid
 */
import { motion } from 'framer-motion';
import { format, subDays, startOfWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeatmapData {
  date: string; // YYYY-MM-DD
  count: number;
  label?: string;
}

interface HeatmapVisualizationProps {
  data: HeatmapData[];
  title?: string;
  weeks?: number;
  colorScale?: string[];
  className?: string;
}

const defaultColorScale = [
  'bg-muted/30',
  'bg-primary/20',
  'bg-primary/40',
  'bg-primary/60',
  'bg-primary/80',
  'bg-primary',
];

export function HeatmapVisualization({
  data,
  title = 'Atividade',
  weeks = 12,
  colorScale = defaultColorScale,
  className,
}: HeatmapVisualizationProps) {
  // Generate dates for the heatmap
  const today = new Date();
  const startDate = startOfWeek(subDays(today, weeks * 7), { weekStartsOn: 0 });
  
  // Create data map for quick lookup
  const dataMap = new Map(data.map(d => [d.date, d]));
  
  // Calculate max for scaling
  const maxCount = Math.max(...data.map(d => d.count), 1);
  
  // Generate weeks and days
  const weeksArray: { date: Date; data: HeatmapData | undefined }[][] = [];
  let currentDate = startDate;
  
  for (let w = 0; w < weeks; w++) {
    const week: { date: Date; data: HeatmapData | undefined }[] = [];
    for (let d = 0; d < 7; d++) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      week.push({
        date: currentDate,
        data: dataMap.get(dateStr),
      });
      currentDate = addDays(currentDate, 1);
    }
    weeksArray.push(week);
  }
  
  // Get color based on count
  const getColor = (count: number | undefined) => {
    if (!count || count === 0) return colorScale[0];
    const ratio = count / maxCount;
    const index = Math.min(
      Math.floor(ratio * (colorScale.length - 1)) + 1,
      colorScale.length - 1
    );
    return colorScale[index];
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <Card variant="glass" className={className}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Activity className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 pr-2">
            {weekDays.map((day, i) => (
              <div
                key={day}
                className={cn(
                  "h-3 w-6 text-[9px] text-muted-foreground",
                  i % 2 === 0 ? 'visible' : 'invisible'
                )}
              >
                {day}
              </div>
            ))}
          </div>
          
          {/* Heatmap grid */}
          <div className="flex gap-1 overflow-x-auto">
            {weeksArray.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day, dayIndex) => (
                  <Tooltip key={dayIndex}>
                    <TooltipTrigger asChild>
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          delay: (weekIndex * 7 + dayIndex) * 0.003,
                          type: 'spring',
                          stiffness: 300,
                        }}
                        className={cn(
                          "h-3 w-3 rounded-sm cursor-pointer",
                          "transition-all duration-200 hover:scale-125",
                          getColor(day.data?.count),
                          day.date > today && 'opacity-30'
                        )}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">
                        {format(day.date, "d 'de' MMMM", { locale: ptBR })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {day.data?.count || 0} {day.data?.label || 'atividades'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-muted-foreground">
          <span>Menos</span>
          {colorScale.map((color, i) => (
            <div key={i} className={cn("h-3 w-3 rounded-sm", color)} />
          ))}
          <span>Mais</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default HeatmapVisualization;
