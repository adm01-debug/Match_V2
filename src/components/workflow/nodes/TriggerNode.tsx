import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { TRIGGER_LABELS, WorkflowTrigger } from "@/types/workflow";

interface TriggerNodeData {
  label: string;
  trigger?: WorkflowTrigger;
}

export const TriggerNode = memo(({ data, selected }: NodeProps<TriggerNodeData>) => {
  return (
    <Card className={`p-3 min-w-[180px] ${selected ? "ring-2 ring-primary" : ""}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded bg-green-100 dark:bg-green-900">
          <Zap className="h-4 w-4 text-green-600 dark:text-green-400" />
        </div>
        <span className="font-medium text-sm">Gatilho</span>
      </div>
      <Badge variant="secondary" className="text-xs">
        {data.trigger ? TRIGGER_LABELS[data.trigger] : "Selecione..."}
      </Badge>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-green-500" />
    </Card>
  );
});

TriggerNode.displayName = "TriggerNode";
