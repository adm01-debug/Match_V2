import { useState } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Settings, Trash2, GitBranch, Sparkles } from 'lucide-react';
import { useWorkflow } from '@/hooks/useWorkflow';
import { useRegrasAutomacao } from '@/hooks/useRegrasAutomacao';
import { WorkflowCanvas } from '@/components/workflow/WorkflowCanvas';
import { useToast } from '@/hooks/use-toast';

export default function WorkflowEditorPage() {
  usePageTitle('Workflows');
  const { toast } = useToast();
  const { workflows: localWorkflows, createWorkflow, updateWorkflow, deleteWorkflow, toggleActive } = useWorkflow();
  const { workflows: dbWorkflows } = useRegrasAutomacao();

  const workflows = [...dbWorkflows, ...localWorkflows];
  const isFromDb = (id: string) => dbWorkflows.some(w => w.id === id);
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [showCreate, setShowCreate] = useState(false);

  const editingWorkflow = editingId ? workflows.find(w => w.id === editingId) : undefined;

  const handleCreate = () => {
    if (!newName.trim()) return;
    const wf = createWorkflow(newName, newDescription);
    setEditingId(wf.id);
    setNewName('');
    setNewDescription('');
    setShowCreate(false);
  };

  const handleSaveCanvas = (nodes: unknown[], edges: unknown[]) => {
    if (!editingId) return;
    updateWorkflow(editingId, { nodes, edges });
    toast({ title: 'Workflow salvo!', description: 'Nós e conexões atualizados' });
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <GitBranch className="h-8 w-8 text-primary" />
              Workflows & Automações
            </h1>
            <p className="text-muted-foreground mt-1">
              Crie fluxos automatizados para o processo de recrutamento
            </p>
          </div>
          <Dialog open={showCreate} onOpenChange={setShowCreate}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" /> Novo Workflow
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Criar Novo Workflow</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input
                    placeholder="Ex: Onboarding de Candidato"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea
                    placeholder="Descreva o objetivo deste workflow..."
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <Button onClick={handleCreate} disabled={!newName.trim()} className="w-full">
                  Criar Workflow
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {editingWorkflow ? (
          /* Canvas Editor */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{editingWorkflow.name}</h2>
                <p className="text-sm text-muted-foreground">{editingWorkflow.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={editingWorkflow.active ? 'default' : 'secondary'}>
                  {editingWorkflow.active ? 'Ativo' : 'Inativo'}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => setEditingId(null)}>
                  ← Voltar
                </Button>
              </div>
            </div>
            <WorkflowCanvas
              initialNodes={editingWorkflow.nodes}
              initialEdges={editingWorkflow.edges}
              onSave={handleSaveCanvas}
            />
          </div>
        ) : (
          /* Workflow List */
          <div className="space-y-4">
            {workflows.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <GitBranch className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum workflow criado</h3>
                  <p className="text-muted-foreground mb-4">
                    Crie automações para otimizar seu processo de recrutamento
                  </p>
                  <Button onClick={() => setShowCreate(true)} className="gap-2">
                    <PlusCircle className="h-4 w-4" /> Criar Primeiro Workflow
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workflows.map(workflow => {
                  const fromDb = isFromDb(workflow.id);
                  return (
                    <Card key={workflow.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <CardTitle className="text-base flex items-center gap-2">
                            {workflow.name}
                            {fromDb && (
                              <Badge variant="outline" className="text-xs">
                                <Sparkles className="h-3 w-3 mr-1" /> Sistema
                              </Badge>
                            )}
                          </CardTitle>
                          <Switch
                            checked={workflow.active}
                            disabled={fromDb}
                            onCheckedChange={() => toggleActive(workflow.id)}
                          />
                        </div>
                        {workflow.description && (
                          <CardDescription>{workflow.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{(workflow.nodes as unknown[]).length} nós</Badge>
                            <Badge variant={workflow.active ? 'default' : 'secondary'}>
                              {workflow.active ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={fromDb}
                              onClick={() => setEditingId(workflow.id)}
                              title={fromDb ? 'Workflows do sistema são somente leitura' : 'Editar'}
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={fromDb}
                              onClick={() => deleteWorkflow(workflow.id)}
                              title={fromDb ? 'Workflows do sistema são somente leitura' : 'Excluir'}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
