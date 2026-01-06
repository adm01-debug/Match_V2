import { createContext, useContext, useState, ReactNode } from 'react';

interface Tenant { 
  id: string; 
  name: string; 
  slug: string; 
  logo_url?: string; 
  settings?: Record<string, unknown>; 
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
  const [tenant] = useState<Tenant | null>(null);
  const [tenants] = useState<Tenant[]>([]);
  const [isLoading] = useState(false);

  const switchTenant = async (tenantId: string) => {
    const newTenant = tenants.find(t => t.id === tenantId);
    if (newTenant) { 
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

