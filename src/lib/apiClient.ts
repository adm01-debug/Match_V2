/**
 * @fileoverview Cliente HTTP para chamadas de API
 * @module apiClient
 */

import { supabase } from '@/integrations/supabase/client';

export const apiClient = {
  async get<T>(table: string, options?: { eq?: Record<string, unknown> }): Promise<T[]> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = supabase.from(table as any).select('*');
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: result, error } = await supabase.from(table as any).insert(data as any).select().single();
    if (error) throw error;
    return result as T;
  },

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: result, error } = await supabase.from(table as any).update(data as any).eq('id', id).select().single();
    if (error) throw error;
    return result as T;
  },

  async delete(table: string, id: string): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await supabase.from(table as any).delete().eq('id', id);
    if (error) throw error;
  },

  async request<T>(options: { method: string; url: string; data?: unknown }): Promise<T> {
    // Generic request handler for compatibility
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

export function handleApiError(error: unknown): void {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
  } else if (error && typeof error === 'object' && 'response' in error) {
    const apiError = error as { response?: { status?: number; data?: { message?: string } } };
    console.error('API Error:', apiError.response?.status, apiError.response?.data?.message);
  } else {
    console.error('Unknown API Error:', error);
  }
}

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
