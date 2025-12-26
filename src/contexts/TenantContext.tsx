import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Tenant { id: string; name: string; slug: string; logo_url?: string; settings?: Record<string, any>; plan: string; created_at: string; }
interface TenantContextType { tenant: Tenant | null; tenants: Tenant[]; isLoading: boolean; switchTenant: (tenantId: string) => Promise<void>; isMultiTenant: boolean; }

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadTenants() {
      if (!user?.id) { setTenant(null); setTenants([]); setIsLoading(false); return; }
      try {
        const { data: memberships } = await supabase.from('tenant_members').select('tenant_id, tenants(*)').eq('user_id', user.id);
        const userTenants = (memberships || []).map((m: any) => m.tenants).filter(Boolean) as Tenant[];
        setTenants(userTenants);
        
        const savedTenantId = localStorage.getItem('current_tenant_id');
        const currentTenant = userTenants.find(t => t.id === savedTenantId) || userTenants[0] || null;
        setTenant(currentTenant);
        if (currentTenant) localStorage.setItem('current_tenant_id', currentTenant.id);
      } catch (error) { console.error('Error loading tenants:', error); }
      finally { setIsLoading(false); }
    }
    loadTenants();
  }, [user?.id]);

  const switchTenant = async (tenantId: string) => {
    const newTenant = tenants.find(t => t.id === tenantId);
    if (newTenant) { setTenant(newTenant); localStorage.setItem('current_tenant_id', tenantId); window.location.reload(); }
  };

  return (
    <TenantContext.Provider value={{ tenant, tenants, isLoading, switchTenant, isMultiTenant: tenants.length > 1 }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenantContext() {
  const context = useContext(TenantContext);
  if (!context) throw new Error('useTenantContext must be used within TenantProvider');
  return context;
}

export default TenantContext;
