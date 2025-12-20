import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNotifications } from '@/contexts/NotificationContext';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseRealtimeNotificationsOptions {
  enableMatchScores?: boolean;
  enableVagas?: boolean;
  enableProcessos?: boolean;
  enableEntrevistas?: boolean;
}

export function useRealtimeNotifications(options: UseRealtimeNotificationsOptions = {}) {
  const {
    enableMatchScores = true,
    enableVagas = true,
    enableProcessos = true,
    enableEntrevistas = true,
  } = options;

  const { addNotification } = useNotifications();
  const [isConnected, setIsConnected] = useState(false);
  const channelsRef = useRef<RealtimeChannel[]>([]);

  const setupSubscriptions = useCallback(() => {
    const channels: RealtimeChannel[] = [];

    // Match Scores - Notifica quando candidato tem match alto
    if (enableMatchScores) {
      const matchChannel = supabase
        .channel('match-scores-realtime')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'match_scores' },
          (payload) => {
            const score = payload.new as any;
            if (score.score_total >= 80) {
              addNotification({
                type: 'success',
                title: '🎯 Match Score Alto!',
                message: `Candidato com ${score.score_total}% de compatibilidade`,
                link: `/candidatos/${score.candidato_id}`,
              });
            }
          }
        )
        .subscribe((status) => {
          setIsConnected(status === 'SUBSCRIBED');
        });
      channels.push(matchChannel);
    }

    // Vagas - Notifica mudanças de status
    if (enableVagas) {
      const vagasChannel = supabase
        .channel('vagas-realtime')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'vagas' },
          (payload) => {
            const vaga = payload.new as any;
            const oldVaga = payload.old as any;

            if (oldVaga.status !== vaga.status) {
              if (vaga.status === 'publicada') {
                addNotification({
                  type: 'info',
                  title: '📢 Vaga Publicada',
                  message: `${vaga.titulo} está ativa`,
                  link: `/vagas/${vaga.id}`,
                });
              } else if (vaga.status === 'encerrada') {
                addNotification({
                  type: 'warning',
                  title: '🔒 Vaga Encerrada',
                  message: vaga.titulo,
                  link: `/vagas/${vaga.id}`,
                });
              }
            }
          }
        )
        .subscribe();
      channels.push(vagasChannel);
    }

    // Processos Seletivos - Notifica mudanças de etapa e status
    if (enableProcessos) {
      const processosChannel = supabase
        .channel('processos-realtime')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'processos_seletivos' },
          (payload) => {
            const processo = payload.new as any;
            const oldProcesso = payload.old as any;

            // Mudança de etapa
            if (oldProcesso.etapa_atual !== processo.etapa_atual) {
              addNotification({
                type: 'info',
                title: '📋 Pipeline Atualizado',
                message: `Candidato movido para ${processo.etapa_atual.replace(/_/g, ' ')}`,
                link: `/pipeline?processo=${processo.id}`,
              });
            }

            // Contratação
            if (processo.status === 'contratado' && oldProcesso.status !== 'contratado') {
              addNotification({
                type: 'success',
                title: '🎉 Nova Contratação!',
                message: 'Um candidato foi contratado',
                link: `/pipeline?processo=${processo.id}`,
              });
            }
          }
        )
        .subscribe();
      channels.push(processosChannel);
    }

    // Entrevistas - Notifica agendamentos e atualizações
    if (enableEntrevistas) {
      const entrevistasChannel = supabase
        .channel('entrevistas-realtime')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'entrevistas' },
          (payload) => {
            const entrevista = payload.new as any;

            if (payload.eventType === 'INSERT') {
              addNotification({
                type: 'info',
                title: '📅 Entrevista Agendada',
                message: `Nova entrevista ${entrevista.tipo}`,
                link: '/agenda',
              });
            } else if (payload.eventType === 'UPDATE') {
              const oldEntrevista = payload.old as any;

              if (entrevista.status === 'confirmada' && oldEntrevista.status !== 'confirmada') {
                addNotification({
                  type: 'success',
                  title: '✅ Entrevista Confirmada',
                  message: 'Candidato confirmou presença',
                  link: '/agenda',
                });
              } else if (entrevista.status === 'cancelada' && oldEntrevista.status !== 'cancelada') {
                addNotification({
                  type: 'warning',
                  title: '❌ Entrevista Cancelada',
                  message: 'Uma entrevista foi cancelada',
                  link: '/agenda',
                });
              } else if (entrevista.status === 'no_show' && oldEntrevista.status !== 'no_show') {
                addNotification({
                  type: 'error',
                  title: '⚠️ No-Show',
                  message: 'Candidato não compareceu',
                  link: '/agenda',
                });
              }
            }
          }
        )
        .subscribe();
      channels.push(entrevistasChannel);
    }

    channelsRef.current = channels;
  }, [enableMatchScores, enableVagas, enableProcessos, enableEntrevistas, addNotification]);

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
