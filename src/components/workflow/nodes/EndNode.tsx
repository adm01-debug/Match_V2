import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleStop, CheckCircle2, XCircle, RotateCcw } from 'lucide-react';

export interface EndNodeData {
  label: string;
  status?: 'success' | 'failure' | 'cancelled';
  allowRestart?: boolean;
  logMessage?: string;
}

const statusConfig = {
  success: {
    icon: CheckCircle2,
    color: 'bg-green-500',
    badge: 'default' as const,
    text: 'Sucesso',
  },
  failure: {
    icon: XCircle,
    color: 'bg-red-500',
    badge: 'destructive' as const,
    text: 'Falha',
  },
  cancelled: {
    icon: CircleStop,
    color: 'bg-gray-500',
    badge: 'secondary' as const,
    text: 'Cancelado',
  },
};

function EndNodeComponent({ data, selected }: NodeProps<EndNodeData>) {
  const config = data.status ? statusConfig[data.status] : null;
  const Icon = config?.icon || CircleStop;

  return (
    <Card className={`min-w-[160px] ${selected ? 'ring-2 ring-primary' : ''}`}>
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      
      <div className="p-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded ${config?.color || 'bg-gray-500'}`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Fim</div>
              <div className="font-medium text-sm">{data.label || 'Fim do Workflow'}</div>
            </div>
          </div>
        </div>
        
        {config && (
          <Badge variant={config.badge} className="text-xs">
            {config.text}
          </Badge>
        )}
        
        {data.allowRestart && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <RotateCcw className="h-3 w-3" />
            <span>Reinício permitido</span>
          </div>
        )}
        
        {data.logMessage && (
          <div className="mt-2 text-xs text-muted-foreground truncate">
            Log: {data.logMessage}
          </div>
        )}
      </div>
    </Card>
  );
}

export const EndNode = memo(EndNodeComponent);
