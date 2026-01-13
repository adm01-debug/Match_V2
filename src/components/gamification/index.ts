/**
 * @fileoverview Gamification components exports
 * @module Gamification
 */

export {
  AchievementBadge,
  AchievementGrid,
  AchievementUnlock,
  recruitmentAchievements,
  type Achievement,
  type AchievementTier,
  type AchievementCategory,
} from "./AchievementBadge";

export {
  ProgressRing,
  MultiProgressRing,
  LevelProgress,
} from "./ProgressRing";

export {
  StreakDisplay,
  StreakCalendar,
} from "./StreakDisplay";

export {
  Leaderboard,
  LeaderboardEntry,
  MiniLeaderboard,
  type LeaderboardUser,
} from "./Leaderboard";

export {
  GamificationDashboard,
} from "./GamificationDashboard";

export {
  GamificationWidget,
} from "./GamificationWidget";

export {
  AchievementNotification,
  useAchievementNotification,
} from "./AchievementNotification";

export {
  LevelUpCelebration,
} from "./LevelUpCelebration";

// Phase 1 - Visual Quick Wins
export { XPToast, useXPToast, XPToastManager } from "./XPToast";
export { GamificationOnboarding, useGamificationOnboarding } from "./GamificationOnboarding";
export { InteractiveXPCard, XPStatCard, XPActionCard } from "./MicroInteractionCards";

// Phase 2 - Engagement
export { DailyChallenges, type DailyChallenge, type ChallengeType, type ChallengeDifficulty } from "./DailyChallenges";
export { WeeklyMissions, type WeeklyMission, type MissionTier } from "./WeeklyMissions";
export { PowerUps, type PowerUp, type PowerUpType } from "./PowerUps";
