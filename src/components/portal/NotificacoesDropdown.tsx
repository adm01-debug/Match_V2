/**
 * @module NotificacoesDropdown
 * @description Realtime notifications dropdown for candidate portal
 */

import { useNotificacoesCandidato } from '@/hooks/useNotificacoesCandidato';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, Check, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function NotificacoesDropdown() {
  const { notificacoes, naoLidas, marcarLida, marcarTodasLidas } = useNotificacoesCandidato();
  const navigate = useNavigate();

  const handleClick = async (id: string, link: string | null) => {
    await marcarLida(id);
    if (link) navigate(link);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {naoLidas > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-destructive text-destructive-foreground">
              {naoLidas > 9 ? '9+' : naoLidas}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {naoLidas > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2 text-xs"
              onClick={() => marcarTodasLidas()}
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Ler todas
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {notificacoes.length === 0 ? (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Nenhuma notificação
          </div>
        ) : (
          notificacoes.slice(0, 20).map((n) => (
            <DropdownMenuItem
              key={n.id}
              className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!n.lida ? 'bg-primary/5' : ''}`}
              onClick={() => handleClick(n.id, n.link)}
            >
              <div className="flex items-start gap-2 w-full">
                {!n.lida && <div className="h-2 w-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-tight">{n.titulo}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.mensagem}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ptBR })}
                  </p>
                </div>
                {n.lida && <Check className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
              </div>
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default NotificacoesDropdown;
