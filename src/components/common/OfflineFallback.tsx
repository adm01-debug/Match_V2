import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WifiOff, RefreshCw, Database, Cloud, CheckCircle2 } from 'lucide-react';

interface OfflineFallbackProps {
  onRetry?: () => void;
  cachedData?: {
    candidatos?: number;
    vagas?: number;
    lastSync?: Date;
  };
}

export function OfflineFallback({ onRetry, cachedData }: OfflineFallbackProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      if (onRetry) await onRetry();
    } finally {
      setIsRetrying(false);
    }
  };

  if (isOnline) {
    return (
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
            <div>
              <p className="font-medium text-green-800 dark:text-green-200">Conexão restaurada!</p>
              <p className="text-sm text-green-600 dark:text-green-300">Sincronizando dados...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[50vh] p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 rounded-full bg-yellow-100 dark:bg-yellow-900/30 w-fit">
            <WifiOff className="h-10 w-10 text-yellow-600 dark:text-yellow-400" />
          </div>
          <CardTitle>Você está offline</CardTitle>
          <CardDescription>
            Não foi possível conectar à internet. Algumas funcionalidades podem estar limitadas.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {cachedData && (
            <div className="bg-muted rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Database className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Dados em cache disponíveis:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {cachedData.candidatos !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Candidatos: </span>
                    <span className="font-medium">{cachedData.candidatos}</span>
                  </div>
                )}
                {cachedData.vagas !== undefined && (
                  <div>
                    <span className="text-muted-foreground">Vagas: </span>
                    <span className="font-medium">{cachedData.vagas}</span>
                  </div>
                )}
              </div>
              {cachedData.lastSync && (
                <div className="mt-2 text-xs text-muted-foreground">
                  Última sincronização: {cachedData.lastSync.toLocaleString('pt-BR')}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Button onClick={handleRetry} disabled={isRetrying} className="w-full">
              <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Tentando reconectar...' : 'Tentar novamente'}
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
              <Cloud className="h-4 w-4 mr-2" />
              Recarregar página
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Suas alterações serão sincronizadas automaticamente quando a conexão for restaurada.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
