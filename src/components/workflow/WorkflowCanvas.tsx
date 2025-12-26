import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ArrowRight, Settings } from 'lucide-react';

interface WorkflowNode {
  id: string;
  type: 'stage' | 'action' | 'condition';
  title: string;
  config?: Record<string, any>;
}

interface WorkflowCanvasProps {
  initialNodes?: WorkflowNode[];
  onChange?: (nodes: WorkflowNode[]) => void;
}

const NODE_TYPES = {
  stage: { label: 'Etapa', color: 'bg-blue-500' },
  action: { label: 'Ação', color: 'bg-green-500' },
  condition: { label: 'Condição', color: 'bg-yellow-500' },
};

export function WorkflowCanvas({ initialNodes = [], onChange }: WorkflowCanvasProps) {
  const [nodes, setNodes] = useState<WorkflowNode[]>(initialNodes.length ? initialNodes : [
    { id: '1', type: 'stage', title: 'Triagem' },
    { id: '2', type: 'stage', title: 'Entrevista RH' },
    { id: '3', type: 'condition', title: 'Aprovado?' },
    { id: '4', type: 'stage', title: 'Entrevista Técnica' },
    { id: '5', type: 'action', title: 'Enviar Proposta' },
  ]);

  const addNode = useCallback((type: WorkflowNode['type']) => {
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type,
      title: `Nova ${NODE_TYPES[type].label}`,
    };
    const updated = [...nodes, newNode];
    setNodes(updated);
    onChange?.(updated);
  }, [nodes, onChange]);

  const removeNode = useCallback((id: string) => {
    const updated = nodes.filter(n => n.id !== id);
    setNodes(updated);
    onChange?.(updated);
  }, [nodes, onChange]);

  const updateNode = useCallback((id: string, title: string) => {
    const updated = nodes.map(n => n.id === id ? { ...n, title } : n);
    setNodes(updated);
    onChange?.(updated);
  }, [nodes, onChange]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Editor de Workflow</CardTitle>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => addNode('stage')}><Plus className="h-4 w-4 mr-1" />Etapa</Button>
          <Button size="sm" variant="outline" onClick={() => addNode('action')}><Plus className="h-4 w-4 mr-1" />Ação</Button>
          <Button size="sm" variant="outline" onClick={() => addNode('condition')}><Plus className="h-4 w-4 mr-1" />Condição</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-4 items-center">
          {nodes.map((node, index) => (
            <div key={node.id} className="flex items-center gap-2">
              <div className="relative group">
                <div className={`p-4 rounded-lg border-2 min-w-[150px] ${node.type === 'condition' ? 'rotate-45 w-24 h-24 flex items-center justify-center' : ''}`}>
                  <div className={node.type === 'condition' ? '-rotate-45' : ''}>
                    <Badge className={`${NODE_TYPES[node.type].color} mb-2`}>{NODE_TYPES[node.type].label}</Badge>
                    <input
                      type="text"
                      value={node.title}
                      onChange={(e) => updateNode(node.id, e.target.value)}
                      className="w-full bg-transparent border-none text-sm font-medium focus:outline-none"
                    />
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <Button size="icon" variant="ghost" className="h-6 w-6"><Settings className="h-3 w-3" /></Button>
                  <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => removeNode(node.id)}><Trash2 className="h-3 w-3" /></Button>
                </div>
              </div>
              {index < nodes.length - 1 && <ArrowRight className="h-5 w-5 text-muted-foreground" />}
            </div>
          ))}
        </div>
        {nodes.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>Nenhuma etapa definida. Adicione etapas ao workflow.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default WorkflowCanvas;
