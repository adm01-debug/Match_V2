import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { AppRole } from '@/contexts/AuthContext';
import {
  allRoles,
  roleColors,
  roleDescriptions,
  roleLabels,
  type UserProfile,
} from './adminRolesConfig';

interface EditRolesDialogProps {
  user: UserProfile | null;
  onClose: () => void;
  onSave: (user: UserProfile, roles: AppRole[]) => Promise<void>;
}

export function EditRolesDialog({ user, onClose, onSave }: EditRolesDialogProps) {
  const [editingRoles, setEditingRoles] = useState<AppRole[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setEditingRoles([...user.roles]);
  }, [user]);

  const toggleRole = (role: AppRole) => {
    setEditingRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await onSave(user, editingRoles);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Permissões</DialogTitle>
          <DialogDescription>Selecione as roles para {user?.nome}</DialogDescription>
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
          <p className="text-sm text-warning bg-warning/10 p-3 rounded-lg">
            Atenção: O usuário ficará sem nenhuma permissão e não poderá acessar o sistema.
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving}>
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
  );
}
