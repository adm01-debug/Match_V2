import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, Key, Settings, CheckCircle2, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SSOConfig {
  enabled: boolean;
  provider: 'saml' | 'oidc' | 'azure' | 'okta' | 'google';
  entityId?: string;
  ssoUrl?: string;
  certificate?: string;
  clientId?: string;
  clientSecret?: string;
  tenantId?: string;
  domain?: string;
  claimMappings: { email: string; name: string; role?: string };
  allowedDomains: string[];
  autoProvision: boolean;
  defaultRole: string;
}

interface SSOSettingsProps {
  config: SSOConfig;
  onSave: (config: SSOConfig) => Promise<void>;
  onTest?: () => Promise<boolean>;
}

export function SSOSettings({ config: initialConfig, onSave, onTest }: SSOSettingsProps) {
  const [config, setConfig] = useState<SSOConfig>(initialConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);
  const { toast } = useToast();

  const updateConfig = <K extends keyof SSOConfig>(key: K, value: SSOConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(config);
      toast({ title: 'Configurações salvas', description: 'SSO configurado com sucesso.' });
    } catch {
      toast({ title: 'Erro', description: 'Falha ao salvar configurações.', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    if (!onTest) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      const success = await onTest();
      setTestResult(success ? 'success' : 'error');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Single Sign-On (SSO)</CardTitle>
            </div>
            <Switch checked={config.enabled} onCheckedChange={(v) => updateConfig('enabled', v)} />
          </div>
          <CardDescription>Configure autenticação centralizada para sua organização</CardDescription>
        </CardHeader>
      </Card>

      {config.enabled && (
        <Tabs defaultValue="provider" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="provider">Provedor</TabsTrigger>
            <TabsTrigger value="claims">Mapeamento</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="provider">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Provedor de Identidade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tipo de SSO</Label>
                  <Select value={config.provider} onValueChange={(v: SSOConfig['provider']) => updateConfig('provider', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saml">SAML 2.0</SelectItem>
                      <SelectItem value="oidc">OAuth 2.0 / OIDC</SelectItem>
                      <SelectItem value="azure">Azure AD</SelectItem>
                      <SelectItem value="okta">Okta</SelectItem>
                      <SelectItem value="google">Google Workspace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(config.provider === 'saml') && (
                  <>
                    <div className="space-y-2">
                      <Label>Entity ID</Label>
                      <Input value={config.entityId || ''} onChange={(e) => updateConfig('entityId', e.target.value)} placeholder="https://idp.example.com/entity" />
                    </div>
                    <div className="space-y-2">
                      <Label>SSO URL</Label>
                      <Input value={config.ssoUrl || ''} onChange={(e) => updateConfig('ssoUrl', e.target.value)} placeholder="https://idp.example.com/sso" />
                    </div>
                    <div className="space-y-2">
                      <Label>Certificado X.509</Label>
                      <Textarea value={config.certificate || ''} onChange={(e) => updateConfig('certificate', e.target.value)} placeholder="-----BEGIN CERTIFICATE-----" rows={4} className="font-mono text-xs" />
                    </div>
                  </>
                )}

                {(config.provider === 'oidc' || config.provider === 'azure' || config.provider === 'okta' || config.provider === 'google') && (
                  <>
                    <div className="space-y-2">
                      <Label>Client ID</Label>
                      <Input value={config.clientId || ''} onChange={(e) => updateConfig('clientId', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Client Secret</Label>
                      <Input type="password" value={config.clientSecret || ''} onChange={(e) => updateConfig('clientSecret', e.target.value)} />
                    </div>
                    {config.provider === 'azure' && (
                      <div className="space-y-2">
                        <Label>Tenant ID</Label>
                        <Input value={config.tenantId || ''} onChange={(e) => updateConfig('tenantId', e.target.value)} />
                      </div>
                    )}
                    {config.provider === 'okta' && (
                      <div className="space-y-2">
                        <Label>Okta Domain</Label>
                        <Input value={config.domain || ''} onChange={(e) => updateConfig('domain', e.target.value)} placeholder="your-org.okta.com" />
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="claims">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Key className="h-4 w-4" />Mapeamento de Claims</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Claim de E-mail</Label>
                    <Input value={config.claimMappings.email} onChange={(e) => updateConfig('claimMappings', { ...config.claimMappings, email: e.target.value })} placeholder="email" />
                  </div>
                  <div className="space-y-2">
                    <Label>Claim de Nome</Label>
                    <Input value={config.claimMappings.name} onChange={(e) => updateConfig('claimMappings', { ...config.claimMappings, name: e.target.value })} placeholder="name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Claim de Role (opcional)</Label>
                    <Input value={config.claimMappings.role || ''} onChange={(e) => updateConfig('claimMappings', { ...config.claimMappings, role: e.target.value })} placeholder="role" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2"><Settings className="h-4 w-4" />Configurações Adicionais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Domínios Permitidos</Label>
                  <Input value={config.allowedDomains.join(', ')} onChange={(e) => updateConfig('allowedDomains', e.target.value.split(',').map((d) => d.trim()).filter(Boolean))} placeholder="empresa.com, empresa.com.br" />
                  <p className="text-xs text-muted-foreground">Separe múltiplos domínios por vírgula</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Provisionamento Automático</Label>
                    <p className="text-sm text-muted-foreground">Criar usuário automaticamente no primeiro login</p>
                  </div>
                  <Switch checked={config.autoProvision} onCheckedChange={(v) => updateConfig('autoProvision', v)} />
                </div>
                <div className="space-y-2">
                  <Label>Role Padrão</Label>
                  <Select value={config.defaultRole} onValueChange={(v) => updateConfig('defaultRole', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Visualizador</SelectItem>
                      <SelectItem value="recruiter">Recrutador</SelectItem>
                      <SelectItem value="manager">Gestor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {testResult === 'success' && <Badge variant="default" className="gap-1"><CheckCircle2 className="h-3 w-3" />Conexão OK</Badge>}
          {testResult === 'error' && <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" />Falha na conexão</Badge>}
        </div>
        <div className="flex gap-2">
          {onTest && config.enabled && (
            <Button variant="outline" onClick={handleTest} disabled={isTesting}>
              {isTesting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ExternalLink className="h-4 w-4 mr-2" />}
              Testar Conexão
            </Button>
          )}
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Salvar
          </Button>
        </div>
      </div>
    </div>
  );
}
