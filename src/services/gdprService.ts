import { supabase } from '@/integrations/supabase/client';

export interface UserDataExport {
  profile: any;
  candidaturas: any[];
  entrevistas: any[];
  avaliacoes: any[];
  comunicacoes: any[];
  exportedAt: string;
}

export const gdprService = {
  // Export all user data (LGPD Art. 18, V - Portabilidade)
  async exportUserData(userId: string): Promise<UserDataExport> {
    const [profile, candidaturas, entrevistas, avaliacoes, comunicacoes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('candidaturas').select('*').eq('candidato_id', userId),
      supabase.from('entrevistas').select('*').eq('candidato_id', userId),
      supabase.from('avaliacoes').select('*').eq('candidato_id', userId),
      supabase.from('comunicacoes').select('*').eq('candidato_id', userId),
    ]);

    return {
      profile: profile.data,
      candidaturas: candidaturas.data || [],
      entrevistas: entrevistas.data || [],
      avaliacoes: avaliacoes.data || [],
      comunicacoes: comunicacoes.data || [],
      exportedAt: new Date().toISOString(),
    };
  },

  // Download user data as JSON
  downloadUserData(data: UserDataExport): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meus-dados-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  // Request data deletion (LGPD Art. 18, VI)
  async requestDataDeletion(userId: string, reason?: string): Promise<boolean> {
    try {
      await supabase.from('data_deletion_requests').insert({
        user_id: userId,
        reason,
        status: 'pending',
        requested_at: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      // Error requesting data deletion - handled
      return false;
    }
  },

  // Delete user account and data
  async deleteUserAccount(userId: string): Promise<boolean> {
    try {
      // Anonymize data instead of hard delete for audit purposes
      await supabase.from('profiles').update({
        nome: 'Usuário Removido',
        email: `deleted_${userId}@removed.com`,
        telefone: null,
        foto_url: null,
        deleted_at: new Date().toISOString(),
      }).eq('id', userId);

      // Delete from auth
      await supabase.auth.admin.deleteUser(userId);
      return true;
    } catch (error) {
      // Error deleting user account - handled
      return false;
    }
  },

  // Update consent preferences
  async updateConsent(userId: string, preferences: Record<string, boolean>): Promise<boolean> {
    try {
      await supabase.from('user_consents').upsert({
        user_id: userId,
        marketing: preferences.marketing || false,
        analytics: preferences.analytics || false,
        third_party: preferences.thirdParty || false,
        updated_at: new Date().toISOString(),
      });
      return true;
    } catch (error) {
      // Error updating consent - handled
      return false;
    }
  },

  // Get user consent status
  async getConsentStatus(userId: string): Promise<Record<string, boolean> | null> {
    try {
      const { data } = await supabase
        .from('user_consents')
        .select('marketing, analytics, third_party')
        .eq('user_id', userId)
        .single();
      return data;
    } catch {
      return null;
    }
  },

  // Log data access for audit
  async logDataAccess(userId: string, accessType: string, details?: string): Promise<void> {
    await supabase.from('data_access_logs').insert({
      user_id: userId,
      access_type: accessType,
      details,
      accessed_at: new Date().toISOString(),
    });
  },
};

export default gdprService;

