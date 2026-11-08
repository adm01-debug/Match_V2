# AGENTS.md — Match_V2

Regras do dono para qualquer agente de IA; vencem os `docs/` (histórico). Detalhe em `docs/agentes/<tema>.md`;
divergiu da realidade → corrija no mesmo PR do fix. Responda sempre em PT-BR.

## Postura
- O dono não é dev: decide negócio; o agente executa a engenharia inteira via MCP. Nunca passo manual do
  dono nem pedir que ele revise diff.
- Qualidade + velocidade, mínimo de tokens. Decida como dev sênior; pergunte só com custo, arquitetura,
  dado destrutivo em produção, trade-off de negócio ou item "chame o dono". Para ler, não peça permissão.
- Verdade acima de validação: não sabe → diga; falhou → diga. Afirmação sobre código cita evidência
  (arquivo:linha, diff, saída de comando); sem evidência = "NÃO VERIFICADO" + motivo; nunca "testado" sem
  ter rodado. Branch/commit/PR não provam nada — leia o código.
- Diff mínimo, zero churn: causa raiz, não reescrita; não refatore, renomeie ou comente o que não foi pedido;
  não reescreva arquivo inteiro para mudar 3 linhas. Dependência nova ou bump major só se indispensável (avise na PR).
- `APROVADO` = execute o plano como descrito, sem reconfirmar.
- Uma tarefa por vez, cada uma com sua branch/PR. Outro bug → "Próximos passos". Travou → reporte o erro
  exato e pare; não contorne regra. Releia o pedido antes de concluir.
- Tokens: leia só o trecho necessário; `src/routes/lazyPages.ts`, `src/services/` e `supabase/functions/`
  antes de buscar por texto; exploração ampla → subagente; nenhuma tool "por garantia"; não gere código que
  não será aplicado.
- Segredos nunca em código, commit ou resposta — só em env/secret do serviço (edge: `supabase secrets set`
  ou painel). PAT exposto em chat → rotacionar na hora. Nunca imprima nem commite `.env`, tokens,
  `service_role` ou a URL com token do MCP em `.mcp.json`.

## Bugs e funcionalidades
- Diagnóstico antes de patch: logs e estado real, ponto exato (arquivo:linha), causa; várias causas → liste
  todas, corrija a pedida.
- Antes da PR: `npm run lint`, `npm run type-check` e `npx vitest run <caminho>` do que tocou. Só erro seu
  conta; **a CI deste repo está vermelha de forma herdada** (ver `docs/agentes/github-ci.md`) → erro herdado
  vai para "Próximos passos", e CI verde nunca foi prova de nada aqui.
- "Pronto" = PR mergeada + deploy confirmado + comportamento verificado (log, query ou request real); faltou
  um → diga onde parou.
- Funcionalidade pronta = integrada ponta a ponta (rota em `src/routes/`, entrada na UI, hook/service/edge
  chamados, tabela com RLS, estados erro/loading/vazio, submit), sem mock, hardcode ou TODO. Pela metade não
  é pronto; não cabe na sessão → entregue o funcional e liste o que falta, em ordem, com arquivos. Nunca
  deixe código morto ou feature "quase" sem dizer.

## Comunicação
- Resultado primeiro, só o que muda decisão do dono. Sem introdução, recapitulação, narração, hedging,
  disclaimer, lição de moral ou cortesia. Efeito no negócio; técnica só se perguntarem. Resposta e plano
  proporcionais ao tamanho do fix; não despeje log — cite a linha que importa. Caminhos, comandos e links
  completos. Destrutivo de verdade: uma linha ("isso apaga X, sem volta — confirma?").
- Toda execução fecha com exatamente 3 "Próximos passos" (`N. [título] — [por quê] · [arquivo]`), por
  impacto, do que você viu, executáveis via MCP, para não-dev; nada de genérico ("adicionar testes",
  "melhorar documentação", "revisar segurança"). É um menu: `1`, `1 e 3`, `APROVADO 2`, "todos" ou o bloco
  devolvido = executar na ordem, sem reconfirmar. Só consulta, já rejeitadas ou nada pendente →
  `Próximos passos: nada pendente neste escopo.`

## Fluxo Git — detalhe em `docs/agentes/github-ci.md`
- Repo `adm01-debug/Match_V2`, `main`, **privado**. Escrita no GitHub: MCP **`GITHUB - MCP - FOREVER`**
  (`github_push_files`: `files` + `delete` num commit); `git push`/`gh` só em repo autorizado na sessão.
- Nunca commite em `main`. Só escreva em branch que **você** criou nesta sessão; branch alheia ou já
  existente é somente leitura. Antes do push, confira que o último commit é seu.
- PR aberta nos mesmos arquivos → pare e avise o dono (liste via `github_graphql`; o repo vive com ~10 PRs
  de dependabot abertas, então filtre por arquivo, não por contagem).
- Branch de `main` atualizado: `claude/<fix|feat|chore|ci>-<slug>-<AAMMDD-HHMM>`.
- Commit PT-BR, 1 atômico, `<tipo>(<escopo>): <assunto>`; tipos do `commitlint.config.js`: `feat fix docs
  style refactor perf test build ci chore revert a11y security ux` — **não há `infra:`** (use `ci:`/`chore:`);
  assunto todo minúsculo e ≤ 72 caracteres, linha de corpo ≤ 100.
- **Não há branch protection** neste repo e `delete_branch_on_merge` está desligado: o merge não é barrado
  por check nenhum e a branch sobra — apague à mão depois do squash.
- Mergeie sem aprovação (squash) PR sua pronta de escopo comum (front, edge, docs, config), comparando os
  checks dela com os de uma PR de dependabot para separar vermelho herdado do seu. **Deixe aberta e chame o
  dono**: DDL/migration em produção; CI/workflows, segredos, `Dockerfile*`, `k8s/`, `terraform/`, `nginx.conf`;
  deleção de dado, arquitetura ou custo; conflito com PR de outro agente.
- Conflito: rebase em `main`; `--force-with-lease` só na sua branch.
- Merge em `main` = deploy do front em produção (`deploy.yml`): confira o run e reporte.
- Fim: link da PR + estado.

## Banco — ler `docs/agentes/banco.md` antes de SQL, migration ou deploy
- Projeto Supabase **`syinhicmyrsdeaeyayjs`** (`supabase/config.toml:1`), hospedado na organização
  **Lovable** — não na conta do cliente. SQL pelo MCP **`supabase-match-v2`** (declarado em `.mcp.json`) ou
  pelo SQL Editor do Lovable Studio.
- `db.syinhicmyrsdeaeyayjs.supabase.co` resolve **só IPv6** e o pooler Cloud não serve esse tenant: conexão
  direta por CI/`psql` não funciona (evidência: `.github/workflows/install-mcp-exec.yml`). Não gaste sessão
  tentando.
- 97 arquivos em `supabase/migrations/`; `npm run db:migrate` = `supabase db push`. Ordem obrigatória:
  arquivo → PR → merge → deploy do código → apply. Nunca DDL a partir de branch aberta.
- Diagnóstico em produção = **só leitura**. DDL destrutivo, segredos e rotação: só com o dono.
- 27 edge functions em `supabase/functions/` e **nenhum workflow as implanta** — deploy é manual
  (CLI/MCP/Studio). Não anuncie "edge no ar" sem confirmar.

## Serviços — ler `docs/agentes/servicos.md` e `docs/agentes/vercel-deploy.md`
- **Vercel**: projeto `match-v2`; front sobe pelo `deploy.yml` (push em `main`, `amondnet/vercel-action`) e
  preview por PR (`preview.yml`). Nunca segredo de servidor no Vercel; `VITE_*` entra no bundle e é público.
- **Sentry**: `sentry-dsn-gate.yml` reprova qualquer PR/push em `main` sem o secret `VITE_SENTRY_DSN`.
- **IA (Gemini)**: `parse-resume`, `match-score`, `ai-screening` usam `withCache` + `CACHE_VERSION`. Mudou
  prompt, modelo ou formato de saída → **suba a `CACHE_VERSION` da função**, senão volta resposta velha do cache.
- **WhatsApp/Evolution, e-mail (Resend), job boards, Google/Outlook/Slack/Teams**: edges + `src/services/`.
- `Dockerfile*`, `k8s/`, `terraform/`, `grafana/`, `prometheus.yml`, `nginx.conf`: infra declarada no repo,
  **não validada** em produção nesta sessão — não afirme que está rodando.

## Stack e comandos — detalhe em `docs/agentes/mapa-repo.md`
- Vite + React + TS (`src/`), Supabase (`supabase/functions/` em Deno, `supabase/migrations/`), Playwright
  (`e2e/`), Storybook, **npm** (`npm ci` — é o que a CI usa; `bun.lock` e `bun.lockb` na raiz são legado,
  nenhum workflow usa bun), Node **22.23.2** (`.nvmrc`; CI em `22`).
- `npm run lint` · `npm run type-check` · `npm run test:run` (ou `npx vitest run <caminho>` só do que tocou)
  · `npm run test:e2e` · `npm run build` · `npm run storybook`. Workspace vitest: projeto `unit`
  (`*.test.ts(x)`) e `integration` (`*.integration.test.ts(x)`).
- Hooks husky: `pre-commit` → `lint-staged` (eslint --fix + prettier); `commit-msg` → `commitlint`.
  **Não use `--no-verify`**.

## Onde olhar primeiro
- `AGENTS.md` + `docs/agentes/*.md` = regras vivas. Os ~48 arquivos soltos em `docs/` (auditorias, planos,
  levantamentos) são **histórico**: contexto, não fonte de verdade — e podem contradizer este arquivo.
- Telas e papéis: `src/routes/` (`AppRoutes`, `MainRoutes`, `AdminRoutes`, `AuthRoutes`, `PortalRoutes`,
  `lazyPages.ts`). Integrações: `src/services/`. Back: `supabase/functions/`.
- Regras de negócio que o código não deixa óbvio: `docs/agentes/regras-dominio.md`.
