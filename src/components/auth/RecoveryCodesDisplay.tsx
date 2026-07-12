import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy, Download, Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RecoveryCodesDisplayProps {
  codes: string[];
  onConfirm: () => void;
}

export function RecoveryCodesDisplay({ codes, onConfirm }: RecoveryCodesDisplayProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    const text = codes.join('\n');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: 'Códigos copiados',
      description: 'Os códigos de recuperação foram copiados para a área de transferência.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = `CÓDIGOS DE RECUPERAÇÃO - PEOPLE LOVERS\n${'='.repeat(40)}\n\nGuarde estes códigos em um lugar seguro.\nCada código só pode ser usado uma vez.\n\n${codes.map((c, i) => `${i + 1}. ${c}`).join('\n')}\n\nGerado em: ${new Date().toLocaleString('pt-BR')}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'match-ats-recovery-codes.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Download iniciado',
      description: 'O arquivo com os códigos de recuperação foi baixado.',
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Códigos de Recuperação</CardTitle>
        </div>
        <CardDescription>
          Guarde estes códigos em um lugar seguro. Você precisará deles caso perca acesso ao seu autenticador.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-2 font-mono text-sm">
            {codes.map((code, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-muted-foreground">{index + 1}.</span>
                <span className="font-medium">{code}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            {copied ? 'Copiado!' : 'Copiar'}
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>

        <div className="bg-warning dark:bg-warning/20 border border-warning dark:border-warning rounded-lg p-3">
          <div className="flex gap-2">
            <AlertTriangle className="h-5 w-5 text-warning dark:text-warning flex-shrink-0" />
            <div className="text-sm text-warning dark:text-warning">
              <p className="font-medium">Importante:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Cada código só pode ser usado uma vez</li>
                <li>Guarde em local seguro e offline</li>
                <li>Não compartilhe com ninguém</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="confirm"
            checked={confirmed}
            onCheckedChange={(checked) => setConfirmed(checked as boolean)}
          />
          <label htmlFor="confirm" className="text-sm cursor-pointer">
            Eu salvei meus códigos de recuperação em um local seguro
          </label>
        </div>

        <Button className="w-full" disabled={!confirmed} onClick={onConfirm}>
          Continuar
        </Button>
      </CardContent>
    </Card>
  );
}
