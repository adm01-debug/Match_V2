/**
 * @fileoverview Tipos e estilos compartilhados pelos badges de conquista.
 */

import type { LucideIcon } from "lucide-react";

export type AchievementTier = "bronze" | "silver" | "gold" | "platinum" | "diamond";

export type AchievementCategory =
  | "recruitment"
  | "speed"
  | "quality"
  | "engagement"
  | "milestone"
  | "streak"
  | "special";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tier: AchievementTier;
  category: AchievementCategory;
  progress?: number;
  maxProgress?: number;
  unlockedAt?: Date;
  isNew?: boolean;
}

export const tierStyles: Record<
  AchievementTier,
  { bg: string; border: string; glow: string; text: string }
> = {
  bronze: {
    bg: "bg-gradient-to-br from-amber-600 to-amber-800",
    border: "border-amber-500/50",
    glow: "shadow-[0_0_20px_-5px_hsl(38_92%_50%/0.5)]",
    text: "text-amber-100",
  },
  silver: {
    bg: "bg-gradient-to-br from-slate-300 to-slate-500",
    border: "border-slate-400/50",
    glow: "shadow-[0_0_20px_-5px_hsl(215_16%_60%/0.5)]",
    text: "text-slate-100",
  },
  gold: {
    bg: "bg-gradient-to-br from-yellow-400 to-amber-600",
    border: "border-yellow-400/50",
    glow: "shadow-[0_0_25px_-5px_hsl(45_93%_47%/0.6)]",
    text: "text-yellow-50",
  },
  platinum: {
    bg: "bg-gradient-to-br from-cyan-300 to-teal-500",
    border: "border-cyan-400/50",
    glow: "shadow-[0_0_30px_-5px_hsl(173_58%_50%/0.6)]",
    text: "text-cyan-50",
  },
  diamond: {
    bg: "bg-gradient-to-br from-violet-400 via-fuchsia-400 to-pink-400",
    border: "border-violet-400/50",
    glow: "shadow-[0_0_35px_-5px_hsl(262_60%_60%/0.7)]",
    text: "text-violet-50",
  },
};

export type AchievementBadgeSize = "sm" | "md" | "lg" | "xl";

export const sizeStyles: Record<
  AchievementBadgeSize,
  { container: string; icon: number; ring: number }
> = {
  sm: { container: "w-10 h-10", icon: 16, ring: 36 },
  md: { container: "w-14 h-14", icon: 22, ring: 52 },
  lg: { container: "w-20 h-20", icon: 32, ring: 76 },
  xl: { container: "w-28 h-28", icon: 44, ring: 108 },
};
