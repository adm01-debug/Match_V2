export type MiniGameType =
  | 'quick-choice'
  | 'word-association'
  | 'scenario-pick'
  | 'this-or-that'
  | 'priority-sort';

export interface MiniGameOption {
  id: string;
  text: string;
  emoji?: string;
  trait?: string;
}

export interface MiniGameQuestion {
  id: string;
  type: MiniGameType;
  prompt: string;
  options: MiniGameOption[];
  timeLimit?: number;
  xpReward: number;
}

export interface MiniGameResult {
  gameId: string;
  selectedOption: string;
  responseTime: number;
  earnedXP: number;
  trait?: string;
}

export const QUICK_TIME_BONUS = 5;
