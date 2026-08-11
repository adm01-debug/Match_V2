/**
 * @component ActiveSessionsPanel
 * @description Painel para visualizar e gerenciar sessões ativas do usuário
 */
import { logger } from '@/services/logger';
import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, MapPin, Clock, LogOut, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
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
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface Session {
  id: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  last_activity: string;
  is_current: boolean;
  location?: string;
}

export function ActiveSessionsPanel() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const parseUserAgent = (ua: string) => {
    const browser = ua.match(/(Chrome|Firefox|Safari|Edge|Opera)/i)?.[0] || 'Navegador';
    const os = ua.match(/(Windows|Mac|Linux|Android|iOS|iPhone)/i)?.[0] || 'Sistema';
    const isMobile = /mobile|android|iphone/i.test(ua);
    const isTablet = /tablet|ipad/i.test(ua);
    
    return { browser, os, isMobile, isTablet };
  };

  const getDeviceIcon = (userAgent: string) => {
    const { isMobile, isTablet } = parseUserAgent(userAgent);
    if (isMobile) return <Smartphone className="h-5 w-5" />;
    if (isTablet) return <Tablet className="h-5 w-5" />;
    return <Monitor className="h-5 w-5" />;
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setSessions([]);
        return;
      }

      // Get access logs as proxy for sessions
      const { data: logs, error } = await supabase
        .from('ip_access_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('action', 'login')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      // Transform logs into sessions
      const currentIp = await fetch('https://api.ipify.org?format=json')
        .then(r => r.json())
        .then(d => d.ip)
        .catch(() => '');

      const sessionData: Session[] = (logs || []).map((log, index) => ({
        id: log.id,
        ip_address: log.ip_address,
        user_agent: log.user_agent || 'Unknown',
        created_at: log.created_at,
        last_activity: log.created_at,
        is_current: index === 0 && log.ip_address === currentIp,
      }));

      // Add current session if not in list
      if (sessionData.length === 0 || !sessionData.some(s => s.is_current)) {
        sessionData.unshift({
          id: 'current',
          ip_address: currentIp || 'Desconhecido',
          user_agent: navigator.userAgent,
          created_at: new Date().toISOString(),
          last_activity: new Date().toISOString(),
          is_current: true,
        });
      }

      setSessions(sessionData);
    } catch (error) {
      logger.error('Error loading sessions:', error);
      toast.error('Erro ao carregar sessões');
    } finally {
      setIsLoading(false);
    }
  };

  const terminateAllOtherSessions = async () => {
    try {
      await supabase.auth.signOut({ scope: 'others' });
      toast.success('Todas as outras sessões foram encerradas');
      loadSessions();
    } catch (error) {
      logger.error('Error terminating sessions:', error);
      toast.error('Erro ao encerrar sessões');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Sessões Ativas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
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
              <Monitor className="h-5 w-5" />
              Sessões Ativas
            </CardTitle>
            <CardDescription>
              Dispositivos onde sua conta está conectada
            </CardDescription>
          </div>
          {sessions.length > 1 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Encerrar outras
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Encerrar outras sessões?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Isso desconectará sua conta de todos os outros dispositivos.
                    Você continuará conectado apenas neste dispositivo.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={terminateAllOtherSessions} className="bg-destructive text-destructive-foreground">
                    Encerrar todas
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Nenhuma sessão encontrada</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map(session => {
              const { browser, os } = parseUserAgent(session.user_agent);
              
              return (
                <div
                  key={session.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    session.is_current 
                      ? 'border-success bg-success dark:bg-success/20' 
                      : 'border-border'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    session.is_current 
                      ? 'bg-success dark:bg-success/40' 
                      : 'bg-muted'
                  }`}>
                    {getDeviceIcon(session.user_agent)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {browser} em {os}
                      </span>
                      {session.is_current && (
                        <Badge variant="default" className="bg-success text-xs">
                          Sessão atual
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {session.ip_address}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(session.created_at), { 
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
        )}

        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground flex items-start gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            Se você notar alguma sessão suspeita, encerre-a imediatamente e altere sua senha.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ActiveSessionsPanel;
