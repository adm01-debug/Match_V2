import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCandidatoAuth } from '@/contexts/CandidatoAuthContext';
import { toast } from 'sonner';
import { VagaPublicada } from './types';

export function usePortalVagas(searchTerm: string) {
  const queryClient = useQueryClient();
  const { profile } = useCandidatoAuth();

  const { data: vagas, isLoading } = useQuery({
    queryKey: ['vagas-publicadas', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('vagas')
        .select('*')
        .eq('status', 'publicada')
        .order('data_publicacao', { ascending: false });

      if (searchTerm) {
        query = query.or(`titulo.ilike.%${searchTerm}%,departamento.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
  });

  const { data: candidaturasExistentes } = useQuery({
    queryKey: ['minhas-candidaturas-ids', profile?.id],
    queryFn: async () => {
      if (!profile?.id) return [];
      const { data, error } = await supabase
        .from('candidaturas')
        .select('vaga_id')
        .eq('candidato_auth_id', profile.id);
      if (error) throw error;
      return data?.map(c => c.vaga_id) || [];
    },
    enabled: !!profile?.id,
  });

  const candidatarMutation = useMutation({
    mutationFn: async ({ vagaId, carta, curriculoUrl }: { vagaId: string; carta: string; curriculoUrl?: string }) => {
      if (!profile?.id) throw new Error('Usuário não autenticado');
      const { error } = await supabase.from('candidaturas').insert({
        candidato_auth_id: profile.id,
        vaga_id: vagaId,
        carta_apresentacao: carta,
        curriculo_url: curriculoUrl || null,
        status: 'pendente',
        etapa_atual: 'inscricao',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success('Candidatura enviada com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['minhas-candidaturas-ids'] });
      queryClient.invalidateQueries({ queryKey: ['candidaturas'] });
    },
    onError: (error: Error) => {
      toast.error('Erro ao enviar candidatura', { description: error.message });
    },
  });

  const uploadCurriculo = async (file: File): Promise<string | undefined> => {
    if (!profile?.user_id) return undefined;
    const ext = file.name.split('.').pop();
    const path = `${profile.user_id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('curriculos').upload(path, file, { upsert: true });
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from('curriculos').getPublicUrl(path);
    return publicUrl;
  };

  const jaCandidatou = (vagaId: string) => candidaturasExistentes?.includes(vagaId) ?? false;

  return {
    vagas: vagas as VagaPublicada[] | undefined,
    isLoading,
    candidatarMutation,
    uploadCurriculo,
    jaCandidatou,
  };
}
