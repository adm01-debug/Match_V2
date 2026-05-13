import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { use2FA } from '@/hooks/use2FA';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

interface Admin2FAGuardProps {
  children: React.ReactNode;
}

/**
 * Componente que obriga administradores a terem 2FA habilitado.
 */
export function Admin2FAGuard({ children }: Admin2FAGuardProps) {
  const { user, roles, loading: authLoading } = useAuth();
  const { isEnabled, isLoadingStatus } = use2FA();
  const navigate = useNavigate();

  const isAdmin = roles.includes('admin');
  const loading = authLoading || isLoadingStatus;

  useEffect(() => {
    if (!loading && user && isAdmin && !isEnabled) {
      // Redirecionar para página de segurança se for admin e não tiver 2FA
      console.warn('Admin sem 2FA detectado. Redirecionando...');
      navigate('/auth/2fa?required=true');
    }
  }, [loading, user, isAdmin, isEnabled, navigate]);

  if (loading) {
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isAdmin && !isEnabled) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Segurança Obrigatória</AlertTitle>
          <AlertDescription>
            Como administrador, você deve habilitar a Autenticação de Dois Fatores (2FA) para acessar esta área.
            Redirecionando para configuração...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return <>{children}</>;
}
