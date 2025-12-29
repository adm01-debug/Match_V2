import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

type Permission = 'read' | 'write' | 'delete' | 'admin';
type Resource = 'candidatos' | 'vagas' | 'entrevistas' | 'avaliacoes' | 'relatorios' | 'configuracoes' | 'usuarios';

interface PermissionMap {
  [resource: string]: Permission[];
}

interface PermissionContextType {
  permissions: PermissionMap;
  role: string | null;
  hasPermission: (resource: Resource, permission: Permission) => boolean;
  canRead: (resource: Resource) => boolean;
  canWrite: (resource: Resource) => boolean;
  canDelete: (resource: Resource) => boolean;
  isAdmin: boolean;
  isLoading: boolean;
}

const DEFAULT_PERMISSIONS: Record<string, PermissionMap> = {
  admin: {
    candidatos: ['read', 'write', 'delete', 'admin'],
    vagas: ['read', 'write', 'delete', 'admin'],
    entrevistas: ['read', 'write', 'delete', 'admin'],
    avaliacoes: ['read', 'write', 'delete', 'admin'],
    relatorios: ['read', 'write', 'delete', 'admin'],
    configuracoes: ['read', 'write', 'delete', 'admin'],
    usuarios: ['read', 'write', 'delete', 'admin'],
  },
  recrutador: {
    candidatos: ['read', 'write'],
    vagas: ['read', 'write'],
    entrevistas: ['read', 'write'],
    avaliacoes: ['read', 'write'],
    relatorios: ['read'],
    configuracoes: ['read'],
    usuarios: [],
  },
  visualizador: {
    candidatos: ['read'],
    vagas: ['read'],
    entrevistas: ['read'],
    avaliacoes: ['read'],
    relatorios: ['read'],
    configuracoes: [],
    usuarios: [],
  },
};

const defaultContext: PermissionContextType = {
  permissions: DEFAULT_PERMISSIONS.visualizador,
  role: null,
  hasPermission: () => true,
  canRead: () => true,
  canWrite: () => true,
  canDelete: () => false,
  isAdmin: false,
  isLoading: false,
};

const PermissionContext = createContext<PermissionContextType>(defaultContext);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const [permissions, setPermissions] = useState<PermissionMap>(DEFAULT_PERMISSIONS.visualizador);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  useEffect(() => {
    async function loadPermissions() {
      if (!userId) {
        setPermissions(DEFAULT_PERMISSIONS.visualizador);
        setRole(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await supabase.from('profiles').select('role').eq('id', userId).single();
        const userRole = data?.role || 'visualizador';
        setRole(userRole);
        setPermissions(DEFAULT_PERMISSIONS[userRole] || DEFAULT_PERMISSIONS.visualizador);
      } catch (error) {
        setPermissions(DEFAULT_PERMISSIONS.visualizador);
        setRole('visualizador');
      } finally {
        setIsLoading(false);
      }
    }

    loadPermissions();
  }, [userId]);

  const hasPermission = (resource: Resource, permission: Permission): boolean => {
    return permissions[resource]?.includes(permission) || false;
  };

  const canRead = (resource: Resource) => hasPermission(resource, 'read');
  const canWrite = (resource: Resource) => hasPermission(resource, 'write');
  const canDelete = (resource: Resource) => hasPermission(resource, 'delete');
  const isAdmin = role === 'admin';

  return (
    <PermissionContext.Provider value={{ permissions, role, hasPermission, canRead, canWrite, canDelete, isAdmin, isLoading }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissionContext() {
  return useContext(PermissionContext);
}

export default PermissionContext;
