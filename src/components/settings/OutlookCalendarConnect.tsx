import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props { onConnect?: () => void; onDisconnect?: () => void; }

export function OutlookCalendarConnect({ onConnect, onDisconnect }: Props) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = () => {
    setIsLoading(true);
    setTimeout(() => {
      const next = !isConnected;
      setIsConnected(next);
      setIsLoading(false);
      toast({ title: next ? 'Outlook Calendar conectado' : 'Outlook Calendar desconectado' });
      next ? onConnect?.() : onDisconnect?.();
    }, 1500);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <Calendar className="h-8 w-8 text-[#0078d4]" />
        <div className="flex-1">
          <CardTitle className="text-lg">Outlook Calendar</CardTitle>
          <CardDescription>Sincronize entrevistas com Microsoft Outlook</CardDescription>
        </div>
        <Badge variant={isConnected ? 'default' : 'secondary'}>{isConnected ? 'Conectado' : 'Desconectado'}</Badge>
      </CardHeader>
      <CardContent>
        <Button onClick={handleToggle} disabled={isLoading} variant={isConnected ? 'outline' : 'default'}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
          {isConnected ? 'Desconectar' : 'Conectar Outlook'}
        </Button>
      </CardContent>
    </Card>
  );
}

export default OutlookCalendarConnect;
