import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ShieldCheck } from 'lucide-react';

export function GDPRConsent() {
  const { toast } = useToast();
  const [consents, setConsents] = useState({ essential: true, analytics: true, marketing: false });

  const handleSave = () => {
    toast({ title: 'Preferências de privacidade salvas' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" />LGPD / GDPR</CardTitle>
        <CardDescription>Gerencie as preferências de privacidade e consentimento</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Cookies Essenciais</Label>
          <Switch checked={consents.essential} disabled />
        </div>
        <div className="flex items-center justify-between">
          <Label>Analytics</Label>
          <Switch checked={consents.analytics} onCheckedChange={(v) => setConsents({ ...consents, analytics: v })} />
        </div>
        <div className="flex items-center justify-between">
          <Label>Marketing</Label>
          <Switch checked={consents.marketing} onCheckedChange={(v) => setConsents({ ...consents, marketing: v })} />
        </div>
        <Button onClick={handleSave}>Salvar Preferências</Button>
      </CardContent>
    </Card>
  );
}

export function DataRetentionSettings() {
  const { toast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Retenção de Dados</CardTitle>
        <CardDescription>Configure por quanto tempo os dados são mantidos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p>• Dados de candidatos: <strong>365 dias</strong></p>
        <p>• Logs de comunicação: <strong>180 dias</strong></p>
        <p>• Logs de auditoria: <strong>90 dias</strong></p>
        <p>• Dados de sessão: <strong>30 dias</strong></p>
        <Button variant="outline" className="mt-4" onClick={() => toast({ title: 'Política de retenção atualizada' })}>Atualizar Política</Button>
      </CardContent>
    </Card>
  );
}
