/**
 * @fileoverview Hook para gerenciar bloqueio de login
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  checkLockoutStatus, 
  recordFailedAttempt, 
  clearLoginAttempts,
  LockoutStatus,
  formatLockoutTime
} from '@/services/loginLockoutService';

interface UseLoginLockoutReturn {
  lockoutStatus: LockoutStatus;
  isLocked: boolean;
  attemptsRemaining: number;
  lockoutTimeRemaining: string;
  handleFailedLogin: (email: string) => Promise<LockoutStatus>;
  handleSuccessfulLogin: (email: string) => Promise<void>;
  checkStatus: (email: string) => Promise<LockoutStatus>;
  isLoading: boolean;
}

export const useLoginLockout = (): UseLoginLockoutReturn => {
  const [lockoutStatus, setLockoutStatus] = useState<LockoutStatus>({
    isLocked: false,
    attemptsRemaining: 5,
    lockoutUntil: null,
    lockoutMinutes: 0
  });
  const [lockoutTimeRemaining, setLockoutTimeRemaining] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Atualizar tempo restante a cada segundo quando bloqueado
  useEffect(() => {
    if (!lockoutStatus.isLocked || !lockoutStatus.lockoutUntil) {
      setLockoutTimeRemaining('');
      return;
    }

    const updateTime = () => {
      const remaining = formatLockoutTime(lockoutStatus.lockoutUntil!);
      setLockoutTimeRemaining(remaining);

      // Se o tempo acabou, resetar status
      if (!remaining) {
        setLockoutStatus(prev => ({
          ...prev,
          isLocked: false,
          attemptsRemaining: 5,
          lockoutUntil: null,
          lockoutMinutes: 0
        }));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, [lockoutStatus.isLocked, lockoutStatus.lockoutUntil]);

  const checkStatus = useCallback(async (email: string): Promise<LockoutStatus> => {
    setIsLoading(true);
    try {
      const status = await checkLockoutStatus(email);
      setLockoutStatus(status);
      return status;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFailedLogin = useCallback(async (email: string): Promise<LockoutStatus> => {
    setIsLoading(true);
    try {
      const status = await recordFailedAttempt(email);
      setLockoutStatus(status);
      return status;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSuccessfulLogin = useCallback(async (email: string): Promise<void> => {
    await clearLoginAttempts(email);
    setLockoutStatus({
      isLocked: false,
      attemptsRemaining: 5,
      lockoutUntil: null,
      lockoutMinutes: 0
    });
  }, []);

  return {
    lockoutStatus,
    isLocked: lockoutStatus.isLocked,
    attemptsRemaining: lockoutStatus.attemptsRemaining,
    lockoutTimeRemaining,
    handleFailedLogin,
    handleSuccessfulLogin,
    checkStatus,
    isLoading
  };
};
