import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Zap, Play, GitBranch, Clock, Mail, MessageSquare, Bell, Tag, UserPlus, Calendar } from "lucide-react";
import { TRIGGER_LABELS, WorkflowTrigger } from "@/types/workflow";

interface NodePaletteProps {
  onDragStart: (nodeType: string, data: Record<string, unknown>) => void;
}

interface NodeItem {
  type: string;
  label: string;
  icon: typeof Zap;
  trigger?: WorkflowTrigger;
  action?: string;
}

const NODE_CATEGORIES: Array<{
  title: string;
  icon: typeof Zap;
  color: string;
  nodes: NodeItem[];
}> = [
  {
    title: "Gatilhos",
    icon: Zap,
    color: "bg-green-100 text-green-600",
    nodes: Object.entries(TRIGGER_LABELS).map(([key, label]) => ({
      type: "trigger",
      trigger: key as WorkflowTrigger,
      label,
      icon: Zap,
    })),
  },
  {
    title: "Ações",
    icon: Play,
    color: "bg-blue-100 text-blue-600",
    nodes: [
      { type: "action", action: "send_email", label: "Enviar Email", icon: Mail },
      { type: "action", action: "send_whatsapp", label: "Enviar WhatsApp", icon: MessageSquare },
      { type: "action", action: "notify_team", label: "Notificar Equipe", icon: Bell },
      { type: "action", action: "add_tag", label: "Adicionar Tag", icon: Tag },
      { type: "action", action: "assign_recruiter", label: "Atribuir Recrutador", icon: UserPlus },
      { type: "action", action: "schedule_interview", label: "Agendar Entrevista", icon: Calendar },
      { type: "action", action: "move_stage", label: "Mover Etapa", icon: Play },
    ],
  },
  {
    title: "Controle",
    icon: GitBranch,
    color: "bg-yellow-100 text-yellow-600",
    nodes: [
      { type: "condition", label: "Condição (Se/Então)", icon: GitBranch },
      { type: "delay", label: "Aguardar", icon: Clock },
    ],
  },
];

export function NodePalette({ onDragStart }: NodePaletteProps) {
  const handleDragStart = (e: React.DragEvent, node: NodeItem) => {
    e.dataTransfer.setData("application/reactflow", JSON.stringify({
      type: node.type,
      data: { label: node.label, trigger: node.trigger, action: node.action },
    }));
    e.dataTransfer.effectAllowed = "move";
    onDragStart(node.type, { label: node.label });
  };

  return (
    <Card className="w-64 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Nós</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-4">
            {NODE_CATEGORIES.map((category) => (
              <div key={category.title}>
                <div className="flex items-center gap-2 mb-2 px-2">
                  <div className={`p-1 rounded ${category.color}`}>
                    <category.icon className="h-3 w-3" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{category.title}</span>
                </div>
                <div className="space-y-1">
                  {category.nodes.map((node, index) => (
                    <div
                      key={`${node.type}-${index}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, node)}
                      className="flex items-center gap-2 p-2 rounded-md border bg-background hover:bg-muted cursor-grab active:cursor-grabbing transition-colors"
                    >
                      <node.icon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{node.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
