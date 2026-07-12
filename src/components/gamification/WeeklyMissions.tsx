/**
 * @fileoverview Weekly Missions Component
 * Shows weekly objectives with multipliers and bigger rewards
 */

import { memo } from "react";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useWeeklyMissions } from "./weeklyMissions/useWeeklyMissions";
import { MissionsHeader } from "./weeklyMissions/MissionsHeader";
import { MissionCard } from "./weeklyMissions/MissionCard";

export type { WeeklyMission, MissionTier } from "./weeklyMissions/types";

interface WeeklyMissionsProps {
  className?: string;
  onClaimReward?: (missionId: string, xpAmount: number) => void;
}

export const WeeklyMissions = memo(function WeeklyMissions({
  className,
  onClaimReward,
}: WeeklyMissionsProps) {
  const { missions, stats, daysUntilReset, handleClaim } = useWeeklyMissions(onClaimReward);

  return (
    <Card className={cn("overflow-hidden", className)}>
      <MissionsHeader daysUntilReset={daysUntilReset} totalXP={stats.totalXP} />
      <CardContent className="p-4 space-y-4">
        <AnimatePresence mode="popLayout">
          {missions.map((mission) => (
            <MissionCard key={mission.id} mission={mission} onClaim={handleClaim} />
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
});

WeeklyMissions.displayName = "WeeklyMissions";
