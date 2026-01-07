import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { Download, RefreshCw, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ACTION_COLORS: Record<string, string> = {
  create: 'bg-green-500',
  update: 'bg-blue-500',
  delete: 'bg-red-500',
  view: 'bg-gray-500',
  login: 'bg-purple-500',
  logout: 'bg-orange-500',
};

export default function AuditLogPage() {
  const [filters, setFilters] = useState<{ action?: string; resource_type?: string }>({});
  const { logs, refetch, actionTypes, resourceTypes, exportLogs } = useAuditLogs(filters);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Logs de Auditoria</h1>
            <p className="text-muted-foreground">Histórico de ações no sistema</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-2" />Atualizar</Button>
            <Button onClick={exportLogs}><Download className="h-4 w-4 mr-2" />Exportar CSV</Button>
          </div>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-base flex items-center gap-2"><Filter className="h-4 w-4" />Filtros</CardTitle></CardHeader>
          <CardContent className="flex gap-4">
            <Select value={filters.action || ''} onValueChange={(v) => setFilters({ ...filters, action: v || undefined })}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Ação" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                {actionTypes.map((a: string) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filters.resource_type || ''} onValueChange={(v) => setFilters({ ...filters, resource_type: v || undefined })}>
              <SelectTrigger className="w-[180px]"><SelectValue placeholder="Recurso" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                {resourceTypes.map((r: string) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button variant="ghost" onClick={() => setFilters({})}>Limpar</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
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
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-sm">{format(new Date(log.created_at), 'dd/MM/yy HH:mm', { locale: ptBR })}</TableCell>
                    <TableCell>{log.profiles?.nome || log.user_id?.slice(0, 8)}</TableCell>
                    <TableCell><Badge className={ACTION_COLORS[log.action] || 'bg-gray-500'}>{log.action}</Badge></TableCell>
                    <TableCell>{log.resource_type}</TableCell>
                    <TableCell className="font-mono text-xs">{log.resource_id?.slice(0, 8)}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.ip_address || '-'}</TableCell>
                  </TableRow>
                ))}
                {logs.length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nenhum log encontrado</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
