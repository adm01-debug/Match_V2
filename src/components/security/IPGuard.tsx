/**
 * @fileoverview IP Guard Component
 * @module components/security/IPGuard
 * @description Componente que protege rotas baseado em whitelist de IPs
 */

import { memo, type ReactNode } from 'react';
import { useIPVerification } from '@/hooks/useIPVerification';
import { IP_SECURITY_CONFIG } from '@/config/ipWhitelist';
import { Shield, AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface IPGuardProps {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
  readonly showIPOnBlock?: boolean;
}

const IPCheckLoading = memo(() => (
  <div 
    className="min-h-screen flex items-center justify-center bg-background"
    data-testid="ip-guard-loading"
  >
    <Card className="w-full max-w-md" role="status" aria-label="Verificando acesso" aria-live="polite">
      <CardHeader className="text-center">
        <Shield className="w-12 h-12 mx-auto text-primary animate-pulse" />
        <CardTitle className="mt-4">Verificando Acesso</CardTitle>
        <span className="sr-only">Por favor aguarde enquanto verificamos seu acesso</span>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-muted-foreground">
          Validando suas credenciais de segurança...
        </p>
        <div className="mt-4 flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </CardContent>
    </Card>
  </div>
));

IPCheckLoading.displayName = 'IPCheckLoading';

const AccessBlocked = memo(({ 
  clientIP, 
  showIP, 
  onRetry 
}: { 
  clientIP: string | null;
  showIP: boolean;
  onRetry: () => void;
}) => (
  <div 
    className="min-h-screen flex items-center justify-center bg-background"
    data-testid="ip-guard-blocked"
  >
    <Card className="w-full max-w-md" role="status" aria-label="Verificando acesso" aria-live="polite">
      <CardHeader className="text-center">
        <AlertTriangle className="w-12 h-12 mx-auto text-destructive" />
        <CardTitle className="mt-4 text-destructive">
          Acesso Não Autorizado
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">
          {IP_SECURITY_CONFIG.blockedMessage}
        </p>
        
        {showIP && clientIP && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">
              Seu IP: <code className="font-mono">{clientIP}</code>
            </p>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground">
          Entre em contato com o administrador do sistema para solicitar acesso.
        </p>
        
        <Button 
          variant="outline" 
          onClick={onRetry}
          className="mt-4"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar Novamente
        </Button>
      </CardContent>
    </Card>
  </div>
));

AccessBlocked.displayName = 'AccessBlocked';

const IPCheckError = memo(({ 
  error, 
  onRetry 
}: { 
  error: Error | null;
  onRetry: () => void;
}) => (
  <div 
    className="min-h-screen flex items-center justify-center bg-background"
    data-testid="ip-guard-error"
  >
    <Card className="w-full max-w-md" role="status" aria-label="Verificando acesso" aria-live="polite">
      <CardHeader className="text-center">
        <AlertTriangle className="w-12 h-12 mx-auto text-warning" />
        <CardTitle className="mt-4">Erro na Verificação</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p className="text-muted-foreground">
          Não foi possível verificar seu acesso. Por favor, tente novamente.
        </p>
        
        {error && (
          <div className="p-3 bg-muted rounded-md">
            <p className="text-sm text-destructive font-mono">
              {error.message}
            </p>
          </div>
        )}
        
        <Button onClick={onRetry}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar Novamente
        </Button>
      </CardContent>
    </Card>
  </div>
));

IPCheckError.displayName = 'IPCheckError';

const IPGuard = memo(({ 
  children, 
  fallback,
  showIPOnBlock = true 
}: IPGuardProps) => {
  const { 
    isAllowed, 
    isLoading, 
    isError, 
    clientIP, 
    error,
    recheck 
  } = useIPVerification();

  if (isLoading) {
    return fallback ?? <IPCheckLoading />;
  }

  if (isError) {
    return <IPCheckError error={error} onRetry={recheck} />;
  }

  if (!isAllowed) {
    return (
      <AccessBlocked 
        clientIP={clientIP} 
        showIP={showIPOnBlock} 
        onRetry={recheck} 
      />
    );
  }

  return <>{children}</>;
});

IPGuard.displayName = 'IPGuard';

export { IPGuard, IPCheckLoading, AccessBlocked, IPCheckError };
export default IPGuard;
