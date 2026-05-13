-- Tabela de Departamentos
CREATE TABLE public.departamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT UNIQUE NOT NULL,
    descricao TEXT,
    gestor_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.departamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Departamentos viewable by everyone" ON public.departamentos FOR SELECT USING (true);
CREATE POLICY "Admins can manage departamentos" ON public.departamentos FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Adicionar departamento_id em profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS departamento_id UUID REFERENCES public.departamentos(id);

-- Adicionar departamento_id em vagas
ALTER TABLE public.vagas ADD COLUMN IF NOT EXISTS departamento_id UUID REFERENCES public.departamentos(id);

-- Criar alguns departamentos iniciais
INSERT INTO public.departamentos (nome, descricao) VALUES 
('Tecnologia', 'Desenvolvimento, Infraestrutura e Dados'),
('Recursos Humanos', 'RH, Recrutamento e Seleção'),
('Comercial', 'Vendas e Sucesso do Cliente'),
('Financeiro', 'Contabilidade e Financeiro');

-- Atualizar RLS de Vagas para Gestores
-- Supomos que a política existente para SELECT em vagas permita leitura. 
-- Vamos adicionar uma política específica ou atualizar a existente para restringir gestores.

DROP POLICY IF EXISTS "Gestores can view their department jobs" ON public.vagas;
CREATE POLICY "Gestores can view their department jobs" 
ON public.vagas 
FOR SELECT 
USING (
    public.has_role(auth.uid(), 'gestor') AND 
    departamento_id = (SELECT departamento_id FROM public.profiles WHERE user_id = auth.uid())
);
