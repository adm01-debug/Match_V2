import { Calendar, Users, Zap, Flame } from "lucide-react";
import type { DailyChallenge } from "./types";

export const generateDailyChallenges = (): DailyChallenge[] => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  return [
    {
      id: "daily-login",
      type: "login",
      title: "Check-in Diário",
      description: "Faça login no sistema hoje",
      icon: Calendar,
      xpReward: 15,
      target: 1,
      progress: 1,
      difficulty: "easy",
      expiresAt: today,
      isCompleted: true,
      isClaimed: false,
    },
    {
      id: "daily-candidatos",
      type: "candidatos",
      title: "Avaliador Dedicado",
      description: "Avalie 3 candidatos hoje",
      icon: Users,
      xpReward: 45,
      bonusXP: 15,
      target: 3,
      progress: 2,
      difficulty: "medium",
      expiresAt: today,
      isCompleted: false,
      isClaimed: false,
    },
    {
      id: "daily-games",
      type: "games",
      title: "Jogador do Dia",
      description: "Complete 2 jogos de gamificação",
      icon: Zap,
      xpReward: 60,
      bonusXP: 20,
      target: 2,
      progress: 0,
      difficulty: "medium",
      expiresAt: today,
      isCompleted: false,
      isClaimed: false,
    },
    {
      id: "daily-streak",
      type: "streak",
      title: "Mestre do Streak",
      description: "Mantenha seu streak ativo por mais 1 dia",
      icon: Flame,
      xpReward: 100,
      bonusXP: 50,
      target: 1,
      progress: 0,
      difficulty: "hard",
      expiresAt: today,
      isCompleted: false,
      isClaimed: false,
    },
  ];
};
