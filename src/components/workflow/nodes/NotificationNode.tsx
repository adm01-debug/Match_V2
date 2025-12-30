import { memo, useMemo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Bell, Mail, MessageSquare, Send, LucideIcon } from 'lucide-react';

export type NotificationType = 'email' | 'push' | 'slack' | 'teams' | 'whatsapp';

export interface NotificationNodeData {
  label: string;
  notificationType: NotificationType;
  recipients?: string[];
  template?: string;
  subject?: string;
  isEnabled?: boolean;
}

interface NotificationConfig {
  icon: LucideIcon;
  color: string;
  label: string;
}

const notificationConfigs: Record<NotificationType, NotificationConfig> = {
  email: { icon: Mail, color: 'bg-blue-500', label: 'E-mail' },
  push: { icon: Bell, color: 'bg-purple-500', label: 'Push' },
  slack: { icon: MessageSquare, color: 'bg-green-500', label: 'Slack' },
  teams: { icon: MessageSquare, color: 'bg-indigo-500', label: 'Teams' },
  whatsapp: { icon: Send, color: 'bg-emerald-500', label: 'WhatsApp' },
};

const defaultConfig: NotificationConfig = {
  icon: Bell,
  color: 'bg-gray-500',
  label: 'Notificação',
};

function NotificationNodeComponent({ data, selected }: NodeProps<NotificationNodeData>) {
  const config = useMemo(() => {
    return notificationConfigs[data.notificationType] ?? defaultConfig;
  }, [data.notificationType]);

  const { icon: Icon, color: colorClass, label: typeLabel } = config;

  const recipientsText = useMemo(() => {
    if (!data.recipients?.length) return null;
    const count = data.recipients.length;
    return `${count} destinatário${count > 1 ? 's' : ''}`;
  }, [data.recipients]);

  const isDisabled = data.isEnabled === false;

  return (
    <Card 
      className={`min-w-[180px] transition-all ${selected ? 'ring-2 ring-primary' : ''} ${isDisabled ? 'opacity-50' : ''}`}
      role="group"
      aria-label={`Nó de notificação: ${typeLabel}`}
    >
      <Handle 
        type="target" 
        position={Position.Top} 
        className="!bg-primary !w-3 !h-3" 
        aria-label="Entrada do nó"
      />
      
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1.5 rounded ${colorClass}`} aria-hidden="true">
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Notificação</div>
            <div className="font-medium text-sm">{typeLabel}</div>
          </div>
        </div>
        
        {data.label && (
          <div className="text-xs text-muted-foreground truncate" title={data.label}>
            {data.label}
          </div>
        )}
        
        {recipientsText && (
          <div className="mt-2 text-xs">
            <span className="text-muted-foreground">Para: </span>
            <span className="font-medium">{recipientsText}</span>
          </div>
        )}
        
        {data.subject && (
          <div className="mt-1 text-xs truncate" title={data.subject}>
            <span className="text-muted-foreground">Assunto: </span>
            <span>{data.subject}</span>
          </div>
        )}

        {isDisabled && (
          <div className="mt-2 text-xs text-orange-500 font-medium">
            Desabilitado
          </div>
        )}
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

NotificationNodeComponent.displayName = 'NotificationNode';

export const NotificationNode = memo(NotificationNodeComponent);
