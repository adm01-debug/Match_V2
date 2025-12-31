import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Permission {
  module: string;
  action: string;
  name: string;
}

interface PermissionContextType {
  permissions: Permission[];
  loading: boolean;
  hasPermission: (module: string, action: string) => boolean;
  hasAnyPermission: (checks: Array<{ module: string; action: string }>) => boolean;
  hasAllPermissions: (checks: Array<{ module: string; action: string }>) => boolean;
  canAccess: (module: string) => boolean;
  refreshPermissions: () => Promise<void>;
  isAdmin: boolean;
}

const defaultContext: PermissionContextType = {
  permissions: [],
  loading: true,
  hasPermission: () => false,
  hasAnyPermission: () => false,
  hasAllPermissions: () => false,
  canAccess: () => false,
  refreshPermissions: async () => {},
  isAdmin: false,
};

const PermissionContext = createContext<PermissionContextType>(defaultContext);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { user, roles } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = useCallback(async () => {
    if (!user) {
      setPermissions([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.rpc('get_user_permissions', {
        _user_id: user.id
      });

      if (error) {
        console.error('Error fetching permissions:', error);
        setPermissions([]);
      } else {
        setPermissions(data || []);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  // Check if user has a specific permission
  const hasPermission = useCallback((module: string, action: string): boolean => {
    return permissions.some(p => p.module === module && p.action === action);
  }, [permissions]);

  // Check if user has any of the specified permissions
  const hasAnyPermission = useCallback((checks: Array<{ module: string; action: string }>): boolean => {
    return checks.some(check => hasPermission(check.module, check.action));
  }, [hasPermission]);

  // Check if user has all specified permissions
  const hasAllPermissions = useCallback((checks: Array<{ module: string; action: string }>): boolean => {
    return checks.every(check => hasPermission(check.module, check.action));
  }, [hasPermission]);

  // Check if user can access a module (has any permission for that module)
  const canAccess = useCallback((module: string): boolean => {
    return permissions.some(p => p.module === module);
  }, [permissions]);

  const isAdmin = useMemo(() => roles.includes('admin'), [roles]);

  const value = useMemo(() => ({
    permissions,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccess,
    refreshPermissions: fetchPermissions,
    isAdmin,
  }), [permissions, loading, hasPermission, hasAnyPermission, hasAllPermissions, canAccess, fetchPermissions, isAdmin]);

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissionContext() {
  return useContext(PermissionContext);
}

export default PermissionContext;
