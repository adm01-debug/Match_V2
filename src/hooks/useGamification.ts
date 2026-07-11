/**
 * @fileoverview Hook for managing user XP, levels, and gamification progress
 * @module useGamification
 */

import { logger } from '@/services/logger';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSoundPreferences } from './useSoundPreferences';

const STORAGE_KEY = 'user-gamification';

export interface UserLevel {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  color: string;
  icon: string;
}

export interface GamificationState {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string | null;
  totalActions: number;
  achievements: string[];
  badges: string[];
}

const defaultState: GamificationState = {
  xp: 0,
  level: 1,
  streak: 0,
  lastActiveDate: null,
  totalActions: 0,
  achievements: [],
  badges: [],
};

// Level definitions
export const levels: UserLevel[] = [
  { level: 1, title: 'Iniciante', minXP: 0, maxXP: 100, color: 'text-slate-500', icon: '🌱' },
  { level: 2, title: 'Aprendiz', minXP: 100, maxXP: 300, color: 'text-green-500', icon: '🌿' },
  { level: 3, title: 'Praticante', minXP: 300, maxXP: 600, color: 'text-blue-500', icon: '💪' },
  { level: 4, title: 'Competente', minXP: 600, maxXP: 1000, color: 'text-purple-500', icon: '⭐' },
  { level: 5, title: 'Proficiente', minXP: 1000, maxXP: 1500, color: 'text-amber-500', icon: '🔥' },
  { level: 6, title: 'Especialista', minXP: 1500, maxXP: 2200, color: 'text-orange-500', icon: '💎' },
  { level: 7, title: 'Expert', minXP: 2200, maxXP: 3000, color: 'text-red-500', icon: '🏆' },
  { level: 8, title: 'Mestre', minXP: 3000, maxXP: 4000, color: 'text-pink-500', icon: '👑' },
  { level: 9, title: 'Grão-Mestre', minXP: 4000, maxXP: 5500, color: 'text-violet-500', icon: '🌟' },
  { level: 10, title: 'Lenda', minXP: 5500, maxXP: Infinity, color: 'text-yellow-400', icon: '🏅' },
];

// XP rewards for different actions
export const xpRewards: Record<string, number> = {
  // Recrutamento
  candidatoAdicionado: 10,
  candidatoAvaliado: 15,
  entrevistaAgendada: 20,
  entrevistaRealizada: 30,
  candidatoContratado: 100,
  
  // Vagas
  vagaCriada: 25,
  vagaPublicada: 15,
  vagaPreenchida: 75,
  
  // Pipeline
  candidatoMovido: 5,
  etapaConcluida: 20,
  
  // Comunicação
  emailEnviado: 5,
  feedbackEnviado: 15,
  
  // Sistema
  loginDiario: 10,
  perfilAtualizado: 20,
  configSalva: 5,
  
  // Conquistas
  primeiraContratacao: 200,
  dezContratacoes: 500,
  streakSemanal: 100,
  streakMensal: 500,
};

export function useGamification() {
  const [state, setState] = useState<GamificationState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ oldLevel: number; newLevel: number } | null>(null);
  const { playSound } = useSoundPreferences();

  // Load state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setState({ ...defaultState, ...parsed });
      }
    } catch (error) {
      logger.error('Error loading gamification state:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save state to localStorage
  const saveState = useCallback((newState: Partial<GamificationState>) => {
    setState(prev => {
      const updated = { ...prev, ...newState };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        logger.error('Error saving gamification state:', error);
      }
      return updated;
    });
  }, []);

  // Calculate level from XP
  const calculateLevel = useCallback((xp: number): number => {
    for (let i = levels.length - 1; i >= 0; i--) {
      const level = levels[i];
      if (level && xp >= level.minXP) {
        return level.level;
      }
    }
    return 1;
  }, []);

  // Get current level info
  const currentLevel = useMemo(() => {
    return levels.find(l => l.level === state.level) ?? levels[0];
  }, [state.level]);

  // Get next level info
  const nextLevel = useMemo(() => {
    return levels.find(l => l.level === state.level + 1);
  }, [state.level]);

  // Calculate progress to next level
  const levelProgress = useMemo(() => {
    if (!nextLevel || !currentLevel) return 100;
    const xpInCurrentLevel = state.xp - currentLevel.minXP;
    const xpNeededForLevel = nextLevel.minXP - currentLevel.minXP;
    return Math.min(100, (xpInCurrentLevel / xpNeededForLevel) * 100);
  }, [state.xp, currentLevel, nextLevel]);

  // XP needed for next level
  const xpToNextLevel = useMemo(() => {
    if (!nextLevel) return 0;
    return nextLevel.minXP - state.xp;
  }, [state.xp, nextLevel]);

  // Add XP
  const addXP = useCallback((amount: number, _action?: string) => {
    setState(prev => {
      const newXP = prev.xp + amount;
      const newLevel = calculateLevel(newXP);
      const leveldUp = newLevel > prev.level;

      if (leveldUp) {
        setLevelUpData({ oldLevel: prev.level, newLevel });
        playSound('levelUp');
      } else if (amount >= 50) {
        playSound('celebration');
      } else {
        playSound('success');
      }

      const updated = {
        ...prev,
        xp: newXP,
        level: newLevel,
        totalActions: prev.totalActions + 1,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        logger.error('Error saving XP:', error);
      }

      return updated;
    });
  }, [calculateLevel, playSound]);

  // Award XP for specific action
  const rewardAction = useCallback((action: keyof typeof xpRewards) => {
    const xp = xpRewards[action];
    if (xp) {
      addXP(xp, action);
    }
  }, [addXP]);

  // Update streak
  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    
    setState(prev => {
      if (prev.lastActiveDate === today) {
        return prev; // Already counted today
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const wasActiveYesterday = prev.lastActiveDate === yesterday.toDateString();

      const newStreak = wasActiveYesterday ? prev.streak + 1 : 1;
      
      // Bonus XP for streak milestones
      if (newStreak === 7) {
        const weeklyBonus = xpRewards['streakSemanal'] ?? 100;
        addXP(weeklyBonus, 'streakSemanal');
      } else if (newStreak === 30) {
        const monthlyBonus = xpRewards['streakMensal'] ?? 500;
        addXP(monthlyBonus, 'streakMensal');
      }

      const updated = {
        ...prev,
        streak: newStreak,
        lastActiveDate: today,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        logger.error('Error saving streak:', error);
      }

      return updated;
    });
  }, [addXP]);

  // Unlock achievement
  const unlockAchievement = useCallback((achievementId: string) => {
    if (state.achievements.includes(achievementId)) return;

    playSound('achievement');
    
    saveState({
      achievements: [...state.achievements, achievementId],
    });
  }, [state.achievements, playSound, saveState]);

  // Clear level up notification
  const clearLevelUp = useCallback(() => {
    setLevelUpData(null);
  }, []);

  // Reset (for testing)
  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(defaultState);
  }, []);

  return {
    // State
    xp: state.xp,
    level: state.level,
    streak: state.streak,
    totalActions: state.totalActions,
    achievements: state.achievements,
    badges: state.badges,
    isLoaded,
    
    // Level info
    currentLevel,
    nextLevel,
    levelProgress,
    xpToNextLevel,
    levels,
    
    // Level up notification
    levelUpData,
    clearLevelUp,
    
    // Actions
    addXP,
    rewardAction,
    updateStreak,
    unlockAchievement,
    resetProgress,
  };
}
