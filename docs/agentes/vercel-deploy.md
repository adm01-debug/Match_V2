# Vercel e deploy — referência para agentes

Ler quando for confirmar um deploy, mexer em env var do front ou em domínio.

| O que | Valor |
|---|---|
| Projeto Vercel | `match-v2` (confirmado por `mcp__Vercel__list_projects`; o `prj_…`/`team_…` sai da mesma chamada — não registre ID aqui) |
| Framework / build / output | Vite + React · `npm run build` · `dist/` · Node 22 |
| MCP Vercel | ferramentas `mcp__Vercel__*` — **escrita = ação de produção** |
| Analytics | dependência `@vercel/speed-insights` no `package.json` |
| URL de produção | `https://match-v2.vercel.app` — é o campo `homepage` do repositório no GitHub; não foi aberta nem verificada nesta sessão |

## Deploy e edge functions

- **Front:** `deploy.yml` roda em push na `main` (e `workflow_dispatch`), faz `npm ci` + `npm run build`
  com `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` dos secrets e publica com
  `amondnet/vercel-action@v42 --prod`, usando `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`.
  **Merge em `main` = produção.**
- **Duas trilhas de deploy coexistem:** além do `deploy.yml`, a integração Git do Vercel está ligada — as
  PRs recebem o status `Vercel` e o check `Vercel Preview Comments` (evidência: checks das PRs #85 e #107).
  Qual das duas serve a produção **NÃO FOI VERIFICADO**: `mcp__Vercel__list_deployments` devolve
  `403 forbidden` com o token desta sessão. Antes de prometer rollback ou "deploy subiu", confirme no
  dashboard ou com um token que leia deployments.
- **`preview.yml` não faz deploy.** Ele só builda e comenta "🚀 Preview build completed successfully!" na
  PR. O preview de verdade vem da integração Git. Não use o comentário dele como evidência de deploy.
- **Edge functions não sobem no deploy.** Nenhum workflow roda `supabase functions deploy` — ver
  `docs/agentes/banco.md`.

## Regras de env var do front

- `VITE_*` entra no bundle e é **público**. Nunca prefixe segredo com `VITE_`.
- **Nunca** no Vercel: `SUPABASE_SERVICE_ROLE_KEY`, chaves de IA (Gemini/OpenAI), `EVOLUTION_*`,
  credenciais de e-mail, `POSTGRES_*`. Esses são das edge functions / secrets do Supabase.
- Esperadas no front (`.env.example`): `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_SENTRY_DSN`,
  `VITE_APP_VERSION`, `VITE_ANALYTICS_ID`, `VITE_API_URL`, `VITE_ENABLE_PWA`, `VITE_ENABLE_ANALYTICS`,
  `VITE_ENABLE_SENTRY`.
- `sentry-dsn-gate.yml` reprova push/PR em `main` sem `VITE_SENTRY_DSN` — se for mexer em observabilidade,
  mexa no secret antes, não no workflow.
