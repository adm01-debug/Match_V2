import { Navigate } from 'react-router-dom';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: AppRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRoles }) => {
  const { user, loading, roles, hasRole } = useAuth();

  if (loading) {
    return (
      <div role="region" aria-label="Rota protegida" className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if user has required role(s)
  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => hasRole(role));
    
    if (!hasRequiredRole && roles.length > 0) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
          <h1 className="text-2xl font-bold text-foreground">Acesso Negado</h1>
          <p className="text-muted-foreground">
            Você não tem permissão para acessar esta página.
          </p>
          <p className="text-sm text-muted-foreground">
            Roles necessárias: {requiredRoles.join(', ')}
          </p>
        </div>
      );
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
