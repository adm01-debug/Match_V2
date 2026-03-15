import { Suspense, useMemo, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useState, useEffect } from 'react';
import { useFuzzySearch, FUZZY_PRESETS } from '@/hooks/useFuzzySearch';
import { HighlightMatch, getMatchIndices } from '@/components/ui/highlight-match';
import { Layout } from '@/components/layout/Layout';
import { useAuth, AppRole } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Users, Shield, Search, Loader2, UserCog, Clock, KeyRound, FileText } from 'lucide-react';
import { AuditLogViewer } from '@/components/admin/AuditLogViewer';
import { SLAConfig } from '@/components/admin/SLAConfig';
import { SSOSettings } from '@/components/admin/SSOSettings';

interface UserProfile {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  created_at: string | null;
  roles: AppRole[];
}

const allRoles: AppRole[] = ['admin', 'rh', 'gestor'];

const roleLabels: Record<AppRole, string> = {
  admin: 'Administrador',
  rh: 'RH',
  gestor: 'Gestor',
};

const roleColors: Record<AppRole, string> = {
  admin: 'bg-destructive/20 text-destructive border-destructive/30',
  rh: 'bg-primary/20 text-primary border-primary/30',
  gestor: 'bg-amber-500/20 text-amber-600 border-amber-500/30',
};

const roleDescriptions: Record<AppRole, string> = {
  admin: 'Acesso total ao sistema, pode gerenciar usuários e configurações',
  rh: 'Acesso a todas as funcionalidades de recrutamento',
  gestor: 'Acesso a vagas e candidatos do seu departamento',
};

const AdminPage = () => {
  usePageTitle('Administração');

  const { user } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [editingRoles, setEditingRoles] = useState<AppRole[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    
    // Fetch profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar usuários',
        description: profilesError.message,
      });
      setLoading(false);
      return;
    }

    // Fetch all roles
    const { data: rolesData, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');

    if (rolesError) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar roles',
        description: rolesError.message,
      });
      setLoading(false);
      return;
    }

    // Combine profiles with roles
    const usersWithRoles: UserProfile[] = (profiles || []).map((profile) => ({
      id: profile.id,
      user_id: profile.user_id,
      nome: profile.nome,
      email: profile.email,
      created_at: profile.created_at,
      roles: (rolesData || [])
        .filter((r) => r.user_id === profile.user_id)
        .map((r) => r.role as AppRole),
    }));

    setUsers(usersWithRoles);
    setLoading(false);
  };

  const openEditDialog = (userProfile: UserProfile) => {
    setSelectedUser(userProfile);
    setEditingRoles([...userProfile.roles]);
  };

  const toggleRole = (role: AppRole) => {
    setEditingRoles((prev) =>
      prev.includes(role)
        ? prev.filter((r) => r !== role)
        : [...prev, role]
    );
  };

  const saveRoles = async () => {
    if (!selectedUser) return;
    
    setSaving(true);

    // Determine roles to add and remove
    const rolesToAdd = editingRoles.filter((r) => !selectedUser.roles.includes(r));
    const rolesToRemove = selectedUser.roles.filter((r) => !editingRoles.includes(r));

    try {
      // Remove roles
      for (const role of rolesToRemove) {
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', selectedUser.user_id)
          .eq('role', role);

        if (error) throw error;
      }

      // Add roles
      for (const role of rolesToAdd) {
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: selectedUser.user_id, role });

        if (error) throw error;
      }

      toast({
        title: 'Roles atualizadas',
        description: `Permissões de ${selectedUser.nome} foram atualizadas.`,
      });

      // Refresh users list
      await fetchUsers();
      setSelectedUser(null);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar roles',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    }

    setSaving(false);
  };

  // Busca fuzzy com Fuse.js
  const { results: fuzzyResults, matchesMap } = useFuzzySearch(
    users,
    [
      { name: 'nome', weight: 2 },
      { name: 'email', weight: 1.5 },
    ],
    searchTerm,
    { ...FUZZY_PRESETS.default }
  );

  // Função para obter índices de match
  const getUserMatchIndices = useCallback((userId: string, key: string) => {
    const matches = matchesMap.get(userId);
    return getMatchIndices(matches, key);
  }, [matchesMap]);

  const filteredUsers = useMemo(() => {
    return searchTerm ? fuzzyResults : users;
  }, [users, fuzzyResults, searchTerm]);

  const getInitials = (nome: string) => {
    return nome
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.roles.includes('admin')).length,
    rh: users.filter((u) => u.roles.includes('rh')).length,
    gestores: users.filter((u) => u.roles.includes('gestor')).length,
  };

  return (
    <Suspense fallback={<div className="p-6"><Skeleton className="h-8 w-64 mb-4" /><Skeleton className="h-64" /></div>}>
      <Layout>
        <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Administração</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie usuários e permissões do sistema
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-muted">
                <Users className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Usuários</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-destructive/10">
                <Shield className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.admins}</p>
                <p className="text-sm text-muted-foreground">Administradores</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.rh}</p>
                <p className="text-sm text-muted-foreground">Equipe RH</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-amber-500/10">
                <UserCog className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.gestores}</p>
                <p className="text-sm text-muted-foreground">Gestores</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Usuários do Sistema</CardTitle>
                <CardDescription>
                  Clique em um usuário para editar suas permissões
                </CardDescription>
              </div>
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((userProfile) => (
                      <TableRow key={userProfile.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback className="bg-primary/10 text-primary text-sm">
                                {getInitials(userProfile.nome)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                <HighlightMatch 
                                  text={userProfile.nome} 
                                  indices={getUserMatchIndices(userProfile.id, 'nome')} 
                                />
                              </p>
                              <p className="text-sm text-muted-foreground">
                                <HighlightMatch 
                                  text={userProfile.email} 
                                  indices={getUserMatchIndices(userProfile.id, 'email')} 
                                />
                              </p>
                            </div>
                            {userProfile.user_id === user?.id && (
                              <Badge variant="outline" className="text-xs">
                                Você
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1 flex-wrap">
                            {userProfile.roles.length === 0 ? (
                              <span className="text-sm text-muted-foreground">
                                Sem roles
                              </span>
                            ) : (
                              userProfile.roles.map((role) => (
                                <Badge
                                  key={role}
                                  variant="outline"
                                  className={roleColors[role]}
                                >
                                  {roleLabels[role]}
                                </Badge>
                              ))
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {userProfile.created_at 
                            ? new Date(userProfile.created_at).toLocaleDateString('pt-BR')
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditDialog(userProfile)}
                          >
                            Editar Roles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Roles Dialog */}
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Permissões</DialogTitle>
              <DialogDescription>
                Selecione as roles para {selectedUser?.nome}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {allRoles.map((role) => (
                <div
                  key={role}
                  className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => toggleRole(role)}
                >
                  <Checkbox
                    checked={editingRoles.includes(role)}
                    onCheckedChange={() => toggleRole(role)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{roleLabels[role]}</span>
                      <Badge variant="outline" className={roleColors[role]}>
                        {role}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {roleDescriptions[role]}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {editingRoles.length === 0 && (
              <p className="text-sm text-amber-600 bg-amber-500/10 p-3 rounded-lg">
                Atenção: O usuário ficará sem nenhuma permissão e não poderá acessar o sistema.
              </p>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Cancelar
              </Button>
              <Button onClick={saveRoles} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar Alterações'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </Layout>
    </Suspense>
  );
};

export default AdminPage;
