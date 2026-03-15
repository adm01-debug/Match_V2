import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, CardContent } from '@/components/ui/card';
import { Zap } from 'lucide-react';

function TriggerNode({ data }: NodeProps) {
  const nodeData = data as { label?: string; description?: string };
  return (
    <Card className="min-w-[180px] border-2 border-green-500 shadow-lg">
      <CardContent className="p-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-green-100 dark:bg-green-900">
            <Zap className="h-4 w-4 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-medium text-green-600 uppercase">Gatilho</p>
            <p className="text-sm font-semibold">{String(nodeData.label || 'Trigger')}</p>
          </div>
        </div>
        {nodeData.description && (
          <p className="text-xs text-muted-foreground mt-2">{String(nodeData.description)}</p>
        )}
      </CardContent>
      <Handle type="source" position={Position.Bottom} className="!bg-green-500 !w-3 !h-3" />
    </Card>
  );
}

export default memo(TriggerNode);
