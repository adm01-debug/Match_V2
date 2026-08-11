-- Rollback: Use supabase db reset or restore from backup
-- This migration can be reverted by dropping added objects

-- Criar tabela de entrevistas
CREATE TABLE public.entrevistas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidato_id UUID REFERENCES public.candidatos(id) ON DELETE CASCADE,
  candidato_nome TEXT NOT NULL,
  vaga_id TEXT NOT NULL,
  vaga_titulo TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('presencial', 'online', 'telefone')),
  data DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fim TIME NOT NULL,
  local TEXT,
  link_online TEXT,
  entrevistadores TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  etapa TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendada' CHECK (status IN ('agendada', 'confirmada', 'realizada', 'cancelada', 'reagendada')),
  observacoes TEXT,
  feedback_resultado TEXT CHECK (feedback_resultado IN ('aprovado', 'reprovado', 'pendente')),
  feedback_nota DECIMAL(3,1),
  feedback_pontos_fortes TEXT[] DEFAULT ARRAY[]::TEXT[],
  feedback_pontos_melhorar TEXT[] DEFAULT ARRAY[]::TEXT[],
  feedback_comentarios TEXT,
  feedback_recomendacao TEXT,
  feedback_avaliado_por TEXT,
  feedback_avaliado_em TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Habilitar RLS
ALTER TABLE public.entrevistas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para usuários autenticados
CREATE POLICY "Usuários autenticados podem ver todas as entrevistas"
  ON public.entrevistas
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem criar entrevistas"
  ON public.entrevistas
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar entrevistas"
  ON public.entrevistas
  FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Usuários autenticados podem deletar entrevistas"
  ON public.entrevistas
  FOR DELETE
  TO authenticated
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_entrevistas_updated_at
  BEFORE UPDATE ON public.entrevistas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados de exemplo - entrevistas agendadas
INSERT INTO public.entrevistas (candidato_nome, vaga_id, vaga_titulo, tipo, data, hora_inicio, hora_fim, local, entrevistadores, etapa, status) VALUES
  ('Carlos Eduardo Silva', 'vaga-1', 'Operador de Gravação', 'presencial', CURRENT_DATE, '09:00', '10:00', 'Sala de Reuniões 1', ARRAY['Maria Santos (RH)', 'Carlos Supervisor'], 'Entrevista RH', 'confirmada'),
  ('Ana Paula Oliveira', 'vaga-2', 'Designer Gráfico', 'online', CURRENT_DATE, '10:30', '11:30', NULL, ARRAY['Maria Santos (RH)'], 'Entrevista RH', 'agendada'),
  ('Roberto Souza Ferreira', 'vaga-3', 'Vendedor Externo', 'presencial', CURRENT_DATE, '14:00', '15:00', 'Sala da Diretoria', ARRAY['João Diretor', 'Maria Santos (RH)'], 'Entrevista Final', 'confirmada'),
  ('Juliana Mendes', 'vaga-1', 'Operador de Gravação', 'telefone', CURRENT_DATE + INTERVAL '1 day', '09:00', '09:30', NULL, ARRAY['Maria Santos (RH)'], 'Triagem Telefônica', 'agendada'),
  ('Pedro Henrique Costa', 'vaga-1', 'Operador de Gravação', 'presencial', CURRENT_DATE + INTERVAL '1 day', '11:00', '12:00', 'Sala de Reuniões 2', ARRAY['Carlos Supervisor'], 'Entrevista Técnica', 'agendada');

-- Inserir entrevistas realizadas com feedback (aprovados)
INSERT INTO public.entrevistas (candidato_nome, vaga_id, vaga_titulo, tipo, data, hora_inicio, hora_fim, link_online, entrevistadores, etapa, status, feedback_resultado, feedback_nota, feedback_pontos_fortes, feedback_pontos_melhorar, feedback_comentarios, feedback_recomendacao, feedback_avaliado_por, feedback_avaliado_em) VALUES
  ('Lucas Almeida', 'vaga-3', 'Vendedor Externo', 'online', CURRENT_DATE - INTERVAL '1 day', '10:00', '11:00', 'https://meet.google.com/xyz', ARRAY['Gerente Comercial'], 'Entrevista Gestor', 'realizada', 'aprovado', 8.5, ARRAY['Excelente comunicação', 'Experiência relevante'], ARRAY['Poderia melhorar inglês'], 'Candidato muito bem preparado', 'Avançar para próxima etapa', 'Gerente Comercial', NOW() - INTERVAL '1 day'),
  ('Fernanda Lima', 'vaga-2', 'Designer Gráfico', 'presencial', CURRENT_DATE - INTERVAL '2 days', '14:00', '15:30', NULL, ARRAY['Diretor de Arte', 'Maria Santos (RH)'], 'Entrevista Final', 'realizada', 'aprovado', 9.0, ARRAY['Portfolio impressionante', 'Criatividade'], ARRAY['Experiência em motion']::TEXT[], 'Excelente candidata', 'Contratar imediatamente', 'Diretor de Arte', NOW() - INTERVAL '2 days'),
  ('Amanda Gomes', 'vaga-4', 'Analista Financeiro', 'online', CURRENT_DATE - INTERVAL '4 days', '11:00', '12:00', 'https://meet.google.com/abc', ARRAY['CFO'], 'Entrevista Final', 'realizada', 'aprovado', 8.0, ARRAY['Conhecimento técnico', 'Proatividade'], ARRAY['Experiência em SAP'], 'Boa candidata', 'Avançar', 'CFO', NOW() - INTERVAL '4 days'),
  ('Mariana Costa', 'vaga-2', 'Designer Gráfico', 'online', CURRENT_DATE - INTERVAL '6 days', '10:00', '11:00', 'https://meet.google.com/def', ARRAY['Diretor de Arte'], 'Entrevista RH', 'realizada', 'aprovado', 7.5, ARRAY['Criatividade', 'Ferramentas Adobe'], ARRAY['Experiência em motion'], 'Candidata promissora', 'Próxima etapa', 'Diretor de Arte', NOW() - INTERVAL '6 days');

-- Inserir entrevistas realizadas com feedback (reprovados)
INSERT INTO public.entrevistas (candidato_nome, vaga_id, vaga_titulo, tipo, data, hora_inicio, hora_fim, local, entrevistadores, etapa, status, feedback_resultado, feedback_nota, feedback_pontos_fortes, feedback_pontos_melhorar, feedback_comentarios, feedback_recomendacao, feedback_avaliado_por, feedback_avaliado_em) VALUES
  ('Bruno Carvalho', 'vaga-1', 'Operador de Gravação', 'presencial', CURRENT_DATE - INTERVAL '3 days', '09:00', '10:00', 'Sala de Reuniões 2', ARRAY['Carlos Supervisor'], 'Entrevista Técnica', 'realizada', 'reprovado', 5.0, ARRAY['Pontualidade'], ARRAY['Falta de experiência técnica', 'Comunicação'], 'Candidato não atende requisitos mínimos', 'Não prosseguir', 'Carlos Supervisor', NOW() - INTERVAL '3 days'),
  ('Thiago Nascimento', 'vaga-3', 'Vendedor Externo', 'telefone', CURRENT_DATE - INTERVAL '5 days', '15:00', '15:30', NULL, ARRAY['Maria Santos (RH)'], 'Triagem Telefônica', 'realizada', 'reprovado', 4.5, ARRAY['Disponibilidade imediata'], ARRAY['Expectativa salarial incompatível', 'Pouca experiência'], 'Não atende perfil', 'Dispensar', 'Maria Santos (RH)', NOW() - INTERVAL '5 days');

-- Inserir entrevista com resultado pendente
INSERT INTO public.entrevistas (candidato_nome, vaga_id, vaga_titulo, tipo, data, hora_inicio, hora_fim, local, entrevistadores, etapa, status, feedback_resultado, feedback_nota, feedback_pontos_fortes, feedback_pontos_melhorar, feedback_comentarios, feedback_recomendacao, feedback_avaliado_por, feedback_avaliado_em) VALUES
  ('Ricardo Santos', 'vaga-1', 'Operador de Gravação', 'presencial', CURRENT_DATE - INTERVAL '7 days', '14:00', '15:00', 'Sala de Reuniões 1', ARRAY['Carlos Supervisor', 'Maria Santos (RH)'], 'Entrevista Final', 'realizada', 'pendente', 7.0, ARRAY['Experiência na área'], ARRAY['Precisa de treinamento'], 'Aguardando decisão final', 'Em análise', 'Carlos Supervisor', NOW() - INTERVAL '7 days');