import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Briefcase, CheckCircle2, AlertCircle, RefreshCw, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VagasConnectProps {
  isConnected: boolean;
  onConnect: (credentials: { apiKey: string; companyId: string }) => Promise<boolean>;
  onDisconnect: () => Promise<void>;
  onSync: () => Promise<void>;
  lastSync?: Date;
}

export function VagasConnect({ isConnected, onConnect, onDisconnect, onSync, lastSync }: VagasConnectProps) {
  const [apiKey, setApiKey] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!apiKey || !companyId) {
      toast({ title: 'Erro', description: 'Preencha todos os campos.', variant: 'destructive' });
      return;
    }
    setIsConnecting(true);
    try {
      const success = await onConnect({ apiKey, companyId });
      if (success) {
        toast({ title: 'Conectado!', description: 'Integração com Vagas.com.br ativa.' });
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
            <div className="p-2 bg-green-100 rounded-lg">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Vagas.com.br
                {isConnected ? (
                  <Badge variant="default" className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Conectado</Badge>
                ) : (
                  <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Desconectado</Badge>
                )}
              </CardTitle>
              <CardDescription>Publique vagas e receba candidaturas do Vagas.com.br</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="vagas-api-key">API Key</Label>
              <Input
                id="vagas-api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Sua chave de API do Vagas.com.br"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vagas-company-id">ID da Empresa</Label>
              <Input
                id="vagas-company-id"
                value={companyId}
                onChange={(e) => setCompanyId(e.target.value)}
                placeholder="ID da sua empresa no Vagas.com.br"
              />
            </div>
            <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
              {isConnecting ? 'Conectando...' : 'Conectar'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Obtenha suas credenciais no painel de parceiros do Vagas.com.br
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
