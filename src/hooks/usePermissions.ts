import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useMemo } from 'react';

export interface Permission {
  resource: string;
  action: string;
}

export interface Role {
  id: string;
  name: string;
  description: string;
}

export function usePermissions() {
  const { user } = useAuth();

  const { data: userPermissions, isLoading } = useQuery({
    queryKey: ['user-permissions', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          role:roles(
            name,
            role_permissions(
              permission:permissions(resource, action)
            )
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      // Flatten permissions
      const permissions: Permission[] = [];
      data?.forEach((ur: any) => {
        ur.role?.role_permissions?.forEach((rp: any) => {
          if (rp.permission) {
            permissions.push({
              resource: rp.permission.resource,
              action: rp.permission.action,
            });
          }
        });
      });

      return permissions;
    },
    enabled: !!user?.id,
  });

  const { data: userRoles } = useQuery({
    queryKey: ['user-roles', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('user_roles')
        .select('role:roles(*)')
        .eq('user_id', user.id);

      if (error) throw error;
      return data?.map((ur: any) => ur.role) || [];
    },
    enabled: !!user?.id,
  });

  const permissionSet = useMemo(() => {
    const set = new Set<string>();
    userPermissions?.forEach((p) => {
      set.add(`${p.resource}:${p.action}`);
    });
    return set;
  }, [userPermissions]);

  const hasPermission = (resource: string, action: string): boolean => {
    return permissionSet.has(`${resource}:${action}`);
  };

  const hasAnyPermission = (resource: string, actions: string[]): boolean => {
    return actions.some((action) => hasPermission(resource, action));
  };

  const hasAllPermissions = (permissions: Permission[]): boolean => {
    return permissions.every((p) => hasPermission(p.resource, p.action));
  };

  const hasRole = (roleName: string): boolean => {
    return userRoles?.some((r: Role) => r.name === roleName) || false;
  };

  const isAdmin = useMemo(() => hasRole('admin'), [userRoles]);

  // Permission check shortcuts
  const can = {
    // Candidatos
    viewCandidatos: () => hasPermission('candidatos', 'view'),
    createCandidato: () => hasPermission('candidatos', 'create'),
    editCandidato: () => hasPermission('candidatos', 'edit'),
    deleteCandidato: () => hasPermission('candidatos', 'delete'),
    exportCandidatos: () => hasPermission('candidatos', 'export'),
    
    // Vagas
    viewVagas: () => hasPermission('vagas', 'view'),
    createVaga: () => hasPermission('vagas', 'create'),
    editVaga: () => hasPermission('vagas', 'edit'),
    deleteVaga: () => hasPermission('vagas', 'delete'),
    publishVaga: () => hasPermission('vagas', 'publish'),
    
    // Entrevistas
    viewEntrevistas: () => hasPermission('entrevistas', 'view'),
    createEntrevista: () => hasPermission('entrevistas', 'create'),
    editEntrevista: () => hasPermission('entrevistas', 'edit'),
    deleteEntrevista: () => hasPermission('entrevistas', 'delete'),
    
    // Avaliações
    viewAvaliacoes: () => hasPermission('avaliacoes', 'view'),
    createAvaliacao: () => hasPermission('avaliacoes', 'create'),
    editAvaliacao: () => hasPermission('avaliacoes', 'edit'),
    
    // Relatórios
    viewRelatorios: () => hasPermission('relatorios', 'view'),
    exportRelatorios: () => hasPermission('relatorios', 'export'),
    
    // Settings
    viewSettings: () => hasPermission('settings', 'view'),
    editSettings: () => hasPermission('settings', 'edit'),
    
    // Users
    viewUsers: () => hasPermission('users', 'view'),
    createUser: () => hasPermission('users', 'create'),
    editUser: () => hasPermission('users', 'edit'),
    deleteUser: () => hasPermission('users', 'delete'),
  };

  return {
    permissions: userPermissions || [],
    roles: userRoles || [],
    isLoading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    isAdmin,
    can,
  };
}

// HOC for permission-based rendering
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  resource: string,
  action: string
) {
  return function PermissionWrapper(props: P) {
    const { hasPermission, isLoading } = usePermissions();
    
    if (isLoading) return null;
    if (!hasPermission(resource, action)) return null;
    
    return <WrappedComponent {...props} />;
  };
}

export default usePermissions;
