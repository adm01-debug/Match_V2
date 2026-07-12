import { memo, useState } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Globe } from 'lucide-react';

interface WebhookNodeData {
  label?: string;
  method?: string;
  url?: string;
  enabled?: boolean;
  [key: string]: unknown;
}

function WebhookNodeComponent({ data }: NodeProps) {
  const nodeData = data as WebhookNodeData;
  const [method, setMethod] = useState(nodeData.method || 'POST');
  const [url, setUrl] = useState(nodeData.url || '');
  const [enabled, setEnabled] = useState(nodeData.enabled !== false);

  return (
    <Card className="w-[280px] border-2 border-info/50 bg-background shadow-lg">
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-info" />
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-sm flex items-center gap-2">
          <Globe className="h-4 w-4 text-info" />
          <span>{nodeData.label || 'Webhook'}</span>
          <Switch className="ml-auto" checked={enabled} onCheckedChange={setEnabled} />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-1 space-y-2">
        <div className="space-y-1">
          <Label className="text-xs">Método HTTP</Label>
          <Select value={method} onValueChange={setMethod}>
            <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="GET">GET</SelectItem>
              <SelectItem value="POST">POST</SelectItem>
              <SelectItem value="PUT">PUT</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">URL</Label>
          <Input className="h-8 text-xs" placeholder="https://..." value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
      </CardContent>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-info" />
    </Card>
  );
}

export const WebhookNode = memo(WebhookNodeComponent);
