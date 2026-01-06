/**
 * Hook para Multi-Tenancy (localStorage-based)
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

interface TenantSettings { 
  theme?: string; 
  logo_url?: string; 
  custom_domain?: string; 
  features?: string[]; 
}

interface TenantMember {
  id: string;
  tenant_id: string;
  user_id: string;
  role: string;
  name: string;
}

function getStorageKey(): string {
  return 'current_tenant';
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function useTenant() {
  const { toast } = useToast();
  
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [settings, setSettings] = useState<TenantSettings>({});
  const [members, setMembers] = useState<TenantMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage
  useEffect(() => {
    try {
      const storedTenant = localStorage.getItem(getStorageKey());
      const storedTenants = localStorage.getItem('tenants');
      const storedSettings = localStorage.getItem('tenant_settings');
      
      if (storedTenant) setTenant(JSON.parse(storedTenant));
      if (storedTenants) setTenants(JSON.parse(storedTenants));
      if (storedSettings) setSettings(JSON.parse(storedSettings));
      
      // Default tenant if none exists
      if (!storedTenants) {
        const defaultTenant: Tenant = {
          id: generateId(),
          name: 'Default Organization',
          slug: 'default',
          created_at: new Date().toISOString(),
        };
        setTenants([defaultTenant]);
        setTenant(defaultTenant);
        localStorage.setItem('tenants', JSON.stringify([defaultTenant]));
        localStorage.setItem(getStorageKey(), JSON.stringify(defaultTenant));
      }
    } catch (e) {
      console.error('Error loading tenant:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const isMultiTenant = useMemo(() => tenants.length > 1, [tenants]);

  const switchTenant = useCallback(async (tenantId: string) => {
    const newTenant = tenants.find(t => t.id === tenantId);
    if (newTenant) {
      setTenant(newTenant);
      localStorage.setItem(getStorageKey(), JSON.stringify(newTenant));
      toast({ title: 'Organização alterada', description: `Mudou para ${newTenant.name}` });
    }
  }, [tenants, toast]);

  const updateSettings = useCallback((newSettings: Partial<TenantSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('tenant_settings', JSON.stringify(updated));
    toast({ title: 'Configurações salvas' });
  }, [settings, toast]);

  const inviteMember = useCallback(async ({ email, role }: { email: string; role: string }) => {
    if (!tenant) return;
    
    const newMember: TenantMember = {
      id: generateId(),
      tenant_id: tenant.id,
      user_id: generateId(),
      role,
      name: email.split('@')[0] || email,
    };
    
    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    localStorage.setItem('tenant_members', JSON.stringify(updatedMembers));
    
    toast({ title: 'Convite enviado', description: `Convite enviado para ${email}` });
  }, [tenant, members, toast]);

  return { 
    tenant, 
    tenants, 
    settings, 
    members, 
    isMultiTenant, 
    isLoading,
    switchTenant, 
    updateSettings, 
    inviteMember,
  };
}

export default useTenant;
