# Serviços e integrações — referência para agentes

Ler quando mexer em IA, WhatsApp, e-mail, job boards, observabilidade ou na infra declarada no repo.

## IA (Gemini) com cache — a pegadinha mais cara

`parse-resume`, `match-score` e `ai-screening` usam `withCache` (`supabase/functions/_shared/aiCache.ts`):
a chave é `SHA-256(operação + versão + input normalizado)` e a resposta fica em JSONB no banco; qualquer
erro de cache é *fail-open* (ignora o cache e segue).

Cada função declara a sua versão: `CACHE_VERSION = "gemini-2.5-flash:v1"` em
`supabase/functions/parse-resume/index.ts:11` e `supabase/functions/match-score/index.ts:11`;
`"gemini-2.5-flash:ai-screening:v1"` em `supabase/functions/ai-screening/index.ts:18`.

**Mudou prompt, modelo ou formato de saída → suba a `CACHE_VERSION` dessa função no mesmo PR.** Sem isso o
usuário continua recebendo a resposta antiga do cache e o "fix" parece não ter efeito.

Outras funções de IA: `behavioral-analysis`, `cultural-fit`, `generate-scorecard`, `ai-assistant`.

## WhatsApp / Evolution

- Edges `evolution-api`, `evolution-health`, `send-whatsapp`; no front, `src/services/evolutionApiService.ts`
  e `src/services/whatsappService.ts`.
- Credenciais (`EVOLUTION_*`) são secrets das edge functions — nunca no Vercel, nunca `VITE_*`.
- Falha de envio cai na fila de retry (abaixo), não se perde silenciosamente.

## E-mail e fila de retry

- `send-email` + `resend-webhook` (webhook público, `verify_jwt = false`) e `src/services/emailService.ts`.
- `supabase/functions/_shared/retryQueue.ts` chama a RPC `enqueue_communication_retry` com canal
  `"email" | "whatsapp"`, destinatário, payload, erro e `dedupKey`. O consumidor é a edge
  `process-retry-queue`; o que estourar as tentativas vira dead-letter e aparece na tela `/admin/dlq`.
- Mexeu em envio? Confira a DLQ depois — mensagem "enviada" com erro vai para a fila, não para o usuário.

## Job boards e calendários

`src/services/`: `linkedinService`, `indeedService`, `infojobsService`, `cathoService`, `jobBoardService`
(agregador), `googleCalendarService`, `outlookService`, `meetingService`, `autoSchedulingService`,
`slackService`, `teamsService`. Edge `hunter-sync` e `github-api` complementam. Nenhuma dessas integrações
foi exercitada nesta sessão — **não afirme que alguma está ativa em produção sem request real**.

## Observabilidade

- Sentry no front por `VITE_SENTRY_DSN`, com gate de CI (`sentry-dsn-gate.yml`).
- `supabase/functions/_shared/metrics.ts` e `resilience.ts` instrumentam as edges.
- `grafana/` e `prometheus.yml` existem no repo; `k8s/`, `terraform/`, `Dockerfile`, `Dockerfile.prod`,
  `docker-compose*.yml`, `nginx.conf` também. **Nada disso foi verificado rodando** — o deploy conhecido do
  front é o Vercel (`docs/agentes/vercel-deploy.md`). Tratar como infra declarada, não como ambiente ativo;
  alterar qualquer um = PR aberta e chamar o dono.
