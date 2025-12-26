-- Audit Trail System
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('create', 'update', 'delete', 'view', 'export', 'login', 'logout')),
  resource_type TEXT NOT NULL,
  resource_id TEXT,
  old_data JSONB,
  new_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all logs" ON public.audit_logs FOR SELECT 
  USING (auth.uid() IN (SELECT user_id FROM public.user_roles ur JOIN public.roles r ON ur.role_id = r.id WHERE r.name = 'admin'));

-- Function to log actions
CREATE OR REPLACE FUNCTION log_audit_event(
  p_action TEXT,
  p_resource_type TEXT,
  p_resource_id TEXT DEFAULT NULL,
  p_old_data JSONB DEFAULT NULL,
  p_new_data JSONB DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO public.audit_logs (user_id, action, resource_type, resource_id, old_data, new_data, metadata)
  VALUES (auth.uid(), p_action, p_resource_type, p_resource_id, p_old_data, p_new_data, p_metadata)
  RETURNING id INTO v_log_id;
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger function for automatic audit logging
CREATE OR REPLACE FUNCTION audit_trigger_func() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    PERFORM log_audit_event('create', TG_TABLE_NAME, NEW.id::TEXT, NULL, to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    PERFORM log_audit_event('update', TG_TABLE_NAME, NEW.id::TEXT, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    PERFORM log_audit_event('delete', TG_TABLE_NAME, OLD.id::TEXT, to_jsonb(OLD), NULL);
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply triggers to critical tables (uncomment as needed)
-- CREATE TRIGGER audit_candidatos AFTER INSERT OR UPDATE OR DELETE ON public.candidatos FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
-- CREATE TRIGGER audit_vagas AFTER INSERT OR UPDATE OR DELETE ON public.vagas FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
