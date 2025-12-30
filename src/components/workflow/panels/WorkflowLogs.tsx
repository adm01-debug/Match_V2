import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { History, CheckCircle2, XCircle, Clock, Loader2, ChevronDown, Search, Download, RefreshCw } from 'lucide-react';

interface LogEntry {
  id: string;
  executionId: string;
  timestamp: Date;
  status: 'success' | 'error' | 'running' | 'pending';
  duration?: number;
  trigger: string;
  nodes: {
    nodeId: string;
    nodeName: string;
    status: 'success' | 'error' | 'skipped';
    duration?: number;
    message?: string;
  }[];
}

interface WorkflowLogsProps {
  logs: LogEntry[];
  onRefresh?: () => void;
  onExport?: () => void;
}

const statusConfig = {
  success: { icon: CheckCircle2, color: 'text-green-500', badge: 'default' as const, label: 'Sucesso' },
  error: { icon: XCircle, color: 'text-red-500', badge: 'destructive' as const, label: 'Erro' },
  running: { icon: Loader2, color: 'text-blue-500', badge: 'secondary' as const, label: 'Executando' },
  pending: { icon: Clock, color: 'text-yellow-500', badge: 'outline' as const, label: 'Pendente' },
};

export function WorkflowLogs({ logs, onRefresh, onExport }: WorkflowLogsProps) {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedLogs, setExpandedLogs] = useState<Set<string>>(new Set());

  const filteredLogs = logs.filter((log) => {
    if (filter !== 'all' && log.status !== filter) return false;
    if (search && !log.executionId.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedLogs);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedLogs(newExpanded);
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '-';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
    }).format(date);
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-5 w-5" />
          <h3 className="font-semibold">Histórico de Execuções</h3>
        </div>
        <div className="flex gap-2">
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          )}
          {onExport && (
            <Button variant="outline" size="sm" onClick={onExport}>
              <Download className="h-4 w-4 mr-1" />
              Exportar
            </Button>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="success">Sucesso</SelectItem>
            <SelectItem value="error">Erro</SelectItem>
            <SelectItem value="running">Executando</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[500px]">
        <div className="space-y-2">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum log encontrado
            </div>
          ) : (
            filteredLogs.map((log) => {
              const config = statusConfig[log.status];
              const Icon = config.icon;
              const isExpanded = expandedLogs.has(log.id);

              return (
                <Collapsible key={log.id} open={isExpanded} onOpenChange={() => toggleExpanded(log.id)}>
                  <Card>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="py-3 cursor-pointer hover:bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className={`h-5 w-5 ${config.color} ${log.status === 'running' ? 'animate-spin' : ''}`} />
                            <div>
                              <div className="font-mono text-sm">{log.executionId}</div>
                              <div className="text-xs text-muted-foreground">{formatDate(log.timestamp)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant={config.badge}>{config.label}</Badge>
                            <span className="text-sm text-muted-foreground">{formatDuration(log.duration)}</span>
                            <ChevronDown className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <div className="border-t pt-3 space-y-2">
                          <div className="text-sm"><span className="text-muted-foreground">Trigger:</span> {log.trigger}</div>
                          <div className="text-sm font-medium mt-2">Nós executados:</div>
                          {log.nodes.map((node, i) => (
                            <div key={i} className="flex items-center justify-between text-sm pl-4 py-1 border-l-2 border-muted">
                              <div className="flex items-center gap-2">
                                {node.status === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                {node.status === 'error' && <XCircle className="h-4 w-4 text-red-500" />}
                                {node.status === 'skipped' && <Clock className="h-4 w-4 text-gray-400" />}
                                <span>{node.nodeName}</span>
                              </div>
                              <span className="text-muted-foreground">{formatDuration(node.duration)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
