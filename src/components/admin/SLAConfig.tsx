import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Save, Clock, Bell, Users } from 'lucide-react';

interface SLARule {
  id: string;
  stageName: string;
  maxTime: number;
  timeUnit: 'hours' | 'days';
  warningThreshold: number;
  escalationEnabled: boolean;
  escalationTo?: string;
  notifyOnWarning: boolean;
  notifyOnViolation: boolean;
}

interface SLAConfigProps {
  rules: SLARule[];
  onSave: (rules: SLARule[]) => void;
  stages: string[];
  users: Array<{ id: string; name: string }>;
}

export function SLAConfig({ rules: initialRules, onSave, stages, users }: SLAConfigProps) {
  const [rules, setRules] = useState<SLARule[]>(initialRules);

  const addRule = () => {
    const newRule: SLARule = {
      id: `rule-${Date.now()}`,
      stageName: stages[0] || '',
      maxTime: 24,
      timeUnit: 'hours',
      warningThreshold: 80,
      escalationEnabled: false,
      notifyOnWarning: true,
      notifyOnViolation: true,
    };
    setRules([...rules, newRule]);
  };

  const updateRule = (id: string, updates: Partial<SLARule>) => {
    setRules(rules.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const removeRule = (id: string) => {
    setRules(rules.filter(r => r.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Configuração de SLAs
          </h3>
          <p className="text-sm text-muted-foreground">Defina tempos máximos para cada etapa do processo</p>
        </div>
        <Button onClick={addRule}><Plus className="h-4 w-4 mr-2" />Adicionar Regra</Button>
      </div>

      {rules.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-muted-foreground">
            Nenhuma regra de SLA configurada. Clique em "Adicionar Regra" para começar.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Regra: {rule.stageName || 'Nova Regra'}</CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => removeRule(rule.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Etapa</Label>
                    <Select value={rule.stageName} onValueChange={(v) => updateRule(rule.id, { stageName: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {stages.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tempo Máximo</Label>
                    <div className="flex gap-2">
                      <Input type="number" min={1} value={rule.maxTime} onChange={(e) => updateRule(rule.id, { maxTime: parseInt(e.target.value) || 1 })} className="w-20" />
                      <Select value={rule.timeUnit} onValueChange={(v: 'hours' | 'days') => updateRule(rule.id, { timeUnit: v })}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hours">Horas</SelectItem>
                          <SelectItem value="days">Dias</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Alerta em (%)</Label>
                    <Input type="number" min={50} max={99} value={rule.warningThreshold} onChange={(e) => updateRule(rule.id, { warningThreshold: parseInt(e.target.value) || 80 })} />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Notificar em alerta</span>
                    </div>
                    <Switch checked={rule.notifyOnWarning} onCheckedChange={(v) => updateRule(rule.id, { notifyOnWarning: v })} />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-red-500" />
                      <span className="text-sm">Notificar em violação</span>
                    </div>
                    <Switch checked={rule.notifyOnViolation} onCheckedChange={(v) => updateRule(rule.id, { notifyOnViolation: v })} />
                  </div>
                </div>

                <div className="p-3 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Escalação</span>
                    </div>
                    <Switch checked={rule.escalationEnabled} onCheckedChange={(v) => updateRule(rule.id, { escalationEnabled: v })} />
                  </div>
                  {rule.escalationEnabled && (
                    <div className="space-y-2">
                      <Label className="text-xs">Escalar para</Label>
                      <Select value={rule.escalationTo || ''} onValueChange={(v) => updateRule(rule.id, { escalationTo: v })}>
                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                        <SelectContent>
                          {users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button className="w-full" onClick={() => onSave(rules)}>
        <Save className="h-4 w-4 mr-2" />
        Salvar Configurações de SLA
      </Button>
    </div>
  );
}
