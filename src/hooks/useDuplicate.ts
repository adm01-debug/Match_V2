import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UseDuplicateOptions { 
  tableName: string; 
  queryKey: string[]; 
  excludeFields?: string[]; 
  transformData?: (data: Record<string, unknown>) => Record<string, unknown>; 
}

export function useDuplicate<T extends { id: string }>({ 
  tableName, 
  queryKey, 
  excludeFields = ['id', 'created_at', 'updated_at'], 
  transformData 
}: UseDuplicateOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: T) => {
      const duplicateData = { ...item } as Record<string, unknown>;
      excludeFields.forEach(f => delete duplicateData[f]);
      
      const nameField = duplicateData['name'];
      const tituloField = duplicateData['titulo'];
      
      if (typeof nameField === 'string') {
        duplicateData['name'] = `${nameField} (Cópia)`;
      }
      if (typeof tituloField === 'string') {
        duplicateData['titulo'] = `${tituloField} (Cópia)`;
      }
      
      const finalData = transformData ? transformData(duplicateData) : duplicateData;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data, error } = await (supabase as any).from(tableName).insert(finalData).select().single();
      if (error) throw error;
      return data as T;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Item duplicado com sucesso!');
      return data;
    },
    onError: (error: Error) => toast.error(`Erro ao duplicar: ${error.message}`),
  });
}
