import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Mail, MessageSquare, Bell, Tag, UserPlus, Calendar } from "lucide-react";
import { ACTION_LABELS, WorkflowAction } from "@/types/workflow";

interface ActionNodeData {
  label: string;
  action?: WorkflowAction;
}

const ACTION_ICONS: Partial<Record<WorkflowAction, typeof Mail>> = {
  send_email: Mail,
  send_whatsapp: MessageSquare,
  notify_team: Bell,
  add_tag: Tag,
  assign_recruiter: UserPlus,
  schedule_interview: Calendar,
};

export const ActionNode = memo(({ data, selected }: NodeProps<ActionNodeData>) => {
  const Icon = data.action ? ACTION_ICONS[data.action] || Play : Play;

  return (
    <Card className={`p-3 min-w-[180px] ${selected ? "ring-2 ring-primary" : ""}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-blue-500" />
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded bg-blue-100 dark:bg-blue-900">
          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <span className="font-medium text-sm">Ação</span>
      </div>
      <Badge variant="secondary" className="text-xs">
        {data.action ? ACTION_LABELS[data.action] : "Selecione..."}
      </Badge>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-blue-500" />
    </Card>
  );
});

ActionNode.displayName = "ActionNode";
