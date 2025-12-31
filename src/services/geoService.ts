/**
 * @fileoverview Geographic Verification Service
 * @module services/geoService
 * @description Serviço para verificação e gerenciamento de bloqueio geográfico
 */

import { supabase } from '@/integrations/supabase/client';
import { getClientIP } from './ipService';

export interface GeoCheckResult {
  readonly allowed: boolean;
  readonly countryCode: string | null;
  readonly countryName: string | null;
  readonly ip: string;
  readonly reason: string;
  readonly checkedAt: string;
}

export interface AllowedCountry {
  readonly id: string;
  readonly countryCode: string;
  readonly countryName: string;
  readonly isActive: boolean;
  readonly createdAt: string;
}

interface GeoCacheEntry {
  result: GeoCheckResult;
  timestamp: number;
}

// Cache local para evitar requisições repetidas
const geoCache = new Map<string, GeoCacheEntry>();
const GEO_CACHE_TIMEOUT = 5 * 60 * 1000; // 5 minutos

/**
 * Configurações de bloqueio geográfico
 */
export const GEO_SECURITY_CONFIG = {
  enabled: true,
  allowDevBypass: true,
  cacheTimeout: GEO_CACHE_TIMEOUT,
  blockedMessage: 'Acesso não autorizado. Seu país não está na lista de permitidos.',
  logAttempts: true,
} as const;

/**
 * Verifica se estamos em ambiente de desenvolvimento
 */
const isDevelopment = (): boolean => {
  return import.meta.env.DEV || 
         import.meta.env.MODE === 'development' ||
         window.location.hostname === 'localhost';
};

/**
 * Verifica se o país do IP está na whitelist
 */
export const checkGeoLocation = async (ip?: string): Promise<GeoCheckResult> => {
  const clientIP = ip || await getClientIP();
  const now = Date.now();
  const checkedAt = new Date().toISOString();

  // Verificar cache
  const cached = geoCache.get(clientIP);
  if (cached && (now - cached.timestamp) < GEO_SECURITY_CONFIG.cacheTimeout) {
    return cached.result;
  }

  // Bypass para desenvolvimento
  if (GEO_SECURITY_CONFIG.allowDevBypass && isDevelopment()) {
    const result: GeoCheckResult = {
      allowed: true,
      countryCode: 'DEV',
      countryName: 'Desenvolvimento',
      ip: clientIP,
      reason: 'Ambiente de desenvolvimento',
      checkedAt,
    };
    geoCache.set(clientIP, { result, timestamp: now });
    return result;
  }

  try {
    // Chamar Edge Function para verificação
    const { data, error } = await supabase.functions.invoke('geo-check', {
      body: { ip: clientIP },
    });

    if (error) {
      console.error('Erro na verificação geográfica:', error);
      // Em caso de erro, permitir acesso (fail-open)
      const result: GeoCheckResult = {
        allowed: true,
        countryCode: null,
        countryName: null,
        ip: clientIP,
        reason: 'Erro na verificação - acesso permitido por precaução',
        checkedAt,
      };
      return result;
    }

    const result: GeoCheckResult = {
      allowed: data.allowed,
      countryCode: data.country_code,
      countryName: data.country_name,
      ip: clientIP,
      reason: data.reason,
      checkedAt,
    };

    geoCache.set(clientIP, { result, timestamp: now });
    return result;

  } catch (error) {
    console.error('Erro na verificação geográfica:', error);
    // Fail-open em caso de erro
    const result: GeoCheckResult = {
      allowed: true,
      countryCode: null,
      countryName: null,
      ip: clientIP,
      reason: 'Erro na verificação - acesso permitido por precaução',
      checkedAt,
    };
    return result;
  }
};

/**
 * Obtém países permitidos do banco de dados
 */
export const getAllowedCountries = async (): Promise<AllowedCountry[]> => {
  try {
    const { data, error } = await supabase
      .from('allowed_countries')
      .select('*')
      .order('country_name');

    if (error) {
      console.error('Erro ao buscar países:', error);
      return [];
    }

    return (data || []).map(row => ({
      id: row.id,
      countryCode: row.country_code,
      countryName: row.country_name,
      isActive: row.is_active,
      createdAt: row.created_at,
    }));
  } catch (error) {
    console.error('Erro ao buscar países:', error);
    return [];
  }
};

/**
 * Adiciona um país à whitelist
 */
export const addCountryToWhitelist = async (
  countryCode: string,
  countryName: string
): Promise<boolean> => {
  try {
    const { error } = await supabase.from('allowed_countries').insert({
      country_code: countryCode.toUpperCase(),
      country_name: countryName,
      is_active: true,
    });

    if (error) {
      console.error('Erro ao adicionar país:', error);
      return false;
    }

    clearGeoCache();
    return true;
  } catch (error) {
    console.error('Erro ao adicionar país:', error);
    return false;
  }
};

/**
 * Remove um país da whitelist
 */
export const removeCountryFromWhitelist = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('allowed_countries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Erro ao remover país:', error);
      return false;
    }

    clearGeoCache();
    return true;
  } catch (error) {
    console.error('Erro ao remover país:', error);
    return false;
  }
};

/**
 * Atualiza o status de um país
 */
export const toggleCountryStatus = async (
  id: string, 
  isActive: boolean
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('allowed_countries')
      .update({ is_active: isActive })
      .eq('id', id);

    if (error) {
      console.error('Erro ao atualizar país:', error);
      return false;
    }

    clearGeoCache();
    return true;
  } catch (error) {
    console.error('Erro ao atualizar país:', error);
    return false;
  }
};

/**
 * Limpa o cache de geolocalização
 */
export const clearGeoCache = (): void => {
  geoCache.clear();
};
