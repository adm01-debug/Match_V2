/**
 * @fileoverview React hook for easy integration of gamification triggers
 * @module useGamificationTriggers
 */

import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { gamificationTriggers, checkMilestoneAchievements } from '@/services/gamificationTriggers';
import { useGamificationSupabase } from './useGamificationSupabase';

/**
 * Hook that provides gamification trigger functions
 * Automatically uses the current authenticated user
 */
export function useGamificationTriggers() {
  const { user } = useAuth();
  const { refresh, rewardAction, updateStreak } = useGamificationSupabase();

  // Helper to execute trigger and refresh state
  const executeTrigger = useCallback(async (
    triggerFn: (userId: string) => Promise<{ success: boolean }>,
    shouldRefresh: boolean = true
  ) => {
    if (!user?.id) return { success: false, error: 'User not authenticated' };
    
    const result = await triggerFn(user.id);
    
    if (result.success && shouldRefresh) {
      await refresh();
    }
    
    return result;
  }, [user?.id, refresh]);

  // Candidato triggers
  const onCandidatoAdicionado = useCallback(() => 
    executeTrigger(gamificationTriggers.onCandidatoAdicionado),
  [executeTrigger]);

  const onCandidatoAvaliado = useCallback(() => 
    executeTrigger(gamificationTriggers.onCandidatoAvaliado),
  [executeTrigger]);

  const onCandidatoMovidoPipeline = useCallback((etapa: string) => 
    executeTrigger((userId) => gamificationTriggers.onCandidatoMovidoPipeline(userId, etapa)),
  [executeTrigger]);

  const onCandidatoContratado = useCallback((candidatoNome: string) => 
    executeTrigger((userId) => gamificationTriggers.onCandidatoContratado(userId, candidatoNome)),
  [executeTrigger]);

  // Entrevista triggers
  const onEntrevistaAgendada = useCallback(() => 
    executeTrigger(gamificationTriggers.onEntrevistaAgendada),
  [executeTrigger]);

  const onEntrevistaRealizada = useCallback(() => 
    executeTrigger(gamificationTriggers.onEntrevistaRealizada),
  [executeTrigger]);

  const onFeedbackEnviado = useCallback(() => 
    executeTrigger(gamificationTriggers.onFeedbackEnviado),
  [executeTrigger]);

  // Vaga triggers
  const onVagaCriada = useCallback((vagaTitulo: string) => 
    executeTrigger((userId) => gamificationTriggers.onVagaCriada(userId, vagaTitulo)),
  [executeTrigger]);

  const onVagaPublicada = useCallback(() => 
    executeTrigger(gamificationTriggers.onVagaPublicada),
  [executeTrigger]);

  const onVagaPreenchida = useCallback((vagaTitulo: string) => 
    executeTrigger((userId) => gamificationTriggers.onVagaPreenchida(userId, vagaTitulo)),
  [executeTrigger]);

  // Communication triggers
  const onEmailEnviado = useCallback(() => 
    executeTrigger(gamificationTriggers.onEmailEnviado),
  [executeTrigger]);

  // System triggers
  const onLoginDiario = useCallback(async () => {
    const result = await executeTrigger(gamificationTriggers.onLoginDiario);
    // Also update streak on daily login
    await updateStreak();
    return result;
  }, [executeTrigger, updateStreak]);

  const onPerfilAtualizado = useCallback(() => 
    executeTrigger(gamificationTriggers.onPerfilAtualizado),
  [executeTrigger]);

  const onConfigSalva = useCallback(() => 
    executeTrigger(gamificationTriggers.onConfigSalva),
  [executeTrigger]);

  // Assessment triggers
  const onMiniGameCompleto = useCallback((xpEarned: number) => 
    executeTrigger((userId) => gamificationTriggers.onMiniGameCompleto(userId, xpEarned)),
  [executeTrigger]);

  const onAssessmentCompleto = useCallback((assessmentName: string, xpEarned: number) => 
    executeTrigger((userId) => gamificationTriggers.onAssessmentCompleto(userId, assessmentName, xpEarned)),
  [executeTrigger]);

  // Milestone check
  const checkMilestones = useCallback(async () => {
    if (!user?.id) return;
    await checkMilestoneAchievements(user.id);
    await refresh();
  }, [user?.id, refresh]);

  // Quick action for localStorage-based gamification (for non-auth scenarios)
  const quickReward = useCallback((action: Parameters<typeof rewardAction>[0]) => {
    rewardAction(action);
  }, [rewardAction]);

  return {
    // Is user authenticated for Supabase persistence
    isAuthenticated: !!user,
    
    // Candidato triggers
    onCandidatoAdicionado,
    onCandidatoAvaliado,
    onCandidatoMovidoPipeline,
    onCandidatoContratado,
    
    // Entrevista triggers
    onEntrevistaAgendada,
    onEntrevistaRealizada,
    onFeedbackEnviado,
    
    // Vaga triggers
    onVagaCriada,
    onVagaPublicada,
    onVagaPreenchida,
    
    // Communication triggers
    onEmailEnviado,
    
    // System triggers
    onLoginDiario,
    onPerfilAtualizado,
    onConfigSalva,
    
    // Assessment triggers
    onMiniGameCompleto,
    onAssessmentCompleto,
    
    // Utilities
    checkMilestones,
    quickReward,
    refresh,
  };
}
