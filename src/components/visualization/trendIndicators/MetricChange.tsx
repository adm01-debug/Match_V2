import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getTrendInfo } from "./trendUtils";

export interface MetricChangeProps {
  value: number;
  previousValue: number;
  metric: string;
  unit?: string;
  period?: string;
  showSparkline?: boolean;
  sparklineData?: number[];
  animated?: boolean;
  className?: string;
}

export const MetricChange = memo(function MetricChange({
  value,
  previousValue,
  metric,
  unit = "",
  period = "vs período anterior",
  showSparkline = false,
  sparklineData = [],
  animated = true,
  className,
}: MetricChangeProps) {
  const { trend, percentChange, color, Icon } = useMemo(
    () => getTrendInfo(value, previousValue, "chevron"),
    [value, previousValue]
  );

  return (
    <motion.div
      className={cn("space-y-1", className)}
      initial={animated ? { opacity: 0, y: 10 } : undefined}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.4 }}
    >
      <div className="text-sm text-muted-foreground">{metric}</div>
      <div className="flex items-end gap-3">
        <div className="flex items-baseline gap-1">
          <motion.span
            className="text-3xl font-bold"
            initial={animated ? { opacity: 0 } : undefined}
            animate={animated ? { opacity: 1 } : undefined}
            transition={{ delay: 0.2 }}
          >
            {value.toLocaleString()}
          </motion.span>
          {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
        </div>
        {showSparkline && sparklineData.length > 0 && (
          <svg width="80" height="24" className="overflow-visible mb-1">
            <motion.path
              d={`M ${sparklineData
                .map((v, i) => {
                  const x = (i / (sparklineData.length - 1)) * 80;
                  const max = Math.max(...sparklineData);
                  const min = Math.min(...sparklineData);
                  const range = max - min || 1;
                  const y = 22 - ((v - min) / range) * 20;
                  return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                })
                .join(" ")}`}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              strokeLinecap="round"
              initial={animated ? { pathLength: 0 } : undefined}
              animate={animated ? { pathLength: 1 } : undefined}
              transition={{ duration: 1 }}
            />
          </svg>
        )}
      </div>
      <div className={cn("flex items-center gap-1 text-sm", color)}>
        <Icon className="h-4 w-4" />
        <span className="font-medium">
          {trend === "up" ? "+" : trend === "down" ? "-" : ""}
          {percentChange.toFixed(1)}%
        </span>
        <span className="text-muted-foreground">{period}</span>
      </div>
    </motion.div>
  );
});
MetricChange.displayName = "MetricChange";
