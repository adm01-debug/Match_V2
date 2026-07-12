import { logger } from '@/services/logger';
import { supabase } from '@/integrations/supabase/client';
import { defaultState, type GamificationState, type XPTransaction } from './types';
import { loadFromLocalStorage, saveToLocalStorage } from './storage';

export interface LoadedGamification {
  state: GamificationState;
  transactions: XPTransaction[];
}

export const loadFromSupabase = async (userId: string): Promise<LoadedGamification> => {
  try {
    const [gam, ach, badges, trans] = await Promise.all([
      supabase.from('user_gamification').select('*').eq('user_id', userId).maybeSingle(),
      supabase.from('user_achievements').select('achievement_id').eq('user_id', userId),
      supabase.from('user_badges').select('badge_id').eq('user_id', userId),
      supabase.from('xp_transactions').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20),
    ]);

    if (gam.error) throw gam.error;
    if (ach.error) throw ach.error;
    if (badges.error) throw badges.error;
    if (trans.error) throw trans.error;

    if (gam.data) {
      const state: GamificationState = {
        xp: gam.data.xp || 0,
        level: gam.data.level || 1,
        streak: gam.data.streak || 0,
        longestStreak: gam.data.longest_streak || 0,
        lastActiveDate: gam.data.last_active_date,
        totalActions: gam.data.total_actions || 0,
        achievements: ach.data?.map((a) => a.achievement_id) || [],
        badges: badges.data?.map((b) => b.badge_id) || [],
      };
      saveToLocalStorage(state);
      return { state, transactions: (trans.data as XPTransaction[]) || [] };
    }

    // Create initial record
    const { error: createError } = await supabase
      .from('user_gamification')
      .insert({ user_id: userId, xp: 0, level: 1, streak: 0, longest_streak: 0 });
    if (createError && createError.code !== '23505') throw createError;

    return { state: defaultState, transactions: [] };
  } catch (error) {
    logger.error('Error loading gamification from Supabase:', error);
    return { state: loadFromLocalStorage(), transactions: [] };
  }
};
