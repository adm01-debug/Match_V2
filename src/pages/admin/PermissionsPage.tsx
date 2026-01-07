/**
 * @page PermissionsPage
 * @description Página de gestão de permissões granulares
 */
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  Users, 
  Save, 
  Loader2, 
  RefreshCw,
  Info
} from 'lucide-react';
import { toast } from 'sonner';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import type { AppRole } from '@/contexts/AuthContext';

interface Permission {
  id: string;
  module: string;
  action: string;
  name: string;
  description: string | null;
}

interface RolePermission {
  id: string;
  role: AppRole;
  permission_id: string;
}

const ROLE_LABELS: Record<AppRole, { label: string; description: string; color: string }> = {
  admin: { 
    label: 'Administrador', 
    description: 'Acesso total ao sistema',
    color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
  },
  rh: { 
    label: 'RH', 
    description: 'Gestão de recrutamento e seleção',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
  },
  gestor: { 
    label: 'Gestor', 
    description: 'Acesso limitado para gestores de área',
    color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
  },
};

const MODULE_LABELS: Record<string, string> = {
  vagas: 'Vagas',
  candidatos: 'Candidatos',
  processos: 'Processos Seletivos',
  entrevistas: 'Entrevistas',
  provas: 'Provas',
  relatorios: 'Relatórios',
  indicacoes: 'Indicações',
  comunicacoes: 'Comunicações',
  configuracoes: 'Configurações',
  usuarios: 'Usuários',
  seguranca: 'Segurança',
};

function PermissionsContent() {
  const queryClient = useQueryClient();
  const [selectedRole, setSelectedRole] = useState<AppRole>('rh');
  const [pendingChanges, setPendingChanges] = useState<Map<string, boolean>>(new Map());
  const [isSaving, setIsSaving] = useState(false);

  // Fetch all permissions
  const { data: permissions = [], isLoading: loadingPermissions } = useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('module')
        .order('action');
      if (error) throw error;
      return data as Permission[];
    },
  });

  // Fetch role permissions
  const { data: rolePermissions = [], isLoading: loadingRolePermissions } = useQuery({
    queryKey: ['role_permissions', selectedRole],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*')
        .eq('role', selectedRole);
      if (error) throw error;
      return data as RolePermission[];
    },
  });

  // Reset pending changes when role changes
  useEffect(() => {
    setPendingChanges(new Map());
  }, [selectedRole]);

  // Check if permission is enabled
  const isPermissionEnabled = (permissionId: string): boolean => {
    if (pendingChanges.has(permissionId)) {
      return pendingChanges.get(permissionId)!;
    }
    return rolePermissions.some(rp => rp.permission_id === permissionId);
  };

  // Toggle permission
  const togglePermission = (permissionId: string) => {
    const currentValue = isPermissionEnabled(permissionId);
    const originalValue = rolePermissions.some(rp => rp.permission_id === permissionId);
    
    setPendingChanges(prev => {
      const next = new Map(prev);
      if (!currentValue === originalValue) {
        next.delete(permissionId);
      } else {
        next.set(permissionId, !currentValue);
      }
      return next;
    });
  };

  // Save changes
  const saveChanges = async () => {
    if (pendingChanges.size === 0) return;

    setIsSaving(true);
    try {
      const toAdd: string[] = [];
      const toRemove: string[] = [];

      pendingChanges.forEach((enabled, permissionId) => {
        if (enabled) {
          toAdd.push(permissionId);
        } else {
          toRemove.push(permissionId);
        }
      });

      // Remove permissions
      if (toRemove.length > 0) {
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role', selectedRole)
          .in('permission_id', toRemove);
        if (error) throw error;
      }

      // Add permissions
      if (toAdd.length > 0) {
        const { error } = await supabase
          .from('role_permissions')
          .insert(toAdd.map(id => ({ role: selectedRole, permission_id: id })));
        if (error) throw error;
      }

      toast.success('Permissões atualizadas com sucesso');
      setPendingChanges(new Map());
      queryClient.invalidateQueries({ queryKey: ['role_permissions', selectedRole] });
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast.error('Erro ao salvar permissões');
    } finally {
      setIsSaving(false);
    }
  };

  // Group permissions by module
  const permissionsByModule = permissions.reduce((acc, p) => {
    if (!acc[p.module]) acc[p.module] = [];
    acc[p.module]!.push(p);
    return acc;
  }, {} as Record<string, Permission[]>);

  const isLoading = loadingPermissions || loadingRolePermissions;
  const hasChanges = pendingChanges.size > 0;

  return (
    <div className="container max-w-6xl py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Permissões Granulares
          </h1>
          <p className="text-muted-foreground mt-1">
            Configure as permissões de cada role no sistema
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['permissions'] })}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button
            onClick={saveChanges}
            disabled={!hasChanges || isSaving}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Salvar Alterações
            {hasChanges && (
              <Badge variant="secondary" className="ml-2">
                {pendingChanges.size}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Info Card */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium">Como funciona</p>
            <p className="text-muted-foreground mt-1">
              Cada role possui um conjunto de permissões. Selecione uma role abaixo 
              para configurar suas permissões. As mudanças só são aplicadas ao clicar em "Salvar Alterações".
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Role Selection */}
      <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as AppRole)}>
        <TabsList className="grid w-full grid-cols-3">
          {(Object.keys(ROLE_LABELS) as AppRole[]).map(role => (
            <TabsTrigger key={role} value={role} className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {ROLE_LABELS[role].label}
            </TabsTrigger>
          ))}
        </TabsList>

        {(Object.keys(ROLE_LABELS) as AppRole[]).map(role => (
          <TabsContent key={role} value={role} className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {ROLE_LABELS[role].label}
                      <Badge className={ROLE_LABELS[role].color}>
                        {rolePermissions.length + 
                          Array.from(pendingChanges.values()).filter(Boolean).length -
                          Array.from(pendingChanges.values()).filter(v => !v).length
                        } permissões
                      </Badge>
                    </CardTitle>
                    <CardDescription>
                      {ROLE_LABELS[role].description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <ScrollArea className="h-[500px] pr-4">
                    <div className="space-y-6">
                      {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                        <div key={module}>
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            {MODULE_LABELS[module] || module}
                            <Badge variant="outline" className="text-xs font-normal">
                              {modulePermissions.filter(p => isPermissionEnabled(p.id)).length}/{modulePermissions.length}
                            </Badge>
                          </h3>
                          <div className="grid gap-3">
                            {modulePermissions.map(permission => (
                              <label
                                key={permission.id}
                                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent cursor-pointer transition-colors"
                              >
                                <Checkbox
                                  checked={isPermissionEnabled(permission.id)}
                                  onCheckedChange={() => togglePermission(permission.id)}
                                  className="mt-0.5"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{permission.name}</span>
                                    {pendingChanges.has(permission.id) && (
                                      <Badge variant="secondary" className="text-xs">
                                        modificado
                                      </Badge>
                                    )}
                                  </div>
                                  {permission.description && (
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                      {permission.description}
                                    </p>
                                  )}
                                </div>
                              </label>
                            ))}
                          </div>
                          <Separator className="mt-4" />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

export default function PermissionsPage() {
  return (
    <PermissionGuard module="usuarios" action="roles">
      <PermissionsContent />
    </PermissionGuard>
  );
}
