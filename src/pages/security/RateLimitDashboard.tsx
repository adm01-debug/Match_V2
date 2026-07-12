import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Shield, Ban, CheckCircle, Activity, AlertTriangle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import MainLayout from '@/components/layout/MainLayout';
import BlockedIPsPanel from '@/components/security/BlockedIPsPanel';
import IPWhitelistPanel from '@/components/security/IPWhitelistPanel';

interface RateLimitLog {
  id: string;
  ip_address: string;
  endpoint: string;
  request_count: number;
  blocked: boolean;
  created_at: string;
}

interface IPAccessLog {
  id: string;
  ip_address: string;
  user_id: string | null;
  action: string;
  allowed: boolean;
  endpoint: string | null;
  created_at: string;
}

export default function RateLimitDashboard() {
  usePageTitle('Rate Limit Dashboard');
  const { hasRole } = useAuth();
  const [timeRange, setTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState('overview');

  const isAdmin = hasRole('admin');

  const getTimeFilter = () => {
    const now = new Date();
    switch (timeRange) {
      case '1h': return new Date(now.getTime() - 60 * 60 * 1000).toISOString();
      case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      default: return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    }
  };

  // Fetch rate limit logs
  const { data: rateLimitLogs, isLoading: loadingRateLimits } = useQuery({
    queryKey: ['rate-limit-logs', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rate_limit_logs')
        .select('*')
        .gte('created_at', getTimeFilter())
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as RateLimitLog[];
    },
    enabled: isAdmin,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch IP access logs
  const { data: accessLogs, isLoading: loadingAccessLogs } = useQuery({
    queryKey: ['ip-access-logs', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ip_access_logs')
        .select('*')
        .gte('created_at', getTimeFilter())
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw error;
      return data as IPAccessLog[];
    },
    enabled: isAdmin,
    refetchInterval: 30000,
  });

  // Calculate stats
  const stats = {
    totalRequests: rateLimitLogs?.reduce((sum, log) => sum + log.request_count, 0) || 0,
    blockedRequests: rateLimitLogs?.filter(log => log.blocked).length || 0,
    uniqueIPs: new Set(rateLimitLogs?.map(log => log.ip_address)).size,
    deniedAccess: accessLogs?.filter(log => !log.allowed).length || 0,
  };

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertTriangle className="h-12 w-12 text-warning mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Acesso Negado</h2>
              <p className="text-muted-foreground">
                Você não tem permissão para acessar esta página.
              </p>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Rate Limit Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitore e gerencie limites de requisições e bloqueios de IP
            </p>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Última hora</SelectItem>
              <SelectItem value="24h">24 horas</SelectItem>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-info/10">
                  <Activity className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalRequests.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total de Requisições</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-destructive/10">
                  <Ban className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.blockedRequests}</p>
                  <p className="text-sm text-muted-foreground">Bloqueadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-success/10">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.uniqueIPs}</p>
                  <p className="text-sm text-muted-foreground">IPs Únicos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-warning/10">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.deniedAccess}</p>
                  <p className="text-sm text-muted-foreground">Acessos Negados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="blocked">IPs Bloqueados</TabsTrigger>
            <TabsTrigger value="whitelist">Whitelist</TabsTrigger>
            <TabsTrigger value="logs">Logs de Acesso</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Logs de Rate Limit</CardTitle>
                <CardDescription>Últimas requisições com limite de taxa</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingRateLimits ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : rateLimitLogs?.length === 0 ? (
                  <Alert>
                    <AlertDescription>Nenhum log de rate limit encontrado no período.</AlertDescription>
                  </Alert>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>IP</TableHead>
                        <TableHead>Endpoint</TableHead>
                        <TableHead>Requisições</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data/Hora</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rateLimitLogs?.slice(0, 20).map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">{log.ip_address}</TableCell>
                          <TableCell className="font-mono text-sm">{log.endpoint}</TableCell>
                          <TableCell>{log.request_count}</TableCell>
                          <TableCell>
                            <Badge variant={log.blocked ? 'destructive' : 'default'}>
                              {log.blocked ? 'Bloqueado' : 'OK'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(log.created_at), "dd/MM HH:mm:ss", { locale: ptBR })}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blocked">
            <BlockedIPsPanel />
          </TabsContent>

          <TabsContent value="whitelist">
            <IPWhitelistPanel />
          </TabsContent>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Logs de Acesso por IP</CardTitle>
                <CardDescription>Histórico de tentativas de acesso</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingAccessLogs ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : accessLogs?.length === 0 ? (
                  <Alert>
                    <AlertDescription>Nenhum log de acesso encontrado no período.</AlertDescription>
                  </Alert>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>IP</TableHead>
                        <TableHead>Ação</TableHead>
                        <TableHead>Endpoint</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Data/Hora</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {accessLogs?.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono text-sm">{log.ip_address}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell className="font-mono text-sm">{log.endpoint || '-'}</TableCell>
                          <TableCell>
                            <Badge variant={log.allowed ? 'default' : 'destructive'}>
                              {log.allowed ? 'Permitido' : 'Negado'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {format(new Date(log.created_at), "dd/MM HH:mm:ss", { locale: ptBR })}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
