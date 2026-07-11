/**
 * @fileoverview Configuração e tipos do motor de avaliação gamificada
 */

export interface GamifiedQuestion {
  id: string;
  text: string;
  type: 'swipe' | 'choice' | 'scale' | 'ranking' | 'quick-fire';
  options?: { id: string; text: string; emoji?: string }[];
  category: string;
  xpReward: number;
  timeBonus?: number;
}

export interface AssessmentAnswer {
  answer: string | number | boolean | string[] | Record<string, unknown>;
  responseTime: number;
  combo: number;
}

export interface AssessmentStats {
  totalXP: number;
  comboMax: number;
  fastAnswers: number;
  timeElapsed: number;
  accuracy: number;
  badges: string[];
}

export interface ComboState {
  count: number;
  multiplier: number;
  lastAnswerTime: number;
}

export type EnginePhase = 'intro' | 'playing' | 'complete';
export type EngineTheme = 'default' | 'playful' | 'minimal' | 'cosmic';

export const COMBO_THRESHOLD = 3000;
export const FAST_ANSWER_THRESHOLD = 2000;

export const themeStyles: Record<EngineTheme, { bg: string; card: string; accent: string }> = {
  default: {
    bg: 'bg-gradient-to-br from-background via-background to-primary/5',
    card: 'bg-card/90 backdrop-blur-xl border-border/50',
    accent: 'from-primary to-primary/80',
  },
  playful: {
    bg: 'bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10',
    card: 'bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-pink-200/50 dark:border-purple-500/30',
    accent: 'from-pink-500 to-purple-500',
  },
  minimal: {
    bg: 'bg-background',
    card: 'bg-card border-border',
    accent: 'from-foreground to-foreground/80',
  },
  cosmic: {
    bg: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950',
    card: 'bg-white/5 backdrop-blur-xl border-purple-500/20',
    accent: 'from-violet-500 via-fuchsia-500 to-pink-500',
  },
};
