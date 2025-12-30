import { useState, useCallback, useRef } from "react";
import ReactFlow, { 
  Controls, Background, MiniMap, 
  addEdge, useNodesState, useEdgesState,
  Connection, Edge, Node, ReactFlowProvider
} from "reactflow";
import "reactflow/dist/style.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Save, Play, Undo, Redo } from "lucide-react";
import { nodeTypes } from "./nodes";
import { NodePalette } from "./panels/NodePalette";
import { NodeProperties } from "./panels/NodeProperties";
import type { Workflow, WorkflowNode, WorkflowEdge } from "@/types/workflow";

interface WorkflowEditorProps {
  workflow?: Workflow;
  onSave?: (workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">) => void;
  onTest?: (workflow: Workflow) => void;
}

export function WorkflowEditor({ workflow, onSave, onTest }: WorkflowEditorProps) {
  const { toast } = useToast();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  
  const [name, setName] = useState(workflow?.name || "Novo Workflow");
  const [nodes, setNodes, onNodesChange] = useNodesState(workflow?.nodes || []);
  const [edges, setEdges, onEdgesChange] = useEdgesState(workflow?.edges || []);
  const [selectedNode, setSelectedNode] = useState<WorkflowNode | null>(null);

  const onConnect = useCallback((params: Edge | Connection) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("application/reactflow"));
    
    if (!reactFlowInstance || !reactFlowWrapper.current) return;

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = reactFlowInstance.project({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });

    const newNode: Node = {
      id: `${data.type}-${Date.now()}`,
      type: data.type,
      position,
      data: data.data,
    };

    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance, setNodes]);

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as WorkflowNode);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const updateNode = (updatedNode: WorkflowNode) => {
    setNodes((nds) => nds.map((n) => (n.id === updatedNode.id ? updatedNode : n)));
    setSelectedNode(updatedNode);
  };

  const deleteNode = (nodeId: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
    setSelectedNode(null);
  };

  const handleSave = () => {
    if (!name.trim()) {
      toast({ title: "Nome obrigatório", variant: "destructive" });
      return;
    }
    onSave?.({
      name,
      description: "",
      isActive: false,
      nodes: nodes as WorkflowNode[],
      edges: edges as WorkflowEdge[],
    });
    toast({ title: "Workflow salvo!" });
  };

  return (
    <div className="flex h-[calc(100vh-100px)]">
      {/* Paleta */}
      <NodePalette onDragStart={() => {}} />

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center gap-4 p-4 border-b bg-background">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-xs font-medium"
          />
          <div className="flex-1" />
          <Button variant="outline" size="sm">
            <Undo className="h-4 w-4 mr-1" /> Desfazer
          </Button>
          <Button variant="outline" size="sm">
            <Redo className="h-4 w-4 mr-1" /> Refazer
          </Button>
          <Button variant="outline" size="sm" onClick={() => onTest?.(workflow!)}>
            <Play className="h-4 w-4 mr-1" /> Testar
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" /> Salvar
          </Button>
        </div>

        {/* Canvas */}
        <div ref={reactFlowWrapper} className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <MiniMap />
            <Background gap={12} size={1} />
          </ReactFlow>
        </div>
      </div>

      {/* Propriedades */}
      <NodeProperties
        node={selectedNode}
        onChange={updateNode}
        onDelete={deleteNode}
      />
    </div>
  );
}

export function WorkflowEditorWithProvider(props: WorkflowEditorProps) {
  return (
    <ReactFlowProvider>
      <WorkflowEditor {...props} />
    </ReactFlowProvider>
  );
}
