/**
 * @fileoverview Página de diagnóstico do sistema
 * @module DiagnosticoPage
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  RefreshCw, 
  Database, 
  User, 
  Server,
  Shield,
  Zap
} from 'lucide-react';

interface DiagnosticItem {
  name: string;
  status: 'loading' | 'success' | 'error' | 'warning';
  message: string;
  details?: string;
}

export default function DiagnosticoPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { user, session } = useAuth();
  const queryClient = useQueryClient();

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results: DiagnosticItem[] = [];

    // 1. Check React Query Provider
    try {
      if (queryClient) {
        results.push({
          name: 'React Query',
          status: 'success',
          message: 'QueryClientProvider configurado corretamente',
          details: `Cache com ${queryClient.getQueryCache().getAll().length} queries`
        });
      } else {
        results.push({
          name: 'React Query',
          status: 'error',
          message: 'QueryClientProvider não encontrado'
        });
      }
    } catch (e) {
      results.push({
        name: 'React Query',
        status: 'error',
        message: 'Erro ao verificar React Query',
        details: e instanceof Error ? e.message : 'Erro desconhecido'
      });
    }
    setDiagnostics([...results]);

    // 2. Check Auth Context
    try {
      if (user && session) {
        results.push({
          name: 'Autenticação',
          status: 'success',
          message: 'Usuário autenticado',
          details: `Email: ${user.email}`
        });
      } else if (session) {
        results.push({
          name: 'Autenticação',
          status: 'warning',
          message: 'Sessão existe mas user é null'
        });
      } else {
        results.push({
          name: 'Autenticação',
          status: 'warning',
          message: 'Nenhuma sessão ativa (usuário não logado)'
        });
      }
    } catch (e) {
      results.push({
        name: 'Autenticação',
        status: 'error',
        message: 'AuthProvider não encontrado',
        details: e instanceof Error ? e.message : 'Erro desconhecido'
      });
    }
    setDiagnostics([...results]);

    // 3. Check Supabase Connection
    try {
      const startTime = Date.now();
      const { error } = await supabase.from('vagas').select('id').limit(1);
      const latency = Date.now() - startTime;
      
      if (error) {
        results.push({
          name: 'Backend (Database)',
          status: 'error',
          message: 'Erro ao conectar ao banco',
          details: error.message
        });
      } else {
        results.push({
          name: 'Backend (Database)',
          status: 'success',
          message: 'Conexão com o banco OK',
          details: `Latência: ${latency}ms`
        });
      }
    } catch (e) {
      results.push({
        name: 'Backend (Database)',
        status: 'error',
        message: 'Falha na conexão com Supabase',
        details: e instanceof Error ? e.message : 'Erro desconhecido'
      });
    }
    setDiagnostics([...results]);

    // 4. Check Auth Service
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        results.push({
          name: 'Auth Service',
          status: 'error',
          message: 'Erro ao verificar sessão',
          details: error.message
        });
      } else {
        results.push({
          name: 'Auth Service',
          status: 'success',
          message: 'Serviço de autenticação OK',
          details: data.session ? 'Sessão válida' : 'Sem sessão ativa'
        });
      }
    } catch (e) {
      results.push({
        name: 'Auth Service',
        status: 'error',
        message: 'Falha no serviço de auth',
        details: e instanceof Error ? e.message : 'Erro desconhecido'
      });
    }
    setDiagnostics([...results]);

    // 5. Check Environment Variables
    const envVars = {
      VITE_SUPABASE_URL: import.meta.env['VITE_SUPABASE_URL'],
      VITE_SUPABASE_PUBLISHABLE_KEY: import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'],
    };
    
    const missingVars = Object.entries(envVars)
      .filter(([, v]) => !v)
      .map(([k]) => k);

    if (missingVars.length === 0) {
      results.push({
        name: 'Variáveis de Ambiente',
        status: 'success',
        message: 'Todas as variáveis configuradas',
        details: 'URL e Key do Supabase presentes'
      });
    } else {
      results.push({
        name: 'Variáveis de Ambiente',
        status: 'warning',
        message: 'Usando valores fallback',
        details: `Variáveis ausentes: ${missingVars.join(', ')}`
      });
    }
    setDiagnostics([...results]);

    // 6. Check RLS (if authenticated)
    if (user) {
      try {
        const { error } = await supabase.from('profiles').select('id').eq('user_id', user.id).single();
        if (error && error.code !== 'PGRST116') {
          results.push({
            name: 'RLS Policies',
            status: 'warning',
            message: 'Possível problema com RLS',
            details: error.message
          });
        } else {
          results.push({
            name: 'RLS Policies',
            status: 'success',
            message: 'Acesso a dados do usuário OK'
          });
        }
      } catch (e) {
        results.push({
          name: 'RLS Policies',
          status: 'error',
          message: 'Erro ao verificar RLS',
          details: e instanceof Error ? e.message : 'Erro desconhecido'
        });
      }
    }

    setDiagnostics([...results]);
    setIsRunning(false);
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: DiagnosticItem['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-success" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <Shield className="h-5 w-5 text-warning" />;
    }
  };

  const getStatusBadge = (status: DiagnosticItem['status']) => {
    switch (status) {
      case 'loading':
        return <Badge variant="secondary">Verificando...</Badge>;
      case 'success':
        return <Badge className="bg-success/10 text-success border-success/20">OK</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
      case 'warning':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Atenção</Badge>;
    }
  };

  const getItemIcon = (name: string) => {
    if (name.includes('React Query')) return <Zap className="h-4 w-4" />;
    if (name.includes('Autenticação') || name.includes('Auth')) return <User className="h-4 w-4" />;
    if (name.includes('Backend') || name.includes('Database')) return <Database className="h-4 w-4" />;
    if (name.includes('RLS') || name.includes('Variáveis')) return <Shield className="h-4 w-4" />;
    return <Server className="h-4 w-4" />;
  };

  const successCount = diagnostics.filter(d => d.status === 'success').length;
  const errorCount = diagnostics.filter(d => d.status === 'error').length;
  const warningCount = diagnostics.filter(d => d.status === 'warning').length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Diagnóstico do Sistema</h1>
            <p className="text-muted-foreground">Verificação de providers e conexões</p>
          </div>
          <Button onClick={runDiagnostics} disabled={isRunning}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Verificando...' : 'Retestar'}
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success">{successCount}</div>
              <div className="text-xs text-muted-foreground">OK</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-warning">{warningCount}</div>
              <div className="text-xs text-muted-foreground">Atenção</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-destructive">{errorCount}</div>
              <div className="text-xs text-muted-foreground">Erros</div>
            </CardContent>
          </Card>
        </div>

        {/* Diagnostic Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resultados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {diagnostics.map((item, index) => (
              <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  {getStatusIcon(item.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    {getItemIcon(item.name)}
                    <span className="font-medium">{item.name}</span>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{item.message}</p>
                  {item.details && (
                    <p className="text-xs text-muted-foreground/70 mt-0.5 font-mono">
                      {item.details}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {diagnostics.length === 0 && !isRunning && (
              <div className="text-center py-8 text-muted-foreground">
                Clique em "Retestar" para iniciar o diagnóstico
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => window.location.href = '/'}>
            Voltar ao Início
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/auth'}>
            Ir para Login
          </Button>
        </div>
      </div>
    </div>
  );
}
