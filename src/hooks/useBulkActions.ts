import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BulkActionResult { success: number; failed: number; errors: string[]; }

export function useBulkActions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const archiveCandidatos = useMutation({
    mutationFn: async (ids: string[]): Promise<BulkActionResult> => {
      let success = 0, failed = 0;
      const errors: string[] = [];
      for (const id of ids) {
        const { error } = await supabase.from('candidatos').update({ status: 'arquivado', archived_at: new Date().toISOString() }).eq('id', id);
        if (error) { failed++; errors.push(`ID ${id}: ${error.message}`); } else { success++; }
      }
      return { success, failed, errors };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['candidatos'] });
      toast({ title: 'Arquivados', description: `${result.success} candidato(s) arquivado(s).` });
    },
  });

  const deleteCandidatos = useMutation({
    mutationFn: async (ids: string[]): Promise<BulkActionResult> => {
      let success = 0, failed = 0;
      const errors: string[] = [];
      for (const id of ids) {
        const { error } = await supabase.from('candidatos').delete().eq('id', id);
        if (error) { failed++; errors.push(`ID ${id}: ${error.message}`); } else { success++; }
      }
      return { success, failed, errors };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['candidatos'] });
      toast({ title: 'Excluídos', description: `${result.success} candidato(s) excluído(s).` });
    },
  });

  const moveToStage = useMutation({
    mutationFn: async ({ ids, stageId }: { ids: string[]; stageId: string }): Promise<BulkActionResult> => {
      let success = 0, failed = 0;
      const errors: string[] = [];
      for (const id of ids) {
        const { error } = await supabase.from('candidaturas').update({ etapa_id: stageId }).eq('candidato_id', id);
        if (error) { failed++; errors.push(`ID ${id}: ${error.message}`); } else { success++; }
      }
      return { success, failed, errors };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['candidaturas'] });
      toast({ title: 'Movidos', description: `${result.success} candidato(s) movido(s) de etapa.` });
    },
  });

  const addTags = useMutation({
    mutationFn: async ({ ids, tags }: { ids: string[]; tags: string[] }): Promise<BulkActionResult> => {
      let success = 0, failed = 0;
      const errors: string[] = [];
      for (const id of ids) {
        const { data: current } = await supabase.from('candidatos').select('tags').eq('id', id).single();
        const newTags = [...new Set([...(current?.tags || []), ...tags])];
        const { error } = await supabase.from('candidatos').update({ tags: newTags }).eq('id', id);
        if (error) { failed++; errors.push(`ID ${id}: ${error.message}`); } else { success++; }
      }
      return { success, failed, errors };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['candidatos'] });
      toast({ title: 'Tags adicionadas', description: `Tags aplicadas a ${result.success} candidato(s).` });
    },
  });

  return {
    archiveCandidatos: archiveCandidatos.mutateAsync,
    deleteCandidatos: deleteCandidatos.mutateAsync,
    moveToStage: moveToStage.mutateAsync,
    addTags: addTags.mutateAsync,
    isProcessing: archiveCandidatos.isPending || deleteCandidatos.isPending || moveToStage.isPending || addTags.isPending,
  };
}

export default useBulkActions;
