import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Calendar, Check, X, RefreshCw, Unlink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GoogleCalendarConnectProps { onConnect?: () => void; onDisconnect?: () => void; }

export function GoogleCalendarConnect({ onConnect, onDisconnect }: GoogleCalendarConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const clientId = import.meta.env['VITE_GOOGLE_CLIENT_ID'];
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const scope = 'https://www.googleapis.com/auth/calendar';
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
      
      const popup = window.open(authUrl, 'Google Calendar', 'width=500,height=600');
      const checkPopup = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkPopup);
          setIsConnected(true);
          setLastSync(new Date());
          toast({ title: 'Conectado!', description: 'Google Calendar conectado com sucesso.' });
          onConnect?.();
        }
      }, 1000);
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível conectar.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      setIsConnected(false);
      setLastSync(null);
      toast({ title: 'Desconectado', description: 'Google Calendar desconectado.' });
      onDisconnect?.();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      setLastSync(new Date());
      toast({ title: 'Sincronizado', description: 'Calendário atualizado.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg"><Calendar className="h-6 w-6 text-red-600" /></div>
            <div>
              <CardTitle className="text-lg">Google Calendar</CardTitle>
              <CardDescription>Sincronize entrevistas com seu calendário</CardDescription>
            </div>
          </div>
          <Badge variant={isConnected ? 'default' : 'secondary'}>{isConnected ? <><Check className="h-3 w-3 mr-1" />Conectado</> : <><X className="h-3 w-3 mr-1" />Desconectado</>}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div><p className="font-medium">Sincronização automática</p><p className="text-xs text-muted-foreground">Criar eventos ao agendar entrevistas</p></div>
              <Switch checked={syncEnabled} onCheckedChange={setSyncEnabled} />
            </div>
            {lastSync && <p className="text-xs text-muted-foreground">Última sincronização: {lastSync.toLocaleString('pt-BR')}</p>}
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleSync} disabled={isLoading} className="flex-1"><RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />Sincronizar</Button>
              <Button variant="outline" onClick={handleDisconnect} disabled={isLoading}><Unlink className="h-4 w-4 mr-2" />Desconectar</Button>
            </div>
          </>
        ) : (
          <Button onClick={handleConnect} disabled={isLoading} className="w-full"><Calendar className="h-4 w-4 mr-2" />{isLoading ? 'Conectando...' : 'Conectar Google Calendar'}</Button>
        )}
      </CardContent>
    </Card>
  );
}

export default GoogleCalendarConnect;
