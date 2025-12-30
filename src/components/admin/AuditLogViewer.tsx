import { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Search, RefreshCw, Loader2 } from 'lucide-react';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type ActionVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface ActionConfig {
  label: string;
  variant: ActionVariant;
}

const ACTION_LABELS: Record<string, ActionConfig> = {
  create: { label: 'Criação', variant: 'default' },
  update: { label: 'Atualização', variant: 'secondary' },
  delete: { label: 'Exclusão', variant: 'destructive' },
  view: { label: 'Visualização', variant: 'outline' },
  export: { label: 'Exportação', variant: 'outline' },
  login: { label: 'Login', variant: 'default' },
  logout: { label: 'Logout', variant: 'secondary' },
};

const DEFAULT_ACTION_CONFIG: ActionConfig = { label: '', variant: 'secondary' };

export function AuditLogViewer() {
  const [filters, setFilters] = useState({ 
    action: '', 
    resource_type: '', 
    user_id: '' 
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const hasFilters = !!(filters.action || filters.resource_type);
  const { logs, isLoading, refetch, actionTypes, resourceTypes, exportLogs } = useAuditLogs(
    hasFilters ? filters : undefined
  );

  // Filtrar logs localmente pela busca
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    
    const query = searchQuery.toLowerCase();
    return logs.filter(log => {
      const userName = log.profiles?.nome?.toLowerCase() || '';
      const userId = log.user_id?.toLowerCase() || '';
      const resourceType = log.resource_type?.toLowerCase() || '';
      const resourceId = log.resource_id?.toLowerCase() || '';
      const action = log.action?.toLowerCase() || '';
      const ip = log.ip_address?.toLowerCase() || '';
      
      return userName.includes(query) ||
             userId.includes(query) ||
             resourceType.includes(query) ||
             resourceId.includes(query) ||
             action.includes(query) ||
             ip.includes(query);
    });
  }, [logs, searchQuery]);

  const handleActionChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, action: value }));
  }, []);

  const handleResourceChange = useCallback((value: string) => {
    setFilters(prev => ({ ...prev, resource_type: value }));
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      await exportLogs();
    } catch (error) {
      console.error('[AuditLogViewer] Export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, [exportLogs]);

  const formatDate = useCallback((dateStr: string): string => {
    try {
      return format(new Date(dateStr), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch {
      return dateStr;
    }
  }, []);

  const getActionConfig = (action: string): ActionConfig => {
    return ACTION_LABELS[action] || { ...DEFAULT_ACTION_CONFIG, label: action };
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
        <CardTitle>Log de Auditoria</CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
            aria-label="Atualizar logs"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
            Atualizar
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            disabled={isExporting || filteredLogs.length === 0}
            aria-label="Exportar logs"
          >
            {isExporting ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="h-4 w-4 mr-1" aria-hidden="true" />
            )}
            Exportar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 flex-wrap" role="search" aria-label="Filtros de auditoria">
          <Select value={filters.action} onValueChange={handleActionChange}>
            <SelectTrigger className="w-[180px]" aria-label="Filtrar por ação">
              <SelectValue placeholder="Filtrar por ação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as ações</SelectItem>
              {actionTypes.map(a => (
                <SelectItem key={a} value={a}>
                  {getActionConfig(a).label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.resource_type} onValueChange={handleResourceChange}>
            <SelectTrigger className="w-[180px]" aria-label="Filtrar por recurso">
              <SelectValue placeholder="Filtrar por recurso" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os recursos</SelectItem>
              {resourceTypes.map(r => (
                <SelectItem key={r} value={r} className="capitalize">
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative flex-1 min-w-[200px]">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" 
              aria-hidden="true"
            />
            <Input 
              placeholder="Buscar em todos os campos..." 
              className="pl-10"
              value={searchQuery}
              onChange={handleSearchChange}
              aria-label="Buscar nos logs"
            />
          </div>
        </div>

        <div className="border rounded-lg max-h-[500px] overflow-auto">
          <Table aria-label="Tabela de logs de auditoria">
            <TableHeader>
              <TableRow>
                <TableHead>Data/Hora</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Recurso</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                      Carregando...
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    {searchQuery ? 'Nenhum resultado para a busca' : 'Nenhum registro encontrado'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map(log => {
                  const actionConfig = getActionConfig(log.action);
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm whitespace-nowrap">
                        {formatDate(log.created_at)}
                      </TableCell>
                      <TableCell title={log.user_id || undefined}>
                        {log.profiles?.nome || log.user_id?.slice(0, 8) || '-'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={actionConfig.variant}>
                          {actionConfig.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="capitalize">{log.resource_type || '-'}</TableCell>
                      <TableCell className="font-mono text-xs" title={log.resource_id || undefined}>
                        {log.resource_id?.slice(0, 8) || '-'}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {log.ip_address || '-'}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {filteredLogs.length > 0 && (
          <div className="text-sm text-muted-foreground" aria-live="polite">
            Exibindo {filteredLogs.length} de {logs.length} registros
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AuditLogViewer;
