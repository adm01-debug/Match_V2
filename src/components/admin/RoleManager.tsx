import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, Plus, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RESOURCES = ['candidatos', 'vagas', 'entrevistas', 'avaliacoes', 'relatorios', 'configuracoes', 'usuarios'];
const ACTIONS = ['read', 'write', 'delete', 'admin'];

interface Role { id: string; name: string; description: string; permissions: Record<string, string[]>; isSystem: boolean; }

const DEFAULT_ROLES: Role[] = [
  { id: '1', name: 'admin', description: 'Acesso total ao sistema', permissions: Object.fromEntries(RESOURCES.map(r => [r, ACTIONS])), isSystem: true },
  { id: '2', name: 'recrutador', description: 'Gestão de candidatos e vagas', permissions: { candidatos: ['read', 'write'], vagas: ['read', 'write'], entrevistas: ['read', 'write'], avaliacoes: ['read', 'write'], relatorios: ['read'] }, isSystem: true },
  { id: '3', name: 'visualizador', description: 'Apenas visualização', permissions: Object.fromEntries(RESOURCES.map(r => [r, ['read']])), isSystem: true },
];

export function RoleManager() {
  const [roles, setRoles] = useState<Role[]>(DEFAULT_ROLES);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSaveRole = () => {
    if (!editingRole) return;
    if (editingRole.id) {
      setRoles(roles.map(r => r.id === editingRole.id ? editingRole : r));
    } else {
      setRoles([...roles, { ...editingRole, id: Date.now().toString() }]);
    }
    setIsDialogOpen(false);
    setEditingRole(null);
    toast({ title: 'Salvo', description: 'Papel atualizado com sucesso.' });
  };

  const togglePermission = (resource: string, action: string) => {
    if (!editingRole) return;
    const current = editingRole.permissions[resource] || [];
    const updated = current.includes(action) ? current.filter(a => a !== action) : [...current, action];
    setEditingRole({ ...editingRole, permissions: { ...editingRole.permissions, [resource]: updated } });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Gerenciar Papéis</CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setEditingRole({ id: '', name: '', description: '', permissions: {}, isSystem: false })}><Plus className="h-4 w-4 mr-1" />Novo Papel</Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader><DialogTitle>{editingRole?.id ? 'Editar' : 'Novo'} Papel</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-sm font-medium">Nome</label><Input value={editingRole?.name || ''} onChange={e => setEditingRole(editingRole ? { ...editingRole, name: e.target.value } : null)} disabled={editingRole?.isSystem} /></div>
                <div><label className="text-sm font-medium">Descrição</label><Input value={editingRole?.description || ''} onChange={e => setEditingRole(editingRole ? { ...editingRole, description: e.target.value } : null)} /></div>
              </div>
              <div><label className="text-sm font-medium">Permissões</label>
                <Table>
                  <TableHeader><TableRow><TableHead>Recurso</TableHead>{ACTIONS.map(a => <TableHead key={a} className="text-center capitalize">{a}</TableHead>)}</TableRow></TableHeader>
                  <TableBody>
                    {RESOURCES.map(resource => (
                      <TableRow key={resource}>
                        <TableCell className="capitalize">{resource}</TableCell>
                        {ACTIONS.map(action => (
                          <TableCell key={action} className="text-center">
                            <Checkbox checked={editingRole?.permissions[resource]?.includes(action) || false} onCheckedChange={() => togglePermission(resource, action)} disabled={editingRole?.isSystem} />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button><Button onClick={handleSaveRole}>Salvar</Button></div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Papel</TableHead><TableHead>Descrição</TableHead><TableHead>Tipo</TableHead><TableHead className="text-right">Ações</TableHead></TableRow></TableHeader>
          <TableBody>
            {roles.map(role => (
              <TableRow key={role.id}>
                <TableCell className="font-medium capitalize">{role.name}</TableCell>
                <TableCell className="text-muted-foreground">{role.description}</TableCell>
                <TableCell><Badge variant={role.isSystem ? 'secondary' : 'default'}>{role.isSystem ? 'Sistema' : 'Customizado'}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => { setEditingRole(role); setIsDialogOpen(true); }}><Pencil className="h-4 w-4" /></Button>
                  {!role.isSystem && <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default RoleManager;
