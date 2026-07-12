import { memo } from 'react';
import { Bell, CheckCheck, Star, Users, ArrowRight, Trash2, Calendar, RefreshCw, Wifi, WifiOff, Loader2 } from 'lucide-react';
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
import { Notification, NotificationType } from '@/hooks/useRealtimeNotifications';

interface NotificationPanelProps {
  notifications: Notification[];
  unreadCount: number;
  isConnected?: boolean;
  isLoading?: boolean;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onReconnect?: () => void;
}

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'high_match':
      return <Star className="h-4 w-4 text-warning" />;
    case 'stage_change':
      return <ArrowRight className="h-4 w-4 text-primary" />;
    case 'new_candidate':
      return <Users className="h-4 w-4 text-info" />;
    case 'urgent':
      return <Bell className="h-4 w-4 text-destructive" />;
    case 'interview_scheduled':
      return <Calendar className="h-4 w-4 text-success" />;
    case 'interview_updated':
      return <RefreshCw className="h-4 w-4 text-warning" />;
    case 'success':
      return <CheckCheck className="h-4 w-4 text-success" />;
    case 'warning':
      return <Bell className="h-4 w-4 text-warning" />;
    case 'error':
      return <Bell className="h-4 w-4 text-destructive" />;
    default:
      return <Bell className="h-4 w-4 text-muted-foreground" />;
  }
};

const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'high_match':
      return 'bg-warning/10 border-warning/20';
    case 'stage_change':
      return 'bg-primary/10 border-primary/20';
    case 'new_candidate':
      return 'bg-info/10 border-info/20';
    case 'urgent':
    case 'error':
      return 'bg-destructive/10 border-destructive/20';
    case 'interview_scheduled':
    case 'success':
      return 'bg-success/10 border-success/20';
    case 'interview_updated':
    case 'warning':
      return 'bg-warning/10 border-warning/20';
    default:
      return 'bg-muted border-border';
  }
};

function NotificationPanelComponent({
  notifications,
  unreadCount,
  isConnected = true,
  isLoading = false,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  onReconnect,
}: NotificationPanelProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 px-1 text-xs bg-destructive animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          {/* Connection indicator */}
          <span 
            className={cn(
              "absolute bottom-0 right-0 h-2 w-2 rounded-full border border-background",
              isConnected ? "bg-success" : "bg-muted-foreground"
            )}
            title={isConnected ? "Conectado em tempo real" : "Desconectado"}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div role="region" aria-label="Notificações" className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Notificações</h3>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {unreadCount} {unreadCount === 1 ? 'nova' : 'novas'}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {/* Connection status */}
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                isConnected ? "text-success" : "text-muted-foreground"
              )}
              onClick={onReconnect}
              title={isConnected ? "Conectado" : "Clique para reconectar"}
            >
              {isConnected ? (
                <Wifi className="h-4 w-4" />
              ) : (
                <WifiOff className="h-4 w-4" />
              )}
            </Button>
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
                title="Limpar todas"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-sm text-muted-foreground">Carregando notificações...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-sm font-medium">Nenhuma notificação</p>
              <p className="text-xs mt-1 text-center px-4">
                Você receberá alertas sobre candidatos, vagas e entrevistas aqui
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'p-4 transition-colors cursor-pointer hover:bg-muted/50',
                    !notification.read && 'bg-primary/5'
                  )}
                  onClick={() => onMarkAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <div
                      className={cn(
                        'flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center border',
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
                            !notification.read ? 'text-foreground' : 'text-muted-foreground'
                          )}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5 animate-pulse" />
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
              {isConnected ? (
                <span className="flex items-center justify-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-success" />
                  Atualizações em tempo real ativas
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                  Mostrando {notifications.length} notificações
                </span>
              )}
            </p>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export const NotificationPanel = memo(NotificationPanelComponent);
NotificationPanel.displayName = "NotificationPanel";
