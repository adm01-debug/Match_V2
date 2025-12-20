-- Create vagas table
CREATE TABLE public.vagas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  departamento TEXT NOT NULL,
  gestor_nome TEXT,
  recrutador_nome TEXT,
  quantidade INTEGER NOT NULL DEFAULT 1,
  tipo_contrato TEXT NOT NULL DEFAULT 'clt',
  modalidade TEXT NOT NULL DEFAULT 'presencial',
  cidade TEXT,
  estado TEXT,
  salario_min NUMERIC,
  salario_max NUMERIC,
  salario_a_combinar BOOLEAN NOT NULL DEFAULT false,
  beneficios TEXT[] DEFAULT '{}'::TEXT[],
  descricao_empresa TEXT,
  responsabilidades TEXT,
  requisitos_obrigatorios TEXT,
  requisitos_desejaveis TEXT,
  perguntas_triagem JSONB DEFAULT '[]'::JSONB,
  skills_avaliacao TEXT[] DEFAULT '{}'::TEXT[],
  status TEXT NOT NULL DEFAULT 'rascunho',
  prioridade TEXT NOT NULL DEFAULT 'media',
  data_criacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_publicacao TIMESTAMP WITH TIME ZONE,
  data_encerramento TIMESTAMP WITH TIME ZONE,
  total_candidatos INTEGER NOT NULL DEFAULT 0,
  em_processo INTEGER NOT NULL DEFAULT 0,
  contratados INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.vagas ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Usuários autenticados podem ver vagas" 
ON public.vagas 
FOR SELECT 
USING (true);

CREATE POLICY "Usuários autenticados podem criar vagas" 
ON public.vagas 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar vagas" 
ON public.vagas 
FOR UPDATE 
USING (true);

CREATE POLICY "Usuários autenticados podem deletar vagas" 
ON public.vagas 
FOR DELETE 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_vagas_updated_at
BEFORE UPDATE ON public.vagas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.vagas;

-- Insert sample data
INSERT INTO public.vagas (titulo, departamento, gestor_nome, recrutador_nome, quantidade, tipo_contrato, modalidade, cidade, estado, salario_min, salario_max, salario_a_combinar, beneficios, descricao_empresa, responsabilidades, requisitos_obrigatorios, requisitos_desejaveis, skills_avaliacao, status, prioridade, data_publicacao, total_candidatos, em_processo, contratados)
VALUES 
  ('Operador de Gravação', 'Produção', 'Carlos Mendes', 'Maria Santos', 3, 'clt', 'presencial', 'São Paulo', 'SP', 2500, 3000, false, ARRAY['Vale Transporte', 'Vale Refeição', 'Plano de Saúde', 'Seguro de Vida'], 'A Promo Brindes é líder no mercado de brindes promocionais há mais de 11 anos.', '• Operar máquinas de gravação a laser e tampografia\n• Realizar setup e ajustes de equipamentos\n• Garantir qualidade das gravações', '• Ensino médio completo\n• Experiência com operação de máquinas industriais\n• Disponibilidade para trabalho presencial', '• Experiência com gravação a laser\n• Conhecimento em CorelDraw', ARRAY['Gravação Laser', 'Tampografia', 'CorelDraw', 'CNC'], 'publicada', 'urgente', now(), 45, 12, 0),
  ('Designer Gráfico', 'Marketing/Arte', 'Fernanda Lima', 'Maria Santos', 1, 'clt', 'hibrido', 'São Paulo', 'SP', 3500, 4500, false, ARRAY['Vale Transporte', 'Vale Refeição', 'Plano de Saúde', 'Home Office'], 'A Promo Brindes é líder no mercado de brindes promocionais há mais de 11 anos.', '• Criar artes para produtos promocionais\n• Desenvolver materiais de comunicação\n• Apoiar campanhas de marketing', '• Graduação em Design ou áreas afins\n• Domínio de Adobe Creative Suite\n• Portfolio comprovado', '• Experiência com brindes promocionais\n• Conhecimento em CorelDraw', ARRAY['Photoshop', 'Illustrator', 'CorelDraw', 'Criatividade'], 'publicada', 'alta', now(), 23, 8, 0),
  ('Vendedor Externo', 'Comercial', 'Paulo Roberto', 'Maria Santos', 2, 'clt', 'presencial', 'São Paulo', 'SP', 3000, 4000, false, ARRAY['Vale Transporte', 'Vale Refeição', 'Comissão', 'Carro da empresa'], 'A Promo Brindes é líder no mercado de brindes promocionais há mais de 11 anos.', '• Prospectar novos clientes\n• Manter carteira de clientes ativa\n• Atingir metas de vendas', '• Experiência com vendas B2B\n• CNH categoria B\n• Disponibilidade para viagens', '• Experiência no segmento promocional\n• Carteira de clientes ativa', ARRAY['Vendas', 'Negociação', 'Prospecção', 'Relacionamento'], 'publicada', 'alta', now(), 31, 6, 0),
  ('Analista Financeiro', 'Financeiro', 'Ricardo Almeida', 'Maria Santos', 1, 'clt', 'hibrido', 'São Paulo', 'SP', 4000, 5000, false, ARRAY['Vale Transporte', 'Vale Refeição', 'Plano de Saúde', 'PLR'], 'A Promo Brindes é líder no mercado de brindes promocionais há mais de 11 anos.', '• Análise de contas a pagar e receber\n• Conciliação bancária\n• Relatórios financeiros', '• Graduação em Contabilidade ou Administração\n• Experiência na área financeira\n• Excel avançado', '• Conhecimento em SAP\n• Pós-graduação na área', ARRAY['Excel', 'Análise Financeira', 'ERP', 'Conciliação'], 'aguardando_aprovacao', 'media', NULL, 0, 0, 0),
  ('Assistente Administrativo', 'Administrativo', 'Lucia Ferreira', 'Maria Santos', 1, 'clt', 'presencial', 'São Paulo', 'SP', 2000, 2500, false, ARRAY['Vale Transporte', 'Vale Refeição', 'Plano de Saúde'], 'A Promo Brindes é líder no mercado de brindes promocionais há mais de 11 anos.', '• Rotinas administrativas\n• Atendimento telefônico\n• Organização de documentos', '• Ensino médio completo\n• Conhecimento em pacote Office\n• Boa comunicação', '• Cursando superior\n• Experiência prévia', ARRAY['Office', 'Comunicação', 'Organização'], 'encerrada', 'baixa', now() - interval '60 days', 67, 0, 1);