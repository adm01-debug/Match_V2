import { Briefcase, Zap, Target, Users, Flame, Star, Crown, Rocket } from "lucide-react";
import type { Achievement } from "../AchievementBadge";
import type { LeaderboardUser } from "../Leaderboard";

export const demoAchievements: Achievement[] = [
  { id: "first-hire", title: "Primeira Contratação", description: "Realize sua primeira contratação no sistema", icon: Briefcase, tier: "bronze", category: "recruitment", unlockedAt: new Date(2024, 10, 15) },
  { id: "speed-demon", title: "Velocista", description: "Conclua um processo em menos de 7 dias", icon: Zap, tier: "silver", category: "speed", unlockedAt: new Date(2024, 11, 1) },
  { id: "talent-hunter", title: "Caçador de Talentos", description: "Contrate 10 candidatos com match score acima de 85%", icon: Target, tier: "gold", category: "quality", progress: 7, maxProgress: 10 },
  { id: "team-builder", title: "Construtor de Equipes", description: "Monte uma equipe completa de 5 pessoas", icon: Users, tier: "gold", category: "recruitment", progress: 3, maxProgress: 5 },
  { id: "streak-master", title: "Mestre da Consistência", description: "30 dias consecutivos no sistema", icon: Flame, tier: "platinum", category: "streak", progress: 18, maxProgress: 30 },
  { id: "perfectionist", title: "Perfeccionista", description: "100% satisfação em 5 processos", icon: Star, tier: "platinum", category: "quality", progress: 2, maxProgress: 5 },
  { id: "legend", title: "Lenda do RH", description: "Contrate 100 profissionais", icon: Crown, tier: "diamond", category: "milestone", progress: 42, maxProgress: 100 },
  { id: "rocket", title: "Foguete", description: "Triplique a velocidade de contratação", icon: Rocket, tier: "diamond", category: "speed", progress: 1, maxProgress: 3 },
];

export const demoLeaderboard: LeaderboardUser[] = [
  { id: "1", name: "Maria Silva", avatar: "", score: 12500, streak: 45, achievements: 15, department: "RH Corporativo", previousRank: 1 },
  { id: "2", name: "João Santos", avatar: "", score: 11200, streak: 32, achievements: 12, department: "Tech Recruiting", previousRank: 3 },
  { id: "3", name: "Ana Costa", avatar: "", score: 10800, streak: 28, achievements: 11, department: "RH Industrial", previousRank: 2 },
  { id: "4", name: "Pedro Oliveira", avatar: "", score: 9500, streak: 21, achievements: 9, department: "RH Varejo", previousRank: 5 },
  { id: "5", name: "Carla Mendes", avatar: "", score: 8900, streak: 18, achievements: 8, department: "RH Corporativo", previousRank: 4 },
  { id: "current", name: "Você", avatar: "", score: 7200, streak: 12, achievements: 6, department: "Tech Recruiting", previousRank: 7 },
  { id: "7", name: "Lucas Ferreira", avatar: "", score: 6800, streak: 10, achievements: 5, department: "RH Industrial", previousRank: 6 },
  { id: "8", name: "Julia Almeida", avatar: "", score: 5500, streak: 8, achievements: 4, department: "RH Varejo", previousRank: 8 },
];

export const generateStreakDays = (): Date[] => {
  const days: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 12; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(date);
  }
  for (let i = 15; i < 20; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    days.push(date);
  }
  return days;
};
