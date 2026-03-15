/**
 * @module useComunicacoes
 * @description Hook para gerenciar comunicações com envio real de email
 */

import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Database } from '@/integrations/supabase/types';

type ComunicacaoRow = Database['public']['Tables']['comunicacoes']['Row'];

interface ComunicacaoInput {
  candidato_id: string;
  assunto: string;
  conteudo: string;
  template_nome?: string;
  template_etapa?: string;
  destinatario_email?: string;
  destinatario_nome?: string;
}

async function enviarEmailReal(to: string, subject: string, html: string) {
  const { data, error } = await supabase.functions.invoke('send-email', {
    body: { to, subject, html },
  });
  if (error) {
    console.warn('Envio real de email falhou (registrado mesmo assim):', error.message);
    return { sent: false, error: error.message };
  }
  return { sent: true, id: data?.id };
}

function textToHtml(text: string): string {
  return text
    .split('\n')
    .map(line => `<p style="margin:0 0 8px 0;font-family:Arial,sans-serif;font-size:14px;color:#333;">${line || '&nbsp;'}</p>`)
    .join('');
}

export function useComunicacoes(candidatoId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: comunicacoes = [], isLoading, error } = useQuery({
    queryKey: ['comunicacoes', candidatoId],
    queryFn: async () => {
      if (!candidatoId) return [];
      
      const { data, error } = await supabase
        .from('comunicacoes')
        .select('*')
        .eq('candidato_id', candidatoId)
        .order('enviado_em', { ascending: false });

      if (error) throw error;
      return data as ComunicacaoRow[];
    },
    enabled: !!candidatoId,
    placeholderData: [],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    gcTime: 10 * 60 * 1000,
    retry: 3,
  });

  const registrarMutation = useMutation({
    mutationFn: async (input: ComunicacaoInput) => {
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Register communication in DB
      const { data, error } = await supabase
        .from('comunicacoes')
        .insert({
          candidato_id: input.candidato_id,
          assunto: input.assunto,
          conteudo: input.conteudo,
          template_nome: input.template_nome || 'Comunicação Manual',
          template_etapa: input.template_etapa || 'geral',
          enviado_por: user?.id || null,
          enviado_em: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // 2. Send real email if recipient email is provided
      if (input.destinatario_email) {
        const htmlContent = `
          <div style="max-width:600px;margin:0 auto;padding:24px;font-family:Arial,sans-serif;">
            <div style="background:#1a1a2e;padding:16px 24px;border-radius:8px 8px 0 0;">
              <h2 style="color:#fff;margin:0;font-size:18px;">Promo Brindes - RH</h2>
            </div>
            <div style="padding:24px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
              ${input.destinatario_nome ? `<p style="margin:0 0 16px;color:#333;">Olá, <strong>${input.destinatario_nome}</strong>!</p>` : ''}
              ${textToHtml(input.conteudo)}
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
              <p style="font-size:12px;color:#999;margin:0;">Este email foi enviado pelo sistema Match ATS da Promo Brindes.</p>
            </div>
          </div>
        `;
        await enviarEmailReal(input.destinatario_email, input.assunto, htmlContent);
      }

      return data;
    },
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: ['comunicacoes'] });
      toast({ 
        title: input.destinatario_email 
          ? 'Email enviado e registrado!' 
          : 'Comunicação registrada!' 
      });
    },
    onError: (error: Error) => {
      toast({ 
        title: 'Erro ao registrar comunicação', 
        description: error.message,
        variant: 'destructive' 
      });
    },
  });

  return {
    comunicacoes,
    isLoading,
    error,
    registrarComunicacao: registrarMutation.mutateAsync,
    isRegistrando: registrarMutation.isPending,
    isRegistering: registrarMutation.isPending,
  };
}

export default useComunicacoes;

export type UseComunicacoesReturn = ReturnType<typeof useComunicacoes>;
