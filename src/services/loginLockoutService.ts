/**
 * @fileoverview Login Lockout Service
 * @description Gerencia bloqueio temporário após tentativas de login falhadas
 * com progressão exponencial (1min, 2min, 4min, 8min, 16min, 32min max)
 */

import { supabase } from '@/integrations/supabase/client';

export interface LockoutStatus {
  isLocked: boolean;
  attemptsRemaining: number;
  lockoutUntil: Date | null;
  lockoutMinutes: number;
}

const MAX_ATTEMPTS = 5;
const BASE_LOCKOUT_MINUTES = 1; // 1 minuto inicial
const MAX_LOCKOUT_MINUTES = 32; // Máximo de 32 minutos

/**
 * Calcula o tempo de bloqueio com progressão exponencial
 * 1ª vez: 1min, 2ª: 2min, 3ª: 4min, 4ª: 8min, 5ª: 16min, 6ª+: 32min
 */
const calculateLockoutMinutes = (lockoutCount: number): number => {
  const minutes = BASE_LOCKOUT_MINUTES * Math.pow(2, lockoutCount);
  return Math.min(minutes, MAX_LOCKOUT_MINUTES);
};

/**
 * Formata o tempo restante de bloqueio para exibição
 */
export const formatLockoutTime = (lockoutUntil: Date): string => {
  const now = new Date();
  const diffMs = lockoutUntil.getTime() - now.getTime();
  
  if (diffMs <= 0) return '';
  
  const diffMinutes = Math.ceil(diffMs / 60000);
  const diffSeconds = Math.ceil((diffMs % 60000) / 1000);
  
  if (diffMinutes > 1) {
    return `${diffMinutes} minutos`;
  } else if (diffMinutes === 1) {
    return `1 minuto`;
  } else {
    return `${diffSeconds} segundos`;
  }
};

/**
 * Verifica o status de bloqueio para um identificador (email)
 */
export const checkLockoutStatus = async (email: string): Promise<LockoutStatus> => {
  try {
    const { data, error } = await supabase
      .from('login_attempts')
      .select('*')
      .eq('identifier', email.toLowerCase())
      .eq('attempt_type', 'email')
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao verificar status de bloqueio:', error);
    }

    if (!data) {
      return {
        isLocked: false,
        attemptsRemaining: MAX_ATTEMPTS,
        lockoutUntil: null,
        lockoutMinutes: 0
      };
    }

    const now = new Date();
    const lockoutUntil = data.locked_until ? new Date(data.locked_until) : null;
    const isLocked = lockoutUntil ? lockoutUntil > now : false;

    // Se estava bloqueado mas o tempo passou, resetar
    if (lockoutUntil && lockoutUntil <= now) {
      return {
        isLocked: false,
        attemptsRemaining: MAX_ATTEMPTS,
        lockoutUntil: null,
        lockoutMinutes: 0
      };
    }

    const attemptsRemaining = Math.max(0, MAX_ATTEMPTS - data.attempts_count);
    const lockoutMinutes = lockoutUntil 
      ? Math.ceil((lockoutUntil.getTime() - now.getTime()) / 60000)
      : 0;

    return {
      isLocked,
      attemptsRemaining,
      lockoutUntil,
      lockoutMinutes
    };
  } catch (error) {
    console.error('Erro ao verificar lockout:', error);
    return {
      isLocked: false,
      attemptsRemaining: MAX_ATTEMPTS,
      lockoutUntil: null,
      lockoutMinutes: 0
    };
  }
};

/**
 * Registra uma tentativa de login falhada
 */
export const recordFailedAttempt = async (email: string): Promise<LockoutStatus> => {
  const normalizedEmail = email.toLowerCase();
  
  try {
    // Buscar registro existente
    const { data: existing } = await supabase
      .from('login_attempts')
      .select('*')
      .eq('identifier', normalizedEmail)
      .eq('attempt_type', 'email')
      .single();

    const now = new Date();

    if (existing) {
      // Verificar se o bloqueio anterior expirou
      const lockoutUntil = existing.locked_until ? new Date(existing.locked_until) : null;
      const wasLocked = lockoutUntil && lockoutUntil > now;

      if (wasLocked) {
        // Ainda está bloqueado, retornar status atual
        return {
          isLocked: true,
          attemptsRemaining: 0,
          lockoutUntil,
          lockoutMinutes: Math.ceil((lockoutUntil.getTime() - now.getTime()) / 60000)
        };
      }

      // Calcular quantas vezes já foi bloqueado (para progressão exponencial)
      const lockoutCount = Math.floor(existing.attempts_count / MAX_ATTEMPTS);
      const newAttempts = lockoutUntil && lockoutUntil <= now 
        ? 1 // Reset após expiração do bloqueio
        : existing.attempts_count + 1;

      let newLockoutUntil: string | null = null;
      
      if (newAttempts >= MAX_ATTEMPTS) {
        const lockoutMinutes = calculateLockoutMinutes(lockoutCount);
        newLockoutUntil = new Date(now.getTime() + lockoutMinutes * 60000).toISOString();
      }

      const { error } = await supabase
        .from('login_attempts')
        .update({
          attempts_count: newAttempts,
          last_attempt_at: now.toISOString(),
          locked_until: newLockoutUntil
        })
        .eq('id', existing.id);

      if (error) {
        console.error('Erro ao atualizar tentativas:', error);
      }

      const attemptsRemaining = Math.max(0, MAX_ATTEMPTS - newAttempts);
      
      return {
        isLocked: newAttempts >= MAX_ATTEMPTS,
        attemptsRemaining,
        lockoutUntil: newLockoutUntil ? new Date(newLockoutUntil) : null,
        lockoutMinutes: newLockoutUntil 
          ? calculateLockoutMinutes(lockoutCount)
          : 0
      };
    } else {
      // Criar novo registro
      const { error } = await supabase
        .from('login_attempts')
        .insert({
          identifier: normalizedEmail,
          attempt_type: 'email',
          attempts_count: 1,
          first_attempt_at: now.toISOString(),
          last_attempt_at: now.toISOString()
        });

      if (error) {
        console.error('Erro ao criar registro de tentativa:', error);
      }

      return {
        isLocked: false,
        attemptsRemaining: MAX_ATTEMPTS - 1,
        lockoutUntil: null,
        lockoutMinutes: 0
      };
    }
  } catch (error) {
    console.error('Erro ao registrar tentativa falhada:', error);
    return {
      isLocked: false,
      attemptsRemaining: MAX_ATTEMPTS,
      lockoutUntil: null,
      lockoutMinutes: 0
    };
  }
};

/**
 * Limpa tentativas após login bem-sucedido
 */
export const clearLoginAttempts = async (email: string): Promise<void> => {
  try {
    await supabase
      .from('login_attempts')
      .delete()
      .eq('identifier', email.toLowerCase())
      .eq('attempt_type', 'email');
  } catch (error) {
    console.error('Erro ao limpar tentativas:', error);
  }
};
