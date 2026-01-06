import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLog { 
  id: string; 
  user_id: string; 
  action: string; 
  resource_type: string; 
  resource_id: string; 
  old_data?: Record<string, unknown>; 
  new_data?: Record<string, unknown>; 
  ip_address?: string; 
  user_agent?: string; 
  created_at: string; 
  profiles?: { nome: string }; 
}

export interface AuditLogFilters { 
  action?: string; 
  resource_type?: string; 
  user_id?: string; 
  startDate?: string; 
  endDate?: string; 
}

// Helper to escape CSV values
function escapeCSV(value: string | null | undefined): string {
  if (value == null) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function useAuditLogs(filters?: AuditLogFilters) {
  const filtersKey = useMemo(() => JSON.stringify(filters ?? {}), [filters]);

  // Use user_2fa_logs as a substitute since audit_logs doesn't exist in schema
  const { data: logs = [], isLoading, refetch, error } = useQuery({
    queryKey: ['audit-logs', filtersKey],
    queryFn: async (): Promise<AuditLog[]> => {
      try {
        let query = supabase
          .from('user_2fa_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);
        
        if (filters?.action) query = query.eq('action', filters.action);
        if (filters?.user_id) query = query.eq('user_id', filters.user_id);
        if (filters?.startDate) query = query.gte('created_at', filters.startDate);
        if (filters?.endDate) query = query.lte('created_at', filters.endDate);
        
        const { data, error: queryError } = await query;
        
        if (queryError) {
          console.warn('[useAuditLogs] Query error:', queryError.message);
          return [];
        }
        
        // Map user_2fa_logs to AuditLog format
        return (data ?? []).map(log => ({
          id: log.id,
          user_id: log.user_id,
          action: log.action,
          resource_type: '2fa',
          resource_id: log.id,
          ip_address: log.ip_address ?? undefined,
          user_agent: log.user_agent ?? undefined,
          created_at: log.created_at,
        }));
      } catch (e) {
        console.warn('[useAuditLogs] Error loading audit logs:', e);
        return [];
      }
    },
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const { data: actionTypes = [] } = useQuery({
    queryKey: ['audit-action-types'],
    queryFn: async (): Promise<string[]> => {
      try {
        const { data } = await supabase
          .from('user_2fa_logs')
          .select('action')
          .limit(1000);
        const actions = data?.map(d => d.action).filter(Boolean) ?? [];
        return [...new Set(actions)].sort();
      } catch {
        return [];
      }
    },
    staleTime: 60000,
  });

  const { data: resourceTypes = [] } = useQuery({
    queryKey: ['audit-resource-types'],
    queryFn: async (): Promise<string[]> => {
      // Since we're using user_2fa_logs, resource type is always '2fa'
      return ['2fa'];
    },
    staleTime: 60000,
  });

  const exportLogs = useCallback(async () => {
    if (logs.length === 0) {
      console.warn('[useAuditLogs] No logs to export');
      return;
    }

    const headers = ['Data', 'Usuário', 'Ação', 'Recurso', 'ID Recurso', 'IP', 'User Agent'];
    
    const rows = logs.map(log => [
      escapeCSV(new Date(log.created_at).toLocaleString('pt-BR')),
      escapeCSV(log.profiles?.nome ?? log.user_id),
      escapeCSV(log.action),
      escapeCSV(log.resource_type),
      escapeCSV(log.resource_id),
      escapeCSV(log.ip_address),
      escapeCSV(log.user_agent),
    ].join(','));
    
    const BOM = '\uFEFF';
    const csv = BOM + [headers.join(','), ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  }, [logs]);

  const logsCount = useMemo(() => logs.length, [logs]);

  return { 
    logs, 
    isLoading, 
    error,
    refetch, 
    actionTypes, 
    resourceTypes, 
    exportLogs,
    logsCount,
  };
}

export default useAuditLogs;
