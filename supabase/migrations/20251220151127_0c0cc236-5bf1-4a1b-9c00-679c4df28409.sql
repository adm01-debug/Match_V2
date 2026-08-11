-- Rollback: Use supabase db reset or restore from backup
-- This migration can be reverted by dropping added objects

-- Tabela de Provas
CREATE TABLE public.provas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT NOT NULL CHECK (categoria IN ('cognitivo', 'comportamental', 'tecnico', 'idiomas', 'situacional', 'competencias')),
  departamentos TEXT[] NOT NULL DEFAULT '{"geral"}',
  niveis_aplicaveis TEXT[] NOT NULL DEFAULT '{}',
  duracao INTEGER NOT NULL DEFAULT 30, -- em minutos
  total_questoes INTEGER NOT NULL DEFAULT 0,
  pontuacao_maxima INTEGER NOT NULL DEFAULT 100,
  nota_minima INTEGER NOT NULL DEFAULT 60,
  ativo BOOLEAN NOT NULL DEFAULT true,
  aplicacoes INTEGER NOT NULL DEFAULT 0,
  media_notas NUMERIC(5,2) DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Questões
CREATE TABLE public.questoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prova_id UUID NOT NULL REFERENCES public.provas(id) ON DELETE CASCADE,
  enunciado TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('multipla_escolha', 'dissertativa', 'verdadeiro_falso', 'pratica')),
  alternativas JSONB DEFAULT '[]',
  resposta_correta TEXT,
  pontuacao INTEGER NOT NULL DEFAULT 1,
  dificuldade TEXT NOT NULL DEFAULT 'medio' CHECK (dificuldade IN ('facil', 'medio', 'dificil')),
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Baterias de Provas
CREATE TABLE public.baterias_provas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  departamento TEXT NOT NULL DEFAULT 'geral',
  nivel TEXT NOT NULL DEFAULT 'junior',
  duracao_total INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de relacionamento Bateria-Provas
CREATE TABLE public.bateria_provas_rel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bateria_id UUID NOT NULL REFERENCES public.baterias_provas(id) ON DELETE CASCADE,
  prova_id UUID NOT NULL REFERENCES public.provas(id) ON DELETE CASCADE,
  obrigatoria BOOLEAN NOT NULL DEFAULT true,
  ordem INTEGER NOT NULL DEFAULT 0,
  UNIQUE(bateria_id, prova_id)
);

-- Tabela de Resultados de Provas
CREATE TABLE public.resultados_provas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prova_id UUID NOT NULL REFERENCES public.provas(id) ON DELETE CASCADE,
  candidato_id UUID REFERENCES public.candidatos(id) ON DELETE SET NULL,
  candidato_nome TEXT NOT NULL,
  processo_id UUID REFERENCES public.processos_seletivos(id) ON DELETE SET NULL,
  nota NUMERIC(5,2) NOT NULL DEFAULT 0,
  percentual NUMERIC(5,2) NOT NULL DEFAULT 0,
  tempo_gasto INTEGER NOT NULL DEFAULT 0, -- em minutos
  respostas JSONB DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'em_andamento' CHECK (status IN ('em_andamento', 'finalizado', 'aprovado', 'reprovado', 'em_analise')),
  iniciado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  finalizado_em TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.provas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.baterias_provas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bateria_provas_rel ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resultados_provas ENABLE ROW LEVEL SECURITY;

-- Policies para provas (RH pode tudo)
CREATE POLICY "Usuários autenticados podem ver provas" ON public.provas
  FOR SELECT USING (true);

CREATE POLICY "Usuários autenticados podem criar provas" ON public.provas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar provas" ON public.provas
  FOR UPDATE USING (true);

CREATE POLICY "Usuários autenticados podem deletar provas" ON public.provas
  FOR DELETE USING (true);

-- Policies para questões
CREATE POLICY "Usuários autenticados podem ver questões" ON public.questoes
  FOR SELECT USING (true);

CREATE POLICY "Usuários autenticados podem criar questões" ON public.questoes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar questões" ON public.questoes
  FOR UPDATE USING (true);

CREATE POLICY "Usuários autenticados podem deletar questões" ON public.questoes
  FOR DELETE USING (true);

-- Policies para baterias
CREATE POLICY "Usuários autenticados podem ver baterias" ON public.baterias_provas
  FOR SELECT USING (true);

CREATE POLICY "Usuários autenticados podem criar baterias" ON public.baterias_provas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar baterias" ON public.baterias_provas
  FOR UPDATE USING (true);

CREATE POLICY "Usuários autenticados podem deletar baterias" ON public.baterias_provas
  FOR DELETE USING (true);

-- Policies para relação bateria-provas
CREATE POLICY "Usuários autenticados podem ver relações" ON public.bateria_provas_rel
  FOR SELECT USING (true);

CREATE POLICY "Usuários autenticados podem criar relações" ON public.bateria_provas_rel
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem deletar relações" ON public.bateria_provas_rel
  FOR DELETE USING (true);

-- Policies para resultados
CREATE POLICY "Usuários autenticados podem ver resultados" ON public.resultados_provas
  FOR SELECT USING (true);

CREATE POLICY "Usuários autenticados podem criar resultados" ON public.resultados_provas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar resultados" ON public.resultados_provas
  FOR UPDATE USING (true);

-- Triggers para updated_at
CREATE TRIGGER update_provas_updated_at
  BEFORE UPDATE ON public.provas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_baterias_updated_at
  BEFORE UPDATE ON public.baterias_provas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para performance
CREATE INDEX idx_provas_categoria ON public.provas(categoria);
CREATE INDEX idx_provas_ativo ON public.provas(ativo);
CREATE INDEX idx_questoes_prova_id ON public.questoes(prova_id);
CREATE INDEX idx_resultados_prova_id ON public.resultados_provas(prova_id);
CREATE INDEX idx_resultados_candidato_id ON public.resultados_provas(candidato_id);
CREATE INDEX idx_bateria_rel_bateria ON public.bateria_provas_rel(bateria_id);
CREATE INDEX idx_bateria_rel_prova ON public.bateria_provas_rel(prova_id);