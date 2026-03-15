import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Permission {
  module: string;
  action: string;
  name: string;
}

interface PermissionContextType {
  permissions: Permission[];
  loading: boolean;
  hasPermission: (module: string, action: string) => boolean;
  hasAnyPermission: (module: string) => boolean;
  refreshPermissions: () => Promise<void>;
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = useCallback(async () => {
    if (!user?.id) {
      setPermissions([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_user_permissions', { _user_id: user.id });
      if (error) throw error;
      setPermissions((data as Permission[]) || []);
    } catch (err) {
      console.error('Error fetching permissions:', err);
      setPermissions([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const hasPermission = useCallback(
    (module: string, action: string) =>
      permissions.some((p) => p.module === module && p.action === action),
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (module: string) => permissions.some((p) => p.module === module),
    [permissions]
  );

  return (
    <PermissionContext.Provider
      value={{ permissions, loading, hasPermission, hasAnyPermission, refreshPermissions: fetchPermissions }}
    >
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissionContext() {
  const ctx = useContext(PermissionContext);
  if (!ctx) throw new Error('usePermissionContext must be used within PermissionProvider');
  return ctx;
}

export default PermissionContext;
