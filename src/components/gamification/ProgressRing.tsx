/**
 * @fileoverview Animated Progress Ring components for gamification
 * @module ProgressRing
 */

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg" | "xl";
  strokeWidth?: number;
  color?: "primary" | "success" | "warning" | "destructive" | "accent" | "gradient";
  showValue?: boolean;
  valueFormat?: "percent" | "value" | "fraction";
  label?: string;
  sublabel?: string;
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const sizeStyles = {
  sm: { size: 48, fontSize: "text-sm", labelSize: "text-[10px]" },
  md: { size: 80, fontSize: "text-xl", labelSize: "text-xs" },
  lg: { size: 120, fontSize: "text-3xl", labelSize: "text-sm" },
  xl: { size: 160, fontSize: "text-4xl", labelSize: "text-base" },
};

const colorStyles = {
  primary: "stroke-primary",
  success: "stroke-success",
  warning: "stroke-warning",
  destructive: "stroke-destructive",
  accent: "stroke-accent",
  gradient: "stroke-[url(#progressGradient)]",
};

export const ProgressRing = memo(function ProgressRing({
  value,
  max = 100,
  size = "md",
  strokeWidth = 8,
  color = "primary",
  showValue = true,
  valueFormat = "percent",
  label,
  sublabel,
  animated = true,
  className,
  children,
}: ProgressRingProps) {
  const { size: ringSize, fontSize, labelSize } = sizeStyles[size];
  const radius = (ringSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((value / max) * 100, 100);
  const offset = circumference - (percentage / 100) * circumference;

  const displayValue = useMemo(() => {
    switch (valueFormat) {
      case "percent":
        return `${Math.round(percentage)}%`;
      case "value":
        return value.toString();
      case "fraction":
        return `${value}/${max}`;
    }
  }, [valueFormat, percentage, value, max]);

  return (
    <div className={cn("relative inline-flex flex-col items-center", className)}>
      <div className="relative" style={{ width: ringSize, height: ringSize }}>
        <svg
          className="transform -rotate-90"
          width={ringSize}
          height={ringSize}
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="50%" stopColor="hsl(var(--accent))" />
              <stop offset="100%" stopColor="hsl(var(--success))" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            className="stroke-muted"
            strokeWidth={strokeWidth}
          />

          {/* Progress circle */}
          <motion.circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            className={colorStyles[color]}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset: offset }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={color === "gradient" ? { stroke: "url(#progressGradient)" } : undefined}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {children || (
            <>
              {showValue && (
                <motion.span
                  className={cn("font-bold", fontSize)}
                  initial={animated ? { opacity: 0, scale: 0.5 } : undefined}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                >
                  {displayValue}
                </motion.span>
              )}
              {label && (
                <span className={cn("text-muted-foreground", labelSize)}>
                  {label}
                </span>
              )}
            </>
          )}
        </div>
      </div>
      {sublabel && (
        <span className={cn("mt-2 text-muted-foreground text-center", labelSize)}>
          {sublabel}
        </span>
      )}
    </div>
  );
});

// Multi-ring progress component
interface MultiProgressRingProps {
  rings: Array<{
    value: number;
    max: number;
    color: "primary" | "success" | "warning" | "destructive" | "accent";
    label: string;
  }>;
  size?: "md" | "lg" | "xl";
  animated?: boolean;
  className?: string;
}

export const MultiProgressRing = memo(function MultiProgressRing({
  rings,
  size = "lg",
  animated = true,
  className,
}: MultiProgressRingProps) {
  const { size: ringSize } = sizeStyles[size];
  const baseStrokeWidth = 8;
  const gap = 4;

  return (
    <div className={cn("relative inline-flex", className)}>
      <svg
        className="transform -rotate-90"
        width={ringSize}
        height={ringSize}
      >
        {rings.map((ring, index) => {
          const strokeWidth = baseStrokeWidth;
          const offset = index * (strokeWidth + gap);
          const radius = (ringSize - strokeWidth) / 2 - offset;
          const circumference = 2 * Math.PI * radius;
          const percentage = Math.min((ring.value / ring.max) * 100, 100);
          const dashOffset = circumference - (percentage / 100) * circumference;

          return (
            <g key={index}>
              {/* Background */}
              <circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                fill="none"
                className="stroke-muted"
                strokeWidth={strokeWidth}
              />
              {/* Progress */}
              <motion.circle
                cx={ringSize / 2}
                cy={ringSize / 2}
                r={radius}
                fill="none"
                className={colorStyles[ring.color]}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset: dashOffset }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.2 }}
              />
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
        {rings.map((ring, index) => (
          <motion.div
            key={index}
            className="flex items-center gap-1"
            initial={animated ? { opacity: 0 } : undefined}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <div className={cn("w-2 h-2 rounded-full", `bg-${ring.color}`)} 
                 style={{ background: `hsl(var(--${ring.color}))` }} />
            <span className="text-[10px] text-muted-foreground">{ring.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
});

// Level Progress Ring
interface LevelProgressProps {
  level: number;
  currentXP: number;
  requiredXP: number;
  title?: string;
  animated?: boolean;
  className?: string;
}

export const LevelProgress = memo(function LevelProgress({
  level,
  currentXP,
  requiredXP,
  title = "Nível",
  animated = true,
  className,
}: LevelProgressProps) {
  const percentage = (currentXP / requiredXP) * 100;

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <ProgressRing
        value={currentXP}
        max={requiredXP}
        size="lg"
        color="gradient"
        showValue={false}
        animated={animated}
      >
        <motion.div
          className="flex flex-col items-center"
          initial={animated ? { scale: 0 } : undefined}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          <span className="text-xs text-muted-foreground">{title}</span>
          <span className="text-3xl font-bold">{level}</span>
        </motion.div>
      </ProgressRing>

      <div className="flex-1 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="font-medium">XP Atual</span>
          <span className="text-muted-foreground">
            {currentXP.toLocaleString()} / {requiredXP.toLocaleString()}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-success"
            initial={animated ? { width: 0 } : { width: `${percentage}%` }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Faltam {(requiredXP - currentXP).toLocaleString()} XP para o próximo nível
        </p>
      </div>
    </div>
  );
});

ProgressRing.displayName = "ProgressRing";
MultiProgressRing.displayName = "MultiProgressRing";
LevelProgress.displayName = "LevelProgress";
