-- Rollback: Use supabase db reset or restore from backup
-- This migration can be reverted by dropping added objects

-- Tabela de candidatos
CREATE TABLE public.candidatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  resumo TEXT,
  habilidades TEXT[] DEFAULT '{}',
  experiencias JSONB DEFAULT '[]',
  formacao JSONB DEFAULT '[]',
  fonte TEXT DEFAULT 'parser_curriculo',
  status TEXT DEFAULT 'novo',
  arquivo_curriculo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de match scores
CREATE TABLE public.match_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id UUID REFERENCES public.candidatos(id) ON DELETE CASCADE NOT NULL,
  vaga_id TEXT NOT NULL,
  vaga_titulo TEXT NOT NULL,
  score_total INTEGER NOT NULL,
  score_habilidades INTEGER,
  score_experiencia INTEGER,
  score_formacao INTEGER,
  habilidades_match TEXT[] DEFAULT '{}',
  habilidades_faltantes TEXT[] DEFAULT '{}',
  habilidades_extras TEXT[] DEFAULT '{}',
  analise TEXT,
  recomendacao TEXT,
  pontos_fortes TEXT[] DEFAULT '{}',
  pontos_atencao TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_candidatos_email ON public.candidatos(email);
CREATE INDEX idx_candidatos_status ON public.candidatos(status);
CREATE INDEX idx_match_scores_candidato ON public.match_scores(candidato_id);
CREATE INDEX idx_match_scores_vaga ON public.match_scores(vaga_id);

-- Habilitar RLS
ALTER TABLE public.candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_scores ENABLE ROW LEVEL SECURITY;

-- Políticas públicas para MVP (sem autenticação por enquanto)
CREATE POLICY "Permitir leitura de candidatos" ON public.candidatos
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de candidatos" ON public.candidatos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de candidatos" ON public.candidatos
  FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão de candidatos" ON public.candidatos
  FOR DELETE USING (true);

CREATE POLICY "Permitir leitura de match_scores" ON public.match_scores
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de match_scores" ON public.match_scores
  FOR INSERT WITH CHECK (true);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_candidatos_updated_at
  BEFORE UPDATE ON public.candidatos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();