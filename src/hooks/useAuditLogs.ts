import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCallback, useState } from 'react';

interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  ip_address: string;
  endpoint: string | null;
  user_agent: string | null;
  allowed: boolean;
  created_at: string;
}

interface AuditFilters {
  userId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  allowed?: boolean;
}

export function useAuditLogs(initialFilters?: AuditFilters) {
  const [filters, setFilters] = useState<AuditFilters>(initialFilters || {});

  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: async () => {
      let query = supabase
        .from('ip_access_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);

      if (filters.userId) query = query.eq('user_id', filters.userId);
      if (filters.action) query = query.eq('action', filters.action);
      if (filters.startDate) query = query.gte('created_at', filters.startDate);
      if (filters.endDate) query = query.lte('created_at', filters.endDate);
      if (filters.allowed !== undefined) query = query.eq('allowed', filters.allowed);

      const { data, error } = await query;
      if (error) throw error;
      return (data as AuditLog[]) || [];
    },
    staleTime: 30 * 1000,
  });

  const updateFilters = useCallback((newFilters: Partial<AuditFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => setFilters({}), []);

  return { logs, isLoading, refetch, filters, updateFilters, clearFilters };
}
