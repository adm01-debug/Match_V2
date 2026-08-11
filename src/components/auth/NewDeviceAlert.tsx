import { useState } from 'react';
import { AlertTriangle, Monitor, Smartphone, Tablet, Check, X } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DeviceInfo } from '@/lib/deviceFingerprint';

interface NewDeviceAlertProps {
  isOpen: boolean;
  deviceInfo: DeviceInfo;
  onTrustDevice: () => Promise<void>;
  onDismiss: () => void;
}

export const NewDeviceAlert = ({
  isOpen,
  deviceInfo,
  onTrustDevice,
  onDismiss,
}: NewDeviceAlertProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const getDeviceIcon = () => {
    switch (deviceInfo.device) {
      case 'Mobile':
        return <Smartphone className="h-12 w-12 text-warning" />;
      case 'Tablet':
        return <Tablet className="h-12 w-12 text-warning" />;
      default:
        return <Monitor className="h-12 w-12 text-warning" />;
    }
  };

  const handleTrust = async () => {
    setIsLoading(true);
    try {
      await onTrustDevice();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              {getDeviceIcon()}
              <div className="absolute -top-1 -right-1 bg-warning rounded-full p-1">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
          <AlertDialogTitle className="text-center text-xl">
            Novo dispositivo detectado
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Identificamos que você está acessando de um dispositivo que não reconhecemos.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-muted rounded-lg p-4 space-y-2 my-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Navegador:</span>
            <span className="font-medium">{deviceInfo.browser}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Sistema:</span>
            <span className="font-medium">{deviceInfo.os}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tipo:</span>
            <span className="font-medium">{deviceInfo.device}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Fuso horário:</span>
            <span className="font-medium">{deviceInfo.timezone}</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground text-center">
          Um email de segurança foi enviado para sua conta. 
          Deseja adicionar este dispositivo como confiável?
        </p>

        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onDismiss}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Não, obrigado
          </Button>
          <Button
            onClick={handleTrust}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            <Check className="h-4 w-4 mr-2" />
            {isLoading ? 'Salvando...' : 'Confiar neste dispositivo'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
