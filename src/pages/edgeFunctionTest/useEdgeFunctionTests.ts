import { useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { defaultResult, type TestResult } from './types';
import { FUNCTION_TESTS } from './functionTests';

export const useEdgeFunctionTests = () => {
  const [results, setResults] = useState<Record<string, TestResult>>(() =>
    Object.fromEntries(FUNCTION_TESTS.map((f) => [f.name, { ...defaultResult }]))
  );

  const updateResult = useCallback((fn: string, result: TestResult) => {
    setResults((prev) => ({ ...prev, [fn]: result }));
  }, []);

  const testFunction = useCallback(
    async (fnName: string, body: Record<string, unknown> = {}) => {
      updateResult(fnName, { status: 'loading', message: 'Testando...' });
      try {
        const { data, error } = await supabase.functions.invoke(fnName, { body });
        if (error) {
          updateResult(fnName, { status: 'error', message: error.message || 'Erro desconhecido', statusCode: 500 });
        } else {
          updateResult(fnName, { status: 'success', message: 'Função executada com sucesso!', data, statusCode: 200 });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao chamar função';
        updateResult(fnName, { status: 'error', message, statusCode: 500 });
      }
    },
    [updateResult]
  );

  const testAll = useCallback(async () => {
    for (const fn of FUNCTION_TESTS) {
      await testFunction(fn.name, fn.body);
    }
  }, [testFunction]);

  const isRunning = Object.values(results).some((r) => r.status === 'loading');

  return { results, testFunction, testAll, isRunning };
};
