import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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

const PermissionContext = createContext<PermissionContextType | undefined>(undefined);

export function PermissionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [permissions, setPermissions] = useState<PermissionMap>({});
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadPermissions() {
      if (!user?.id) {
        setPermissions({});
        setRole(null);
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
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
  }, [user?.id]);

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
  const context = useContext(PermissionContext);
  if (!context) throw new Error('usePermissionContext must be used within PermissionProvider');
  return context;
}

export default PermissionContext;
