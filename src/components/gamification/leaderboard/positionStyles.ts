import { Crown, Medal } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface PositionStyle {
  bg: string;
  text: string;
  icon: LucideIcon;
  iconColor: string;
  glow: string;
}

export const positionStyles: Record<1 | 2 | 3, PositionStyle> = {
  1: {
    bg: "bg-gradient-to-r from-warning to-warning/70",
    text: "text-warning-foreground",
    icon: Crown,
    iconColor: "text-warning-foreground",
    glow: "shadow-[0_0_30px_-5px_hsl(var(--warning)/0.5)]",
  },
  2: {
    bg: "bg-gradient-to-r from-muted-foreground/50 to-muted-foreground/70",
    text: "text-background",
    icon: Medal,
    iconColor: "text-background",
    glow: "shadow-[0_0_20px_-5px_hsl(var(--muted-foreground)/0.5)]",
  },
  3: {
    bg: "bg-gradient-to-r from-accent to-accent/70",
    text: "text-accent-foreground",
    icon: Medal,
    iconColor: "text-accent-foreground",
    glow: "shadow-[0_0_20px_-5px_hsl(var(--accent)/0.5)]",
  },
};
