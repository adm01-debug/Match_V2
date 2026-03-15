import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { Shield, Search, RefreshCw } from 'lucide-react';

export function AuditLogViewer() {
  const { logs, isLoading, refetch, updateFilters } = useAuditLogs();
  const [search, setSearch] = useState('');

  const filtered = search
    ? logs.filter((l) => l.action.includes(search) || l.ip_address.includes(search))
    : logs;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Audit Logs</CardTitle>
        <CardDescription>Registro de todas as ações no sistema</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9" placeholder="Buscar por ação ou IP..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button variant="outline" size="icon" onClick={() => refetch()}><RefreshCw className="h-4 w-4" /></Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Ação</TableHead>
              <TableHead>IP</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center">Carregando...</TableCell></TableRow>
            ) : filtered.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Nenhum log encontrado</TableCell></TableRow>
            ) : (
              filtered.slice(0, 100).map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">{new Date(log.created_at).toLocaleString('pt-BR')}</TableCell>
                  <TableCell className="font-mono text-sm">{log.action}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ip_address}</TableCell>
                  <TableCell>
                    <Badge variant={log.allowed ? 'default' : 'destructive'}>{log.allowed ? 'Permitido' : 'Bloqueado'}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AuditLogViewer;
