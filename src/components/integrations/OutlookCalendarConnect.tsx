import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Calendar, CheckCircle2, AlertCircle, RefreshCw, Settings, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OutlookCalendar {
  id: string;
  name: string;
  color: string;
  isDefault: boolean;
}

interface OutlookCalendarConnectProps {
  isConnected: boolean;
  calendars: OutlookCalendar[];
  selectedCalendars: string[];
  onConnect: () => Promise<boolean>;
  onDisconnect: () => Promise<void>;
  onSelectCalendars: (ids: string[]) => void;
  onSync: () => Promise<void>;
  lastSync?: Date;
}

export function OutlookCalendarConnect({
  isConnected,
  calendars,
  selectedCalendars,
  onConnect,
  onDisconnect,
  onSelectCalendars,
  onSync,
  lastSync,
}: OutlookCalendarConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [bidirectionalSync, setBidirectionalSync] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const success = await onConnect();
      if (success) {
        toast({ title: 'Conectado!', description: 'Sua conta Microsoft foi vinculada.' });
      }
    } catch {
      toast({ title: 'Erro', description: 'Falha ao conectar com Microsoft.', variant: 'destructive' });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await onSync();
      toast({ title: 'Sincronizado!', description: 'Calendário atualizado.' });
    } catch {
      toast({ title: 'Erro', description: 'Falha na sincronização.', variant: 'destructive' });
    } finally {
      setIsSyncing(false);
    }
  };

  const toggleCalendar = (id: string) => {
    const newSelection = selectedCalendars.includes(id)
      ? selectedCalendars.filter((c) => c !== id)
      : [...selectedCalendars, id];
    onSelectCalendars(newSelection);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Outlook Calendar
                {isConnected ? (
                  <Badge variant="default" className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Conectado</Badge>
                ) : (
                  <Badge variant="secondary"><AlertCircle className="h-3 w-3 mr-1" />Desconectado</Badge>
                )}
              </CardTitle>
              <CardDescription>Sincronize entrevistas com seu calendário Microsoft</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isConnected ? (
          <>
            <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              {isConnecting ? 'Conectando...' : 'Entrar com Microsoft'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Você será redirecionado para autenticação segura da Microsoft
            </p>
          </>
        ) : (
          <>
            <div className="space-y-3">
              <Label>Calendários para sincronizar</Label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {calendars.map((calendar) => (
                  <div key={calendar.id} className="flex items-center gap-2 p-2 border rounded">
                    <Checkbox
                      id={calendar.id}
                      checked={selectedCalendars.includes(calendar.id)}
                      onCheckedChange={() => toggleCalendar(calendar.id)}
                    />
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: calendar.color }} />
                    <Label htmlFor={calendar.id} className="flex-1 cursor-pointer">
                      {calendar.name}
                      {calendar.isDefault && <Badge variant="outline" className="ml-2 text-xs">Padrão</Badge>}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="text-sm">Sincronização bidirecional</span>
                </div>
                <Switch checked={bidirectionalSync} onCheckedChange={setBidirectionalSync} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  <span className="text-sm">Sincronização automática</span>
                </div>
                <Switch checked={autoSync} onCheckedChange={setAutoSync} />
              </div>
            </div>

            {lastSync && (
              <p className="text-xs text-muted-foreground">
                Última sincronização: {lastSync.toLocaleString('pt-BR')}
              </p>
            )}

            <div className="flex gap-2">
              <Button onClick={handleSync} disabled={isSyncing} variant="outline" className="flex-1">
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Sincronizando...' : 'Sincronizar Agora'}
              </Button>
              <Button onClick={onDisconnect} variant="destructive">Desconectar</Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
