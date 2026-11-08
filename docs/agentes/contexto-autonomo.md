# Contexto autônomo — o repositório se descreve sozinho

Leia antes de sair varrendo o repo: o estado real já está escrito em arquivo, gerado por script. Ler o
arquivo custa tokens de uma consulta; redescobrir o repo custa uma sessão.

## As três fontes e quem é dono de cada fato

| Preciso de…                                                                                                             | Fonte (dona do fato)  | Onde ler                                                            | Quem gera                                                              |
| ----------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Onde fica o código: rotas, módulos, componentes, hooks, edges, grafo de dependências, testes, convenções                | **código**            | `docs/contexto/codigo/INDEX.md` na branch `contexto`                | `scripts/ai-context/gerar.mjs` (`contexto.yml`)                        |
| O que pode / não pode: RLS por operação, estados e transições, validações, fórmulas, prazos, mensagens de erro, lacunas | **regras de negócio** | `docs/contexto/regras/07-REGRAS-DE-NEGOCIO.md` na branch `contexto` | `scripts/regras_negocio/generate.py` (`contexto.yml`)                  |
| O que existe HOJE no banco e no deploy: tabelas, RLS, policies, linhas, órfãs, cron, edges publicadas, alertas          | **banco real**        | `inventario/estado/banco.json` na `main`                            | `scripts/inventario/gerar-banco.mjs` (`inventario-estado-semanal.yml`) |
| Rotas × telas × hooks × tabelas × edges, com problemas                                                                  | **repo**              | `inventario/estado/rotas.json` e `edges.json` na `main`             | `scripts/inventario/gerar-rotas.mjs` e `gerar-repo.mjs`                |

Índice único das duas primeiras: `docs/contexto/00-INDEX.md` (branch `contexto`), montado por
`scripts/regras_negocio/indice.py`. Se duas fontes discordarem, vale a dona do fato.

## Como ler (sem clonar nada)

```bash
git fetch origin contexto && git show origin/contexto:docs/contexto/00-INDEX.md
```

Pela API/MCP: `get_file(ref=contexto, path=docs/contexto/00-INDEX.md)`. `inventario/estado/*.json` está
na `main`, direto no checkout.

## Quando cada coisa roda

| Workflow                        | Gatilho                                                                                                                        | Entrega                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `contexto.yml`                  | push em `main` que toque `src/`, `supabase/`, os scripts das automações ou `docs/contexto/regras/manual/`; 09:41 UTC; dispatch | commit na branch gerada `contexto` (nunca PR, nunca `main`)         |
| `inventario-estado-semanal.yml` | segunda 10:23 UTC; dispatch                                                                                                    | PR `automation/inventario-estado` só com `inventario/estado/*.json` |

O `contexto.yml` tem um job `gate` que compara o HEAD da `main` com o `commit` do `manifest.json` de cada
fonte publicada: no agendamento, fonte que já está no commit atual não roda de novo. Push com
`GITHUB_TOKEN` não dispara workflows, então a branch `contexto` não realimenta o CI; todos os workflows
deste repo são filtrados por `main`.

O PR semanal só abre quando o inventário mudou **de verdade** (`scripts/inventario/mudou-conteudo.mjs`):
datas e telemetria viva do cron não contam. Ver `inventario/estado/README.md`.

## Rodar à mão

```bash
npm run contexto:ia          # docs/contexto/codigo/ (gerar.mjs)
```

```bash
npm run contexto:regras      # docs/contexto/regras/ (generate.py)
```

```bash
npm run inventario:rotas     # inventario/estado/rotas.json
```

```bash
npm run inventario:edges     # inventario/estado/edges.json (precisa de ripgrep)
```

```bash
SUPABASE_ACCESS_TOKEN=... npm run inventario:banco   # inventario/estado/banco.json
```

Testes dos geradores (sem dependência instalada): `npm run contexto:test`.

## Limites conhecidos — não confunda com bug

- **Banco ao vivo só pela Management API.** `db.syinhicmyrsdeaeyayjs.supabase.co` resolve só IPv6 e o
  pooler não serve este tenant (`.github/workflows/install-mcp-exec.yml`): `psql`/`pg_dump` no CI não
  funcionam. Por isso o inventário do banco usa `POST /database/query/read-only`, e o snapshot completo
  do schema (`scripts/supabase_snapshot/` no Zapp_Web_V2, que exige `SUPABASE_DB_URL`) **não** foi
  portado.
- **`SUPABASE_ACCESS_TOKEN` ainda não existe** nos secrets deste repo: enquanto não existir, o passo do
  banco no workflow semanal sai verde com aviso e `banco.json` não é gerado; rotas e edges continuam.
- **Tudo é estático.** Referência encontrada não prova execução; ausência de chamador não prova que uma
  edge não tenha consumidor externo. `.from(variavel)` não é resolvido.
- **Nada de segredo sai.** Do `cron.job` só o nome das funções chamadas; o gerador se recusa a gravar
  saída com cara de credencial (`Bearer`, JWT, `sb_secret_`).
- Os scripts portados do `Zapp_Web_V2` (`scripts/ai-context/`, `scripts/regras_negocio/`) são mantidos
  byte-idênticos ao upstream e estão em `.prettierignore`; mudança de comportamento deve ir para lá
  primeiro. Os de `scripts/inventario/` foram adaptados a este repo (rotas do react-router, cron
  opcional, origem conferida por `types.ts`).
