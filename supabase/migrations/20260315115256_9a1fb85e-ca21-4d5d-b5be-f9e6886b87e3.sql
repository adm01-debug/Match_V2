
-- Create missing avaliacoes table referenced by useAvaliacoes hook
CREATE TABLE IF NOT EXISTS public.avaliacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  processo_id uuid REFERENCES public.processos_seletivos(id) ON DELETE CASCADE,
  avaliador_id uuid,
  etapa text NOT NULL DEFAULT 'entrevista_rh',
  parecer text NOT NULL DEFAULT 'em_duvida',
  notas_tecnicas jsonb DEFAULT '[]'::jsonb,
  notas_comportamentais jsonb DEFAULT '[]'::jsonb,
  nota_geral numeric,
  pontos_fortes text,
  pontos_desenvolvimento text,
  observacoes_gerais text,
  recomendacao text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

-- RLS: HR staff can manage
CREATE POLICY "HR staff can manage avaliacoes" ON public.avaliacoes
FOR ALL TO authenticated USING (is_hr_staff(auth.uid())) WITH CHECK (is_hr_staff(auth.uid()));

-- RLS: Authenticated can view own evaluations
CREATE POLICY "Users can view own avaliacoes" ON public.avaliacoes
FOR SELECT TO authenticated USING (avaliador_id = auth.uid());

-- Auto-update updated_at
CREATE TRIGGER update_avaliacoes_updated_at
  BEFORE UPDATE ON public.avaliacoes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
