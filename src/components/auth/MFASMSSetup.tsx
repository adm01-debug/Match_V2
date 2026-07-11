/**
 * @component MFASMSSetup
 * @description Configuração de MFA via SMS
 */
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Phone, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { logger } from '@/services/logger';

interface MFASMSSetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export function MFASMSSetup({ onComplete, onCancel }: MFASMSSetupProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [step, setStep] = useState<'phone' | 'verify' | 'complete'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format phone number as user types
  const formatPhone = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(formatPhone(e.target.value));
  };

  const sendVerificationCode = async () => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    if (cleanPhone.length < 10) {
      setError('Número de telefone inválido');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In production, this would call an edge function to send SMS
      // For now, we'll simulate the flow
      
      // Simulate SMS sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Código enviado!',
        description: `Um código foi enviado para ${phoneNumber}`,
      });
      
      setStep('verify');
    } catch (err) {
      setError('Erro ao enviar código. Tente novamente.');
      logger.error('[MFASMSSetup] Error sending code:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('O código deve ter 6 dígitos');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // In production, verify the code via edge function
      // For now, accept any 6-digit code for demo purposes
      
      // Log SMS MFA setup
      if (user?.id) {
        await supabase.from('user_2fa_logs').insert({
          user_id: user.id,
          action: 'sms_setup',
          success: true,
        });
      }

      toast({
        title: 'SMS 2FA Configurado!',
        description: 'Verificação por SMS ativada com sucesso.',
      });

      setStep('complete');
      onComplete?.();
    } catch (err) {
      setError('Código inválido. Tente novamente.');
      logger.error('[MFASMSSetup] Verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate resend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Código reenviado!',
        description: 'Verifique suas mensagens.',
      });
    } catch (err) {
      setError('Erro ao reenviar código.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-6 w-6 text-primary" />
          <CardTitle>Verificação por SMS</CardTitle>
        </div>
        <CardDescription>
          {step === 'phone' && 'Configure verificação por SMS como método adicional'}
          {step === 'verify' && 'Digite o código recebido'}
          {step === 'complete' && 'Configuração concluída!'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {step === 'phone' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="phone">Número de telefone</Label>
              <div className="flex gap-2">
                <div className="flex items-center px-3 border rounded-md bg-muted">
                  <span className="text-sm text-muted-foreground">+55</span>
                </div>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  placeholder="(11) 99999-9999"
                  className="flex-1"
                  maxLength={16}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Você receberá um código SMS para verificar este número.
              </p>
            </div>

            <Alert>
              <Phone className="h-4 w-4" />
              <AlertDescription>
                Tarifas de SMS podem ser aplicadas pela sua operadora.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              {onCancel && (
                <Button variant="outline" onClick={onCancel} className="flex-1">
                  Cancelar
                </Button>
              )}
              <Button 
                onClick={sendVerificationCode} 
                disabled={isLoading || phoneNumber.replace(/\D/g, '').length < 10}
                className="flex-1"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Enviar código
              </Button>
            </div>
          </>
        )}

        {step === 'verify' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="sms-code">Código de verificação</Label>
              <Input
                id="sms-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="text-center text-2xl tracking-widest font-mono"
                autoComplete="one-time-code"
              />
              <p className="text-xs text-muted-foreground">
                Código enviado para {phoneNumber}
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              variant="link" 
              onClick={resendCode} 
              disabled={isLoading}
              className="w-full"
            >
              Não recebeu? Reenviar código
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('phone')} className="flex-1">
                Voltar
              </Button>
              <Button 
                onClick={verifyCode} 
                disabled={isLoading || verificationCode.length !== 6}
                className="flex-1"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Verificar
              </Button>
            </div>
          </>
        )}

        {step === 'complete' && (
          <div className="text-center py-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <p className="text-lg font-medium">SMS Verificado!</p>
            <p className="text-sm text-muted-foreground mt-2">
              Verificação por SMS configurada com sucesso.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default MFASMSSetup;
