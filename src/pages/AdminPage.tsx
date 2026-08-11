import { Suspense, useCallback, useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useFuzzySearch, FUZZY_PRESETS } from '@/hooks/useFuzzySearch';
import { getMatchIndices } from '@/components/ui/highlight-match';
import { Layout } from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { AuditLogViewer } from '@/components/admin/AuditLogViewer';
import { SLAConfig } from '@/components/admin/SLAConfig';
import { SSOSettings } from '@/components/admin/SSOSettings';
import { AdminStatsCards } from '@/components/admin/users/AdminStatsCards';
import { AdminUsersTable } from '@/components/admin/users/AdminUsersTable';
import { EditRolesDialog } from '@/components/admin/users/EditRolesDialog';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import type { UserProfile } from '@/components/admin/users/adminRolesConfig';

const AdminPage = () => {
  usePageTitle('Administração');
  const { user } = useAuth();
  const { toast } = useToast();
  const { users, loading, saveRoles } = useAdminUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const { results: fuzzyResults, matchesMap } = useFuzzySearch(
    users,
    [
      { name: 'nome', weight: 2 },
      { name: 'email', weight: 1.5 },
    ],
    searchTerm,
    { ...FUZZY_PRESETS.default }
  );

  const getUserMatchIndices = useCallback(
    (userId: string, key: string) => getMatchIndices(matchesMap.get(userId), key),
    [matchesMap]
  );

  const filteredUsers = useMemo(
    () => (searchTerm ? fuzzyResults : users),
    [users, fuzzyResults, searchTerm]
  );

  const stats = useMemo(
    () => ({
      total: users.length,
      admins: users.filter((u) => u.roles.includes('admin')).length,
      rh: users.filter((u) => u.roles.includes('rh')).length,
      gestores: users.filter((u) => u.roles.includes('gestor')).length,
    }),
    [users]
  );

  const handleSave: React.ComponentProps<typeof EditRolesDialog>['onSave'] = async (
    userProfile,
    editingRoles
  ) => {
    try {
      await saveRoles(userProfile, editingRoles);
      toast({
        title: 'Roles atualizadas',
        description: `Permissões de ${userProfile.nome} foram atualizadas.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar roles',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
      throw error;
    }
  };

  return (
    <Suspense
      fallback={
        <div className="p-6">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-64" />
        </div>
      }
    >
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Administração</h1>
            <p className="text-muted-foreground mt-1">
              Gerencie usuários, permissões e configurações do sistema
            </p>
          </div>

          <Tabs defaultValue="usuarios" className="space-y-6">
            <TabsList>
              <TabsTrigger value="usuarios">Usuários</TabsTrigger>
              <TabsTrigger value="auditoria">Auditoria</TabsTrigger>
              <TabsTrigger value="sla">SLA</TabsTrigger>
              <TabsTrigger value="sso">SSO</TabsTrigger>
            </TabsList>

            <TabsContent value="usuarios" className="space-y-6">
              <AdminStatsCards {...stats} />

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
                  <AdminUsersTable
                    loading={loading}
                    users={filteredUsers}
                    searchTerm={searchTerm}
                    currentUserId={user?.id}
                    getMatchIndicesFor={getUserMatchIndices}
                    onEdit={setSelectedUser}
                  />
                </CardContent>
              </Card>

              <EditRolesDialog
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
                onSave={handleSave}
              />
            </TabsContent>

            <TabsContent value="auditoria">
              <AuditLogViewer />
            </TabsContent>

            <TabsContent value="sla">
              <SLAConfig />
            </TabsContent>

            <TabsContent value="sso">
              <SSOSettings />
            </TabsContent>
          </Tabs>
        </div>
      </Layout>
    </Suspense>
  );
};

export default AdminPage;
