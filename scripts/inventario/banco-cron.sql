-- Bloco do pg_cron do inventario (so leitura), rodado so quando `cron_disponivel` do banco.sql e true.
-- Separado porque relacao inexistente derruba a consulta na analise: se o projeto nao tem a extensao
-- pg_cron, nenhuma consulta que cite `cron.job` executa, nem dentro de CASE.
--
-- De cron.job sai so o nome das funcoes chamadas (nome seguido de "("), nunca o `command` inteiro,
-- que pode trazer URL e cabecalho com token.

WITH
execucoes AS (
  SELECT d.jobid, d.status, d.return_message, d.start_time, d.end_time
    FROM cron.job_run_details d
   WHERE d.start_time > now() - interval '7 days'
),
por_job AS (
  SELECT e.jobid,
         count(*) FILTER (WHERE e.start_time > now() - interval '24 hours')::int AS exec_24h,
         count(*) FILTER (WHERE e.start_time > now() - interval '24 hours' AND e.status = 'failed')::int AS falhas_24h,
         count(*)::int AS exec_7d,
         count(*) FILTER (WHERE e.status = 'failed')::int AS falhas_7d,
         count(*) FILTER (WHERE e.status = 'failed' AND e.return_message LIKE 'job startup timeout%')::int AS startup_timeout_7d,
         max(e.start_time) FILTER (WHERE e.status = 'failed') AS ultima_falha,
         round(max(extract(epoch FROM e.end_time - e.start_time)) FILTER (WHERE e.status = 'succeeded'))::int AS duracao_max_s_7d
    FROM execucoes e GROUP BY e.jobid
),
por_hora AS (
  SELECT date_trunc('hour', e.start_time) AS hora, count(*)::int AS execucoes,
         count(*) FILTER (WHERE e.status = 'failed')::int AS falhas
    FROM execucoes e GROUP BY 1
)
SELECT jsonb_build_object(
  'disponivel', true,
  'config', (SELECT jsonb_object_agg(name, setting ORDER BY name) FROM pg_settings
              WHERE name IN ('cron.use_background_workers', 'cron.max_running_jobs', 'max_worker_processes')),
  'jobs', (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
             'nome', j.jobname,
             'agenda', j.schedule,
             'ativo', j.active,
             'chama', (SELECT coalesce(jsonb_agg(DISTINCT m[1] ORDER BY m[1]), '[]'::jsonb)
                         FROM regexp_matches(j.command, '((?:public|net|cron|extensions)\.[a-z_0-9]+)\s*\(', 'g') AS m),
             'execucoes_24h', coalesce(pj.exec_24h, 0),
             'falhas_24h', coalesce(pj.falhas_24h, 0),
             'execucoes_7d', coalesce(pj.exec_7d, 0),
             'falhas_7d', coalesce(pj.falhas_7d, 0),
             'startup_timeout_7d', coalesce(pj.startup_timeout_7d, 0),
             'taxa_falha_7d_pct', CASE WHEN coalesce(pj.exec_7d, 0) = 0 THEN 0
                                       ELSE round(100.0 * pj.falhas_7d / pj.exec_7d, 1) END,
             'ultima_falha', to_char(pj.ultima_falha AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
             'duracao_max_s_7d', pj.duracao_max_s_7d
           ) ORDER BY j.jobname), '[]'::jsonb)
      FROM cron.job j LEFT JOIN por_job pj ON pj.jobid = j.jobid
  ),
  -- Hora com mais da metade das execucoes falhando: o cron ficou parado naquela hora.
  'horas_paradas_7d', (
    SELECT coalesce(jsonb_agg(jsonb_build_object(
             'hora', to_char(h.hora AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24":00Z"'),
             'execucoes', h.execucoes, 'falhas', h.falhas) ORDER BY h.hora), '[]'::jsonb)
      FROM por_hora h WHERE h.falhas * 2 > h.execucoes
  ),
  'historico', jsonb_build_object(
    'linhas', (SELECT count(*) FROM cron.job_run_details),
    'mais_de_7_dias', (SELECT count(*) FROM cron.job_run_details WHERE start_time <= now() - interval '7 days'),
    'mais_antigo', (SELECT to_char(min(start_time) AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') FROM cron.job_run_details),
    'bytes', pg_total_relation_size('cron.job_run_details')
  )
) AS cron;
