import type { Target } from "lucide-react";

export type ChallengeType =
  | "login"
  | "candidatos"
  | "entrevistas"
  | "vagas"
  | "avaliacoes"
  | "games"
  | "streak";

export type ChallengeDifficulty = "easy" | "medium" | "hard" | "epic";

export interface DailyChallenge {
  id: string;
  type: ChallengeType;
  title: string;
  description: string;
  icon: typeof Target;
  xpReward: number;
  bonusXP?: number;
  target: number;
  progress: number;
  difficulty: ChallengeDifficulty;
  expiresAt: Date;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface DifficultyStyle {
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}
