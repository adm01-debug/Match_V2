import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Card } from '@/components/ui/card';
import { Bell, Mail, MessageSquare, Send } from 'lucide-react';

export interface NotificationNodeData {
  label: string;
  notificationType: 'email' | 'push' | 'slack' | 'teams' | 'whatsapp';
  recipients?: string[];
  template?: string;
  subject?: string;
}

const notificationIcons = {
  email: Mail,
  push: Bell,
  slack: MessageSquare,
  teams: MessageSquare,
  whatsapp: Send,
};

const notificationColors = {
  email: 'bg-blue-500',
  push: 'bg-purple-500',
  slack: 'bg-green-500',
  teams: 'bg-indigo-500',
  whatsapp: 'bg-emerald-500',
};

const notificationLabels = {
  email: 'E-mail',
  push: 'Push',
  slack: 'Slack',
  teams: 'Teams',
  whatsapp: 'WhatsApp',
};

function NotificationNodeComponent({ data, selected }: NodeProps<NotificationNodeData>) {
  const Icon = notificationIcons[data.notificationType] || Bell;
  const colorClass = notificationColors[data.notificationType] || 'bg-gray-500';

  return (
    <Card className={`min-w-[180px] ${selected ? 'ring-2 ring-primary' : ''}`}>
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1.5 rounded ${colorClass}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Notificação</div>
            <div className="font-medium text-sm">{notificationLabels[data.notificationType]}</div>
          </div>
        </div>
        
        {data.label && (
          <div className="text-xs text-muted-foreground truncate">
            {data.label}
          </div>
        )}
        
        {data.recipients && data.recipients.length > 0 && (
          <div className="mt-2 text-xs">
            <span className="text-muted-foreground">Para: </span>
            <span className="font-medium">{data.recipients.length} destinatário(s)</span>
          </div>
        )}
        
        {data.subject && (
          <div className="mt-1 text-xs truncate">
            <span className="text-muted-foreground">Assunto: </span>
            <span>{data.subject}</span>
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </Card>
  );
}

export const NotificationNode = memo(NotificationNodeComponent);
