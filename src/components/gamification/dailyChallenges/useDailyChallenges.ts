import { useCallback, useMemo, useState } from "react";
import { generateDailyChallenges } from "./demoChallenges";
import type { DailyChallenge } from "./types";

interface UseDailyChallengesArgs {
  onClaimReward?: (challengeId: string, xpAmount: number) => void;
}

export function useDailyChallenges({ onClaimReward }: UseDailyChallengesArgs) {
  const [challenges, setChallenges] = useState<DailyChallenge[]>(generateDailyChallenges);

  const stats = useMemo(() => {
    const completed = challenges.filter((c) => c.isCompleted).length;
    const claimed = challenges.filter((c) => c.isClaimed).length;
    const totalXP = challenges.reduce((s, c) => s + c.xpReward + (c.bonusXP || 0), 0);
    const earnedXP = challenges
      .filter((c) => c.isClaimed)
      .reduce((s, c) => s + c.xpReward + (c.bonusXP || 0), 0);
    return { completed, claimed, total: challenges.length, totalXP, earnedXP };
  }, [challenges]);

  const timeUntilReset = useMemo(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }, []);

  const handleClaim = useCallback(
    (id: string) => {
      setChallenges((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            const totalReward = c.xpReward + (c.bonusXP || 0);
            onClaimReward?.(id, totalReward);
            return { ...c, isClaimed: true };
          }
          return c;
        })
      );
    },
    [onClaimReward]
  );

  return { challenges, stats, timeUntilReset, handleClaim };
}
