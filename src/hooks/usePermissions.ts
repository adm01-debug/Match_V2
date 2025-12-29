import { usePermissionContext } from '@/contexts/PermissionContext';

export function usePermissions() {
  const context = usePermissionContext();
  
  return {
    permissions: context?.permissions || {},
    role: context?.role || null,
    hasPermission: context?.hasPermission || (() => true),
    canRead: context?.canRead || (() => true),
    canWrite: context?.canWrite || (() => true),
    canDelete: context?.canDelete || (() => false),
    isAdmin: context?.isAdmin || false,
    isLoading: context?.isLoading || false,
  };
}

export default usePermissions;
