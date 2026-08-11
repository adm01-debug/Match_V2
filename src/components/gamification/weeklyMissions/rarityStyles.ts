import { Star, Trophy, Crown, Rocket } from "lucide-react";
import type { MissionTier, TierStyle } from "./types";

export const tierConfig: Record<MissionTier, TierStyle> = {
  bronze: {
    label: "Bronze",
    gradient: "from-warning/80 to-warning",
    textColor: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
    icon: Star,
  },
  silver: {
    label: "Prata",
    gradient: "from-muted-foreground/60 to-muted-foreground",
    textColor: "text-muted-foreground",
    bgColor: "bg-muted",
    borderColor: "border-muted-foreground/30",
    icon: Trophy,
  },
  gold: {
    label: "Ouro",
    gradient: "from-warning to-warning/80",
    textColor: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
    icon: Crown,
  },
  platinum: {
    label: "Platina",
    gradient: "from-accent to-primary",
    textColor: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    icon: Rocket,
  },
};
