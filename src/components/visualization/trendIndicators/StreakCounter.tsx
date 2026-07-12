import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StreakCounterProps {
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
      className={cn("inline-flex items-center gap-2 px-3 py-2 rounded-lg", className)}
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
StreakCounter.displayName = "StreakCounter";
