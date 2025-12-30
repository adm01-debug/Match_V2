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
  // If contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function useAuditLogs(filters?: AuditLogFilters) {
  const filtersKey = useMemo(() => JSON.stringify(filters ?? {}), [filters]);

  const { data: logs = [], isLoading, refetch, error } = useQuery({
    queryKey: ['audit-logs', filtersKey],
    queryFn: async () => {
      try {
        let query = supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);
        
        if (filters?.action) query = query.eq('action', filters.action);
        if (filters?.resource_type) query = query.eq('resource_type', filters.resource_type);
        if (filters?.user_id) query = query.eq('user_id', filters.user_id);
        if (filters?.startDate) query = query.gte('created_at', filters.startDate);
        if (filters?.endDate) query = query.lte('created_at', filters.endDate);
        
        const { data, error } = await query;
        
        if (error) {
          console.warn('[useAuditLogs] Query error:', error.message);
          return [];
        }
        return (data ?? []) as AuditLog[];
      } catch (e) {
        console.warn('[useAuditLogs] Error loading audit logs:', e);
        return [];
      }
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
  });

  const { data: actionTypes = [] } = useQuery({
    queryKey: ['audit-action-types'],
    queryFn: async () => {
      try {
        const { data } = await supabase
          .from('audit_logs')
          .select('action')
          .limit(1000);
        const actions = data?.map(d => d.action).filter(Boolean) ?? [];
        return [...new Set(actions)].sort();
      } catch {
        return [];
      }
    },
    staleTime: 60000, // 1 minute
  });

  const { data: resourceTypes = [] } = useQuery({
    queryKey: ['audit-resource-types'],
    queryFn: async () => {
      try {
        const { data } = await supabase
          .from('audit_logs')
          .select('resource_type')
          .limit(1000);
        const types = data?.map(d => d.resource_type).filter(Boolean) ?? [];
        return [...new Set(types)].sort();
      } catch {
        return [];
      }
    },
    staleTime: 60000, // 1 minute
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
    
    // Add BOM for Excel UTF-8 compatibility
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
    
    // Cleanup with delay to ensure download starts
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
