# Regras de domínio que o código não deixa óbvio — referência para agentes

Ler quando mexer em candidatura, vaga, proposta, teste, acesso ou envio de mensagem.

Match_V2 é um ATS: vaga → candidatura → pipeline → avaliações/entrevistas → proposta assinada. O painel
interno fica em `src/routes/MainRoutes.tsx`/`AdminRoutes.tsx`; o candidato tem um portal separado.

## Rotas públicas (sem login) — superfície exposta

Declaradas direto em `src/routes/AppRoutes.tsx`, **antes** dos blocos protegidos: `/status`, `/termos`,
`/privacidade`, `/carreiras`, `/carreiras/:slug`, `/carreiras/vaga/:vagaId`, `/vagas/:vagaId/aplicar`,
`/assinar-proposta/:token`, `/avaliacao-cognitiva` e `/avaliacao-cognitiva/:vagaId`. Mais `/portal`
(login do candidato) em `PortalRoutes.tsx`.

Qualquer mudança nessas telas é mudança em superfície pública: valide payload, mantenha rate limit e não
dependa de sessão. O portal do candidato usa `PortalProtectedRoute` (guarda própria, não o
`ProtectedRoute` do painel).

Área admin: `ProtectedRoute requiredRoles={["admin"]}` **+** `Admin2FAGuard` em `/security/roles`,
`/security/rate-limit`, `/admin`, `/admin/audit-log`, `/admin/dlq`, `/diagnostico`,
`/edge-functions-test` (confirmado em `src/routes/AdminRoutes.tsx`). Tirar o `Admin2FAGuard` de qualquer
uma delas é regressão de segurança. **Exceção:** `/configuracoes/seguranca` usa `ProtectedRoute` sem
`requiredRoles` e sem 2FA — qualquer usuário logado abre; se for mexer em permissão, é o primeiro ponto a
conferir.

## Knockout: a função está duplicada — mude as duas

`evaluateKnockouts` existe em dois lugares, de propósito (edge function não importa de `src/`):

- front: `src/types/knockout.ts:34`, usado em `src/pages/AplicarVagaPage.tsx:115`;
- back: `supabase/functions/_shared/knockout.ts:24`, usado em `supabase/functions/public-apply/index.ts:105`.

Mudou tipo de pergunta, regra de eliminação ou formato de resposta → **mude os dois arquivos no mesmo PR**.
Mudar só o front deixa candidato eliminado passar pela edge (e vice-versa).

## Candidatura pública (`public-apply`)

Fluxo documentado no cabeçalho de `supabase/functions/public-apply/index.ts`: rate limit por IP → valida
payload e vaga publicada → garante usuário em `auth.users` (invite by email, dispara magic link) → trigger
`handle_new_candidate_user` cria `candidatos_auth` → upload opcional de currículo em base64 para o bucket
`curriculos` via service role → cria/reusa `candidatos` e insere `candidaturas` com dedup.

Consequências: mexer no formulário mexe em `auth.users`; mexer no dedup pode gerar candidatura duplicada
ou bloquear recandidatura; o currículo vai para storage, não para a tabela.

## Rate limit: há duas implementações diferentes

- **Padrão**: `supabase/functions/_shared/rateLimit.ts` → `enforceRateLimit(req, { route, max })`,
  persistido no banco com service role, devolve `Response 429` pronto. Usado por `public-apply`,
  `match-score`, `geo-check` e outras. É o que você deve usar em função nova.
- **Exceção**: `supabase/functions/ip-guard/index.ts:9-11` tem contador **em memória** (`RATE_LIMIT = 100`,
  `WINDOW_MS = 60000`, `Map` local). Reinicia a cada instância fria e não é compartilhado — não use como
  referência nem como garantia de limite.

Painel de rate limit: `/security/rate-limit` (admin + 2FA).

## Comunicação com o candidato nunca falha "silenciosa"

`supabase/functions/_shared/retryQueue.ts` enfileira falhas de `email`/`whatsapp` pela RPC
`enqueue_communication_retry` (com `dedupKey` e `maxAttempts`). O worker `process-retry-queue` drena a
`communication_retry_queue` **a cada 5 minutos via `pg_cron`**, autenticado por Bearer com o valor de
`SUPABASE_ANON_KEY` (comentado como `WORKER_SECRET` no arquivo). O que esgotar tentativas vira dead-letter
e aparece em `/admin/dlq`.

Depois de mexer em envio de e-mail/WhatsApp, **olhe a DLQ** — "mandei" pode significar "foi para a fila".

## Proposta assinada

`supabase/functions/sign-proposal/index.ts` é pública (`verify_jwt = false`) e valida com zod: `token` de
16 a 128 caracteres, `aceitar` booleano, `motivo_recusa` ≤ 1000, `assinatura_nome` 2–200. O token da URL
`/assinar-proposta/:token` é a única credencial — não afrouxe o schema nem logue o token.

## Detalhe que pode surpreender

Várias edges respondem `Access-Control-Allow-Origin: '*'` (ex.: `match-score`, `public-apply`,
`process-retry-queue`, `geo-check`). É o estado atual; não "corrija" junto com outro fix — vira mudança de
contrato de todas as chamadas do front.
