import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, CheckCircle2, XCircle, Loader2, Hash, Bell } from 'lucide-react';

interface SlackChannel { id: string; name: string; }
interface NotificationSetting { event: string; label: string; enabled: boolean; channel?: string; }

interface SlackConnectProps {
  isConnected: boolean;
  workspace?: string;
  channels?: SlackChannel[];
  notifications?: NotificationSetting[];
  onConnect: () => Promise<void>;
  onDisconnect: () => void;
  onNotificationToggle: (event: string, enabled: boolean) => void;
  onChannelChange: (event: string, channelId: string) => void;
}

export function SlackConnect({
  isConnected, workspace, channels = [], notifications = [],
  onConnect, onDisconnect, onNotificationToggle, onChannelChange,
}: SlackConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try { await onConnect(); } finally { setIsConnecting(false); }
  };

  const defaultNotifications: NotificationSetting[] = notifications.length > 0 ? notifications : [
    { event: 'new_application', label: 'Nova candidatura', enabled: true },
    { event: 'interview_scheduled', label: 'Entrevista agendada', enabled: true },
    { event: 'candidate_hired', label: 'Candidato contratado', enabled: true },
    { event: 'job_published', label: 'Vaga publicada', enabled: false },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Slack</CardTitle>
              <CardDescription>Receba notificações em tempo real</CardDescription>
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
              Conecte seu Slack para receber notificações sobre candidaturas, entrevistas e contratações.
            </p>
            <Button className="w-full" onClick={handleConnect} disabled={isConnecting}>
              {isConnecting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <MessageSquare className="h-4 w-4 mr-2" />}
              {isConnecting ? 'Conectando...' : 'Adicionar ao Slack'}
            </Button>
          </>
        ) : (
          <>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Workspace:</span>
                <span className="font-medium">{workspace}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2"><Bell className="h-4 w-4" />Notificações</Label>
              {defaultNotifications.map((notif) => (
                <div key={notif.event} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Switch checked={notif.enabled} onCheckedChange={(v) => onNotificationToggle(notif.event, v)} />
                    <span className="text-sm">{notif.label}</span>
                  </div>
                  {notif.enabled && channels.length > 0 && (
                    <Select value={notif.channel || ''} onValueChange={(v) => onChannelChange(notif.event, v)}>
                      <SelectTrigger className="w-40"><SelectValue placeholder="Canal" /></SelectTrigger>
                      <SelectContent>
                        {channels.map((ch) => (
                          <SelectItem key={ch.id} value={ch.id}>
                            <span className="flex items-center gap-1"><Hash className="h-3 w-3" />{ch.name}</span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>

            <Button variant="destructive" className="w-full" onClick={onDisconnect}>
              <XCircle className="h-4 w-4 mr-2" />Remover do Slack
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
