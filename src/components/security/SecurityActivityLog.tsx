/**
 * @component SecurityActivityLog
 * @description Log de atividades de segurança (2FA, logins, etc)
 */
import { useState, useEffect } from 'react';
import { Shield, CheckCircle2, XCircle, Smartphone, Key, AlertTriangle, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { logger } from '@/services/logger';

interface ActivityLog {
  id: string;
  action: string;
  success: boolean;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

const actionLabels: Record<string, { label: string; icon: React.ElementType }> = {
  '2fa_setup': { label: 'Configuração 2FA', icon: Smartphone },
  '2fa_enabled': { label: '2FA Ativado', icon: Shield },
  '2fa_disabled': { label: '2FA Desativado', icon: Shield },
  '2fa_verify': { label: 'Verificação 2FA', icon: Key },
  '2fa_backup_used': { label: 'Código backup usado', icon: AlertTriangle },
  'login': { label: 'Login', icon: CheckCircle2 },
  'logout': { label: 'Logout', icon: XCircle },
  'password_change': { label: 'Alteração de senha', icon: Key },
  'device_trusted': { label: 'Dispositivo confiável', icon: Smartphone },
};

export function SecurityActivityLog() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLogs([]);
        return;
      }

      const { data, error } = await supabase
        .from('user_2fa_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      logger.error('Error loading security logs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActionInfo = (action: string) => {
    return actionLabels[action] || { label: action, icon: Shield };
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Atividade de Segurança
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Atividade de Segurança
            </CardTitle>
            <CardDescription>
              Histórico de ações de segurança na sua conta
            </CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={loadLogs}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma atividade registrada</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-3">
              {logs.map(log => {
                const actionInfo = getActionInfo(log.action);
                const ActionIcon = actionInfo.icon;
                
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 p-3 rounded-lg border bg-card"
                  >
                    <div className={`p-2 rounded-full ${
                      log.success 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900/40' 
                        : 'bg-red-100 text-red-600 dark:bg-red-900/40'
                    }`}>
                      <ActionIcon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">
                          {actionInfo.label}
                        </span>
                        <Badge 
                          variant={log.success ? 'default' : 'destructive'} 
                          className="text-xs"
                        >
                          {log.success ? 'Sucesso' : 'Falhou'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        {log.ip_address && (
                          <span>IP: {log.ip_address}</span>
                        )}
                        <span>
                          {formatDistanceToNow(new Date(log.created_at), { 
                            addSuffix: true, 
                            locale: ptBR 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}

export default SecurityActivityLog;
