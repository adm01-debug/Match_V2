/**
 * @fileoverview Barrel de compatibilidade — reexporta os módulos de conquistas.
 * A implementação foi movida para `./achievements/` para respeitar o limite de 400 linhas.
 */

export {
  AchievementBadge,
} from "./achievements/AchievementBadgeCore";
export { AchievementGrid } from "./achievements/AchievementGrid";
export { AchievementUnlock } from "./achievements/AchievementUnlock";
export { recruitmentAchievements } from "./achievements/recruitmentAchievements";
export type {
  Achievement,
  AchievementTier,
  AchievementCategory,
  AchievementBadgeSize,
} from "./achievements/achievementTypes";
