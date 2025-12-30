import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Settings, Clock, AlertTriangle, Bell, Save } from 'lucide-react';

export interface WorkflowSettingsData {
  name: string;
  description: string;
  isActive: boolean;
  timezone: string;
  retryPolicy: {
    maxRetries: number;
    retryDelay: number;
    backoffMultiplier: number;
  };
  errorHandling: 'stop' | 'continue' | 'rollback';
  notifications: {
    onSuccess: boolean;
    onFailure: boolean;
    recipients: string[];
  };
}

interface WorkflowSettingsProps {
  settings: WorkflowSettingsData;
  onSave: (settings: WorkflowSettingsData) => void;
}

const timezones = [
  { value: 'America/Sao_Paulo', label: 'São Paulo (BRT)' },
  { value: 'America/New_York', label: 'New York (EST)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'UTC', label: 'UTC' },
];

export function WorkflowSettings({ settings: initialSettings, onSave }: WorkflowSettingsProps) {
  const [settings, setSettings] = useState<WorkflowSettingsData>(initialSettings);

  const updateSettings = <K extends keyof WorkflowSettingsData>(
    key: K,
    value: WorkflowSettingsData[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4 p-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle className="text-lg">Configurações Gerais</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Workflow</Label>
            <Input
              id="name"
              value={settings.name}
              onChange={(e) => updateSettings('name', e.target.value)}
              placeholder="Ex: Onboarding de Candidatos"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={settings.description}
              onChange={(e) => updateSettings('description', e.target.value)}
              placeholder="Descreva o objetivo deste workflow..."
              rows={3}
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Status</Label>
              <p className="text-sm text-muted-foreground">Ativar ou desativar o workflow</p>
            </div>
            <Switch
              checked={settings.isActive}
              onCheckedChange={(checked) => updateSettings('isActive', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            <CardTitle className="text-lg">Agendamento</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Fuso Horário</Label>
            <Select value={settings.timezone} onValueChange={(v) => updateSettings('timezone', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {timezones.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value}>{tz.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            <CardTitle className="text-lg">Tratamento de Erros</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Max Tentativas</Label>
              <Input
                type="number"
                min={0}
                max={10}
                value={settings.retryPolicy.maxRetries}
                onChange={(e) => updateSettings('retryPolicy', { ...settings.retryPolicy, maxRetries: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Delay (segundos)</Label>
              <Input
                type="number"
                min={1}
                value={settings.retryPolicy.retryDelay}
                onChange={(e) => updateSettings('retryPolicy', { ...settings.retryPolicy, retryDelay: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="space-y-2">
              <Label>Multiplicador</Label>
              <Input
                type="number"
                min={1}
                step={0.5}
                value={settings.retryPolicy.backoffMultiplier}
                onChange={(e) => updateSettings('retryPolicy', { ...settings.retryPolicy, backoffMultiplier: parseFloat(e.target.value) || 1 })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Comportamento em Falha</Label>
            <Select value={settings.errorHandling} onValueChange={(v: 'stop' | 'continue' | 'rollback') => updateSettings('errorHandling', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="stop">Parar execução</SelectItem>
                <SelectItem value="continue">Continuar mesmo com erro</SelectItem>
                <SelectItem value="rollback">Reverter alterações</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle className="text-lg">Notificações</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Notificar em Sucesso</Label>
            <Switch
              checked={settings.notifications.onSuccess}
              onCheckedChange={(checked) => updateSettings('notifications', { ...settings.notifications, onSuccess: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>Notificar em Falha</Label>
            <Switch
              checked={settings.notifications.onFailure}
              onCheckedChange={(checked) => updateSettings('notifications', { ...settings.notifications, onFailure: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Button className="w-full" onClick={() => onSave(settings)}>
        <Save className="h-4 w-4 mr-2" />
        Salvar Configurações
      </Button>
    </div>
  );
}
