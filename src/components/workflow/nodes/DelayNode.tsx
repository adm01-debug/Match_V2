import { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface DelayNodeData {
  label: string;
  duration?: number;
  unit?: "minutes" | "hours" | "days";
}

export const DelayNode = memo(({ data, selected }: NodeProps<DelayNodeData>) => {
  const formatDuration = () => {
    if (!data.duration) return "Aguardar...";
    const units = { minutes: "min", hours: "h", days: "dias" };
    return `${data.duration} ${units[data.unit || "hours"]}`;
  };

  return (
    <Card className={`p-3 min-w-[180px] ${selected ? "ring-2 ring-primary" : ""}`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-purple-500" />
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded bg-purple-100 dark:bg-purple-900">
          <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </div>
        <span className="font-medium text-sm">Aguardar</span>
      </div>
      <Badge variant="secondary" className="text-xs">{formatDuration()}</Badge>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-purple-500" />
    </Card>
  );
});

DelayNode.displayName = "DelayNode";
