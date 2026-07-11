import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Edge,
  type Node as FlowNode,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';
import DelayNode from './nodes/DelayNode';
import { WebhookNode } from './nodes/WebhookNode';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlusCircle, Zap, Play, GitBranch, Clock, Globe } from 'lucide-react';
// Workflow type imports available in types/workflow.ts

interface WorkflowCanvasProps {
  initialNodes?: unknown[];
  initialEdges?: unknown[];
  onSave?: (nodes: unknown[], edges: unknown[]) => void;
}

export function WorkflowCanvas({ initialNodes = [], initialEdges = [], onSave }: WorkflowCanvasProps) {
  const nodeTypes = useMemo(() => ({
    trigger: TriggerNode,
    action: ActionNode,
    condition: ConditionNode,
    delay: DelayNode,
    webhook: WebhookNode,
  }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(initialNodes as FlowNode[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(initialEdges as Edge[]);
  const [nodeCount, setNodeCount] = useState(initialNodes.length);

  const onConnect = useCallback((params: Connection) => {
    setEdges((eds: Edge[]) => addEdge({ ...params, animated: true, style: { stroke: 'hsl(var(--primary))' } }, eds));
  }, [setEdges]);

  const addNode = useCallback((type: string, label: string, description: string) => {
    const id = `${type}_${nodeCount + 1}`;
    const newNode: FlowNode = {
      id,
      type,
      position: { x: 250 + Math.random() * 100, y: 100 + nodeCount * 150 },
      data: { label, description },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeCount(c => c + 1);
  }, [nodeCount, setNodes]);

  const handleSave = () => {
    onSave?.(nodes, edges);
  };

  return (
    <div className="h-[600px] w-full rounded-lg border bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-background"
      >
        <Controls className="!bg-card !border-border !shadow-lg" />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} className="!bg-background" />
        
        <Panel position="top-left" className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="gap-1">
                <PlusCircle className="h-4 w-4" /> Adicionar Nó
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuItem onClick={() => addNode('trigger', 'Novo Gatilho', 'Configure o gatilho')}>
                <Zap className="h-4 w-4 mr-2 text-green-500" /> Gatilho (Trigger)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addNode('action', 'Nova Ação', 'Configure a ação')}>
                <Play className="h-4 w-4 mr-2 text-blue-500" /> Ação (Action)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addNode('condition', 'Nova Condição', 'Configure a condição')}>
                <GitBranch className="h-4 w-4 mr-2 text-amber-500" /> Condição (If/Else)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addNode('delay', 'Aguardar', 'Configure o atraso')}>
                <Clock className="h-4 w-4 mr-2 text-purple-500" /> Atraso (Delay)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => addNode('webhook', 'Webhook', 'Configure o webhook')}>
                <Globe className="h-4 w-4 mr-2 text-cyan-500" /> Webhook
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {onSave && (
            <Button size="sm" onClick={handleSave}>Salvar</Button>
          )}
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default WorkflowCanvas;
