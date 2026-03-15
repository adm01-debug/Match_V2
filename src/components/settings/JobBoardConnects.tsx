import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Check, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Props { onConnect?: () => void; onDisconnect?: () => void; }

function JobBoardConnect({ name, icon, color, onConnect, onDisconnect }: Props & { name: string; icon: React.ReactNode; color: string }) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleToggle = () => {
    setIsLoading(true);
    setTimeout(() => {
      const next = !isConnected;
      setIsConnected(next);
      setIsLoading(false);
      toast({ title: next ? `${name} conectado` : `${name} desconectado` });
      next ? onConnect?.() : onDisconnect?.();
    }, 1500);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <div style={{ color }}>{icon}</div>
        <div className="flex-1">
          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription>Integração com {name}</CardDescription>
        </div>
        <Badge variant={isConnected ? 'default' : 'secondary'}>{isConnected ? 'Conectado' : 'Desconectado'}</Badge>
      </CardHeader>
      <CardContent>
        <Button onClick={handleToggle} disabled={isLoading} variant={isConnected ? 'outline' : 'default'}>
          {isLoading ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
          {isConnected ? 'Desconectar' : `Conectar ${name}`}
        </Button>
      </CardContent>
    </Card>
  );
}

export function CathoConnect(props: Props) {
  return <JobBoardConnect name="Catho" icon={<Briefcase className="h-8 w-8" />} color="#e74c3c" {...props} />;
}

export function InfoJobsConnect(props: Props) {
  return <JobBoardConnect name="InfoJobs" icon={<Briefcase className="h-8 w-8" />} color="#ff6600" {...props} />;
}

export function VagasConnect(props: Props) {
  return <JobBoardConnect name="Vagas.com" icon={<Briefcase className="h-8 w-8" />} color="#00a859" {...props} />;
}
