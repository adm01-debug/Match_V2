import React, { createContext, useContext, useState, useCallback } from 'react';

interface Tenant {
  id: string;
  name: string;
  logo?: string;
  primaryColor?: string;
  domain?: string;
}

interface TenantContextType {
  currentTenant: Tenant | null;
  setTenant: (tenant: Tenant) => void;
  clearTenant: () => void;
  isMultiTenant: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

const TENANT_KEY = 'match_ats_tenant';

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(() => {
    try {
      const stored = localStorage.getItem(TENANT_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const setTenant = useCallback((tenant: Tenant) => {
    setCurrentTenant(tenant);
    localStorage.setItem(TENANT_KEY, JSON.stringify(tenant));
  }, []);

  const clearTenant = useCallback(() => {
    setCurrentTenant(null);
    localStorage.removeItem(TENANT_KEY);
  }, []);

  return (
    <TenantContext.Provider value={{ currentTenant, setTenant, clearTenant, isMultiTenant: !!currentTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenantContext() {
  const ctx = useContext(TenantContext);
  if (!ctx) throw new Error('useTenantContext must be used within TenantProvider');
  return ctx;
}

export default TenantContext;
