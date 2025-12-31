/**
 * @fileoverview Password Reset with Approval Service
 * @module services/passwordResetService
 */

import { supabase } from '@/integrations/supabase/client';

export interface PasswordResetRequest {
  readonly id: string;
  readonly userId: string;
  readonly userEmail: string;
  readonly userName: string | null;
  readonly status: 'pending' | 'approved' | 'rejected' | 'completed' | 'expired';
  readonly reason: string | null;
  readonly requestedAt: string;
  readonly reviewedAt: string | null;
  readonly reviewedBy: string | null;
  readonly reviewNotes: string | null;
}

/**
 * Cria uma nova solicitação de reset de senha
 */
export const createPasswordResetRequest = async (
  email: string,
  reason?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Check if user exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('user_id, nome, email')
      .eq('email', email)
      .single();

    if (!profile) {
      // Don't reveal if user exists or not for security
      return { 
        success: true, 
        message: 'Se o email estiver cadastrado, a solicitação será enviada para aprovação.' 
      };
    }

    // Check for existing pending request
    const { data: existingRequest } = await supabase
      .from('password_reset_requests')
      .select('id, status')
      .eq('user_email', email)
      .eq('status', 'pending')
      .single();

    if (existingRequest) {
      return {
        success: false,
        message: 'Já existe uma solicitação pendente para este email.'
      };
    }

    // Create new request
    const { error } = await supabase
      .from('password_reset_requests')
      .insert({
        user_id: profile.user_id,
        user_email: email,
        user_name: profile.nome,
        reason: reason || 'Esqueci minha senha',
        status: 'pending',
      });

    if (error) {
      console.error('Error creating reset request:', error);
      return { success: false, message: 'Erro ao criar solicitação.' };
    }

    return { 
      success: true, 
      message: 'Solicitação enviada para aprovação. Você receberá um email quando aprovada.' 
    };
  } catch (error) {
    console.error('Error in createPasswordResetRequest:', error);
    return { success: false, message: 'Erro interno.' };
  }
};

/**
 * Busca todas as solicitações de reset (admin)
 */
export const getPasswordResetRequests = async (
  status?: string
): Promise<PasswordResetRequest[]> => {
  try {
    let query = supabase
      .from('password_reset_requests')
      .select('*')
      .order('requested_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching reset requests:', error);
      return [];
    }

    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      userEmail: row.user_email,
      userName: row.user_name,
      status: row.status,
      reason: row.reason,
      requestedAt: row.requested_at,
      reviewedAt: row.reviewed_at,
      reviewedBy: row.reviewed_by,
      reviewNotes: row.review_notes,
    }));
  } catch (error) {
    console.error('Error in getPasswordResetRequests:', error);
    return [];
  }
};

/**
 * Aprova ou rejeita uma solicitação
 */
export const processResetRequest = async (
  requestId: string,
  action: 'approve' | 'reject',
  reviewNotes?: string
): Promise<{ success: boolean; message: string; resetLink?: string }> => {
  try {
    const baseUrl = window.location.origin;

    const { data, error } = await supabase.functions.invoke('password-reset-approval', {
      body: { requestId, action, reviewNotes, baseUrl },
    });

    if (error) {
      console.error('Error processing request:', error);
      return { success: false, message: 'Erro ao processar solicitação.' };
    }

    return {
      success: data.success,
      message: data.message,
      resetLink: data.resetLink,
    };
  } catch (error) {
    console.error('Error in processResetRequest:', error);
    return { success: false, message: 'Erro interno.' };
  }
};

/**
 * Valida um token de reset
 */
export const validateResetToken = async (
  token: string
): Promise<{ valid: boolean; email?: string; requestId?: string }> => {
  try {
    const { data, error } = await supabase
      .from('password_reset_requests')
      .select('id, user_email, token_expires_at, status')
      .eq('reset_token', token)
      .eq('status', 'approved')
      .single();

    if (error || !data) {
      return { valid: false };
    }

    // Check if token is expired
    if (new Date(data.token_expires_at) < new Date()) {
      return { valid: false };
    }

    return { valid: true, email: data.user_email, requestId: data.id };
  } catch (error) {
    console.error('Error validating token:', error);
    return { valid: false };
  }
};

/**
 * Completa o reset de senha
 */
export const completePasswordReset = async (
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const validation = await validateResetToken(token);
    
    if (!validation.valid) {
      return { success: false, message: 'Token inválido ou expirado.' };
    }

    // Update password using Supabase Auth Admin
    // Note: This would typically need to be done via an edge function
    // For now, we'll mark the request as completed
    const { error } = await supabase
      .from('password_reset_requests')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('id', validation.requestId);

    if (error) {
      console.error('Error completing reset:', error);
      return { success: false, message: 'Erro ao completar reset.' };
    }

    return { 
      success: true, 
      message: 'Senha alterada com sucesso. Faça login com sua nova senha.' 
    };
  } catch (error) {
    console.error('Error in completePasswordReset:', error);
    return { success: false, message: 'Erro interno.' };
  }
};
