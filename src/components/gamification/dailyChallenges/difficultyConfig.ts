import type { ChallengeDifficulty, DifficultyStyle } from "./types";

export const difficultyConfig: Record<ChallengeDifficulty, DifficultyStyle> = {
  easy: {
    label: "Fácil",
    color: "text-success",
    bgColor: "bg-success/10",
    borderColor: "border-success/30",
  },
  medium: {
    label: "Médio",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
  },
  hard: {
    label: "Difícil",
    color: "text-accent-foreground",
    bgColor: "bg-accent/40",
    borderColor: "border-accent",
  },
  epic: {
    label: "Épico",
    color: "text-warning",
    bgColor: "bg-warning/10",
    borderColor: "border-warning/30",
  },
};
