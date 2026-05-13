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
import { supabase } from '@/integrations/supabase/client';
import { useSoundPreferences } from './useSoundPreferences';
import { useAuth } from '@/contexts/AuthContext';

const LOCAL_STORAGE_KEY = 'user-gamification';

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
export const xpRewards: Record<string, { amount: number; description: string }> = {
  // Recrutamento
  candidatoAdicionado: { amount: 10, description: 'Candidato adicionado ao sistema' },
  candidatoAvaliado: { amount: 15, description: 'Candidato avaliado' },
  entrevistaAgendada: { amount: 20, description: 'Entrevista agendada' },
  entrevistaRealizada: { amount: 30, description: 'Entrevista realizada' },
  candidatoContratado: { amount: 100, description: 'Candidato contratado com sucesso' },
  
  // Vagas
  vagaCriada: { amount: 25, description: 'Nova vaga criada' },
  vagaPublicada: { amount: 15, description: 'Vaga publicada' },
  vagaPreenchida: { amount: 75, description: 'Vaga preenchida com sucesso' },
  
  // Pipeline
  candidatoMovido: { amount: 5, description: 'Candidato movido no pipeline' },
  etapaConcluida: { amount: 20, description: 'Etapa concluída' },
  
  // Comunicação
  emailEnviado: { amount: 5, description: 'Email enviado ao candidato' },
  feedbackEnviado: { amount: 15, description: 'Feedback enviado' },
  
  // Sistema
  loginDiario: { amount: 10, description: 'Login diário' },
  perfilAtualizado: { amount: 20, description: 'Perfil atualizado' },
  configSalva: { amount: 5, description: 'Configuração salva' },
  
  // Assessments gamificados
  miniGameCompleto: { amount: 25, description: 'Mini-game completado' },
  assessmentCompleto: { amount: 50, description: 'Assessment completo' },
  
  // Conquistas especiais
  primeiraContratacao: { amount: 200, description: 'Primeira contratação!' },
  dezContratacoes: { amount: 500, description: '10 contratações alcançadas!' },
  streakSemanal: { amount: 100, description: 'Streak de 7 dias!' },
  streakMensal: { amount: 500, description: 'Streak de 30 dias!' },
};

export function useGamificationSupabase() {
  const [state, setState] = useState<GamificationState>(defaultState);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [levelUpData, setLevelUpData] = useState<{ oldLevel: number; newLevel: number } | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<XPTransaction[]>([]);
  const { playSound } = useSoundPreferences();
  const { user } = useAuth();

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
