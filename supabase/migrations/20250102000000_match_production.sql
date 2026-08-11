-- Migration: Match ATS - Tabelas de Produção

-- Tabela de Vagas
CREATE TABLE IF NOT EXISTS public.vagas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  departamento TEXT,
  descricao TEXT,
  requisitos TEXT[],
  salario_min NUMERIC(10,2),
  salario_max NUMERIC(10,2),
  tipo TEXT DEFAULT 'clt' CHECK (tipo IN ('clt', 'pj', 'estagio', 'temporario')),
  modalidade TEXT DEFAULT 'presencial' CHECK (modalidade IN ('presencial', 'hibrido', 'remoto')),
  status TEXT DEFAULT 'aberta' CHECK (status IN ('aberta', 'pausada', 'fechada')),
  responsavel_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Candidatos
CREATE TABLE IF NOT EXISTS public.candidatos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  cargo_pretendido TEXT,
  experiencia_anos INTEGER DEFAULT 0,
  skills TEXT[],
  formacao TEXT,
  status TEXT DEFAULT 'novo' CHECK (status IN ('novo', 'triagem', 'entrevista', 'teste', 'proposta', 'contratado', 'rejeitado')),
  vaga_id UUID REFERENCES public.vagas(id) ON DELETE SET NULL,
  curriculum_url TEXT,
  linkedin_url TEXT,
  avaliacao NUMERIC(2,1),
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Entrevistas
CREATE TABLE IF NOT EXISTS public.entrevistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  vaga_id UUID REFERENCES public.vagas(id) ON DELETE SET NULL,
  data DATE NOT NULL,
  hora TIME NOT NULL,
  tipo TEXT DEFAULT 'video' CHECK (tipo IN ('presencial', 'video', 'telefone')),
  local TEXT,
  link_video TEXT,
  entrevistadores TEXT[],
  status TEXT DEFAULT 'agendada' CHECK (status IN ('agendada', 'realizada', 'cancelada', 'reagendada')),
  feedback TEXT,
  avaliacao NUMERIC(2,1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Templates de Email
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  assunto TEXT NOT NULL,
  corpo TEXT NOT NULL,
  tipo TEXT CHECK (tipo IN ('convite', 'feedback', 'proposta', 'rejeicao', 'boas_vindas')),
  variaveis TEXT[],
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Workflows
CREATE TABLE IF NOT EXISTS public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  descricao TEXT,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tabela de Etapas de Workflow
CREATE TABLE IF NOT EXISTS public.workflow_etapas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ordem INTEGER NOT NULL,
  tipo TEXT DEFAULT 'manual' CHECK (tipo IN ('automatico', 'manual')),
  acao TEXT,
  dias_prazo INTEGER
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_candidatos_vaga ON public.candidatos(vaga_id);
CREATE INDEX IF NOT EXISTS idx_candidatos_status ON public.candidatos(status);
CREATE INDEX IF NOT EXISTS idx_entrevistas_data ON public.entrevistas(data);
CREATE INDEX IF NOT EXISTS idx_vagas_status ON public.vagas(status);

-- RLS
ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entrevistas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_etapas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON public.vagas FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.candidatos FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.entrevistas FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.email_templates FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.workflows FOR ALL USING (true);
CREATE POLICY "Allow all" ON public.workflow_etapas FOR ALL USING (true);
