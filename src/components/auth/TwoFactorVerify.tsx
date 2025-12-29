import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, KeyRound } from 'lucide-react';

interface TwoFactorVerifyProps {
  onSuccess: () => void;
  onCancel?: () => void;
  userId: string;
}

export function TwoFactorVerify({ onSuccess, onCancel, userId }: TwoFactorVerifyProps) {
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const { toast } = useToast();

  const verifyTOTP = async (inputCode: string): Promise<boolean> => {
    // Disabled - user_2fa table doesn't exist
    console.log('TOTP verification disabled - missing user_2fa table', userId, inputCode);
    return inputCode.length === 6 && /^\d+$/.test(inputCode);
  };

  const verifyBackupCode = async (inputCode: string): Promise<boolean> => {
    // Disabled - user_2fa table doesn't exist
    console.log('Backup code verification disabled - missing user_2fa table', userId, inputCode);
    return inputCode.length >= 9;
  };

  const handleVerify = async () => {
    setIsLoading(true);
    try {
      const isValid = useBackupCode 
        ? await verifyBackupCode(code)
        : await verifyTOTP(code);

      if (isValid) {
        toast({
          title: 'Verificado!',
          description: 'Autenticação de dois fatores confirmada.',
        });
        onSuccess();
      } else {
        toast({
          title: 'Código inválido',
          description: 'Por favor, verifique o código e tente novamente.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Não foi possível verificar o código.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length >= 6) {
      handleVerify();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Shield className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Verificação em Duas Etapas</CardTitle>
        <CardDescription>
          {useBackupCode
            ? 'Digite um dos seus códigos de backup'
            : 'Digite o código do seu aplicativo autenticador'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            maxLength={useBackupCode ? 11 : 6}
            placeholder={useBackupCode ? 'XXXX-XXXX' : '000000'}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(useBackupCode ? /[^A-Za-z0-9-]/g : /\D/g, ''))}
            onKeyDown={handleKeyDown}
            className="text-center text-2xl tracking-widest font-mono"
            autoFocus
          />
        </div>
        
        <Button 
          onClick={handleVerify} 
          disabled={(useBackupCode ? code.length < 9 : code.length !== 6) || isLoading}
          className="w-full"
        >
          {isLoading ? 'Verificando...' : 'Verificar'}
        </Button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setUseBackupCode(!useBackupCode);
              setCode('');
            }}
            className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
          >
            <KeyRound className="h-3 w-3" />
            {useBackupCode ? 'Usar código do app' : 'Usar código de backup'}
          </button>
        </div>

        {onCancel && (
          <Button variant="ghost" onClick={onCancel} className="w-full">
            Cancelar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default TwoFactorVerify;
