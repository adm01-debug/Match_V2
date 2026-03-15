-- Notifications table for candidate portal
CREATE TABLE IF NOT EXISTS public.notificacoes_candidato (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidato_auth_id uuid NOT NULL REFERENCES public.candidatos_auth(id) ON DELETE CASCADE,
  titulo text NOT NULL,
  mensagem text NOT NULL,
  tipo text NOT NULL DEFAULT 'info',
  lida boolean NOT NULL DEFAULT false,
  link text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.notificacoes_candidato ENABLE ROW LEVEL SECURITY;

-- Candidates can only see their own notifications
CREATE POLICY "Candidates view own notifications"
  ON public.notificacoes_candidato FOR SELECT
  TO authenticated
  USING (candidato_auth_id IN (
    SELECT id FROM public.candidatos_auth WHERE user_id = auth.uid()
  ));

-- Candidates can update (mark as read) their own notifications
CREATE POLICY "Candidates update own notifications"
  ON public.notificacoes_candidato FOR UPDATE
  TO authenticated
  USING (candidato_auth_id IN (
    SELECT id FROM public.candidatos_auth WHERE user_id = auth.uid()
  ));

-- HR staff can insert notifications
CREATE POLICY "HR insert candidate notifications"
  ON public.notificacoes_candidato FOR INSERT
  TO authenticated
  WITH CHECK (is_hr_staff(auth.uid()));

-- Service role can insert (for triggers)
CREATE POLICY "Service role insert notifications"
  ON public.notificacoes_candidato FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notificacoes_candidato;

-- Auto-notify candidate when etapa changes
CREATE OR REPLACE FUNCTION public.notify_candidato_etapa_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_candidato_auth_id uuid;
BEGIN
  IF OLD.etapa_atual IS DISTINCT FROM NEW.etapa_atual THEN
    -- Find candidato_auth linked to this processo's candidato
    SELECT ca.id INTO v_candidato_auth_id
    FROM candidatos_auth ca
    WHERE ca.candidato_id = NEW.candidato_id;
    
    IF v_candidato_auth_id IS NOT NULL THEN
      INSERT INTO notificacoes_candidato (candidato_auth_id, titulo, mensagem, tipo, link)
      VALUES (
        v_candidato_auth_id,
        'Atualização no seu processo',
        'Seu processo para "' || NEW.vaga_titulo || '" avançou para uma nova etapa.',
        'etapa',
        '/portal/dashboard'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_candidato_etapa
  AFTER UPDATE ON public.processos_seletivos
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_candidato_etapa_change();