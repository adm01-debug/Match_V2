-- Tabela para armazenar resultados completos das avaliações comportamentais imersivas
CREATE TABLE public.avaliacoes_comportamentais_resultados (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidato_id UUID REFERENCES public.candidatos(id) ON DELETE CASCADE,
  processo_id UUID REFERENCES public.processos_seletivos(id) ON DELETE SET NULL,
  vaga_id UUID REFERENCES public.vagas(id) ON DELETE SET NULL,
  
  -- Scores por pilar (0-100)
  score_resiliencia NUMERIC(5,2) DEFAULT 0,
  score_integridade NUMERIC(5,2) DEFAULT 0,
  score_colaboracao NUMERIC(5,2) DEFAULT 0,
  score_lideranca NUMERIC(5,2) DEFAULT 0,
  score_adaptabilidade NUMERIC(5,2) DEFAULT 0,
  score_proatividade NUMERIC(5,2) DEFAULT 0,
  score_comunicacao NUMERIC(5,2) DEFAULT 0,
  score_pensamento_critico NUMERIC(5,2) DEFAULT 0,
  score_inteligencia_emocional NUMERIC(5,2) DEFAULT 0,
  score_orientacao_resultados NUMERIC(5,2) DEFAULT 0,
  score_geral NUMERIC(5,2) DEFAULT 0,
  
  -- Métricas de autenticidade
  tempo_medio_resposta INTEGER, -- em ms
  variacao_tempo NUMERIC(10,2),
  respostas_socialmente_desejaveis INTEGER DEFAULT 0,
  consistencia_interna NUMERIC(5,2),
  total_hesitacoes INTEGER DEFAULT 0,
  
  -- Análise preditiva de fit (se houver perfil da empresa)
  fit_geral NUMERIC(5,2),
  fit_por_pilar JSONB,
  riscos JSONB,
  potencializadores JSONB,
  recomendacao TEXT CHECK (recomendacao IN ('fortemente_recomendado', 'recomendado', 'neutro', 'cautela', 'nao_recomendado')),
  justificativa_fit TEXT,
  
  -- Respostas detalhadas dos cenários
  respostas JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Metadados
  cenarios_respondidos INTEGER DEFAULT 0,
  cenarios_pulados INTEGER DEFAULT 0,
  duracao_total INTEGER, -- em segundos
  ip_address TEXT,
  user_agent TEXT,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'em_andamento' CHECK (status IN ('em_andamento', 'completo', 'abandonado')),
  iniciado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  finalizado_em TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_avaliacoes_comp_candidato ON public.avaliacoes_comportamentais_resultados(candidato_id);
CREATE INDEX idx_avaliacoes_comp_processo ON public.avaliacoes_comportamentais_resultados(processo_id);
CREATE INDEX idx_avaliacoes_comp_vaga ON public.avaliacoes_comportamentais_resultados(vaga_id);
CREATE INDEX idx_avaliacoes_comp_status ON public.avaliacoes_comportamentais_resultados(status);
CREATE INDEX idx_avaliacoes_comp_created ON public.avaliacoes_comportamentais_resultados(created_at DESC);

-- Tabela para armazenar perfis comportamentais das empresas/vagas
CREATE TABLE public.perfis_comportamentais_empresa (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vaga_id UUID REFERENCES public.vagas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  descricao TEXT,
  
  -- Pesos dos pilares (1-10)
  peso_resiliencia INTEGER DEFAULT 5 CHECK (peso_resiliencia BETWEEN 1 AND 10),
  peso_integridade INTEGER DEFAULT 5 CHECK (peso_integridade BETWEEN 1 AND 10),
  peso_colaboracao INTEGER DEFAULT 5 CHECK (peso_colaboracao BETWEEN 1 AND 10),
  peso_lideranca INTEGER DEFAULT 5 CHECK (peso_lideranca BETWEEN 1 AND 10),
  peso_adaptabilidade INTEGER DEFAULT 5 CHECK (peso_adaptabilidade BETWEEN 1 AND 10),
  peso_proatividade INTEGER DEFAULT 5 CHECK (peso_proatividade BETWEEN 1 AND 10),
  peso_comunicacao INTEGER DEFAULT 5 CHECK (peso_comunicacao BETWEEN 1 AND 10),
  peso_pensamento_critico INTEGER DEFAULT 5 CHECK (peso_pensamento_critico BETWEEN 1 AND 10),
  peso_inteligencia_emocional INTEGER DEFAULT 5 CHECK (peso_inteligencia_emocional BETWEEN 1 AND 10),
  peso_orientacao_resultados INTEGER DEFAULT 5 CHECK (peso_orientacao_resultados BETWEEN 1 AND 10),
  
  -- Dealbreakers (pilares que não podem estar abaixo de um mínimo)
  dealbreakers JSONB DEFAULT '[]'::jsonb,
  
  -- Dimensões culturais
  dimensoes_culturais JSONB DEFAULT '{}'::jsonb,
  
  ativo BOOLEAN DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Índices
CREATE INDEX idx_perfis_comp_vaga ON public.perfis_comportamentais_empresa(vaga_id);
CREATE INDEX idx_perfis_comp_ativo ON public.perfis_comportamentais_empresa(ativo);

-- Enable RLS
ALTER TABLE public.avaliacoes_comportamentais_resultados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfis_comportamentais_empresa ENABLE ROW LEVEL SECURITY;

-- RLS Policies para avaliacoes_comportamentais_resultados
CREATE POLICY "Staff can view all behavioral assessments"
ON public.avaliacoes_comportamentais_resultados
FOR SELECT
USING (public.is_hr_staff(auth.uid()));

CREATE POLICY "Staff can insert behavioral assessments"
ON public.avaliacoes_comportamentais_resultados
FOR INSERT
WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "Staff can update behavioral assessments"
ON public.avaliacoes_comportamentais_resultados
FOR UPDATE
USING (public.is_hr_staff(auth.uid()));

CREATE POLICY "Staff can delete behavioral assessments"
ON public.avaliacoes_comportamentais_resultados
FOR DELETE
USING (public.is_hr_staff(auth.uid()));

-- RLS Policies para perfis_comportamentais_empresa
CREATE POLICY "Staff can view all company profiles"
ON public.perfis_comportamentais_empresa
FOR SELECT
USING (public.is_hr_staff(auth.uid()));

CREATE POLICY "Staff can insert company profiles"
ON public.perfis_comportamentais_empresa
FOR INSERT
WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE POLICY "Staff can update company profiles"
ON public.perfis_comportamentais_empresa
FOR UPDATE
USING (public.is_hr_staff(auth.uid()));

CREATE POLICY "Staff can delete company profiles"
ON public.perfis_comportamentais_empresa
FOR DELETE
USING (public.is_hr_staff(auth.uid()));

-- Trigger para atualizar updated_at
CREATE TRIGGER update_avaliacoes_comp_updated_at
BEFORE UPDATE ON public.avaliacoes_comportamentais_resultados
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_perfis_comp_updated_at
BEFORE UPDATE ON public.perfis_comportamentais_empresa
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();