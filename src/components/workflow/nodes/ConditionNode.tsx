import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { GitBranch } from 'lucide-react';

function ConditionNode({ data }: NodeProps) {
  const nodeData = data as { label?: string; description?: string };
  return (
    <Card className="min-w-[180px] border-2 border-amber-500 shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-amber-500 !w-3 !h-3" />
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-amber-100 dark:bg-amber-900">
            <GitBranch className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-amber-600 uppercase">Condição</p>
            <p className="text-sm font-semibold">{String(nodeData.label || 'Condition')}</p>
          </div>
        </div>
        {nodeData.description && (
          <p className="text-xs text-muted-foreground mt-2">{String(nodeData.description)}</p>
        )}
      </CardContent>
      <Handle type="source" position={Position.Bottom} id="yes" className="!bg-green-500 !w-3 !h-3 !left-[30%]" />
      <Handle type="source" position={Position.Bottom} id="no" className="!bg-red-500 !w-3 !h-3 !left-[70%]" />
    </Card>
  );
}

export default memo(ConditionNode);
