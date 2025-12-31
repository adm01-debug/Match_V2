/**
 * @component MFAMethodSelector
 * @description Seletor de método MFA (TOTP ou SMS)
 */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TwoFactorSetup } from './TwoFactorSetup';
import { MFASMSSetup } from './MFASMSSetup';
import { Shield, Smartphone, MessageSquare, CheckCircle2, ArrowLeft } from 'lucide-react';
import { use2FA } from '@/hooks/use2FA';

interface MFAMethodSelectorProps {
  onComplete?: () => void;
}

type MFAMethod = 'totp' | 'sms' | null;

export function MFAMethodSelector({ onComplete }: MFAMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<MFAMethod>(null);
  const { isEnabled } = use2FA();

  const methods = [
    {
      id: 'totp' as const,
      name: 'App Autenticador',
      description: 'Use Google Authenticator, Authy ou similar',
      icon: Smartphone,
      recommended: true,
      pros: ['Mais seguro', 'Funciona offline', 'Gratuito'],
    },
    {
      id: 'sms' as const,
      name: 'Código SMS',
      description: 'Receba códigos por mensagem de texto',
      icon: MessageSquare,
      recommended: false,
      pros: ['Fácil de usar', 'Sem app adicional'],
    },
  ];

  if (selectedMethod === 'totp') {
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedMethod(null)}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <TwoFactorSetup 
          onComplete={onComplete}
          onCancel={() => setSelectedMethod(null)}
        />
      </div>
    );
  }

  if (selectedMethod === 'sms') {
    return (
      <div className="space-y-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedMethod(null)}
          className="mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <MFASMSSetup 
          onComplete={onComplete}
          onCancel={() => setSelectedMethod(null)}
        />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <CardTitle>Autenticação de Dois Fatores</CardTitle>
        </div>
        <CardDescription>
          Escolha como deseja receber os códigos de verificação
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {isEnabled && (
          <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <span className="text-sm text-green-700 dark:text-green-300">
              2FA já está ativo na sua conta
            </span>
          </div>
        )}

        <div className="grid gap-4">
          {methods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className="flex items-start gap-4 p-4 rounded-lg border border-border hover:border-primary hover:bg-accent transition-colors text-left"
            >
              <div className="p-2 rounded-lg bg-primary/10">
                <method.icon className="h-6 w-6 text-primary" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{method.name}</h3>
                  {method.recommended && (
                    <Badge variant="secondary" className="text-xs">
                      Recomendado
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {method.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {method.pros.map((pro, index) => (
                    <span 
                      key={index} 
                      className="text-xs px-2 py-0.5 bg-muted rounded-full"
                    >
                      {pro}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center pt-4">
          Você pode configurar ambos os métodos para maior flexibilidade
        </p>
      </CardContent>
    </Card>
  );
}

export default MFAMethodSelector;
