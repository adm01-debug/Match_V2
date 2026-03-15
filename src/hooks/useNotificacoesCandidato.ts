/**
 * @module useNotificacoesCandidato
 * @description Hook for candidate portal notifications with realtime
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCandidatoAuth } from '@/contexts/CandidatoAuthContext';

interface NotificacaoCandidato {
  id: string;
  candidato_auth_id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  link: string | null;
  created_at: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export function useNotificacoesCandidato() {
  const queryClient = useQueryClient();
  const { profile } = useCandidatoAuth();

  const { data: notificacoes = [], isLoading } = useQuery({
    queryKey: ['notificacoes-candidato', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      const { data, error } = await db
        .from('notificacoes_candidato')
        .select('*')
        .eq('candidato_auth_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return (data || []) as NotificacaoCandidato[];
    },
    enabled: !!profile?.id,
    staleTime: 30 * 1000,
  });

  // Realtime subscription
  useEffect(() => {
    if (!profile?.id) return;

    const channel = supabase
      .channel('notificacoes-candidato-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notificacoes_candidato',
          filter: `candidato_auth_id=eq.${profile.id}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['notificacoes-candidato'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id, queryClient]);

  const marcarLida = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db
        .from('notificacoes_candidato')
        .update({ lida: true })
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes-candidato'] });
    },
  });

  const marcarTodasLidas = useMutation({
    mutationFn: async () => {
      if (!profile?.id) return;
      const { error } = await db
        .from('notificacoes_candidato')
        .update({ lida: true })
        .eq('candidato_auth_id', profile.id)
        .eq('lida', false);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes-candidato'] });
    },
  });

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  return {
    notificacoes,
    isLoading,
    naoLidas,
    marcarLida: marcarLida.mutateAsync,
    marcarTodasLidas: marcarTodasLidas.mutateAsync,
  };
}
