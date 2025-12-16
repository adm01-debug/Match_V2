-- Criar tabela de histórico de comunicações
CREATE TABLE public.comunicacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id UUID NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  template_nome TEXT NOT NULL,
  template_etapa TEXT NOT NULL,
  assunto TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  enviado_por UUID REFERENCES auth.users(id),
  enviado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.comunicacoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Permitir leitura de comunicacoes"
ON public.comunicacoes
FOR SELECT
USING (true);

CREATE POLICY "Permitir inserção de comunicacoes"
ON public.comunicacoes
FOR INSERT
WITH CHECK (true);

-- Índice para busca por candidato
CREATE INDEX idx_comunicacoes_candidato_id ON public.comunicacoes(candidato_id);
CREATE INDEX idx_comunicacoes_enviado_em ON public.comunicacoes(enviado_em DESC);