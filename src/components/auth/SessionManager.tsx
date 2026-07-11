/**
 * @component SessionManager
 * @description Gerenciador de sessão com timeout de 24h e refresh automático
 */
import { logger } from '@/services/logger';
import { useEffect, useCallback, useRef } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Clock, Shield } from 'lucide-react';

interface SessionManagerProps {
  children: React.ReactNode;
}

// 24 hours in milliseconds
const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;
// Show warning 5 minutes before expiry
const WARNING_BEFORE = 5 * 60 * 1000;
// Refresh session every 23 hours
const REFRESH_INTERVAL = 23 * 60 * 60 * 1000;

export function SessionManager({ children }: SessionManagerProps) {
  const { user, signOut } = useAuth();
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleTimeout = useCallback(async () => {
    await signOut();
  }, [signOut]);

  const {
    isWarningVisible,
    extendSession,
    remainingTime,
  } = useSessionTimeout({
    timeout: SESSION_TIMEOUT,
    warningBefore: WARNING_BEFORE,
    onTimeout: handleTimeout,
    redirectTo: '/auth',
    disabled: !user,
  });

  // Auto-refresh session token
  const refreshSession = useCallback(async () => {
    try {
      const { error } = await supabase.auth.refreshSession();
      if (error) {
        logger.warn('[SessionManager] Failed to refresh session:', error.message);
      }
    } catch (err) {
      logger.error('[SessionManager] Session refresh error:', err);
    }
  }, []);

  // Setup auto-refresh interval
  useEffect(() => {
    if (!user) {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      return;
    }

    // Refresh immediately on mount
    refreshSession();

    // Setup interval for periodic refresh
    refreshIntervalRef.current = setInterval(refreshSession, REFRESH_INTERVAL);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [user, refreshSession]);

  // Format remaining time
  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Calculate progress (inverted - starts full, goes to 0)
  const progressValue = (remainingTime / WARNING_BEFORE) * 100;

  return (
    <>
      {children}

      <AlertDialog open={isWarningVisible && !!user}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-5 w-5 text-warning" />
              <AlertDialogTitle>Sessão Expirando</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="space-y-4">
              <p>
                Sua sessão vai expirar em <strong>{formatTime(remainingTime)}</strong>.
              </p>
              <p className="text-sm">
                Por segurança, você será desconectado automaticamente.
                Deseja continuar conectado?
              </p>
              <Progress value={progressValue} className="h-2" />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleTimeout}>
              Sair agora
            </AlertDialogCancel>
            <AlertDialogAction onClick={extendSession}>
              <Shield className="h-4 w-4 mr-2" />
              Continuar conectado
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default SessionManager;
