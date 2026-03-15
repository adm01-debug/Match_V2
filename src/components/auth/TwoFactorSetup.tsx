import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { use2FA } from "@/hooks/use2FA";
import { Shield, Copy, Download, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

interface TwoFactorSetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

// Generate a random base32 secret
function generateSecret(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let secret = '';
  for (let i = 0; i < 16; i++) {
    secret += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return secret;
}

// Generate recovery codes
function generateRecoveryCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    const code = Math.random().toString(36).substring(2, 6).toUpperCase() + 
                 '-' + 
                 Math.random().toString(36).substring(2, 6).toUpperCase();
    codes.push(code);
  }
  return codes;
}

export function TwoFactorSetup({ onComplete, onCancel }: TwoFactorSetupProps) {
  const { toast } = useToast();
  const { 
    isEnabled, 
    isLoadingStatus,
    enable2FA,
  } = use2FA();

  const [step, setStep] = useState<'generate' | 'verify' | 'recovery' | 'complete'>('generate');
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [downloadedCodes, setDownloadedCodes] = useState(false);
  const [secret, setSecret] = useState<string>("");
  const [recoveryCodes, setRecoveryCodes] = useState<string[]>([]);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");

  // Initialize secret on mount
  const initializeSecret = useCallback(() => {
    if (!secret && !isEnabled) {
      const newSecret = generateSecret();
      setSecret(newSecret);
      // Generate QR code URL (using Google Charts API for simplicity)
      const otpauthUrl = `otpauth://totp/MatchATS:user@example.com?secret=${newSecret}&issuer=MatchATS`;
      setQrCodeUrl(`https://chart.googleapis.com/chart?chs=200x200&chld=M|0&cht=qr&chl=${encodeURIComponent(otpauthUrl)}`);
    }
  }, [secret, isEnabled]);

  useEffect(() => {
    initializeSecret();
  }, [initializeSecret]);

  // Cleanup timeout on unmount
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (copiedSecret) {
      timeoutId = setTimeout(() => setCopiedSecret(false), 2000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [copiedSecret]);

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError("O código deve ter 6 dígitos");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const codes = generateRecoveryCodes();
      setRecoveryCodes(codes);
      
      await enable2FA.mutateAsync({ secret, backup_codes: codes });
      
      setStep('recovery');
      toast({
        title: "2FA Ativado!",
        description: "Autenticação de dois fatores configurada com sucesso.",
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro ao verificar código. Tente novamente.";
      setError(message);
      console.error('[TwoFactorSetup] Verification error:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const copySecret = async () => {
    if (secret) {
      try {
        await navigator.clipboard.writeText(secret);
        setCopiedSecret(true);
        toast({ title: "Copiado!", description: "Chave secreta copiada." });
      } catch (err) {
        console.error('[TwoFactorSetup] Clipboard error:', err);
        toast({ 
          title: "Erro", 
          description: "Não foi possível copiar. Selecione e copie manualmente.", 
          variant: "destructive" 
        });
      }
    }
  };

  const downloadRecoveryCodes = () => {
    if (!recoveryCodes?.length) return;
    
    const content = `PEOPLE LOVERS - Códigos de Recuperação 2FA
========================================
Data: ${new Date().toLocaleDateString('pt-BR')}

IMPORTANTE: Guarde estes códigos em local seguro!
Cada código só pode ser usado uma vez.

${recoveryCodes.map((code: string, i: number) => `${i + 1}. ${code}`).join('\n')}

========================================
Se você perder acesso ao seu autenticador,
use um destes códigos para fazer login.
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'match-ats-recovery-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    // Delay revokeObjectURL to ensure download starts
    setTimeout(() => URL.revokeObjectURL(url), 100);
    setDownloadedCodes(true);
    toast({ title: "Download iniciado!", description: "Guarde os códigos em local seguro." });
  };

  const handleComplete = () => {
    if (!downloadedCodes) {
      toast({
        title: "Atenção!",
        description: "Recomendamos fazer download dos códigos de recuperação.",
        variant: "destructive",
      });
      return;
    }
    setStep('complete');
    onComplete?.();
  };

  if (isLoadingStatus) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <CardTitle>Configurar 2FA</CardTitle>
        </div>
        <CardDescription>
          {step === 'generate' && "Configure a autenticação de dois fatores para maior segurança"}
          {step === 'verify' && "Verifique o código do seu autenticador"}
          {step === 'recovery' && "Salve seus códigos de recuperação"}
          {step === 'complete' && "Configuração concluída!"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {step === 'generate' && (
          <>
            <div className="flex justify-center">
              {qrCodeUrl ? (
                <img 
                  src={qrCodeUrl} 
                  alt="QR Code 2FA" 
                  className="w-48 h-48 border rounded-lg"
                  loading="eager"
                />
              ) : (
                <div className="w-48 h-48 bg-muted animate-pulse rounded-lg" aria-label="Carregando QR Code" />
              )}
            </div>

            <Alert>
              <AlertDescription>
                Escaneie o QR Code com seu app autenticador (Google Authenticator, Authy, etc.)
              </AlertDescription>
            </Alert>

            {secret && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Ou insira manualmente:</p>
                <div className="flex gap-2">
                  <Input 
                    value={secret} 
                    readOnly 
                    className="font-mono text-xs" 
                    aria-label="Chave secreta 2FA"
                  />
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={copySecret}
                    aria-label={copiedSecret ? "Copiado" : "Copiar chave secreta"}
                  >
                    {copiedSecret ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}

            <Button className="w-full" onClick={() => setStep('verify')}>
              Próximo: Verificar Código
            </Button>
          </>
        )}

        {step === 'verify' && (
          <>
            <div className="space-y-2">
              <label htmlFor="verification-code" className="text-sm font-medium">
                Código de verificação
              </label>
              <Input
                id="verification-code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-widest font-mono"
                autoComplete="one-time-code"
                aria-describedby="code-hint"
              />
              <p id="code-hint" className="text-xs text-muted-foreground">
                Digite o código de 6 dígitos do seu autenticador
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('generate')} className="flex-1">
                Voltar
              </Button>
              <Button 
                onClick={handleVerify} 
                disabled={isVerifying || verificationCode.length !== 6}
                className="flex-1"
              >
                {isVerifying && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Verificar
              </Button>
            </div>
          </>
        )}

        {step === 'recovery' && (
          <>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Importante!</strong> Salve estes códigos em local seguro. 
                Você precisará deles se perder acesso ao seu autenticador.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg" role="list" aria-label="Códigos de recuperação">
              {recoveryCodes?.map((code: string, index: number) => (
                <Badge key={`recovery-${index}`} variant="secondary" className="font-mono justify-center py-2" role="listitem">
                  {code}
                </Badge>
              ))}
            </div>

            <Button 
              variant="outline" 
              className="w-full" 
              onClick={downloadRecoveryCodes}
            >
              <Download className="h-4 w-4 mr-2" />
              {downloadedCodes ? "✓ Códigos Baixados" : "Baixar Códigos"}
            </Button>

            <Button 
              className="w-full" 
              onClick={handleComplete}
              variant={downloadedCodes ? "default" : "secondary"}
            >
              {downloadedCodes ? "Concluir Configuração" : "Pular (não recomendado)"}
            </Button>
          </>
        )}

        {step === 'complete' && (
          <div className="text-center py-4">
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" aria-hidden="true" />
            <p className="text-lg font-medium">2FA Configurado com Sucesso!</p>
            <p className="text-sm text-muted-foreground mt-2">
              Sua conta agora está protegida com autenticação de dois fatores.
            </p>
          </div>
        )}

        {onCancel && step !== 'complete' && (
          <Button variant="ghost" onClick={onCancel} className="w-full">
            Cancelar
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
