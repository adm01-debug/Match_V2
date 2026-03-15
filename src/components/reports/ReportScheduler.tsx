import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Clock, Mail, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { ReportScheduleConfig } from '@/services/reportingService';

interface ReportSchedulerProps {
  schedule?: ReportScheduleConfig;
  onScheduleChange: (schedule: ReportScheduleConfig) => void;
}

export function ReportScheduler({ schedule, onScheduleChange }: ReportSchedulerProps) {
  const { toast } = useToast();
  const [newEmail, setNewEmail] = useState('');
  const [config, setConfig] = useState<ReportScheduleConfig>(
    schedule || { enabled: false, frequency: 'weekly', recipients: [] }
  );

  const updateConfig = (updates: Partial<ReportScheduleConfig>) => {
    const updated = { ...config, ...updates };
    setConfig(updated);
    onScheduleChange(updated);
  };

  const addRecipient = () => {
    if (!newEmail || !newEmail.includes('@')) return;
    if (config.recipients.includes(newEmail)) return;
    updateConfig({ recipients: [...config.recipients, newEmail] });
    setNewEmail('');
    toast({ title: 'Destinatário adicionado' });
  };

  const removeRecipient = (email: string) => {
    updateConfig({ recipients: config.recipients.filter(r => r !== email) });
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Clock className="h-4 w-4" /> Agendamento de Relatório
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="schedule-enabled">Envio automático</Label>
          <Switch
            id="schedule-enabled"
            checked={config.enabled}
            onCheckedChange={enabled => updateConfig({ enabled })}
          />
        </div>

        {config.enabled && (
          <>
            <div className="space-y-2">
              <Label>Frequência</Label>
              <Select value={config.frequency} onValueChange={(v) => updateConfig({ frequency: v as ReportScheduleConfig['frequency'] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Diário</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Destinatários</Label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="email@empresa.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addRecipient()}
                />
                <Button size="sm" onClick={addRecipient}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {config.recipients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {config.recipients.map(email => (
                    <Badge key={email} variant="secondary" className="gap-1">
                      <Mail className="h-3 w-3" />
                      {email}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeRecipient(email)} />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default ReportScheduler;
