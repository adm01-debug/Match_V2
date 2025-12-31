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
  /** Tempo em ms que a re-auth permanece válida (padrão: 5 min) */
  validityPeriod?: number;
  /** Ações que requerem re-auth */
  requireReauthFor?: SensitiveAction[];
}

const DEFAULT_VALIDITY = 5 * 60 * 1000; // 5 minutes

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

  // Check if re-auth is still valid
  const isReauthValid = useCallback(() => {
    if (!state.lastVerified) return false;
    const elapsed = Date.now() - state.lastVerified.getTime();
    return elapsed < validityPeriod;
  }, [state.lastVerified, validityPeriod]);

  // Check if action requires re-auth
  const requiresReauth = useCallback((action: SensitiveAction): boolean => {
    if (!requireReauthFor.includes(action)) return false;
    if (isReauthValid()) return false;
    return true;
  }, [requireReauthFor, isReauthValid]);

  // Request re-auth for an action
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

  // Verify password
  const verifyPassword = useCallback(async (password: string): Promise<boolean> => {
    if (!user?.email) {
      setState(prev => ({ ...prev, error: 'Usuário não autenticado' }));
      return false;
    }

    setState(prev => ({ ...prev, isVerifying: true, error: null }));

    try {
      // Re-authenticate with password
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

      // If 2FA is enabled, we still need to verify the code
      if (is2FAEnabled) {
        setState(prev => ({ 
          ...prev, 
          isVerifying: false,
          // Keep isRequired true for 2FA step
        }));
        return true; // Password verified, but need 2FA
      }

      // Success - update state
      setState(prev => ({
        ...prev,
        isRequired: false,
        action: null,
        isVerifying: false,
        lastVerified: new Date(),
      }));

      return true;
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        isVerifying: false, 
        error: 'Erro ao verificar senha' 
      }));
      return false;
    }
  }, [user?.email, is2FAEnabled]);

  // Verify 2FA code (after password)
  const verify2FA = useCallback(async (code: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isVerifying: true, error: null }));

    try {
      // Verify TOTP or backup code
      const { data, error } = await supabase
        .from('user_2fa')
        .select('secret, backup_codes')
        .eq('user_id', user?.id)
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

      // Check backup code
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

        // Remove used backup code
        const newCodes = codes.filter((_, i) => i !== codeIndex);
        await supabase
          .from('user_2fa')
          .update({ backup_codes: newCodes })
          .eq('user_id', user?.id);
      } else {
        // Verify TOTP code format
        if (code.length !== 6 || !/^\d+$/.test(code)) {
          setState(prev => ({ 
            ...prev, 
            isVerifying: false, 
            error: 'Código inválido' 
          }));
          return false;
        }
        
        // In production, verify TOTP using the secret
        // For now, accept valid format codes
      }

      // Log successful verification
      await supabase.from('user_2fa_logs').insert({
        user_id: user?.id,
        action: 'reauth_verify',
        success: true,
      });

      // Success
      setState({
        isRequired: false,
        action: null,
        isVerifying: false,
        error: null,
        lastVerified: new Date(),
      });

      return true;
    } catch (err) {
      setState(prev => ({ 
        ...prev, 
        isVerifying: false, 
        error: 'Erro ao verificar código' 
      }));
      return false;
    }
  }, [user?.id]);

  // Cancel re-auth
  const cancelReauth = useCallback(() => {
    setState({
      isRequired: false,
      action: null,
      isVerifying: false,
      error: null,
      lastVerified: state.lastVerified,
    });
  }, [state.lastVerified]);

  // Clear verification state (force re-auth next time)
  const clearVerification = useCallback(() => {
    setState(prev => ({
      ...prev,
      lastVerified: null,
    }));
  }, []);

  // Execute action with re-auth check
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
    } catch (error) {
      return { success: false, needsReauth: false };
    }
  }, [requiresReauth, requestReauth]);

  return {
    // State
    isRequired: state.isRequired,
    currentAction: state.action,
    isVerifying: state.isVerifying,
    error: state.error,
    isVerified: isReauthValid(),
    is2FARequired: is2FAEnabled,
    
    // Methods
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
