/**
 * @fileoverview Preset de conquistas do sistema de recrutamento.
 */

import { Briefcase, Crown, Flame, Rocket, Star, Target, Users, Zap } from "lucide-react";
import type { Achievement } from "./achievementTypes";

export const recruitmentAchievements: Achievement[] = [
  {
    id: "first-hire",
    title: "Primeira Contratação",
    description: "Realize sua primeira contratação no sistema",
    icon: Briefcase,
    tier: "bronze",
    category: "recruitment",
  },
  {
    id: "speed-demon",
    title: "Velocista",
    description: "Conclua um processo seletivo em menos de 7 dias",
    icon: Zap,
    tier: "silver",
    category: "speed",
  },
  {
    id: "talent-hunter",
    title: "Caçador de Talentos",
    description: "Contrate 10 candidatos com match score acima de 85%",
    icon: Target,
    tier: "gold",
    category: "quality",
    progress: 7,
    maxProgress: 10,
  },
  {
    id: "team-builder",
    title: "Construtor de Equipes",
    description: "Monte uma equipe completa de 5 pessoas para uma vaga",
    icon: Users,
    tier: "gold",
    category: "recruitment",
  },
  {
    id: "streak-master",
    title: "Mestre da Consistência",
    description: "Mantenha um streak de 30 dias consecutivos no sistema",
    icon: Flame,
    tier: "platinum",
    category: "streak",
    progress: 18,
    maxProgress: 30,
  },
  {
    id: "perfectionist",
    title: "Perfeccionista",
    description: "Alcance 100% de satisfação em 5 processos consecutivos",
    icon: Star,
    tier: "platinum",
    category: "quality",
  },
  {
    id: "legend",
    title: "Lenda do RH",
    description: "Contrate 100 profissionais através da plataforma",
    icon: Crown,
    tier: "diamond",
    category: "milestone",
    progress: 42,
    maxProgress: 100,
  },
  {
    id: "rocket",
    title: "Foguete",
    description: "Triplique a velocidade média de contratação",
    icon: Rocket,
    tier: "diamond",
    category: "speed",
  },
];
