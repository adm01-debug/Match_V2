import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useTenantContext } from '@/contexts/TenantContext';
import { useToast } from '@/hooks/use-toast';

interface TenantSettings { theme?: string; logo_url?: string; custom_domain?: string; features?: string[]; }

export function useTenant() {
  const { tenant, tenants, switchTenant, isMultiTenant } = useTenantContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['tenant-settings', tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) return null;
      const { data } = await supabase.from('tenants').select('settings').eq('id', tenant.id).single();
      return data?.settings as TenantSettings || {};
    },
    enabled: !!tenant?.id,
  });

  const { data: members = [] } = useQuery({
    queryKey: ['tenant-members', tenant?.id],
    queryFn: async () => {
      if (!tenant?.id) return [];
      const { data } = await supabase.from('tenant_members').select('*, profiles(*)').eq('tenant_id', tenant.id);
      return data || [];
    },
    enabled: !!tenant?.id,
  });

  const updateSettings = useMutation({
    mutationFn: async (newSettings: Partial<TenantSettings>) => {
      if (!tenant?.id) throw new Error('No tenant');
      const { error } = await supabase.from('tenants').update({ settings: { ...settings, ...newSettings } }).eq('id', tenant.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenant-settings'] });
      toast({ title: 'Configurações salvas' });
    },
  });

  const inviteMember = useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      if (!tenant?.id) throw new Error('No tenant');
      const { error } = await supabase.from('tenant_invites').insert({ tenant_id: tenant.id, email, role });
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: 'Convite enviado' });
    },
  });

  return { tenant, tenants, settings, members, isMultiTenant, switchTenant, updateSettings: updateSettings.mutate, inviteMember: inviteMember.mutate };
}

export default useTenant;
