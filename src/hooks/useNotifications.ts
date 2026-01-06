/**
 * Hook para Sistema de Notificações
 * @module hooks/useNotifications
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

// Tipo simplificado baseado na tabela real do banco
export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  match_score: number | null;
  read: boolean;
  created_at: string;
}

interface UseNotificationsOptions {
  limit?: number;
  unreadOnly?: boolean;
  refreshInterval?: number;
  enableSound?: boolean;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  unreadNotifications: Notification[];
  notificationsByType: Record<string, Notification[]>;
  latestNotification: Notification | null;
}

export function useNotifications(
  options: UseNotificationsOptions = {}
): UseNotificationsReturn {
  const {
    limit = 50,
    unreadOnly = false,
    refreshInterval,
    enableSound = true
  } = options;

  const queryClient = useQueryClient();

  const {
    data: notifications,
    isLoading,
    error
  } = useQuery({
    queryKey: ['notifications', { limit, unreadOnly }],
    queryFn: async () => {
      let query = supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (unreadOnly) {
        query = query.eq('read', false);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as Notification[];
    },
    refetchInterval: refreshInterval,
    staleTime: 30000,
  });

  const { data: unreadCount } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    },
    refetchInterval: refreshInterval,
    staleTime: 10000,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error) => {
      console.error('Erro ao marcar como lida:', error);
      toast.error('Erro ao marcar notificação como lida');
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Não autenticado');

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Todas as notificações marcadas como lidas');
    },
    onError: (error) => {
      console.error('Erro ao marcar todas:', error);
      toast.error('Erro ao marcar todas como lidas');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Notificação removida');
    },
    onError: (error) => {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao remover notificação');
    },
  });

  useEffect(() => {
    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const channel = supabase
        .channel('notifications-realtime')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });

            const notif = payload.new as Notification;
            toast.info(notif.title, {
              description: notif.message,
              duration: 5000,
            });

            if (enableSound) {
              playNotificationSound();
            }
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`,
          },
          () => {
            queryClient.invalidateQueries({ queryKey: ['notifications'] });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    setupRealtime();
  }, [queryClient, enableSound]);

  const unreadNotifications = useMemo(() => {
    return (notifications || []).filter(n => !n.read);
  }, [notifications]);

  const notificationsByType = useMemo(() => {
    const grouped: Record<string, Notification[]> = {};
    (notifications || []).forEach(notif => {
      const type = notif.type || 'info';
      if (!grouped[type]) {
        grouped[type] = [];
      }
      grouped[type].push(notif);
    });
    return grouped;
  }, [notifications]);

  const latestNotification = useMemo((): Notification | null => {
    if (!notifications || notifications.length === 0) return null;
    return notifications[0] ?? null;
  }, [notifications]);

  const markAsRead = useCallback((id: string) => {
    markAsReadMutation.mutate(id);
  }, [markAsReadMutation]);

  const markAllAsRead = useCallback(() => {
    markAllAsReadMutation.mutate();
  }, [markAllAsReadMutation]);

  const deleteNotification = useCallback((id: string) => {
    deleteMutation.mutate(id);
  }, [deleteMutation]);

  return {
    notifications: notifications || [],
    unreadCount: unreadCount || 0,
    isLoading,
    error: error as Error | null,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    unreadNotifications,
    notificationsByType,
    latestNotification,
  };
}

function playNotificationSound() {
  try {
    const audio = new Audio('/sounds/notification.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {
      // Ignorar se autoplay bloqueado
    });
  } catch (error) {
    console.error('Erro ao tocar som:', error);
  }
}

export function useUnreadCount() {
  const { data: count } = useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });

  return count || 0;
}
