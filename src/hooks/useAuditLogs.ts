import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AuditLog { 
  id: string; 
  user_id: string; 
  action: string; 
  resource_type: string; 
  resource_id: string; 
  old_data?: Record<string, any>; 
  new_data?: Record<string, any>; 
  ip_address?: string; 
  user_agent?: string; 
  created_at: string; 
  profiles?: { nome: string }; 
}

interface AuditLogFilters { 
  action?: string; 
  resource_type?: string; 
  user_id?: string; 
  startDate?: string; 
  endDate?: string; 
}

export function useAuditLogs(filters?: AuditLogFilters) {
  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ['audit-logs', filters],
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
          console.warn('audit_logs table may not exist:', error.message);
          return [];
        }
        return data as AuditLog[];
      } catch (e) {
        console.warn('Error loading audit logs:', e);
        return [];
      }
    },
  });

  const { data: actionTypes = [] } = useQuery({
    queryKey: ['audit-action-types'],
    queryFn: async () => {
      try {
        const { data } = await supabase.from('audit_logs').select('action').limit(1000);
        return [...new Set(data?.map(d => d.action) || [])];
      } catch {
        return [];
      }
    },
  });

  const { data: resourceTypes = [] } = useQuery({
    queryKey: ['audit-resource-types'],
    queryFn: async () => {
      try {
        const { data } = await supabase.from('audit_logs').select('resource_type').limit(1000);
        return [...new Set(data?.map(d => d.resource_type) || [])];
      } catch {
        return [];
      }
    },
  });

  const exportLogs = () => {
    const csv = [
      ['Data', 'Usuário', 'Ação', 'Recurso', 'ID Recurso', 'IP'].join(','),
      ...logs.map(log => [
        new Date(log.created_at).toLocaleString('pt-BR'),
        log.profiles?.nome || log.user_id,
        log.action,
        log.resource_type,
        log.resource_id,
        log.ip_address || '',
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return { logs, isLoading, refetch, actionTypes, resourceTypes, exportLogs };
}

export default useAuditLogs;
