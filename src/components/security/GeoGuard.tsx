/**
 * @fileoverview Geographic Guard Component
 * @module components/security/GeoGuard
 * @description Componente wrapper para proteger rotas com verificação geográfica
 */

import React, { memo, type ReactNode } from 'react';
import { Shield, AlertTriangle, Globe, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useGeoVerification } from '@/hooks/useGeoVerification';
import { GEO_SECURITY_CONFIG } from '@/services/geoService';

interface GeoGuardProps {
  readonly children: ReactNode;
  readonly fallback?: ReactNode;
  readonly showCountryOnBlock?: boolean;
}

/**
 * Componente de loading durante verificação
 */
const GeoCheckLoading = memo(() => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <div className="text-center space-y-4">
      <Globe className="h-12 w-12 animate-pulse text-primary mx-auto" />
      <p className="text-muted-foreground">Verificando localização...</p>
    </div>
  </div>
));
GeoCheckLoading.displayName = 'GeoCheckLoading';

/**
 * Componente exibido quando acesso é bloqueado
 */
interface AccessBlockedProps {
  readonly countryName: string | null;
  readonly countryCode: string | null;
  readonly showCountry: boolean;
  readonly onRetry: () => void;
}

const GeoAccessBlocked = memo(({ 
  countryName, 
  countryCode,
  showCountry, 
  onRetry 
}: AccessBlockedProps) => (
  <div className="flex items-center justify-center min-h-screen bg-background p-4">
    <div className="max-w-md w-full space-y-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Acesso Restrito por Localização</AlertTitle>
        <AlertDescription className="mt-2">
          {GEO_SECURITY_CONFIG.blockedMessage}
        </AlertDescription>
      </Alert>

      {showCountry && countryName && (
        <div className="bg-muted p-4 rounded-lg text-center">
          <p className="text-sm text-muted-foreground mb-1">País detectado:</p>
          <p className="text-lg font-semibold flex items-center justify-center gap-2">
            <Globe className="h-5 w-5" />
            {countryName} ({countryCode})
          </p>
        </div>
      )}

      <div className="text-center">
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Verificar Novamente
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Se você acredita que isso é um erro, entre em contato com o administrador.
      </p>
    </div>
  </div>
));
GeoAccessBlocked.displayName = 'GeoAccessBlocked';

/**
 * Componente exibido quando há erro na verificação
 */
interface GeoCheckErrorProps {
  readonly onRetry: () => void;
}

const GeoCheckError = memo(({ onRetry }: GeoCheckErrorProps) => (
  <div className="flex items-center justify-center min-h-screen bg-background p-4">
    <div className="max-w-md w-full space-y-6">
      <Alert variant="destructive">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Erro na Verificação</AlertTitle>
        <AlertDescription>
          Não foi possível verificar sua localização. Tente novamente.
        </AlertDescription>
      </Alert>

      <div className="text-center">
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Tentar Novamente
        </Button>
      </div>
    </div>
  </div>
));
GeoCheckError.displayName = 'GeoCheckError';

/**
 * Componente principal que protege rotas com verificação geográfica
 */
export const GeoGuard = memo(({ 
  children, 
  fallback,
  showCountryOnBlock = true 
}: GeoGuardProps) => {
  const { 
    isAllowed, 
    isLoading, 
    isError,
    countryCode,
    countryName,
    recheck 
  } = useGeoVerification();

  if (isLoading) {
    return fallback ?? <GeoCheckLoading />;
  }

  if (isError) {
    return <GeoCheckError onRetry={recheck} />;
  }

  if (!isAllowed) {
    return (
      <GeoAccessBlocked
        countryName={countryName}
        countryCode={countryCode}
        showCountry={showCountryOnBlock}
        onRetry={recheck}
      />
    );
  }

  return <>{children}</>;
});

GeoGuard.displayName = 'GeoGuard';

export { GeoCheckLoading, GeoAccessBlocked, GeoCheckError };
export default GeoGuard;
