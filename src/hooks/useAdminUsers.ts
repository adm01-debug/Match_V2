import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { AppRole } from '@/contexts/AuthContext';
import type { UserProfile } from '@/components/admin/users/adminRolesConfig';

export function useAdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar usuários',
        description: profilesError.message,
      });
      setLoading(false);
      return;
    }

    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');

    if (rolesError) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar roles',
        description: rolesError.message,
      });
      setLoading(false);
      return;
    }

    const usersWithRoles: UserProfile[] = (profiles || []).map((profile) => ({
      id: profile.id,
      user_id: profile.user_id,
      nome: profile.nome,
      email: profile.email,
      created_at: profile.created_at,
      roles: (rolesData || [])
        .filter((r) => r.user_id === profile.user_id)
        .map((r) => r.role as AppRole),
    }));

    setUsers(usersWithRoles);
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const saveRoles = useCallback(
    async (userProfile: UserProfile, editingRoles: AppRole[]) => {
      const rolesToAdd = editingRoles.filter((r) => !userProfile.roles.includes(r));
      const rolesToRemove = userProfile.roles.filter((r) => !editingRoles.includes(r));

      for (const role of rolesToRemove) {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userProfile.user_id)
          .eq('role', role);
        if (error) throw error;
      }

      for (const role of rolesToAdd) {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userProfile.user_id, role });
        if (error) throw error;
      }

      await fetchUsers();
    },
    [fetchUsers]
  );

  return { users, loading, fetchUsers, saveRoles };
}
