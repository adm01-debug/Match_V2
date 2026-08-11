import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { KeyRound } from 'lucide-react';

export function SSOSettings() {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(false);
  const [config, setConfig] = useState({ provider: 'SAML', entityId: '', ssoUrl: '', certificate: '' });

  const handleSave = () => toast({ title: 'Configuração SSO salva' });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5" />Single Sign-On (SSO)</CardTitle>
        <CardDescription>Configure login único via SAML ou OAuth</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Habilitar SSO</Label>
          <Switch checked={enabled} onCheckedChange={setEnabled} />
        </div>
        {enabled && (
          <>
            <div className="space-y-2">
              <Label>Entity ID</Label>
              <Input value={config.entityId} onChange={(e) => setConfig({ ...config, entityId: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>SSO URL</Label>
              <Input value={config.ssoUrl} onChange={(e) => setConfig({ ...config, ssoUrl: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Certificado X.509</Label>
              <Input value={config.certificate} onChange={(e) => setConfig({ ...config, certificate: e.target.value })} placeholder="Colar certificado..." />
            </div>
            <Button onClick={handleSave}>Salvar Configuração</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default SSOSettings;
