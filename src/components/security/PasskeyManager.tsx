/**
 * @component PasskeyManager
 * @description Gerenciador de Passkeys/WebAuthn
 */
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useWebAuthn } from '@/hooks/useWebAuthn';
import { 
  Fingerprint, 
  Plus, 
  Trash2, 
  Pencil, 
  Smartphone, 
  Laptop, 
  Monitor,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Key
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function getDeviceIcon(deviceType: string | null) {
  switch (deviceType) {
    case 'ios':
    case 'android':
      return Smartphone;
    case 'macos':
    case 'windows':
    case 'linux':
      return Laptop;
    default:
      return Monitor;
  }
}

function getDeviceLabel(deviceType: string | null) {
  switch (deviceType) {
    case 'ios': return 'iPhone/iPad';
    case 'android': return 'Android';
    case 'macos': return 'Mac';
    case 'windows': return 'Windows';
    case 'linux': return 'Linux';
    default: return 'Dispositivo';
  }
}

export function PasskeyManager() {
  const { 
    credentials, 
    loading, 
    isSupported, 
    isRegistering,
    registerPasskey, 
    deletePasskey,
    renamePasskey 
  } = useWebAuthn();
  
  const [showRegisterDialog, setShowRegisterDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [deviceName, setDeviceName] = useState('');

  const handleRegister = async () => {
    const success = await registerPasskey(deviceName || undefined);
    if (success) {
      setShowRegisterDialog(false);
      setDeviceName('');
    }
  };

  const handleRename = async () => {
    if (selectedCredential && newName.trim()) {
      const success = await renamePasskey(selectedCredential, newName.trim());
      if (success) {
        setShowRenameDialog(false);
        setSelectedCredential(null);
        setNewName('');
      }
    }
  };

  const openRenameDialog = (credentialId: string, currentName: string) => {
    setSelectedCredential(credentialId);
    setNewName(currentName);
    setShowRenameDialog(true);
  };

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Fingerprint className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Passkeys / Biometria</CardTitle>
          </div>
          <CardDescription>
            Login sem senha usando biometria ou chave de segurança
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-amber-800 dark:text-amber-200">
                Não suportado neste dispositivo
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Seu navegador ou dispositivo não suporta autenticação por biometria. 
                Tente usar um dispositivo com Touch ID, Face ID, Windows Hello ou sensor de impressão digital.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Passkeys / Biometria</CardTitle>
            </div>
            <Button 
              onClick={() => setShowRegisterDialog(true)}
              disabled={isRegistering}
              size="sm"
            >
              {isRegistering ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Adicionar Passkey
            </Button>
          </div>
          <CardDescription>
            Use biometria (Touch ID, Face ID, Windows Hello) ou chave de segurança para login sem senha
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Info banner */}
          <div className="flex items-start gap-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
            <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground">Passkeys são mais seguras que senhas</p>
              <p className="text-muted-foreground mt-1">
                Passkeys usam criptografia de ponta-a-ponta e biometria do seu dispositivo. 
                Não podem ser roubadas em phishing e não podem ser adivinhadas.
              </p>
            </div>
          </div>

          {/* Credentials list */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : credentials.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed rounded-lg">
              <Key className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium">Nenhuma passkey registrada</p>
              <p className="text-sm text-muted-foreground mt-1">
                Adicione uma passkey para fazer login com biometria
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {credentials.map((credential) => {
                const DeviceIcon = getDeviceIcon(credential.device_type);
                return (
                  <div
                    key={credential.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <DeviceIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {credential.device_name || 'Passkey'}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {getDeviceLabel(credential.device_type)}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground mt-0.5">
                          <span>Criada {formatDistanceToNow(new Date(credential.created_at), { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}</span>
                          {credential.last_used_at && (
                            <span className="ml-2">
                              • Último uso {formatDistanceToNow(new Date(credential.last_used_at), { 
                                addSuffix: true, 
                                locale: ptBR 
                              })}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openRenameDialog(
                          credential.id, 
                          credential.device_name || 'Passkey'
                        )}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Remover Passkey?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Você não poderá mais usar esta passkey para fazer login.
                              Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => deletePasskey(credential.id)}
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Register Dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Fingerprint className="h-5 w-5" />
              Registrar Nova Passkey
            </DialogTitle>
            <DialogDescription>
              Use a biometria do seu dispositivo para criar uma nova passkey
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Nome do Dispositivo (opcional)
              </label>
              <Input
                placeholder="ex: MacBook Pro, iPhone 15..."
                value={deviceName}
                onChange={(e) => setDeviceName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Um nome para identificar esta passkey
              </p>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                Quando clicar em "Registrar", seu dispositivo solicitará autenticação 
                biométrica (impressão digital, face ou PIN).
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRegisterDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRegister} disabled={isRegistering}>
              {isRegistering ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Aguardando biometria...
                </>
              ) : (
                <>
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Registrar Passkey
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renomear Passkey</DialogTitle>
            <DialogDescription>
              Escolha um nome para identificar esta passkey
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Input
              placeholder="Nome da passkey"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
              }}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleRename} disabled={!newName.trim()}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default PasskeyManager;
