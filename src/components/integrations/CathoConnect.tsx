import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Loader2, ExternalLink, RefreshCw, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CathoConnectProps {
  isConnected: boolean;
  config?: { clientId: string; clientSecret: string };
  onConnect: (config: { clientId: string; clientSecret: string }) => Promise<boolean>;
  onDisconnect: () => void;
  onTest: () => Promise<boolean>;
}

export function CathoConnect({ isConnected, config, onConnect, onDisconnect, onTest }: CathoConnectProps) {
  const [clientId, setClientId] = useState(config?.clientId || '');
  const [clientSecret, setClientSecret] = useState(config?.clientSecret || '');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const { toast } = useToast();

  const handleConnect = async () => {
    if (!clientId || !clientSecret) {
      toast({ title: 'Erro', description: 'Preencha todos os campos.', variant: 'destructive' });
      return;
    }
    setIsConnecting(true);
    try {
      const success = await onConnect({ clientId, clientSecret });
      if (success) toast({ title: 'Conectado!', description: 'Integração com Catho configurada.' });
      else toast({ title: 'Erro', description: 'Falha ao conectar.', variant: 'destructive' });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const success = await onTest();
      setTestResult(success ? 'success' : 'error');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900">
              <Search className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Catho</CardTitle>
              <CardDescription>Publique vagas e acesse banco de currículos</CardDescription>
            </div>
          </div>
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? <><CheckCircle2 className="h-3 w-3 mr-1" />Conectado</> : 'Desconectado'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <>
            <div className="space-y-2">
              <Label>Client ID</Label>
              <Input value={clientId} onChange={(e) => setClientId(e.target.value)} placeholder="Seu Client ID da Catho" />
            </div>
            <div className="space-y-2">
              <Label>Client Secret</Label>
              <Input type="password" value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} placeholder="Seu Client Secret" />
            </div>
            <Button className="w-full" onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ExternalLink className="h-4 w-4 mr-2" />}
              {isConnecting ? 'Conectando...' : 'Conectar à Catho'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              <a href="https://www.catho.com.br/empresas" target="_blank" rel="noopener noreferrer" className="underline">
                Obter credenciais no Catho Empresas
              </a>
            </p>
          </>
        ) : (
          <>
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Client ID:</span>
                <span className="font-mono">{config?.clientId}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleTest} disabled={isTesting}>
                {isTesting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                Testar
              </Button>
              <Button variant="destructive" onClick={onDisconnect}>
                <XCircle className="h-4 w-4 mr-2" />
                Desconectar
              </Button>
            </div>
            {testResult && (
              <div className={`p-3 rounded-lg flex items-center gap-2 ${testResult === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                {testResult === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <span className="text-sm">{testResult === 'success' ? 'Conexão OK!' : 'Falha na conexão'}</span>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
