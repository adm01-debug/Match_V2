/**
 * @component ReauthDialog
 * @description Dialog para re-autenticação em ações sensíveis
 */
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, Lock, AlertTriangle } from 'lucide-react';
import { useReauth, SensitiveAction } from '@/hooks/useReauth';

interface ReauthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: SensitiveAction;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

const ACTION_LABELS: Record<SensitiveAction, { title: string; description: string }> = {
  change_password: {
    title: 'Alterar Senha',
    description: 'Para alterar sua senha, confirme sua identidade.',
  },
  change_email: {
    title: 'Alterar Email',
    description: 'Para alterar seu email, confirme sua identidade.',
  },
  configure_mfa: {
    title: 'Configurar 2FA',
    description: 'Para modificar a autenticação de dois fatores, confirme sua identidade.',
  },
  admin_action: {
    title: 'Ação Administrativa',
    description: 'Esta ação requer confirmação de identidade.',
  },
  delete_account: {
    title: 'Excluir Conta',
    description: 'Para excluir sua conta, confirme sua identidade.',
  },
  export_data: {
    title: 'Exportar Dados',
    description: 'Para exportar seus dados, confirme sua identidade.',
  },
  manage_api_keys: {
    title: 'Gerenciar API Keys',
    description: 'Para gerenciar chaves de API, confirme sua identidade.',
  },
};

export function ReauthDialog({
  open,
  onOpenChange,
  action,
  onSuccess,
  title,
  description,
}: ReauthDialogProps) {
  const {
    isVerifying,
    error,
    is2FARequired,
    verifyPassword,
    verify2FA,
  } = useReauth();

  const [step, setStep] = useState<'password' | '2fa'>('password');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const actionLabel = ACTION_LABELS[action];

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const verified = await verifyPassword(password);
    
    if (verified) {
      if (is2FARequired) {
        setStep('2fa');
      } else {
        onSuccess();
        handleClose();
      }
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const verified = await verify2FA(code);
    
    if (verified) {
      onSuccess();
      handleClose();
    }
  };

  const handleClose = () => {
    setPassword('');
    setCode('');
    setStep('password');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <DialogTitle>{title || actionLabel.title}</DialogTitle>
          </div>
          <DialogDescription>
            {description || actionLabel.description}
          </DialogDescription>
        </DialogHeader>

        {step === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reauth-password">
                <Lock className="h-4 w-4 inline mr-2" />
                Senha atual
              </Label>
              <Input
                id="reauth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isVerifying || !password}>
                {isVerifying && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Continuar
              </Button>
            </div>
          </form>
        )}

        {step === '2fa' && (
          <form onSubmit={handle2FASubmit} className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Sua conta possui 2FA ativo. Digite o código do seu autenticador.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="reauth-2fa">Código de verificação</Label>
              <Input
                id="reauth-2fa"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="text-center text-2xl tracking-widest font-mono"
                autoComplete="one-time-code"
                required
              />
              <p className="text-xs text-muted-foreground">
                Ou use um código de backup (formato: XXXX-XXXX)
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setStep('password')}>
                Voltar
              </Button>
              <Button type="submit" disabled={isVerifying || code.length < 6}>
                {isVerifying && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Verificar
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ReauthDialog;
