import { Card, CardContent } from '@/components/ui/card';
import { Users, Shield, UserCog } from 'lucide-react';

interface AdminStatsCardsProps {
  total: number;
  admins: number;
  rh: number;
  gestores: number;
}

export function AdminStatsCards({ total, admins, rh, gestores }: AdminStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-muted">
            <Users className="h-5 w-5 text-foreground" />
          </div>
          <div>
            <p className="text-2xl font-bold">{total}</p>
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
            <p className="text-2xl font-bold">{admins}</p>
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
            <p className="text-2xl font-bold">{rh}</p>
            <p className="text-sm text-muted-foreground">Equipe RH</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-warning/10">
            <UserCog className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold">{gestores}</p>
            <p className="text-sm text-muted-foreground">Gestores</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
