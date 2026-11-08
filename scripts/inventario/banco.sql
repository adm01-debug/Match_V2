-- Inventario do banco oficial (so leitura) para inventario/estado/banco.json.
--
-- Uso (credencial viva):   node scripts/inventario/gerar-banco.mjs
-- Uso (agente com MCP):     rodar este arquivo no MCP oficial (supabase-match-v2), salvar a
--                           resposta e node scripts/inventario/gerar-banco.mjs --entrada <arquivo.json>
--
-- Imprime UMA linha com UM JSON. So SELECT em catalogo; nada de texto livre que possa carregar
-- segredo. Ordem de toda lista e explicita para o diff ser estavel. O bloco do pg_cron fica em
-- banco-cron.sql: o schema `cron` pode nao existir neste projeto, e relacao inexistente derruba a
-- consulta inteira na analise (CASE nao protege). `cron_disponivel` aqui diz se vale rodar o outro.

WITH
-- Linhas: count(*) exato quando a estimativa do planner (reltuples, persiste entre
-- reinicios) fica abaixo de 200 mil; acima disso, a estimativa. NAO usar
-- pg_stat_user_tables.n_live_tup: zera quando o servidor reinicia.
base AS (
  SELECT c.oid, c.relname AS nome, c.relrowsecurity AS rls, c.relforcerowsecurity AS rls_forcado,
         c.reltuples, pg_total_relation_size(c.oid)::bigint AS bytes
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
   WHERE n.nspname = 'public' AND c.relkind IN ('r', 'p')
),
tabelas AS (
  SELECT b.oid, b.nome, b.rls, b.rls_forcado, b.bytes,
         b.reltuples < 200000 AS linhas_exatas,
         CASE WHEN b.reltuples < 200000
              THEN (xpath('/row/n/text()',
                          query_to_xml(format('SELECT count(*) AS n FROM public.%I', b.nome), false, true, '')))[1]::text::bigint
              ELSE b.reltuples::bigint END AS linhas
    FROM base b
),
corpos AS (  -- tudo no banco que pode citar uma tabela: funcoes e views do public
  SELECT p.prosrc AS txt FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
   WHERE n.nspname = 'public' AND p.prokind IN ('f', 'p')
  UNION ALL
  SELECT pg_get_viewdef(c.oid) FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
   WHERE n.nspname = 'public' AND c.relkind IN ('v', 'm')
),
policies AS (
  SELECT tablename AS nome, count(*)::int AS n FROM pg_policies WHERE schemaname = 'public' GROUP BY 1
),
gatilhos AS (
  SELECT t.tgrelid AS oid, count(*)::int AS n FROM pg_trigger t WHERE NOT t.tgisinternal GROUP BY 1
)
SELECT jsonb_build_object(
  'format_version', 1,
  'medido_em', to_char(now() AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
  -- O gerador so roda banco-cron.sql quando isto e true.
  'cron_disponivel', to_regclass('cron.job') IS NOT NULL,

  'resumo', jsonb_build_object(
    'postgres', current_setting('server_version'),
    'tabelas_public', (SELECT count(*) FROM tabelas),
    'tabelas_sem_rls', (SELECT count(*) FROM tabelas WHERE NOT rls),
    'policies', (SELECT count(*) FROM pg_policies WHERE schemaname = 'public'),
    'funcoes_public', (SELECT count(*) FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
                        WHERE n.nspname = 'public' AND p.prokind IN ('f', 'p')),
    'funcoes_security_definer', (SELECT count(*) FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
                                  WHERE n.nspname = 'public' AND p.prokind IN ('f', 'p') AND p.prosecdef),
    'views_public', (SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
                      WHERE n.nspname = 'public' AND c.relkind IN ('v', 'm')),
    'triggers_public', (SELECT coalesce(sum(g.n), 0) FROM gatilhos g JOIN tabelas t ON t.oid = g.oid),
    'extensoes', (SELECT coalesce(jsonb_object_agg(e.extname, e.extversion), '{}'::jsonb) FROM pg_extension e),
    'ledger_registros', (SELECT count(*) FROM supabase_migrations.schema_migrations),
    'ledger_versao_max', (SELECT max(version) FROM supabase_migrations.schema_migrations),
    'max_connections', current_setting('max_connections')::int,
    'tamanho_bytes', pg_database_size(current_database())
  ),

  'tabelas', (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
             'nome', t.nome,
             'rls', t.rls,
             'rls_forcado', t.rls_forcado,
             'policies', coalesce(p.n, 0),
             'triggers', coalesce(g.n, 0),
             'linhas', t.linhas,
             'linhas_exatas', t.linhas_exatas,
             'bytes', t.bytes,
             'citada_no_banco', EXISTS (SELECT 1 FROM corpos c WHERE c.txt ~ ('\m' || t.nome || '\M'))
           ) ORDER BY t.nome), '[]'::jsonb)
      FROM tabelas t
      LEFT JOIN policies p ON p.nome = t.nome
      LEFT JOIN gatilhos g ON g.oid = t.oid
  )
) AS inventario;
