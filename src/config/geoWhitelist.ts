/**
 * @fileoverview Geographic Whitelist Configuration
 * @module config/geoWhitelist
 * @description Configuração de países permitidos para acesso ao sistema
 */

export interface AllowedCountry {
  readonly code: string;
  readonly name: string;
  readonly isActive: boolean;
}

/**
 * Configurações de segurança geográfica
 */
export const GEO_SECURITY_CONFIG = {
  /** Habilitar verificação geográfica */
  enabled: true,
  
  /** Permitir bypass em desenvolvimento */
  allowDevBypass: true,
  
  /** Tempo de cache em ms (5 minutos) */
  cacheTimeout: 5 * 60 * 1000,
  
  /** Mensagem exibida quando país é bloqueado */
  blockedMessage: 'Acesso não autorizado. Seu país não está na lista de permitidos.',
  
  /** Log de tentativas bloqueadas */
  logBlockedAttempts: true,
  
  /** Notificar admin sobre tentativas bloqueadas */
  notifyAdmin: true,
} as const;

export type GeoSecurityConfig = typeof GEO_SECURITY_CONFIG;
