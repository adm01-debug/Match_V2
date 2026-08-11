/**
 * @fileoverview Hook para verificar vazamento de senha
 */

import { useState, useEffect, useRef } from 'react';
import { checkPasswordBreach, BreachCheckResult } from '@/services/passwordBreachService';

interface UsePasswordBreachCheckOptions {
  debounceMs?: number;
  minLength?: number;
}

export const usePasswordBreachCheck = (
  password: string, 
  options: UsePasswordBreachCheckOptions = {}
) => {
  const { debounceMs = 500, minLength = 6 } = options;
  
  const [result, setResult] = useState<BreachCheckResult>({
    isBreached: false,
    count: 0,
    isLoading: false,
    error: null
  });
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Limpa timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Senha muito curta, não verifica
    if (!password || password.length < minLength) {
      setResult({ isBreached: false, count: 0, isLoading: false, error: null });
      return;
    }

    setResult(prev => ({ ...prev, isLoading: true }));

    // Debounce para evitar muitas requisições
    timeoutRef.current = setTimeout(async () => {
      const checkResult = await checkPasswordBreach(password);
      setResult(checkResult);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [password, debounceMs, minLength]);

  return result;
};
