import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldAlert, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { Session, User as SupaUser } from '@supabase/supabase-js';

interface Props {
  user: SupaUser | null;
  session: Session | null;
}

export const AuthStatusCard = ({ user, session }: Props) => {
  const navigate = useNavigate();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Status de Autenticação
        </CardTitle>
      </CardHeader>
      <CardContent>
        {user ? (
          <Alert className="border-success/50 bg-success/5">
            <CheckCircle2 className="h-4 w-4 text-success" />
            <AlertTitle className="text-success">Autenticado</AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-1 text-sm">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Token válido:</strong> {session?.access_token ? 'Sim' : 'Não'}</p>
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="border-warning/50 bg-warning/5">
            <ShieldAlert className="h-4 w-4 text-warning" />
            <AlertTitle className="text-warning">Não Autenticado</AlertTitle>
            <AlertDescription>
              <p className="mt-2">Você precisa fazer login para testar as funções protegidas.</p>
              <Button className="mt-3" size="sm" onClick={() => navigate('/auth')}>
                Fazer Login
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
