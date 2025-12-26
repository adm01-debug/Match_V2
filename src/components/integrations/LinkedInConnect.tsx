import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Linkedin, CheckCircle, XCircle, RefreshCw, User } from 'lucide-react';
import { linkedinService } from '@/services/linkedinService';
import { useToast } from '@/hooks/use-toast';

interface LinkedInConnectProps { onProfileImported?: (profile: any) => void; }

export function LinkedInConnect({ onProfileImported }: LinkedInConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const { toast } = useToast();

  const handleConnect = async () => {
    setIsLoading(true);
    try {
      const code = await linkedinService.openAuthPopup();
      const token = await linkedinService.exchangeCodeForToken(code);
      const linkedInProfile = await linkedinService.getProfile(token);
      setProfile(linkedInProfile);
      setIsConnected(true);
      toast({ title: 'Conectado!', description: 'Perfil do LinkedIn importado com sucesso.' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível conectar ao LinkedIn.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    if (profile) {
      const candidatoData = linkedinService.mapToCandidato(profile);
      onProfileImported?.(candidatoData);
      toast({ title: 'Importado!', description: 'Dados do perfil foram importados.' });
    }
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setProfile(null);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0077B5]/10 rounded-lg"><Linkedin className="h-5 w-5 text-[#0077B5]" /></div>
            <div>
              <CardTitle className="text-lg">LinkedIn</CardTitle>
              <CardDescription>Importe dados do perfil profissional</CardDescription>
            </div>
          </div>
          <Badge variant={isConnected ? 'default' : 'secondary'}>
            {isConnected ? <><CheckCircle className="h-3 w-3 mr-1" />Conectado</> : <><XCircle className="h-3 w-3 mr-1" />Desconectado</>}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {isConnected && profile ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                {profile.profilePicture ? <img src={profile.profilePicture} alt="" className="rounded-full" /> : <User className="h-6 w-6" />}
              </div>
              <div>
                <p className="font-medium">{profile.firstName} {profile.lastName}</p>
                <p className="text-sm text-muted-foreground">{profile.headline}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button className="flex-1" onClick={handleImport}><RefreshCw className="h-4 w-4 mr-2" />Importar Dados</Button>
              <Button variant="outline" onClick={handleDisconnect}>Desconectar</Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-4">Conecte seu LinkedIn para importar automaticamente seu perfil profissional.</p>
            <Button onClick={handleConnect} disabled={isLoading} className="bg-[#0077B5] hover:bg-[#006299]">
              <Linkedin className="h-4 w-4 mr-2" />{isLoading ? 'Conectando...' : 'Conectar com LinkedIn'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default LinkedInConnect;
