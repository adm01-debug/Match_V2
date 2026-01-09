/**
 * @fileoverview Premium Sparkline components for inline data visualization
 * @module Sparkline
 */

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  strokeWidth?: number;
  color?: string;
  fillOpacity?: number;
  showArea?: boolean;
  animated?: boolean;
  className?: string;
}

export const Sparkline = memo(function Sparkline({
  data,
  width = 100,
  height = 24,
  strokeWidth = 2,
  color = "hsl(var(--primary))",
  fillOpacity = 0.1,
  showArea = true,
  animated = true,
  className,
}: SparklineProps) {
  const { path, areaPath, viewBox } = useMemo(() => {
    if (!data.length) return { path: "", areaPath: "", viewBox: "0 0 100 24" };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    
    const padding = 2;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((value - min) / range) * chartHeight;
      return { x, y };
    });

    const linePath = points
      .map((point, i) => `${i === 0 ? "M" : "L"} ${point.x} ${point.y}`)
      .join(" ");

    const lastPoint = points[points.length - 1];
    const firstPoint = points[0];
    const area = `${linePath} L ${lastPoint?.x ?? 0} ${height - padding} L ${firstPoint?.x ?? 0} ${height - padding} Z`;

    return {
      path: linePath,
      areaPath: area,
      viewBox: `0 0 ${width} ${height}`,
    };
  }, [data, width, height]);

  if (!data.length) return null;

  return (
    <svg
      viewBox={viewBox}
      width={width}
      height={height}
      className={cn("overflow-visible", className)}
    >
      {showArea && (
        <motion.path
          d={areaPath}
          fill={color}
          fillOpacity={fillOpacity}
          initial={animated ? { opacity: 0 } : undefined}
          animate={animated ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5 }}
        />
      )}
      <motion.path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animated ? { pathLength: 0 } : undefined}
        animate={animated ? { pathLength: 1 } : undefined}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </svg>
  );
});

interface SparkBarProps {
  data: number[];
  width?: number;
  height?: number;
  gap?: number;
  color?: string;
  highlightLast?: boolean;
  animated?: boolean;
  className?: string;
}

export const SparkBar = memo(function SparkBar({
  data,
  width = 100,
  height = 24,
  gap = 2,
  color = "hsl(var(--primary))",
  highlightLast = true,
  animated = true,
  className,
}: SparkBarProps) {
  const bars = useMemo(() => {
    if (!data.length) return [];

    const max = Math.max(...data);
    const barWidth = (width - gap * (data.length - 1)) / data.length;

    return data.map((value, index) => ({
      x: index * (barWidth + gap),
      height: (value / max) * height,
      y: height - (value / max) * height,
      isLast: index === data.length - 1,
    }));
  }, [data, width, height, gap]);

  if (!data.length) return null;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      className={cn("overflow-visible", className)}
    >
      {bars.map((bar, index) => (
        <motion.rect
          key={index}
          x={bar.x}
          width={(width - gap * (data.length - 1)) / data.length}
          rx={1}
          fill={bar.isLast && highlightLast ? color : color}
          fillOpacity={bar.isLast && highlightLast ? 1 : 0.5}
          initial={animated ? { y: height, height: 0 } : { y: bar.y, height: bar.height }}
          animate={{ y: bar.y, height: bar.height }}
          transition={{ duration: 0.5, delay: index * 0.02 }}
        />
      ))}
    </svg>
  );
});

interface TrendIndicatorProps {
  value: number;
  previousValue: number;
  showValue?: boolean;
  showPercentage?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

export const TrendIndicator = memo(function TrendIndicator({
  value,
  previousValue,
  showValue = true,
  showPercentage = true,
  size = "md",
  animated = true,
  className,
}: TrendIndicatorProps) {
  const { trend, percentage, color, Icon } = useMemo(() => {
    const diff = value - previousValue;
    const pct = previousValue !== 0 ? ((diff / previousValue) * 100) : 0;
    
    if (diff > 0) {
      return {
        trend: "up" as const,
        percentage: pct,
        color: "text-success",
        Icon: TrendingUp,
      };
    } else if (diff < 0) {
      return {
        trend: "down" as const,
        percentage: Math.abs(pct),
        color: "text-destructive",
        Icon: TrendingDown,
      };
    }
    return {
      trend: "neutral" as const,
      percentage: 0,
      color: "text-muted-foreground",
      Icon: Minus,
    };
  }, [value, previousValue]);

  const sizeClasses = {
    sm: "text-xs gap-0.5",
    md: "text-sm gap-1",
    lg: "text-base gap-1.5",
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  return (
    <motion.div
      className={cn(
        "inline-flex items-center font-medium",
        sizeClasses[size],
        color,
        className
      )}
      initial={animated ? { opacity: 0, y: 5 } : undefined}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.3 }}
    >
      <Icon size={iconSizes[size]} />
      {showPercentage && (
        <span>{percentage.toFixed(1)}%</span>
      )}
      {showValue && (
        <span className="text-muted-foreground ml-1">
          ({trend === "up" ? "+" : trend === "down" ? "-" : ""}{Math.abs(value - previousValue)})
        </span>
      )}
    </motion.div>
  );
});

interface MiniProgressProps {
  value: number;
  max?: number;
  color?: string;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

export const MiniProgress = memo(function MiniProgress({
  value,
  max = 100,
  color = "hsl(var(--primary))",
  showLabel = false,
  size = "md",
  animated = true,
  className,
}: MiniProgressProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const heightClasses = {
    sm: "h-1",
    md: "h-1.5",
    lg: "h-2",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "flex-1 bg-muted rounded-full overflow-hidden",
          heightClasses[size]
        )}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-muted-foreground min-w-[3ch]">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
});

Sparkline.displayName = "Sparkline";
SparkBar.displayName = "SparkBar";
TrendIndicator.displayName = "TrendIndicator";
MiniProgress.displayName = "MiniProgress";
