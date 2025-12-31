import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, Users, Plus, Trash2, Search, AlertTriangle } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

type AppRole = 'admin' | 'rh' | 'gestor';

interface UserWithRoles {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  roles: AppRole[];
}

const ROLE_LABELS: Record<AppRole, string> = {
  admin: 'Administrador',
  rh: 'RH',
  gestor: 'Gestor',
};

const ROLE_COLORS: Record<AppRole, string> = {
  admin: 'bg-red-500/10 text-red-500 border-red-500/20',
  rh: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  gestor: 'bg-green-500/10 text-green-500 border-green-500/20',
};

export default function RolesPage() {
  useDocumentTitle('Gerenciar Roles');
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithRoles | null>(null);
  const [newRole, setNewRole] = useState<AppRole | ''>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [roleToRemove, setRoleToRemove] = useState<{ user: UserWithRoles; role: AppRole } | null>(null);

  const isAdmin = hasRole('admin');

  // Fetch users with their roles
  const { data: users, isLoading } = useQuery({
    queryKey: ['users-with-roles'],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, user_id, nome, email');

      if (profilesError) throw profilesError;

      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const usersWithRoles: UserWithRoles[] = (profiles || []).map(profile => ({
        ...profile,
        roles: (userRoles || [])
          .filter(ur => ur.user_id === profile.user_id)
          .map(ur => ur.role as AppRole),
      }));

      return usersWithRoles;
    },
    enabled: isAdmin,
  });

  // Add role mutation
  const addRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase.from('user_roles').insert({
        user_id: userId,
        role,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      toast({ title: 'Role adicionada com sucesso!' });
      setIsAddDialogOpen(false);
      setSelectedUser(null);
      setNewRole('');
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao adicionar role', 
        description: error.message.includes('duplicate') ? 'Usuário já possui esta role' : error.message,
        variant: 'destructive' 
      });
    },
  });

  // Remove role mutation
  const removeRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: AppRole }) => {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users-with-roles'] });
      toast({ title: 'Role removida com sucesso!' });
      setRoleToRemove(null);
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao remover role', description: error.message, variant: 'destructive' });
    },
  });

  const filteredUsers = users?.filter(user => 
    user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const availableRoles = (user: UserWithRoles): AppRole[] => {
    const allRoles: AppRole[] = ['admin', 'rh', 'gestor'];
    return allRoles.filter(r => !user.roles.includes(r));
  };

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
              <p className="text-muted-foreground">
                Você não tem permissão para acessar esta página.
                Apenas administradores podem gerenciar roles.
              </p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Gerenciar Roles
            </h1>
            <p className="text-muted-foreground mt-1">
              Atribua e gerencie roles de usuários do sistema
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Usuários e Roles
                </CardTitle>
                <CardDescription>
                  {users?.length || 0} usuários cadastrados
                </CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar usuário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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
                    <TableHead>Usuário</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.nome}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {user.roles.length > 0 ? (
                            user.roles.map((role) => (
                              <Badge 
                                key={role} 
                                variant="outline"
                                className={`${ROLE_COLORS[role]} cursor-pointer hover:opacity-80`}
                                onClick={() => setRoleToRemove({ user, role })}
                              >
                                {ROLE_LABELS[role]}
                                <Trash2 className="h-3 w-3 ml-1" />
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted-foreground text-sm">Sem roles</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {availableRoles(user).length > 0 && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedUser(user);
                              setIsAddDialogOpen(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Role
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Add Role Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Role</DialogTitle>
              <DialogDescription>
                Adicionar nova role para {selectedUser?.nome}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Select value={newRole} onValueChange={(v) => setNewRole(v as AppRole)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma role" />
                </SelectTrigger>
                <SelectContent>
                  {selectedUser && availableRoles(selectedUser).map((role) => (
                    <SelectItem key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  if (selectedUser && newRole) {
                    addRoleMutation.mutate({ userId: selectedUser.user_id, role: newRole });
                  }
                }}
                disabled={!newRole || addRoleMutation.isPending}
              >
                {addRoleMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Remove Role Confirmation */}
        <Dialog open={!!roleToRemove} onOpenChange={() => setRoleToRemove(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Remover Role</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja remover a role "{roleToRemove && ROLE_LABELS[roleToRemove.role]}" 
                do usuário {roleToRemove?.user.nome}?
              </DialogDescription>
            </DialogHeader>
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Esta ação irá revogar as permissões associadas a esta role.
              </AlertDescription>
            </Alert>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRoleToRemove(null)}>
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (roleToRemove) {
                    removeRoleMutation.mutate({ 
                      userId: roleToRemove.user.user_id, 
                      role: roleToRemove.role 
                    });
                  }
                }}
                disabled={removeRoleMutation.isPending}
              >
                {removeRoleMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Remover
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
