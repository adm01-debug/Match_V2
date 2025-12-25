/**
 * @fileoverview IP Whitelist Configuration
 * @module config/ipWhitelist
 * @description Configuração de IPs permitidos para acesso ao sistema
 * 
 * IMPORTANTE: Para adicionar/remover IPs, edite este arquivo ou
 * use a tabela `allowed_ips` no banco de dados para gerenciamento dinâmico.
 */

export interface AllowedIP {
  readonly ip: string;
  readonly description: string;
  readonly addedAt: string;
  readonly addedBy: string;
  readonly isActive: boolean;
}

/**
 * Lista estática de IPs permitidos (fallback)
 * Para produção, use a tabela `allowed_ips` no Supabase
 */
export const STATIC_ALLOWED_IPS: readonly AllowedIP[] = [
  {
    ip: '127.0.0.1',
    description: 'Localhost development',
    addedAt: '2024-12-25',
    addedBy: 'system',
    isActive: true,
  },
  {
    ip: '::1',
    description: 'Localhost IPv6',
    addedAt: '2024-12-25',
    addedBy: 'system',
    isActive: true,
  },
  // Adicione IPs da empresa aqui
  // {
  //   ip: '203.0.113.50',
  //   description: 'Escritório Principal',
  //   addedAt: '2024-12-25',
  //   addedBy: 'admin',
  //   isActive: true,
  // },
] as const;

/**
 * IPs que sempre são permitidos (desenvolvimento)
 */
export const DEVELOPMENT_IPS = ['127.0.0.1', '::1', 'localhost'] as const;

/**
 * Verifica se estamos em ambiente de desenvolvimento
 */
export const isDevelopment = (): boolean => {
  return import.meta.env.DEV || 
         import.meta.env.MODE === 'development' ||
         window.location.hostname === 'localhost';
};

/**
 * Configurações de segurança
 */
export const IP_SECURITY_CONFIG = {
  /** Habilitar verificação de IP */
  enabled: true,
  
  /** Permitir bypass em desenvolvimento */
  allowDevBypass: true,
  
  /** Tempo de cache do IP em ms (5 minutos) */
  cacheTimeout: 5 * 60 * 1000,
  
  /** Mensagem exibida quando IP é bloqueado */
  blockedMessage: 'Acesso não autorizado. Seu IP não está na lista de permitidos.',
  
  /** URL para redirecionamento quando bloqueado */
  blockedRedirect: '/acesso-negado',
  
  /** Log de tentativas bloqueadas */
  logBlockedAttempts: true,
  
  /** Notificar admin sobre tentativas bloqueadas */
  notifyAdmin: true,
} as const;

export type IPSecurityConfig = typeof IP_SECURITY_CONFIG;
