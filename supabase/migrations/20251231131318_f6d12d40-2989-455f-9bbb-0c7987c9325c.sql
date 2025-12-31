-- Create table for password reset requests requiring approval
CREATE TABLE public.password_reset_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  user_name TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'expired')),
  reason TEXT,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by UUID,
  review_notes TEXT,
  reset_token TEXT,
  token_expires_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.password_reset_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can manage all reset requests"
  ON public.password_reset_requests FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view own reset requests"
  ON public.password_reset_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create reset requests"
  ON public.password_reset_requests FOR INSERT
  WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_password_reset_requests_updated_at
  BEFORE UPDATE ON public.password_reset_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for faster queries
CREATE INDEX idx_password_reset_requests_status ON public.password_reset_requests(status);
CREATE INDEX idx_password_reset_requests_user_email ON public.password_reset_requests(user_email);