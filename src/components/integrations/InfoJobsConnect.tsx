import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Building2, CheckCircle2, AlertCircle, RefreshCw, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InfoJobsConnectProps {
  isConnected: boolean;
  onConnect: (credentials: { clientId: string; clientSecret: string }) => Promise<boolean>;
  onDisconnect: () => Promise<void>;
  onSync: () => Promise<void>;
  lastSync?: Date;
}

export function InfoJobsConnect({ isConnected, onConnect, onDisconnect, onSync, lastSync }: InfoJobsConnectProps) {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!clientId || !clientSecret) {
      toast({ title: 'Erro', description: 'Preencha todos os campos.', variant: 'destructive' });
      return;
    }
    setIsConnecting(true);
    try {
      const success = await onConnect({ clientId, clientSecret });
      if (success) {
        toast({ title: 'Conectado!', description: 'Integração com InfoJobs ativa.' });
      }
    } catch {
      toast({ title: 'Erro', description: 'Falha ao conectar.', variant: 'destructive' });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await onSync();
      toast({ title: 'Sincronizado!', description: 'Dados atualizados com sucesso.' });
    } catch {
      toast({ title: 'Erro', description: 'Falha na sincronização.', variant: 'destructive' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Building2 className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                InfoJobs Brasil
                {isConnected ? (
                  <Badge variant="default" className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Conectado</Badge>
                ) : (
                  <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Desconectado</Badge>
                )}
              </CardTitle>
              <CardDescription>Publique vagas e gerencie candidaturas do InfoJobs</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="infojobs-client-id">Client ID</Label>
              <Input
                id="infojobs-client-id"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Seu Client ID do InfoJobs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="infojobs-client-secret">Client Secret</Label>
              <Input
                id="infojobs-client-secret"
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="Seu Client Secret"
              />
            </div>
            <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
              {isConnecting ? 'Conectando...' : 'Conectar'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Credenciais disponíveis no Portal de Desenvolvedores InfoJobs
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="text-sm">Sincronização automática</span>
              </div>
              <Switch checked={autoSync} onCheckedChange={setAutoSync} />
            </div>
            {lastSync && (
              <p className="text-xs text-muted-foreground">
                Última sincronização: {lastSync.toLocaleString('pt-BR')}
              </p>
            )}
            <div className="flex gap-2">
              <Button onClick={handleSync} disabled={isSyncing} variant="outline" className="flex-1">
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Sincronizando...' : 'Sincronizar'}
              </Button>
              <Button onClick={onDisconnect} variant="destructive">Desconectar</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
