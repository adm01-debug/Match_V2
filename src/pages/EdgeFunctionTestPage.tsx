/**
 * @fileoverview Página de teste das Edge Functions protegidas
 * @module EdgeFunctionTestPage
 */

import { useNavigate } from 'react-router-dom';
import { Shield, Globe, RefreshCw, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FUNCTION_TESTS } from './edgeFunctionTest/functionTests';
import { useEdgeFunctionTests } from './edgeFunctionTest/useEdgeFunctionTests';
import { FunctionTestCard } from './edgeFunctionTest/FunctionTestCard';
import { AuthStatusCard } from './edgeFunctionTest/AuthStatusCard';
import { defaultResult } from './edgeFunctionTest/types';

const EdgeFunctionTestPage = () => {
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const { results, testFunction, testAll, isRunning } = useEdgeFunctionTests();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
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

        <AuthStatusCard user={user} session={session} />

        <div className="flex justify-center">
          <Button size="lg" onClick={testAll} disabled={isRunning}>
            {isRunning ? (
              <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Testando...</>
            ) : (
              <><RefreshCw className="mr-2 h-5 w-5" />Testar Todas as Funções</>
            )}
          </Button>
        </div>

        <div className="grid gap-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            Funções Públicas
          </h2>
          {FUNCTION_TESTS.filter((f) => !f.isProtected).map((fn) => (
            <FunctionTestCard
              key={fn.name}
              fn={fn}
              result={results[fn.name] ?? defaultResult}
              isAuthenticated={!!user}
              onRun={() => testFunction(fn.name, fn.body)}
            />
          ))}

          <Separator className="my-2" />

          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Funções Protegidas (Requerem Autenticação)
          </h2>
          {FUNCTION_TESTS.filter((f) => f.isProtected).map((fn) => (
            <FunctionTestCard
              key={fn.name}
              fn={fn}
              result={results[fn.name] ?? defaultResult}
              isAuthenticated={!!user}
              onRun={() => testFunction(fn.name, fn.body)}
            />
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Legenda de Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-success" />
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
