import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useDuplicate() {
  const { toast } = useToast();

  const duplicate = useCallback(async <T extends Record<string, unknown>>(
    table: string,
    id: string,
    nameField: string = 'titulo',
    excludeFields: string[] = ['id', 'created_at', 'updated_at']
  ): Promise<T | null> => {
    try {
      const { data: original, error: fetchError } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError || !original) throw fetchError || new Error('Registro não encontrado');

      const clone = { ...original } as Record<string, unknown>;
      for (const field of excludeFields) {
        delete clone[field];
      }
      if (nameField in clone && typeof clone[nameField] === 'string') {
        clone[nameField] = `${clone[nameField]} (Cópia)`;
      }

      const { data: created, error: insertError } = await supabase
        .from(table)
        .insert(clone)
        .select()
        .single();

      if (insertError) throw insertError;

      toast({ title: 'Registro duplicado com sucesso' });
      return created as T;
    } catch (err) {
      toast({ title: 'Erro ao duplicar', description: String(err), variant: 'destructive' });
      return null;
    }
  }, [toast]);

  return { duplicate };
}
