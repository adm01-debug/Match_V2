import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { use2FA } from "@/hooks/use2FA";
import { Shield, AlertTriangle, Loader2, KeyRound } from "lucide-react";

interface TwoFactorVerifyProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

export function TwoFactorVerify({ onSuccess, onCancel }: TwoFactorVerifyProps) {
  const { toast } = useToast();
  const { verify2FA, verifyRecoveryCode } = use2FA();

  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [useRecoveryCode, setUseRecoveryCode] = useState(false);

  const handleVerify = async () => {
    const codeLength = useRecoveryCode ? 8 : 6;
    if (code.length !== codeLength) {
      setError(`O código deve ter ${codeLength} ${useRecoveryCode ? 'caracteres' : 'dígitos'}`);
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      let success: boolean;
      
      if (useRecoveryCode) {
        success = await verifyRecoveryCode(code);
      } else {
        success = await verify2FA(code, rememberDevice);
      }

      if (success) {
        toast({
          title: "Verificação concluída!",
          description: rememberDevice 
            ? "Este dispositivo foi salvo por 30 dias." 
            : "Login realizado com sucesso.",
        });
        onSuccess();
      } else {
        setError(useRecoveryCode 
          ? "Código de recuperação inválido ou já utilizado." 
          : "Código inválido. Verifique e tente novamente."
        );
      }
    } catch (err) {
      setError("Erro ao verificar código. Tente novamente.");
    } finally {
      setIsVerifying(false);
    }
  };

  const toggleRecoveryMode = () => {
    setUseRecoveryCode(!useRecoveryCode);
    setCode("");
    setError(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          {useRecoveryCode ? (
            <KeyRound className="h-6 w-6 text-primary" />
          ) : (
            <Shield className="h-6 w-6 text-primary" />
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
          <Input
            type="text"
            inputMode={useRecoveryCode ? "text" : "numeric"}
            maxLength={useRecoveryCode ? 8 : 6}
            placeholder={useRecoveryCode ? "XXXXXXXX" : "000000"}
            value={code}
            onChange={(e) => {
              const value = useRecoveryCode 
                ? e.target.value.toUpperCase()
                : e.target.value.replace(/\D/g, '');
              setCode(value);
            }}
            className="text-center text-2xl tracking-widest font-mono"
            autoFocus
          />
          <p className="text-xs text-muted-foreground text-center">
            {useRecoveryCode 
              ? "Código de 8 caracteres"
              : "Código de 6 dígitos do seu autenticador"
            }
          </p>
        </div>

        {!useRecoveryCode && (
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember" 
              checked={rememberDevice}
              onCheckedChange={(checked) => setRememberDevice(checked === true)}
            />
            <label 
              htmlFor="remember" 
              className="text-sm text-muted-foreground cursor-pointer"
            >
              Lembrar este dispositivo por 30 dias
            </label>
          </div>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button 
          onClick={handleVerify} 
          disabled={isVerifying || code.length < (useRecoveryCode ? 8 : 6)}
          className="w-full"
        >
          {isVerifying && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          Verificar
        </Button>

        <div className="text-center">
          <Button 
            variant="link" 
            onClick={toggleRecoveryMode}
            className="text-sm"
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
