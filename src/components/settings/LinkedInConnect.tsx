import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Linkedin, ExternalLink, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LinkedInConnectProps { onConnect?: () => void; onDisconnect?: () => void; }

export function LinkedInConnect({ onConnect, onDisconnect }: LinkedInConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsLoading(false);
      toast({ title: 'LinkedIn conectado com sucesso' });
      onConnect?.();
    }, 1500);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    toast({ title: 'LinkedIn desconectado' });
    onDisconnect?.();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <Linkedin className="h-8 w-8 text-[#0077B5]" />
        <div className="flex-1">
          <CardTitle className="text-lg">LinkedIn</CardTitle>
          <CardDescription>Publique vagas e importe candidatos</CardDescription>
        </div>
        <Badge variant={isConnected ? 'default' : 'secondary'}>{isConnected ? 'Conectado' : 'Desconectado'}</Badge>
      </CardHeader>
      <CardContent>
        {isConnected ? (
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><ExternalLink className="h-4 w-4 mr-1" />Abrir</Button>
            <Button variant="ghost" size="sm" onClick={handleDisconnect}>Desconectar</Button>
          </div>
        ) : (
          <Button onClick={handleConnect} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
            Conectar LinkedIn
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default LinkedInConnect;
