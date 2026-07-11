/**
 * @fileoverview Cliente HTTP para chamadas de API
 * @module apiClient
 */

import { supabase } from '@/integrations/supabase/client';

// Supabase exige nomes de tabela como literais tipados. Como este cliente
// é genérico por design (recebe o nome em runtime), usamos `never` para
// bypass do constraint de literal sem cair em `any`.
type AnyTable = never;

export const apiClient = {
  async get<T>(table: string, options?: { eq?: Record<string, unknown> }): Promise<T[]> {
    let query = supabase.from(table as AnyTable).select('*');
    if (options?.eq) {
      Object.entries(options.eq).forEach(([key, value]) => {
        query = query.eq(key, value as never);
      });
    }
    const { data, error } = await query;
    if (error) throw error;
    return data as T[];
  },

  async create<T>(table: string, data: Partial<T>): Promise<T> {
    const { data: result, error } = await supabase
      .from(table as AnyTable)
      .insert(data as never)
      .select()
      .single();
    if (error) throw error;
    return result as T;
  },

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    const { data: result, error } = await supabase
      .from(table as AnyTable)
      .update(data as never)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return result as T;
  },

  async delete(table: string, id: string): Promise<void> {
    const { error } = await supabase.from(table as AnyTable).delete().eq('id', id);
    if (error) throw error;
  },

  async request<T>(options: { method: string; url: string; data?: unknown }): Promise<T> {
    const urlParts = options.url.replace(/^\//, '').split('/');
    const table = urlParts[0] ?? '';
    if (options.method === 'GET') {
      const result = await this.get<T>(table);
      return result as unknown as T;
    }
    if (options.method === 'POST') {
      return this.create<T>(table, options.data as Partial<T>);
    }
    throw new Error(`Method ${options.method} not supported`);
  },

  async post<T>(url: string, data: unknown): Promise<T> {
    const urlParts = url.replace(/^\//, '').split('/');
    const table = urlParts[0] ?? '';
    return this.create<T>(table, data as Partial<T>);
  },
};

export function createApiUrl(path: string, params?: Record<string, unknown>): string {
  const baseUrl = path.startsWith('/') ? path : `/${path}`;
  if (!params) return baseUrl;

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}
