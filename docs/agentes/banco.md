# Banco de dados — referência para agentes

Ler quando for rodar SQL, criar/aplicar migration ou mexer em edge function.
Resumo no `AGENTS.md`; aqui está o detalhe.

## Banco OFICIAL

| O que | Valor |
|---|---|
| Projeto Supabase | **`syinhicmyrsdeaeyayjs`** (`supabase/config.toml:1`) |
| Organização | **Lovable** — o projeto não está na conta Supabase do cliente (evidência: comentário em `.github/workflows/install-mcp-exec.yml`) |
| SQL | MCP **`supabase-match-v2`** (declarado em `.mcp.json`, HTTP) ou SQL Editor do Lovable Studio (`lovable.dev` → projeto Match_V2 → Supabase → SQL Editor) |
| Ledger de migrations | `supabase_migrations.schema_migrations` (padrão do CLI; não há script de registro neste repo) |
| Tipos no front | `src/integrations/supabase/types.ts` — gerado; `src/integrations/supabase/client.ts` traz o aviso "automatically generated. Do not edit" |

**`db.syinhicmyrsdeaeyayjs.supabase.co` resolve apenas para IPv6 (`2600:1f14:b9e::`) e o pooler do Supabase
Cloud não serve esse tenant.** Conexão direta por runner de CI, `psql` local ou qualquer coisa que precise
de IPv4 **não funciona** — e isso já consumiu uma sessão inteira de diagnóstico (o `install-mcp-exec.yml`
ficou no repo só como registro: o job é um `noop`). Não tente de novo: use MCP ou SQL Editor.

A URL do MCP em `.mcp.json` carrega o token no próprio caminho. **Nunca** cole essa URL em resposta, PR,
issue ou log.

## Onde se trabalha

| Situação | Onde | Como |
|---|---|---|
| Diagnóstico | produção, **só leitura** | `SELECT` pelo MCP; nunca escrita para "testar" |
| Migration nova | arquivo em `supabase/migrations/` | PR → merge → deploy do código → apply |
| Reset/seed | **nunca** em produção | `npm run db:reset` e `npm run db:seed` são para Postgres local do CLI; `db:reset` apaga tudo |
| DDL destrutivo, segredos, rotação de chave | **só com o dono** | — |

## Regras de migration

1. **Ordem obrigatória: arquivo → PR → merge em `main` → deploy do código → apply.** Nunca aplicar DDL a
   partir de branch aberta. `DROP`, `REVOKE`, rename ou mudança de contrato de função usada pelo front/edges
   só **depois** do deploy do código correspondente.
2. `npm run db:migrate` = `supabase db push` — ele aplica tudo o que está em `supabase/migrations/` e ainda
   não está no ledger. Antes de rodar: `ls supabase/migrations | tail`, conferir o maior `version` no ledger
   e procurar PR aberta tocando `supabase/migrations/`.
3. Nomes seguem dois padrões (herança do Lovable): `AAAAMMDD_<slug>.sql` (os mais antigos, ex.
   `20241225_ip_whitelist.sql`) e `AAAAMMDDHHMMSS_<uuid>.sql` (os gerados pelo Studio). São 97 arquivos hoje.
   Mantenha o prefixo cronológico; nunca renomeie um arquivo já aplicado para "resolver" colisão — o ledger
   ao vivo é a verdade.
4. **Não existe guard de drift neste repo**: nenhum workflow compara migrations com o ledger, regenera
   catálogo/manifesto ou checa frescor de `types.ts` (único workflow que menciona Supabase é o `deploy.yml`,
   e só para `VITE_SUPABASE_*`). Então DDL aplicado fora do fluxo acima não é detectado por ninguém — só
   aparece quando quebra em produção.
5. RLS é o padrão do projeto: 57 arquivos de migration ligam `ENABLE ROW LEVEL SECURITY` e há 436
   `CREATE POLICY` no diretório. Tabela nova sem RLS + policy = entrega pela metade.
6. Mudou tabela/coluna usada pelo front → regere `src/integrations/supabase/types.ts` no mesmo PR; não edite
   o arquivo à mão.

## Edge functions

- 25 funções em `supabase/functions/` (`_shared/` é pasta de helpers sem deploy próprio: `aiCache.ts`, `knockout.ts`, `metrics.ts`, `rateLimit.ts`, `resilience.ts`, `retryQueue.ts`).
- **Nenhum workflow implanta edge function.** `supabase functions deploy` é manual (CLI, MCP ou Studio);
  merge em `main` sobe **só o front**. Nunca diga "edge no ar" sem confirmar a versão publicada.
- Públicas por configuração (`verify_jwt = false` em `supabase/config.toml`): `health`, `resend-webhook`,
  `proactive-alerts`, `public-apply`, `sign-proposal`. Mexer em qualquer uma delas é mexer
  em superfície sem autenticação — rate limit e validação de payload são obrigatórios (ver
  `_shared/rateLimit.ts` e `docs/agentes/regras-dominio.md`).
- Segredos das edges (`SUPABASE_SERVICE_ROLE_KEY`, chaves de IA, Evolution, Resend) vivem no painel/secrets
  do Supabase — nunca em `VITE_*`, nunca no repo.
