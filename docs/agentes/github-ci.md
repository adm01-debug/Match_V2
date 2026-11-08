# GitHub (perímetro, CI, workflows) — referência para agentes

Ler quando mexer em settings do repo, `.github/workflows/`, ou quando um merge ou um check falhar de
forma estranha.

## Escrita no GitHub

- Repo `adm01-debug/Match_V2`, **privado**, branch `main`, sem descrição.
- **Escrita: somente MCP `GITHUB - MCP - FOREVER`** (`github_push_files`, que aceita `files` e `delete` no
  mesmo commit atômico). O MCP padrão do GitHub devolve 403 em write. `github_push_files` sobrescreve o
  arquivo — mande o conteúdo integral com apenas a mudança semântica e confira depois que o remoto bate.
- Para listar PRs abertas com os arquivos que tocam numa chamada só, use `github_graphql`
  (`pullRequests(states:OPEN){ nodes { number headRefName files(first:20){ nodes { path } } } }`):
  `github_list_pull_requests` devolve o repositório inteiro em cada nó e estoura o contexto.
- O repo vive com ~10 PRs de dependabot abertas. Checar "tem PR aberta?" por contagem não diz nada —
  filtre por caminho de arquivo.

## Perímetro — estado verificado em 2026-11-08

| Campo | Estado |
|---|---|
| Branch protection em `main` | **nenhuma regra** (`branchProtectionRules` vazio na API GraphQL) — nada bloqueia merge, force-push ou commit direto; a disciplina é só a deste documento |
| Required checks | nenhum (consequência do acima) |
| Review obrigatório | nenhum (há `CODEOWNERS` com `* @adm01-debug`, mas sem regra que o exija) |
| Merge | `allow_squash_merge=true` · `allow_merge_commit=true` · `allow_rebase_merge=true` · `allow_auto_merge=false` · `delete_branch_on_merge=false` |
| Dependabot | npm + github-actions, semanal (npm: segunda 09:00 America/Sao_Paulo), limite de 10 PRs, grupos `react`, `tanstack`, `supabase`, `testing`, `linting` |
| Auto-merge de dependabot | `dependabot-auto-merge.yml` (depende de auto-merge do repo, que está **desligado**) |

Convenção de commit: `commitlint.config.js` com `@commitlint/config-conventional` + tipos
`feat fix docs style refactor perf test build ci chore revert a11y security ux`, `subject-case: lower-case`,
`subject-max-length: 72`, `body-max-line-length: 100`. **Não existe `infra:`.** Hook `commit-msg` roda
commitlint; hook `pre-commit` roda `lint-staged`.

## A CI está vermelha de forma herdada — leia antes de interpretar qualquer check

Em 2026-11-08, os mesmos checks falham em PRs que **não tocam código**:

| Evidência | O que a PR muda | Checks vermelhos |
|---|---|---|
| PR #107 (`claude/chore-agents-texto-mestre-261102-1040`) | 2 arquivos `.md` | `Lint`, `Type Check`, `Unit Tests`, `ESLint & Prettier`, `e2e`, `lighthouse`, `preview`, `sentry-dsn-gate`, `dependency-review`, `check`, `assign`, `welcome`, `bundle-size`, `analyze`, `size-label`, `chromatic`, `Vercel` |
| PR #85 (dependabot) | 1 arquivo de workflow | praticamente os mesmos |

Passam nas duas: `a11y`, `security`, `Security Audit` e (na #85) `bundle-size`/`chromatic`.

Consequências práticas:
1. **Check vermelho aqui não prova que a sua mudança quebrou algo** — compare sempre com os checks de uma
   PR de dependabot do mesmo período antes de "corrigir CI".
2. **Check verde também não prova nada**: `Build` fica `SKIPPED` quando `lint`/`type-check`/`test` falham
   (ele tem `needs: [lint, type-check, test]` em `ci.yml`), e `Integration Tests` fica `SKIPPED` em
   `test.yml`. Não existe job de *gate* (`if: always()`) que some os jobs críticos.
3. A causa raiz de cada job vermelho **não foi diagnosticada** nesta sessão (os `log_tail` acessíveis pelo
   MCP vinham só com a limpeza de credenciais do runner). Antes de qualquer patch de CI, leia o passo que
   falhou com `github_get_run_failure_summary` no run específico.
4. `sentry-dsn-gate.yml` falha quando o secret `VITE_SENTRY_DSN` não chega ao job — em PR de dependabot os
   secrets não são expostos, então ali o vermelho é estrutural.

## Workflows — 34 arquivos em `.github/workflows/`

| Arquivo | Gatilhos | Jobs |
|---|---|---|
| `ci.yml` ("CI/CD Pipeline") | push (main, develop), PR (main) | `lint`, `type-check`, `test`, `security`, `build` (needs lint+type-check+test) |
| `lint.yml` ("ESLint & Prettier") | push, PR | `lint` — **duplica** o job `lint` do `ci.yml` |
| `test.yml` | push, PR | `unit-tests`, `integration-tests` — **duplica** o `test` do `ci.yml` |
| `e2e.yml` | push, PR | `e2e` (Playwright) |
| `a11y.yml` · `lighthouse.yml` · `performance.yml` | push/PR (performance também `schedule` dom 00:00 UTC) | acessibilidade e performance |
| `bundle-size.yml` · `pr-size.yml` · `size-label.yml` | PR | tamanho de bundle e rótulo de tamanho — `pr-size` e `size-label` registram **dois checks com o mesmo nome** `size-label` |
| `chromatic.yml` · `visual-regression.yml` · `storybook-deploy.yml` | push/PR | Storybook e regressão visual — `chromatic` aparece **duas vezes** nos checks |
| `codeql.yml` · `security-scan.yml` · `dependency-review.yml` | push/PR + `schedule` (codeql seg 06:00 UTC, security-scan seg 00:00 UTC) | segurança |
| `deploy.yml` · `preview.yml` | push main / PR | deploy do front e preview (ver `docs/agentes/vercel-deploy.md`) |
| `docker-build.yml` | push | build da imagem |
| `sentry-dsn-gate.yml` | push main, PR main | exige o secret `VITE_SENTRY_DSN` |
| `release.yml` · `release-please.yml` · `changelog.yml` | push | **três** trilhas de release/changelog coexistindo |
| `auto-assign.yml` · `welcome.yml` · `pr-check.yml` · `label-sync.yml` · `lock-threads.yml` · `stale.yml` · `compress-images.yml` · `dependabot-auto-merge.yml` · `load-test.yml` · `generate-audit-pdf.yml` | PR/issues/`schedule` (lock-threads diário 00:00, stale diário 01:30, load-test seg 02:00 UTC) | automações de repositório |
| `install-mcp-exec.yml` | `workflow_dispatch` | **desativado** (`noop`): ficou como registro do diagnóstico de IPv6 do banco — ver `docs/agentes/banco.md` |

Mexer em workflow, secret, `Dockerfile*`, `k8s/`, `terraform/` ou `nginx.conf` = **PR aberta e chamar o
dono**, nunca merge direto.
