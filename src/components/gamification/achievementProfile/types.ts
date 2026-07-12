export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface ProfileAchievement {
  id: string;
  name: string;
  icon: string;
  tier: AchievementTier;
  unlocked: boolean;
}

export const TIER_GRADIENTS: Record<AchievementTier, string> = {
  bronze: 'from-amber-600 to-orange-700',
  silver: 'from-gray-300 to-gray-500',
  gold: 'from-yellow-400 to-amber-500',
  platinum: 'from-cyan-300 to-blue-400',
  diamond: 'from-purple-400 to-pink-500',
};

export const TIER_TEXT: Record<AchievementTier, string> = {
  diamond: 'text-purple-400',
  platinum: 'text-cyan-400',
  gold: 'text-yellow-500',
  silver: 'text-gray-400',
  bronze: 'text-amber-600',
};

export const TIER_ORDER: Record<AchievementTier, number> = {
  diamond: 5, platinum: 4, gold: 3, silver: 2, bronze: 1,
};

export type StatColor = 'yellow' | 'primary' | 'orange' | 'purple';

export const STAT_COLOR_CLASSES: Record<StatColor, { bg: string; border: string; iconBg: string; icon: string }> = {
  yellow:  { bg: 'bg-yellow-500/10',    border: 'border-yellow-500/20',    iconBg: 'bg-yellow-500/20',    icon: 'text-yellow-500' },
  primary: { bg: 'bg-primary/10',       border: 'border-primary/20',       iconBg: 'bg-primary/20',       icon: 'text-primary' },
  orange:  { bg: 'bg-orange-500/10',    border: 'border-orange-500/20',    iconBg: 'bg-orange-500/20',    icon: 'text-orange-500' },
  purple:  { bg: 'bg-purple-500/10',    border: 'border-purple-500/20',    iconBg: 'bg-purple-500/20',    icon: 'text-purple-500' },
};
