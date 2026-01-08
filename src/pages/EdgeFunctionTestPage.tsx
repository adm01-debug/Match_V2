/**
 * @fileoverview Página de teste das Edge Functions protegidas
 * @module EdgeFunctionTestPage
 */

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Shield, 
  User, 
  FileText, 
  Target, 
  Mail, 
  MessageSquare, 
  Github,
  Globe,
  ShieldAlert,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TestResult {
  status: 'idle' | 'loading' | 'success' | 'error';
  message: string;
  data?: unknown;
  statusCode?: number;
}

const defaultResult: TestResult = { status: 'idle', message: 'Não testado' };

const EdgeFunctionTestPage = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  
  const [results, setResults] = useState<Record<string, TestResult>>({
    'parse-resume': { ...defaultResult },
    'match-score': { ...defaultResult },
    'send-email': { ...defaultResult },
    'send-whatsapp': { ...defaultResult },
    'github-api': { ...defaultResult },
    'geo-check': { ...defaultResult },
    'ip-guard': { ...defaultResult },
    'health': { ...defaultResult },
  });

  const updateResult = (fn: string, result: TestResult) => {
    setResults(prev => ({ ...prev, [fn]: result }));
  };

  const testFunction = async (fnName: string, body: Record<string, unknown> = {}) => {
    updateResult(fnName, { status: 'loading', message: 'Testando...' });
    
    try {
      const { data, error } = await supabase.functions.invoke(fnName, {
        body,
      });

      if (error) {
        updateResult(fnName, { 
          status: 'error', 
          message: error.message || 'Erro desconhecido',
          statusCode: 500
        });
      } else {
        updateResult(fnName, { 
          status: 'success', 
          message: 'Função executada com sucesso!',
          data,
          statusCode: 200
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao chamar função';
      updateResult(fnName, { 
        status: 'error', 
        message: errorMessage,
        statusCode: 500
      });
    }
  };

  const testParseResume = () => testFunction('parse-resume', { 
    resumeUrl: 'https://example.com/test.pdf',
    candidatoId: 'test-id'
  });

  const testMatchScore = () => testFunction('match-score', { 
    candidatoId: 'test-id',
    vagaId: 'test-vaga-id'
  });

  const testSendEmail = () => testFunction('send-email', { 
    to: 'test@example.com',
    subject: 'Teste de Email',
    html: '<p>Este é um teste</p>'
  });

  const testSendWhatsapp = () => testFunction('send-whatsapp', { 
    to: '+5511999999999',
    message: 'Teste de WhatsApp'
  });

  const testGithubApi = () => testFunction('github-api', { 
    username: 'octocat'
  });

  const testGeoCheck = () => testFunction('geo-check', { 
    ip: '8.8.8.8'
  });

  const testIpGuard = () => testFunction('ip-guard', { 
    ip: '192.168.1.1',
    action: 'check'
  });

  const testHealth = () => testFunction('health', {});

  const testAllFunctions = async () => {
    await testHealth();
    await testGeoCheck();
    await testIpGuard();
    await testParseResume();
    await testMatchScore();
    await testSendEmail();
    await testSendWhatsapp();
    await testGithubApi();
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-muted" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Badge variant="secondary">Testando...</Badge>;
      case 'success':
        return <Badge className="bg-green-500">Sucesso</Badge>;
      case 'error':
        return <Badge variant="destructive">Erro</Badge>;
      default:
        return <Badge variant="outline">Pendente</Badge>;
    }
  };

  const functionTests = [
    { 
      name: 'health', 
      label: 'Health Check', 
      icon: RefreshCw, 
      description: 'Verifica se o serviço está online',
      action: testHealth,
      isProtected: false
    },
    { 
      name: 'geo-check', 
      label: 'Geo Check', 
      icon: Globe, 
      description: 'Verifica localização geográfica por IP',
      action: testGeoCheck,
      isProtected: false
    },
    { 
      name: 'ip-guard', 
      label: 'IP Guard', 
      icon: ShieldAlert, 
      description: 'Verifica se IP está bloqueado',
      action: testIpGuard,
      isProtected: false
    },
    { 
      name: 'parse-resume', 
      label: 'Parse Resume', 
      icon: FileText, 
      description: 'Extrai dados de currículo (requer auth)',
      action: testParseResume,
      isProtected: true
    },
    { 
      name: 'match-score', 
      label: 'Match Score', 
      icon: Target, 
      description: 'Calcula compatibilidade candidato/vaga (requer auth)',
      action: testMatchScore,
      isProtected: true
    },
    { 
      name: 'send-email', 
      label: 'Send Email', 
      icon: Mail, 
      description: 'Envia email via Resend (requer auth)',
      action: testSendEmail,
      isProtected: true
    },
    { 
      name: 'send-whatsapp', 
      label: 'Send WhatsApp', 
      icon: MessageSquare, 
      description: 'Envia mensagem WhatsApp (requer auth)',
      action: testSendWhatsapp,
      isProtected: true
    },
    { 
      name: 'github-api', 
      label: 'GitHub API', 
      icon: Github, 
      description: 'Busca dados do GitHub (requer auth)',
      action: testGithubApi,
      isProtected: true
    },
  ];

  const renderFunctionCard = (fn: typeof functionTests[0]) => {
    const result = results[fn.name] || defaultResult;
    const Icon = fn.icon;
    
    return (
      <Card key={fn.name} className="overflow-hidden">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-4">
            {getStatusIcon(result.status)}
            <div className={`p-2 rounded-lg ${fn.isProtected ? 'bg-primary/10' : 'bg-muted'}`}>
              <Icon className={`h-5 w-5 ${fn.isProtected ? 'text-primary' : 'text-muted-foreground'}`} />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{fn.label}</h3>
              <p className="text-sm text-muted-foreground">{fn.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(result.status)}
            <Button 
              size="sm" 
              variant={fn.isProtected && user ? "default" : "outline"}
              onClick={fn.action}
              disabled={result.status === 'loading' || (fn.isProtected && !user)}
            >
              {fn.isProtected && !user ? 'Login Necessário' : 'Testar'}
            </Button>
          </div>
        </div>
        {result.status !== 'idle' && (
          <>
            <Separator />
            <div className="p-4 bg-muted/30">
              <p className="text-sm font-medium">Resultado:</p>
              <p className="text-sm text-muted-foreground">{result.message}</p>
              {result.data !== undefined && result.data !== null && (
                <pre className="mt-2 p-2 bg-background rounded text-xs overflow-auto max-h-32">
                  {typeof result.data === 'object' 
                    ? JSON.stringify(result.data, null, 2) 
                    : String(result.data)}
                </pre>
              )}
            </div>
          </>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Teste de Edge Functions
            </h1>
            <p className="text-muted-foreground mt-1">
              Verifique se a autenticação e as funções estão funcionando corretamente
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/')}>
            Voltar ao Dashboard
          </Button>
        </div>

        {/* Auth Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Status de Autenticação
            </CardTitle>
          </CardHeader>
          <CardContent>
            {user ? (
              <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800 dark:text-green-200">Autenticado</AlertTitle>
                <AlertDescription className="text-green-700 dark:text-green-300">
                  <div className="mt-2 space-y-1 text-sm">
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Token válido:</strong> {session?.access_token ? 'Sim' : 'Não'}</p>
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
                <ShieldAlert className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800 dark:text-amber-200">Não Autenticado</AlertTitle>
                <AlertDescription className="text-amber-700 dark:text-amber-300">
                  <p className="mt-2">
                    Você precisa fazer login para testar as funções protegidas.
                  </p>
                  <Button 
                    className="mt-3" 
                    size="sm"
                    onClick={() => navigate('/auth')}
                  >
                    Fazer Login
                  </Button>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Test All Button */}
        <div className="flex justify-center">
          <Button 
            size="lg" 
            onClick={testAllFunctions}
            disabled={Object.values(results).some(r => r.status === 'loading')}
          >
            {Object.values(results).some(r => r.status === 'loading') ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Testando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-5 w-5" />
                Testar Todas as Funções
              </>
            )}
          </Button>
        </div>

        {/* Function Tests */}
        <div className="grid gap-4">
          {/* Public Functions */}
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            Funções Públicas
          </h2>
          
          {functionTests.filter(f => !f.isProtected).map(renderFunctionCard)}

          <Separator className="my-2" />

          {/* Protected Functions */}
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Funções Protegidas (Requerem Autenticação)
          </h2>

          {functionTests.filter(f => f.isProtected).map(renderFunctionCard)}
        </div>

        {/* Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Legenda de Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span>Função executou com sucesso</span>
              </div>
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-destructive" />
                <span>Erro (esperado se não autenticado em funções protegidas)</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Requer token JWT válido</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EdgeFunctionTestPage;
