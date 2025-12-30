/**
 * @module useSessionTimeout
 * @description Hook para gerenciar timeout de sessão com aviso prévio
 * @returns Hook state and methods
 * @example
 * const { isWarningVisible, extendSession, remainingTime } = useSessionTimeout({
 *   timeout: 30 * 60 * 1000, // 30 min
 *   warningBefore: 5 * 60 * 1000, // aviso 5 min antes
 *   onTimeout: () => supabase.auth.signOut(),
 * });
 */
import { useEffect, useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseSessionTimeoutOptions {
  /** Timeout total em ms (padrão: 30 min) */
  timeout?: number;
  /** Tempo antes do timeout para exibir aviso (padrão: 5 min) */
  warningBefore?: number;
  /** Callback quando sessão expira */
  onTimeout?: () => void;
  /** Callback quando aviso é exibido */
  onWarning?: () => void;
  /** Rota de redirecionamento após timeout */
  redirectTo?: string;
  /** Desabilitar timeout */
  disabled?: boolean;
}

interface UseSessionTimeoutReturn {
  /** Reinicia o timer manualmente */
  resetTimeout: () => void;
  /** Estende a sessão (fecha aviso e reinicia timer) */
  extendSession: () => void;
  /** Indica se o aviso de timeout está visível */
  isWarningVisible: boolean;
  /** Tempo restante em ms (atualizado a cada segundo quando aviso visível) */
  remainingTime: number;
  /** Indica se está ativo */
  isActive: boolean;
}

// Throttle helper para limitar chamadas
function throttle<T extends (...args: unknown[]) => void>(fn: T, limit: number): T {
  let lastCall = 0;
  return ((...args: unknown[]) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  }) as T;
}

export const useSessionTimeout = (options: UseSessionTimeoutOptions = {}): UseSessionTimeoutReturn => {
  const { 
    timeout = 30 * 60 * 1000, // 30 minutes default
    warningBefore = 5 * 60 * 1000, // 5 minutes warning
    onTimeout, 
    onWarning,
    redirectTo = '/auth',
    disabled = false,
  } = options; 

  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  
  const [isWarningVisible, setIsWarningVisible] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isActive, setIsActive] = useState(!disabled);

  // Limpar todos os timers
  const clearAllTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
      warningRef.current = null;
    }
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  }, []);

  // Iniciar countdown quando aviso é exibido
  const startCountdown = useCallback((initialTime: number) => {
    setRemainingTime(initialTime);
    
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    
    countdownRef.current = setInterval(() => {
      if (isMountedRef.current) {
        setRemainingTime(prev => {
          if (prev <= 1000) {
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
            }
            return 0;
          }
          return prev - 1000;
        });
      }
    }, 1000);
  }, []);

  // Handler de timeout final
  const handleTimeout = useCallback(() => {
    if (!isMountedRef.current) return;
    
    clearAllTimers();
    setIsWarningVisible(false);
    setIsActive(false);
    
    onTimeout?.();
    navigate(redirectTo);
  }, [clearAllTimers, onTimeout, navigate, redirectTo]);

  // Handler de aviso
  const handleWarning = useCallback(() => {
    if (!isMountedRef.current) return;
    
    setIsWarningVisible(true);
    startCountdown(warningBefore);
    onWarning?.();
  }, [warningBefore, startCountdown, onWarning]);

  // Reset do timeout
  const resetTimeout = useCallback(() => {
    if (disabled) return;
    
    clearAllTimers();
    
    if (!isMountedRef.current) return;
    
    setIsWarningVisible(false);
    setIsActive(true);

    // Timer para exibir aviso
    const warningTime = timeout - warningBefore;
    if (warningTime > 0 && warningBefore > 0) {
      warningRef.current = setTimeout(handleWarning, warningTime);
    }

    // Timer para timeout final
    timeoutRef.current = setTimeout(handleTimeout, timeout);
  }, [disabled, timeout, warningBefore, clearAllTimers, handleWarning, handleTimeout]);

  // Estender sessão (chamado quando usuário clica para continuar)
  const extendSession = useCallback(() => {
    setIsWarningVisible(false);
    setRemainingTime(0);
    resetTimeout();
  }, [resetTimeout]);

  // Throttled reset para performance
  const throttledReset = useCallback(
    throttle(resetTimeout, 10000), // Max uma vez a cada 10 segundos
    [resetTimeout]
  );

  useEffect(() => {
    isMountedRef.current = true;

    if (disabled) {
      clearAllTimers();
      setIsActive(false);
      return;
    }

    const events: (keyof DocumentEventMap)[] = [
      'mousedown', 
      'keypress', 
      'scroll', 
      'touchstart',
      'click',
    ];
    
    // Usar throttled version para eventos frequentes
    events.forEach(event => {
      document.addEventListener(event, throttledReset, { passive: true });
    });

    // Iniciar timer
    resetTimeout();

    return () => {
      isMountedRef.current = false;
      clearAllTimers();
      events.forEach(event => {
        document.removeEventListener(event, throttledReset);
      });
    };
  }, [disabled, throttledReset, resetTimeout, clearAllTimers]);

  return { 
    resetTimeout, 
    extendSession,
    isWarningVisible, 
    remainingTime,
    isActive,
  };
};

export default useSessionTimeout;
