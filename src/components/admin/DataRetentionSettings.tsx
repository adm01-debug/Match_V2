import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Database, Trash2, Shield, Clock, AlertTriangle, Save } from 'lucide-react';

interface RetentionPolicy {
  dataType: string;
  description: string;
  retentionPeriod: number;
  periodUnit: 'days' | 'months' | 'years';
  autoDelete: boolean;
  anonymize: boolean;
  legalBasis: string;
}

interface DataRetentionSettingsProps {
  policies: RetentionPolicy[];
  onSave: (policies: RetentionPolicy[]) => void;
}

const defaultPolicies: RetentionPolicy[] = [
  { dataType: 'candidatos_ativos', description: 'Candidatos em processos ativos', retentionPeriod: 0, periodUnit: 'years', autoDelete: false, anonymize: false, legalBasis: 'Execução de contrato' },
  { dataType: 'candidatos_inativos', description: 'Candidatos sem atividade', retentionPeriod: 2, periodUnit: 'years', autoDelete: false, anonymize: true, legalBasis: 'Interesse legítimo' },
  { dataType: 'curriculos', description: 'Currículos e documentos', retentionPeriod: 5, periodUnit: 'years', autoDelete: true, anonymize: false, legalBasis: 'Consentimento' },
  { dataType: 'comunicacoes', description: 'Histórico de e-mails e mensagens', retentionPeriod: 3, periodUnit: 'years', autoDelete: true, anonymize: false, legalBasis: 'Interesse legítimo' },
  { dataType: 'avaliacoes', description: 'Avaliações e feedbacks', retentionPeriod: 5, periodUnit: 'years', autoDelete: false, anonymize: true, legalBasis: 'Interesse legítimo' },
  { dataType: 'logs_acesso', description: 'Logs de acesso e auditoria', retentionPeriod: 1, periodUnit: 'years', autoDelete: true, anonymize: false, legalBasis: 'Obrigação legal' },
];

export function DataRetentionSettings({ policies: initialPolicies, onSave }: DataRetentionSettingsProps) {
  const [policies, setPolicies] = useState<RetentionPolicy[]>(initialPolicies.length > 0 ? initialPolicies : defaultPolicies);

  const updatePolicy = (index: number, updates: Partial<RetentionPolicy>) => {
    setPolicies(policies.map((p, i) => i === index ? { ...p, ...updates } : p));
  };

  const getRetentionLabel = (policy: RetentionPolicy) => {
    if (policy.retentionPeriod === 0) return 'Indeterminado';
    const unit = policy.periodUnit === 'days' ? 'dia(s)' : policy.periodUnit === 'months' ? 'mês(es)' : 'ano(s)';
    return `${policy.retentionPeriod} ${unit}`;
  };

  return (
    <div className="space-y-6">
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-200">Conformidade LGPD</p>
              <p className="text-blue-700 dark:text-blue-300 mt-1">
                Configure políticas de retenção de dados pessoais em conformidade com a Lei Geral de Proteção de Dados.
                Os dados serão automaticamente anonimizados ou excluídos após o período definido.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {policies.map((policy, index) => (
          <Card key={policy.dataType}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    {policy.description}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Base legal: {policy.legalBasis}
                  </CardDescription>
                </div>
                <Badge variant="outline">{getRetentionLabel(policy)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Período de Retenção</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min={0}
                      value={policy.retentionPeriod}
                      onChange={(e) => updatePolicy(index, { retentionPeriod: parseInt(e.target.value) || 0 })}
                      className="w-20"
                    />
                    <Select
                      value={policy.periodUnit}
                      onValueChange={(v: 'days' | 'months' | 'years') => updatePolicy(index, { periodUnit: v })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Dias</SelectItem>
                        <SelectItem value="months">Meses</SelectItem>
                        <SelectItem value="years">Anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {policy.retentionPeriod === 0 && (
                    <p className="text-xs text-muted-foreground">0 = Manter indefinidamente</p>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <div>
                      <span className="text-sm font-medium">Exclusão Automática</span>
                      <p className="text-xs text-muted-foreground">Deletar após período</p>
                    </div>
                  </div>
                  <Switch
                    checked={policy.autoDelete}
                    onCheckedChange={(v) => updatePolicy(index, { autoDelete: v })}
                    disabled={policy.retentionPeriod === 0}
                  />
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <div>
                      <span className="text-sm font-medium">Anonimização</span>
                      <p className="text-xs text-muted-foreground">Remover dados pessoais</p>
                    </div>
                  </div>
                  <Switch
                    checked={policy.anonymize}
                    onCheckedChange={(v) => updatePolicy(index, { anonymize: v })}
                  />
                </div>
              </div>

              {policy.autoDelete && policy.retentionPeriod > 0 && (
                <div className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm text-yellow-800 dark:text-yellow-200">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Dados serão permanentemente excluídos após {getRetentionLabel(policy)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Button className="w-full" onClick={() => onSave(policies)}>
        <Save className="h-4 w-4 mr-2" />
        Salvar Políticas de Retenção
      </Button>
    </div>
  );
}
