/**
 * @fileoverview Cliente HTTP para chamadas de API
 * @module apiClient
 */

import { supabase } from '@/integrations/supabase/client';

export const apiClient = {
  async get<T>(table: string, options?: { eq?: Record<string, unknown> }): Promise<T[]> {
    let query = supabase.from(table).select('*');
    if (options?.eq) {
      Object.entries(options.eq).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }
    const { data, error } = await query;
    if (error) throw error;
    return data as T[];
  },

  async create<T>(table: string, data: Partial<T>): Promise<T> {
    const { data: result, error } = await supabase.from(table).insert(data).select().single();
    if (error) throw error;
    return result as T;
  },

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    const { data: result, error } = await supabase.from(table).update(data).eq('id', id).select().single();
    if (error) throw error;
    return result as T;
  },

  async delete(table: string, id: string): Promise<void> {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
  },
};
