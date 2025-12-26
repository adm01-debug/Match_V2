import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AuditLog { id: string; user_id: string; action: string; resource: string; resource_id: string; old_data?: Record<string, any>; new_data?: Record<string, any>; ip_address?: string; user_agent?: string; created_at: string; profiles?: { nome: string; email: string }; }
interface AuditFilters { userId?: string; action?: string; resource?: string; startDate?: Date; endDate?: Date; }

export function useAuditLogs(filters?: AuditFilters) {
  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: async () => {
      let query = supabase.from('audit_logs').select('*, profiles(nome, email)').order('created_at', { ascending: false }).limit(500);
      
      if (filters?.userId) query = query.eq('user_id', filters.userId);
      if (filters?.action) query = query.eq('action', filters.action);
      if (filters?.resource) query = query.eq('resource', filters.resource);
      if (filters?.startDate) query = query.gte('created_at', filters.startDate.toISOString());
      if (filters?.endDate) query = query.lte('created_at', filters.endDate.toISOString());
      
      const { data, error } = await query;
      if (error) throw error;
      return data as AuditLog[];
    },
  });

  const actions = [...new Set(logs.map(l => l.action))];
  const resources = [...new Set(logs.map(l => l.resource))];
  const users = [...new Map(logs.filter(l => l.profiles).map(l => [l.user_id, l.profiles])).values()];

  const exportLogs = () => {
    const csv = [
      ['Data', 'Usuário', 'Ação', 'Recurso', 'ID Recurso', 'IP'].join(','),
      ...logs.map(l => [l.created_at, l.profiles?.nome || l.user_id, l.action, l.resource, l.resource_id, l.ip_address || ''].join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return { logs, isLoading, refetch, actions, resources, users, exportLogs };
}

export default useAuditLogs;
