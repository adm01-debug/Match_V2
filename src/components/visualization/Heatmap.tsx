/**
 * @fileoverview Premium Heatmap components for data intensity visualization
 * @module Heatmap
 */

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HeatmapCell {
  x: number;
  y: number;
  value: number;
  label?: string;
}

interface HeatmapProps {
  data: HeatmapCell[];
  rows: number;
  cols: number;
  cellSize?: number;
  gap?: number;
  colorScale?: string[];
  showLabels?: boolean;
  animated?: boolean;
  onCellClick?: (cell: HeatmapCell) => void;
  xLabels?: string[];
  yLabels?: string[];
  className?: string;
}

const defaultColorScale = [
  "hsl(var(--muted))",
  "hsl(var(--info) / 0.3)",
  "hsl(var(--info) / 0.5)",
  "hsl(var(--warning) / 0.5)",
  "hsl(var(--warning) / 0.7)",
  "hsl(var(--destructive) / 0.7)",
  "hsl(var(--destructive))",
];

export const Heatmap = memo(function Heatmap({
  data,
  rows,
  cols,
  cellSize = 32,
  gap = 2,
  colorScale = defaultColorScale,
  showLabels = false,
  animated = true,
  onCellClick,
  xLabels,
  yLabels,
  className,
}: HeatmapProps) {
  const { grid, maxValue, minValue } = useMemo(() => {
    const gridData: (HeatmapCell | null)[][] = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(null));

    let max = -Infinity;
    let min = Infinity;

    data.forEach((cell) => {
      if (cell.y < rows && cell.x < cols) {
        const row = gridData[cell.y];
        if (row) {
          row[cell.x] = cell;
        }
        max = Math.max(max, cell.value);
        min = Math.min(min, cell.value);
      }
    });

    return { grid: gridData, maxValue: max, minValue: min };
  }, [data, rows, cols]);

  const getColor = (value: number) => {
    if (maxValue === minValue) return colorScale[0] ?? "hsl(var(--muted))";
    const ratio = (value - minValue) / (maxValue - minValue);
    const index = Math.min(
      Math.floor(ratio * (colorScale.length - 1)),
      colorScale.length - 1
    );
    return colorScale[index] ?? "hsl(var(--muted))";
  };

  return (
    <TooltipProvider>
      <div className={cn("inline-block", className)}>
        {xLabels && (
          <div
            className="flex text-xs text-muted-foreground mb-1"
            style={{ marginLeft: yLabels ? 60 : 0 }}
          >
            {xLabels.map((label, i) => (
              <div
                key={i}
                className="text-center truncate"
                style={{ width: cellSize, marginRight: i < cols - 1 ? gap : 0 }}
              >
                {label}
              </div>
            ))}
          </div>
        )}
        <div className="flex">
          {yLabels && (
            <div className="flex flex-col justify-around pr-2 text-xs text-muted-foreground">
              {yLabels.map((label, i) => (
                <div
                  key={i}
                  className="text-right truncate w-14"
                  style={{ height: cellSize }}
                >
                  <span className="leading-none flex items-center h-full justify-end">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
          <div
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
              gap: `${gap}px`,
            }}
          >
            {grid.map((row, y) =>
              row.map((cell, x) => (
                <Tooltip key={`${x}-${y}`}>
                  <TooltipTrigger asChild>
                    <motion.div
                      className={cn(
                        "rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-primary/50",
                        onCellClick && "hover:scale-110"
                      )}
                      style={{
                        backgroundColor: cell ? getColor(cell.value) : colorScale[0],
                      }}
                      initial={animated ? { opacity: 0, scale: 0.8 } : undefined}
                      animate={animated ? { opacity: 1, scale: 1 } : undefined}
                      transition={{
                        duration: 0.3,
                        delay: (x + y) * 0.02,
                      }}
                      onClick={() => cell && onCellClick?.(cell)}
                    >
                      {showLabels && cell && (
                        <span className="flex items-center justify-center h-full text-[10px] font-medium text-foreground/80">
                          {cell.value}
                        </span>
                      )}
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="font-medium">
                      {cell?.label || `(${x}, ${y})`}: {cell?.value ?? 0}
                    </p>
                  </TooltipContent>
                </Tooltip>
              ))
            )}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});

interface CalendarHeatmapProps {
  data: { date: Date; value: number }[];
  startDate?: Date;
  endDate?: Date;
  cellSize?: number;
  colorScale?: string[];
  animated?: boolean;
  onDayClick?: (day: { date: Date; value: number }) => void;
  className?: string;
}

export const CalendarHeatmap = memo(function CalendarHeatmap({
  data,
  startDate,
  endDate,
  cellSize = 12,
  colorScale = defaultColorScale,
  animated = true,
  onDayClick,
  className,
}: CalendarHeatmapProps) {
  const { weeks, maxValue, minValue } = useMemo(() => {
    const start = startDate || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    const end = endDate || new Date();

    const dataMap = new Map(
      data.map((d) => [d.date.toISOString().split("T")[0], d.value])
    );

    let max = 0;
    let min = Infinity;
    data.forEach((d) => {
      max = Math.max(max, d.value);
      min = Math.min(min, d.value);
    });

    const weeksData: { date: Date; value: number }[][] = [];
    let currentWeek: { date: Date; value: number }[] = [];
    
    const current = new Date(start);
    
    // Pad the first week
    const startDay = current.getDay();
    for (let i = 0; i < startDay; i++) {
      currentWeek.push({ date: new Date(0), value: -1 });
    }

    while (current <= end) {
      const dateStr = current.toISOString().split("T")[0];
      currentWeek.push({
        date: new Date(current),
        value: dataMap.get(dateStr) ?? 0,
      });

      if (current.getDay() === 6) {
        weeksData.push(currentWeek);
        currentWeek = [];
      }

      current.setDate(current.getDate() + 1);
    }

    if (currentWeek.length > 0) {
      // Pad the last week
      while (currentWeek.length < 7) {
        currentWeek.push({ date: new Date(0), value: -1 });
      }
      weeksData.push(currentWeek);
    }

    return { weeks: weeksData, maxValue: max, minValue: min };
  }, [data, startDate, endDate]);

  const getColor = (value: number) => {
    if (value < 0) return "transparent";
    if (value === 0) return colorScale[0];
    if (maxValue === minValue) return colorScale[colorScale.length - 1];
    const ratio = (value - minValue) / (maxValue - minValue);
    const index = Math.min(
      Math.floor(ratio * (colorScale.length - 1)) + 1,
      colorScale.length - 1
    );
    return colorScale[index];
  };

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <TooltipProvider>
      <div className={cn("inline-flex gap-1", className)}>
        <div className="flex flex-col gap-[2px] text-[10px] text-muted-foreground mr-1 pt-0">
          {dayLabels.map((day, i) => (
            <div
              key={day}
              className="flex items-center justify-end"
              style={{ height: cellSize }}
            >
              {i % 2 === 1 && day.slice(0, 1)}
            </div>
          ))}
        </div>
        <div className="flex gap-[2px]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[2px]">
              {week.map((day, dayIndex) => (
                <Tooltip key={dayIndex}>
                  <TooltipTrigger asChild>
                    <motion.div
                      className={cn(
                        "rounded-[2px]",
                        day.value >= 0 && "cursor-pointer hover:ring-1 hover:ring-primary/50"
                      )}
                      style={{
                        width: cellSize,
                        height: cellSize,
                        backgroundColor: getColor(day.value),
                      }}
                      initial={animated ? { opacity: 0 } : undefined}
                      animate={animated ? { opacity: 1 } : undefined}
                      transition={{
                        duration: 0.2,
                        delay: weekIndex * 0.01,
                      }}
                      onClick={() => day.value >= 0 && onDayClick?.(day)}
                    />
                  </TooltipTrigger>
                  {day.value >= 0 && (
                    <TooltipContent>
                      <p className="font-medium">
                        {day.date.toLocaleDateString()}: {day.value}
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
});

interface ActivityIndicatorProps {
  level: 0 | 1 | 2 | 3 | 4;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
}

export const ActivityIndicator = memo(function ActivityIndicator({
  level,
  size = "md",
  showLabel = false,
  animated = true,
  className,
}: ActivityIndicatorProps) {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const labels = ["Nenhuma", "Baixa", "Média", "Alta", "Muito alta"];
  const colors = [
    "bg-muted",
    "bg-success/30",
    "bg-success/50",
    "bg-success/70",
    "bg-success",
  ];

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={cn(
            "rounded-sm",
            sizeClasses[size],
            i <= level ? colors[level] : "bg-muted"
          )}
          initial={animated ? { scale: 0 } : undefined}
          animate={animated ? { scale: 1 } : undefined}
          transition={{ delay: i * 0.05 }}
        />
      ))}
      {showLabel && (
        <span className="text-xs text-muted-foreground ml-1">
          {labels[level]}
        </span>
      )}
    </div>
  );
});

Heatmap.displayName = "Heatmap";
CalendarHeatmap.displayName = "CalendarHeatmap";
ActivityIndicator.displayName = "ActivityIndicator";
