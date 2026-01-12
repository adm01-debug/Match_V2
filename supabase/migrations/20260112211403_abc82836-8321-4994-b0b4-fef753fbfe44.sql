-- Tabela para armazenar resultados das avaliações comportamentais
CREATE TABLE public.behavioral_assessment_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidato_id UUID REFERENCES public.candidatos(id) ON DELETE CASCADE,
  processo_id UUID REFERENCES public.processos_seletivos(id) ON DELETE SET NULL,
  tool_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  answers JSONB NOT NULL DEFAULT '{}',
  results JSONB NOT NULL DEFAULT '{}',
  primary_result TEXT,
  secondary_result TEXT,
  score NUMERIC(5,2),
  time_spent INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.behavioral_assessment_results ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Authenticated users can view behavioral results"
  ON public.behavioral_assessment_results
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert behavioral results"
  ON public.behavioral_assessment_results
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update own behavioral results"
  ON public.behavioral_assessment_results
  FOR UPDATE
  TO authenticated
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_behavioral_assessment_results_updated_at
  BEFORE UPDATE ON public.behavioral_assessment_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_behavioral_results_candidato ON public.behavioral_assessment_results(candidato_id);
CREATE INDEX idx_behavioral_results_processo ON public.behavioral_assessment_results(processo_id);
CREATE INDEX idx_behavioral_results_tool ON public.behavioral_assessment_results(tool_id);

-- Habilitar realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.behavioral_assessment_results;