import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, CheckCircle2, XCircle, Loader2, Bell } from 'lucide-react';

interface TeamsChannel { id: string; name: string; teamName: string; }

interface TeamsConnectProps {
  isConnected: boolean;
  tenant?: string;
  channels?: TeamsChannel[];
  selectedChannel?: string;
  notificationsEnabled?: boolean;
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  onChannelChange: (channelId: string) => void;
  onNotificationsToggle: (enabled: boolean) => void;
}

export function TeamsConnect({
  isConnected, tenant, channels = [], selectedChannel, notificationsEnabled = false,
  onConnect, onDisconnect, onChannelChange, onNotificationsToggle,
}: TeamsConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try { await onConnect(); } finally { setIsConnecting(false); }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Microsoft Teams</CardTitle>
              <CardDescription>Notificações e colaboração</CardDescription>
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
            <p className="text-sm text-muted-foreground">
              Conecte seu Microsoft Teams para receber notificações e colaborar com sua equipe.
            </p>
            <Button className="w-full" onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Users className="h-4 w-4 mr-2" />}
              {isConnecting ? 'Conectando...' : 'Conectar ao Teams'}
            </Button>
          </>
        ) : (
          <>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Organização:</span>
                <span className="font-medium">{tenant}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Canal para notificações</Label>
              <Select value={selectedChannel || ''} onValueChange={onChannelChange}>
                <SelectTrigger><SelectValue placeholder="Selecione um canal" /></SelectTrigger>
                <SelectContent>
                  {channels.map((ch) => (
                    <SelectItem key={ch.id} value={ch.id}>
                      {ch.teamName} → {ch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-muted-foreground" />
                <div>
                  <Label>Notificações</Label>
                  <p className="text-xs text-muted-foreground">Receber atualizações no Teams</p>
                </div>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={onNotificationsToggle} />
            </div>

            <Button variant="destructive" className="w-full" onClick={onDisconnect}>
              <XCircle className="h-4 w-4 mr-2" />Desconectar
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
