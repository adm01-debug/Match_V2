import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QrCode, Copy, Eye, EyeOff, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRCodeGeneratorProps {
  secret: string;
  accountName: string;
  issuer?: string;
  onVerify: (code: string) => Promise<boolean>;
}

export function QRCodeGenerator({ secret, accountName, issuer = 'Match ATS', onVerify }: QRCodeGeneratorProps) {
  const [showSecret, setShowSecret] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(accountName)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;

  // Gerar QR Code como SVG usando biblioteca nativa
  const generateQRCodeSVG = (text: string, size: number = 200) => {
    // Placeholder - em produção usar qrcode.react
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <rect width="100%" height="100%" fill="white"/>
        <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="12" fill="#666">
          QR Code
        </text>
      </svg>
    `)}`;
  };

  const handleCopySecret = async () => {
    await navigator.clipboard.writeText(secret);
    toast({
      title: 'Código copiado',
      description: 'O código secreto foi copiado para a área de transferência.',
    });
  };

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: 'Código inválido',
        description: 'O código deve ter 6 dígitos.',
        variant: 'destructive',
      });
      return;
    }

    setIsVerifying(true);
    try {
      const isValid = await onVerify(verificationCode);
      if (isValid) {
        toast({
          title: '2FA ativado!',
          description: 'A autenticação de dois fatores foi configurada com sucesso.',
        });
      } else {
        toast({
          title: 'Código incorreto',
          description: 'Verifique o código e tente novamente.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <QrCode className="h-5 w-5 text-primary" />
          <CardTitle>Configurar Autenticador</CardTitle>
        </div>
        <CardDescription>
          Escaneie o QR Code com seu aplicativo autenticador
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* QR Code */}
        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <img
              src={generateQRCodeSVG(otpauthUrl, 200)}
              alt="QR Code para autenticação"
              className="w-48 h-48"
            />
          </div>
        </div>

        {/* Apps sugeridos */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Smartphone className="h-4 w-4" />
          <span>Google Authenticator, Authy, Microsoft Authenticator</span>
        </div>

        {/* Código manual */}
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">
            Ou insira o código manualmente:
          </Label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type={showSecret ? 'text' : 'password'}
                value={secret}
                readOnly
                className="font-mono text-sm pr-20"
              />
              <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => setShowSecret(!showSecret)}
                >
                  {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleCopySecret}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Verificação */}
        <div className="space-y-2">
          <Label htmlFor="verification-code">
            Digite o código de 6 dígitos do seu autenticador:
          </Label>
          <div className="flex gap-2">
            <Input
              id="verification-code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="000000"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
              className="font-mono text-center text-lg tracking-widest"
            />
            <Button onClick={handleVerify} disabled={isVerifying || verificationCode.length !== 6}>
              {isVerifying ? 'Verificando...' : 'Verificar'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
