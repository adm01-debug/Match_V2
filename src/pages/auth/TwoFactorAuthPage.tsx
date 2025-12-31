import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { TwoFactorSetup } from '@/components/auth/TwoFactorSetup';
import { TwoFactorVerify } from '@/components/auth/TwoFactorVerify';
import { use2FA } from '@/hooks/use2FA';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, ShieldCheck, ShieldOff, Key, Smartphone, Loader2 } from 'lucide-react';

type ViewMode = 'status' | 'setup' | 'verify' | 'disable';

export default function TwoFactorAuthPage() {
  useDocumentTitle('Autenticação de Dois Fatores');
  const navigate = useNavigate();
  const { isEnabled, isLoadingStatus, backupCodesCount, disable2FA, regenerateBackupCodes } = use2FA();
  const [viewMode, setViewMode] = useState<ViewMode>('status');

  if (isLoadingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const renderContent = () => {
    switch (viewMode) {
      case 'setup':
        return (
          <TwoFactorSetup 
            onComplete={() => setViewMode('status')} 
            onCancel={() => setViewMode('status')} 
          />
        );
      
      case 'verify':
        return (
          <TwoFactorVerify 
            onSuccess={() => {
              setViewMode('status');
            }} 
            onCancel={() => setViewMode('status')} 
          />
        );
      
      case 'disable':
        return (
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldOff className="h-6 w-6 text-destructive" />
                <CardTitle>Desativar 2FA</CardTitle>
              </div>
              <CardDescription>
                Tem certeza que deseja desativar a autenticação de dois fatores?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertDescription>
                  Desativar o 2FA tornará sua conta menos segura. 
                  Qualquer pessoa com sua senha poderá acessar sua conta.
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setViewMode('status')} className="flex-1">
                  Cancelar
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={async () => {
                    await disable2FA.mutateAsync();
                    setViewMode('status');
                  }}
                  disabled={disable2FA.isPending}
                  className="flex-1"
                >
                  {disable2FA.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Desativar
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      
      default:
        return (
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <CardTitle>Autenticação de Dois Fatores</CardTitle>
                </div>
                <Badge variant={isEnabled ? 'default' : 'secondary'}>
                  {isEnabled ? (
                    <>
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Ativo
                    </>
                  ) : (
                    'Desativado'
                  )}
                </Badge>
              </div>
              <CardDescription>
                Adicione uma camada extra de segurança à sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!isEnabled ? (
                <>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Smartphone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">App Autenticador</h3>
                        <p className="text-sm text-muted-foreground">
                          Use Google Authenticator, Authy ou similar para gerar códigos de verificação
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Key className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Códigos de Recuperação</h3>
                        <p className="text-sm text-muted-foreground">
                          Receba 10 códigos de backup para usar se perder acesso ao autenticador
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => setViewMode('setup')} className="w-full">
                    <Shield className="mr-2 h-4 w-4" />
                    Configurar 2FA
                  </Button>
                </>
              ) : (
                <>
                  <Alert>
                    <ShieldCheck className="h-4 w-4" />
                    <AlertDescription>
                      Sua conta está protegida com autenticação de dois fatores.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Key className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">Códigos de Recuperação</p>
                          <p className="text-sm text-muted-foreground">
                            {backupCodesCount} códigos restantes
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={async () => {
                          await regenerateBackupCodes.mutateAsync();
                        }}
                        disabled={regenerateBackupCodes.isPending}
                      >
                        {regenerateBackupCodes.isPending && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        Regenerar
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <Button 
                    variant="destructive" 
                    onClick={() => setViewMode('disable')} 
                    className="w-full"
                  >
                    <ShieldOff className="mr-2 h-4 w-4" />
                    Desativar 2FA
                  </Button>
                </>
              )}

              <Button variant="ghost" onClick={() => navigate(-1)} className="w-full">
                Voltar
              </Button>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-4 py-8">
      <div className="container max-w-2xl mx-auto">
        {renderContent()}
      </div>
    </div>
  );
}
