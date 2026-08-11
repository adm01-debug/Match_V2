import { Loader2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { HighlightMatch } from '@/components/ui/highlight-match';
import { roleColors, roleLabels, type UserProfile } from './adminRolesConfig';

interface AdminUsersTableProps {
  loading: boolean;
  users: UserProfile[];
  searchTerm: string;
  currentUserId?: string;
  getMatchIndicesFor: (userId: string, key: string) => ReadonlyArray<[number, number]> | undefined;
  onEdit: (user: UserProfile) => void;
}

const getInitials = (nome: string) =>
  nome.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();

export function AdminUsersTable({
  loading,
  users,
  searchTerm,
  currentUserId,
  getMatchIndicesFor,
  onEdit,
}: AdminUsersTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
      </div>
    );
  }

  return (
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
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(u.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      <HighlightMatch text={u.nome} indices={getMatchIndicesFor(u.id, 'nome')} />
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <HighlightMatch text={u.email} indices={getMatchIndicesFor(u.id, 'email')} />
                    </p>
                  </div>
                  {u.user_id === currentUserId && (
                    <Badge variant="outline" className="text-xs">Você</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex gap-1 flex-wrap">
                  {u.roles.length === 0 ? (
                    <span className="text-sm text-muted-foreground">Sem roles</span>
                  ) : (
                    u.roles.map((role) => (
                      <Badge key={role} variant="outline" className={roleColors[role]}>
                        {roleLabels[role]}
                      </Badge>
                    ))
                  )}
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {u.created_at ? new Date(u.created_at).toLocaleDateString('pt-BR') : '-'}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" onClick={() => onEdit(u)}>
                  Editar Roles
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
