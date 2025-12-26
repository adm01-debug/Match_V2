import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TalentPool { id: string; name: string; description: string; count: number; created_at: string; }
interface PoolCandidate { id: string; nome: string; email: string; cargo?: string; tags?: string[]; pool_ids?: string[]; }

export function useTalentPool() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pools = [], isLoading: loadingPools } = useQuery({
    queryKey: ['talent-pools'],
    queryFn: async () => {
      const { data } = await supabase.from('talent_pools').select('*, talent_pool_members(count)').order('created_at', { ascending: false });
      return (data || []).map((p: any) => ({ ...p, count: p.talent_pool_members?.[0]?.count || 0 })) as TalentPool[];
    },
  });

  const { data: candidates = [], isLoading: loadingCandidates } = useQuery({
    queryKey: ['talent-pool-candidates'],
    queryFn: async () => {
      const { data } = await supabase.from('candidatos').select('id, nome, email, cargo_atual, tags').eq('in_talent_pool', true);
      return (data || []).map((c: any) => ({ id: c.id, nome: c.nome, email: c.email, cargo: c.cargo_atual, tags: c.tags })) as PoolCandidate[];
    },
  });

  const tags = [...new Set(candidates.flatMap(c => c.tags || []))];

  const createPool = useMutation({
    mutationFn: async (pool: { name: string; description: string }) => {
      const { data, error } = await supabase.from('talent_pools').insert(pool).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talent-pools'] });
      toast({ title: 'Pool criado', description: 'Novo pool de talentos criado com sucesso.' });
    },
  });

  const addToPool = useMutation({
    mutationFn: async ({ poolId, candidatoId }: { poolId: string; candidatoId: string }) => {
      const { error } = await supabase.from('talent_pool_members').insert({ pool_id: poolId, candidato_id: candidatoId });
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
      const { error } = await supabase.from('talent_pool_members').delete().eq('pool_id', poolId).eq('candidato_id', candidatoId);
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
