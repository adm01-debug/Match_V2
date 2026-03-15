import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useCallback } from 'react';

interface Permission {
  module: string;
  action: string;
  name: string;
}

export function usePermissions() {
  const { user } = useAuth();

  const { data: permissions = [], isLoading, refetch } = useQuery({
    queryKey: ['permissions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase.rpc('get_user_permissions', { _user_id: user.id });
      if (error) throw error;
      return (data as Permission[]) || [];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  const hasPermission = useCallback(
    (module: string, action: string) => permissions.some((p) => p.module === module && p.action === action),
    [permissions]
  );

  const hasModuleAccess = useCallback(
    (module: string) => permissions.some((p) => p.module === module),
    [permissions]
  );

  const getModulePermissions = useCallback(
    (module: string) => permissions.filter((p) => p.module === module),
    [permissions]
  );

  return { permissions, isLoading, refetch, hasPermission, hasModuleAccess, getModulePermissions };
}
