/**
 * @fileoverview Service for automatic gamification triggers based on system actions
 * @module gamificationTriggers
 */

import { logger } from '@/services/logger';
import { supabase } from '@/integrations/supabase/client';

export interface GamificationTriggerResult {
  success: boolean;
  xpAwarded?: number;
  newLevel?: number;
  leveledUp?: boolean;
  error?: string;
}

/**
 * Awards XP directly via Supabase RPC
 * Use this for server-side or automatic triggers
 */
export async function awardXP(
  userId: string,
  amount: number,
  action: string,
  description?: string,
  multiplier: number = 1
): Promise<GamificationTriggerResult> {
  try {
    const { data, error } = await supabase.rpc('add_user_xp', {
      p_user_id: userId,
      p_amount: amount,
      p_action: action,
      p_description: description ?? undefined,
      p_multiplier: multiplier,
    });

    if (error) throw error;

    if (data && data[0]) {
      return {
        success: true,
        xpAwarded: Math.round(amount * multiplier),
        newLevel: data[0].new_level,
        leveledUp: data[0].leveled_up,
      };
    }

    return { success: true, xpAwarded: amount };
  } catch (error) {
    logger.error('Error awarding XP:', error);
    return { success: false, error: String(error) };
  }
}

/**
 * Trigger definitions for automatic XP rewards
 */
export const gamificationTriggers = {
  // Candidato Actions
  onCandidatoAdicionado: async (userId: string) => {
    return awardXP(userId, 10, 'candidatoAdicionado', 'Candidato adicionado ao sistema');
  },

  onCandidatoAvaliado: async (userId: string) => {
    return awardXP(userId, 15, 'candidatoAvaliado', 'Candidato avaliado');
  },

  onCandidatoMovidoPipeline: async (userId: string, etapa: string) => {
    return awardXP(userId, 5, 'candidatoMovido', `Candidato movido para etapa: ${etapa}`);
  },

  onCandidatoContratado: async (userId: string, candidatoNome: string) => {
    return awardXP(userId, 100, 'candidatoContratado', `Candidato ${candidatoNome} contratado!`);
  },

  // Entrevista Actions
  onEntrevistaAgendada: async (userId: string) => {
    return awardXP(userId, 20, 'entrevistaAgendada', 'Entrevista agendada');
  },

  onEntrevistaRealizada: async (userId: string) => {
    return awardXP(userId, 30, 'entrevistaRealizada', 'Entrevista realizada com sucesso');
  },

  onFeedbackEnviado: async (userId: string) => {
    return awardXP(userId, 15, 'feedbackEnviado', 'Feedback de entrevista enviado');
  },

  // Vaga Actions
  onVagaCriada: async (userId: string, vagaTitulo: string) => {
    return awardXP(userId, 25, 'vagaCriada', `Vaga "${vagaTitulo}" criada`);
  },

  onVagaPublicada: async (userId: string) => {
    return awardXP(userId, 15, 'vagaPublicada', 'Vaga publicada');
  },

  onVagaPreenchida: async (userId: string, vagaTitulo: string) => {
    return awardXP(userId, 75, 'vagaPreenchida', `Vaga "${vagaTitulo}" preenchida!`);
  },

  // Communication Actions
  onEmailEnviado: async (userId: string) => {
    return awardXP(userId, 5, 'emailEnviado', 'Email enviado ao candidato');
  },

  // System Actions
  onLoginDiario: async (userId: string) => {
    // First check if user already got login XP today
    const today = new Date().toISOString().split('T')[0];
    
    const { data: existingLogin } = await supabase
      .from('xp_transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('action', 'loginDiario')
      .gte('created_at', `${today}T00:00:00`)
      .limit(1);

    if (existingLogin && existingLogin.length > 0) {
      return { success: true, xpAwarded: 0 }; // Already got today's login XP
    }

    return awardXP(userId, 10, 'loginDiario', 'Login diário');
  },

  onPerfilAtualizado: async (userId: string) => {
    return awardXP(userId, 20, 'perfilAtualizado', 'Perfil atualizado');
  },

  onConfigSalva: async (userId: string) => {
    return awardXP(userId, 5, 'configSalva', 'Configuração salva');
  },

  // Assessment Actions
  onMiniGameCompleto: async (userId: string, xpEarned: number) => {
    return awardXP(userId, xpEarned, 'miniGameCompleto', 'Mini-game completado');
  },

  onAssessmentCompleto: async (userId: string, assessmentName: string, xpEarned: number) => {
    return awardXP(userId, xpEarned, 'assessmentCompleto', `Assessment "${assessmentName}" completado`);
  },
};

/**
 * Hook helper to integrate triggers with React components
 */
export function createTriggerCallback<T extends keyof typeof gamificationTriggers>(
  trigger: T,
  ...args: Parameters<typeof gamificationTriggers[T]> extends [string, ...infer R] ? R : never[]
) {
  return async (userId: string) => {
    const triggerFn = gamificationTriggers[trigger] as (userId: string, ...args: unknown[]) => Promise<GamificationTriggerResult>;
    return triggerFn(userId, ...args);
  };
}

/**
 * Check and award milestone achievements
 */
export async function checkMilestoneAchievements(userId: string): Promise<void> {
  try {
    // Check total hires
    const { count: hiresCount } = await supabase
      .from('processos_seletivos')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'contratado');

    // Check existing achievements
    const { data: existingAchievements } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    const unlockedIds = new Set(existingAchievements?.map(a => a.achievement_id) || []);

    // First hire
    if (hiresCount && hiresCount >= 1 && !unlockedIds.has('primeiraContratacao')) {
      const { error: e1 } = await supabase.from('user_achievements').insert({
        user_id: userId,
        achievement_id: 'primeiraContratacao',
      });
      if (e1) logger.error('[gamification] insert primeiraContratacao failed', e1);
      else await awardXP(userId, 200, 'primeiraContratacao', 'Primeira contratação realizada!');
    }

    // 10 hires
    if (hiresCount && hiresCount >= 10 && !unlockedIds.has('dezContratacoes')) {
      const { error: e2 } = await supabase.from('user_achievements').insert({
        user_id: userId,
        achievement_id: 'dezContratacoes',
      });
      if (e2) logger.error('[gamification] insert dezContratacoes failed', e2);
      else await awardXP(userId, 500, 'dezContratacoes', '10 contratações alcançadas!');
    }

    // Check streak milestones
    const { data: gamData } = await supabase
      .from('user_gamification')
      .select('streak')
      .eq('user_id', userId)
      .single();

    if (gamData) {
      if (gamData.streak >= 7 && !unlockedIds.has('streakSemanal')) {
        const { error: e3 } = await supabase.from('user_achievements').insert({
          user_id: userId,
          achievement_id: 'streakSemanal',
        });
        if (e3) logger.error('[gamification] insert streakSemanal failed', e3);
      }

      if (gamData.streak >= 30 && !unlockedIds.has('streakMensal')) {
        const { error: e4 } = await supabase.from('user_achievements').insert({
          user_id: userId,
          achievement_id: 'streakMensal',
        });
        if (e4) logger.error('[gamification] insert streakMensal failed', e4);
      }
    }
  } catch (error) {
    logger.error('Error checking milestone achievements:', error);
  }
}
