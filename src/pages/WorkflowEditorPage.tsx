import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';
import { Save, Play, Copy, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WORKFLOW_TEMPLATES = [
  { id: 'standard', name: 'Processo Padrão', stages: ['Triagem', 'Entrevista RH', 'Entrevista Técnica', 'Proposta'] },
  { id: 'tech', name: 'Vaga Técnica', stages: ['Triagem', 'Teste Técnico', 'Entrevista Técnica', 'Code Review', 'Proposta'] },
  { id: 'executive', name: 'Executivo', stages: ['Headhunting', 'Entrevista Inicial', 'Assessment', 'Entrevista Final', 'Proposta'] },
];

export default function WorkflowEditorPage() {
  const [workflowName, setWorkflowName] = useState('Novo Workflow');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [nodes, setNodes] = useState<any[]>([]);
  const { toast } = useToast();

  const handleTemplateSelect = (templateId: string) => {
    const template = WORKFLOW_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setNodes(template.stages.map((stage, i) => ({ id: String(i + 1), type: 'stage', title: stage })));
      setSelectedTemplate(templateId);
    }
  };

  const handleSave = () => {
    toast({ title: 'Workflow salvo', description: `"${workflowName}" foi salvo com sucesso.` });
  };

  const handleTest = () => {
    toast({ title: 'Testando workflow', description: 'Simulação iniciada...' });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Editor de Workflows</h1>
            <p className="text-muted-foreground">Crie e personalize fluxos de recrutamento</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleTest}><Play className="h-4 w-4 mr-2" />Testar</Button>
            <Button onClick={handleSave}><Save className="h-4 w-4 mr-2" />Salvar</Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <Card className="lg:col-span-1">
            <CardHeader><CardTitle className="text-base">Configurações</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome do Workflow</label>
                <Input value={workflowName} onChange={(e) => setWorkflowName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Template</label>
                <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
                  <SelectTrigger><SelectValue placeholder="Selecione um template" /></SelectTrigger>
                  <SelectContent>
                    {WORKFLOW_TEMPLATES.map(t => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4 border-t space-y-2">
                <Button variant="outline" size="sm" className="w-full"><Copy className="h-4 w-4 mr-2" />Duplicar</Button>
                <Button variant="outline" size="sm" className="w-full text-destructive"><Trash2 className="h-4 w-4 mr-2" />Excluir</Button>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            <WorkflowCanvas initialNodes={nodes} onChange={setNodes} />
          </div>
        </div>
      </div>
    </Layout>
  );
}
