import { memo, useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, CheckCircle2, XCircle, Loader2, Hash, Bell, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SlackChannel { 
  id: string; 
  name: string; 
  isPrivate?: boolean;
}

interface NotificationSetting { 
  event: string; 
  label: string; 
  enabled: boolean; 
  channel?: string; 
}

interface SlackConnectProps {
  isConnected: boolean;
  workspace?: string;
  channels?: SlackChannel[];
  notifications?: NotificationSetting[];
  onConnect: () => Promise<void>;
  onDisconnect: () => Promise<void>;
  onNotificationToggle: (event: string, enabled: boolean) => void;
  onChannelChange: (event: string, channelId: string) => void;
  disabled?: boolean;
}

const DEFAULT_NOTIFICATIONS: NotificationSetting[] = [
  { event: 'new_application', label: 'Nova candidatura', enabled: true },
  { event: 'interview_scheduled', label: 'Entrevista agendada', enabled: true },
  { event: 'candidate_hired', label: 'Candidato contratado', enabled: true },
  { event: 'job_published', label: 'Vaga publicada', enabled: false },
];

function SlackConnectComponent({
  isConnected,
  workspace,
  channels = [],
  notifications = [],
  onConnect,
  onDisconnect,
  onNotificationToggle,
  onChannelChange,
  disabled = false,
}: SlackConnectProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const activeNotifications = useMemo(() => {
    return notifications.length > 0 ? notifications : DEFAULT_NOTIFICATIONS;
  }, [notifications]);

  const handleConnect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      await onConnect();
      toast({ title: 'Conectado!', description: 'Slack integrado com sucesso.' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao conectar com Slack';
      setError(message);
      toast({ title: 'Erro', description: message, variant: 'destructive' });
    } finally {
      setIsConnecting(false);
    }
  }, [onConnect, toast]);

  const handleDisconnect = useCallback(async () => {
    setIsDisconnecting(true);
    try {
      await onDisconnect();
      toast({ title: 'Desconectado', description: 'Integração removida.' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Falha ao desconectar';
      toast({ title: 'Erro', description: message, variant: 'destructive' });
    } finally {
      setIsDisconnecting(false);
    }
  }, [onDisconnect, toast]);

  const handleNotificationToggle = useCallback((event: string, enabled: boolean) => {
    onNotificationToggle(event, enabled);
  }, [onNotificationToggle]);

  const handleChannelChange = useCallback((event: string, channelId: string) => {
    onChannelChange(event, channelId);
  }, [onChannelChange]);

  const isLoading = isConnecting || isDisconnecting;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900" aria-hidden="true">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">Slack</CardTitle>
              <CardDescription>Receba notificações em tempo real</CardDescription>
            </div>
          </div>
          <Badge 
            variant={isConnected ? 'default' : 'secondary'}
            aria-label={isConnected ? 'Status: Conectado' : 'Status: Desconectado'}
          >
            {isConnected ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" aria-hidden="true" />
                Conectado
              </>
            ) : (
              'Desconectado'
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isConnected ? (
          <>
            <p className="text-sm text-muted-foreground">
              Conecte seu Slack para receber notificações sobre candidaturas, entrevistas e contratações.
            </p>
            <Button 
              className="w-full" 
              onClick={handleConnect} 
              disabled={isLoading || disabled}
              aria-busy={isConnecting}
            >
              {isConnecting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
              ) : (
                <MessageSquare className="h-4 w-4 mr-2" aria-hidden="true" />
              )}
              {isConnecting ? 'Conectando...' : 'Adicionar ao Slack'}
            </Button>
          </>
        ) : (
          <>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Workspace:</span>
                <span className="font-medium">{workspace || 'Não identificado'}</span>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Bell className="h-4 w-4" aria-hidden="true" />
                Notificações
              </Label>
              <div role="group" aria-label="Configurações de notificação">
                {activeNotifications.map((notif) => (
                  <div 
                    key={notif.event} 
                    className="flex items-center justify-between p-3 border rounded-lg mb-2"
                  >
                    <div className="flex items-center gap-3">
                      <Switch 
                        id={`notif-${notif.event}`}
                        checked={notif.enabled} 
                        onCheckedChange={(v) => handleNotificationToggle(notif.event, v)}
                        disabled={disabled}
                        aria-describedby={`notif-desc-${notif.event}`}
                      />
                      <label 
                        htmlFor={`notif-${notif.event}`}
                        className="text-sm cursor-pointer"
                        id={`notif-desc-${notif.event}`}
                      >
                        {notif.label}
                      </label>
                    </div>
                    {notif.enabled && channels.length > 0 && (
                      <Select 
                        value={notif.channel || ''} 
                        onValueChange={(v) => handleChannelChange(notif.event, v)}
                        disabled={disabled}
                      >
                        <SelectTrigger 
                          className="w-40" 
                          aria-label={`Canal para ${notif.label}`}
                        >
                          <SelectValue placeholder="Selecionar canal" />
                        </SelectTrigger>
                        <SelectContent>
                          {channels.map((ch) => (
                            <SelectItem key={ch.id} value={ch.id}>
                              <span className="flex items-center gap-1">
                                <Hash className="h-3 w-3" aria-hidden="true" />
                                {ch.name}
                                {ch.isPrivate && ' 🔒'}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Button 
              variant="destructive" 
              className="w-full" 
              onClick={handleDisconnect}
              disabled={isLoading || disabled}
              aria-busy={isDisconnecting}
            >
              {isDisconnecting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" aria-hidden="true" />
              )}
              {isDisconnecting ? 'Desconectando...' : 'Remover do Slack'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

SlackConnectComponent.displayName = 'SlackConnect';

export const SlackConnect = memo(SlackConnectComponent);
export default SlackConnect;
