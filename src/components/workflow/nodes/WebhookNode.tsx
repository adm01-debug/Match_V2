import { memo, useMemo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Webhook, Globe, ArrowRight, AlertCircle } from 'lucide-react';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface WebhookNodeData {
  label: string;
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  bodyTemplate?: string;
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
  isEnabled?: boolean;
}

const methodColors: Record<HttpMethod, string> = {
  GET: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  POST: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  PUT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  PATCH: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  DELETE: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

function truncateUrl(url: string, maxLength = 30): string {
  if (!url) return '';
  if (url.length <= maxLength) return url;
  return `${url.substring(0, maxLength)}...`;
}

function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function WebhookNodeComponent({ data, selected }: NodeProps<WebhookNodeData>) {
  const truncatedUrl = useMemo(() => truncateUrl(data.url), [data.url]);
  const urlValid = useMemo(() => isValidUrl(data.url), [data.url]);
  const headerCount = useMemo(() => 
    data.headers ? Object.keys(data.headers).length : 0, 
    [data.headers]
  );
  
  const nodeLabel = data.label || 'HTTP Request';
  const isDisabled = data.isEnabled === false;

  return (
    <Card 
      className={`min-w-[200px] transition-shadow ${selected ? 'ring-2 ring-primary' : ''} ${isDisabled ? 'opacity-50' : ''}`}
      role="group"
      aria-label={`Webhook: ${nodeLabel} - ${data.method} ${data.url}`}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-primary !w-3 !h-3" 
        aria-label="Entrada do nó"
      />
      
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-1.5 rounded bg-orange-500" aria-hidden="true">
            <Webhook className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-muted-foreground">Webhook</div>
            <div className="font-medium text-sm truncate" title={nodeLabel}>
              {nodeLabel}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={methodColors[data.method] || methodColors.GET}
              aria-label={`Método HTTP: ${data.method}`}
            >
              {data.method}
            </Badge>
            <ArrowRight className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
            <div 
              className="flex items-center gap-1 text-xs text-muted-foreground truncate flex-1"
              title={data.url}
            >
              {urlValid ? (
                <Globe className="h-3 w-3 flex-shrink-0" aria-hidden="true" />
              ) : (
                <AlertCircle className="h-3 w-3 flex-shrink-0 text-yellow-500" aria-hidden="true" />
              )}
              <span className="truncate">{truncatedUrl || 'URL não configurada'}</span>
            </div>
          </div>
          
          {!urlValid && data.url && (
            <div className="text-xs text-yellow-600 dark:text-yellow-400">
              URL inválida
            </div>
          )}
          
          {headerCount > 0 && (
            <div className="text-xs text-muted-foreground">
              {headerCount} header{headerCount > 1 ? 's' : ''} configurado{headerCount > 1 ? 's' : ''}
            </div>
          )}
          
          <div className="flex gap-2 text-xs flex-wrap">
            {data.timeout !== undefined && data.timeout > 0 && (
              <span className="text-muted-foreground">
                Timeout: {data.timeout}s
              </span>
            )}
            {data.retryCount !== undefined && data.retryCount > 0 && (
              <span className="text-muted-foreground">
                Retry: {data.retryCount}x
                {data.retryDelay ? ` (${data.retryDelay}ms)` : ''}
              </span>
            )}
          </div>

          {isDisabled && (
            <div className="text-xs text-orange-500 font-medium">
              Desabilitado
            </div>
          )}
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="!bg-primary !w-3 !h-3" 
        aria-label="Saída do nó"
      />
    </Card>
  );
}

WebhookNodeComponent.displayName = 'WebhookNode';

export const WebhookNode = memo(WebhookNodeComponent);
