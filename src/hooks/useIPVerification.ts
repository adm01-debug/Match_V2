/**
 * @fileoverview IP Verification Hook
 * @module hooks/useIPVerification
 * @description Hook React para verificação de IP do cliente
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  getClientIP, 
  isIPAllowed, 
  type IPCheckResult 
} from '@/services/ipService';
import { IP_SECURITY_CONFIG } from '@/config/ipWhitelist';

interface UseIPVerificationResult {
  readonly isAllowed: boolean;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly clientIP: string | null;
  readonly checkResult: IPCheckResult | null;
  readonly error: Error | null;
  readonly recheck: () => void;
}

/**
 * Hook para verificar se o IP do cliente está autorizado
 * 
 * @example
 * ```tsx
 * const { isAllowed, isLoading, clientIP } = useIPVerification();
 * 
 * if (isLoading) return <Loading />;
 * if (!isAllowed) return <AccessDenied />;
 * return <App />;
 * ```
 */
export const useIPVerification = (): UseIPVerificationResult => {
  const [clientIP, setClientIP] = useState<string | null>(null);

  // Buscar IP do cliente
  const { 
    data: ip, 
    isLoading: isLoadingIP,
    error: ipError,
    refetch: refetchIP,
  } = useQuery({
    queryKey: ['client-ip'],
    queryFn: getClientIP,
    staleTime: IP_SECURITY_CONFIG.cacheTimeout,
    retry: 2,
    enabled: IP_SECURITY_CONFIG.enabled,
  });

  // Atualizar estado do IP
  useEffect(() => {
    if (ip) {
      setClientIP(ip);
    }
  }, [ip]);

  // Verificar se IP está permitido
  const {
    data: checkResult,
    isLoading: isCheckingIP,
    error: checkError,
    refetch: refetchCheck,
  } = useQuery({
    queryKey: ['ip-check', clientIP],
    queryFn: () => isIPAllowed(clientIP!),
    enabled: !!clientIP && IP_SECURITY_CONFIG.enabled,
    staleTime: IP_SECURITY_CONFIG.cacheTimeout,
    retry: 1,
  });

  // Função para reverificar
  const recheck = useCallback(() => {
    refetchIP();
    if (clientIP) {
      refetchCheck();
    }
  }, [refetchIP, refetchCheck, clientIP]);

  // Se a verificação está desabilitada, permitir acesso
  if (!IP_SECURITY_CONFIG.enabled) {
    return {
      isAllowed: true,
      isLoading: false,
      isError: false,
      clientIP: null,
      checkResult: null,
      error: null,
      recheck: () => {},
    };
  }

  const isLoading = isLoadingIP || isCheckingIP;
  const isError = !!ipError || !!checkError;
  const error = ipError || checkError || null;
  const isAllowed = checkResult?.allowed ?? false;

  return {
    isAllowed,
    isLoading,
    isError,
    clientIP,
    checkResult: checkResult ?? null,
    error: error as Error | null,
    recheck,
  };
};

useIPVerification.displayName = 'useIPVerification';

export default useIPVerification;
