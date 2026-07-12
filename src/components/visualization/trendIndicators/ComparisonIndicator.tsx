import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { getTrendInfo } from "./trendUtils";
import { TrendBadge } from "./TrendBadge";

export interface ComparisonIndicatorProps {
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
  const { color, Icon } = useMemo(() => getTrendInfo(current, previous, "arrow"), [current, previous]);

  return (
    <motion.div
      className={cn("flex items-center gap-2", layout === "vertical" && "flex-col", className)}
      initial={animated ? { opacity: 0, y: 10 } : undefined}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.4 }}
    >
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground line-through text-sm">{format(previous)}</span>
        {showArrow && <Icon className={cn("h-4 w-4", color)} />}
        <span className="font-semibold">{format(current)}</span>
      </div>
      <TrendBadge value={current} previousValue={previous} variant="subtle" size="sm" />
    </motion.div>
  );
});
ComparisonIndicator.displayName = "ComparisonIndicator";
