import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useCandidateBehavioralResults(candidatoId?: string) {
  return useQuery({
    queryKey: ['behavioral-results', candidatoId],
    queryFn: async () => {
      if (!candidatoId) return null;
      const { data, error } = await supabase
        .from('avaliacoes_comportamentais_resultados')
        .select('*')
        .eq('candidato_id', candidatoId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!candidatoId,
  });
}

export function useAllBehavioralResults(filters?: {
  status?: string;
  vagaId?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['behavioral-results-all', filters],
    queryFn: async () => {
      let query = supabase
        .from('avaliacoes_comportamentais_resultados')
        .select(`
          *,
          candidatos:candidato_id(id, nome, email),
          vagas:vaga_id(id, titulo),
          processos_seletivos:processo_id(id, etapa_atual)
        `)
        .order('created_at', { ascending: false });

      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.vagaId) query = query.eq('vaga_id', filters.vagaId);
      if (filters?.limit) query = query.limit(filters.limit);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}
