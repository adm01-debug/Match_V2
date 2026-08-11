import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Save } from 'lucide-react';
import type { ReportConfig, ReportType, ChartType } from '@/services/reportingService';

interface ReportBuilderProps {
  onBuild: (config: ReportConfig) => void;
  initialConfig?: ReportConfig;
}

export function ReportBuilder({ onBuild, initialConfig }: ReportBuilderProps) {
  const [config, setConfig] = useState<ReportConfig>(
    initialConfig || {
      name: '',
      type: 'vagas',
      description: '',
      filters: [],
      metrics: [],
      chartType: 'bar',
      dateRange: { start: '', end: '' },
    }
  );

  const reportTypes: { value: ReportType; label: string }[] = [
    { value: 'vagas', label: 'Vagas' },
    { value: 'candidatos', label: 'Candidatos' },
    { value: 'funil', label: 'Funil de Conversão' },
    { value: 'entrevistas', label: 'Entrevistas' },
    { value: 'sla', label: 'SLA' },
    { value: 'diversidade', label: 'Diversidade' },
  ];

  const chartTypes: { value: ChartType; label: string }[] = [
    { value: 'bar', label: 'Barras' },
    { value: 'line', label: 'Linhas' },
    { value: 'area', label: 'Área' },
    { value: 'pie', label: 'Pizza' },
    { value: 'radar', label: 'Radar' },
    { value: 'table', label: 'Tabela' },
  ];

  const handleBuild = () => {
    if (!config.name) return;
    onBuild(config);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          Criar Relatório
        </CardTitle>
        <CardDescription>Configure um relatório personalizado</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome do Relatório</Label>
            <Input
              placeholder="Ex: Relatório Mensal de Vagas"
              value={config.name}
              onChange={e => setConfig({ ...config, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={config.type} onValueChange={v => setConfig({ ...config, type: v as ReportType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {reportTypes.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Descrição</Label>
          <Textarea
            placeholder="Descreva o objetivo deste relatório..."
            value={config.description || ''}
            onChange={e => setConfig({ ...config, description: e.target.value })}
            rows={2}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Visualização</Label>
            <Select value={config.chartType} onValueChange={v => setConfig({ ...config, chartType: v as ChartType })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {chartTypes.map(t => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Data Início</Label>
            <Input
              type="date"
              value={config.dateRange.start}
              onChange={e => setConfig({ ...config, dateRange: { ...config.dateRange, start: e.target.value } })}
            />
          </div>
          <div className="space-y-2">
            <Label>Data Fim</Label>
            <Input
              type="date"
              value={config.dateRange.end}
              onChange={e => setConfig({ ...config, dateRange: { ...config.dateRange, end: e.target.value } })}
            />
          </div>
        </div>

        <Button onClick={handleBuild} disabled={!config.name} className="w-full gap-2">
          <Save className="h-4 w-4" />
          Gerar Relatório
        </Button>
      </CardContent>
    </Card>
  );
}

export default ReportBuilder;
