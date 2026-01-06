/**
 * Hook para Talent Pool (localStorage-based)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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

interface PoolMember {
  pool_id: string;
  candidato_id: string;
}

function getPoolsStorageKey(): string {
  return 'talent_pools';
}

function getMembersStorageKey(): string {
  return 'talent_pool_members';
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useTalentPool() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [pools, setPools] = useState<TalentPool[]>([]);
  const [members, setMembers] = useState<PoolMember[]>([]);
  const [loadingPools, setLoadingPools] = useState(true);

  // Load pools from localStorage
  useEffect(() => {
    try {
      const storedPools = localStorage.getItem(getPoolsStorageKey());
      const storedMembers = localStorage.getItem(getMembersStorageKey());
      if (storedPools) setPools(JSON.parse(storedPools));
      if (storedMembers) setMembers(JSON.parse(storedMembers));
    } catch (e) {
      console.error('Error loading talent pools:', e);
    } finally {
      setLoadingPools(false);
    }
  }, []);

  const persistPools = useCallback((newPools: TalentPool[]) => {
    localStorage.setItem(getPoolsStorageKey(), JSON.stringify(newPools));
    setPools(newPools);
  }, []);

  const persistMembers = useCallback((newMembers: PoolMember[]) => {
    localStorage.setItem(getMembersStorageKey(), JSON.stringify(newMembers));
    setMembers(newMembers);
  }, []);

  // Load candidates from database
  const { data: candidates = [], isLoading: loadingCandidates } = useQuery({
    queryKey: ['talent-pool-candidates'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('candidatos')
          .select('id, nome, email, habilidades')
          .limit(100);
        
        if (error) return [];
        
        return (data || []).map((c) => ({ 
          id: c.id, 
          nome: c.nome, 
          email: c.email, 
          cargo: '', 
          tags: c.habilidades || [] 
        })) as PoolCandidate[];
      } catch {
        return [];
      }
    },
  });

  const tags = useMemo(() => {
    return [...new Set(candidates.flatMap(c => c.tags || []))];
  }, [candidates]);

  const createPool = useMutation({
    mutationFn: async (pool: { name: string; description: string }) => {
      const newPool: TalentPool = {
        id: generateId(),
        name: pool.name,
        description: pool.description,
        count: 0,
        created_at: new Date().toISOString(),
      };
      persistPools([newPool, ...pools]);
      return newPool;
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
      const exists = members.some(m => m.pool_id === poolId && m.candidato_id === candidatoId);
      if (exists) return;
      
      const newMembers = [...members, { pool_id: poolId, candidato_id: candidatoId }];
      persistMembers(newMembers);
      
      // Update pool count
      const newPools = pools.map(p => 
        p.id === poolId ? { ...p, count: p.count + 1 } : p
      );
      persistPools(newPools);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talent-pools'] });
      queryClient.invalidateQueries({ queryKey: ['talent-pool-candidates'] });
      toast({ title: 'Adicionado', description: 'Candidato adicionado ao pool.' });
    },
  });

  const removeFromPool = useMutation({
    mutationFn: async ({ poolId, candidatoId }: { poolId: string; candidatoId: string }) => {
      const newMembers = members.filter(m => 
        !(m.pool_id === poolId && m.candidato_id === candidatoId)
      );
      persistMembers(newMembers);
      
      // Update pool count
      const newPools = pools.map(p => 
        p.id === poolId ? { ...p, count: Math.max(0, p.count - 1) } : p
      );
      persistPools(newPools);
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
