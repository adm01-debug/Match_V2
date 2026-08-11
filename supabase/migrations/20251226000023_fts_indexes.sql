-- Full-Text Search Indexes
-- Enable unaccent extension for Portuguese search
CREATE EXTENSION IF NOT EXISTS unaccent;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create text search configuration for Portuguese
DO $$ BEGIN
  CREATE TEXT SEARCH CONFIGURATION portuguese_unaccent (COPY = portuguese);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TEXT SEARCH CONFIGURATION portuguese_unaccent
  ALTER MAPPING FOR hword, hword_part, word WITH unaccent, portuguese_stem;

-- Add search vector columns
ALTER TABLE public.candidatos ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE public.vagas ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create indexes for full-text search
CREATE INDEX IF NOT EXISTS idx_candidatos_search ON public.candidatos USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_vagas_search ON public.vagas USING GIN(search_vector);

-- Create trigram indexes for fuzzy search
CREATE INDEX IF NOT EXISTS idx_candidatos_nome_trgm ON public.candidatos USING GIN(nome gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_candidatos_email_trgm ON public.candidatos USING GIN(email gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_vagas_titulo_trgm ON public.vagas USING GIN(titulo gin_trgm_ops);

-- Function to update search vector for candidatos
CREATE OR REPLACE FUNCTION update_candidatos_search_vector() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('portuguese_unaccent', coalesce(NEW.nome, '')), 'A') ||
    setweight(to_tsvector('portuguese_unaccent', coalesce(NEW.email, '')), 'B') ||
    setweight(to_tsvector('portuguese_unaccent', coalesce(NEW.cargo_atual, '')), 'B') ||
    setweight(to_tsvector('portuguese_unaccent', coalesce(array_to_string(NEW.skills, ' '), '')), 'C') ||
    setweight(to_tsvector('portuguese_unaccent', coalesce(NEW.resumo, '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update search vector for vagas
CREATE OR REPLACE FUNCTION update_vagas_search_vector() RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('portuguese_unaccent', coalesce(NEW.titulo, '')), 'A') ||
    setweight(to_tsvector('portuguese_unaccent', coalesce(NEW.empresa, '')), 'B') ||
    setweight(to_tsvector('portuguese_unaccent', coalesce(NEW.descricao, '')), 'C') ||
    setweight(to_tsvector('portuguese_unaccent', coalesce(array_to_string(NEW.requisitos, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS trg_candidatos_search_vector ON public.candidatos;
CREATE TRIGGER trg_candidatos_search_vector
  BEFORE INSERT OR UPDATE ON public.candidatos
  FOR EACH ROW EXECUTE FUNCTION update_candidatos_search_vector();

DROP TRIGGER IF EXISTS trg_vagas_search_vector ON public.vagas;
CREATE TRIGGER trg_vagas_search_vector
  BEFORE INSERT OR UPDATE ON public.vagas
  FOR EACH ROW EXECUTE FUNCTION update_vagas_search_vector();

-- Helper function for searching
CREATE OR REPLACE FUNCTION search_candidatos(search_query TEXT, limit_count INTEGER DEFAULT 20)
RETURNS TABLE(id UUID, nome TEXT, email TEXT, cargo_atual TEXT, rank REAL) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.nome, c.email, c.cargo_atual,
         ts_rank(c.search_vector, websearch_to_tsquery('portuguese_unaccent', search_query)) AS rank
  FROM public.candidatos c
  WHERE c.search_vector @@ websearch_to_tsquery('portuguese_unaccent', search_query)
     OR c.nome ILIKE '%' || search_query || '%'
     OR c.email ILIKE '%' || search_query || '%'
  ORDER BY rank DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;
