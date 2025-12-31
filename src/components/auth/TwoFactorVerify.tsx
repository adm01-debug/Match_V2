import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { use2FA } from "@/hooks/use2FA";
import { Shield, AlertTriangle, Loader2, KeyRound } from "lucide-react";

export interface TwoFactorVerifyProps {
  onSuccess: () => void;
  onCancel?: () => void;
  maxAttempts?: number;
}

export function TwoFactorVerify({ onSuccess, onCancel, maxAttempts = 5 }: TwoFactorVerifyProps) {
  const { toast } = useToast();
  const { verify2FA } = use2FA();
  const inputRef = useRef<HTMLInputElement>(null);

  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Focus input on mount and mode change
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [useRecoveryCode]);

  const isLocked = attempts >= maxAttempts;
  const codeLength = useRecoveryCode ? 9 : 6; // Recovery codes are like XXXX-XXXX (9 chars with dash)
  const remainingAttempts = maxAttempts - attempts;

  const handleVerify = async () => {
    if (isLocked) {
      setError("Muitas tentativas. Aguarde alguns minutos.");
      return;
    }

    const cleanCode = useRecoveryCode ? code : code.replace(/\D/g, '');
    
    if (cleanCode.length < (useRecoveryCode ? 8 : 6)) {
      setError(`O código deve ter ${useRecoveryCode ? '8 caracteres' : '6 dígitos'}`);
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const result = await verify2FA.mutateAsync(cleanCode);
      
      if (result) {
        toast({
          title: "Verificação concluída!",
          description: rememberDevice 
            ? "Este dispositivo foi salvo por 30 dias." 
            : "Login realizado com sucesso.",
        });
        onSuccess();
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts >= maxAttempts) {
          setError("Muitas tentativas incorretas. Aguarde alguns minutos.");
        } else {
          setError(
            useRecoveryCode 
              ? `Código de recuperação inválido ou já utilizado. (${remainingAttempts - 1} tentativas restantes)` 
              : `Código inválido. Verifique e tente novamente. (${remainingAttempts - 1} tentativas restantes)`
          );
        }
        setCode("");
        inputRef.current?.focus();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao verificar código. Tente novamente.";
      setError(message);
      console.error('[TwoFactorVerify] Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const toggleRecoveryMode = () => {
    setUseRecoveryCode(!useRecoveryCode);
    setCode("");
    setError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length >= (useRecoveryCode ? 8 : 6) && !isVerifying && !isLocked) {
      handleVerify();
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          {useRecoveryCode ? (
            <KeyRound className="h-6 w-6 text-primary" aria-hidden="true" />
          ) : (
            <Shield className="h-6 w-6 text-primary" aria-hidden="true" />
          )}
          <CardTitle>
            {useRecoveryCode ? "Código de Recuperação" : "Verificação 2FA"}
          </CardTitle>
        </div>
        <CardDescription>
          {useRecoveryCode 
            ? "Digite um dos seus códigos de recuperação"
            : "Digite o código do seu autenticador"
          }
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="2fa-code" className="sr-only">
            {useRecoveryCode ? "Código de recuperação" : "Código de verificação"}
          </label>
          <Input
            ref={inputRef}
            id="2fa-code"
            type="text"
            inputMode={useRecoveryCode ? "text" : "numeric"}
            pattern={useRecoveryCode ? "[A-Za-z0-9-]*" : "[0-9]*"}
            maxLength={codeLength}
            placeholder={useRecoveryCode ? "XXXX-XXXX" : "000000"}
            value={code}
            onChange={(e) => {
              const value = useRecoveryCode 
                ? e.target.value.toUpperCase()
                : e.target.value.replace(/\D/g, '');
              setCode(value);
              setError(null);
            }}
            onKeyDown={handleKeyDown}
            className="text-center text-2xl tracking-widest font-mono"
            autoComplete="one-time-code"
            disabled={isLocked}
            aria-describedby={error ? "error-message" : "code-hint"}
            aria-invalid={!!error}
          />
          <p id="code-hint" className="text-xs text-muted-foreground text-center">
            {useRecoveryCode 
              ? "Código de 8 caracteres"
              : "Código de 6 dígitos do seu autenticador"
            }
          </p>
        </div>

        {!useRecoveryCode && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember-device" 
              checked={rememberDevice}
              onCheckedChange={(checked) => setRememberDevice(checked === true)}
              disabled={isLocked}
            />
            <label 
              htmlFor="remember-device" 
              className="text-sm text-muted-foreground cursor-pointer select-none"
            >
              Lembrar este dispositivo por 30 dias
            </label>
          </div>
        )}

        {error && (
          <Alert variant="destructive" id="error-message" role="alert">
            <AlertTriangle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleVerify} 
          disabled={isVerifying || code.length < (useRecoveryCode ? 8 : 6) || isLocked}
          className="w-full"
        >
          {isVerifying && <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />}
          {isLocked ? "Bloqueado" : "Verificar"}
        </Button>

        <div className="text-center">
          <Button 
            variant="link" 
            onClick={toggleRecoveryMode}
            className="text-sm"
            disabled={isLocked}
          >
            {useRecoveryCode 
              ? "← Voltar para código do autenticador"
              : "Perdeu acesso ao autenticador? Use código de recuperação"
            }
          </Button>
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
