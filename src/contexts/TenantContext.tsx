import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Tenant { 
  id: string; 
  name: string; 
  slug: string; 
  logo_url?: string; 
  settings?: Record<string, any>; 
  plan: string; 
  created_at: string; 
}

interface TenantContextType { 
  tenant: Tenant | null; 
  tenants: Tenant[]; 
  isLoading: boolean; 
  switchTenant: (tenantId: string) => Promise<void>; 
  isMultiTenant: boolean; 
}

const defaultContext: TenantContextType = {
  tenant: null,
  tenants: [],
  isLoading: false,
  switchTenant: async () => {},
  isMultiTenant: false,
};

const TenantContext = createContext<TenantContextType>(defaultContext);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data.user?.id || null);
    });
  }, []);

  useEffect(() => {
    async function loadTenants() {
      if (!userId) { 
        setTenant(null); 
        setTenants([]); 
        setIsLoading(false); 
        return; 
      }
      try {
        const { data: memberships } = await supabase
          .from('tenant_members')
          .select('tenant_id')
          .eq('user_id', userId);
        
        if (memberships && memberships.length > 0) {
          const tenantIds = memberships.map(m => m.tenant_id);
          const { data: tenantData } = await supabase
            .from('tenants')
            .select('*')
            .in('id', tenantIds);
          
          const userTenants = tenantData || [];
          setTenants(userTenants);
          
          const savedTenantId = localStorage.getItem('current_tenant_id');
          const currentTenant = userTenants.find(t => t.id === savedTenantId) || userTenants[0] || null;
          setTenant(currentTenant);
          if (currentTenant) localStorage.setItem('current_tenant_id', currentTenant.id);
        }
      } catch (error) { 
        // Error loading tenants - handled silently 
      } finally { 
        setIsLoading(false); 
      }
    }
    loadTenants();
  }, [userId]);

  const switchTenant = async (tenantId: string) => {
    const newTenant = tenants.find(t => t.id === tenantId);
    if (newTenant) { 
      setTenant(newTenant); 
      localStorage.setItem('current_tenant_id', tenantId); 
    }
  };

  return (
    <TenantContext.Provider value={{ tenant, tenants, isLoading, switchTenant, isMultiTenant: tenants.length > 1 }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenantContext() {
  return useContext(TenantContext);
}

export default TenantContext;

