-- Tabela de Feature Flags
CREATE TABLE public.feature_flags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    enabled BOOLEAN DEFAULT FALSE,
    rules JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Feature flags are viewable by everyone" 
ON public.feature_flags FOR SELECT USING (true);

CREATE POLICY "Only admins can manage feature flags" 
ON public.feature_flags FOR ALL 
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Trigger para updated_at
CREATE TRIGGER update_feature_flags_updated_at
BEFORE UPDATE ON public.feature_flags
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir algumas flags iniciais
INSERT INTO public.feature_flags (name, description, enabled) VALUES 
('new-dashboard', 'Habilita o novo dashboard v2', false),
('ai-chat', 'Habilita o assistente de IA no chat', true),
('gamification-v2', 'Habilita sistema de recompensas avançado', true),
('whatsapp-integration', 'Habilita integração com Evolution API', true);
