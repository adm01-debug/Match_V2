import { useMemo } from "react";
import { useGamification } from "@/hooks/useGamification";
import { demoAchievements, demoLeaderboard } from "./demoData";

export function useDashboardData() {
  const { xp, level, streak, achievements: userAchievements, currentLevel, nextLevel } = useGamification();

  const requiredXP = useMemo(
    () => nextLevel?.minXP || currentLevel?.maxXP || 10000,
    [nextLevel, currentLevel]
  );

  const realStreakDays = useMemo(() => {
    const days: Date[] = [];
    const today = new Date();
    for (let i = 0; i < streak; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    return days;
  }, [streak]);

  const mergedAchievements = useMemo(
    () =>
      demoAchievements.map((a) => {
        const isUnlocked = userAchievements.includes(a.id);
        return isUnlocked && !a.unlockedAt ? { ...a, unlockedAt: new Date() } : a;
      }),
    [userAchievements]
  );

  const unlockedAchievements = mergedAchievements.filter((a) => a.unlockedAt);
  const inProgressAchievements = mergedAchievements.filter((a) => !a.unlockedAt && a.progress);
  const lockedAchievements = mergedAchievements.filter((a) => !a.unlockedAt && !a.progress);

  const currentUserRank = useMemo(() => {
    const sorted = demoLeaderboard
      .map((u) => (u.id === "current" ? { ...u, score: xp } : u))
      .sort((a, b) => b.score - a.score);
    return sorted.findIndex((u) => u.id === "current") + 1;
  }, [xp]);

  const updatedLeaderboard = useMemo(
    () =>
      demoLeaderboard
        .map((u) =>
          u.id === "current"
            ? { ...u, score: xp, streak, achievements: unlockedAchievements.length }
            : u
        )
        .sort((a, b) => b.score - a.score),
    [xp, streak, unlockedAchievements.length]
  );

  return {
    xp,
    level,
    streak,
    currentLevel,
    requiredXP,
    realStreakDays,
    mergedAchievements,
    unlockedAchievements,
    inProgressAchievements,
    lockedAchievements,
    currentUserRank,
    updatedLeaderboard,
    totalAchievements: demoAchievements.length,
  };
}
