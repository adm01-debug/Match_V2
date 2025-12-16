import { supabase } from '@/integrations/supabase/client';

interface RegistrarComunicacaoParams {
  candidatoId: string;
  templateNome: string;
  templateEtapa: string;
  assunto: string;
  conteudo: string;
}

export async function registrarComunicacao({
  candidatoId,
  templateNome,
  templateEtapa,
  assunto,
  conteudo,
}: RegistrarComunicacaoParams) {
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('comunicacoes')
    .insert({
      candidato_id: candidatoId,
      template_nome: templateNome,
      template_etapa: templateEtapa,
      assunto: assunto,
      conteudo: conteudo,
      enviado_por: user?.id || null,
    })
    .select()
    .single();

  if (error) {
    console.error('Erro ao registrar comunicação:', error);
    throw error;
  }

  return data;
}
