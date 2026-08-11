-- Etapa 1: enums
CREATE TYPE public.senioridade_nivel AS ENUM ('estagio','junior','pleno','senior','staff','principal','lead');
CREATE TYPE public.nivel_idioma AS ENUM ('nenhum','basico','intermediario','avancado','fluente','nativo');
CREATE TYPE public.regime_contratacao AS ENUM ('clt','pj','ambos');
CREATE TYPE public.modalidade_trabalho AS ENUM ('remoto','hibrido','presencial');

-- Etapa 2: colunas tech em candidatos
ALTER TABLE public.candidatos
  ADD COLUMN senioridade public.senioridade_nivel,
  ADD COLUMN nivel_ingles public.nivel_idioma,
  ADD COLUMN pretensao_salarial numeric,
  ADD COLUMN pretensao_moeda text NOT NULL DEFAULT 'BRL',
  ADD COLUMN regime public.regime_contratacao,
  ADD COLUMN modalidade public.modalidade_trabalho,
  ADD COLUMN disponibilidade_dias integer,
  ADD COLUMN aberto_a_oportunidades boolean NOT NULL DEFAULT true;

CREATE INDEX idx_candidatos_senioridade ON public.candidatos (senioridade);
CREATE INDEX idx_candidatos_nivel_ingles ON public.candidatos (nivel_ingles);
CREATE INDEX idx_candidatos_pretensao ON public.candidatos (pretensao_salarial);
CREATE INDEX idx_candidatos_regime ON public.candidatos (regime);
CREATE INDEX idx_candidatos_modalidade ON public.candidatos (modalidade);
CREATE INDEX idx_candidatos_aberto ON public.candidatos (aberto_a_oportunidades);

-- Etapa 3: taxonomia de skills
CREATE TABLE public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  slug text NOT NULL UNIQUE,
  categoria text NOT NULL,
  aliases text[] NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.skills TO anon;
GRANT SELECT ON public.skills TO authenticated;
GRANT ALL ON public.skills TO service_role;

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "skills_select_public" ON public.skills
  FOR SELECT USING (true);
CREATE POLICY "skills_admin_manage" ON public.skills
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE INDEX idx_skills_categoria ON public.skills (categoria);
CREATE INDEX idx_skills_aliases ON public.skills USING GIN (aliases);

CREATE TRIGGER trg_skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Etapa 5: relação candidato_skills
CREATE TABLE public.candidato_skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_id uuid NOT NULL REFERENCES public.candidatos(id) ON DELETE CASCADE,
  skill_id uuid NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  nivel integer CHECK (nivel BETWEEN 1 AND 5),
  anos_experiencia numeric,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (candidato_id, skill_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.candidato_skills TO authenticated;
GRANT ALL ON public.candidato_skills TO service_role;

ALTER TABLE public.candidato_skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "candidato_skills_staff_select" ON public.candidato_skills
  FOR SELECT TO authenticated USING (public.is_hr_staff(auth.uid()));
CREATE POLICY "candidato_skills_staff_manage" ON public.candidato_skills
  FOR ALL TO authenticated
  USING (public.is_hr_staff(auth.uid()))
  WITH CHECK (public.is_hr_staff(auth.uid()));

CREATE INDEX idx_candidato_skills_candidato ON public.candidato_skills (candidato_id);
CREATE INDEX idx_candidato_skills_skill ON public.candidato_skills (skill_id);

CREATE TRIGGER trg_candidato_skills_updated_at
  BEFORE UPDATE ON public.candidato_skills
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();