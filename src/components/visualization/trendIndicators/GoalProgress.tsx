import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GoalProgressProps {
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
          <span className={cn("text-sm font-bold", isComplete ? "text-success" : "text-muted-foreground")}>
            {Math.round(percentage)}%
          </span>
        )}
      </div>
      <div
        className="relative h-2 bg-muted rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ backgroundColor: isComplete ? "hsl(var(--success))" : color }}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <div className="absolute top-0 w-0.5 h-full bg-foreground/30" style={{ left: "100%" }} />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{current.toLocaleString()}{unit}</span>
        <span>Meta: {goal.toLocaleString()}{unit}</span>
      </div>
    </motion.div>
  );
});
GoalProgress.displayName = "GoalProgress";
