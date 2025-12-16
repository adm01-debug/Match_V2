import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  type: 'high_match' | 'stage_change' | 'new_candidate' | 'urgent';
  title: string;
  message: string;
  candidatoNome?: string;
  matchScore?: number;
  etapa?: string;
  timestamp: Date;
  read: boolean;
}

export function useRealtimeNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Add a new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep max 50 notifications
    setUnreadCount(prev => prev + 1);

    // Show toast for immediate feedback
    toast({
      title: notification.title,
      description: notification.message,
    });
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id && !n.read ? { ...n, read: true } : n))
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Subscribe to match_scores table for high score candidates
  useEffect(() => {
    console.log('Setting up realtime notifications...');

    const channel = supabase
      .channel('match-scores-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'match_scores',
        },
        (payload) => {
          console.log('New match score received:', payload);
          const newScore = payload.new as {
            score_total: number;
            vaga_titulo: string;
            candidato_id: string;
            recomendacao: string;
          };

          // Notify for high match scores (>= 80%)
          if (newScore.score_total >= 80) {
            addNotification({
              type: 'high_match',
              title: '⭐ Candidato com Alto Match!',
              message: `Novo candidato com ${newScore.score_total}% de compatibilidade para ${newScore.vaga_titulo}`,
              matchScore: newScore.score_total,
            });
          }

          // Also notify for any new candidate analysis
          if (newScore.score_total < 80 && newScore.score_total >= 60) {
            addNotification({
              type: 'new_candidate',
              title: 'Novo Candidato Analisado',
              message: `Candidato analisado para ${newScore.vaga_titulo} com ${newScore.score_total}% de match`,
              matchScore: newScore.score_total,
            });
          }
        }
      )
      .subscribe((status) => {
        console.log('Realtime subscription status:', status);
      });

    return () => {
      console.log('Cleaning up realtime subscription...');
      supabase.removeChannel(channel);
    };
  }, [addNotification]);

  // Simulate pipeline stage changes (since pipeline is mocked)
  // In production, this would also be a Supabase realtime subscription
  const notifyStageChange = useCallback((candidatoNome: string, fromEtapa: string, toEtapa: string) => {
    addNotification({
      type: 'stage_change',
      title: '📋 Mudança de Etapa',
      message: `${candidatoNome} movido de ${fromEtapa} para ${toEtapa}`,
      candidatoNome,
      etapa: toEtapa,
    });
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    notifyStageChange,
  };
}
