# Contexto do projeto para agentes de IA

GERADO AUTOMATICAMENTE por scripts/ai-context/gerar.mjs — não editar à mão; será sobrescrito.
Publicado em `docs/contexto/codigo/` na branch `contexto` (gerada, nunca abra PR dela) a cada push em `main` que toque código e uma vez por dia, pelo workflow `contexto.yml`; índice único das fontes em `docs/contexto/00-INDEX.md`. O estado real do banco não sai daqui: está em `inventario/estado/banco.json` (workflow `inventario-estado-semanal.yml`). Gere local com `node scripts/ai-context/gerar.mjs`. Commit-base: `838a4dcc6babfd555a01d52528007569d2dc9030` (2026-11-08T21:43:35-03:00).

## Como usar (leia antes de planejar ou executar qualquer tarefa)
1. **Tela/rota/menu** → `rotas.json` (url/vista/menu → arquivo → hooks → tabelas → edges; `rotas_http_backend` para APIs) e `modulos.json` (módulo inteiro + dependências entre módulos).
2. **Hook/serviço/lógica** → `hooks.json`, `logica.json` (quem usa, o que toca, se tem teste).
3. **Edge function / serverless** → `edge-functions.json` (verify_jwt, tabelas, env, quem chama, órfãs).
4. **Banco** → `banco.json` (colunas, RLS, policies, índices, FKs, triggers, cron jobs, buckets, drift migration×types, uso no código) — visão do código; para o banco vivo use o MCP.
5. **Antes de criar arquivo** → `convencoes.json` (onde ficam as coisas, nomenclatura, alias), `componentes.json` (nomes duplicados, órfãos), `grafo.json` (hubs, ciclos de import) e `grafo-graphify.json` (grafo por AST: comunidades, símbolos mais chamados, comunidade de cada arquivo).
6. **CI/scripts/deploy/env/integrações/permissões/flags** → `ferramentas.json` e `scripts.json`.
7. **Antes de abrir PR** → `testes.json` (o que tem e não tem teste, onde os testes ficam), `baseline.json` (alertas, TODOs, hotspots, últimos commits).
Os JSONs são grandes: filtre com `grep`/`jq` pelo caminho/arquivo/tabela da sua tarefa; não carregue tudo.

## Stack
- linguagens: TypeScript (1028), SQL (100), Markdown (80), YAML (52), JSON (27), JavaScript (20), Python (4), Shell (3)
- linguagem_principal: TypeScript
- framework: React
- backend_http: n/d
- bundler: Vite
- roteador: react-router
- banco: Supabase
- testes: vitest, playwright
- ui: tailwind, radix/shadcn
- estado: react-query
- gerenciador_pacotes: bun
- node: 22.23.2
- python: n/d
- deploy: docker, compose/swarm
- monorepo: n/d
- pastas_fonte: src

## Números
| item | qtd |
|---|---|
| arquivos_total | 1343 |
| arquivos_codigo | 1050 |
| linhas_codigo | 135465 |
| rotas | 59 |
| rotas_http_backend | 12 |
| vistas_por_id | 0 |
| itens_menu | 42 |
| modulos | 88 |
| componentes | 541 |
| hooks | 145 |
| edge_functions | 25 |
| tabelas | 103 |
| migrations | 97 |
| cron_jobs | 0 |
| testes | 90 |
| workflows | 36 |
| scripts | 14 |
| docs_md | 80 |

## Onde ficam as coisas
- telas: src/pages (54)
- componentes: src/components (473), src/pages (59), src/contexts (7)
- hooks: src/hooks (100), src/components (35), src/contexts (7)
- servicos_logica: src/lib (41), src/data (36), src/services (29)
- testes: e2e/ (36), co-localizado (__tests__) (24), outro (22)
- edge_functions: supabase/functions
- migrations: supabase/migrations
- scripts: scripts/inventario (6), scripts/regras_negocio (3), scripts/ai-context (2)
- docs: docs (48), (raiz) (8), .github (1)
- nomenclatura: {"componentes":"PascalCase (89%)","hooks":"use + PascalCase","servicos":"camelCase (98%)","edge_functions":"kebab-case (96%)","tabelas":"snake_case (78%)"}
- instruções para agentes no repo: AGENTS.md, CLAUDE.md

## Módulos (menu → domínio)
| módulo | itens de menu | telas/rotas | arquivos | hooks locais | edges | tabelas |
|---|---|---|---|---|---|---|
| components | 0 | 0 | 6 | 76 | 6 | 23 |
| components/a11y | 0 | 0 | 10 | 7 | 0 | 0 |
| components/admin | 0 | 0 | 9 | 3 | 0 | 1 |
| components/agenda | 0 | 0 | 22 | 17 | 1 | 3 |
| components/analytics | 0 | 0 | 11 | 6 | 0 | 0 |
| components/assessments | 0 | 0 | 65 | 11 | 0 | 4 |
| components/auth | 0 | 0 | 20 | 7 | 2 | 5 |
| components/candidato | 0 | 0 | 10 | 3 | 1 | 2 |
| components/candidatos | 0 | 0 | 37 | 23 | 2 | 10 |
| components/common | 0 | 0 | 15 | 10 | 0 | 0 |
| components/dashboard | 0 | 0 | 22 | 9 | 0 | 2 |
| components/dna | 0 | 0 | 17 | 0 | 0 | 0 |
| components/empty-states | 0 | 0 | 22 | 0 | 0 | 0 |
| components/gamification | 0 | 0 | 69 | 18 | 0 | 1 |
| components/hiring-manager | 0 | 0 | 5 | 0 | 0 | 0 |
| components/indicacoes | 0 | 0 | 6 | 0 | 0 | 0 |
| components/intelligence | 0 | 0 | 7 | 6 | 0 | 0 |
| components/layout | 0 | 0 | 5 | 8 | 0 | 1 |
| components/match | 0 | 0 | 14 | 0 | 0 | 0 |
| components/mobile | 0 | 0 | 6 | 0 | 0 | 0 |
| components/offers | 0 | 0 | 6 | 0 | 0 | 0 |
| components/pipeline | 0 | 0 | 8 | 0 | 0 | 0 |
| components/reports | 0 | 0 | 6 | 1 | 0 | 4 |
| components/security | 0 | 0 | 8 | 5 | 0 | 5 |
| components/settings | 0 | 0 | 11 | 5 | 0 | 0 |
| components/skeletons | 0 | 0 | 6 | 0 | 0 | 0 |
| components/ui | 0 | 0 | 62 | 6 | 0 | 0 |
| components/vaga-form | 0 | 0 | 5 | 0 | 0 | 0 |
| components/vagas | 0 | 0 | 10 | 17 | 0 | 5 |
| components/visualization | 0 | 0 | 17 | 0 | 0 | 0 |
| components/workflow | 0 | 0 | 6 | 0 | 0 | 0 |
| config | 0 | 0 | 6 | 0 | 0 | 0 |
| contexts | 0 | 0 | 8 | 8 | 0 | 2 |
| data | 0 | 0 | 12 | 3 | 0 | 0 |
| data/behavioralAssessments | 0 | 0 | 10 | 0 | 0 | 0 |
| data/immersiveScenarios | 0 | 0 | 10 | 0 | 0 | 0 |
| hooks | 0 | 0 | 97 | 151 | 5 | 50 |
| hooks/behavioralResults | 0 | 0 | 5 | 7 | 0 | 2 |
| lib | 0 | 0 | 24 | 1 | 0 | 1 |
| lib/advancedBehavioral | 0 | 0 | 6 | 0 | 0 | 0 |
| lib/jobFit | 0 | 0 | 5 | 0 | 0 | 0 |
| lib/personality | 0 | 0 | 5 | 0 | 0 | 0 |
| pages | 34 | 43 | 39 | 133 | 8 | 43 |
| pages/admin | 0 | 2 | 2 | 0 | 0 | 0 |
| pages/auth | 0 | 5 | 6 | 3 | 0 | 2 |
| pages/edgeFunctionTest | 0 | 0 | 6 | 0 | 0 | 0 |
| pages/portal | 2 | 4 | 9 | 4 | 0 | 5 |
| pages/public | 0 | 2 | 2 | 0 | 0 | 0 |
| pages/security | 0 | 2 | 3 | 10 | 0 | 7 |
| pages/settings | 2 | 1 | 2 | 7 | 0 | 5 |
| routes | 0 | 0 | 6 | 133 | 8 | 43 |
| services | 0 | 0 | 29 | 0 | 7 | 13 |
| types | 0 | 0 | 18 | 0 | 0 | 0 |
| types/behavioral | 0 | 0 | 5 | 0 | 0 | 0 |

## Rotas (url → arquivo)
- `/` [tela] → src/pages/Dashboard.tsx
- `/*` [tela] → src/pages/NotFound.tsx
- `/admin` [tela] → src/pages/AdminPage.tsx (protegida)
- `/admin/audit-log` [tela] → src/pages/admin/AuditLogPage.tsx (protegida)
- `/admin/dlq` [tela] → src/pages/admin/DeadLetterQueuePage.tsx (protegida)
- `/agenda` [tela] → src/pages/AgendaPage.tsx
- `/analytics` [tela] → src/pages/AdvancedAnalyticsPage.tsx
- `/analytics-basico` [tela] → src/pages/AnalyticsPage.tsx
- `/assinar-proposta/:token` [tela] → src/pages/AssinarPropostaPage.tsx
- `/auth` [tela] → src/pages/AuthPage.tsx (protegida)
- `/auth/2fa` [tela] → src/pages/auth/TwoFactorAuthPage.tsx (protegida)
- `/auth/forgot-password` [tela] → src/pages/auth/ForgotPasswordPage.tsx
- `/auth/login` [tela] → src/pages/auth/LoginPage.tsx
- `/auth/register` [tela] → src/pages/auth/RegisterPage.tsx
- `/auth/reset-password` [tela] → src/pages/auth/ResetPasswordPage.tsx
- `/avaliacao-cognitiva` [tela] → src/pages/CognitiveTestPage.tsx
- `/avaliacao-cognitiva/:vagaId` [tela] → src/pages/CognitiveTestPage.tsx
- `/avaliacao-comportamental` [tela] → src/pages/BehavioralAssessmentPage.tsx
- `/avaliacao/:processoId` [tela] → src/pages/AvaliacaoForm.tsx
- `/avaliacoes` [tela] → src/pages/AvaliacoesPage.tsx
- `/avaliacoes-comportamentais` [tela] → src/pages/BehavioralAssessmentsPage.tsx
- `/banco-talentos` [tela] → src/pages/TalentPoolPage.tsx
- `/candidato/:id` [tela] → src/pages/CandidatoPerfilPage.tsx
- `/carreiras` [tela] → src/pages/CarreirasPage.tsx
- `/carreiras/:slug` [tela] → src/pages/CarreirasPage.tsx
- `/carreiras/vaga/:vagaId` [tela] → src/pages/AplicarVagaPage.tsx
- `/comunicacao` [tela] → src/pages/ComunicacaoPage.tsx
- `/configuracoes/seguranca` [tela] → src/pages/settings/SecuritySettingsPage.tsx (protegida)
- `/deu-match` [tela] → src/pages/DeuMatchPage.tsx
- `/diagnostico` [tela] → src/pages/DiagnosticoPage.tsx (protegida)
- `/edge-functions-test` [tela] → src/pages/EdgeFunctionTestPage.tsx (protegida)
- `/gamification` [tela] → src/pages/GamificationPage.tsx
- `/gestor` [tela] → src/pages/HiringManagerPortalPage.tsx
- `/indicacoes` [tela] → src/pages/IndicacoesPage.tsx
- `/ofertas` [tela] → src/pages/OfferManagementPage.tsx
- `/parser-curriculo` [tela] → src/pages/ResumeParserPage.tsx
- `/pipeline` [tela] → src/pages/Pipeline.tsx
- `/portal` [tela] → src/pages/portal/PortalAuthPage.tsx (protegida)
- `/portal/dashboard` [tela] → src/pages/portal/PortalDashboard.tsx (protegida)
- `/portal/perfil` [tela] → src/pages/portal/PortalPerfil.tsx (protegida)
- `/portal/vagas` [tela] → src/pages/portal/PortalVagas.tsx (protegida)
- `/privacidade` [tela] → src/pages/public/PrivacidadePage.tsx
- `/relatorios` [tela] → src/pages/ReportsPage.tsx
- `/security/rate-limit` [tela] → src/pages/security/RateLimitDashboard.tsx (protegida)
- `/security/roles` [tela] → src/pages/security/RolesPage.tsx (protegida)
- `/status` [tela] → src/pages/StatusPage.tsx
- `/talentos` [tela] → src/pages/CandidatosPage.tsx
- `/termos` [tela] → src/pages/public/TermosPage.tsx
- `/testes` [tela] → src/pages/TestsPage.tsx
- `/testes/:id/editar` [tela] → src/pages/ProvaEditor.tsx
- `/testes/:provaId/aplicar` [tela] → src/pages/ProvaAplicacao.tsx
- `/testes/nova` [tela] → src/pages/ProvaEditor.tsx
- `/vagas` [tela] → src/pages/VagasList.tsx
- `/vagas/:id` [tela] → src/pages/VagaDetalhes.tsx
- `/vagas/:id/editar` [tela] → src/pages/VagaForm.tsx
- `/vagas/:vagaId/aplicar` [tela] → src/pages/AplicarVagaPage.tsx
- `/vagas/:vagaId/ranking` [tela] → src/pages/RankingVagaPage.tsx
- `/vagas/nova` [tela] → src/pages/VagaForm.tsx
- `/workflows` [tela] → src/pages/WorkflowEditorPage.tsx

## Rotas HTTP de backend
- `GET /{t}` → scripts/ai-context/cenarios.mjs
- `GET /a` → scripts/ai-context/cenarios.mjs
- `GET /a` → scripts/ai-context/cenarios.mjs
- `POST /b` → scripts/ai-context/cenarios.mjs
- `POST /b` → scripts/ai-context/cenarios.mjs
- `DELETE /c` → scripts/ai-context/cenarios.mjs
- `PUT /d` → scripts/ai-context/cenarios.mjs
- `GET /items` → scripts/ai-context/gerar.unit.mjs
- `GET /u` → scripts/ai-context/cenarios.mjs
- `GET /users` → scripts/ai-context/cenarios.mjs
- `POST /users/:id` → scripts/ai-context/cenarios.mjs
- `GET /x` → scripts/ai-context/cenarios.mjs

## Vistas por id (menu/ViewRouter → arquivo)
- (nenhum)

## Edge functions
- `ai-assistant` — tabelas: -; chamada por 0 arquivo(s) do front — **ÓRFÃ**
- `ai-screening` — tabelas: candidatos, candidaturas, triagem_ia, vagas; chamada por 1 arquivo(s) do front
- `behavioral-analysis` — tabelas: -; chamada por 0 arquivo(s) do front — **ÓRFÃ**
- `cultural-fit` — tabelas: candidatos, perfis_comportamentais_empresa, valores_culturais; chamada por 0 arquivo(s) do front — **ÓRFÃ**
- `evolution-api` — tabelas: -; chamada por 1 arquivo(s) do front
- `evolution-health` — tabelas: -; chamada por 0 arquivo(s) do front — **ÓRFÃ**
- `generate-scorecard` — tabelas: assessment_respostas, behavioral_assessment_results, candidatos, perfis_cargo, processos_seletivos, scorecards; chamada por 1 arquivo(s) do front
- `geo-check` — tabelas: allowed_countries, geo_access_logs; chamada por 0 arquivo(s) do front — **ÓRFÃ**
- `github-api` — tabelas: -; chamada por 0 arquivo(s) do front — **ÓRFÃ**
- `health` (verify_jwt=false) — tabelas: communication_retry_queue, feature_flags, integration_health_events; chamada por 1 arquivo(s) do front
- `hunter-sync` — tabelas: hunter_leads; chamada por 0 arquivo(s) do front — **ÓRFÃ**
- `interview-reminders` — tabelas: candidatos, entrevistas, notifications, profiles; chamada por 1 arquivo(s) do front
- `ip-guard` — tabelas: allowed_ips, ip_access_logs; chamada por 0 arquivo(s) do front — **ÓRFÃ**
- `match-score` — tabelas: candidatos, vagas; chamada por 2 arquivo(s) do front
- `new-device-alert` — tabelas: ip_access_logs, notifications, profiles; chamada por 1 arquivo(s) do front
- `parse-resume` — tabelas: -; chamada por 3 arquivo(s) do front
- `password-reset-approval` — tabelas: password_reset_requests; chamada por 1 arquivo(s) do front
- `proactive-alerts` (verify_jwt=false) — tabelas: integration_health_events; chamada por 0 arquivo(s) do front
- `process-retry-queue` — tabelas: -; chamada por 0 arquivo(s) do front — **ÓRFÃ**
- `public-apply` (verify_jwt=false) — tabelas: candidatos, candidatos_auth, candidaturas, curriculos, vagas; chamada por 1 arquivo(s) do front
- `resend-webhook` (verify_jwt=false) — tabelas: integration_health_events; chamada por 0 arquivo(s) do front
- `send-email` — tabelas: -; chamada por 3 arquivo(s) do front
- `send-whatsapp` — tabelas: -; chamada por 1 arquivo(s) do front
- `sign-proposal` (verify_jwt=false) — tabelas: -; chamada por 1 arquivo(s) do front
- `webhook-handler` — tabelas: ip_access_logs, notificacoes_candidato; chamada por 0 arquivo(s) do front — **ÓRFÃ**

## Cron jobs (pg_cron / vercel)
- (nenhum)

## Integrações externas
- SDKs: Sentry, Supabase, i18next, react-query, zod
- hosts mais citados: api.resend.com, ai-gateway.lovable.dev, linkedin.com, api.dicebear.com, api.ipify.org, meet.google.com, teams.microsoft.com, test.com, x.supabase.co, zoom.us, accounts.google.com, api.pwnedpasswords.com, api.supabase.com, api.x.com, calendar.google.com
- webhooks recebidos: health, proactive-alerts, public-apply, resend-webhook, sign-proposal
- env de integração (só nomes): EVOLUTION_API_KEY, EVOLUTION_API_URL, EVOLUTION_INSTANCE_NAME, LOVABLE_API_KEY, RESEND_API_KEY, RESEND_WEBHOOK_SECRET, VITE_ENABLE_SENTRY, VITE_SENTRY_DSN, WEBHOOK_SIGNING_SECRET

## Permissões / papéis
- papéis no código: article (28), main (21), region (15), status (10), admin (9), alert (6), system (6), user (6), group (4), list (4), gestor (3), listitem (3), navigation (3), progressbar (2), rh (2), agent (1), authenticated (1), button (1), combobox (1), dialog (1), dominant (1), img (1), link (1), listbox (1), menuitem (1), note (1), option (1), presentation (1), separator (1), sup (1), timer (1)
- enums de papel: app_role: admin|rh|gestor
- guards: src/components/auth/Admin2FAGuard.tsx, src/components/auth/ProtectedRoute.tsx, src/components/portal/PortalProtectedRoute.tsx, src/components/security/IPGuard.tsx · rotas protegidas: 14 · públicas: /, /*, /agenda, /analytics, /analytics-basico, /assinar-proposta/:token, /auth/forgot-password, /auth/login, /auth/register, /auth/reset-password, /avaliacao-cognitiva, /avaliacao-cognitiva/:vagaId, /avaliacao-comportamental, /avaliacao/:processoId, /avaliacoes, /avaliacoes-comportamentais, /banco-talentos, /candidato/:id, /carreiras, /carreiras/:slug, /carreiras/vaga/:vagaId, /comunicacao, /deu-match, /gamification, /gestor, /indicacoes, /ofertas, /parser-curriculo, /pipeline, /privacidade, /relatorios, /status, /talentos, /termos, /testes, /testes/:id/editar, /testes/:provaId/aplicar, /testes/nova, /vagas, /vagas/:id, /vagas/:id/editar, /vagas/:vagaId/aplicar, /vagas/:vagaId/ranking, /vagas/nova, /workflows
- feature flags: FEATURE_X, nova-tela, novo-inbox

## Alertas (baseline.json → alertas)
- rotas_sem_arquivo: 0
- componentes_ambiguos: 0
- menu_sem_destino: 4 — ex.: Agendar Entrevista -> nova-entrevista, Criar Nova Vaga -> nova-vaga, Dashboard -> dashboard
- edges_orfas: 10 — ex.: ai-assistant, behavioral-analysis, cultural-fit
- edges_chamadas_sem_pasta: 0
- tabelas_sem_rls: 0
- tabelas_usadas_sem_definicao: 2 — ex.: curriculos, documentos
- tabelas_com_drift_migration_vs_types: 17 — ex.: allowed_ips, avaliacoes, candidatos
- rpcs_sem_definicao: 0
- componentes_orfaos: 37 — ex.: src/components/admin/GDPRConsent.tsx, src/components/admin/WhiteLabelSettings.tsx, src/components/analytics/AnalyticsKPIGrid.tsx
- componentes_com_nome_duplicado: 23 — ex.: AgendaSkeleton, BulkActionsBar, EmotionalRadarGame
- scripts_orfaos: 0
- env_usadas_nao_declaradas: 3 — ex.: DEV, MODE, PROD
- ciclos_de_import: 1
- possiveis_segredos_no_codigo: 3 — ex.: scripts/ai-context/cenarios.mjs:102, scripts/ci/inventario-banco.unit.mjs:174, test-supabase.mjs:5

## Grafo de código (graphify)
- 7399 nós · 19466 arestas · 454 comunidades · grafo do commit `838a4dcc`
- comunidades maiores: lucide-react (256), react (170), cn (128), ComunicacaoPage.tsx (123), gamification/index.ts (123), select.tsx (107), vagas/VagaCard.tsx (107), Layout.tsx (101), hooks/index.ts (88), package.json (85), client.ts (80), gerar.mjs (80)
- símbolos mais chamados: cn() (src/lib/utils.ts), useToast() (src/hooks/use-toast.ts), usePageTitle() (src/hooks/usePageTitle.ts), useAuth() (src/contexts/AuthContext.tsx), header() (scripts/regras_negocio/generate.py), uniq() (scripts/ai-context/gerar.mjs), readText() (scripts/ai-context/gerar.mjs), md_table() (scripts/regras_negocio/generate.py), read_text() (scripts/regras_negocio/generate.py), useFuzzySearch() (src/hooks/useFuzzySearch.ts), has() (scripts/ai-context/gerar.mjs), .write() (scripts/regras_negocio/test_generate.py)
- consulta local: `graphify query "<pergunta>"`, `graphify path "<A>" "<B>"`, `graphify explain "<X>"`

## Hotspots (arquivos mais alterados, 90 dias)
- package.json (32)
- package-lock.json (31)
- CHANGELOG.md (13)
- .github/workflows/ci.yml (7)
- .github/workflows/changelog.yml (6)
- .github/workflows/e2e.yml (5)
- .github/workflows/lighthouse.yml (5)
- .github/workflows/performance.yml (5)
- .github/workflows/release.yml (5)
- .github/workflows/test.yml (5)
- .github/workflows/a11y.yml (4)
- .github/workflows/bundle-size.yml (4)
- .github/workflows/chromatic.yml (4)
- .github/workflows/deploy.yml (4)
- .github/workflows/lint.yml (4)

## Workflows
- `a11y.yml` — Accessibility Tests (pull_request, push)
- `auto-assign.yml` — Auto Assign (pull_request)
- `bundle-size.yml` — Bundle Size (pull_request)
- `changelog.yml` — Changelog (push, workflow_dispatch)
- `chromatic.yml` — Chromatic (pull_request, push)
- `ci.yml` — CI/CD Pipeline (pull_request, push)
- `codeql.yml` — CodeQL Analysis (pull_request, push, schedule; cron 0 6 * * 1)
- `compress-images.yml` — Compress Images (pull_request)
- `contexto.yml` — Contexto para agentes de IA (push, schedule, workflow_dispatch; cron 41 9 * * *)
- `dependabot-auto-merge.yml` — Dependabot Auto-merge (pull_request)
- `dependency-review.yml` — Dependency Review (pull_request)
- `deploy.yml` — Deploy (push, workflow_dispatch)
- `docker-build.yml` — Docker Build (push)
- `e2e.yml` — E2E Tests (pull_request, push)
- `generate-audit-pdf.yml` — Generate Audit PDF (push, workflow_dispatch)
- `install-mcp-exec.yml` — _removed_install-mcp-exec (workflow_dispatch)
- `inventario-estado-semanal.yml` — Inventário do estado real (semanal) (schedule, workflow_dispatch; cron 23 10 * * 1)
- `label-sync.yml` — Sync Labels (push, workflow_dispatch)
- `lighthouse.yml` — Lighthouse CI (pull_request, push)
- `lint.yml` — Lint (pull_request, push)
- `load-test.yml` — Load Test (schedule, workflow_dispatch; cron 0 2 * * 1)
- `lock-threads.yml` — Lock Threads (schedule, workflow_dispatch; cron 0 0 * * *)
- `performance.yml` — Performance (push, schedule; cron 0 0 * * 0)
- `pr-check.yml` — PR Check (pull_request)
- `pr-size.yml` — PR Size Labels (pull_request)
- `preview.yml` — Preview Deploy (pull_request)
- `release-please.yml` — Release Please (push)
- `release.yml` — Release (push)
- `security-scan.yml` — Security Scan (pull_request, push, schedule; cron 0 0 * * 1)
- `sentry-dsn-gate.yml` — Sentry DSN Gate (pull_request, push)
- `size-label.yml` — PR Size Labels (pull_request)
- `stale.yml` — Stale Issues (schedule, workflow_dispatch; cron 30 1 * * *)
- `storybook-deploy.yml` — Storybook Deploy (push)
- `test.yml` — Test (pull_request, push)
- `visual-regression.yml` — Visual Regression (pull_request)
- `welcome.yml` — Welcome (issues, pull_request_target)

## Scripts npm
- `dev`: `vite`
- `build`: `vite build`
- `build:dev`: `vite build --mode development`
- `lint`: `eslint .`
- `preview`: `vite preview`
- `test`: `vitest`
- `test:run`: `vitest run`
- `test:coverage`: `vitest run --coverage`
- `test:ui`: `vitest --ui`
- `storybook`: `storybook dev -p 6006`
- `build-storybook`: `storybook build`
- `prepare`: `husky install`
- `format`: `prettier --write .`
- `type-check`: `tsc --noEmit`
- `lint:fix`: `eslint . --fix`
- `test:e2e`: `playwright test`
- `analyze`: `vite-bundle-visualizer`
- `clean`: `rm -rf dist node_modules/.cache .turbo`
- `test:watch`: `vitest --watch`
- `format:check`: `prettier --check .`
- `storybook:build`: `storybook build`
- `db:migrate`: `supabase db push`
- `contexto:ia`: `node scripts/ai-context/gerar.mjs --out docs/contexto/codigo`
- `contexto:regras`: `python3 scripts/regras_negocio/generate.py --repo . --out docs/contexto/regras --profile regras --no-pointer`
- `contexto:test`: `node --test scripts/ai-context/gerar.unit.mjs scripts/ci/inventario-rotas.unit.mjs scripts/ci/inventario-banco.unit.mjs scripts/ci/inventario-mudou.unit.mjs scripts/ci/inventario-repo.unit.mjs && python3 scripts/regras_negocio/test_generate.py`
- `inventario:rotas`: `node scripts/inventario/gerar-rotas.mjs`
- `inventario:edges`: `node scripts/inventario/gerar-repo.mjs < /dev/null`
- `inventario:banco`: `node scripts/inventario/gerar-banco.mjs`
- `docker:build`: `docker build -t match-ats .`
- `test:e2e:ui`: `playwright test --ui`
- `precommit`: `lint-staged`
- `typecheck`: `tsc --noEmit`
- `db:seed`: `supabase db seed`
- `db:reset`: `supabase db reset`
- `test:ci`: `vitest run --coverage`
- `test:coverage:report`: `vitest run --coverage --reporter=html`
- `postinstall`: `husky install || true`

## Documentos (raiz e docs/)
- `.github/PULL_REQUEST_TEMPLATE.md` (30 linhas)
- `AGENTS.md` — AGENTS.md — Match_V2 (122 linhas)
- `CHANGELOG.md` (946 linhas)
- `CLAUDE.md` (2 linhas)
- `CODE_OF_CONDUCT.md` — Contributor Covenant Code of Conduct (43 linhas)
- `CONTRIBUTING.md` — Contributing to Match ATS (71 linhas)
- `README.md` — 🎯 Match ATS (88 linhas)
- `SECURITY.md` — Security Policy (43 linhas)
- `audit_report.md` — Auditoria Técnica Enterprise 10/10 - People Lovers (Match ATS) (88 linhas)
- `docs/ACCESSIBILITY.md` — Accessibility Guide (68 linhas)
- `docs/ADR.md` — Architecture Decision Records (24 linhas)
- `docs/API_REFERENCE.md` — API Reference - Match ATS (174 linhas)
- `docs/API_TYPES.md` — API Types Documentation (73 linhas)
- `docs/ARCHITECTURE.md` — Match ATS - Architecture (35 linhas)
- `docs/AUDITORIA_CODIGO_360.md` — 🔍 Auditoria 360° de Código — People Lovers (125 linhas)
- `docs/AUDITORIA_ENTERPRISE_PEOPLE_LOVERS.md` — Auditoria Técnica Enterprise 10/10 - People Lovers (Match ATS) (88 linhas)
- `docs/AUDITORIA_EXAUSTIVA_FUNCIONALIDADES.md` — 🔍 AUDITORIA EXAUSTIVA — MATCH ATS (ATUALIZADA) (379 linhas)
- `docs/AUDITORIA_QA_EXAUSTIVA.md` — 🔬 Auditoria Exaustiva QA – People Lovers (89 linhas)
- `docs/BACKUP.md` — Backup e Disaster Recovery - Match ATS (80 linhas)
- `docs/BENCHMARK_GEEKHUNTER.md` — Benchmark GeekHunter → People Lovers (208 linhas)
- `docs/COMPLETE_INVENTORY.md` — 📦 Inventário Completo do Projeto Match ATS (746 linhas)
- `docs/COMPONENTS_GUIDE.md` — Guia de Componentes - Match ATS (82 linhas)
- `docs/DATABASE.md` — Database Schema (49 linhas)
- `docs/DEPENDENCIES_INSTALL.md` — 📦 Dependências Pendentes - Match ATS (63 linhas)
- `docs/DEPLOYMENT.md` — Deployment Guide (26 linhas)
- `docs/DEVELOPMENT.md` — Development Guide (36 linhas)
- `docs/FAQ.md` — Frequently Asked Questions (68 linhas)
- `docs/GLOSSARY.md` — Glossário (32 linhas)
- `docs/HOOKS_GUIDE.md` — Guia de Hooks - Match ATS (95 linhas)
- `docs/HOTFIX.md` — Procedimento de Hotfix (33 linhas)
- `docs/INTERNATIONALIZATION.md` — Internationalization (i18n) Guide (66 linhas)
- `docs/IP_WHITELIST.md` — 🔐 Sistema de Whitelist de IPs - MATCH ATS (172 linhas)
- `docs/LEVANTAMENTO_FUNCIONALIDADES_COMPLETO.md` — 📋 MATCH ATS — LEVANTAMENTO EXAUSTIVO DE FUNCIONALIDADES (1450 linhas)
- `docs/MELHORIAS_PENDENTES.md` — Melhorias Pendentes — Análise Exaustiva (193 linhas)
- `docs/MIGRATION.md` — Migration Guide (72 linhas)
- `docs/MONITORING.md` — Monitoramento (41 linhas)
- `docs/ONBOARDING.md` — Developer Onboarding - Match ATS (40 linhas)
- `docs/PERFORMANCE.md` — Performance Guide (73 linhas)
- `docs/PLANO_MELHORIAS_50_ETAPAS.md` — Plano de Melhorias — 50 Etapas (262 linhas)
- `docs/POST_MORTEM_TEMPLATE.md` — Template de Post-Mortem (Análise de Incidente) (37 linhas)
- `docs/PROJECT_TEMPLATE.md` — Template de Projeto Base - Match ATS (341 linhas)
- `docs/RELEASE-PROCESS.md` — Release Process - Match ATS (31 linhas)
- `docs/ROADMAP.md` — Roadmap — Match ATS / People Lovers (123 linhas)
- `docs/RUNBOOK.md` — Operational Runbook - Match ATS (30 linhas)
- `docs/SCALING.md` — Escalabilidade (44 linhas)
- `docs/SDK.md` — SDK - Match ATS (205 linhas)
- `docs/SECURITY-CHECKLIST.md` — Security Checklist - Match ATS (32 linhas)
- `docs/STATE_MANAGEMENT.md` — State Management - Match ATS (85 linhas)
- `docs/STYLEGUIDE.md` — Style Guide (49 linhas)
- `docs/SYSTEM_FEATURES.md` — Match ATS - Levantamento Completo de Funcionalidades e Ferramentas (903 linhas)
- `docs/TESTING.md` — Testing Guide (128 linhas)
- `docs/TROUBLESHOOTING.md` — Troubleshooting Guide (73 linhas)
- `docs/USER_GUIDE.md` — Guia do Usuário (48 linhas)
- `docs/VERSIONING.md` — Versionamento (38 linhas)
- `docs/WEBHOOKS.md` — Webhooks - Match ATS (139 linhas)
- `docs/audit_report.md` — Auditoria Técnica Enterprise 10/10 - People Lovers (Match ATS) (88 linhas)
- `docs/index.md` — Match ATS Documentation (73 linhas)
- subpastas de docs/: docs/ADR (8), docs/agentes (7), docs/contexto (2)
- CHANGELOG topo: 0.1.0 (2026-11-08)

## Últimos commits
- 2026-11-08 `838a4dc` feat(contexto): camada autônoma de inventário e contexto para agentes de ia
- 2026-11-08 `a9deb2d` docs(agentes): corrige contagem de edges (27→25) e remove migrate-helper
- 2026-11-08 `5c7c1db` security(functions): remove edge migrate-helper com chave exposta
- 2026-11-08 `8438c52` fix(ui): corrigir 35 erros de tsc herdados de bumps de dependências
- 2026-11-08 `616aa19` chore(release): v0.1.0 [skip ci]
- 2026-11-08 `7d41659` fix(deps): baixa typescript para 6.0.3 e eslint para 9.39.5 (#113)
- 2026-11-08 `1b43c16` chore(release): v0.1.0 [skip ci]
- 2026-11-08 `5ef8c64` ci(agentes): guard de integridade das instruções para agentes (#109)
- 2026-11-08 `e24e4a8` fix(build): adiciona react-is como dependência direta (#111)
- 2026-11-08 `0174eb5` fix(hooks): renomeia configs CommonJS para .cjs em projeto type:module (#110)
- 2026-11-08 `96ec68c` chore(release): v0.1.0 [skip ci]
- 2026-11-08 `790cbf9` chore(agentes): instruções enxutas no padrão do zapp web v2 (#108)
- 2026-11-02 `af0ded6` Merge pull request #106 from adm01-debug/dependabot/npm_and_yarn/react-5d968281fa
- 2026-11-02 `41e5ed3` chore(deps): bump the react group across 1 directory with 7 updates
- 2026-10-13 `1757fe4` Merge pull request #100 from adm01-debug/dependabot/npm_and_yarn/radix-ui/react-accordion-1.2.21

## Arquivos deste diretório
- `docs/contexto/codigo/rotas.json`
- `docs/contexto/codigo/modulos.json`
- `docs/contexto/codigo/componentes.json`
- `docs/contexto/codigo/hooks.json`
- `docs/contexto/codigo/edge-functions.json`
- `docs/contexto/codigo/banco.json`
- `docs/contexto/codigo/ferramentas.json`
- `docs/contexto/codigo/scripts.json`
- `docs/contexto/codigo/testes.json`
- `docs/contexto/codigo/logica.json`
- `docs/contexto/codigo/grafo.json`
- `docs/contexto/codigo/grafo-arestas.json`
- `docs/contexto/codigo/convencoes.json`
- `docs/contexto/codigo/grafo-graphify.json`
- `docs/contexto/codigo/baseline.json`
- `docs/contexto/codigo/manifest.json` (commit, data, hashes, erros — único arquivo com data/hora)
