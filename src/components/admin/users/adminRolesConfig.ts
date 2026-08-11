import type { AppRole } from '@/contexts/AuthContext';

export const allRoles: AppRole[] = ['admin', 'rh', 'gestor'];

export const roleLabels: Record<AppRole, string> = {
  admin: 'Administrador',
  rh: 'RH',
  gestor: 'Gestor',
};

export const roleColors: Record<AppRole, string> = {
  admin: 'bg-destructive/20 text-destructive border-destructive/30',
  rh: 'bg-primary/20 text-primary border-primary/30',
  gestor: 'bg-warning/20 text-warning border-warning/30',
};

export const roleDescriptions: Record<AppRole, string> = {
  admin: 'Acesso total ao sistema, pode gerenciar usuários e configurações',
  rh: 'Acesso a todas as funcionalidades de recrutamento',
  gestor: 'Acesso a vagas e candidatos do seu departamento',
};

export interface UserProfile {
  id: string;
  user_id: string;
  nome: string;
  email: string;
  created_at: string | null;
  roles: AppRole[];
}
