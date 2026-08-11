export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface ProfileAchievement {
  id: string;
  name: string;
  icon: string;
  tier: AchievementTier;
  unlocked: boolean;
}

export const TIER_GRADIENTS: Record<AchievementTier, string> = {
  bronze: 'from-warning to-warning/70',
  silver: 'from-muted-foreground/60 to-muted-foreground',
  gold: 'from-warning to-warning/80',
  platinum: 'from-info/70 to-info',
  diamond: 'from-accent to-accent/70',
};

export const TIER_TEXT: Record<AchievementTier, string> = {
  diamond: 'text-accent',
  platinum: 'text-info',
  gold: 'text-warning',
  silver: 'text-muted-foreground',
  bronze: 'text-warning',
};

export const TIER_ORDER: Record<AchievementTier, number> = {
  diamond: 5, platinum: 4, gold: 3, silver: 2, bronze: 1,
};

export type StatColor = 'yellow' | 'primary' | 'orange' | 'purple';

export const STAT_COLOR_CLASSES: Record<StatColor, { bg: string; border: string; iconBg: string; icon: string }> = {
  yellow:  { bg: 'bg-warning/10',     border: 'border-warning/20',     iconBg: 'bg-warning/20',     icon: 'text-warning' },
  primary: { bg: 'bg-primary/10',     border: 'border-primary/20',     iconBg: 'bg-primary/20',     icon: 'text-primary' },
  orange:  { bg: 'bg-warning/10',     border: 'border-warning/20',     iconBg: 'bg-warning/20',     icon: 'text-warning' },
  purple:  { bg: 'bg-accent/10',      border: 'border-accent/20',      iconBg: 'bg-accent/20',      icon: 'text-accent' },
};
