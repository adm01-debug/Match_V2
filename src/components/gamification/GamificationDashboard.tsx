/**
 * @fileoverview Complete Gamification Dashboard component
 */

import { memo, useState } from "react";
import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AchievementUnlock, type Achievement } from "./AchievementBadge";
import { LevelProgress } from "./ProgressRing";
import { StreakDisplay, StreakCalendar } from "./StreakDisplay";
import { Leaderboard } from "./Leaderboard";
import { StatsHeader } from "./dashboard/StatsHeader";
import { AchievementsSection } from "./dashboard/AchievementsSection";
import { useDashboardData } from "./dashboard/useDashboardData";
import { generateStreakDays } from "./dashboard/demoData";

interface GamificationDashboardProps {
  className?: string;
}

export const GamificationDashboard = memo(function GamificationDashboard({
  className,
}: GamificationDashboardProps) {
  const [showUnlock, setShowUnlock] = useState(false);
  const [selectedAchievement] = useState<Achievement | null>(null);

  const {
    xp, level, streak, currentLevel, requiredXP,
    realStreakDays, mergedAchievements, unlockedAchievements,
    inProgressAchievements, lockedAchievements,
    currentUserRank, updatedLeaderboard, totalAchievements,
  } = useDashboardData();

  return (
    <div className={cn("space-y-6", className)}>
      <StatsHeader
        level={level}
        levelTitle={currentLevel?.title || "Iniciante"}
        xp={xp}
        requiredXP={requiredXP}
        streak={streak}
        unlockedCount={unlockedAchievements.length}
        totalCount={totalAchievements}
        rank={currentUserRank}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Progresso de Nível
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LevelProgress level={level} currentXP={xp} requiredXP={requiredXP} title="Nível" />
            </CardContent>
          </Card>

          <StreakDisplay
            currentStreak={streak}
            longestStreak={Math.max(streak, 45)}
            streakType="days"
            lastActivity={new Date()}
            variant="card"
          />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Histórico de Atividade</CardTitle>
            </CardHeader>
            <CardContent>
              <StreakCalendar streakDays={realStreakDays.length > 0 ? realStreakDays : generateStreakDays()} />
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <AchievementsSection
            all={mergedAchievements}
            unlocked={unlockedAchievements}
            inProgress={inProgressAchievements}
            locked={lockedAchievements}
          />

          <Leaderboard
            users={updatedLeaderboard}
            currentUserId="current"
            title="Ranking Mensal"
            showRankChange
            showStreak
            maxDisplay={8}
          />
        </div>
      </div>

      {selectedAchievement && (
        <AchievementUnlock
          achievement={selectedAchievement}
          isVisible={showUnlock}
          onClose={() => setShowUnlock(false)}
        />
      )}
    </div>
  );
});

GamificationDashboard.displayName = "GamificationDashboard";
