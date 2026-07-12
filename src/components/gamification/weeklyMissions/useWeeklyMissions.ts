import { useState, useCallback, useMemo } from "react";
import { generateWeeklyMissions } from "./demoMissions";
import type { WeeklyMission } from "./types";

export function useWeeklyMissions(onClaimReward?: (missionId: string, xpAmount: number) => void) {
  const [missions, setMissions] = useState<WeeklyMission[]>(generateWeeklyMissions);

  const stats = useMemo(() => {
    const completed = missions.filter((m) => m.isCompleted && !m.isLocked).length;
    const available = missions.filter((m) => !m.isLocked).length;
    const totalXP = missions
      .filter((m) => !m.isLocked)
      .reduce((sum, m) => sum + Math.round(m.xpReward * m.multiplier), 0);
    return { completed, available, totalXP };
  }, [missions]);

  const daysUntilReset = useMemo(() => {
    const dayOfWeek = new Date().getDay();
    return dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  }, []);

  const handleClaim = useCallback(
    (id: string) => {
      setMissions((prev) =>
        prev.map((m) => {
          if (m.id === id) {
            const totalReward = Math.round(m.xpReward * m.multiplier);
            onClaimReward?.(id, totalReward);
            return { ...m, isClaimed: true };
          }
          return m;
        })
      );
    },
    [onClaimReward]
  );

  return { missions, stats, daysUntilReset, handleClaim };
}
