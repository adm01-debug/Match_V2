import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock } from 'lucide-react';

function DelayNode({ data }: NodeProps) {
  const nodeData = data as { label?: string; description?: string };
  return (
    <Card className="min-w-[180px] border-2 border-purple-500 shadow-lg">
      <Handle type="target" position={Position.Top} className="!bg-purple-500 !w-3 !h-3" />
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-purple-100 dark:bg-purple-900">
            <Clock className="h-4 w-4 text-purple-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-purple-600 uppercase">Atraso</p>
            <p className="text-sm font-semibold">{String(nodeData.label || 'Delay')}</p>
          </div>
        </div>
        {nodeData.description && (
          <p className="text-xs text-muted-foreground mt-2">{String(nodeData.description)}</p>
        )}
      </CardContent>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-500 !w-3 !h-3" />
    </Card>
  );
}

export default memo(DelayNode);
