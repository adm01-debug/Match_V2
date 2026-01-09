/**
 * @fileoverview Premium Trend Indicator components for data trends visualization
 * @module TrendIndicators
 */

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";


interface TrendBadgeProps {
  value: number;
  previousValue: number;
  format?: "percent" | "absolute" | "both";
  variant?: "default" | "subtle" | "outline";
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  animated?: boolean;
  className?: string;
}

export const TrendBadge = memo(function TrendBadge({
  value,
  previousValue,
  format = "percent",
  variant = "default",
  size = "md",
  showIcon = true,
  animated = true,
  className,
}: TrendBadgeProps) {
  const { trend, change, percentChange, color, bgColor, Icon } = useMemo(() => {
    const diff = value - previousValue;
    const pct = previousValue !== 0 ? (diff / previousValue) * 100 : 0;

    if (diff > 0) {
      return {
        trend: "up" as const,
        change: diff,
        percentChange: pct,
        color: "text-success",
        bgColor: "bg-success/10",
        Icon: TrendingUp,
      };
    } else if (diff < 0) {
      return {
        trend: "down" as const,
        change: Math.abs(diff),
        percentChange: Math.abs(pct),
        color: "text-destructive",
        bgColor: "bg-destructive/10",
        Icon: TrendingDown,
      };
    }
    return {
      trend: "neutral" as const,
      change: 0,
      percentChange: 0,
      color: "text-muted-foreground",
      bgColor: "bg-muted",
      Icon: Minus,
    };
  }, [value, previousValue]);

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5 gap-0.5",
    md: "text-sm px-2 py-1 gap-1",
    lg: "text-base px-3 py-1.5 gap-1.5",
  };

  const iconSizes = { sm: 10, md: 12, lg: 14 };

  const formatValue = () => {
    const prefix = trend === "up" ? "+" : trend === "down" ? "-" : "";
    switch (format) {
      case "percent":
        return `${prefix}${percentChange.toFixed(1)}%`;
      case "absolute":
        return `${prefix}${change}`;
      case "both":
        return `${prefix}${percentChange.toFixed(1)}% (${prefix}${change})`;
    }
  };

  const variantClasses = {
    default: cn(bgColor, color),
    subtle: cn("bg-transparent", color),
    outline: cn("bg-transparent border", color, "border-current"),
  };

  return (
    <motion.div
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      initial={animated ? { opacity: 0, scale: 0.8 } : undefined}
      animate={animated ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.3, type: "spring" }}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      <span>{formatValue()}</span>
    </motion.div>
  );
});

interface ComparisonIndicatorProps {
  current: number;
  previous: number;
  label?: string;
  format?: (value: number) => string;
  showArrow?: boolean;
  layout?: "horizontal" | "vertical";
  animated?: boolean;
  className?: string;
}

export const ComparisonIndicator = memo(function ComparisonIndicator({
  current,
  previous,
  label,
  format = (v) => v.toString(),
  showArrow = true,
  layout = "horizontal",
  animated = true,
  className,
}: ComparisonIndicatorProps) {
  const { color, Icon } = useMemo(() => {
    const diff = current - previous;

    if (diff > 0) {
      return {
        color: "text-success",
        Icon: ArrowUp,
      };
    } else if (diff < 0) {
      return {
        color: "text-destructive",
        Icon: ArrowDown,
      };
    }
    return {
      color: "text-muted-foreground",
      Icon: ArrowRight,
    };
  }, [current, previous]);

  return (
    <motion.div
      className={cn(
        "flex items-center gap-2",
        layout === "vertical" && "flex-col",
        className
      )}
      initial={animated ? { opacity: 0, y: 10 } : undefined}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.4 }}
    >
      {label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground line-through text-sm">
          {format(previous)}
        </span>
        {showArrow && <Icon className={cn("h-4 w-4", color)} />}
        <span className="font-semibold">{format(current)}</span>
      </div>
      <TrendBadge
        value={current}
        previousValue={previous}
        variant="subtle"
        size="sm"
      />
    </motion.div>
  );
});

interface MetricChangeProps {
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
  const { trend, percentChange, color, Icon } = useMemo(() => {
    const diff = value - previousValue;
    const pct = previousValue !== 0 ? (diff / previousValue) * 100 : 0;

    if (diff > 0) {
      return {
        trend: "up" as const,
        percentChange: pct,
        color: "text-success",
        Icon: ChevronUp,
      };
    } else if (diff < 0) {
      return {
        trend: "down" as const,
        percentChange: Math.abs(pct),
        color: "text-destructive",
        Icon: ChevronDown,
      };
    }
    return {
      trend: "neutral" as const,
      percentChange: 0,
      color: "text-muted-foreground",
      Icon: Minus,
    };
  }, [value, previousValue]);

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

interface GoalProgressProps {
  current: number;
  goal: number;
  label: string;
  unit?: string;
  color?: string;
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

export const GoalProgress = memo(function GoalProgress({
  current,
  goal,
  label,
  unit = "",
  color = "hsl(var(--primary))",
  showPercentage = true,
  animated = true,
  className,
}: GoalProgressProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  const isComplete = current >= goal;

  return (
    <motion.div
      className={cn("space-y-2", className)}
      initial={animated ? { opacity: 0, y: 10 } : undefined}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        {showPercentage && (
          <span
            className={cn(
              "text-sm font-bold",
              isComplete ? "text-success" : "text-muted-foreground"
            )}
          >
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: isComplete ? "hsl(var(--success))" : color }}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        {/* Goal marker */}
        <div
          className="absolute top-0 w-0.5 h-full bg-foreground/30"
          style={{ left: "100%" }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {current.toLocaleString()}
          {unit}
        </span>
        <span>
          Meta: {goal.toLocaleString()}
          {unit}
        </span>
      </div>
    </motion.div>
  );
});

interface StreakCounterProps {
  count: number;
  label?: string;
  unit?: string;
  icon?: React.ReactNode;
  color?: string;
  animated?: boolean;
  className?: string;
}

export const StreakCounter = memo(function StreakCounter({
  count,
  label = "Streak",
  unit = "dias",
  icon,
  color = "hsl(var(--warning))",
  animated = true,
  className,
}: StreakCounterProps) {
  return (
    <motion.div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-2 rounded-lg",
        className
      )}
      style={{ backgroundColor: `${color}15` }}
      initial={animated ? { opacity: 0, scale: 0.9 } : undefined}
      animate={animated ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.3, type: "spring" }}
    >
      {icon || (
        <motion.span
          className="text-xl"
          animate={animated ? { scale: [1, 1.2, 1] } : undefined}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          🔥
        </motion.span>
      )}
      <div className="flex flex-col">
        <motion.span
          className="text-lg font-bold leading-tight"
          style={{ color }}
          initial={animated ? { opacity: 0 } : undefined}
          animate={animated ? { opacity: 1 } : undefined}
          transition={{ delay: 0.2 }}
        >
          {count} {unit}
        </motion.span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </motion.div>
  );
});

TrendBadge.displayName = "TrendBadge";
ComparisonIndicator.displayName = "ComparisonIndicator";
MetricChange.displayName = "MetricChange";
GoalProgress.displayName = "GoalProgress";
StreakCounter.displayName = "StreakCounter";
