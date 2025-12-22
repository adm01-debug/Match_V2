import { useMemo,  memo  } from 'react';
import { Bell, Check, CheckCheck, Star, Users, ArrowRight, Trash2, X, Calendar, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Notification } from '@/hooks/useRealtimeNotifications';

interface NotificationPanelProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'high_match':
      return <Star className="h-4 w-4 text-yellow-500" />;
    case 'stage_change':
      return <ArrowRight className="h-4 w-4 text-primary" />;
    case 'new_candidate':
      return <Users className="h-4 w-4 text-blue-500" />;
    case 'urgent':
      return <Bell className="h-4 w-4 text-destructive" />;
    case 'interview_scheduled':
      return <Calendar className="h-4 w-4 text-green-500" />;
    case 'interview_updated':
      return <RefreshCw className="h-4 w-4 text-orange-500" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getNotificationColor = (type: Notification['type']) => {
  switch (type) {
    case 'high_match':
      return 'bg-yellow-500/10 border-yellow-500/20';
    case 'stage_change':
      return 'bg-primary/10 border-primary/20';
    case 'new_candidate':
      return 'bg-blue-500/10 border-blue-500/20';
    case 'urgent':
      return 'bg-destructive/10 border-destructive/20';
    case 'interview_scheduled':
      return 'bg-green-500/10 border-green-500/20';
    case 'interview_updated':
      return 'bg-orange-500/10 border-orange-500/20';
    default:
      return 'bg-muted';
  }
};

export function NotificationPanel({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}: NotificationPanelProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div role="region" aria-label="Notificações" className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Notificações</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {unreadCount} novas
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="h-8 text-xs"
              >
                <CheckCheck className="h-3 w-3 mr-1" />
                Ler todas
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClearAll}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-sm">Nenhuma notificação</p>
              <p className="text-xs mt-1">
                Você receberá alertas sobre candidatos e mudanças de etapa aqui
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 transition-colors cursor-pointer hover:bg-muted/50',
                    !notification.read && 'bg-muted/30'
                  )}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        'flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center border',
                        getNotificationColor(notification.type)
                      )}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={cn(
                            'text-sm font-medium line-clamp-1',
                            !notification.read && 'text-foreground',
                            notification.read && 'text-muted-foreground'
                          )}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(notification.timestamp, {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                        {notification.matchScore && (
                          <Badge
                            variant="outline"
                            className={cn(
                              'text-xs',
                              notification.matchScore >= 80
                                ? 'bg-success/10 text-success border-success/20'
                                : notification.matchScore >= 60
                                ? 'bg-warning/10 text-warning border-warning/20'
                                : 'bg-muted'
                            )}
                          >
                            {notification.matchScore}% match
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-3 border-t bg-muted/30">
            <p className="text-xs text-center text-muted-foreground">
              Mostrando as últimas {notifications.length} notificações
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
