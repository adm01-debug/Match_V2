/**
 * @fileoverview IP Verification Service
 * @module services/ipService
 * @description Serviço para verificação e gerenciamento de IPs permitidos
 */

import { supabase } from '@/integrations/supabase/client';
import { 
  STATIC_ALLOWED_IPS, 
  DEVELOPMENT_IPS, 
  IP_SECURITY_CONFIG,
  isDevelopment,
  type AllowedIP 
} from '@/config/ipWhitelist';

interface IPCheckResult {
  readonly allowed: boolean;
  readonly ip: string;
  readonly reason: string;
  readonly checkedAt: string;
}

interface IPCacheEntry {
  result: IPCheckResult;
  timestamp: number;
}

// Cache local para evitar requisições repetidas
const ipCache = new Map<string, IPCacheEntry>();

/**
 * Obtém o IP do cliente atual
 */
export const getClientIP = async (): Promise<string> => {
  try {
    // Tenta obter via API externa
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    // console.warn('Não foi possível obter IP externo, usando fallback');
    // Fallback para desenvolvimento
    return '127.0.0.1';
  }
};

/**
 * Obtém IPs permitidos do banco de dados
 */
export const getAllowedIPsFromDB = async (): Promise<AllowedIP[]> => {
  try {
    const { data, error } = await supabase
      .from('allowed_ips')
      .select('*')
      .eq('is_active', true);

    if (error) {
      // console.error('Erro ao buscar IPs do banco:', error);
      return [];
    }

    return (data || []).map(row => ({
      ip: row.ip_address,
      description: row.description ?? '',
      addedAt: row.created_at,
      addedBy: row.added_by ?? '',
      isActive: row.is_active,
    }));
  } catch (error) {
    // console.error('Erro ao buscar IPs:', error);
    return [];
  }
};

/**
 * Verifica se um IP está na whitelist
 */
export const isIPAllowed = async (ip: string): Promise<IPCheckResult> => {
  const now = Date.now();
  const checkedAt = new Date().toISOString();

  // Verificar cache
  const cached = ipCache.get(ip);
  if (cached && (now - cached.timestamp) < IP_SECURITY_CONFIG.cacheTimeout) {
    return cached.result;
  }

  // Bypass para desenvolvimento
  if (IP_SECURITY_CONFIG.allowDevBypass && isDevelopment()) {
    const result: IPCheckResult = {
      allowed: true,
      ip,
      reason: 'Ambiente de desenvolvimento',
      checkedAt,
    };
    ipCache.set(ip, { result, timestamp: now });
    return result;
  }

  // Verificar IPs de desenvolvimento
  if (DEVELOPMENT_IPS.includes(ip as typeof DEVELOPMENT_IPS[number])) {
    const result: IPCheckResult = {
      allowed: true,
      ip,
      reason: 'IP de desenvolvimento local',
      checkedAt,
    };
    ipCache.set(ip, { result, timestamp: now });
    return result;
  }

  // Verificar lista estática
  const staticAllowed = STATIC_ALLOWED_IPS.find(
    entry => entry.ip === ip && entry.isActive
  );
  if (staticAllowed) {
    const result: IPCheckResult = {
      allowed: true,
      ip,
      reason: `Lista estática: ${staticAllowed.description}`,
      checkedAt,
    };
    ipCache.set(ip, { result, timestamp: now });
    return result;
  }

  // Verificar banco de dados
  const dbAllowed = await getAllowedIPsFromDB();
  const dbMatch = dbAllowed.find(entry => entry.ip === ip);
  
  if (dbMatch) {
    const result: IPCheckResult = {
      allowed: true,
      ip,
      reason: `Banco de dados: ${dbMatch.description}`,
      checkedAt,
    };
    ipCache.set(ip, { result, timestamp: now });
    return result;
  }

  // IP não permitido
  const result: IPCheckResult = {
    allowed: false,
    ip,
    reason: IP_SECURITY_CONFIG.blockedMessage,
    checkedAt,
  };
  
  // Log de tentativa bloqueada
  if (IP_SECURITY_CONFIG.logBlockedAttempts) {
    await logBlockedAttempt(ip, result.reason);
  }

  ipCache.set(ip, { result, timestamp: now });
  return result;
};

/**
 * Registra tentativa de acesso bloqueada
 */
export const logBlockedAttempt = async (
  ip: string, 
  _reason: string
): Promise<void> => {
  try {
    await supabase.from('ip_access_logs').insert({
      ip_address: ip,
      action: 'BLOCKED',
      allowed: false,
      user_agent: navigator.userAgent,
    });
  } catch (error) {
    // console.error('Erro ao registrar tentativa bloqueada:', error);
  }
};

/**
 * Adiciona um novo IP à whitelist
 */
export const addIPToWhitelist = async (
  ip: string,
  description: string,
  addedBy: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('allowed_ips').insert({
      ip_address: ip,
      description,
      added_by: addedBy,
      is_active: true,
    });

    if (error) {
      // console.error('Erro ao adicionar IP:', error);
      return false;
    }

    // Limpar cache
    ipCache.delete(ip);
    return true;
  } catch (error) {
    // console.error('Erro ao adicionar IP:', error);
    return false;
  }
};

/**
 * Remove um IP da whitelist
 */
export const removeIPFromWhitelist = async (ip: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('allowed_ips')
      .update({ is_active: false })
      .eq('ip_address', ip);

    if (error) {
      // console.error('Erro ao remover IP:', error);
      return false;
    }

    // Limpar cache
    ipCache.delete(ip);
    return true;
  } catch (error) {
    // console.error('Erro ao remover IP:', error);
    return false;
  }
};

/**
 * Limpa o cache de IPs
 */
export const clearIPCache = (): void => {
  ipCache.clear();
};

export type { IPCheckResult, AllowedIP };

