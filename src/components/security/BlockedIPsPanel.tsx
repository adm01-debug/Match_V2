import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Ban, Trash2, Plus, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BlockedIP {
  id: string;
  ip_address: string;
  reason: string | null;
  blocked_at: string;
  expires_at: string | null;
  is_permanent: boolean;
}

export default function BlockedIPsPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newIP, setNewIP] = useState({ ip: '', reason: '', permanent: false });

  const { data: blockedIPs, isLoading } = useQuery({
    queryKey: ['blocked-ips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blocked_ips')
        .select('*')
        .order('blocked_at', { ascending: false });
      if (error) throw error;
      return data as BlockedIP[];
    },
  });

  const addMutation = useMutation({
    mutationFn: async (data: { ip: string; reason: string; permanent: boolean }) => {
      const { error } = await supabase.from('blocked_ips').insert({
        ip_address: data.ip,
        reason: data.reason || null,
        is_permanent: data.permanent,
        expires_at: data.permanent ? null : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-ips'] });
      toast({ title: 'IP bloqueado com sucesso!' });
      setIsAddOpen(false);
      setNewIP({ ip: '', reason: '', permanent: false });
    },
    onError: () => toast({ title: 'Erro ao bloquear IP', variant: 'destructive' }),
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('blocked_ips').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-ips'] });
      toast({ title: 'IP desbloqueado!' });
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Ban className="h-5 w-5" /> IPs Bloqueados
            </CardTitle>
            <CardDescription>{blockedIPs?.length || 0} IPs bloqueados</CardDescription>
          </div>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Bloquear IP
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Expira em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blockedIPs?.map((ip) => (
                <TableRow key={ip.id}>
                  <TableCell className="font-mono">{ip.ip_address}</TableCell>
                  <TableCell>{ip.reason || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={ip.is_permanent ? 'destructive' : 'secondary'}>
                      {ip.is_permanent ? 'Permanente' : 'Temporário'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {ip.expires_at ? (
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {format(new Date(ip.expires_at), "dd/MM HH:mm", { locale: ptBR })}
                      </div>
                    ) : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={() => removeMutation.mutate(ip.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bloquear IP</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Endereço IP (ex: 192.168.1.1)"
              value={newIP.ip}
              onChange={(e) => setNewIP({ ...newIP, ip: e.target.value })}
            />
            <Input
              placeholder="Motivo (opcional)"
              value={newIP.reason}
              onChange={(e) => setNewIP({ ...newIP, reason: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
            <Button onClick={() => addMutation.mutate(newIP)} disabled={!newIP.ip || addMutation.isPending}>
              {addMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Bloquear
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
