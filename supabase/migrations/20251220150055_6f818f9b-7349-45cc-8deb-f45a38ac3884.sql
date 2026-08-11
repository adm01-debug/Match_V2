-- Rollback: Use supabase db reset or restore from backup
-- This migration can be reverted by dropping added objects

-- Criar tabela de indicações
CREATE TABLE public.indicacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  indicador_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  indicador_nome TEXT NOT NULL,
  indicador_email TEXT NOT NULL,
  candidato_nome TEXT NOT NULL,
  candidato_email TEXT NOT NULL,
  candidato_telefone TEXT,
  vaga_id UUID REFERENCES public.vagas(id) ON DELETE SET NULL,
  vaga_titulo TEXT NOT NULL,
  observacao TEXT,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_analise', 'aprovado', 'contratado', 'reprovado')),
  bonus NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.indicacoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários autenticados podem ver indicações"
ON public.indicacoes
FOR SELECT
USING (true);

CREATE POLICY "Usuários autenticados podem criar indicações"
ON public.indicacoes
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Usuários autenticados podem atualizar indicações"
ON public.indicacoes
FOR UPDATE
USING (true);

CREATE POLICY "Admins podem deletar indicações"
ON public.indicacoes
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Trigger para updated_at
CREATE TRIGGER update_indicacoes_updated_at
BEFORE UPDATE ON public.indicacoes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index para buscas
CREATE INDEX idx_indicacoes_status ON public.indicacoes(status);
CREATE INDEX idx_indicacoes_indicador ON public.indicacoes(indicador_user_id);