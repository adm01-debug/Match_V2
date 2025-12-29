import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Search, RefreshCw } from 'lucide-react';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ACTION_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  create: { label: 'Criação', variant: 'default' },
  update: { label: 'Atualização', variant: 'secondary' },
  delete: { label: 'Exclusão', variant: 'destructive' },
  view: { label: 'Visualização', variant: 'outline' },
  export: { label: 'Exportação', variant: 'outline' },
  login: { label: 'Login', variant: 'default' },
  logout: { label: 'Logout', variant: 'secondary' },
};

export function AuditLogViewer() {
  const [filters, setFilters] = useState({ action: '', resource_type: '', user_id: '' });
  const { logs, isLoading, refetch, actionTypes, resourceTypes, exportLogs } = useAuditLogs(filters.action || filters.resource_type ? filters : undefined);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Log de Auditoria</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-1" />Atualizar</Button>
          <Button variant="outline" size="sm" onClick={exportLogs}><Download className="h-4 w-4 mr-1" />Exportar</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4 flex-wrap">
          <Select value={filters.action} onValueChange={v => setFilters({ ...filters, action: v })}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filtrar por ação" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas as ações</SelectItem>
              {actionTypes.map(a => <SelectItem key={a} value={a}>{ACTION_LABELS[a]?.label || a}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.resource_type} onValueChange={v => setFilters({ ...filters, resource_type: v })}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Filtrar por recurso" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos os recursos</SelectItem>
              {resourceTypes.map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar..." className="pl-10" />
          </div>
        </div>

        <div className="border rounded-lg max-h-[500px] overflow-auto">
          <Table>
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
                <TableRow><TableCell colSpan={6} className="text-center py-8">Carregando...</TableCell></TableRow>
              ) : logs.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhum registro encontrado</TableCell></TableRow>
              ) : (
                logs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">{format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                    <TableCell>{log.profiles?.nome || log.user_id?.slice(0, 8) || '-'}</TableCell>
                    <TableCell><Badge variant={ACTION_LABELS[log.action]?.variant || 'secondary'}>{ACTION_LABELS[log.action]?.label || log.action}</Badge></TableCell>
                    <TableCell className="capitalize">{log.resource_type}</TableCell>
                    <TableCell className="font-mono text-xs">{log.resource_id?.slice(0, 8) || '-'}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.ip_address || '-'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default AuditLogViewer;

