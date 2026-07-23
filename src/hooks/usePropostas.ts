import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/services/logger';

export interface Proposta {
  id: string;
  candidato_id: string | null;
  candidato_nome: string;
  candidato_email: string;
  vaga_id: string | null;
  vaga_titulo: string;
  salario: number;
  moeda: string;
  data_inicio: string;
  beneficios: string[];
  clausulas: string | null;
  status:
    | 'rascunho'
    | 'enviada'
    | 'visualizada'
    | 'aceita'
    | 'recusada'
    | 'expirada'
    | 'cancelada';
  access_token: string;
  expira_em: string | null;
  enviada_em: string | null;
  assinada_em: string | null;
  recusada_em: string | null;
  assinatura_hash: string | null;
  motivo_recusa: string | null;
  created_at: string;
}

export function usePropostas() {
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ['propostas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('propostas')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as Proposta[];
    },
    staleTime: 30_000,
  });

  const create = useMutation({
    mutationFn: async (payload: {
      candidato_id?: string | null;
      candidato_nome: string;
      candidato_email: string;
      vaga_id?: string | null;
      vaga_titulo: string;
      salario: number;
      data_inicio: string;
      beneficios: string[];
      clausulas?: string;
      expira_em?: string;
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id;
      if (!uid) throw new Error('not_authenticated');

      const { data, error } = await supabase
        .from('propostas')
        .insert({
          ...payload,
          beneficios: payload.beneficios,
          criado_por: uid,
        })
        .select('*')
        .single();
      if (error) throw error;
      return data as unknown as Proposta;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['propostas'] });
      toast.success('Proposta criada com sucesso');
    },
    onError: (err: Error) => {
      logger.error('Erro ao criar proposta', err);
      toast.error('Falha ao criar proposta');
    },
  });

  const enviar = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('propostas')
        .update({ status: 'enviada', enviada_em: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['propostas'] });
      toast.success('Proposta enviada ao candidato');
    },
    onError: () => toast.error('Falha ao enviar proposta'),
  });

  const cancelar = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('propostas')
        .update({ status: 'cancelada' })
        .eq('id', id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['propostas'] });
      toast.success('Proposta cancelada');
    },
    onError: () => toast.error('Falha ao cancelar'),
  });

  return { ...query, create, enviar, cancelar };
}

export function buildSignatureUrl(token: string): string {
  return `${window.location.origin}/assinar-proposta/${token}`;
}
