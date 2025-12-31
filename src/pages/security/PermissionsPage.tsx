import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Key, Shield, AlertTriangle, CheckCircle2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

type AppRole = 'admin' | 'rh' | 'gestor';

interface Permission {
  id: string;
  name: string;
  description: string | null;
  module: string;
  action: string;
}

interface RolePermission {
  role: AppRole;
  permission_id: string;
}

const ROLE_LABELS: Record<AppRole, string> = {
  admin: 'Administrador',
  rh: 'RH',
  gestor: 'Gestor',
};

const MODULE_LABELS: Record<string, string> = {
  vagas: 'Vagas',
  candidatos: 'Candidatos',
  pipeline: 'Pipeline',
  relatorios: 'Relatórios',
  admin: 'Administração',
};

export default function PermissionsPage() {
  useDocumentTitle('Matriz de Permissões');
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState<AppRole>('admin');

  const isAdmin = hasRole('admin');

  // Fetch permissions
  const { data: permissions, isLoading: loadingPermissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('module', { ascending: true })
        .order('action', { ascending: true });
      if (error) throw error;
      return data as Permission[];
    },
    enabled: isAdmin,
  });

  // Fetch role permissions
  const { data: rolePermissions, isLoading: loadingRolePermissions } = useQuery({
    queryKey: ['role-permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('role, permission_id');
      if (error) throw error;
      return data as RolePermission[];
    },
    enabled: isAdmin,
  });

  // Toggle permission mutation
  const togglePermissionMutation = useMutation({
    mutationFn: async ({ role, permissionId, enabled }: { role: AppRole; permissionId: string; enabled: boolean }) => {
      if (enabled) {
        const { error } = await supabase.from('role_permissions').insert({
          role,
          permission_id: permissionId,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role', role)
          .eq('permission_id', permissionId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['role-permissions'] });
      toast({ title: 'Permissão atualizada!' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro ao atualizar permissão', description: error.message, variant: 'destructive' });
    },
  });

  const hasPermission = (role: AppRole, permissionId: string): boolean => {
    return rolePermissions?.some(rp => rp.role === role && rp.permission_id === permissionId) || false;
  };

  const groupedPermissions = permissions?.reduce((acc, perm) => {
    if (!acc[perm.module]) {
      acc[perm.module] = [];
    }
    acc[perm.module].push(perm);
    return acc;
  }, {} as Record<string, Permission[]>);

  const isLoading = loadingPermissions || loadingRolePermissions;

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
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Key className="h-8 w-8 text-primary" />
            Matriz de Permissões
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure as permissões de cada role do sistema
          </p>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Administradores sempre têm acesso total. Alterações nas permissões afetam todos os usuários com a role selecionada.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Configurar Permissões por Role</CardTitle>
            <CardDescription>
              Selecione uma role e configure suas permissões
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AppRole)}>
                <TabsList className="mb-6">
                  {(['admin', 'rh', 'gestor'] as AppRole[]).map((role) => (
                    <TabsTrigger key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {(['admin', 'rh', 'gestor'] as AppRole[]).map((role) => (
                  <TabsContent key={role} value={role}>
                    <div className="space-y-6">
                      {groupedPermissions && Object.entries(groupedPermissions).map(([module, perms]) => (
                        <div key={module} className="space-y-2">
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            {MODULE_LABELS[module] || module}
                            <Badge variant="secondary" className="text-xs">
                              {perms.filter(p => hasPermission(role, p.id)).length}/{perms.length}
                            </Badge>
                          </h3>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="w-[50px]">Ativo</TableHead>
                                <TableHead>Permissão</TableHead>
                                <TableHead>Descrição</TableHead>
                                <TableHead>Ação</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {perms.map((perm) => {
                                const isEnabled = hasPermission(role, perm.id);
                                const isAdminRole = role === 'admin';
                                
                                return (
                                  <TableRow key={perm.id}>
                                    <TableCell>
                                      {isAdminRole ? (
                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                      ) : (
                                        <Checkbox
                                          checked={isEnabled}
                                          onCheckedChange={(checked) => {
                                            togglePermissionMutation.mutate({
                                              role,
                                              permissionId: perm.id,
                                              enabled: checked === true,
                                            });
                                          }}
                                          disabled={togglePermissionMutation.isPending}
                                        />
                                      )}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm">{perm.name}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                      {perm.description || '-'}
                                    </TableCell>
                                    <TableCell>
                                      <Badge variant="outline">{perm.action}</Badge>
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
