import type { LucideIcon } from "lucide-react";

export type MissionTier = "bronze" | "silver" | "gold" | "platinum";

export interface WeeklyMission {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  xpReward: number;
  multiplier: number;
  tier: MissionTier;
  target: number;
  progress: number;
  isCompleted: boolean;
  isClaimed: boolean;
  isLocked: boolean;
  unlockRequirement?: string;
}

export interface TierStyle {
  label: string;
  gradient: string;
  textColor: string;
  bgColor: string;
  borderColor: string;
  icon: LucideIcon;
}
