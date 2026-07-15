/**
 * @module useRealtimeNotifications
 * @description Hook para notificações em tempo real via Supabase com persistência
 */
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/services/logger';

export type NotificationType =
  | 'high_match'
  | 'stage_change'
  | 'new_candidate'
  | 'urgent'
  | 'interview_scheduled'
  | 'interview_updated'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
  matchScore?: number;
}

interface DatabaseNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  link: string | null;
  match_score: number | null;
  read: boolean;
  created_at: string;
}

interface MatchScorePayload {
  candidato_id: string;
  score_total?: number;
}

interface VagaPayload {
  id: string;
  titulo: string;
  status?: string;
}

interface ProcessoPayload {
  candidato_nome: string;
  etapa_atual?: string;
}

interface EntrevistaPayload {
  candidato_nome: string;
  tipo: string;
  status?: string;
}

interface UseRealtimeNotificationsOptions {
  enableMatchScores?: boolean;
  enableVagas?: boolean;
  enableProcessos?: boolean;
  enableEntrevistas?: boolean;
}

const mapDbToNotification = (dbNotif: DatabaseNotification): Notification => ({
  id: dbNotif.id,
  type: dbNotif.type as NotificationType,
  title: dbNotif.title,
  message: dbNotif.message,
  timestamp: new Date(dbNotif.created_at),
  read: dbNotif.read,
  link: dbNotif.link || undefined,
  matchScore: dbNotif.match_score || undefined,
});

export function useRealtimeNotifications(options: UseRealtimeNotificationsOptions = {}) {
  const {
    enableMatchScores = true,
    enableVagas = true,
    enableProcessos = true,
    enableEntrevistas = true,
  } = options;

  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const channelsRef = useRef<RealtimeChannel[]>([]);

  // Fetch initial notifications from database
  const fetchNotifications = useCallback(async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        logger.error('[useRealtimeNotifications] fetch failed', { error: error.message });
        return;
      }

      if (data) {
        setNotifications(data.map(mapDbToNotification));
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Add notification to local state and optionally to database
  const addNotification = useCallback(async (
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>,
    persist = false
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50));

    // Persist to database if requested and user is authenticated
    if (persist && user?.id) {
      const { error } = await supabase.from('notifications').insert({
        user_id: user.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        link: notification.link || null,
        match_score: notification.matchScore || null,
      });

      if (error) {
        logger.error('[useRealtimeNotifications] persist failed', { error: error.message });
      }
    }
  }, [user?.id]);

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );

    // Update in database
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      logger.error('[useRealtimeNotifications] markAsRead failed', { error: error.message, id });
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    if (user?.id) {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) {
        logger.error('[useRealtimeNotifications] markAllAsRead failed', { error: error.message });
      }
    }
  }, [user?.id]);

  // Clear all notifications
  const clearAll = useCallback(async () => {
    setNotifications([]);

    if (user?.id) {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        logger.error('[useRealtimeNotifications] clearAll failed', { error: error.message });
      }
    }
  }, [user?.id]);

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Setup realtime subscriptions
  const setupSubscriptions = useCallback(() => {
    if (!user?.id) return;

    const channels: RealtimeChannel[] = [];

    // Listen for new notifications in the database
    const notificationsChannel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          const dbNotif = payload.new as DatabaseNotification;
          const notification = mapDbToNotification(dbNotif);
          
          // Add to local state if not already present
          setNotifications(prev => {
            if (prev.some(n => n.id === notification.id)) return prev;
            return [notification, ...prev].slice(0, 50);
          });
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });
    channels.push(notificationsChannel);

    // Match Scores - notifica quando candidato tem match alto
    if (enableMatchScores) {
      const matchChannel = supabase
        .channel('match-scores-realtime')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'match_scores' }, (payload) => {
          const score = payload.new as MatchScorePayload;
          const total = Number(score.score_total ?? 0);
          if (total >= 80) {
            addNotification({
              type: 'high_match',
              title: 'Match Score alto detectado!',
              message: `Candidato com ${total}% de compatibilidade para a vaga`,
              link: `/candidato/${score.candidato_id}`,
              matchScore: total,
            }, true);
          }
        })
        .subscribe();
      channels.push(matchChannel);
    }

    // Vagas - notifica mudanças relevantes
    if (enableVagas) {
      const vagasChannel = supabase
        .channel('vagas-realtime')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'vagas' }, (payload) => {
          const vaga = payload.new as VagaPayload;
          const oldVaga = payload.old as VagaPayload;

          if (oldVaga?.status !== vaga?.status && vaga?.status === 'publicada') {
            addNotification({
              type: 'urgent',
              title: 'Nova vaga publicada',
              message: `A vaga "${vaga.titulo}" está ativa e recebendo candidaturas`,
              link: `/vagas/${vaga.id}`,
            }, true);
          }
        })
        .subscribe();
      channels.push(vagasChannel);
    }

    // Processos seletivos - mudança de etapa
    if (enableProcessos) {
      const processosChannel = supabase
        .channel('processos-realtime')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'processos_seletivos' }, (payload) => {
          const processo = payload.new as ProcessoPayload;
          const oldProcesso = payload.old as ProcessoPayload;

          if (oldProcesso?.etapa_atual !== processo?.etapa_atual) {
            addNotification({
              type: 'stage_change',
              title: 'Pipeline atualizado',
              message: `${processo.candidato_nome} movido para "${String(processo.etapa_atual).replace(/_/g, ' ')}"`,
              link: `/pipeline`,
            }, true);
          }
        })
        .subscribe();
      channels.push(processosChannel);
    }

    // Entrevistas - agendamento/atualização
    if (enableEntrevistas) {
      const entrevistasChannel = supabase
        .channel('entrevistas-realtime')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'entrevistas' }, (payload) => {
          const entrevista = payload.new as EntrevistaPayload;

          if (payload.eventType === 'INSERT') {
            addNotification({
              type: 'interview_scheduled',
              title: 'Nova entrevista agendada',
              message: `Entrevista ${entrevista.tipo} com ${entrevista.candidato_nome}`,
              link: '/agenda',
            }, true);
          }

          if (payload.eventType === 'UPDATE') {
            const oldEntrevista = payload.old as EntrevistaPayload;
            if (oldEntrevista?.status !== entrevista?.status) {
              addNotification({
                type: 'interview_updated',
                title: 'Entrevista atualizada',
                message: `Status alterado para: ${entrevista.status}`,
                link: '/agenda',
              }, true);
            }
          }
        })
        .subscribe();
      channels.push(entrevistasChannel);
    }

    channelsRef.current = channels;
  }, [user?.id, enableMatchScores, enableVagas, enableProcessos, enableEntrevistas, addNotification]);

  const cleanup = useCallback(() => {
    channelsRef.current.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    channelsRef.current = [];
    setIsConnected(false);
  }, []);

  const reconnect = useCallback(() => {
    cleanup();
    setupSubscriptions();
  }, [cleanup, setupSubscriptions]);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Setup subscriptions
  useEffect(() => {
    setupSubscriptions();
    return cleanup;
  }, [setupSubscriptions, cleanup]);

  return {
    notifications,
    unreadCount,
    isConnected,
    isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    reconnect,
    refetch: fetchNotifications,
  };
}

export default useRealtimeNotifications;

