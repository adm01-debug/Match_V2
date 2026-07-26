-- =============================================================
-- Etapa 9: Busca avançada de talentos executada no servidor
-- =============================================================
-- Motivação: a listagem carregava 100% da tabela `candidatos` no
-- cliente e filtrava em memória. Isso degrada linearmente com o
-- volume e impede paginação real. A função abaixo empurra os
-- predicados para o Postgres.
--
-- Segurança: SECURITY INVOKER (padrão). A função NÃO burla RLS —
-- as políticas de `candidatos` e `candidato_skills` continuam
-- valendo para o papel que chama. Por isso não há verificação de
-- papel embutida: a autorização permanece declarativa no RLS.

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Índices de suporte -------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_candidatos_nome_trgm
  ON public.candidatos USING gin (nome gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_candidatos_email_trgm
  ON public.candidatos USING gin (email gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_candidatos_resumo_trgm
  ON public.candidatos USING gin (resumo gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_candidatos_habilidades_gin
  ON public.candidatos USING gin (habilidades);

CREATE INDEX IF NOT EXISTS idx_candidatos_created_at_desc
  ON public.candidatos (created_at DESC);

-- Função de busca ----------------------------------------------------
CREATE OR REPLACE FUNCTION public.search_candidatos(
  p_termo                  text            DEFAULT NULL,
  p_status                 text[]          DEFAULT NULL,
  p_senioridade            text[]          DEFAULT NULL,
  p_nivel_ingles_min       text            DEFAULT NULL,
  p_regime                 text[]          DEFAULT NULL,
  p_modalidade             text[]          DEFAULT NULL,
  p_pretensao_max          numeric         DEFAULT NULL,
  p_pretensao_min          numeric         DEFAULT NULL,
  p_disponibilidade_max    integer         DEFAULT NULL,
  p_aberto_a_oportunidades boolean         DEFAULT NULL,
  p_skill_ids              uuid[]          DEFAULT NULL,
  p_skills_match_all       boolean         DEFAULT false,
  p_incluir_removidos      boolean         DEFAULT false,
  p_order_by               text            DEFAULT 'created_at',
  p_limit                  integer         DEFAULT 30,
  p_offset                 integer         DEFAULT 0
)
RETURNS TABLE (
  id                     uuid,
  nome                   text,
  email                  text,
  telefone               text,
  resumo                 text,
  habilidades            text[],
  experiencias           jsonb,
  formacao               jsonb,
  fonte                  text,
  status                 text,
  arquivo_curriculo      text,
  created_at             timestamptz,
  updated_at             timestamptz,
  senioridade            senioridade_nivel,
  nivel_ingles           nivel_idioma,
  pretensao_salarial     numeric,
  pretensao_moeda        text,
  regime                 regime_contratacao,
  modalidade             modalidade_trabalho,
  disponibilidade_dias   integer,
  aberto_a_oportunidades boolean,
  skills_match           integer,
  total_count            bigint
)
LANGUAGE plpgsql
STABLE
SET search_path TO 'public'
AS $function$
DECLARE
  -- Escala ordinal do enum de idioma: permite o filtro "inglês no
  -- mínimo X" sem depender da ordem física do tipo.
  v_ingles_min integer;
  v_termo      text;
  v_skill_qtd  integer := COALESCE(array_length(p_skill_ids, 1), 0);
  v_limit      integer := GREATEST(1, LEAST(COALESCE(p_limit, 30), 200));
  v_offset     integer := GREATEST(0, COALESCE(p_offset, 0));
  v_order      text    := lower(COALESCE(p_order_by, 'created_at'));
BEGIN
  -- Normaliza o termo: string vazia ou só espaços equivale a "sem filtro".
  v_termo := NULLIF(btrim(COALESCE(p_termo, '')), '');

  v_ingles_min := CASE lower(COALESCE(p_nivel_ingles_min, ''))
    WHEN 'nenhum'        THEN 0
    WHEN 'basico'        THEN 1
    WHEN 'intermediario' THEN 2
    WHEN 'avancado'      THEN 3
    WHEN 'fluente'       THEN 4
    WHEN 'nativo'        THEN 5
    ELSE NULL
  END;

  -- Rejeita ordenações desconhecidas em vez de cair silenciosamente
  -- num default: evita que um typo no cliente mude o resultado sem aviso.
  IF v_order NOT IN ('created_at', 'nome', 'pretensao_asc', 'pretensao_desc', 'skills_match') THEN
    RAISE EXCEPTION 'ordenacao_invalida: %', p_order_by USING ERRCODE = '22023';
  END IF;

  RETURN QUERY
  WITH base AS (
    SELECT
      c.*,
      CASE WHEN v_skill_qtd = 0 THEN 0 ELSE (
        SELECT count(*)::integer
        FROM public.candidato_skills cs
        WHERE cs.candidato_id = c.id
          AND cs.skill_id = ANY (p_skill_ids)
      ) END AS skills_match
    FROM public.candidatos c
    WHERE (p_incluir_removidos OR c.deleted_at IS NULL)
      AND (p_status IS NULL OR c.status = ANY (p_status))
      AND (p_senioridade IS NULL OR c.senioridade::text = ANY (p_senioridade))
      AND (p_regime IS NULL OR c.regime::text = ANY (p_regime))
      AND (p_modalidade IS NULL OR c.modalidade::text = ANY (p_modalidade))
      AND (
        v_ingles_min IS NULL
        OR CASE c.nivel_ingles
             WHEN 'nenhum'        THEN 0
             WHEN 'basico'        THEN 1
             WHEN 'intermediario' THEN 2
             WHEN 'avancado'      THEN 3
             WHEN 'fluente'       THEN 4
             WHEN 'nativo'        THEN 5
           END >= v_ingles_min
      )
      -- Pretensão nula = "não informada": não deve ser descartada por
      -- um teto, senão o filtro esconde candidatos sem culpa.
      AND (p_pretensao_max IS NULL OR c.pretensao_salarial IS NULL OR c.pretensao_salarial <= p_pretensao_max)
      AND (p_pretensao_min IS NULL OR c.pretensao_salarial IS NULL OR c.pretensao_salarial >= p_pretensao_min)
      AND (p_disponibilidade_max IS NULL OR c.disponibilidade_dias IS NULL OR c.disponibilidade_dias <= p_disponibilidade_max)
      AND (p_aberto_a_oportunidades IS NULL OR c.aberto_a_oportunidades = p_aberto_a_oportunidades)
      AND (
        v_termo IS NULL
        OR c.nome ILIKE '%' || v_termo || '%'
        OR c.email ILIKE '%' || v_termo || '%'
        OR c.resumo ILIKE '%' || v_termo || '%'
        OR EXISTS (
          SELECT 1 FROM unnest(COALESCE(c.habilidades, ARRAY[]::text[])) h
          WHERE h ILIKE '%' || v_termo || '%'
        )
      )
  ),
  filtrado AS (
    SELECT b.* FROM base b
    WHERE v_skill_qtd = 0
       OR (p_skills_match_all AND b.skills_match = v_skill_qtd)
       OR (NOT p_skills_match_all AND b.skills_match > 0)
  ),
  contado AS (
    SELECT count(*)::bigint AS total FROM filtrado
  )
  SELECT
    f.id, f.nome, f.email, f.telefone, f.resumo, f.habilidades,
    f.experiencias, f.formacao, f.fonte, f.status, f.arquivo_curriculo,
    f.created_at, f.updated_at, f.senioridade, f.nivel_ingles,
    f.pretensao_salarial, f.pretensao_moeda, f.regime, f.modalidade,
    f.disponibilidade_dias, f.aberto_a_oportunidades,
    f.skills_match,
    ct.total
  FROM filtrado f CROSS JOIN contado ct
  ORDER BY
    CASE WHEN v_order = 'skills_match'   THEN f.skills_match END DESC NULLS LAST,
    CASE WHEN v_order = 'nome'           THEN f.nome END ASC,
    CASE WHEN v_order = 'pretensao_asc'  THEN f.pretensao_salarial END ASC NULLS LAST,
    CASE WHEN v_order = 'pretensao_desc' THEN f.pretensao_salarial END DESC NULLS LAST,
    f.created_at DESC
  LIMIT v_limit OFFSET v_offset;
END;
$function$;

REVOKE ALL ON FUNCTION public.search_candidatos(
  text, text[], text[], text, text[], text[], numeric, numeric,
  integer, boolean, uuid[], boolean, boolean, text, integer, integer
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.search_candidatos(
  text, text[], text[], text, text[], text[], numeric, numeric,
  integer, boolean, uuid[], boolean, boolean, text, integer, integer
) TO authenticated, service_role;