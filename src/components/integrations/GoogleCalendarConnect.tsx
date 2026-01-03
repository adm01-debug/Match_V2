import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ExternalLink, Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GoogleCalendarConnectProps {
  isConnected?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function GoogleCalendarConnect({ 
  isConnected = false, 
  onConnect, 
  onDisconnect 
}: GoogleCalendarConnectProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      // Em produção, redirecionar para OAuth do Google
      await new Promise(resolve => setTimeout(resolve, 1000));
      onConnect?.();
      toast({
        title: 'Google Calendar conectado',
        description: 'Sua agenda foi sincronizada com sucesso.',
      });
    } catch {
      toast({
        title: 'Erro ao conectar',
        description: 'Não foi possível conectar ao Google Calendar.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onDisconnect?.();
      toast({
        title: 'Desconectado',
        description: 'Google Calendar foi desconectado.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <CardTitle className="text-base">Google Calendar</CardTitle>
              <CardDescription>Sincronize entrevistas com sua agenda</CardDescription>
            </div>
          </div>
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? (
              <><Check className="h-3 w-3 mr-1" /> Conectado</>
            ) : (
              <><X className="h-3 w-3 mr-1" /> Desconectado</>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {isConnected ? (
            <Button 
              variant="outline" 
              onClick={handleDisconnect} 
              disabled={isLoading}
            >
              Desconectar
            </Button>
          ) : (
            <Button onClick={handleConnect} disabled={isLoading}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Conectar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default GoogleCalendarConnect;
