/**
 * @component PermissionGuard
 * @description Componente para proteger rotas/elementos baseado em permissões
 */
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, ShieldX } from 'lucide-react';

interface PermissionGuardProps {
  children: ReactNode;
  module: string;
  action?: string;
  fallback?: ReactNode;
  redirectTo?: string;
  showAccessDenied?: boolean;
}

export function PermissionGuard({
  children,
  module,
  action,
  fallback,
  redirectTo,
  showAccessDenied = true,
}: PermissionGuardProps) {
  const { user, loading: authLoading } = useAuth();
  const { hasPermission, canAccess, loading: permLoading, isAdmin } = usePermissions();

  // Show loading state while checking auth and permissions
  if (authLoading || permLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // User not authenticated
  if (!user) {
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // Admins have access to everything
  if (isAdmin) {
    return <>{children}</>;
  }

  // Check permission
  const hasAccess = action ? hasPermission(module, action) : canAccess(module);

  if (!hasAccess) {
    // If custom fallback provided, show it
    if (fallback) {
      return <>{fallback}</>;
    }

    // Redirect if specified
    if (redirectTo) {
      return <Navigate to={redirectTo} replace />;
    }

    // Show access denied message
    if (showAccessDenied) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <ShieldX className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Acesso Negado</h2>
          <p className="text-muted-foreground max-w-md">
            Você não tem permissão para acessar este recurso. 
            Entre em contato com um administrador se acredita que isso é um erro.
          </p>
        </div>
      );
    }

    return null;
  }

  return <>{children}</>;
}

// HOC for permission checking
export function withPermission<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  module: string,
  action?: string
) {
  return function WithPermissionComponent(props: P) {
    return (
      <PermissionGuard module={module} action={action}>
        <WrappedComponent {...props} />
      </PermissionGuard>
    );
  };
}

// Component for conditionally rendering based on permission
interface RequirePermissionProps {
  children: ReactNode;
  module: string;
  action: string;
  fallback?: ReactNode;
}

export function RequirePermission({ children, module, action, fallback }: RequirePermissionProps) {
  const { hasPermission, loading, isAdmin } = usePermissions();

  if (loading) return null;
  
  if (isAdmin || hasPermission(module, action)) {
    return <>{children}</>;
  }

  return fallback ? <>{fallback}</> : null;
}

export default PermissionGuard;
