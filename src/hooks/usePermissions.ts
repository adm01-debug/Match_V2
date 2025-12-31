/**
 * @hook usePermissions
 * @description Hook para verificar e gerenciar permissões granulares do usuário
 */
import { usePermissionContext } from '@/contexts/PermissionContext';

export function usePermissions() {
  return usePermissionContext();
}

// Convenience hook for checking a single permission
export function useHasPermission(module: string, action: string): boolean {
  const { hasPermission, loading } = usePermissionContext();
  return !loading && hasPermission(module, action);
}

// Convenience hook for checking module access
export function useCanAccessModule(module: string): boolean {
  const { canAccess, loading } = usePermissionContext();
  return !loading && canAccess(module);
}

export default usePermissions;
