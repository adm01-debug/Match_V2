import { useState, useEffect } from "react";
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

export function TwoFactorSetup({ onComplete, onCancel }: TwoFactorSetupProps) {
  const { toast } = useToast();
  const { 
    isEnabled, 
    isLoading, 
    qrCodeUrl, 
    secret, 
    recoveryCodes,
    generateSecret, 
    enable2FA, 
    generateRecoveryCodes 
  } = use2FA();

  const [step, setStep] = useState<'generate' | 'verify' | 'recovery' | 'complete'>('generate');
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [downloadedCodes, setDownloadedCodes] = useState(false);

  useEffect(() => {
    if (!qrCodeUrl && !isEnabled) {
      generateSecret();
    }
  }, []);

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError("O código deve ter 6 dígitos");
      return;
    }

    setIsVerifying(true);
    setError(null);

    try {
      const success = await enable2FA(verificationCode);
      if (success) {
        await generateRecoveryCodes();
        setStep('recovery');
        toast({
          title: "2FA Ativado!",
          description: "Autenticação de dois fatores configurada com sucesso.",
        });
      } else {
        setError("Código inválido. Verifique e tente novamente.");
      }
    } catch (err) {
      setError("Erro ao verificar código. Tente novamente.");
    } finally {
      setIsVerifying(false);
    }
  };

  const copySecret = async () => {
    if (secret) {
      await navigator.clipboard.writeText(secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
      toast({ title: "Copiado!", description: "Chave secreta copiada." });
    }
  };

  const downloadRecoveryCodes = () => {
    if (!recoveryCodes?.length) return;
    
    const content = `MATCH ATS - Códigos de Recuperação 2FA
========================================
Data: ${new Date().toLocaleDateString('pt-BR')}

IMPORTANTE: Guarde estes códigos em local seguro!
Cada código só pode ser usado uma vez.

${recoveryCodes.map((code, i) => `${i + 1}. ${code}`).join('\n')}

========================================
Se você perder acesso ao seu autenticador,
use um destes códigos para fazer login.
`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'match-ats-recovery-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
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

  if (isLoading) {
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
                <img src={qrCodeUrl} alt="QR Code 2FA" className="w-48 h-48 border rounded-lg" />
              ) : (
                <div className="w-48 h-48 bg-muted animate-pulse rounded-lg" />
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
                  <Input value={secret} readOnly className="font-mono text-xs" />
                  <Button variant="outline" size="icon" onClick={copySecret}>
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
              <label className="text-sm font-medium">Código de verificação</label>
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-widest font-mono"
              />
              <p className="text-xs text-muted-foreground">
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
                {isVerifying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
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

            <div className="grid grid-cols-2 gap-2 p-4 bg-muted rounded-lg">
              {recoveryCodes?.map((code, index) => (
                <Badge key={index} variant="secondary" className="font-mono justify-center py-2">
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
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
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
