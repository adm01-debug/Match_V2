/**
 * @component PushNotificationSettings
 * @description Configurações de notificações push para alertas de segurança
 */
import { Bell, BellOff, BellRing, Shield, Smartphone, AlertTriangle, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useState } from 'react';

export function PushNotificationSettings() {
  const {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    subscribe,
    unsubscribe,
    showNotification,
  } = usePushNotifications();

  const [notificationSettings, setNotificationSettings] = useState({
    newDevice: true,
    failedLogin: true,
    suspiciousActivity: true,
    twoFactorEvents: true,
    sessionExpiry: false,
  });

  const handleToggleNotifications = async () => {
    if (isSubscribed) {
      await unsubscribe();
    } else {
      await subscribe();
    }
  };

  const handleTestNotification = () => {
    showNotification('🔔 Teste de Notificação', {
      body: 'As notificações push estão funcionando corretamente!',
      tag: 'test',
    });
  };

  const handleSettingChange = (key: keyof typeof notificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Notificações Push
          </CardTitle>
          <CardDescription>
            Receba alertas de segurança em tempo real
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-warning/10 rounded-lg border border-warning/30">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <div>
              <p className="font-medium text-warning">
                Navegador não suportado
              </p>
              <p className="text-sm text-warning">
                Seu navegador não suporta notificações push. Tente usar Chrome, Firefox ou Edge.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações Push
            </CardTitle>
            <CardDescription>
              Receba alertas de segurança em tempo real no navegador
            </CardDescription>
          </div>
          <Badge variant={isSubscribed ? 'default' : 'secondary'}>
            {isSubscribed ? (
              <>
                <Check className="h-3 w-3 mr-1" />
                Ativo
              </>
            ) : (
              'Inativo'
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Toggle */}
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isSubscribed ? 'bg-success/15' : 'bg-muted'}`}>
              {isSubscribed ? (
                <BellRing className="h-5 w-5 text-success" />
              ) : (
                <BellOff className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium">Notificações push</p>
              <p className="text-sm text-muted-foreground">
                {isSubscribed 
                  ? 'Você receberá alertas de segurança' 
                  : 'Ative para receber alertas'}
              </p>
            </div>
          </div>
          <Switch
            checked={isSubscribed}
            onCheckedChange={handleToggleNotifications}
            disabled={isLoading}
          />
        </div>

        {permission === 'denied' && (
          <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/30">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <div>
              <p className="font-medium text-destructive">
                Permissão bloqueada
              </p>
              <p className="text-sm text-destructive">
                As notificações foram bloqueadas. Altere nas configurações do navegador.
              </p>
            </div>
          </div>
        )}

        {isSubscribed && (
          <>
            <Separator />

            {/* Notification Types */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Tipos de Alertas
              </h4>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Novo dispositivo</p>
                      <p className="text-xs text-muted-foreground">
                        Alertar quando um novo dispositivo fizer login
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.newDevice}
                    onCheckedChange={() => handleSettingChange('newDevice')}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Tentativas de login falhas</p>
                      <p className="text-xs text-muted-foreground">
                        Alertar sobre tentativas de login incorretas
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.failedLogin}
                    onCheckedChange={() => handleSettingChange('failedLogin')}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Atividade suspeita</p>
                      <p className="text-xs text-muted-foreground">
                        Alertar sobre atividades incomuns na conta
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.suspiciousActivity}
                    onCheckedChange={() => handleSettingChange('suspiciousActivity')}
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">Eventos 2FA</p>
                      <p className="text-xs text-muted-foreground">
                        Alertar sobre alterações na autenticação de dois fatores
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.twoFactorEvents}
                    onCheckedChange={() => handleSettingChange('twoFactorEvents')}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Test Button */}
            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={handleTestNotification}>
                <Bell className="h-4 w-4 mr-2" />
                Testar notificação
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default PushNotificationSettings;
