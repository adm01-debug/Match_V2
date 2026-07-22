/**
 * @fileoverview A28 — Spans de performance para chamadas RPC do Supabase.
 * Envolve uma chamada `supabase.rpc(...)` em um span do Sentry (`op: 'db.rpc'`),
 * medindo latência e marcando status conforme resultado. No-op quando o Sentry
 * não está inicializado (sem `VITE_SENTRY_DSN`), preservando o retorno original.
 * @module lib/sentryRpc
 */
import * as Sentry from '@sentry/react';
import { isSentryEnabled } from '@/lib/sentry';

/**
 * Executa `fn` dentro de um span do Sentry nomeado `rpc:<name>`.
 * - Preserva o tipo genérico `T` do retorno (útil para `{ data, error }` do PostgREST).
 * - Marca o span como erro se o resultado contiver `error` truthy ou lançar exceção.
 * - Se o Sentry não estiver ativo, apenas executa `fn` sem overhead.
 */
export async function tracedRpc<T>(name: string, fn: () => Promise<T>): Promise<T> {
  if (!isSentryEnabled()) return fn();

  return Sentry.startSpan(
    { name: `rpc:${name}`, op: 'db.rpc', attributes: { 'rpc.name': name } },
    async (span) => {
      try {
        const result = await fn();
        const maybeErr = (result as unknown as { error?: unknown } | null)?.error;
        if (maybeErr) {
          span?.setStatus({ code: 2, message: 'rpc_error' });
        }
        return result;
      } catch (err) {
        span?.setStatus({ code: 2, message: 'exception' });
        throw err;
      }
    },
  );
}
