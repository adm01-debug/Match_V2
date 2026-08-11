export interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  totalActions: number;
  achievements: string[];
  badges: string[];
}

export interface XPTransaction {
  id: string;
  action: string;
  amount: number;
  description: string | null;
  multiplier: number | null;
  created_at: string;
}

export const defaultState: GamificationState = {
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  totalActions: 0,
  achievements: [],
  badges: [],
};

export const LOCAL_STORAGE_KEY = 'user-gamification';
