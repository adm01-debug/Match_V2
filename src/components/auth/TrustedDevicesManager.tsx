import { useState } from 'react';
import { Monitor, Smartphone, Tablet, Trash2, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useTrustedDevices } from '@/hooks/useTrustedDevices';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const TrustedDevicesManager = () => {
  const {
    devices,
    currentDevice,
    isCurrentDeviceTrusted,
    isLoading,
    trustCurrentDevice,
    removeDevice,
    removeAllDevices,
  } = useTrustedDevices();

  const [removingId, setRemovingId] = useState<string | null>(null);

  const getDeviceIcon = (deviceName: string | null) => {
    if (!deviceName) return <Monitor className="h-5 w-5" />;
    if (deviceName.toLowerCase().includes('mobile')) return <Smartphone className="h-5 w-5" />;
    if (deviceName.toLowerCase().includes('tablet')) return <Tablet className="h-5 w-5" />;
    return <Monitor className="h-5 w-5" />;
  };

  const handleRemove = async (deviceId: string) => {
    setRemovingId(deviceId);
    await removeDevice(deviceId);
    setRemovingId(null);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            Dispositivos Confiáveis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
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
              <ShieldCheck className="h-5 w-5" />
              Dispositivos Confiáveis
            </CardTitle>
            <CardDescription>
              Gerencie os dispositivos que podem acessar sua conta sem verificação adicional
            </CardDescription>
          </div>
          {devices.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive">
                  Remover todos
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remover todos os dispositivos?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Isso removerá todos os dispositivos confiáveis. Você precisará verificar
                    novamente em cada dispositivo no próximo login.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={removeAllDevices} className="bg-destructive text-destructive-foreground">
                    Remover todos
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Current device status */}
        {currentDevice && (
          <div className={`p-4 rounded-lg border mb-4 ${isCurrentDeviceTrusted ? 'bg-success border-success dark:bg-success/20 dark:border-success' : 'bg-warning border-warning dark:bg-warning/20 dark:border-warning'}`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${isCurrentDeviceTrusted ? 'bg-success dark:bg-success/40' : 'bg-warning dark:bg-warning/40'}`}>
                {getDeviceIcon(currentDevice.device)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Dispositivo atual</span>
                  {isCurrentDeviceTrusted ? (
                    <Badge variant="default" className="bg-success">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Confiável
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-warning text-white">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Não confiável
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentDevice.browser} em {currentDevice.os}
                </p>
              </div>
              {!isCurrentDeviceTrusted && (
                <Button size="sm" onClick={trustCurrentDevice}>
                  Confiar
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Trusted devices list */}
        {devices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Monitor className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhum dispositivo confiável cadastrado</p>
            <p className="text-sm">Adicione dispositivos para login mais rápido</p>
          </div>
        ) : (
          <div className="space-y-3">
            {devices.map(device => {
              const isCurrentDeviceItem = currentDevice && device.device_hash === currentDevice.fingerprint;
              
              return (
                <div
                  key={device.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${isCurrentDeviceItem ? 'border-primary bg-primary/5' : ''}`}
                >
                  <div className="p-2 bg-muted rounded-lg">
                    {getDeviceIcon(device.device_name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {device.device_name || 'Dispositivo desconhecido'}
                      </span>
                      {isCurrentDeviceItem && (
                        <Badge variant="outline" className="text-xs">Este dispositivo</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Último acesso: {formatDistanceToNow(new Date(device.last_used_at), { addSuffix: true, locale: ptBR })}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive"
                    onClick={() => handleRemove(device.id)}
                    disabled={removingId === device.id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
