/**
 * @module useHistoricoEtapas
 * @description Hook para visualizar histórico de mudanças de etapa no pipeline
 */

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface HistoricoEtapa {
  id: string;
  processo_id: string;
  etapa_anterior: string | null;
  etapa_nova: string;
  motivo: string | null;
  responsavel_id: string | null;
  created_at: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export function useHistoricoEtapas(processoId?: string) {
  const { data: historico = [], isLoading, error } = useQuery({
    queryKey: ['historico_etapas', processoId],
    queryFn: async () => {
      if (!processoId) return [];
      const { data, error: queryError } = await db
        .from('historico_etapas')
        .select('*')
        .eq('processo_id', processoId)
        .order('created_at', { ascending: false });
      if (queryError) throw queryError;
      return (data || []) as HistoricoEtapa[];
    },
    enabled: !!processoId,
  });

  return { historico, isLoading, error };
}
