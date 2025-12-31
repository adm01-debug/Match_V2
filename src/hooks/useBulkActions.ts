import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BulkActionResult {
  success: number;
  failed: number;
  errors: string[];
  total: number;
}

interface BulkActionOptions {
  batchSize?: number;
  onProgress?: (completed: number, total: number) => void;
}

const DEFAULT_BATCH_SIZE = 10;

// Process items in batches with controlled concurrency
async function processBatch<T>(
  items: T[],
  processor: (item: T) => Promise<{ success: boolean; error?: string }>,
  batchSize: number,
  onProgress?: (completed: number, total: number) => void
): Promise<BulkActionResult> {
  let success = 0;
  let failed = 0;
  const errors: string[] = [];
  const total = items.length;
  let completed = 0;

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(processor));
    
    for (const result of results) {
      if (result.success) {
        success++;
      } else {
        failed++;
        if (result.error) errors.push(result.error);
      }
      completed++;
      onProgress?.(completed, total);
    }
    
    // Small delay between batches to avoid rate limiting
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return { success, failed, errors, total };
}

export function useBulkActions(options: BulkActionOptions = {}) {
  const { batchSize = DEFAULT_BATCH_SIZE, onProgress } = options;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const archiveCandidatos = useMutation({
    mutationFn: async (ids: string[]): Promise<BulkActionResult> => {
      if (!ids?.length) {
        return { success: 0, failed: 0, errors: ['Nenhum ID fornecido'], total: 0 };
      }

      return processBatch(
        ids,
        async (id) => {
          const { error } = await supabase
            .from('candidatos')
            .update({ 
              status: 'arquivado', 
              archived_at: new Date().toISOString() 
            })
            .eq('id', id);
          
          return { 
            success: !error, 
            error: error ? `ID ${id.slice(0, 8)}: ${error.message}` : undefined 
          };
        },
        batchSize,
        onProgress
      );
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['candidatos'] });
      if (result.failed > 0) {
        toast({ 
          title: 'Arquivamento parcial', 
          description: `${result.success} sucesso, ${result.failed} falha(s).`,
          variant: 'destructive'
        });
      } else {
        toast({ 
          title: 'Arquivados', 
          description: `${result.success} candidato(s) arquivado(s).` 
        });
      }
    },
    onError: (error) => {
      console.error('[useBulkActions] Archive error:', error);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao arquivar candidatos.',
        variant: 'destructive'
      });
    },
  });

  const deleteCandidatos = useMutation({
    mutationFn: async (ids: string[]): Promise<BulkActionResult> => {
      if (!ids?.length) {
        return { success: 0, failed: 0, errors: ['Nenhum ID fornecido'], total: 0 };
      }

      return processBatch(
        ids,
        async (id) => {
          const { error } = await supabase
            .from('candidatos')
            .delete()
            .eq('id', id);
          
          return { 
            success: !error, 
            error: error ? `ID ${id.slice(0, 8)}: ${error.message}` : undefined 
          };
        },
        batchSize,
        onProgress
      );
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['candidatos'] });
      if (result.failed > 0) {
        toast({ 
          title: 'Exclusão parcial', 
          description: `${result.success} excluído(s), ${result.failed} falha(s).`,
          variant: 'destructive'
        });
      } else {
        toast({ 
          title: 'Excluídos', 
          description: `${result.success} candidato(s) excluído(s).` 
        });
      }
    },
    onError: (error) => {
      console.error('[useBulkActions] Delete error:', error);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao excluir candidatos.',
        variant: 'destructive'
      });
    },
  });

  const moveToStage = useMutation({
    mutationFn: async ({ ids, stageId }: { ids: string[]; stageId: string }): Promise<BulkActionResult> => {
      if (!ids?.length) {
        return { success: 0, failed: 0, errors: ['Nenhum ID fornecido'], total: 0 };
      }
      if (!stageId?.trim()) {
        return { success: 0, failed: 0, errors: ['ID da etapa inválido'], total: 0 };
      }

      return processBatch(
        ids,
        async (id) => {
          const { error } = await supabase
            .from('candidaturas')
            .update({ etapa_id: stageId })
            .eq('candidato_id', id);
          
          return { 
            success: !error, 
            error: error ? `ID ${id.slice(0, 8)}: ${error.message}` : undefined 
          };
        },
        batchSize,
        onProgress
      );
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['candidaturas'] });
      queryClient.invalidateQueries({ queryKey: ['pipeline'] });
      if (result.failed > 0) {
        toast({ 
          title: 'Movimentação parcial', 
          description: `${result.success} movido(s), ${result.failed} falha(s).`,
          variant: 'destructive'
        });
      } else {
        toast({ 
          title: 'Movidos', 
          description: `${result.success} candidato(s) movido(s) de etapa.` 
        });
      }
    },
    onError: (error) => {
      console.error('[useBulkActions] Move error:', error);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao mover candidatos.',
        variant: 'destructive'
      });
    },
  });

  const addTags = useMutation({
    mutationFn: async ({ ids, tags }: { ids: string[]; tags: string[] }): Promise<BulkActionResult> => {
      if (!ids?.length) {
        return { success: 0, failed: 0, errors: ['Nenhum ID fornecido'], total: 0 };
      }
      if (!tags?.length) {
        return { success: 0, failed: 0, errors: ['Nenhuma tag fornecida'], total: 0 };
      }

      // Sanitize tags
      const sanitizedTags = tags.map(t => t.trim().toLowerCase()).filter(Boolean);
      if (!sanitizedTags.length) {
        return { success: 0, failed: 0, errors: ['Tags inválidas'], total: 0 };
      }

      return processBatch(
        ids,
        async (id) => {
          const { data: current, error: fetchError } = await supabase
            .from('candidatos')
            .select('tags')
            .eq('id', id)
            .single();
          
          if (fetchError) {
            return { success: false, error: `ID ${id.slice(0, 8)}: ${fetchError.message}` };
          }

          const currentTags = Array.isArray(current?.tags) ? current.tags : [];
          const newTags = [...new Set([...currentTags, ...sanitizedTags])];
          
          const { error: updateError } = await supabase
            .from('candidatos')
            .update({ tags: newTags })
            .eq('id', id);
          
          return { 
            success: !updateError, 
            error: updateError ? `ID ${id.slice(0, 8)}: ${updateError.message}` : undefined 
          };
        },
        batchSize,
        onProgress
      );
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['candidatos'] });
      if (result.failed > 0) {
        toast({ 
          title: 'Tags parciais', 
          description: `Tags aplicadas a ${result.success}, ${result.failed} falha(s).`,
          variant: 'destructive'
        });
      } else {
        toast({ 
          title: 'Tags adicionadas', 
          description: `Tags aplicadas a ${result.success} candidato(s).` 
        });
      }
    },
    onError: (error) => {
      console.error('[useBulkActions] Tags error:', error);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao adicionar tags.',
        variant: 'destructive'
      });
    },
  });

  const removeTags = useMutation({
    mutationFn: async ({ ids, tags }: { ids: string[]; tags: string[] }): Promise<BulkActionResult> => {
      if (!ids?.length) {
        return { success: 0, failed: 0, errors: ['Nenhum ID fornecido'], total: 0 };
      }
      if (!tags?.length) {
        return { success: 0, failed: 0, errors: ['Nenhuma tag fornecida'], total: 0 };
      }

      const tagsToRemove = new Set(tags.map(t => t.trim().toLowerCase()));

      return processBatch(
        ids,
        async (id) => {
          const { data: current, error: fetchError } = await supabase
            .from('candidatos')
            .select('tags')
            .eq('id', id)
            .single();
          
          if (fetchError) {
            return { success: false, error: `ID ${id.slice(0, 8)}: ${fetchError.message}` };
          }

          const currentTags = Array.isArray(current?.tags) ? current.tags : [];
          const newTags = currentTags.filter(t => !tagsToRemove.has(t.toLowerCase()));
          
          const { error: updateError } = await supabase
            .from('candidatos')
            .update({ tags: newTags })
            .eq('id', id);
          
          return { 
            success: !updateError, 
            error: updateError ? `ID ${id.slice(0, 8)}: ${updateError.message}` : undefined 
          };
        },
        batchSize,
        onProgress
      );
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['candidatos'] });
      toast({ 
        title: 'Tags removidas', 
        description: `Tags removidas de ${result.success} candidato(s).` 
      });
    },
    onError: (error) => {
      console.error('[useBulkActions] Remove tags error:', error);
      toast({ 
        title: 'Erro', 
        description: 'Falha ao remover tags.',
        variant: 'destructive'
      });
    },
  });

  return {
    archiveCandidatos: archiveCandidatos.mutateAsync,
    deleteCandidatos: deleteCandidatos.mutateAsync,
    moveToStage: moveToStage.mutateAsync,
    addTags: addTags.mutateAsync,
    removeTags: removeTags.mutateAsync,
    isProcessing: 
      archiveCandidatos.isPending || 
      deleteCandidatos.isPending || 
      moveToStage.isPending || 
      addTags.isPending ||
      removeTags.isPending,
  };
}

export default useBulkActions;
