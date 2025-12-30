import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Database, Trash2, Shield, Save, AlertTriangle, Loader2 } from 'lucide-react';

type PeriodUnit = 'days' | 'months' | 'years';

export interface RetentionPolicy {
  dataType: string;
  description: string;
  retentionPeriod: number;
  periodUnit: PeriodUnit;
  autoDelete: boolean;
  anonymize: boolean;
  legalBasis: string;
}

interface DataRetentionSettingsProps {
  policies: RetentionPolicy[];
  onSave: (policies: RetentionPolicy[]) => Promise<void> | void;
  isLoading?: boolean;
}

const defaultPolicies: RetentionPolicy[] = [
  { dataType: 'candidatos_ativos', description: 'Candidatos em processos ativos', retentionPeriod: 0, periodUnit: 'years', autoDelete: false, anonymize: false, legalBasis: 'Execução de contrato' },
  { dataType: 'candidatos_inativos', description: 'Candidatos sem atividade', retentionPeriod: 2, periodUnit: 'years', autoDelete: false, anonymize: true, legalBasis: 'Interesse legítimo' },
  { dataType: 'curriculos', description: 'Currículos e documentos', retentionPeriod: 5, periodUnit: 'years', autoDelete: true, anonymize: false, legalBasis: 'Consentimento' },
  { dataType: 'comunicacoes', description: 'Histórico de e-mails e mensagens', retentionPeriod: 3, periodUnit: 'years', autoDelete: true, anonymize: false, legalBasis: 'Interesse legítimo' },
  { dataType: 'avaliacoes', description: 'Avaliações e feedbacks', retentionPeriod: 5, periodUnit: 'years', autoDelete: false, anonymize: true, legalBasis: 'Interesse legítimo' },
  { dataType: 'logs_acesso', description: 'Logs de acesso e auditoria', retentionPeriod: 1, periodUnit: 'years', autoDelete: true, anonymize: false, legalBasis: 'Obrigação legal' },
];

const PERIOD_LABELS: Record<PeriodUnit, string> = {
  days: 'dia(s)',
  months: 'mês(es)',
  years: 'ano(s)',
};

export function DataRetentionSettings({ 
  policies: initialPolicies, 
  onSave, 
  isLoading = false 
}: DataRetentionSettingsProps) {
  const [policies, setPolicies] = useState<RetentionPolicy[]>(
    initialPolicies.length > 0 ? initialPolicies : defaultPolicies
  );
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const updatePolicy = useCallback((index: number, updates: Partial<RetentionPolicy>) => {
    setPolicies(prev => prev.map((p, i) => i === index ? { ...p, ...updates } : p));
    setHasChanges(true);
  }, []);

  const handleRetentionPeriodChange = useCallback((index: number, value: string) => {
    const numValue = parseInt(value, 10);
    const safeValue = isNaN(numValue) || numValue < 0 ? 0 : numValue;
    updatePolicy(index, { retentionPeriod: safeValue });
  }, [updatePolicy]);

  const handlePeriodUnitChange = useCallback((index: number, value: string) => {
    if (value === 'days' || value === 'months' || value === 'years') {
      updatePolicy(index, { periodUnit: value });
    }
  }, [updatePolicy]);

  const handleAutoDeleteChange = useCallback((index: number, value: boolean) => {
    updatePolicy(index, { autoDelete: value });
  }, [updatePolicy]);

  const handleAnonymizeChange = useCallback((index: number, value: boolean) => {
    updatePolicy(index, { anonymize: value });
  }, [updatePolicy]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      await onSave(policies);
      setHasChanges(false);
    } catch (error) {
      console.error('[DataRetentionSettings] Save error:', error);
    } finally {
      setIsSaving(false);
    }
  }, [onSave, policies]);

  const getRetentionLabel = useCallback((policy: RetentionPolicy): string => {
    if (policy.retentionPeriod === 0) return 'Indeterminado';
    return `${policy.retentionPeriod} ${PERIOD_LABELS[policy.periodUnit]}`;
  }, []);

  const policiesWithWarnings = useMemo(() => {
    return policies.filter(p => p.autoDelete && p.retentionPeriod > 0);
  }, [policies]);

  return (
    <div className="space-y-6" role="region" aria-label="Configurações de retenção de dados">
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" aria-hidden="true" />
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

      <div className="space-y-4" role="list" aria-label="Lista de políticas de retenção">
        {policies.map((policy, index) => (
          <Card key={policy.dataType} role="listitem">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Database className="h-4 w-4" aria-hidden="true" />
                    {policy.description}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    Base legal: {policy.legalBasis}
                  </CardDescription>
                </div>
                <Badge variant="outline" aria-label={`Período de retenção: ${getRetentionLabel(policy)}`}>
                  {getRetentionLabel(policy)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor={`retention-${policy.dataType}`}>
                    Período de Retenção
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={`retention-${policy.dataType}`}
                      type="number"
                      min={0}
                      max={999}
                      value={policy.retentionPeriod}
                      onChange={(e) => handleRetentionPeriodChange(index, e.target.value)}
                      className="w-20"
                      aria-describedby={`retention-help-${policy.dataType}`}
                    />
                    <Select
                      value={policy.periodUnit}
                      onValueChange={(v) => handlePeriodUnitChange(index, v)}
                    >
                      <SelectTrigger 
                        className="w-28"
                        aria-label={`Unidade de tempo para ${policy.description}`}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="days">Dias</SelectItem>
                        <SelectItem value="months">Meses</SelectItem>
                        <SelectItem value="years">Anos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {policy.retentionPeriod === 0 && (
                    <p 
                      id={`retention-help-${policy.dataType}`} 
                      className="text-xs text-muted-foreground"
                    >
                      0 = Manter indefinidamente
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4 text-red-500" aria-hidden="true" />
                    <div>
                      <Label 
                        htmlFor={`autodelete-${policy.dataType}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        Exclusão Automática
                      </Label>
                      <p className="text-xs text-muted-foreground">Deletar após período</p>
                    </div>
                  </div>
                  <Switch
                    id={`autodelete-${policy.dataType}`}
                    checked={policy.autoDelete}
                    onCheckedChange={(v) => handleAutoDeleteChange(index, v)}
                    disabled={policy.retentionPeriod === 0}
                    aria-describedby={policy.retentionPeriod === 0 ? `autodelete-disabled-${policy.dataType}` : undefined}
                  />
                  {policy.retentionPeriod === 0 && (
                    <span id={`autodelete-disabled-${policy.dataType}`} className="sr-only">
                      Desabilitado porque período de retenção é indefinido
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-blue-500" aria-hidden="true" />
                    <div>
                      <Label 
                        htmlFor={`anonymize-${policy.dataType}`}
                        className="text-sm font-medium cursor-pointer"
                      >
                        Anonimização
                      </Label>
                      <p className="text-xs text-muted-foreground">Remover dados pessoais</p>
                    </div>
                  </div>
                  <Switch
                    id={`anonymize-${policy.dataType}`}
                    checked={policy.anonymize}
                    onCheckedChange={(v) => handleAnonymizeChange(index, v)}
                  />
                </div>
              </div>

              {policy.autoDelete && policy.retentionPeriod > 0 && (
                <div 
                  className="flex items-center gap-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-sm text-yellow-800 dark:text-yellow-200"
                  role="alert"
                >
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <span>Dados serão permanentemente excluídos após {getRetentionLabel(policy)}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {policiesWithWarnings.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" aria-hidden="true" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800 dark:text-yellow-200">
                  Atenção: {policiesWithWarnings.length} política(s) com exclusão automática
                </p>
                <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                  Certifique-se de que os períodos de retenção estão de acordo com as obrigações legais da sua empresa.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button 
        className="w-full" 
        onClick={handleSave}
        disabled={isSaving || isLoading || !hasChanges}
        aria-busy={isSaving}
      >
        {isSaving ? (
          <Loader2 className="h-4 w-4 mr-2 animate-spin" aria-hidden="true" />
        ) : (
          <Save className="h-4 w-4 mr-2" aria-hidden="true" />
        )}
        {isSaving ? 'Salvando...' : hasChanges ? 'Salvar Políticas de Retenção' : 'Sem alterações'}
      </Button>
    </div>
  );
}
