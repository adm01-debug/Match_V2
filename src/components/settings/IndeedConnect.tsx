import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props { onConnect?: () => void; onDisconnect?: () => void; }

export function IndeedConnect({ onConnect, onDisconnect }: Props) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = () => {
    setIsLoading(true);
    setTimeout(() => {
      const next = !isConnected;
      setIsConnected(next);
      setIsLoading(false);
      toast({ title: next ? 'Indeed conectado' : 'Indeed desconectado' });
      next ? onConnect?.() : onDisconnect?.();
    }, 1500);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <Search className="h-8 w-8 text-[#2164f3]" />
        <div className="flex-1">
          <CardTitle className="text-lg">Indeed</CardTitle>
          <CardDescription>Publique vagas no Indeed</CardDescription>
        </div>
        <Badge variant={isConnected ? 'default' : 'secondary'}>{isConnected ? 'Conectado' : 'Desconectado'}</Badge>
      </CardHeader>
      <CardContent>
        <Button onClick={handleToggle} disabled={isLoading} variant={isConnected ? 'outline' : 'default'}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
          {isConnected ? 'Desconectar' : 'Conectar Indeed'}
        </Button>
      </CardContent>
    </Card>
  );
}

export default IndeedConnect;
