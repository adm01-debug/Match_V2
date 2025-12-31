import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PermissionGateProps {
  children: ReactNode;
  permission?: string;
  roles?: ('admin' | 'rh' | 'gestor')[];
  fallback?: ReactNode;
}

export function PermissionGate({ children, roles, fallback = null }: PermissionGateProps) {
  const { hasRole, roles: userRoles } = useAuth();

  // If no roles specified, allow access
  if (!roles || roles.length === 0) {
    return <>{children}</>;
  }

  // Check if user has any of the required roles
  const hasAccess = roles.some(role => hasRole(role));

  // Admin always has access
  if (hasRole('admin')) {
    return <>{children}</>;
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}

export default PermissionGate;
