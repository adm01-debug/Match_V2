import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Candidatura {
  id: string;
  candidato_id: string;
  vaga_id: string;
  status: 'pendente' | 'em_analise' | 'aprovada' | 'rejeitada';
  data_candidatura: string;
  carta_apresentacao: string | null;
  pretensao_salarial: number | null;
  disponibilidade: string | null;
  created_at: string;
  candidato?: { nome: string; email: string; foto_url: string | null } | null;
  vaga?: { titulo: string; departamento: string } | null;
}

interface CandidaturaInsert {
  candidato_id: string;
  vaga_id: string;
  carta_apresentacao?: string;
  pretensao_salarial?: number;
  disponibilidade?: string;
}

export function useCandidaturas(filtros?: { vagaId?: string; candidatoId?: string; status?: string }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: candidaturas = [], isLoading, error } = useQuery({
    queryKey: ['candidaturas', filtros],
    queryFn: async () => {
      let query = supabase
        .from('candidaturas')
        .select(`*, candidato:candidatos(nome, email, foto_url), vaga:vagas(titulo, departamento)`)
        .order('created_at', { ascending: false });
      if (filtros?.vagaId) query = query.eq('vaga_id', filtros.vagaId);
      if (filtros?.candidatoId) query = query.eq('candidato_id', filtros.candidatoId);
      if (filtros?.status) query = query.eq('status', filtros.status);
      const { data, error } = await query;
      if (error) throw error;
      return data as Candidatura[];
    },
  });

  const createCandidatura = useMutation({
    mutationFn: async (dados: CandidaturaInsert) => {
      const { data, error } = await supabase
        .from('candidaturas')
        .insert({ ...dados, status: 'pendente', data_candidatura: new Date().toISOString() })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidaturas'] });
      toast({ title: 'Candidatura registrada!' });
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Candidatura['status'] }) => {
      const { data, error } = await supabase.from('candidaturas').update({ status }).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidaturas'] });
      toast({ title: 'Status atualizado!' });
    },
  });

  const stats = {
    total: candidaturas.length,
    pendentes: candidaturas.filter(c => c.status === 'pendente').length,
    emAnalise: candidaturas.filter(c => c.status === 'em_analise').length,
    aprovadas: candidaturas.filter(c => c.status === 'aprovada').length,
    rejeitadas: candidaturas.filter(c => c.status === 'rejeitada').length,
  };

  return {
    candidaturas,
    isLoading,
    error,
    stats,
    createCandidatura: createCandidatura.mutateAsync,
    updateStatus: updateStatus.mutateAsync,
  };
}

export default useCandidaturas;
