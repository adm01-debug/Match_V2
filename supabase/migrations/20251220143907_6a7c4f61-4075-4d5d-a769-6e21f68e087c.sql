-- Rollback: Use supabase db reset or restore from backup
-- This migration can be reverted by dropping added objects


-- Create candidatos_auth table to link candidates to auth users
CREATE TABLE public.candidatos_auth (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  candidato_id UUID REFERENCES public.candidatos(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Enable RLS
ALTER TABLE public.candidatos_auth ENABLE ROW LEVEL SECURITY;

-- Candidates can only see their own data
CREATE POLICY "Candidatos podem ver próprio perfil" 
ON public.candidatos_auth 
FOR SELECT 
USING (auth.uid() = user_id);

-- Candidates can update their own profile
CREATE POLICY "Candidatos podem atualizar próprio perfil" 
ON public.candidatos_auth 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Candidates can insert their own profile
CREATE POLICY "Candidatos podem inserir próprio perfil" 
ON public.candidatos_auth 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create candidaturas table for applications
CREATE TABLE public.candidaturas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  candidato_auth_id UUID NOT NULL REFERENCES public.candidatos_auth(id) ON DELETE CASCADE,
  vaga_id UUID NOT NULL REFERENCES public.vagas(id) ON DELETE CASCADE,
  processo_id UUID REFERENCES public.processos_seletivos(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  etapa_atual TEXT NOT NULL DEFAULT 'inscricao',
  data_candidatura TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  carta_apresentacao TEXT,
  curriculo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(candidato_auth_id, vaga_id)
);

-- Enable RLS
ALTER TABLE public.candidaturas ENABLE ROW LEVEL SECURITY;

-- Candidates can see their own applications
CREATE POLICY "Candidatos podem ver próprias candidaturas" 
ON public.candidaturas 
FOR SELECT 
USING (candidato_auth_id IN (SELECT id FROM public.candidatos_auth WHERE user_id = auth.uid()));

-- Candidates can create applications
CREATE POLICY "Candidatos podem criar candidaturas" 
ON public.candidaturas 
FOR INSERT 
WITH CHECK (candidato_auth_id IN (SELECT id FROM public.candidatos_auth WHERE user_id = auth.uid()));

-- Candidates can update their applications
CREATE POLICY "Candidatos podem atualizar candidaturas" 
ON public.candidaturas 
FOR UPDATE 
USING (candidato_auth_id IN (SELECT id FROM public.candidatos_auth WHERE user_id = auth.uid()));

-- RH can view all applications
CREATE POLICY "RH pode ver todas candidaturas" 
ON public.candidaturas 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid()));

-- Create function to handle new candidate user
CREATE OR REPLACE FUNCTION public.handle_new_candidate_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Only create candidatos_auth if user is registering as candidate
  IF NEW.raw_user_meta_data ->> 'user_type' = 'candidato' THEN
    INSERT INTO public.candidatos_auth (user_id, nome, email, telefone)
    VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data ->> 'nome', NEW.email),
      NEW.email,
      NEW.raw_user_meta_data ->> 'telefone'
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for new candidate users
CREATE TRIGGER on_auth_user_created_candidate
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_candidate_user();

-- Allow candidates to view public job listings
CREATE POLICY "Qualquer pessoa pode ver vagas publicadas" 
ON public.vagas 
FOR SELECT 
USING (status = 'publicada');

-- Create updated_at trigger for new tables
CREATE TRIGGER update_candidatos_auth_updated_at
BEFORE UPDATE ON public.candidatos_auth
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_candidaturas_updated_at
BEFORE UPDATE ON public.candidaturas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
