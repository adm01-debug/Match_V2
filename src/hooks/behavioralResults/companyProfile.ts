import { logger } from '@/services/logger';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import type { CompanyBehavioralProfile } from './types';

export function useCompanyBehavioralProfiles(vagaId?: string) {
  return useQuery({
    queryKey: ['company-behavioral-profiles', vagaId],
    queryFn: async () => {
      let query = supabase
        .from('perfis_comportamentais_empresa')
        .select('*')
        .eq('ativo', true)
        .order('created_at', { ascending: false });

      if (vagaId) query = query.eq('vaga_id', vagaId);

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveCompanyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: CompanyBehavioralProfile) => {
      const payload = {
        vaga_id: profile.vaga_id,
        nome: profile.nome,
        descricao: profile.descricao,
        peso_resiliencia: profile.peso_resiliencia,
        peso_integridade: profile.peso_integridade,
        peso_colaboracao: profile.peso_colaboracao,
        peso_lideranca: profile.peso_lideranca,
        peso_adaptabilidade: profile.peso_adaptabilidade,
        peso_proatividade: profile.peso_proatividade,
        peso_comunicacao: profile.peso_comunicacao,
        peso_pensamento_critico: profile.peso_pensamento_critico,
        peso_inteligencia_emocional: profile.peso_inteligencia_emocional,
        peso_orientacao_resultados: profile.peso_orientacao_resultados,
        dealbreakers: profile.dealbreakers as unknown as Json,
        dimensoes_culturais: profile.dimensoes_culturais as unknown as Json,
        ativo: profile.ativo ?? true,
      };

      const query = profile.id
        ? supabase.from('perfis_comportamentais_empresa').update(payload).eq('id', profile.id)
        : supabase.from('perfis_comportamentais_empresa').insert(payload);

      const { data, error } = await query.select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-behavioral-profiles'] });
      toast.success('Perfil da empresa salvo com sucesso!');
    },
    onError: (error) => {
      logger.error('Erro ao salvar perfil:', error);
      toast.error('Erro ao salvar perfil da empresa');
    },
  });
}
