import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CandidatoDBRow {
  id: string;
  nome: string;
  email: string;
  cargo_atual: string | null;
  tags: string[] | null;
}


interface TalentPool { 
  id: string; 
  name: string; 
  description: string; 
  count: number; 
  created_at: string; 
}

interface PoolCandidate { 
  id: string; 
  nome: string; 
  email: string; 
  cargo?: string; 
  tags?: string[]; 
  pool_ids?: string[]; 
}

export function useTalentPool() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pools = [], isLoading: loadingPools } = useQuery({
    queryKey: ['talent-pools'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('talent_pools')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) {
          // console.warn('talent_pools table may not exist:', error.message);
          return [];
        }
        return (data || []) as TalentPool[];
      } catch (e) {
        // console.warn('Error loading talent pools:', e);
        return [];
      }
    },
  });

  const { data: candidates = [], isLoading: loadingCandidates } = useQuery({
    queryKey: ['talent-pool-candidates'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('candidatos')
          .select('id, nome, email, cargo_atual, tags')
          .limit(100);
        
        if (error) {
          // console.warn('Error loading candidates:', error.message);
          return [];
        }
        return (data || []).map((c: CandidatoDBRow) => ({ 
          id: c.id, 
          nome: c.nome, 
          email: c.email, 
          cargo: c.cargo_atual, 
          tags: c.tags || [] 
        })) as PoolCandidate[];
      } catch (e) {
        // console.warn('Error loading candidates:', e);
        return [];
      }
    },
  });

  const tags = [...new Set(candidates.flatMap(c => c.tags || []))];

  const createPool = useMutation({
    mutationFn: async (pool: { name: string; description: string }) => {
      const { data, error } = await supabase
        .from('talent_pools')
        .insert(pool)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talent-pools'] });
      toast({ title: 'Pool criado', description: 'Novo pool de talentos criado com sucesso.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Erro', description: error.message || 'Erro ao criar pool', variant: 'destructive' });
    },
  });

  const addToPool = useMutation({
    mutationFn: async ({ poolId, candidatoId }: { poolId: string; candidatoId: string }) => {
      const { error } = await supabase
        .from('talent_pool_members')
        .insert({ pool_id: poolId, candidato_id: candidatoId });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talent-pools'] });
      queryClient.invalidateQueries({ queryKey: ['talent-pool-candidates'] });
      toast({ title: 'Adicionado', description: 'Candidato adicionado ao pool.' });
    },
  });

  const removeFromPool = useMutation({
    mutationFn: async ({ poolId, candidatoId }: { poolId: string; candidatoId: string }) => {
      const { error } = await supabase
        .from('talent_pool_members')
        .delete()
        .eq('pool_id', poolId)
        .eq('candidato_id', candidatoId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talent-pools'] });
      toast({ title: 'Removido', description: 'Candidato removido do pool.' });
    },
  });

  return {
    pools,
    candidates,
    tags,
    isLoading: loadingPools || loadingCandidates,
    createPool: createPool.mutate,
    addToPool: addToPool.mutate,
    removeFromPool: removeFromPool.mutate,
  };
}

export default useTalentPool;


