/**
 * @module useRealtimeNotifications
 * @description Hook para notificações em tempo real via Supabase
 * @returns Hook state and methods
 * @example
 * const result = useRealtimeNotifications();
 */
import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export type NotificationType =
  | 'high_match'
  | 'stage_change'
  | 'new_candidate'
  | 'urgent'
  | 'interview_scheduled'
  | 'interview_updated';

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

interface UseRealtimeNotificationsOptions {
  enableMatchScores?: boolean;
  enableVagas?: boolean;
  enableProcessos?: boolean;
  enableEntrevistas?: boolean;
  onNotification?: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
}

export function useRealtimeNotifications(options: UseRealtimeNotificationsOptions = {}) {
  const {
    enableMatchScores = true,
    enableVagas = true,
    enableProcessos = true,
    enableEntrevistas = true,
    onNotification,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const channelsRef = useRef<RealtimeChannel[]>([]);

  const emit = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      onNotification?.(notification);
    },
    [onNotification]
  );

  const setupSubscriptions = useCallback(() => {
    const channels: RealtimeChannel[] = [];

    // Match Scores - notifica quando candidato tem match alto
    if (enableMatchScores) {
      const matchChannel = supabase
        .channel('match-scores-realtime')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'match_scores' }, (payload) => {
          const score = payload.new as any;
          const total = Number(score.score_total ?? score.scoreTotal ?? 0);
          if (total >= 80) {
            emit({
              type: 'high_match',
              title: 'Match Score alto',
              message: `Candidato com ${total}% de compatibilidade`,
              link: `/candidato/${score.candidato_id}`,
              matchScore: total,
            });
          }
        })
        .subscribe((status) => {
          setIsConnected(status === 'SUBSCRIBED');
        });
      channels.push(matchChannel);
    }

    // Vagas - notifica mudanças relevantes
    if (enableVagas) {
      const vagasChannel = supabase
        .channel('vagas-realtime')
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'vagas' }, (payload) => {
          const vaga = payload.new as any;
          const oldVaga = payload.old as any;

          if (oldVaga?.status !== vaga?.status && vaga?.status === 'publicada') {
            emit({
              type: 'urgent',
              title: 'Vaga publicada',
              message: `${vaga.titulo} está ativa`,
              link: `/vagas/${vaga.id}`,
            });
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
          const processo = payload.new as any;
          const oldProcesso = payload.old as any;

          if (oldProcesso?.etapa_atual !== processo?.etapa_atual) {
            emit({
              type: 'stage_change',
              title: 'Pipeline atualizado',
              message: `Candidato movido para ${String(processo.etapa_atual).replace(/_/g, ' ')}`,
              link: `/pipeline?processo=${processo.id}`,
            });
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
          const entrevista = payload.new as any;

          if (payload.eventType === 'INSERT') {
            emit({
              type: 'interview_scheduled',
              title: 'Entrevista agendada',
              message: `Nova entrevista (${entrevista.tipo})`,
              link: '/agenda',
            });
          }

          if (payload.eventType === 'UPDATE') {
            emit({
              type: 'interview_updated',
              title: 'Entrevista atualizada',
              message: `Status: ${entrevista.status}`,
              link: '/agenda',
            });
          }
        })
        .subscribe();
      channels.push(entrevistasChannel);
    }

    channelsRef.current = channels;
  }, [enableMatchScores, enableVagas, enableProcessos, enableEntrevistas, emit]);

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

  useEffect(() => {
    setupSubscriptions();
    return cleanup;
  }, [setupSubscriptions, cleanup]);

  return {
    isConnected,
    reconnect,
  };
}

export default useRealtimeNotifications;

