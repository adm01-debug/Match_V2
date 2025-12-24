-- Rollback: Use supabase db reset or restore from backup
-- This migration can be reverted by dropping added objects

-- Create processos_seletivos table
CREATE TABLE public.processos_seletivos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vaga_id UUID REFERENCES public.vagas(id) ON DELETE CASCADE,
  vaga_titulo TEXT NOT NULL,
  candidato_id UUID REFERENCES public.candidatos(id) ON DELETE CASCADE,
  candidato_nome TEXT NOT NULL,
  candidato_foto TEXT,
  etapa_atual TEXT NOT NULL DEFAULT 'novo',
  status TEXT NOT NULL DEFAULT 'em_andamento',
  match_score INTEGER DEFAULT 0,
  origem TEXT DEFAULT 'portal',
  data_inscricao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_ultima_movimentacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  dias_na_etapa INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.processos_seletivos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Usuários autenticados podem ver processos" 
ON public.processos_seletivos 
FOR SELECT 
USING (true);

CREATE POLICY "Usuários autenticados podem criar processos" 
ON public.processos_seletivos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar processos" 
ON public.processos_seletivos 
FOR UPDATE 
USING (true);

CREATE POLICY "Usuários autenticados podem deletar processos" 
ON public.processos_seletivos 
FOR DELETE 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_processos_seletivos_updated_at
BEFORE UPDATE ON public.processos_seletivos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.processos_seletivos;

-- Insert sample data
INSERT INTO public.processos_seletivos (vaga_titulo, candidato_nome, etapa_atual, status, match_score, origem, data_inscricao, dias_na_etapa)
VALUES 
  -- Novos
  ('Operador de Gravação', 'João Mendes', 'novo', 'em_andamento', 92, 'indeed', now() - interval '2 days', 2),
  ('Operador de Gravação', 'Maria Lima', 'novo', 'em_andamento', 88, 'linkedin', now() - interval '2 days', 2),
  ('Operador de Gravação', 'Paulo Vieira', 'novo', 'em_andamento', 75, 'portal', now() - interval '1 day', 1),
  ('Designer Gráfico', 'Ana Costa', 'novo', 'em_andamento', 90, 'linkedin', now() - interval '3 days', 3),
  
  -- Em Triagem
  ('Operador de Gravação', 'Carlos Eduardo', 'em_triagem', 'em_andamento', 90, 'indeed', now() - interval '6 days', 3),
  ('Operador de Gravação', 'Felipe Rodrigues', 'em_triagem', 'em_andamento', 85, 'catho', now() - interval '5 days', 3),
  ('Designer Gráfico', 'Amanda Garcia', 'em_triagem', 'em_andamento', 82, 'indicacao', now() - interval '4 days', 2),
  
  -- Pré-seleção
  ('Operador de Gravação', 'Ana Paula Oliveira', 'pre_selecao', 'em_andamento', 85, 'linkedin', now() - interval '8 days', 4),
  ('Operador de Gravação', 'Bruno Costa', 'pre_selecao', 'em_andamento', 80, 'portal', now() - interval '7 days', 3),
  ('Vendedor Externo', 'Renata Ferreira', 'pre_selecao', 'em_andamento', 78, 'indeed', now() - interval '6 days', 2),
  
  -- Entrevista RH
  ('Operador de Gravação', 'Roberto Santos', 'entrevista_rh', 'em_andamento', 88, 'indicacao', now() - interval '11 days', 5),
  ('Operador de Gravação', 'Carla Mendes', 'entrevista_rh', 'em_andamento', 86, 'linkedin', now() - interval '10 days', 4),
  ('Designer Gráfico', 'Lucas Almeida', 'entrevista_rh', 'em_andamento', 91, 'linkedin', now() - interval '9 days', 3),
  
  -- Teste Técnico
  ('Operador de Gravação', 'Pedro Martins', 'teste_tecnico', 'em_andamento', 82, 'indeed', now() - interval '15 days', 7),
  ('Operador de Gravação', 'Juliana Silva', 'teste_tecnico', 'em_andamento', 79, 'catho', now() - interval '14 days', 6),
  
  -- Entrevista Gestor
  ('Operador de Gravação', 'Marcos Antonio', 'entrevista_gestor', 'em_andamento', 84, 'indicacao', now() - interval '18 days', 8),
  ('Vendedor Externo', 'Fernanda Souza', 'entrevista_gestor', 'em_andamento', 87, 'linkedin', now() - interval '17 days', 7),
  
  -- Entrevista Final
  ('Operador de Gravação', 'Lucas Ferreira', 'entrevista_final', 'em_andamento', 95, 'linkedin', now() - interval '21 days', 10),
  
  -- Aprovado
  ('Operador de Gravação', 'Gustavo Pereira', 'aprovado', 'aprovado', 94, 'portal', now() - interval '26 days', 6),
  
  -- Proposta Enviada
  ('Designer Gráfico', 'Camila Ribeiro', 'proposta_enviada', 'em_andamento', 93, 'indicacao', now() - interval '31 days', 4),
  
  -- Contratado
  ('Operador de Gravação', 'Ricardo Oliveira', 'contratado', 'contratado', 96, 'indeed', now() - interval '45 days', 15),
  
  -- Reprovado
  ('Operador de Gravação', 'Sandra Martins', 'reprovado', 'reprovado', 65, 'catho', now() - interval '36 days', 26),
  ('Operador de Gravação', 'Diego Santos', 'reprovado', 'reprovado', 58, 'portal', now() - interval '34 days', 24),
  
  -- Banco de Talentos
  ('Operador de Gravação', 'Patricia Lima', 'banco_talentos', 'em_andamento', 72, 'linkedin', now() - interval '41 days', 21);