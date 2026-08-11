-- Migration: Add Full-Text Search Indexes
-- Creates FTS indexes for better search performance

-- Enable pg_trgm for fuzzy matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create search vectors for candidatos
ALTER TABLE public.candidatos ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Update function for candidatos search vector
CREATE OR REPLACE FUNCTION update_candidatos_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('portuguese', COALESCE(NEW.nome, '')), 'A') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.email, '')), 'B') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.telefone, '')), 'C') ||
        setweight(to_tsvector('portuguese', COALESCE(array_to_string(NEW.skills, ' '), '')), 'A') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.resumo, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for candidatos
DROP TRIGGER IF EXISTS trig_candidatos_search_vector ON public.candidatos;
CREATE TRIGGER trig_candidatos_search_vector
    BEFORE INSERT OR UPDATE ON public.candidatos
    FOR EACH ROW
    EXECUTE FUNCTION update_candidatos_search_vector();

-- GIN index for fast FTS
CREATE INDEX IF NOT EXISTS idx_candidatos_search ON public.candidatos USING GIN(search_vector);

-- Trigram indexes for fuzzy search
CREATE INDEX IF NOT EXISTS idx_candidatos_nome_trgm ON public.candidatos USING GIN(nome gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_candidatos_email_trgm ON public.candidatos USING GIN(email gin_trgm_ops);

-- Create search vectors for vagas
ALTER TABLE public.vagas ADD COLUMN IF NOT EXISTS search_vector tsvector;

CREATE OR REPLACE FUNCTION update_vagas_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('portuguese', COALESCE(NEW.titulo, '')), 'A') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.descricao, '')), 'B') ||
        setweight(to_tsvector('portuguese', COALESCE(array_to_string(NEW.requisitos, ' '), '')), 'A') ||
        setweight(to_tsvector('portuguese', COALESCE(NEW.departamento, '')), 'C');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trig_vagas_search_vector ON public.vagas;
CREATE TRIGGER trig_vagas_search_vector
    BEFORE INSERT OR UPDATE ON public.vagas
    FOR EACH ROW
    EXECUTE FUNCTION update_vagas_search_vector();

CREATE INDEX IF NOT EXISTS idx_vagas_search ON public.vagas USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_vagas_titulo_trgm ON public.vagas USING GIN(titulo gin_trgm_ops);

-- Search function for candidatos
CREATE OR REPLACE FUNCTION search_candidatos(search_query TEXT, limit_count INT DEFAULT 20)
RETURNS TABLE (
    id UUID,
    nome TEXT,
    email TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.nome,
        c.email,
        ts_rank(c.search_vector, plainto_tsquery('portuguese', search_query)) AS rank
    FROM public.candidatos c
    WHERE c.search_vector @@ plainto_tsquery('portuguese', search_query)
       OR c.nome ILIKE '%' || search_query || '%'
       OR c.email ILIKE '%' || search_query || '%'
    ORDER BY rank DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Search function for vagas
CREATE OR REPLACE FUNCTION search_vagas(search_query TEXT, limit_count INT DEFAULT 20)
RETURNS TABLE (
    id UUID,
    titulo TEXT,
    departamento TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id,
        v.titulo,
        v.departamento,
        ts_rank(v.search_vector, plainto_tsquery('portuguese', search_query)) AS rank
    FROM public.vagas v
    WHERE v.search_vector @@ plainto_tsquery('portuguese', search_query)
       OR v.titulo ILIKE '%' || search_query || '%'
    ORDER BY rank DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Update existing records
UPDATE public.candidatos SET search_vector = search_vector;
UPDATE public.vagas SET search_vector = search_vector;
