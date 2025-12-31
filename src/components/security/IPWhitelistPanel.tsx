import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, Trash2, Plus } from 'lucide-react';

interface AllowedIP {
  id: string;
  ip_address: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
}

export default function IPWhitelistPanel() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newIP, setNewIP] = useState({ ip: '', description: '' });

  const { data: allowedIPs, isLoading } = useQuery({
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

  const addMutation = useMutation({
    mutationFn: async (data: { ip: string; description: string }) => {
      const { error } = await supabase.from('allowed_ips').insert({
        ip_address: data.ip,
        description: data.description || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowed-ips'] });
      toast({ title: 'IP adicionado à whitelist!' });
      setIsAddOpen(false);
      setNewIP({ ip: '', description: '' });
    },
    onError: () => toast({ title: 'Erro ao adicionar IP', variant: 'destructive' }),
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from('allowed_ips').update({ is_active: active }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['allowed-ips'] }),
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('allowed_ips').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowed-ips'] });
      toast({ title: 'IP removido da whitelist!' });
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" /> IP Whitelist
            </CardTitle>
            <CardDescription>{allowedIPs?.filter(ip => ip.is_active).length || 0} IPs ativos</CardDescription>
          </div>
          <Button onClick={() => setIsAddOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> Adicionar IP
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
                <TableHead>Descrição</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allowedIPs?.map((ip) => (
                <TableRow key={ip.id}>
                  <TableCell className="font-mono">{ip.ip_address}</TableCell>
                  <TableCell>{ip.description || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={ip.is_active}
                        onCheckedChange={(checked) => toggleMutation.mutate({ id: ip.id, active: checked })}
                      />
                      <Badge variant={ip.is_active ? 'default' : 'secondary'}>
                        {ip.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
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
            <DialogTitle>Adicionar IP à Whitelist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Endereço IP (ex: 192.168.1.1)"
              value={newIP.ip}
              onChange={(e) => setNewIP({ ...newIP, ip: e.target.value })}
            />
            <Input
              placeholder="Descrição (ex: Escritório Principal)"
              value={newIP.description}
              onChange={(e) => setNewIP({ ...newIP, description: e.target.value })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancelar</Button>
            <Button onClick={() => addMutation.mutate(newIP)} disabled={!newIP.ip || addMutation.isPending}>
              {addMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Adicionar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
