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
      const { data: prop, error: fetchErr } = await supabase
        .from('propostas')
        .select('*')
        .eq('id', id)
        .single();
      if (fetchErr) throw fetchErr;
      const proposta = prop as unknown as Proposta;

      const { error } = await supabase
        .from('propostas')
        .update({ status: 'enviada', enviada_em: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;

      const link = buildSignatureUrl(proposta.access_token);
      const salarioFmt = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: proposta.moeda || 'BRL',
      }).format(Number(proposta.salario ?? 0));

      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#1a1a1a;">
          <h2 style="color:#0f172a;">Olá, ${proposta.candidato_nome}!</h2>
          <p>Temos o prazer de apresentar uma <strong>proposta de trabalho</strong> para a vaga
             <strong>${proposta.vaga_titulo}</strong>.</p>
          <ul style="line-height:1.8;">
            <li><strong>Salário:</strong> ${salarioFmt}</li>
            <li><strong>Data de início:</strong> ${new Date(proposta.data_inicio).toLocaleDateString('pt-BR')}</li>
            ${proposta.expira_em ? `<li><strong>Válida até:</strong> ${new Date(proposta.expira_em).toLocaleDateString('pt-BR')}</li>` : ''}
          </ul>
          <p>Para revisar e assinar eletronicamente, clique no botão abaixo:</p>
          <p style="text-align:center;margin:32px 0;">
            <a href="${link}" style="background:#0f172a;color:#fff;padding:14px 28px;text-decoration:none;border-radius:8px;display:inline-block;font-weight:600;">
              Revisar e assinar proposta
            </a>
          </p>
          <p style="font-size:12px;color:#64748b;">Se o botão não funcionar, copie e cole este link no navegador:<br/>${link}</p>
        </div>
      `;

      const { error: mailErr } = await supabase.functions.invoke('send-email', {
        body: {
          to: proposta.candidato_email,
          subject: `Proposta de trabalho — ${proposta.vaga_titulo}`,
          html,
        },
      });
      if (mailErr) {
        logger.warn('Proposta marcada como enviada, mas envio de email falhou', mailErr);
        toast.warning('Proposta enviada, mas email falhou. Copie o link manualmente.');
      }
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
