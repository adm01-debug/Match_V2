import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Setup2FAData {
  secret: string;
  backup_codes: string[];
}

export function use2FA() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if 2FA is enabled for current user
  const { data: twoFAStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: ['2fa-status', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('user_2fa')
        .select('enabled, verified_at')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data || { enabled: false, verified_at: null };
    },
    enabled: !!user?.id,
  });

  // Enable 2FA
  const enable2FA = useMutation({
    mutationFn: async (data: Setup2FAData) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_2fa')
        .upsert({
          user_id: user.id,
          secret: data.secret,
          backup_codes: data.backup_codes,
          enabled: true,
          verified_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Log the action
      await supabase.from('user_2fa_logs').insert({
        user_id: user.id,
        action: 'setup',
        success: true,
      });

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['2fa-status'] });
      toast({
        title: '2FA Ativado',
        description: 'Autenticação de dois fatores foi ativada com sucesso.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível ativar o 2FA.',
        variant: 'destructive',
      });
    },
  });

  // Disable 2FA
  const disable2FA = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('user_2fa')
        .update({ enabled: false })
        .eq('user_id', user.id);

      if (error) throw error;

      // Log the action
      await supabase.from('user_2fa_logs').insert({
        user_id: user.id,
        action: 'disable',
        success: true,
      });

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['2fa-status'] });
      toast({
        title: '2FA Desativado',
        description: 'Autenticação de dois fatores foi desativada.',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível desativar o 2FA.',
        variant: 'destructive',
      });
    },
  });

  // Verify 2FA code
  const verify2FA = useMutation({
    mutationFn: async (code: string) => {
      if (!user?.id) throw new Error('User not authenticated');

      // In production, this should verify the TOTP code properly
      const { data, error } = await supabase
        .from('user_2fa')
        .select('secret, backup_codes')
        .eq('user_id', user.id)
        .eq('enabled', true)
        .single();

      if (error) throw error;

      // Check if it's a backup code
      if (code.includes('-')) {
        const codes = data.backup_codes as string[];
        const codeIndex = codes.findIndex(c => c === code.toUpperCase());
        
        if (codeIndex === -1) {
          throw new Error('Invalid backup code');
        }

        // Remove used backup code
        const newCodes = codes.filter((_, i) => i !== codeIndex);
        await supabase
          .from('user_2fa')
          .update({ backup_codes: newCodes })
          .eq('user_id', user.id);

        // Log backup code usage
        await supabase.from('user_2fa_logs').insert({
          user_id: user.id,
          action: 'backup_used',
          success: true,
        });

        return true;
      }

      // Verify TOTP code (simplified)
      if (code.length !== 6 || !/^\d+$/.test(code)) {
        throw new Error('Invalid code format');
      }

      // Log verification
      await supabase.from('user_2fa_logs').insert({
        user_id: user.id,
        action: 'verify',
        success: true,
      });

      return true;
    },
  });

  // Get remaining backup codes count
  const { data: backupCodesCount } = useQuery({
    queryKey: ['2fa-backup-codes-count', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;

      const { data, error } = await supabase
        .from('user_2fa')
        .select('backup_codes')
        .eq('user_id', user.id)
        .single();

      if (error) return 0;
      return (data.backup_codes as string[])?.length || 0;
    },
    enabled: !!user?.id && twoFAStatus?.enabled,
  });

  // Regenerate backup codes
  const regenerateBackupCodes = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const newCodes: string[] = [];
      for (let i = 0; i < 10; i++) {
        const code = Math.random().toString(36).substring(2, 6).toUpperCase() + 
                     '-' + 
                     Math.random().toString(36).substring(2, 6).toUpperCase();
        newCodes.push(code);
      }

      const { error } = await supabase
        .from('user_2fa')
        .update({ backup_codes: newCodes })
        .eq('user_id', user.id);

      if (error) throw error;

      return newCodes;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['2fa-backup-codes-count'] });
      toast({
        title: 'Códigos regenerados',
        description: 'Novos códigos de backup foram gerados.',
      });
    },
  });

  return {
    isEnabled: twoFAStatus?.enabled || false,
    isLoadingStatus,
    backupCodesCount: backupCodesCount || 0,
    enable2FA,
    disable2FA,
    verify2FA,
    regenerateBackupCodes,
  };
}

export default use2FA;
