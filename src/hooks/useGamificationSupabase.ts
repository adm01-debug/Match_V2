/**
 * @fileoverview Hook for managing gamification with Supabase persistence
 * @module useGamificationSupabase
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSoundPreferences } from './useSoundPreferences';
import { useAuth } from '@/contexts/AuthContext';
import { levels, xpRewards } from '@/domain/gamification/constants';
import { calculateLevel, calculateLevelProgress } from '@/domain/gamification/calculator';
const LOCAL_STORAGE_KEY = 'user-gamification';

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

const defaultState: GamificationState = {
  xp: 0,
  level: 1,
  streak: 0,
  longestStreak: 0,
  lastActiveDate: null,
  totalActions: 0,
  achievements: [],
  badges: [],
};
export function useGamificationSupabase() {
  const [state, setState] = useState<GamificationState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ oldLevel: number; newLevel: number } | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<XPTransaction[]>([]);
  const { playSound } = useSoundPreferences();
  const { user } = useAuth();

  // Load from localStorage (for offline/guest mode)
  const loadFromLocalStorage = useCallback(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...defaultState, ...parsed };
      }
    } catch (error) {
      console.error('Error loading gamification from localStorage:', error);
    }
    return defaultState;
  }, []);

  // Save to localStorage
  const saveToLocalStorage = useCallback((newState: GamificationState) => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Error saving gamification to localStorage:', error);
    }
  }, []);

  // Load from Supabase
  const loadFromSupabase = useCallback(async (userId: string) => {
    try {
      // Load gamification state
      const { data: gamData, error: gamError } = await supabase
        .from('user_gamification')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (gamError) throw gamError;

      // Load achievements
      const { data: achievementsData, error: achError } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);

      if (achError) throw achError;

      // Load badges
      const { data: badgesData, error: badgeError } = await supabase
        .from('user_badges')
        .select('badge_id')
        .eq('user_id', userId);

      if (badgeError) throw badgeError;

      // Load recent transactions
      const { data: transData, error: transError } = await supabase
        .from('xp_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (transError) throw transError;

      if (gamData) {
        const loadedState: GamificationState = {
          xp: gamData.xp || 0,
          level: gamData.level || 1,
          streak: gamData.streak || 0,
          longestStreak: gamData.longest_streak || 0,
          lastActiveDate: gamData.last_active_date,
          totalActions: gamData.total_actions || 0,
          achievements: achievementsData?.map(a => a.achievement_id) || [],
          badges: badgesData?.map(b => b.badge_id) || [],
        };

        setState(loadedState);
        saveToLocalStorage(loadedState);
        setRecentTransactions(transData || []);
        return loadedState;
      } else {
        // Create initial record for user
        const { error: createError } = await supabase
          .from('user_gamification')
          .insert({
            user_id: userId,
            xp: 0,
            level: 1,
            streak: 0,
            longest_streak: 0,
          });

        if (createError && createError.code !== '23505') { // Ignore duplicate key
          throw createError;
        }

        return defaultState;
      }
    } catch (error) {
      console.error('Error loading gamification from Supabase:', error);
      // Fallback to localStorage
      return loadFromLocalStorage();
    }
  }, [loadFromLocalStorage, saveToLocalStorage]);

  // Initial load
  useEffect(() => {
    const load = async () => {
      // First load from localStorage for instant UI
      const localState = loadFromLocalStorage();
      setState(localState);

      if (user?.id) {
        // Then sync with Supabase
        setIsSyncing(true);
        await loadFromSupabase(user.id);
        setIsSyncing(false);
      }

      setIsLoaded(true);
    };

    load();
  }, [user?.id, loadFromLocalStorage, loadFromSupabase]);

  // Add XP using Supabase function
  const addXP = useCallback(async (amount: number, action: string, description?: string, multiplier: number = 1) => {
    const oldLevel = state.level;
    
    // Optimistic update for instant feedback
    const newXP = state.xp + Math.round(amount * multiplier);
    const newLevel = calculateLevel(newXP);
    const leveldUp = newLevel > oldLevel;

    setState(prev => {
      const updated = {
        ...prev,
        xp: newXP,
        level: newLevel,
        totalActions: prev.totalActions + 1,
      };
      saveToLocalStorage(updated);
      return updated;
    });

    // Play sound
    if (leveldUp) {
      setLevelUpData({ oldLevel, newLevel });
      playSound('levelUp');
    } else if (amount >= 50) {
      playSound('celebration');
    } else {
      playSound('success');
    }

    // Persist to Supabase
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

        // Update with actual server values
        if (data && data[0]) {
          const result = data[0];
          setState(prev => ({
            ...prev,
            xp: result.new_xp,
            level: result.new_level,
          }));

          if (result.leveled_up && !leveldUp) {
            setLevelUpData({ oldLevel, newLevel: result.new_level });
            playSound('levelUp');
          }
        }
      } catch (error) {
        console.error('Error adding XP to Supabase:', error);
        // Keep optimistic update on error
      }
    }
  }, [state.xp, state.level, calculateLevel, user?.id, playSound, saveToLocalStorage]);

  // Award XP for specific action
  const rewardAction = useCallback((actionKey: keyof typeof xpRewards) => {
    const reward = xpRewards[actionKey];
    if (reward) {
      addXP(reward.amount, actionKey, reward.description);
    }
  }, [addXP]);

  // Update streak using Supabase function
  const updateStreak = useCallback(async () => {
    const today = new Date().toDateString();
    
    if (state.lastActiveDate === today) {
      return; // Already counted today
    }

    // Optimistic update
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const wasActiveYesterday = state.lastActiveDate === yesterday.toDateString();
    const newStreak = wasActiveYesterday ? state.streak + 1 : 1;

    setState(prev => {
      const updated = {
        ...prev,
        streak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastActiveDate: today,
      };
      saveToLocalStorage(updated);
      return updated;
    });

    // Persist to Supabase
    if (user?.id) {
      try {
        const { data, error } = await supabase.rpc('update_user_streak', {
          p_user_id: user.id,
        });

        if (error) throw error;

        if (data && data[0]) {
          const result = data[0];
          setState(prev => ({
            ...prev,
            streak: result.new_streak,
          }));

          // Award bonus XP for streaks
          if (result.streak_bonus > 0) {
            if (result.new_streak === 7) {
              playSound('achievement');
            } else if (result.new_streak === 30) {
              playSound('celebration');
            }
          }
        }
      } catch (error) {
        console.error('Error updating streak in Supabase:', error);
      }
    }
  }, [state.lastActiveDate, state.streak, state.longestStreak, user?.id, playSound, saveToLocalStorage]);

  // Unlock achievement
  const unlockAchievement = useCallback(async (achievementId: string) => {
    if (state.achievements.includes(achievementId)) return;

    // Optimistic update
    setState(prev => ({
      ...prev,
      achievements: [...prev.achievements, achievementId],
    }));

    playSound('achievement');

    // Persist to Supabase
    if (user?.id) {
      try {
        const { error } = await supabase
          .from('user_achievements')
          .insert({
            user_id: user.id,
            achievement_id: achievementId,
          });

        if (error && error.code !== '23505') { // Ignore duplicate
          throw error;
        }
      } catch (error) {
        console.error('Error unlocking achievement in Supabase:', error);
      }
    }
  }, [state.achievements, user?.id, playSound]);

  // Award badge
  const awardBadge = useCallback(async (badgeId: string) => {
    if (state.badges.includes(badgeId)) return;

    // Optimistic update
    setState(prev => ({
      ...prev,
      badges: [...prev.badges, badgeId],
    }));

    playSound('achievement');

    // Persist to Supabase
    if (user?.id) {
      try {
        const { error } = await supabase
          .from('user_badges')
          .insert({
            user_id: user.id,
            badge_id: badgeId,
          });

        if (error && error.code !== '23505') { // Ignore duplicate
          throw error;
        }
      } catch (error) {
        console.error('Error awarding badge in Supabase:', error);
      }
    }
  }, [state.badges, user?.id, playSound]);

  // Clear level up notification
  const clearLevelUp = useCallback(() => {
    setLevelUpData(null);
  }, []);

  // Get current level info
  const currentLevel = useMemo(() => {
    return levels.find(l => l.level === state.level) ?? levels[0];
  }, [state.level]);

  // Get next level info
  const nextLevel = useMemo(() => {
    return levels.find(l => l.level === state.level + 1);
  }, [state.level]);

  const levelProgress = useMemo(() => {
    return calculateLevelProgress(state.xp, state.level);
  }, [state.xp, state.level]);

  // XP needed for next level
  const xpToNextLevel = useMemo(() => {
    if (!nextLevel) return 0;
    return nextLevel.minXP - state.xp;
  }, [state.xp, nextLevel]);

  // Reset (for testing)
  const resetProgress = useCallback(async () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setState(defaultState);

    if (user?.id) {
      try {
        // Delete all user gamification data
        await Promise.all([
          supabase.from('user_gamification').delete().eq('user_id', user.id),
          supabase.from('user_achievements').delete().eq('user_id', user.id),
          supabase.from('user_badges').delete().eq('user_id', user.id),
          supabase.from('xp_transactions').delete().eq('user_id', user.id),
        ]);
      } catch (error) {
        console.error('Error resetting progress in Supabase:', error);
      }
    }
  }, [user?.id]);

  // Refresh data from Supabase
  const refresh = useCallback(async () => {
    if (user?.id) {
      setIsSyncing(true);
      await loadFromSupabase(user.id);
      setIsSyncing(false);
    }
  }, [user?.id, loadFromSupabase]);

  return {
    // State
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
    
    // Level info
    currentLevel,
    nextLevel,
    levelProgress,
    xpToNextLevel,
    levels,
    
    // Level up notification
    levelUpData,
    clearLevelUp,
    
    // Transaction history
    recentTransactions,
    
    // Actions
    addXP,
    rewardAction,
    updateStreak,
    unlockAchievement,
    awardBadge,
    resetProgress,
    refresh,
  };
}
