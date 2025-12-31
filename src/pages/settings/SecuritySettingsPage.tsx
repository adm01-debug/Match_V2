/**
 * @page SecuritySettingsPage
 * @description Página de configurações de segurança do usuário
 */
import { useState } from 'react';
import { 
  Shield, 
  Key, 
  Smartphone, 
  Monitor, 
  Lock,
  Bell,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Fingerprint
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrustedDevicesManager } from '@/components/auth/TrustedDevicesManager';
import { MFAMethodSelector } from '@/components/auth/MFAMethodSelector';
import { ActiveSessionsPanel } from '@/components/security/ActiveSessionsPanel';
import { SecurityActivityLog } from '@/components/security/SecurityActivityLog';
import { PushNotificationSettings } from '@/components/security/PushNotificationSettings';
import { PasskeyManager } from '@/components/security/PasskeyManager';
import { ReauthDialog } from '@/components/auth/ReauthDialog';
import { use2FA } from '@/hooks/use2FA';
import { useReauth } from '@/hooks/useReauth';
import { useWebAuthn } from '@/hooks/useWebAuthn';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export default function SecuritySettingsPage() {
  const navigate = useNavigate();
  const { isEnabled: is2FAEnabled, isLoading: loading2FA } = use2FA();
  const { requireReauth, isReauthDialogOpen, closeReauthDialog } = useReauth();
  const { credentials: passkeys, isSupported: passkeysSupported } = useWebAuthn();
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleChangePassword = async () => {
    const proceed = await requireReauth('password_change');
    if (!proceed) return;

    setIsChangingPassword(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user?.email) {
        toast.error('Email não encontrado');
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      toast.success('Email de redefinição enviado! Verifique sua caixa de entrada.');
    } catch (error) {
      console.error('Error requesting password reset:', error);
      toast.error('Erro ao solicitar redefinição de senha');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSetup2FA = async () => {
    const proceed = await requireReauth('mfa_setup');
    if (!proceed) return;
    setShowMFASetup(true);
  };

  const securityScore = () => {
    let score = 30; // Base score for having an account
    if (is2FAEnabled) score += 40;
    if (passkeys.length > 0) score += 30;
    return Math.min(score, 100);
  };

  const score = securityScore();
  const scoreColor = score >= 80 ? 'text-green-600' : score >= 50 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Segurança da Conta
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie suas configurações de segurança e dispositivos
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Voltar
        </Button>
      </div>

      {/* Security Score Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Pontuação de Segurança</h3>
              <p className="text-sm text-muted-foreground">
                Baseado nas suas configurações atuais
              </p>
            </div>
            <div className={`text-5xl font-bold ${scoreColor}`}>
              {score}%
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              {is2FAEnabled ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              )}
              <span>
                {is2FAEnabled 
                  ? 'Autenticação de dois fatores ativada' 
                  : 'Ative a autenticação de dois fatores'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {passkeys.length > 0 ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : passkeysSupported ? (
                <AlertTriangle className="h-4 w-4 text-amber-600" />
              ) : (
                <Fingerprint className="h-4 w-4 text-muted-foreground" />
              )}
              <span>
                {passkeys.length > 0 
                  ? `${passkeys.length} passkey${passkeys.length > 1 ? 's' : ''} configurada${passkeys.length > 1 ? 's' : ''}`
                  : passkeysSupported 
                    ? 'Configure passkeys para login biométrico'
                    : 'Passkeys não suportadas neste dispositivo'}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="security" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="devices" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            <span className="hidden sm:inline">Dispositivos</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span className="hidden sm:inline">Sessões</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Alertas</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Atividade</span>
          </TabsTrigger>
        </TabsList>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Password Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Senha
              </CardTitle>
              <CardDescription>
                Mantenha sua senha forte e atualizada
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alterar senha</p>
                  <p className="text-sm text-muted-foreground">
                    Recomendamos alterar sua senha regularmente
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? 'Enviando...' : 'Alterar senha'}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 2FA Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    Autenticação de Dois Fatores (2FA)
                  </CardTitle>
                  <CardDescription>
                    Adicione uma camada extra de segurança à sua conta
                  </CardDescription>
                </div>
                <Badge variant={is2FAEnabled ? 'default' : 'secondary'}>
                  {loading2FA ? 'Carregando...' : is2FAEnabled ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {showMFASetup ? (
                <MFAMethodSelector 
                  onComplete={() => setShowMFASetup(false)} 
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {is2FAEnabled 
                        ? 'Gerenciar autenticação de dois fatores' 
                        : 'Configurar autenticação de dois fatores'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {is2FAEnabled 
                        ? 'Atualize suas configurações de 2FA' 
                        : 'Use um app autenticador ou SMS para proteger sua conta'}
                    </p>
                  </div>
                  <Button onClick={handleSetup2FA}>
                    {is2FAEnabled ? 'Gerenciar' : 'Configurar'}
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Passkeys Section */}
          <PasskeyManager />
        </TabsContent>

        {/* Devices Tab */}
        <TabsContent value="devices">
          <TrustedDevicesManager />
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <ActiveSessionsPanel />
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <PushNotificationSettings />
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <SecurityActivityLog />
        </TabsContent>
      </Tabs>

      {/* Reauth Dialog */}
      <ReauthDialog 
        isOpen={isReauthDialogOpen}
        onClose={closeReauthDialog}
        onSuccess={() => {}}
      />
    </div>
  );
}
