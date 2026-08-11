/**
 * @fileoverview Login Lockout Alert Component
 * @description Exibe alertas de bloqueio e tentativas restantes
 */

import { memo } from 'react';
import { AlertTriangle, Lock, Clock } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

interface LoginLockoutAlertProps {
  isLocked: boolean;
  attemptsRemaining: number;
  lockoutTimeRemaining: string;
  className?: string;
}

export const LoginLockoutAlert = memo(({
  isLocked,
  attemptsRemaining,
  lockoutTimeRemaining,
  className
}: LoginLockoutAlertProps) => {
  if (isLocked) {
    return (
      <Alert variant="destructive" className={cn('border-destructive/50 bg-destructive/10', className)}>
        <Lock className="h-4 w-4" />
        <AlertTitle>Conta temporariamente bloqueada</AlertTitle>
        <AlertDescription className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5" />
          Tente novamente em {lockoutTimeRemaining}
        </AlertDescription>
      </Alert>
    );
  }

  if (attemptsRemaining <= 3 && attemptsRemaining > 0) {
    return (
      <Alert 
        variant="default" 
        className={cn(
          'border-warning/50 bg-warning/10',
          attemptsRemaining <= 2 && 'border-warning/50 bg-warning/10',
          className
        )}
      >
        <AlertTriangle className={cn(
          'h-4 w-4',
          attemptsRemaining <= 2 ? 'text-warning' : 'text-warning'
        )} />
        <AlertTitle className={cn(
          attemptsRemaining <= 2 ? 'text-warning dark:text-warning' : 'text-warning dark:text-warning'
        )}>
          Atenção
        </AlertTitle>
        <AlertDescription className={cn(
          attemptsRemaining <= 2 ? 'text-warning/80 dark:text-warning/80' : 'text-warning/80 dark:text-warning/80'
        )}>
          {attemptsRemaining === 1 
            ? 'Última tentativa antes do bloqueio temporário'
            : `${attemptsRemaining} tentativas restantes antes do bloqueio`
          }
        </AlertDescription>
      </Alert>
    );
  }

  return null;
});

LoginLockoutAlert.displayName = 'LoginLockoutAlert';

export default LoginLockoutAlert;
