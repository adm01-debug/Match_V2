/**
 * @module useLinkedInImport
 * @description Hook to import candidate data from LinkedIn profile URL using AI
 */

import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface LinkedInImportResult {
  nome: string;
  email: string;
  telefone: string;
  resumo: string;
  habilidades: string[];
  experiencias: Array<{
    empresa: string;
    cargo: string;
    periodo: string;
    descricao: string;
  }>;
  formacao: Array<{
    instituicao: string;
    curso: string;
    periodo: string;
  }>;
  linkedin_url: string;
}

export function useLinkedInImport() {
  const { toast } = useToast();

  const importMutation = useMutation({
    mutationFn: async (linkedinUrl: string): Promise<LinkedInImportResult> => {
      // Validate URL
      if (!linkedinUrl.includes('linkedin.com/in/')) {
        throw new Error('URL inválida. Use o formato: https://linkedin.com/in/nome-do-perfil');
      }

      // Use the parse-resume edge function with LinkedIn URL mode
      const { data, error } = await supabase.functions.invoke('parse-resume', {
        body: {
          mode: 'linkedin',
          linkedin_url: linkedinUrl,
        },
      });

      if (error) throw error;
      if (!data) throw new Error('Nenhum dado retornado');

      return {
        ...data,
        linkedin_url: linkedinUrl,
      } as LinkedInImportResult;
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao importar do LinkedIn',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const saveCandidato = useMutation({
    mutationFn: async (data: LinkedInImportResult) => {
      const { data: candidato, error } = await supabase
        .from('candidatos')
        .insert({
          nome: data.nome,
          email: data.email || '',
          telefone: data.telefone || null,
          resumo: data.resumo || null,
          habilidades: data.habilidades || [],
          experiencias: data.experiencias || [],
          formacao: data.formacao || [],
          fonte: 'linkedin',
          status: 'novo',
        })
        .select()
        .single();

      if (error) throw error;
      return candidato;
    },
    onSuccess: () => {
      toast({ title: 'Candidato importado do LinkedIn com sucesso!' });
    },
    onError: (error: Error) => {
      toast({
        title: 'Erro ao salvar candidato',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    importFromLinkedIn: importMutation.mutateAsync,
    saveCandidato: saveCandidato.mutateAsync,
    isImporting: importMutation.isPending,
    isSaving: saveCandidato.isPending,
    importedData: importMutation.data,
  };
}
