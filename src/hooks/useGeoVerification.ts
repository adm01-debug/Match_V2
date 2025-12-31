/**
 * @fileoverview Geographic Verification Hook
 * @module hooks/useGeoVerification
 * @description Hook React para verificação de geolocalização do cliente
 */

import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  checkGeoLocation, 
  GEO_SECURITY_CONFIG,
  type GeoCheckResult 
} from '@/services/geoService';

interface UseGeoVerificationResult {
  readonly isAllowed: boolean;
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly clientIP: string | null;
  readonly countryCode: string | null;
  readonly countryName: string | null;
  readonly checkResult: GeoCheckResult | null;
  readonly error: Error | null;
  readonly recheck: () => void;
}

/**
 * Hook para verificar se o país do cliente está autorizado
 * 
 * @example
 * ```tsx
 * const { isAllowed, isLoading, countryName } = useGeoVerification();
 * 
 * if (isLoading) return <Loading />;
 * if (!isAllowed) return <AccessDenied country={countryName} />;
 * return <App />;
 * ```
 */
export const useGeoVerification = (): UseGeoVerificationResult => {
  const [clientIP, setClientIP] = useState<string | null>(null);

  const { 
    data: checkResult, 
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['geo-check'],
    queryFn: () => checkGeoLocation(),
    staleTime: GEO_SECURITY_CONFIG.cacheTimeout,
    retry: 2,
    enabled: GEO_SECURITY_CONFIG.enabled,
  });

  useEffect(() => {
    if (checkResult?.ip) {
      setClientIP(checkResult.ip);
    }
  }, [checkResult]);

  const recheck = useCallback(() => {
    refetch();
  }, [refetch]);

  // Se a verificação está desabilitada, permitir acesso
  if (!GEO_SECURITY_CONFIG.enabled) {
    return {
      isAllowed: true,
      isLoading: false,
      isError: false,
      clientIP: null,
      countryCode: null,
      countryName: null,
      checkResult: null,
      error: null,
      recheck: () => {},
    };
  }

  const isError = !!error;
  const isAllowed = checkResult?.allowed ?? false;

  return {
    isAllowed,
    isLoading,
    isError,
    clientIP,
    countryCode: checkResult?.countryCode ?? null,
    countryName: checkResult?.countryName ?? null,
    checkResult: checkResult ?? null,
    error: error as Error | null,
    recheck,
  };
};

export default useGeoVerification;
