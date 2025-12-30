import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card } from "@/components/ui/card";
import { GitBranch } from "lucide-react";

interface ConditionNodeData {
  label: string;
  condition?: string;
}

export const ConditionNode = memo(({ data, selected }: NodeProps<ConditionNodeData>) => {
  return (
    <Card className={`p-3 min-w-[180px] ${selected ? "ring-2 ring-primary" : ""}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-yellow-500" />
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded bg-yellow-100 dark:bg-yellow-900">
          <GitBranch className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        </div>
        <span className="font-medium text-sm">Condição</span>
      </div>
      <p className="text-xs text-muted-foreground">{data.condition || "Se..."}</p>
      <div className="flex justify-between mt-2 text-xs">
        <span className="text-green-600">Sim</span>
        <span className="text-red-600">Não</span>
      </div>
      <Handle type="source" position={Position.Bottom} id="yes" style={{ left: "25%" }} className="w-3 h-3 !bg-green-500" />
      <Handle type="source" position={Position.Bottom} id="no" style={{ left: "75%" }} className="w-3 h-3 !bg-red-500" />
    </Card>
  );
});

ConditionNode.displayName = "ConditionNode";
