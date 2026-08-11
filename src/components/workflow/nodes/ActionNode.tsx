import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';

function ActionNode({ data }: NodeProps) {
  const nodeData = data as { label?: string; description?: string };
  return (
    <Card className="min-w-[180px] border-2 border-info shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-info !w-3 !h-3" />
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-info dark:bg-info">
            <Play className="h-4 w-4 text-info" />
          </div>
          <div>
            <p className="text-xs font-medium text-info uppercase">Ação</p>
            <p className="text-sm font-semibold">{String(nodeData.label || 'Action')}</p>
          </div>
        </div>
        {nodeData.description && (
          <p className="text-xs text-muted-foreground mt-2">{String(nodeData.description)}</p>
        )}
      </CardContent>
      <Handle type="source" position={Position.Bottom} className="!bg-info !w-3 !h-3" />
    </Card>
  );
}

export default memo(ActionNode);
