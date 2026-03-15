/**
 * @module useDocumentosCandidato
 * @description Hook para gerenciar documentos de candidatos
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DocumentoCandidato {
  id: string;
  candidato_id: string;
  nome: string;
  tipo: string;
  url: string;
  tamanho_bytes: number | null;
  mime_type: string | null;
  uploaded_by: string | null;
  created_at: string;
  updated_at: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export function useDocumentosCandidato(candidatoId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: documentos = [], isLoading, error } = useQuery({
    queryKey: ['documentos_candidatos', candidatoId],
    queryFn: async () => {
      if (!candidatoId) return [];
      const { data, error: queryError } = await db
        .from('documentos_candidatos')
        .select('*')
        .eq('candidato_id', candidatoId)
        .order('created_at', { ascending: false });
      if (queryError) throw queryError;
      return (data || []) as DocumentoCandidato[];
    },
    enabled: !!candidatoId,
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ candidatoId: cId, file }: { candidatoId: string; file: File }) => {
      const { data: { user } } = await supabase.auth.getUser();
      const filePath = `candidatos/${cId}/${Date.now()}_${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('documentos').getPublicUrl(filePath);

      const { data, error } = await db.from('documentos_candidatos').insert({
        candidato_id: cId,
        nome: file.name,
        tipo: file.name.endsWith('.pdf') ? 'curriculo' : 'outro',
        url: urlData.publicUrl,
        tamanho_bytes: file.size,
        mime_type: file.type,
        uploaded_by: user?.id,
      }).select().single();
      if (error) throw error;
      return data as DocumentoCandidato;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos_candidatos'] });
      toast({ title: 'Documento enviado com sucesso!' });
    },
    onError: (err: Error) => toast({ title: 'Erro ao enviar documento', description: err.message, variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await db.from('documentos_candidatos').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos_candidatos'] });
      toast({ title: 'Documento removido!' });
    },
  });

  return {
    documentos,
    isLoading,
    error,
    uploadDocumento: uploadMutation.mutateAsync,
    deleteDocumento: deleteMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
  };
}
