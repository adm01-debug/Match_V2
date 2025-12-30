import { memo, useMemo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircleStop, CheckCircle2, XCircle, RotateCcw, LucideIcon } from 'lucide-react';

export type EndNodeStatus = 'success' | 'failure' | 'cancelled';

export interface EndNodeData {
  label: string;
  status?: EndNodeStatus;
  allowRestart?: boolean;
  logMessage?: string;
}

interface StatusConfig {
  icon: LucideIcon;
  color: string;
  badge: 'default' | 'destructive' | 'secondary';
  text: string;
  ariaLabel: string;
}

const statusConfig: Record<EndNodeStatus, StatusConfig> = {
  success: {
    icon: CheckCircle2,
    color: 'bg-green-500',
    badge: 'default',
    text: 'Sucesso',
    ariaLabel: 'Workflow concluído com sucesso',
  },
  failure: {
    icon: XCircle,
    color: 'bg-red-500',
    badge: 'destructive',
    text: 'Falha',
    ariaLabel: 'Workflow falhou',
  },
  cancelled: {
    icon: CircleStop,
    color: 'bg-gray-500',
    badge: 'secondary',
    text: 'Cancelado',
    ariaLabel: 'Workflow cancelado',
  },
};

const defaultConfig: Omit<StatusConfig, 'ariaLabel'> = {
  icon: CircleStop,
  color: 'bg-gray-500',
  badge: 'secondary',
  text: 'Fim',
};

function EndNodeComponent({ data, selected }: NodeProps<EndNodeData>) {
  const config = useMemo(() => {
    return data.status ? statusConfig[data.status] : null;
  }, [data.status]);

  const Icon = config?.icon ?? defaultConfig.icon;
  const colorClass = config?.color ?? defaultConfig.color;
  const nodeLabel = data.label || 'Fim do Workflow';

  return (
    <Card 
      className={`min-w-[160px] transition-shadow ${selected ? 'ring-2 ring-primary' : ''}`}
      role="group"
      aria-label={`Nó de fim: ${nodeLabel}${config ? ` - ${config.ariaLabel}` : ''}`}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-primary !w-3 !h-3" 
        aria-label="Entrada do nó"
      />
      
      <div className="p-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div 
              className={`p-1.5 rounded ${colorClass}`}
              aria-hidden="true"
            >
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Fim</div>
              <div className="font-medium text-sm">{nodeLabel}</div>
            </div>
          </div>
        </div>
        
        {config && (
          <Badge 
            variant={config.badge} 
            className="text-xs"
            aria-label={config.ariaLabel}
          >
            {config.text}
          </Badge>
        )}
        
        {data.allowRestart && (
          <div 
            className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"
            aria-label="Reinício do workflow permitido"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            <span>Reinício permitido</span>
          </div>
        )}
        
        {data.logMessage && (
          <div 
            className="mt-2 text-xs text-muted-foreground truncate"
            title={data.logMessage}
          >
            Log: {data.logMessage}
          </div>
        )}
      </div>
    </Card>
  );
}

EndNodeComponent.displayName = 'EndNode';

export const EndNode = memo(EndNodeComponent);
