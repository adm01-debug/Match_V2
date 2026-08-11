/**
 * @module useReauth
 * @description Hook para re-autenticação em ações sensíveis
 */
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { use2FA } from '@/hooks/use2FA';

export type SensitiveAction = 
  | 'change_password'
  | 'change_email'
  | 'configure_mfa'
  | 'admin_action'
  | 'delete_account'
  | 'export_data'
  | 'manage_api_keys';

interface ReauthState {
  isRequired: boolean;
  action: SensitiveAction | null;
  isVerifying: boolean;
  error: string | null;
  lastVerified: Date | null;
}

interface ReauthOptions {
  validityPeriod?: number;
  requireReauthFor?: SensitiveAction[];
}

const DEFAULT_VALIDITY = 5 * 60 * 1000;

const ALL_SENSITIVE_ACTIONS: SensitiveAction[] = [
  'change_password',
  'change_email',
  'configure_mfa',
  'admin_action',
  'delete_account',
  'export_data',
  'manage_api_keys',
];

export function useReauth(options: ReauthOptions = {}) {
  const { 
    validityPeriod = DEFAULT_VALIDITY,
    requireReauthFor = ALL_SENSITIVE_ACTIONS,
  } = options;

  const { user } = useAuth();
  const { isEnabled: is2FAEnabled } = use2FA();
  
  const [state, setState] = useState<ReauthState>({
    isRequired: false,
    action: null,
    isVerifying: false,
    error: null,
    lastVerified: null,
  });

  const isReauthValid = useCallback(() => {
    if (!state.lastVerified) return false;
    const elapsed = Date.now() - state.lastVerified.getTime();
    return elapsed < validityPeriod;
  }, [state.lastVerified, validityPeriod]);

  const requiresReauth = useCallback((action: SensitiveAction): boolean => {
    if (!requireReauthFor.includes(action)) return false;
    if (isReauthValid()) return false;
    return true;
  }, [requireReauthFor, isReauthValid]);

  const requestReauth = useCallback((action: SensitiveAction) => {
    if (!requiresReauth(action)) {
      return { required: false };
    }

    setState(prev => ({
      ...prev,
      isRequired: true,
      action,
      error: null,
    }));

    return { required: true };
  }, [requiresReauth]);

  const verifyPassword = useCallback(async (password: string): Promise<boolean> => {
    if (!user?.email) {
      setState(prev => ({ ...prev, error: 'Usuário não autenticado' }));
      return false;
    }

    setState(prev => ({ ...prev, isVerifying: true, error: null }));

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password,
      });

      if (error) {
        setState(prev => ({ 
          ...prev, 
          isVerifying: false, 
          error: 'Senha incorreta' 
        }));
        return false;
      }

      if (is2FAEnabled) {
        setState(prev => ({ 
          ...prev, 
          isVerifying: false,
        }));
        return true;
      }

      setState(prev => ({
        ...prev,
        isRequired: false,
        action: null,
        isVerifying: false,
        lastVerified: new Date(),
      }));

      return true;
    } catch {
      setState(prev => ({ 
        ...prev, 
        isVerifying: false, 
        error: 'Erro ao verificar senha' 
      }));
      return false;
    }
  }, [user?.email, is2FAEnabled]);

  const verify2FA = useCallback(async (code: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isVerifying: true, error: null }));

    const userId = user?.id;
    if (!userId) {
      setState(prev => ({ ...prev, isVerifying: false, error: 'Usuário não autenticado' }));
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('user_2fa')
        .select('secret, backup_codes')
        .eq('user_id', userId)
        .eq('enabled', true)
        .single();

      if (error) {
        setState(prev => ({ 
          ...prev, 
          isVerifying: false, 
          error: '2FA não configurado' 
        }));
        return false;
      }

      if (code.includes('-')) {
        const codes = data.backup_codes as string[];
        const codeIndex = codes.findIndex(c => c === code.toUpperCase());
        
        if (codeIndex === -1) {
          setState(prev => ({ 
            ...prev, 
            isVerifying: false, 
            error: 'Código de backup inválido' 
          }));
          return false;
        }

        const newCodes = codes.filter((_, i) => i !== codeIndex);
        await supabase
          .from('user_2fa')
          .update({ backup_codes: newCodes })
          .eq('user_id', userId);
      } else {
        if (code.length !== 6 || !/^\d+$/.test(code)) {
          setState(prev => ({ 
            ...prev, 
            isVerifying: false, 
            error: 'Código inválido' 
          }));
          return false;
        }
      }

      await supabase.from('user_2fa_logs').insert({
        user_id: userId,
        action: 'reauth_verify',
        success: true,
      });

      setState({
        isRequired: false,
        action: null,
        isVerifying: false,
        error: null,
        lastVerified: new Date(),
      });

      return true;
    } catch {
      setState(prev => ({ 
        ...prev, 
        isVerifying: false, 
        error: 'Erro ao verificar código' 
      }));
      return false;
    }
  }, [user?.id]);

  const cancelReauth = useCallback(() => {
    setState({
      isRequired: false,
      action: null,
      isVerifying: false,
      error: null,
      lastVerified: state.lastVerified,
    });
  }, [state.lastVerified]);

  const clearVerification = useCallback(() => {
    setState(prev => ({
      ...prev,
      lastVerified: null,
    }));
  }, []);

  const withReauth = useCallback(async <T>(
    action: SensitiveAction,
    callback: () => Promise<T>
  ): Promise<{ success: boolean; result?: T; needsReauth: boolean }> => {
    if (requiresReauth(action)) {
      requestReauth(action);
      return { success: false, needsReauth: true };
    }

    try {
      const result = await callback();
      return { success: true, result, needsReauth: false };
    } catch {
      return { success: false, needsReauth: false };
    }
  }, [requiresReauth, requestReauth]);

  return {
    isRequired: state.isRequired,
    currentAction: state.action,
    isVerifying: state.isVerifying,
    error: state.error,
    isVerified: isReauthValid(),
    is2FARequired: is2FAEnabled,
    
    requestReauth,
    verifyPassword,
    verify2FA,
    cancelReauth,
    clearVerification,
    requiresReauth,
    withReauth,
  };
}

export default useReauth;
