import { Brain, Heart, Zap, Layers, type LucideIcon } from "lucide-react";

export type GamifiedMode = "quiz" | "swipe" | "minigame" | "phases" | null;

export interface GameCard {
  id: NonNullable<GamifiedMode>;
  title: string;
  description: string;
  icon: LucideIcon;
  gradient: string;
  glow: string;
  xp: string;
}

export const GAME_CARDS: GameCard[] = [
  {
    id: "quiz",
    title: "Quiz Interativo",
    description: "Responda perguntas e ganhe XP com combos",
    icon: Brain,
    gradient: "from-accent to-accent",
    glow: "violet",
    xp: "150-300 XP",
  },
  {
    id: "swipe",
    title: "Swipe de Valores",
    description: "Deslize para descobrir seus valores culturais",
    icon: Heart,
    gradient: "from-accent to-destructive",
    glow: "pink",
    xp: "100-200 XP",
  },
  {
    id: "minigame",
    title: "Mini-Games",
    description: "Desafios rápidos de personalidade",
    icon: Zap,
    gradient: "from-warning to-warning",
    glow: "amber",
    xp: "50-150 XP",
  },
  {
    id: "phases",
    title: "Desafio por Fases",
    description: "Avance pelos níveis e desbloqueie recompensas",
    icon: Layers,
    gradient: "from-info to-success",
    glow: "cyan",
    xp: "200-500 XP",
  },
];
