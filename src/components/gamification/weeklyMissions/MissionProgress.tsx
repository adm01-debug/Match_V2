import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { TierStyle } from "./types";

interface MissionProgressProps {
  progress: number;
  target: number;
  config: TierStyle;
}

export const MissionProgress = memo(function MissionProgress({
  progress,
  target,
  config,
}: MissionProgressProps) {
  const progressPercent = Math.min(100, (progress / target) * 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {progress}/{target} completo
        </span>
        <span className={cn("font-semibold", config.textColor)}>
          {Math.round(progressPercent)}%
        </span>
      </div>
      <div
        className="relative h-3 bg-muted rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={Math.round(progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", config.gradient)}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
});
