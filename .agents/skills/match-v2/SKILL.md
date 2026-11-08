---
name: match-v2
description: Convenções de código e commit do Match_V2 (TypeScript, Conventional Commits com tipos extras a11y/security/ux). Use ao alterar código, criar testes ou escrever mensagem de commit neste repositório; as regras operacionais ficam em AGENTS.md.
---

# Match_V2 — convenções

As regras de trabalho (banco, fluxo Git, PR, comunicação) estão em `AGENTS.md` na raiz — este skill só
resume convenções de código e commit.

## Commits

Padrão Conventional Commits, cobrado pelo hook `commit-msg` (commitlint, `commitlint.config.js`):
`<tipo>(<escopo>): <descrição>` — tipos: `feat fix docs style refactor perf test build ci chore revert
a11y security ux` (**não há `infra`**); assunto **todo minúsculo**, até 72 caracteres; linha de corpo até
100. Mensagem em PT-BR, modo imperativo. Não use `--no-verify`.

Exemplo: `fix(public-apply): valida knockout eliminatório antes de criar candidatura`

## Código

- Linguagem: TypeScript (front Vite + React em `src/`, edge functions Deno em `supabase/functions/`).
- Funções `camelCase`, componentes/classes `PascalCase`, constantes `SCREAMING_SNAKE_CASE`.
- Alias de import do front: `@/` → `src/`. Edge function **não importa de `src/`** — o que for compartilhado
  é duplicado em `supabase/functions/_shared/` e precisa ser alterado nos dois lados.
- `src/integrations/supabase/client.ts` e `types.ts` são gerados — não editar à mão.
- Testes: `*.test.ts(x)` ao lado do módulo (projeto `unit` do vitest), `*.integration.test.ts(x)`
  (projeto `integration`), Playwright em `e2e/`. Rode só o que tocou: `npx vitest run <caminho>`.
- `pre-commit` roda `lint-staged` (eslint --fix + prettier). Siga o padrão do módulo vizinho; não desvie
  sem registrar o motivo na PR.
