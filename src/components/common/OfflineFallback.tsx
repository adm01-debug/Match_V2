import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function OfflineFallback() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => {
      setIsOffline(false);
      setLastSync(new Date());
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="text-center space-y-4 p-8 max-w-md">
        <WifiOff className="h-16 w-16 text-muted-foreground mx-auto animate-pulse" />
        <h2 className="text-2xl font-bold">Sem conexão</h2>
        <p className="text-muted-foreground">
          Você está offline. Verifique sua conexão com a internet e tente novamente.
        </p>
        {lastSync && (
          <p className="text-sm text-muted-foreground">
            Última sincronização: {lastSync.toLocaleString('pt-BR')}
          </p>
        )}
        <Button onClick={() => window.location.reload()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    </div>
  );
}

export default OfflineFallback;
