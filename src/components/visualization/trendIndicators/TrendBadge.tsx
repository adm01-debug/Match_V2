import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getTrendInfo } from "./trendUtils";

export interface TrendBadgeProps {
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
  const info = useMemo(() => getTrendInfo(value, previousValue, "trending"), [value, previousValue]);
  const { trend, change, percentChange, color, bgColor, Icon } = info;

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
      className={cn("inline-flex items-center font-medium rounded-full", sizeClasses[size], variantClasses[variant], className)}
      initial={animated ? { opacity: 0, scale: 0.8 } : undefined}
      animate={animated ? { opacity: 1, scale: 1 } : undefined}
      transition={{ duration: 0.3, type: "spring" }}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      <span>{formatValue()}</span>
    </motion.div>
  );
});
TrendBadge.displayName = "TrendBadge";
