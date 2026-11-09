# Estado real do projeto — inventário gerado

Pasta de **dados gerados por script**, não de relatórios escritos à mão. É a fonte de consulta dos
agentes para "o que existe hoje" no banco e no código. Se um número aqui divergir do que você mediu,
regere o arquivo (comandos abaixo) em vez de corrigir à mão.

| Arquivo | Como gerar | O que tem |
|---|---|---|
| `banco.json` | `SUPABASE_ACCESS_TOKEN=... node scripts/inventario/gerar-banco.mjs` (Management API: `/database/query/read-only` + `/functions`, só leitura) **ou**, sem token, rodar `scripts/inventario/banco.sql` (e `banco-cron.sql`, se houver pg_cron) no MCP oficial `supabase-match-v2`, salvar a resposta e `node scripts/inventario/gerar-banco.mjs --entrada <arquivo> [--cron <arquivo>]` | banco oficial, só leitura: cada tabela (RLS, policies, triggers, linhas, tamanho, se é citada em função/view e quantos `.from()` e `/rest/v1/<tabela>` tem em `src/` e `supabase/functions/`), tabelas órfãs, extensões, contagem de funções `SECURITY DEFINER`, cada cron job (agenda, funções chamadas, falhas e taxa em 24 h/7 d, duração máxima), horas em que o cron ficou parado, tamanho do histórico do cron, edge functions publicadas × pastas do repo (só com token; sem token fica `publicadas: null`) e a lista `alertas` |
| `rotas.json` | `node scripts/inventario/gerar-rotas.mjs` (`--check` só confere se está em dia) | as URLs de `src/routes/*.tsx` (AppRoutes + MainRoutes/AdminRoutes/AuthRoutes/PortalRoutes): path, página, arquivo, guardas (`ProtectedRoute`, `Admin2FAGuard`, `PortalProtectedRoute`), papéis e `<Navigate>`; e por rota os hooks, tabelas, RPCs, buckets e edge functions alcançados pelos imports da página, mais a lista `problemas` (rota sem arquivo, página em `lazyPages` sem rota, rota duplicada, import quebrado) |
| `edges.json` | `node scripts/inventario/gerar-repo.mjs` | as edge functions: linhas, segredos lidos (`Deno.env.get`) e quem invoca cada uma (src, migrations, outras edges, e2e, CI) |
| `tabelas-uso.json` (não versionado) | `node scripts/inventario/gerar-repo.mjs < lista-de-tabelas.txt` | quantos `.from('tabela')` cada tabela tem — hoje também sai em `banco.json` → `tabelas[].uso_no_codigo` |

## Como ler `banco.json`

- **`alertas`** é o que um agente precisa saber antes de mexer: `tabela_sem_rls`, `rls_sem_policy`
  (RLS ligado e nenhuma policy: nega tudo para `authenticated`/`anon`), `cron_falhando`
  (taxa ≥ 5 % em 7 dias), `cron_parado` (hora com mais da metade das execuções falhando),
  `cron_sem_execucao` (job ativo que roda todo dia sem nenhuma execução em 24 h — o cron 100 % parado
  não grava falha, então só aparece aqui), `historico_cron_sem_limpeza` (> 50 mil linhas com mais de
  7 dias), `edge_sem_deploy` e `edge_publicada_sem_codigo`.
  Os limiares estão em `LIMIARES` no script.
- **`cron.disponivel: false`** significa que o projeto não tem a extensão `pg_cron`; nenhum alerta de
  cron é calculado. O bloco do cron sai de `banco-cron.sql`, rodado só nesse caso — referência a
  relação inexistente derruba a consulta inteira na análise, nem dentro de `CASE`.
- **`tabelas_orfas`**: 0 linhas + não citada em função/view do banco + nenhum `.from()` nem `/rest/v1/`
  no código (`.from(variavel)` não é resolvido). Candidata a limpeza, não prova de que pode apagar
  (pode ser usada por RPC com outro nome ou por sistema externo).
- **`linhas`** é `count(*)` exato quando a tabela tem menos de 200 mil linhas (`linhas_exatas: true`);
  acima disso, a estimativa do planner. Não confie em `pg_stat_user_tables.n_live_tup`: zera quando o
  banco reinicia.
- Contagens rodam com o papel da conexão. Pelo endpoint read-only da Management API o papel
  (`supabase_read_only_user`) ignora RLS; com outro papel, tabelas com RLS podem vir incompletas.
- A resposta só é gravada se as tabelas baterem (≥ 90 %, nos dois sentidos) com `public.Tables` de
  `src/integrations/supabase/types.ts` **e** o ledger bater com `supabase/migrations/`: maior versão
  aplicada entre as 20 migrations mais recentes do repo (ou à frente) e quantidade de registros a até
  10 % da de arquivos. Barra resposta colada de outro banco (ex.: MCP errado ou outro projeto da
  mesma organização Lovable).
- O PR semanal (`inventario-estado-semanal.yml`) só abre quando algo estrutural mudou de verdade:
  tabela nova/apagada, alerta novo, RLS/policy, contagem real de linhas de tabela, rota, edge etc.
  `medido_em`/`gerado_em` sozinhos não abrem PR, e a telemetria viva do cron também não
  (`execucoes_24h`, `taxa_falha_7d_pct`, `horas_paradas_7d`, `cron.historico.linhas/bytes`): esses
  números rolam toda semana só pela janela de 7 dias, sem mudança real, e abrir PR por isso é ruído.
  Como só esses campos mudarem nunca abre PR sozinho, o commitado pode ficar atrasado neles por tempo
  indefinido; confie neles só depois de regenerar.
- Nada de segredo sai do banco: de `cron.job` só o nome das funções chamadas (nunca o comando, que
  pode ter URL/cabeçalho). O teste `scripts/ci/inventario-banco.unit.mjs` barra escrita e o `command`
  no SQL, e o script se recusa a gravar saída com cara de credencial (Bearer, JWT, `sb_secret_`).
- Projeto travado no script: `syinhicmyrsdeaeyayjs`, o mesmo de `supabase/config.toml`. Apontar para
  outro exige `INVENTARIO_PERMITIR_OUTRO_PROJETO=1`.

**Origem:** mesmo desenho do `Zapp_Web_V2` (`inventario/estado/`), adaptado a este repo: sem bloco de
WhatsApp, cron opcional, conferência de origem por `types.ts` (este repo não tem `schema-manifest.json`)
e rotas lidas do react-router em vez de um `ViewRouter`.
