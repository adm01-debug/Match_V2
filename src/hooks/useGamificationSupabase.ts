/**
 * @fileoverview Hook for managing gamification with Supabase persistence
 * @module useGamificationSupabase
 */

import { logger } from '@/services/logger';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSoundPreferences } from './useSoundPreferences';
import { useAuth } from '@/contexts/AuthContext';
import { levels, xpRewards } from '@/domain/gamification/constants';
import { calculateLevel, calculateLevelProgress } from '@/domain/gamification/calculator';
import {
  defaultState,
  type GamificationState,
  type XPTransaction,
} from './gamification/types';
import {
  loadFromLocalStorage,
  saveToLocalStorage,
  clearLocalStorage,
} from './gamification/storage';
import { loadFromSupabase } from './gamification/loader';

export type { GamificationState, XPTransaction };

export function useGamificationSupabase() {
  const [state, setState] = useState<GamificationState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ oldLevel: number; newLevel: number } | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<XPTransaction[]>([]);
  const { playSound } = useSoundPreferences();
  const { user } = useAuth();

  const syncFromSupabase = useCallback(async (userId: string) => {
    const { state: loaded, transactions } = await loadFromSupabase(userId);
    setState(loaded);
    setRecentTransactions(transactions);
  }, []);

  // Initial load
  useEffect(() => {
    const load = async () => {
      setState(loadFromLocalStorage());
      if (user?.id) {
        setIsSyncing(true);
        await syncFromSupabase(user.id);
        setIsSyncing(false);
      }
      setIsLoaded(true);
    };
    load();
  }, [user?.id, syncFromSupabase]);

  const addXP = useCallback(
    async (amount: number, action: string, description?: string, multiplier: number = 1) => {
      const oldLevel = state.level;
      const newXP = state.xp + Math.round(amount * multiplier);
      const newLevel = calculateLevel(newXP);
      const leveldUp = newLevel > oldLevel;

      setState((prev) => {
        const updated = { ...prev, xp: newXP, level: newLevel, totalActions: prev.totalActions + 1 };
        saveToLocalStorage(updated);
        return updated;
      });

      if (leveldUp) {
        setLevelUpData({ oldLevel, newLevel });
        playSound('levelUp');
      } else if (amount >= 50) {
        playSound('celebration');
      } else {
        playSound('success');
      }

      if (user?.id) {
        try {
          const { data, error } = await supabase.rpc('add_user_xp', {
            p_user_id: user.id,
            p_amount: amount,
            p_action: action,
            p_description: description ?? undefined,
            p_multiplier: multiplier,
          });
          if (error) throw error;
          if (data && data[0]) {
            const result = data[0];
            setState((prev) => ({ ...prev, xp: result.new_xp, level: result.new_level }));
            if (result.leveled_up && !leveldUp) {
              setLevelUpData({ oldLevel, newLevel: result.new_level });
              playSound('levelUp');
            }
          }
        } catch (error) {
          logger.error('Error adding XP to Supabase:', error);
        }
      }
    },
    [state.xp, state.level, user?.id, playSound]
  );

  const rewardAction = useCallback(
    (actionKey: keyof typeof xpRewards) => {
      const reward = xpRewards[actionKey];
      if (reward) addXP(reward.amount, actionKey, reward.description);
    },
    [addXP]
  );

  const updateStreak = useCallback(async () => {
    const today = new Date().toDateString();
    if (state.lastActiveDate === today) return;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const wasActiveYesterday = state.lastActiveDate === yesterday.toDateString();
    const newStreak = wasActiveYesterday ? state.streak + 1 : 1;

    setState((prev) => {
      const updated = {
        ...prev,
        streak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastActiveDate: today,
      };
      saveToLocalStorage(updated);
      return updated;
    });

    if (user?.id) {
      try {
        const { data, error } = await supabase.rpc('update_user_streak', { p_user_id: user.id });
        if (error) throw error;
        if (data && data[0]) {
          const result = data[0];
          setState((prev) => ({ ...prev, streak: result.new_streak }));
          if (result.streak_bonus > 0) {
            if (result.new_streak === 7) playSound('achievement');
            else if (result.new_streak === 30) playSound('celebration');
          }
        }
      } catch (error) {
        logger.error('Error updating streak in Supabase:', error);
      }
    }
  }, [state.lastActiveDate, state.streak, state.longestStreak, user?.id, playSound]);

  const unlockAchievement = useCallback(
    async (achievementId: string) => {
      if (state.achievements.includes(achievementId)) return;
      setState((prev) => ({ ...prev, achievements: [...prev.achievements, achievementId] }));
      playSound('achievement');
      if (user?.id) {
        try {
          const { error } = await supabase
            .from('user_achievements')
            .insert({ user_id: user.id, achievement_id: achievementId });
          if (error && error.code !== '23505') throw error;
        } catch (error) {
          logger.error('Error unlocking achievement in Supabase:', error);
        }
      }
    },
    [state.achievements, user?.id, playSound]
  );

  const awardBadge = useCallback(
    async (badgeId: string) => {
      if (state.badges.includes(badgeId)) return;
      setState((prev) => ({ ...prev, badges: [...prev.badges, badgeId] }));
      playSound('achievement');
      if (user?.id) {
        try {
          const { error } = await supabase
            .from('user_badges')
            .insert({ user_id: user.id, badge_id: badgeId });
          if (error && error.code !== '23505') throw error;
        } catch (error) {
          logger.error('Error awarding badge in Supabase:', error);
        }
      }
    },
    [state.badges, user?.id, playSound]
  );

  const clearLevelUp = useCallback(() => setLevelUpData(null), []);

  const currentLevel = useMemo(
    () => levels.find((l) => l.level === state.level) ?? levels[0],
    [state.level]
  );
  const nextLevel = useMemo(() => levels.find((l) => l.level === state.level + 1), [state.level]);
  const levelProgress = useMemo(
    () => calculateLevelProgress(state.xp, state.level),
    [state.xp, state.level]
  );
  const xpToNextLevel = useMemo(
    () => (nextLevel ? nextLevel.minXP - state.xp : 0),
    [state.xp, nextLevel]
  );

  const resetProgress = useCallback(async () => {
    clearLocalStorage();
    setState(defaultState);
    if (user?.id) {
      try {
        await Promise.all([
          supabase.from('user_gamification').delete().eq('user_id', user.id),
          supabase.from('user_achievements').delete().eq('user_id', user.id),
          supabase.from('user_badges').delete().eq('user_id', user.id),
          supabase.from('xp_transactions').delete().eq('user_id', user.id),
        ]);
      } catch (error) {
        logger.error('Error resetting progress in Supabase:', error);
      }
    }
  }, [user?.id]);

  const refresh = useCallback(async () => {
    if (user?.id) {
      setIsSyncing(true);
      await syncFromSupabase(user.id);
      setIsSyncing(false);
    }
  }, [user?.id, syncFromSupabase]);

  return {
    xp: state.xp,
    level: state.level,
    streak: state.streak,
    longestStreak: state.longestStreak,
    totalActions: state.totalActions,
    achievements: state.achievements,
    badges: state.badges,
    isLoaded,
    isSyncing,
    isAuthenticated: !!user,
    currentLevel,
    nextLevel,
    levelProgress,
    xpToNextLevel,
    levels,
    levelUpData,
    clearLevelUp,
    recentTransactions,
    addXP,
    rewardAction,
    updateStreak,
    unlockAchievement,
    awardBadge,
    resetProgress,
    refresh,
  };
}
