import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Webhook, Globe, ArrowRight } from 'lucide-react';

export interface WebhookNodeData {
  label: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  bodyTemplate?: string;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
}

const methodColors: Record<string, string> = {
  GET: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  POST: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  PUT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  PATCH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

function WebhookNodeComponent({ data, selected }: NodeProps<WebhookNodeData>) {
  const truncateUrl = (url: string, maxLength: number = 30) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
  };

  return (
    <Card className={`min-w-[200px] ${selected ? 'ring-2 ring-primary' : ''}`}>
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded bg-orange-500">
            <Webhook className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">Webhook</div>
            <div className="font-medium text-sm truncate">{data.label || 'HTTP Request'}</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={methodColors[data.method]}>
              {data.method}
            </Badge>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <div className="flex items-center gap-1 text-xs text-muted-foreground truncate flex-1">
              <Globe className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{truncateUrl(data.url)}</span>
            </div>
          </div>
          
          {data.headers && Object.keys(data.headers).length > 0 && (
            <div className="text-xs text-muted-foreground">
              {Object.keys(data.headers).length} header(s) configurado(s)
            </div>
          )}
          
          <div className="flex gap-2 text-xs">
            {data.timeout && (
              <span className="text-muted-foreground">
                Timeout: {data.timeout}s
              </span>
            )}
            {data.retryCount && data.retryCount > 0 && (
              <span className="text-muted-foreground">
                Retry: {data.retryCount}x
              </span>
            )}
          </div>
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </Card>
  );
}

export const WebhookNode = memo(WebhookNodeComponent);
