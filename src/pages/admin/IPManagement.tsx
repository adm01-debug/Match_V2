/**
 * @fileoverview IP Management Page
 * @module pages/admin/IPManagement
 * @description Página para gerenciamento de IPs permitidos (Admin only)
 */

import { memo, useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Shield, 
  Plus, 
  Trash2, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AllowedIP {
  id: string;
  ip: string;
  description: string;
  added_by: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  expires_at: string | null;
}

interface AccessLog {
  id: string;
  ip: string;
  action: 'ALLOWED' | 'BLOCKED' | 'EXPIRED';
  reason: string;
  user_agent: string;
  timestamp: string;
}

const IPManagement = memo(() => {
  const queryClient = useQueryClient();
  const [newIP, setNewIP] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Buscar IPs permitidos
  const { data: allowedIPs, isLoading: isLoadingIPs } = useQuery({
    queryKey: ['allowed-ips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('allowed_ips')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AllowedIP[];
    },
  });

  const activeIPs = useMemo(() => 
    allowedIPs?.filter(ip => ip.is_active) ?? [], 
    [allowedIPs]
  );

  const inactiveIPs = useMemo(() => 
    allowedIPs?.filter(ip => !ip.is_active) ?? [], 
    [allowedIPs]
  );

  // Buscar logs de acesso (últimas 24h)
  const { data: accessLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ['ip-access-logs'],
    queryFn: async () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { data, error } = await supabase
        .from('ip_access_logs')
        .select('*')
        .gte('timestamp', yesterday.toISOString())
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (error) throw error;
      return data as AccessLog[];
    },
  });

  // Adicionar novo IP
  const addIPMutation = useMutation({
    mutationFn: async ({ ip, description }: { ip: string; description: string }) => {
      const { error } = await supabase.from('allowed_ips').insert({
        ip,
        description,
        added_by: 'admin',
        is_active: true,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowed-ips'] });
      toast.success('IP adicionado com sucesso!');
      setNewIP('');
      setNewDescription('');
      setIsAddDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao adicionar IP: ${error.message}`);
    },
  });

  // Remover IP (desativar)
  const removeIPMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('allowed_ips')
        .update({ is_active: false })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowed-ips'] });
      toast.success('IP removido com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao remover IP: ${error.message}`);
    },
  });

  // Reativar IP
  const reactivateIPMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('allowed_ips')
        .update({ is_active: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowed-ips'] });
      toast.success('IP reativado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao reativar IP: ${error.message}`);
    },
  });

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'ALLOWED':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" /> Permitido</Badge>;
      case 'BLOCKED':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Bloqueado</Badge>;
      case 'EXPIRED':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" /> Expirado</Badge>;
      default:
        return <Badge variant="outline">{action}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6" data-testid="ip-management-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Gerenciamento de IPs</h1>
            <p className="text-muted-foreground">
              Controle de acesso por whitelist de IPs
            </p>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adicionar IP
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo IP</DialogTitle>
              <DialogDescription>
                Adicione um novo endereço IP à lista de permitidos.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="ip">Endereço IP</Label>
                <Input
                  id="ip"
                  placeholder="Ex: 192.168.1.100 ou 2001:db8::1"
                  value={newIP}
                  onChange={(e) => setNewIP(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Ex: Escritório Principal - TI"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={() => addIPMutation.mutate({ ip: newIP, description: newDescription })}
                disabled={!newIP || !newDescription || addIPMutation.isPending}
              >
                {addIPMutation.isPending ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">IPs Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeIPs.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">IPs Inativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveIPs.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Access Logs */}
      <Card aria-live="polite">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Logs de Acesso (Últimas 24h)
          </CardTitle>
          <CardDescription>
            Registro de tentativas de acesso ao sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingLogs ? (
            <div className="flex justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead scope="col">Horário</TableHead>
                  <TableHead scope="col">IP</TableHead>
                  <TableHead scope="col">Status</TableHead>
                  <TableHead scope="col">Motivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accessLogs?.slice(0, 20).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.timestamp), "dd/MM HH:mm:ss", { locale: ptBR })}
                    </TableCell>
                    <TableCell className="font-mono">{log.ip}</TableCell>
                    <TableCell>{getActionBadge(log.action)}</TableCell>
                    <TableCell className="max-w-xs truncate">{log.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

IPManagement.displayName = 'IPManagement';

export default IPManagement;
