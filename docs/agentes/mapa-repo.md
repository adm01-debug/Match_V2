# Mapa do repositório — referência para agentes

Ler quando precisar saber onde fica algo antes de buscar por texto.

## Onde olhar primeiro

| Precisa de | Leia |
|---|---|
| Regras de trabalho (banco, Git, serviços, comandos) | `AGENTS.md` + `docs/agentes/*.md` — fonte de verdade |
| Qual tela existe e quem pode abrir | `src/routes/` (`AppRoutes.tsx` agrega `MainRoutes`, `AdminRoutes`, `AuthRoutes`, `PortalRoutes`; `lazyPages.ts` lista os componentes de página) |
| Regra de negócio não óbvia (knockout, score de IA, 2FA, IP, DLQ) | `docs/agentes/regras-dominio.md` |
| Banco, migrations, por que `psql` não conecta | `docs/agentes/banco.md` |
| Workflows, perímetro do GitHub, CI vermelha | `docs/agentes/github-ci.md` |
| Deploy do front e env vars | `docs/agentes/vercel-deploy.md` |
| Integrações externas (IA, WhatsApp, e-mail, job boards, infra) | `docs/agentes/servicos.md` |
| Histórico, auditorias, planos, levantamentos | os ~48 arquivos soltos em `docs/` (`index.md`, `ARCHITECTURE.md`, `AUDITORIA_*.md`, `PLANO_MELHORIAS_50_ETAPAS.md`, `COMPLETE_INVENTORY.md`…) — **contexto, não fonte de verdade**; escritos em momentos diferentes e já contradizem entre si |

## Mapa rápido

| Onde | O que tem |
|---|---|
| `src/components/` (580 arquivos) | UI em 48 subpastas por domínio (`auth/`, `admin/`, `vagas/`, `vaga-form/`, `candidatos/`, `pipeline/`, `portal/`, `security/`, `ui/` shadcn…) |
| `src/pages/` (74) | telas, carregadas via `src/routes/lazyPages.ts` |
| `src/hooks/` (106) | um hook por caso de uso (`useVagas`, `useCandidatos`, `useAiScreening`, `use2FA`…) + `behavioralResults/`, `gamification/`, `__tests__/` |
| `src/services/` (40) | integrações e regras de aplicação: `matchingService`, `evolutionApiService`, `whatsappService`, `emailService`, `workflowEngine`, `gdprService`, `ipService`, job boards (`linkedinService`, `indeedService`, `infojobsService`, `cathoService`), calendários (`googleCalendarService`, `outlookService`), `slackService`, `teamsService`, `logger` |
| `src/integrations/supabase/` | `client.ts` (**gerado — não editar à mão**, lê `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`) e `types.ts` (tipos do banco) |
| `src/types/` (25) | contratos do front; `knockout.ts` é **duplicado** em `supabase/functions/_shared/knockout.ts` |
| `src/config/`, `src/constants/`, `src/contexts/`, `src/lib/`, `src/data/`, `src/domain/`, `src/utils/` | configuração, providers, helpers, mocks/seed de UI |
| `src/test/` | setup do vitest (jsdom, mocks) |
| `supabase/functions/` | 27 edge functions Deno + `_shared/` (`aiCache.ts`, `knockout.ts`, `metrics.ts`, `rateLimit.ts`, `resilience.ts`, `retryQueue.ts`) |
| `supabase/migrations/` | 97 arquivos `.sql`; `supabase/seed.sql` (104 linhas) e `supabase/config.toml` (project_id + `verify_jwt` por função) |
| `e2e/` | specs Playwright (`home-page`, `navigation`, `job-publisher`, `indicacoes`, `mobile`, `keyboard-shortcuts`…) |
| `.github/workflows/` | 34 workflows — inventário em `docs/agentes/github-ci.md` |
| `scripts/` | só `setup.sh` e `deploy.sh` (não há pasta `scripts/ci/` neste repo) |
| `k8s/`, `terraform/`, `grafana/`, `prometheus.yml`, `nginx.conf`, `Dockerfile`, `Dockerfile.prod`, `docker-compose*.yml` | infra declarada; ver `docs/agentes/servicos.md` |
| `.storybook/`, `lighthouse.config.js`, `.bundlewatch.config.json`, `bundle-analyzer.config.js`, `openapi.yaml`, `Makefile` | ferramental de qualidade e documentação de API |

Lixo conhecido na raiz (não é fonte de nada, não cite como evidência): `has_cors.txt`, `has_jwt.txt`,
`has_options.txt`, `has_try_catch.txt`, `rls_enabled.txt`, `tables_created.txt`, `security_definer.txt`,
`find_no_rls.py`, `test-supabase.mjs`, `audit_report.md`, `bun.lock`, `bun.lockb`.

## Comandos

Gerenciador é **npm** (`npm ci` no CI). `bun.lock`/`bun.lockb` existem na raiz mas **nenhum workflow usa
bun** — não troque de gerenciador por causa deles. Node `22.23.2` (`.nvmrc`); `.npmrc` tem
`engine-strict=true`, `save-exact=true`, `legacy-peer-deps=true`.

- lint: `npm run lint` (eslint) · formatação: `npm run format:check`;
- typecheck: `npm run type-check` (= `tsc --noEmit`);
- unitários só do que tocou: `npx vitest run <caminho>`; suíte: `npm run test:run`; cobertura: `npm run test:ci`;
- E2E: `npm run test:e2e` (Playwright) · Storybook: `npm run storybook`;
- build: `npm run build` (saída `dist/`);
- banco: `npm run db:migrate` (= `supabase db push`), `npm run db:seed`, `npm run db:reset` — leia
  `docs/agentes/banco.md` antes;
- `Makefile` expõe os mesmos alvos (`make lint`, `make test`, `make build`…) para quem preferir.

Hooks husky: `pre-commit` roda `lint-staged` (eslint --fix + prettier nos arquivos staged); `commit-msg`
roda `commitlint`. Não use `--no-verify` — o `AGENTS.md` anterior autorizava, e era o que deixava passar
mensagem fora do padrão.
