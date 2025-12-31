/**
 * @fileoverview Password Strength Indicator
 * @description Componente visual para indicar força da senha em tempo real
 */

import { memo, useMemo } from 'react';
import { Check, X, AlertTriangle, Shield, ShieldAlert, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePasswordBreachCheck } from '@/hooks/usePasswordBreachCheck';

interface PasswordStrengthProps {
  readonly password: string;
  readonly showRequirements?: boolean;
  readonly checkBreach?: boolean;
  readonly className?: string;
}

interface StrengthResult {
  score: number;
  level: 'weak' | 'fair' | 'good' | 'strong';
  label: string;
  color: string;
  bgColor: string;
}

interface Requirement {
  id: string;
  label: string;
  met: boolean;
  loading?: boolean;
  critical?: boolean;
}

/**
 * Calcula a força da senha
 */
const calculateStrength = (password: string): StrengthResult => {
  let score = 0;

  if (!password) {
    return { score: 0, level: 'weak', label: 'Muito fraca', color: 'bg-destructive', bgColor: 'bg-destructive/20' };
  }

  // Comprimento
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;

  // Complexidade
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^a-zA-Z0-9]/.test(password)) score += 1;

  // Penalidades
  if (/^[a-zA-Z]+$/.test(password)) score -= 1; // Só letras
  if (/^[0-9]+$/.test(password)) score -= 2; // Só números
  if (/(.)\1{2,}/.test(password)) score -= 1; // Caracteres repetidos

  // Bônus
  if (password.length >= 12 && /[^a-zA-Z0-9]/.test(password)) score += 1;

  // Normalizar score
  score = Math.max(0, Math.min(score, 7));

  if (score <= 2) {
    return { score, level: 'weak', label: 'Fraca', color: 'bg-destructive', bgColor: 'bg-destructive/20' };
  }
  if (score <= 4) {
    return { score, level: 'fair', label: 'Razoável', color: 'bg-yellow-500', bgColor: 'bg-yellow-500/20' };
  }
  if (score <= 5) {
    return { score, level: 'good', label: 'Boa', color: 'bg-blue-500', bgColor: 'bg-blue-500/20' };
  }
  return { score, level: 'strong', label: 'Forte', color: 'bg-green-500', bgColor: 'bg-green-500/20' };
};

/**
 * Verifica os requisitos da senha
 */
const getRequirements = (password: string): Requirement[] => [
  {
    id: 'length',
    label: 'Mínimo 8 caracteres',
    met: password.length >= 8,
  },
  {
    id: 'lowercase',
    label: 'Uma letra minúscula',
    met: /[a-z]/.test(password),
  },
  {
    id: 'uppercase',
    label: 'Uma letra maiúscula',
    met: /[A-Z]/.test(password),
  },
  {
    id: 'number',
    label: 'Um número',
    met: /[0-9]/.test(password),
  },
  {
    id: 'special',
    label: 'Um caractere especial',
    met: /[^a-zA-Z0-9]/.test(password),
  },
];

/**
 * Barra de força visual
 */
const StrengthBar = memo(({ strength }: { strength: StrengthResult }) => {
  const segments = 4;
  const filledSegments = 
    strength.level === 'weak' ? 1 :
    strength.level === 'fair' ? 2 :
    strength.level === 'good' ? 3 : 4;

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-2 flex-1 rounded-full transition-all duration-300',
              i < filledSegments ? strength.color : 'bg-muted'
            )}
          />
        ))}
      </div>
      <div className="flex justify-between items-center">
        <span className={cn(
          'text-xs font-medium',
          strength.level === 'weak' && 'text-destructive',
          strength.level === 'fair' && 'text-yellow-600 dark:text-yellow-500',
          strength.level === 'good' && 'text-blue-600 dark:text-blue-500',
          strength.level === 'strong' && 'text-green-600 dark:text-green-500'
        )}>
          {strength.label}
        </span>
        {strength.level === 'strong' && (
          <Check className="h-4 w-4 text-green-500" />
        )}
        {strength.level === 'weak' && (
          <AlertTriangle className="h-4 w-4 text-destructive" />
        )}
      </div>
    </div>
  );
});
StrengthBar.displayName = 'StrengthBar';

/**
 * Lista de requisitos
 */
const RequirementsList = memo(({ requirements }: { requirements: Requirement[] }) => (
  <ul className="space-y-1.5 mt-3">
    {requirements.map((req) => (
      <li
        key={req.id}
        className={cn(
          'flex items-center gap-2 text-xs transition-colors',
          req.loading && 'text-muted-foreground',
          !req.loading && req.met && !req.critical && 'text-green-600 dark:text-green-500',
          !req.loading && !req.met && !req.critical && 'text-muted-foreground',
          !req.loading && req.critical && !req.met && 'text-destructive font-medium'
        )}
      >
        {req.loading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : req.met ? (
          req.critical ? (
            <ShieldAlert className="h-3.5 w-3.5 text-destructive" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )
        ) : (
          req.critical ? (
            <Shield className="h-3.5 w-3.5" />
          ) : (
            <X className="h-3.5 w-3.5" />
          )
        )}
        {req.label}
      </li>
    ))}
  </ul>
));
RequirementsList.displayName = 'RequirementsList';

/**
 * Componente principal de força de senha
 */
export const PasswordStrengthIndicator = memo(({ 
  password, 
  showRequirements = true,
  checkBreach = true,
  className 
}: PasswordStrengthProps) => {
  const strength = useMemo(() => calculateStrength(password), [password]);
  const baseRequirements = useMemo(() => getRequirements(password), [password]);
  const breachCheck = usePasswordBreachCheck(password, { debounceMs: 600, minLength: 6 });

  const requirements = useMemo(() => {
    if (!checkBreach) return baseRequirements;
    
    return [
      ...baseRequirements,
      {
        id: 'breach',
        label: breachCheck.isLoading 
          ? 'Verificando vazamentos...' 
          : breachCheck.isBreached 
            ? `Senha vazada (${breachCheck.count.toLocaleString()}x)` 
            : 'Não encontrada em vazamentos',
        met: breachCheck.isBreached,
        loading: breachCheck.isLoading,
        critical: true
      }
    ];
  }, [baseRequirements, checkBreach, breachCheck]);

  if (!password) return null;

  return (
    <div className={cn('space-y-2', className)}>
      <StrengthBar strength={strength} />
      {showRequirements && <RequirementsList requirements={requirements} />}
    </div>
  );
});

PasswordStrengthIndicator.displayName = 'PasswordStrengthIndicator';

/**
 * Hook para validar força mínima
 */
export const usePasswordStrength = (password: string, minLevel: 'weak' | 'fair' | 'good' | 'strong' = 'fair') => {
  const strength = useMemo(() => calculateStrength(password), [password]);
  const requirements = useMemo(() => getRequirements(password), [password]);
  const breachCheck = usePasswordBreachCheck(password, { debounceMs: 600, minLength: 6 });
  
  const levelOrder = { weak: 0, fair: 1, good: 2, strong: 3 };
  const isValid = levelOrder[strength.level] >= levelOrder[minLevel] && !breachCheck.isBreached;
  const allRequirementsMet = requirements.every(r => r.met);

  return {
    strength,
    requirements,
    isValid,
    allRequirementsMet,
    breachCheck,
  };
};

export default PasswordStrengthIndicator;
