import { memo } from "react";
import { Zap, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TierStyle } from "./types";

interface MissionRewardBadgeProps {
  totalXP: number;
  multiplier: number;
  config: TierStyle;
}

export const MissionRewardBadge = memo(function MissionRewardBadge({
  totalXP,
  multiplier,
  config,
}: MissionRewardBadgeProps) {
  return (
    <div className="mt-4 flex items-center gap-3">
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/10 text-warning text-sm font-medium">
        <Zap className="w-4 h-4" />
        +{totalXP} XP
      </div>
      <div
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold",
          config.bgColor,
          config.textColor
        )}
      >
        <TrendingUp className="w-4 h-4" />
        x{multiplier}
      </div>
    </div>
  );
});
