/**
 * @module useSessionTimeout
 * @description Hook para gerenciar timeout de sessão
 * @returns Hook state and methods
 * @example
 * const result = useSessionTimeout();
 */
import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseSessionTimeoutOptions {
  timeout?: number; // in milliseconds
  onTimeout?: () => void;
}

export const useSessionTimeout = (options: UseSessionTimeoutOptions = {}) => {
  const { timeout = 30 * 60 * 1000, onTimeout } = options; // 30 minutes default
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout>();

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      onTimeout?.();
      navigate('/auth');
    }, timeout);
  }, [timeout, onTimeout, navigate]);

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach(event => {
      document.addEventListener(event, resetTimeout);
    });

    resetTimeout();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetTimeout);
      });
    };
  }, [resetTimeout]);

  return { resetTimeout };
};
