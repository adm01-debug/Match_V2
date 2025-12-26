import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Users, Plus, Pencil, Trash2, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTalentPool } from '@/hooks/useTalentPool';

export function PoolManager() {
  const { pools, createPool, isLoading } = useTalentPool();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPool, setNewPool] = useState({ name: '', description: '' });

  const handleCreate = () => {
    if (newPool.name.trim()) {
      createPool(newPool);
      setNewPool({ name: '', description: '' });
      setIsDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Pools de Talentos</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild><Button size="sm"><Plus className="h-4 w-4 mr-1" />Novo Pool</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Criar Novo Pool</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><label className="text-sm font-medium">Nome</label><Input value={newPool.name} onChange={e => setNewPool({ ...newPool, name: e.target.value })} placeholder="Ex: Desenvolvedores Senior" /></div>
              <div><label className="text-sm font-medium">Descrição</label><Textarea value={newPool.description} onChange={e => setNewPool({ ...newPool, description: e.target.value })} placeholder="Descrição do pool..." /></div>
            </div>
            <DialogFooter><Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button><Button onClick={handleCreate}>Criar Pool</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Carregando...</div>
        ) : pools.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Nenhum pool criado ainda.</p>
            <p className="text-sm text-muted-foreground">Crie pools para organizar candidatos por segmento.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pools.map(pool => (
              <div key={pool.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{pool.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{pool.description || 'Sem descrição'}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem><Pencil className="h-4 w-4 mr-2" />Editar</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Excluir</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary"><Users className="h-3 w-3 mr-1" />{pool.count} candidatos</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PoolManager;
