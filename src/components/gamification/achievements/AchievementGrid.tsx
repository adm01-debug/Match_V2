/**
 * @fileoverview Grade de badges de conquistas.
 */

import { memo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { AchievementBadge } from "./AchievementBadgeCore";
import type { Achievement } from "./achievementTypes";

interface AchievementGridProps {
  achievements: Achievement[];
  size?: "sm" | "md" | "lg";
  columns?: 3 | 4 | 5 | 6;
  showProgress?: boolean;
  animated?: boolean;
  className?: string;
}

const gridCols: Record<3 | 4 | 5 | 6, string> = {
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

export const AchievementGrid = memo(function AchievementGrid({
  achievements,
  size = "md",
  columns = 4,
  showProgress = true,
  animated = true,
  className,
}: AchievementGridProps) {
  return (
    <div className={cn("grid gap-4", gridCols[columns], className)}>
      {achievements.map((achievement, index) => (
        <motion.div
          key={achievement.id}
          initial={animated ? { opacity: 0, y: 20 } : undefined}
          animate={animated ? { opacity: 1, y: 0 } : undefined}
          transition={{ delay: index * 0.05, duration: 0.3 }}
          className="flex flex-col items-center gap-2"
        >
          <AchievementBadge
            achievement={achievement}
            size={size}
            showProgress={showProgress}
            animated={animated}
          />
          <span
            className={cn(
              "text-xs text-center font-medium truncate w-full",
              achievement.unlockedAt ? "text-foreground" : "text-muted-foreground"
            )}
          >
            {achievement.title}
          </span>
        </motion.div>
      ))}
    </div>
  );
});

AchievementGrid.displayName = "AchievementGrid";
