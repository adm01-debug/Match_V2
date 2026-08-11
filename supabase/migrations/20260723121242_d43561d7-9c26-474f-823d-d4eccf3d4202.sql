ALTER TABLE public.empresa_branding
  ADD COLUMN IF NOT EXISTS whatsapp_recrutamento TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_mensagem_padrao TEXT DEFAULT 'Olá! Tenho interesse na vaga {{vaga}} e gostaria de me candidatar.';