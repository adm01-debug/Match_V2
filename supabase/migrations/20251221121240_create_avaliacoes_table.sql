-- Rollback: Use supabase db reset or restore from backup
-- This migration can be reverted by dropping added objects

-- Migration: Criar tabela avaliacoes
-- Esta tabela armazena avaliações de candidatos em processos seletivos

-- Criar tabela avaliacoes se não existir
CREATE TABLE IF NOT EXISTS public.avaliacoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    processo_seletivo_id UUID REFERENCES public.processos_seletivos(id) ON DELETE CASCADE,
    candidato_id UUID REFERENCES public.candidatos(id) ON DELETE CASCADE,
    avaliador_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    tipo VARCHAR(50) NOT NULL DEFAULT 'tecnica',
    competencias JSONB DEFAULT '[]'::jsonb,
    nota_geral DECIMAL(3,1) CHECK (nota_geral >= 0 AND nota_geral <= 10),
    parecer VARCHAR(50),
    observacoes TEXT,
    data_avaliacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_avaliacoes_processo ON public.avaliacoes(processo_seletivo_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_candidato ON public.avaliacoes(candidato_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_avaliador ON public.avaliacoes(avaliador_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_tipo ON public.avaliacoes(tipo);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_avaliacoes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_avaliacoes_updated_at ON public.avaliacoes;
CREATE TRIGGER trigger_avaliacoes_updated_at
    BEFORE UPDATE ON public.avaliacoes
    FOR EACH ROW
    EXECUTE FUNCTION update_avaliacoes_updated_at();

-- RLS
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "avaliacoes_select_policy" ON public.avaliacoes
    FOR SELECT TO authenticated
    USING (true);

CREATE POLICY "avaliacoes_insert_policy" ON public.avaliacoes
    FOR INSERT TO authenticated
    WITH CHECK (true);

CREATE POLICY "avaliacoes_update_policy" ON public.avaliacoes
    FOR UPDATE TO authenticated
    USING (true);

-- Comentário
COMMENT ON TABLE public.avaliacoes IS 'Avaliações de candidatos em processos seletivos';
