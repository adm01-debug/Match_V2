-- Rollback: Use supabase db reset or restore from backup
-- This migration can be reverted by dropping added objects

-- ============================================================
-- EVOLUÇÃO DO MODELO DE DADOS - MATCH ATS
-- Tabelas: vagas, processos_seletivos, entrevistas, avaliacoes, provas, resultados_provas
-- Padrão: Lovable / Supabase
-- ============================================================

-- ============================================================
-- 1. TABELA VAGAS
-- ============================================================
CREATE TABLE public.vagas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Dados básicos
  titulo TEXT NOT NULL,
  departamento TEXT NOT NULL,
  codigo TEXT UNIQUE, -- Código interno da vaga (ex: TI-2024-001)
  
  -- Responsáveis
  gestor_id UUID REFERENCES auth.users(id),
  recrutador_id UUID REFERENCES auth.users(id),
  
  -- Detalhes da posição
  quantidade INTEGER NOT NULL DEFAULT 1,
  tipo_contrato TEXT NOT NULL DEFAULT 'clt', -- clt, pj, estagio, temporario
  modalidade TEXT NOT NULL DEFAULT 'presencial', -- presencial, hibrido, remoto
  nivel TEXT DEFAULT 'pleno', -- estagiario, junior, pleno, senior, especialista, coordenador, gerente, diretor
  
  -- Localização
  cidade TEXT,
  estado TEXT,
  pais TEXT DEFAULT 'Brasil',
  
  -- Remuneração
  salario_min NUMERIC(12,2),
  salario_max NUMERIC(12,2),
  salario_a_combinar BOOLEAN DEFAULT false,
  beneficios TEXT[] DEFAULT '{}',
  
  -- Descrição
  descricao_empresa TEXT,
  responsabilidades TEXT,
  requisitos_obrigatorios TEXT,
  requisitos_desejaveis TEXT,
  
  -- Habilidades para avaliação
  habilidades_obrigatorias TEXT[] DEFAULT '{}',
  habilidades_desejaveis TEXT[] DEFAULT '{}',
  skills_avaliacao TEXT[] DEFAULT '{}',
  
  -- Triagem
  perguntas_triagem JSONB DEFAULT '[]', -- Array de PerguntaTriagem
  
  -- Status e prioridade
  status TEXT NOT NULL DEFAULT 'rascunho', -- rascunho, aguardando_aprovacao, aprovada, publicada, em_selecao, pausada, encerrada, cancelada
  prioridade TEXT NOT NULL DEFAULT 'media', -- urgente, alta, media, baixa
  
  -- Datas
  data_publicacao TIMESTAMP WITH TIME ZONE,
  data_encerramento TIMESTAMP WITH TIME ZONE,
  prazo_preenchimento DATE,
  
  -- Métricas (calculadas/cacheadas)
  total_candidatos INTEGER DEFAULT 0,
  em_processo INTEGER DEFAULT 0,
  contratados INTEGER DEFAULT 0,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para vagas
CREATE INDEX idx_vagas_status ON public.vagas(status);
CREATE INDEX idx_vagas_departamento ON public.vagas(departamento);
CREATE INDEX idx_vagas_prioridade ON public.vagas(prioridade);
CREATE INDEX idx_vagas_gestor ON public.vagas(gestor_id);
CREATE INDEX idx_vagas_recrutador ON public.vagas(recrutador_id);
CREATE INDEX idx_vagas_created_at ON public.vagas(created_at DESC);

-- RLS para vagas
ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de vagas" ON public.vagas
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de vagas" ON public.vagas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de vagas" ON public.vagas
  FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão de vagas" ON public.vagas
  FOR DELETE USING (true);

-- Trigger updated_at para vagas
CREATE TRIGGER update_vagas_updated_at
  BEFORE UPDATE ON public.vagas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 2. ATUALIZAR TABELA CANDIDATOS (adicionar campos faltantes)
-- ============================================================
ALTER TABLE public.candidatos
  ADD COLUMN IF NOT EXISTS linkedin TEXT,
  ADD COLUMN IF NOT EXISTS cidade TEXT,
  ADD COLUMN IF NOT EXISTS estado TEXT,
  ADD COLUMN IF NOT EXISTS foto_url TEXT,
  ADD COLUMN IF NOT EXISTS cargo_atual TEXT,
  ADD COLUMN IF NOT EXISTS empresa_atual TEXT,
  ADD COLUMN IF NOT EXISTS experiencia_anos INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pretensao_salarial NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS disponibilidade TEXT DEFAULT 'negociar', -- imediata, 15_dias, 30_dias, 60_dias, negociar
  ADD COLUMN IF NOT EXISTS escolaridade TEXT,
  ADD COLUMN IF NOT EXISTS indicado_por TEXT,
  ADD COLUMN IF NOT EXISTS origem TEXT DEFAULT 'portal'; -- portal, linkedin, indeed, catho, infojobs, indicacao, espontaneo, outros

-- Índices adicionais para candidatos
CREATE INDEX IF NOT EXISTS idx_candidatos_origem ON public.candidatos(origem);
CREATE INDEX IF NOT EXISTS idx_candidatos_disponibilidade ON public.candidatos(disponibilidade);

-- ============================================================
-- 3. TABELA PROCESSOS SELETIVOS
-- ============================================================
CREATE TABLE public.processos_seletivos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relacionamentos
  vaga_id UUID NOT NULL REFERENCES public.vagas(id) ON DELETE CASCADE,
  candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  
  -- Etapa e status
  etapa_atual TEXT NOT NULL DEFAULT 'novo', -- novo, em_triagem, pre_selecao, entrevista_rh, teste_tecnico, entrevista_gestor, entrevista_final, aprovado, proposta_enviada, contratado, reprovado, banco_talentos
  status TEXT NOT NULL DEFAULT 'em_andamento', -- em_andamento, aprovado, reprovado, desistente, contratado
  
  -- Match
  match_score INTEGER DEFAULT 0,
  match_score_id UUID REFERENCES public.match_scores(id),
  
  -- Origem e tracking
  origem TEXT DEFAULT 'portal',
  
  -- Datas
  data_inscricao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  data_ultima_movimentacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  data_conclusao TIMESTAMP WITH TIME ZONE,
  
  -- Motivo (em caso de reprovação/desistência)
  motivo_encerramento TEXT,
  observacoes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Constraint: candidato só pode ter um processo ativo por vaga
  UNIQUE(vaga_id, candidato_id)
);

-- Índices para processos_seletivos
CREATE INDEX idx_processos_vaga ON public.processos_seletivos(vaga_id);
CREATE INDEX idx_processos_candidato ON public.processos_seletivos(candidato_id);
CREATE INDEX idx_processos_etapa ON public.processos_seletivos(etapa_atual);
CREATE INDEX idx_processos_status ON public.processos_seletivos(status);
CREATE INDEX idx_processos_data_movimentacao ON public.processos_seletivos(data_ultima_movimentacao DESC);

-- RLS para processos_seletivos
ALTER TABLE public.processos_seletivos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de processos" ON public.processos_seletivos
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de processos" ON public.processos_seletivos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de processos" ON public.processos_seletivos
  FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão de processos" ON public.processos_seletivos
  FOR DELETE USING (true);

-- Trigger updated_at para processos_seletivos
CREATE TRIGGER update_processos_seletivos_updated_at
  BEFORE UPDATE ON public.processos_seletivos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 4. TABELA ENTREVISTAS
-- ============================================================
CREATE TABLE public.entrevistas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relacionamentos
  processo_id UUID NOT NULL REFERENCES public.processos_seletivos(id) ON DELETE CASCADE,
  
  -- Tipo e etapa
  tipo TEXT NOT NULL DEFAULT 'video', -- telefone, video, presencial
  etapa TEXT NOT NULL, -- entrevista_rh, entrevista_gestor, entrevista_final, etc.
  
  -- Agendamento
  data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  duracao_minutos INTEGER NOT NULL DEFAULT 60,
  
  -- Local/Link
  local TEXT,
  link_video TEXT,
  
  -- Entrevistadores
  entrevistadores UUID[] DEFAULT '{}', -- Array de user_ids
  entrevistadores_nomes TEXT[] DEFAULT '{}', -- Cache dos nomes
  
  -- Status
  status TEXT NOT NULL DEFAULT 'agendada', -- agendada, confirmada, realizada, cancelada, no_show
  
  -- Feedback (preenchido após entrevista)
  parecer TEXT, -- aprovar, reprovar, em_duvida
  observacoes TEXT,
  
  -- Notificações
  candidato_notificado BOOLEAN DEFAULT false,
  lembrete_enviado BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para entrevistas
CREATE INDEX idx_entrevistas_processo ON public.entrevistas(processo_id);
CREATE INDEX idx_entrevistas_data_hora ON public.entrevistas(data_hora);
CREATE INDEX idx_entrevistas_status ON public.entrevistas(status);
CREATE INDEX idx_entrevistas_tipo ON public.entrevistas(tipo);

-- RLS para entrevistas
ALTER TABLE public.entrevistas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de entrevistas" ON public.entrevistas
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de entrevistas" ON public.entrevistas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de entrevistas" ON public.entrevistas
  FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão de entrevistas" ON public.entrevistas
  FOR DELETE USING (true);

-- Trigger updated_at para entrevistas
CREATE TRIGGER update_entrevistas_updated_at
  BEFORE UPDATE ON public.entrevistas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 5. TABELA AVALIAÇÕES
-- ============================================================
CREATE TABLE public.avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relacionamentos
  processo_id UUID NOT NULL REFERENCES public.processos_seletivos(id) ON DELETE CASCADE,
  avaliador_id UUID REFERENCES auth.users(id),
  entrevista_id UUID REFERENCES public.entrevistas(id) ON DELETE SET NULL,
  
  -- Etapa da avaliação
  etapa TEXT NOT NULL, -- em qual etapa foi feita a avaliação
  
  -- Notas por competência (JSONB para flexibilidade)
  notas_tecnicas JSONB DEFAULT '[]', -- Array de { competenciaId, nome, nota, observacao }
  notas_comportamentais JSONB DEFAULT '[]',
  nota_geral NUMERIC(3,1), -- 1.0 a 5.0
  
  -- Parecer
  pontos_fortes TEXT,
  pontos_desenvolvimento TEXT,
  parecer TEXT NOT NULL, -- aprovar, reprovar, em_duvida
  observacoes_gerais TEXT,
  recomendacao TEXT,
  
  -- Timestamps
  data_avaliacao TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para avaliacoes
CREATE INDEX idx_avaliacoes_processo ON public.avaliacoes(processo_id);
CREATE INDEX idx_avaliacoes_avaliador ON public.avaliacoes(avaliador_id);
CREATE INDEX idx_avaliacoes_parecer ON public.avaliacoes(parecer);
CREATE INDEX idx_avaliacoes_etapa ON public.avaliacoes(etapa);

-- RLS para avaliacoes
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de avaliacoes" ON public.avaliacoes
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de avaliacoes" ON public.avaliacoes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de avaliacoes" ON public.avaliacoes
  FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão de avaliacoes" ON public.avaliacoes
  FOR DELETE USING (true);

-- Trigger updated_at para avaliacoes
CREATE TRIGGER update_avaliacoes_updated_at
  BEFORE UPDATE ON public.avaliacoes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 6. TABELA PROVAS
-- ============================================================
CREATE TABLE public.provas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Dados básicos
  titulo TEXT NOT NULL,
  descricao TEXT,
  
  -- Categorização
  categoria TEXT NOT NULL DEFAULT 'tecnico', -- cognitivo, comportamental, tecnico, idiomas, situacional, competencias
  departamentos TEXT[] DEFAULT '{"geral"}', -- tecnologia, financeiro, rh, comercial, marketing, administrativo, juridico, operacoes, engenharia, geral
  niveis_aplicaveis TEXT[] DEFAULT '{"junior", "pleno", "senior"}', -- estagiario, junior, pleno, senior, especialista, coordenador, gerente, diretor
  
  -- Configurações
  duracao_minutos INTEGER NOT NULL DEFAULT 60,
  pontuacao_maxima INTEGER NOT NULL DEFAULT 100,
  nota_minima INTEGER NOT NULL DEFAULT 70,
  
  -- Questões (JSONB para flexibilidade)
  questoes JSONB DEFAULT '[]', -- Array de Questao
  total_questoes INTEGER DEFAULT 0,
  
  -- Tags para busca
  tags TEXT[] DEFAULT '{}',
  
  -- Status
  ativo BOOLEAN DEFAULT true,
  
  -- Métricas
  total_aplicacoes INTEGER DEFAULT 0,
  media_notas NUMERIC(5,2) DEFAULT 0,
  
  -- Criador
  criado_por UUID REFERENCES auth.users(id),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para provas
CREATE INDEX idx_provas_categoria ON public.provas(categoria);
CREATE INDEX idx_provas_ativo ON public.provas(ativo);
CREATE INDEX idx_provas_departamentos ON public.provas USING GIN(departamentos);
CREATE INDEX idx_provas_tags ON public.provas USING GIN(tags);

-- RLS para provas
ALTER TABLE public.provas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de provas" ON public.provas
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de provas" ON public.provas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de provas" ON public.provas
  FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão de provas" ON public.provas
  FOR DELETE USING (true);

-- Trigger updated_at para provas
CREATE TRIGGER update_provas_updated_at
  BEFORE UPDATE ON public.provas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 7. TABELA RESULTADOS DE PROVAS
-- ============================================================
CREATE TABLE public.resultados_provas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relacionamentos
  prova_id UUID NOT NULL REFERENCES public.provas(id) ON DELETE CASCADE,
  processo_id UUID NOT NULL REFERENCES public.processos_seletivos(id) ON DELETE CASCADE,
  candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  
  -- Resultado
  nota NUMERIC(5,2) NOT NULL,
  percentual NUMERIC(5,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'em_analise', -- aprovado, reprovado, em_analise
  
  -- Respostas detalhadas
  respostas JSONB DEFAULT '[]', -- Array de { questaoId, resposta, correta, pontos }
  
  -- Tempo
  tempo_gasto_minutos INTEGER,
  iniciado_em TIMESTAMP WITH TIME ZONE,
  finalizado_em TIMESTAMP WITH TIME ZONE,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  -- Constraint: candidato só pode fazer uma prova uma vez por processo
  UNIQUE(prova_id, processo_id, candidato_id)
);

-- Índices para resultados_provas
CREATE INDEX idx_resultados_prova ON public.resultados_provas(prova_id);
CREATE INDEX idx_resultados_processo ON public.resultados_provas(processo_id);
CREATE INDEX idx_resultados_candidato ON public.resultados_provas(candidato_id);
CREATE INDEX idx_resultados_status ON public.resultados_provas(status);

-- RLS para resultados_provas
ALTER TABLE public.resultados_provas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de resultados" ON public.resultados_provas
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de resultados" ON public.resultados_provas
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Permitir atualização de resultados" ON public.resultados_provas
  FOR UPDATE USING (true);

CREATE POLICY "Permitir exclusão de resultados" ON public.resultados_provas
  FOR DELETE USING (true);

-- Trigger updated_at para resultados_provas
CREATE TRIGGER update_resultados_provas_updated_at
  BEFORE UPDATE ON public.resultados_provas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================
-- 8. TABELA HISTÓRICO DE ETAPAS (Audit Trail)
-- ============================================================
CREATE TABLE public.historico_etapas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relacionamentos
  processo_id UUID NOT NULL REFERENCES public.processos_seletivos(id) ON DELETE CASCADE,
  
  -- Mudança
  etapa_anterior TEXT,
  etapa_nova TEXT NOT NULL,
  
  -- Quem alterou
  alterado_por UUID REFERENCES auth.users(id),
  
  -- Observação
  observacao TEXT,
  
  -- Timestamp
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para historico_etapas
CREATE INDEX idx_historico_processo ON public.historico_etapas(processo_id);
CREATE INDEX idx_historico_created_at ON public.historico_etapas(created_at DESC);

-- RLS para historico_etapas
ALTER TABLE public.historico_etapas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir leitura de historico" ON public.historico_etapas
  FOR SELECT USING (true);

CREATE POLICY "Permitir inserção de historico" ON public.historico_etapas
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- 9. ATUALIZAR REFERÊNCIA EM match_scores
-- ============================================================
-- Agora vaga_id pode ser UUID (referência real)
-- Mas mantemos compatibilidade com o campo TEXT existente

-- ============================================================
-- 10. HABILITAR REALTIME PARA NOVAS TABELAS
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.vagas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.processos_seletivos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.entrevistas;

-- ============================================================
-- 11. VIEWS ÚTEIS
-- ============================================================

-- View: Pipeline com dados completos
CREATE OR REPLACE VIEW public.v_pipeline AS
SELECT 
  ps.id,
  ps.etapa_atual,
  ps.status,
  ps.match_score,
  ps.data_inscricao,
  ps.data_ultima_movimentacao,
  EXTRACT(DAY FROM (now() - ps.data_ultima_movimentacao)) as dias_na_etapa,
  c.id as candidato_id,
  c.nome as candidato_nome,
  c.email as candidato_email,
  c.foto_url as candidato_foto,
  c.cargo_atual,
  v.id as vaga_id,
  v.titulo as vaga_titulo,
  v.departamento as vaga_departamento,
  v.prioridade as vaga_prioridade
FROM public.processos_seletivos ps
JOIN public.candidatos c ON ps.candidato_id = c.id
JOIN public.vagas v ON ps.vaga_id = v.id
WHERE ps.status = 'em_andamento';

-- View: Agenda de entrevistas
CREATE OR REPLACE VIEW public.v_agenda_entrevistas AS
SELECT 
  e.id,
  e.tipo,
  e.etapa,
  e.data_hora,
  e.duracao_minutos,
  e.local,
  e.link_video,
  e.status,
  e.entrevistadores_nomes,
  c.nome as candidato_nome,
  c.email as candidato_email,
  c.foto_url as candidato_foto,
  v.titulo as vaga_titulo,
  v.departamento as vaga_departamento
FROM public.entrevistas e
JOIN public.processos_seletivos ps ON e.processo_id = ps.id
JOIN public.candidatos c ON ps.candidato_id = c.id
JOIN public.vagas v ON ps.vaga_id = v.id
WHERE e.data_hora >= now() - interval '1 day'
ORDER BY e.data_hora ASC;

-- View: KPIs de vagas
CREATE OR REPLACE VIEW public.v_vagas_kpis AS
SELECT 
  v.id,
  v.titulo,
  v.departamento,
  v.status,
  v.prioridade,
  v.quantidade,
  v.created_at,
  EXTRACT(DAY FROM (now() - v.created_at)) as dias_aberta,
  COUNT(DISTINCT ps.id) as total_candidatos,
  COUNT(DISTINCT ps.id) FILTER (WHERE ps.status = 'em_andamento') as em_processo,
  COUNT(DISTINCT ps.id) FILTER (WHERE ps.status = 'contratado') as contratados
FROM public.vagas v
LEFT JOIN public.processos_seletivos ps ON v.id = ps.vaga_id
GROUP BY v.id;

-- ============================================================
-- 12. FUNÇÃO PARA ATUALIZAR MÉTRICAS DA VAGA
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_vaga_metrics()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.vagas
  SET 
    total_candidatos = (
      SELECT COUNT(*) FROM public.processos_seletivos WHERE vaga_id = COALESCE(NEW.vaga_id, OLD.vaga_id)
    ),
    em_processo = (
      SELECT COUNT(*) FROM public.processos_seletivos WHERE vaga_id = COALESCE(NEW.vaga_id, OLD.vaga_id) AND status = 'em_andamento'
    ),
    contratados = (
      SELECT COUNT(*) FROM public.processos_seletivos WHERE vaga_id = COALESCE(NEW.vaga_id, OLD.vaga_id) AND status = 'contratado'
    ),
    updated_at = now()
  WHERE id = COALESCE(NEW.vaga_id, OLD.vaga_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger para atualizar métricas quando processo muda
CREATE TRIGGER update_vaga_metrics_on_processo_change
  AFTER INSERT OR UPDATE OR DELETE ON public.processos_seletivos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_vaga_metrics();

-- ============================================================
-- 13. FUNÇÃO PARA REGISTRAR HISTÓRICO DE ETAPAS
-- ============================================================
CREATE OR REPLACE FUNCTION public.log_etapa_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.etapa_atual IS DISTINCT FROM NEW.etapa_atual THEN
    INSERT INTO public.historico_etapas (processo_id, etapa_anterior, etapa_nova)
    VALUES (NEW.id, OLD.etapa_atual, NEW.etapa_atual);
    
    -- Atualiza data_ultima_movimentacao
    NEW.data_ultima_movimentacao = now();
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para registrar mudanças de etapa
CREATE TRIGGER log_processo_etapa_change
  BEFORE UPDATE ON public.processos_seletivos
  FOR EACH ROW
  EXECUTE FUNCTION public.log_etapa_change();

-- ============================================================
-- FIM DA MIGRATION
-- ============================================================
