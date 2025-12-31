/**
 * @module useRateLimit
 * @description Hook para rate limiting baseado em IP
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface RateLimitLog {
  id: string;
  ip_address: string;
  endpoint: string;
  request_count: number;
  blocked: boolean;
  created_at: string;
}

interface BlockedIP {
  id: string;
  ip_address: string;
  reason: string | null;
  blocked_at: string;
  expires_at: string | null;
  is_permanent: boolean;
  blocked_by: string | null;
}

interface AllowedIP {
  id: string;
  ip_address: string;
  description: string | null;
  is_active: boolean;
  added_by: string | null;
  created_at: string;
}

interface IPAccessLog {
  id: string;
  ip_address: string;
  user_id: string | null;
  action: string;
  allowed: boolean;
  endpoint: string | null;
  user_agent: string | null;
  created_at: string;
}

export function useRateLimit() {
  const { user, hasRole } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = hasRole('admin');

  // Fetch rate limit logs (admin only)
  const { data: rateLimitLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ['rate-limit-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rate_limit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      return data as RateLimitLog[];
    },
    enabled: isAdmin,
  });

  // Fetch blocked IPs (admin only)
  const { data: blockedIPs, isLoading: isLoadingBlocked } = useQuery({
    queryKey: ['blocked-ips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blocked_ips')
        .select('*')
        .order('blocked_at', { ascending: false });

      if (error) throw error;
      return data as BlockedIP[];
    },
    enabled: isAdmin,
  });

  // Fetch allowed IPs (admin only)
  const { data: allowedIPs, isLoading: isLoadingAllowed } = useQuery({
    queryKey: ['allowed-ips'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('allowed_ips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as AllowedIP[];
    },
    enabled: isAdmin,
  });

  // Fetch IP access logs (admin only)
  const { data: accessLogs, isLoading: isLoadingAccessLogs } = useQuery({
    queryKey: ['ip-access-logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ip_access_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      return data as IPAccessLog[];
    },
    enabled: isAdmin,
  });

  // Block IP
  const blockIP = useMutation({
    mutationFn: async (params: { 
      ip_address: string; 
      reason?: string; 
      is_permanent?: boolean;
      expires_at?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('blocked_ips')
        .insert({
          ip_address: params.ip_address,
          reason: params.reason,
          is_permanent: params.is_permanent ?? false,
          expires_at: params.expires_at,
          blocked_by: user.id,
        });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-ips'] });
    },
  });

  // Unblock IP
  const unblockIP = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blocked_ips')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-ips'] });
    },
  });

  // Add to whitelist
  const addToWhitelist = useMutation({
    mutationFn: async (params: { ip_address: string; description?: string }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('allowed_ips')
        .insert({
          ip_address: params.ip_address,
          description: params.description,
          added_by: user.id,
        });

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowed-ips'] });
    },
  });

  // Remove from whitelist
  const removeFromWhitelist = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('allowed_ips')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowed-ips'] });
    },
  });

  // Toggle whitelist status
  const toggleWhitelistStatus = useMutation({
    mutationFn: async (params: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('allowed_ips')
        .update({ is_active: params.is_active })
        .eq('id', params.id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allowed-ips'] });
    },
  });

  // Get statistics
  const stats = {
    totalBlocked: blockedIPs?.length ?? 0,
    totalAllowed: allowedIPs?.filter(ip => ip.is_active).length ?? 0,
    recentRequests: rateLimitLogs?.length ?? 0,
    blockedRequests: rateLimitLogs?.filter(log => log.blocked).length ?? 0,
  };

  return {
    // Data
    rateLimitLogs,
    blockedIPs,
    allowedIPs,
    accessLogs,
    stats,
    
    // Loading states
    isLoadingLogs,
    isLoadingBlocked,
    isLoadingAllowed,
    isLoadingAccessLogs,
    isLoading: isLoadingLogs || isLoadingBlocked || isLoadingAllowed,
    
    // Mutations
    blockIP,
    unblockIP,
    addToWhitelist,
    removeFromWhitelist,
    toggleWhitelistStatus,
  };
}

export default useRateLimit;
