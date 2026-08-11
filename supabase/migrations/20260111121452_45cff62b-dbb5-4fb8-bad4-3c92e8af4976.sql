-- =============================================
-- FASE 1: PERFIL DE CARGO E CRITÉRIOS DE SELEÇÃO
-- =============================================

-- Tabela de Valores Culturais da Empresa
CREATE TABLE public.valores_culturais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  icone VARCHAR(50) DEFAULT 'Heart',
  cor VARCHAR(50) DEFAULT 'blue',
  ativo BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de Competências Organizacionais
CREATE TABLE public.competencias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(50) NOT NULL DEFAULT 'tecnica', -- tecnica, comportamental, cultural
  categoria VARCHAR(100),
  indicadores_comportamentais TEXT[], -- Exemplos de comportamentos observáveis
  perguntas_sugeridas TEXT[], -- Perguntas para entrevista
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Perfil de Cargo (extensão da vaga com critérios detalhados)
CREATE TABLE public.perfis_cargo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vaga_id UUID REFERENCES public.vagas(id) ON DELETE CASCADE,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  -- Perfil Comportamental Esperado (DISC simplificado)
  perfil_dominancia INTEGER DEFAULT 50 CHECK (perfil_dominancia >= 0 AND perfil_dominancia <= 100),
  perfil_influencia INTEGER DEFAULT 50 CHECK (perfil_influencia >= 0 AND perfil_influencia <= 100),
  perfil_estabilidade INTEGER DEFAULT 50 CHECK (perfil_estabilidade >= 0 AND perfil_estabilidade <= 100),
  perfil_conformidade INTEGER DEFAULT 50 CHECK (perfil_conformidade >= 0 AND perfil_conformidade <= 100),
  -- Configurações
  tolerancia_perfil INTEGER DEFAULT 20, -- Variação aceitável do perfil ideal
  peso_tecnico DECIMAL(3,2) DEFAULT 0.40,
  peso_comportamental DECIMAL(3,2) DEFAULT 0.30,
  peso_cultural DECIMAL(3,2) DEFAULT 0.30,
  nota_minima_aprovacao INTEGER DEFAULT 70,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Critérios de Seleção por Perfil
CREATE TABLE public.criterios_selecao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  perfil_cargo_id UUID REFERENCES public.perfis_cargo(id) ON DELETE CASCADE,
  competencia_id UUID REFERENCES public.competencias(id) ON DELETE SET NULL,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(50) NOT NULL DEFAULT 'classificatorio', -- eliminatorio, classificatorio
  peso DECIMAL(3,2) DEFAULT 1.00,
  nota_minima INTEGER, -- Para critérios eliminatórios
  ordem INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Valores Culturais esperados por Perfil
CREATE TABLE public.perfil_valores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  perfil_cargo_id UUID REFERENCES public.perfis_cargo(id) ON DELETE CASCADE,
  valor_cultural_id UUID REFERENCES public.valores_culturais(id) ON DELETE CASCADE,
  peso DECIMAL(3,2) DEFAULT 1.00,
  obrigatorio BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(perfil_cargo_id, valor_cultural_id)
);

-- =============================================
-- FASE 2: ASSESSMENTS AVANÇADOS
-- =============================================

-- Tabela de Assessments (Testes Comportamentais, Culturais, etc)
CREATE TABLE public.assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(200) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(50) NOT NULL, -- disc, cultural, situacional, valores
  instrucoes TEXT,
  duracao_estimada INTEGER DEFAULT 15, -- minutos
  total_questoes INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  versao INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Questões de Assessment
CREATE TABLE public.assessment_questoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  texto TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL, -- escala, escolha_forcada, multipla, situacional
  opcoes JSONB, -- Array de opções com valores
  dimensao VARCHAR(50), -- Para DISC: D, I, S, C | Para valores: nome do valor
  peso DECIMAL(3,2) DEFAULT 1.00,
  ordem INTEGER DEFAULT 0,
  obrigatoria BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Respostas de Assessment do Candidato
CREATE TABLE public.assessment_respostas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  assessment_id UUID REFERENCES public.assessments(id) ON DELETE CASCADE,
  candidato_id UUID REFERENCES public.candidatos(id) ON DELETE CASCADE,
  processo_id UUID REFERENCES public.processos_seletivos(id) ON DELETE SET NULL,
  respostas JSONB NOT NULL, -- {questao_id: resposta_valor}
  resultados JSONB, -- Resultados calculados
  tempo_gasto INTEGER, -- segundos
  iniciado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  finalizado_em TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'em_andamento', -- em_andamento, finalizado, expirado
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Templates de Entrevista Estruturada
CREATE TABLE public.templates_entrevista (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  tipo_entrevista VARCHAR(50) DEFAULT 'tecnica', -- tecnica, comportamental, cultural, final
  departamento VARCHAR(100),
  nivel VARCHAR(50), -- basico, intermediario, avancado
  duracao_sugerida INTEGER DEFAULT 60, -- minutos
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Perguntas do Template de Entrevista
CREATE TABLE public.template_perguntas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id UUID REFERENCES public.templates_entrevista(id) ON DELETE CASCADE,
  competencia_id UUID REFERENCES public.competencias(id) ON DELETE SET NULL,
  pergunta TEXT NOT NULL,
  tipo VARCHAR(50) DEFAULT 'comportamental', -- tecnica, comportamental, situacional
  criterios_avaliacao TEXT[], -- O que avaliar na resposta
  resposta_ideal TEXT, -- Guia para o entrevistador
  pontuacao_maxima INTEGER DEFAULT 5,
  obrigatoria BOOLEAN DEFAULT true,
  ordem INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Respostas de Entrevista Estruturada
CREATE TABLE public.entrevista_respostas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  entrevista_id UUID REFERENCES public.entrevistas(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.templates_entrevista(id) ON DELETE SET NULL,
  pergunta_id UUID REFERENCES public.template_perguntas(id) ON DELETE SET NULL,
  resposta_candidato TEXT,
  nota INTEGER CHECK (nota >= 0 AND nota <= 5),
  observacoes TEXT,
  avaliador_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- FASE 3: SCORECARD E AUTOMAÇÃO
-- =============================================

-- Scorecard Unificado do Candidato
CREATE TABLE public.scorecards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  processo_id UUID REFERENCES public.processos_seletivos(id) ON DELETE CASCADE,
  candidato_id UUID REFERENCES public.candidatos(id) ON DELETE CASCADE,
  perfil_cargo_id UUID REFERENCES public.perfis_cargo(id) ON DELETE SET NULL,
  -- Scores por Dimensão
  score_tecnico DECIMAL(5,2),
  score_comportamental DECIMAL(5,2),
  score_cultural DECIMAL(5,2),
  score_experiencia DECIMAL(5,2),
  score_final DECIMAL(5,2),
  -- Perfil DISC do Candidato
  disc_dominancia INTEGER,
  disc_influencia INTEGER,
  disc_estabilidade INTEGER,
  disc_conformidade INTEGER,
  fit_perfil DECIMAL(5,2), -- % de aderência ao perfil ideal
  -- Resumo
  pontos_fortes TEXT[],
  pontos_desenvolvimento TEXT[],
  riscos TEXT[],
  recomendacao VARCHAR(50), -- aprovar, reprovar, avaliar_mais
  justificativa TEXT,
  -- Metadados
  gerado_por VARCHAR(50) DEFAULT 'sistema', -- sistema, manual, ai
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Detalhes do Scorecard por Competência
CREATE TABLE public.scorecard_competencias (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  scorecard_id UUID REFERENCES public.scorecards(id) ON DELETE CASCADE,
  competencia_id UUID REFERENCES public.competencias(id) ON DELETE SET NULL,
  criterio_id UUID REFERENCES public.criterios_selecao(id) ON DELETE SET NULL,
  nome VARCHAR(200) NOT NULL,
  tipo VARCHAR(50),
  nota DECIMAL(3,1),
  peso DECIMAL(3,2) DEFAULT 1.00,
  evidencias TEXT[],
  fonte VARCHAR(100), -- prova, entrevista, assessment, avaliacao
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Regras de Automação
CREATE TABLE public.regras_automacao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome VARCHAR(200) NOT NULL,
  descricao TEXT,
  tipo VARCHAR(50) NOT NULL, -- aprovacao_automatica, reprovacao_automatica, notificacao, mudanca_etapa
  condicoes JSONB NOT NULL, -- Condições para disparar a regra
  acoes JSONB NOT NULL, -- Ações a executar
  prioridade INTEGER DEFAULT 0,
  ativo BOOLEAN DEFAULT true,
  aplicavel_a VARCHAR(50)[] DEFAULT ARRAY['todos'], -- departamentos ou cargos específicos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Log de Execução de Regras
CREATE TABLE public.regras_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  regra_id UUID REFERENCES public.regras_automacao(id) ON DELETE SET NULL,
  processo_id UUID REFERENCES public.processos_seletivos(id) ON DELETE CASCADE,
  candidato_id UUID REFERENCES public.candidatos(id) ON DELETE SET NULL,
  acao_executada JSONB,
  resultado VARCHAR(50), -- sucesso, falha, ignorado
  detalhes TEXT,
  executado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Histórico de Comparações entre Candidatos
CREATE TABLE public.comparativos_candidatos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vaga_id UUID REFERENCES public.vagas(id) ON DELETE CASCADE,
  candidatos_ids UUID[] NOT NULL,
  criterios_comparados TEXT[],
  resultado JSONB, -- Ranking e detalhes
  gerado_por UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- =============================================
-- ENABLE RLS
-- =============================================

ALTER TABLE public.valores_culturais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfis_cargo ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.criterios_selecao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.perfil_valores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_respostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates_entrevista ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_perguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entrevista_respostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorecards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scorecard_competencias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_automacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regras_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comparativos_candidatos ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES (Authenticated users can access all)
-- =============================================

CREATE POLICY "Authenticated users can manage valores_culturais" ON public.valores_culturais FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage competencias" ON public.competencias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage perfis_cargo" ON public.perfis_cargo FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage criterios_selecao" ON public.criterios_selecao FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage perfil_valores" ON public.perfil_valores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage assessments" ON public.assessments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage assessment_questoes" ON public.assessment_questoes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage assessment_respostas" ON public.assessment_respostas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage templates_entrevista" ON public.templates_entrevista FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage template_perguntas" ON public.template_perguntas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage entrevista_respostas" ON public.entrevista_respostas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage scorecards" ON public.scorecards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage scorecard_competencias" ON public.scorecard_competencias FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage regras_automacao" ON public.regras_automacao FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage regras_log" ON public.regras_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated users can manage comparativos_candidatos" ON public.comparativos_candidatos FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- SEED DATA - Competências Padrão
-- =============================================

INSERT INTO public.competencias (nome, descricao, tipo, categoria, indicadores_comportamentais, perguntas_sugeridas) VALUES
-- Competências Técnicas
('Conhecimento Técnico', 'Domínio das ferramentas e tecnologias da área', 'tecnica', 'Hard Skills', 
  ARRAY['Aplica conhecimentos sem supervisão', 'Resolve problemas técnicos complexos', 'Mantém-se atualizado'],
  ARRAY['Descreva um projeto técnico desafiador que você liderou', 'Como você se mantém atualizado na sua área?']),
('Resolução de Problemas', 'Capacidade de analisar e resolver problemas', 'tecnica', 'Hard Skills',
  ARRAY['Identifica causa raiz', 'Propõe soluções criativas', 'Toma decisões baseadas em dados'],
  ARRAY['Conte sobre um problema complexo que você resolveu', 'Qual sua metodologia para resolver problemas?']),
('Gestão de Projetos', 'Organização e execução de projetos', 'tecnica', 'Hard Skills',
  ARRAY['Planeja e prioriza tarefas', 'Cumpre prazos', 'Gerencia recursos eficientemente'],
  ARRAY['Como você organiza e prioriza suas tarefas?', 'Descreva um projeto que você gerenciou do início ao fim']),

-- Competências Comportamentais
('Comunicação', 'Clareza e efetividade na comunicação', 'comportamental', 'Soft Skills',
  ARRAY['Comunica ideias claramente', 'Adapta comunicação ao público', 'Escuta ativamente'],
  ARRAY['Conte sobre uma situação onde sua comunicação foi crucial', 'Como você lida com conflitos de comunicação?']),
('Trabalho em Equipe', 'Colaboração e sinergia com colegas', 'comportamental', 'Soft Skills',
  ARRAY['Colabora proativamente', 'Respeita opiniões diferentes', 'Contribui para o sucesso do time'],
  ARRAY['Descreva como você contribuiu para o sucesso de uma equipe', 'Como você lida com colegas difíceis?']),
('Liderança', 'Capacidade de inspirar e guiar pessoas', 'comportamental', 'Soft Skills',
  ARRAY['Inspira e motiva outros', 'Delega efetivamente', 'Desenvolve pessoas'],
  ARRAY['Conte sobre uma situação onde você liderou uma equipe', 'Como você desenvolve pessoas?']),
('Adaptabilidade', 'Flexibilidade frente a mudanças', 'comportamental', 'Soft Skills',
  ARRAY['Adapta-se rapidamente', 'Mantém performance sob pressão', 'Abraça mudanças'],
  ARRAY['Descreva uma mudança significativa que você enfrentou', 'Como você lida com incertezas?']),
('Proatividade', 'Iniciativa e antecipação', 'comportamental', 'Soft Skills',
  ARRAY['Antecipa problemas', 'Propõe melhorias', 'Age sem precisar de supervisão'],
  ARRAY['Conte sobre uma iniciativa sua que gerou impacto positivo', 'Como você identifica oportunidades de melhoria?']),

-- Competências Culturais
('Ética e Integridade', 'Honestidade e transparência', 'cultural', 'Valores',
  ARRAY['Age com honestidade', 'Assume responsabilidade', 'Mantém confidencialidade'],
  ARRAY['Descreva uma situação onde sua ética foi testada', 'Como você lida com dilemas éticos?']),
('Foco no Cliente', 'Orientação para satisfação do cliente', 'cultural', 'Valores',
  ARRAY['Entende necessidades do cliente', 'Busca excelência no atendimento', 'Antecipa expectativas'],
  ARRAY['Conte sobre uma situação onde você encantou um cliente', 'Como você lida com clientes difíceis?']),
('Inovação', 'Busca por novas soluções e melhorias', 'cultural', 'Valores',
  ARRAY['Propõe ideias inovadoras', 'Questiona status quo', 'Experimenta novas abordagens'],
  ARRAY['Descreva uma inovação que você implementou', 'Como você estimula a criatividade?']);

-- =============================================
-- SEED DATA - Valores Culturais Padrão
-- =============================================

INSERT INTO public.valores_culturais (nome, descricao, icone, cor, ordem) VALUES
('Integridade', 'Agir com ética, honestidade e transparência em todas as situações', 'Shield', 'blue', 1),
('Colaboração', 'Trabalhar em equipe, compartilhar conhecimento e apoiar colegas', 'Users', 'green', 2),
('Inovação', 'Buscar constantemente novas formas de fazer melhor', 'Lightbulb', 'amber', 3),
('Excelência', 'Entregar sempre o melhor resultado possível', 'Star', 'purple', 4),
('Foco no Cliente', 'Colocar o cliente no centro de todas as decisões', 'Heart', 'red', 5),
('Agilidade', 'Adaptar-se rapidamente e entregar valor de forma contínua', 'Zap', 'orange', 6),
('Respeito', 'Valorizar a diversidade e tratar todos com dignidade', 'HandHeart', 'pink', 7),
('Responsabilidade', 'Assumir compromissos e entregar resultados', 'Target', 'slate', 8);

-- =============================================
-- SEED DATA - Assessment DISC
-- =============================================

INSERT INTO public.assessments (id, titulo, descricao, tipo, instrucoes, duracao_estimada, total_questoes) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Assessment Comportamental DISC', 
  'Avaliação do perfil comportamental baseado na metodologia DISC', 'disc',
  'Para cada situação, escolha a opção que MAIS e MENOS representa você. Não existe resposta certa ou errada.',
  15, 12);

INSERT INTO public.assessment_questoes (assessment_id, texto, tipo, opcoes, dimensao, ordem) VALUES
('550e8400-e29b-41d4-a716-446655440001', 
  'Em um projeto de equipe, você geralmente...', 'escolha_forcada',
  '[{"texto": "Assume a liderança e direciona o grupo", "dimensao": "D", "valor": 4},
    {"texto": "Anima o grupo e promove a interação", "dimensao": "I", "valor": 4},
    {"texto": "Apoia os colegas e mantém a harmonia", "dimensao": "S", "valor": 4},
    {"texto": "Analisa os detalhes e garante a qualidade", "dimensao": "C", "valor": 4}]'::jsonb, 
  null, 1),
('550e8400-e29b-41d4-a716-446655440001',
  'Quando enfrenta um problema, você prefere...', 'escolha_forcada',
  '[{"texto": "Tomar uma decisão rápida e agir", "dimensao": "D", "valor": 4},
    {"texto": "Discutir com outras pessoas para encontrar soluções", "dimensao": "I", "valor": 4},
    {"texto": "Analisar cuidadosamente antes de decidir", "dimensao": "S", "valor": 4},
    {"texto": "Seguir um processo estruturado", "dimensao": "C", "valor": 4}]'::jsonb,
  null, 2),
('550e8400-e29b-41d4-a716-446655440001',
  'Em situações de pressão, você...', 'escolha_forcada',
  '[{"texto": "Fica mais focado e determinado", "dimensao": "D", "valor": 4},
    {"texto": "Busca apoio e motivação nos outros", "dimensao": "I", "valor": 4},
    {"texto": "Mantém a calma e a estabilidade", "dimensao": "S", "valor": 4},
    {"texto": "Redobra a atenção aos detalhes", "dimensao": "C", "valor": 4}]'::jsonb,
  null, 3),
('550e8400-e29b-41d4-a716-446655440001',
  'Você se sente mais motivado quando...', 'escolha_forcada',
  '[{"texto": "Tem desafios e metas ambiciosas", "dimensao": "D", "valor": 4},
    {"texto": "Pode interagir e trabalhar com pessoas", "dimensao": "I", "valor": 4},
    {"texto": "Tem estabilidade e previsibilidade", "dimensao": "S", "valor": 4},
    {"texto": "Pode fazer um trabalho de qualidade", "dimensao": "C", "valor": 4}]'::jsonb,
  null, 4),
('550e8400-e29b-41d4-a716-446655440001',
  'Seu estilo de comunicação é mais...', 'escolha_forcada',
  '[{"texto": "Direto e objetivo", "dimensao": "D", "valor": 4},
    {"texto": "Entusiástico e expressivo", "dimensao": "I", "valor": 4},
    {"texto": "Paciente e acolhedor", "dimensao": "S", "valor": 4},
    {"texto": "Preciso e detalhado", "dimensao": "C", "valor": 4}]'::jsonb,
  null, 5),
('550e8400-e29b-41d4-a716-446655440001',
  'Em conflitos, você geralmente...', 'escolha_forcada',
  '[{"texto": "Confronta diretamente para resolver", "dimensao": "D", "valor": 4},
    {"texto": "Usa humor e diplomacia", "dimensao": "I", "valor": 4},
    {"texto": "Busca compromisso e harmonia", "dimensao": "S", "valor": 4},
    {"texto": "Analisa os fatos antes de se posicionar", "dimensao": "C", "valor": 4}]'::jsonb,
  null, 6);

-- =============================================
-- SEED DATA - Assessment de Fit Cultural
-- =============================================

INSERT INTO public.assessments (id, titulo, descricao, tipo, instrucoes, duracao_estimada, total_questoes) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Assessment de Fit Cultural', 
  'Avaliação de alinhamento com os valores e cultura da empresa', 'cultural',
  'Avalie de 1 a 5 o quanto cada afirmação representa você no ambiente de trabalho.',
  10, 16);

INSERT INTO public.assessment_questoes (assessment_id, texto, tipo, dimensao, ordem) VALUES
('550e8400-e29b-41d4-a716-446655440002', 
  'Prefiro trabalhar de forma independente do que em grupo', 'escala', 'Colaboração', 1),
('550e8400-e29b-41d4-a716-446655440002',
  'Fico confortável assumindo riscos para inovar', 'escala', 'Inovação', 2),
('550e8400-e29b-41d4-a716-446655440002',
  'Priorizo a qualidade mesmo que leve mais tempo', 'escala', 'Excelência', 3),
('550e8400-e29b-41d4-a716-446655440002',
  'Transparência é mais importante que proteção pessoal', 'escala', 'Integridade', 4),
('550e8400-e29b-41d4-a716-446655440002',
  'Adapto-me facilmente a mudanças de planos', 'escala', 'Agilidade', 5),
('550e8400-e29b-41d4-a716-446655440002',
  'Coloco as necessidades do cliente acima das minhas preferências', 'escala', 'Foco no Cliente', 6),
('550e8400-e29b-41d4-a716-446655440002',
  'Valorizo ambientes de trabalho diversos e inclusivos', 'escala', 'Respeito', 7),
('550e8400-e29b-41d4-a716-446655440002',
  'Assumo responsabilidade pelos meus erros', 'escala', 'Responsabilidade', 8);

-- =============================================
-- SEED DATA - Template de Entrevista Comportamental
-- =============================================

INSERT INTO public.templates_entrevista (id, nome, descricao, tipo_entrevista, duracao_sugerida) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'Entrevista Comportamental Padrão',
  'Template para entrevistas focadas em competências comportamentais usando o método STAR',
  'comportamental', 45);

INSERT INTO public.template_perguntas (template_id, pergunta, tipo, criterios_avaliacao, resposta_ideal, ordem) VALUES
('660e8400-e29b-41d4-a716-446655440001',
  'Conte sobre uma situação onde você teve que lidar com um conflito no trabalho. Como você resolveu?',
  'comportamental',
  ARRAY['Identifica claramente a situação', 'Descreve sua abordagem', 'Explica o resultado', 'Demonstra aprendizado'],
  'Espera-se que o candidato use o método STAR, demonstrando habilidades de comunicação, empatia e resolução de conflitos.',
  1),
('660e8400-e29b-41d4-a716-446655440001',
  'Descreva um projeto onde você teve que trabalhar sob pressão e prazos apertados.',
  'comportamental',
  ARRAY['Contexto claro', 'Ações específicas tomadas', 'Gestão de tempo', 'Resultado alcançado'],
  'Candidato deve demonstrar capacidade de priorização, foco e resiliência.',
  2),
('660e8400-e29b-41d4-a716-446655440001',
  'Conte sobre uma vez que você teve que convencer alguém de uma ideia diferente.',
  'comportamental',
  ARRAY['Clareza na argumentação', 'Respeito pelo outro', 'Resultado da persuasão', 'Flexibilidade'],
  'Avaliar capacidade de influência, comunicação e negociação.',
  3),
('660e8400-e29b-41d4-a716-446655440001',
  'Descreva uma situação onde você identificou uma oportunidade de melhoria e agiu.',
  'comportamental',
  ARRAY['Iniciativa', 'Análise do problema', 'Implementação', 'Impacto gerado'],
  'Buscar evidências de proatividade e orientação para resultados.',
  4);