-- Create table for allowed countries (whitelist)
CREATE TABLE public.allowed_countries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  country_code CHAR(2) NOT NULL UNIQUE,
  country_name TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  added_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.allowed_countries ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can manage allowed countries"
  ON public.allowed_countries FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Authenticated users can view allowed countries"
  ON public.allowed_countries FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Create geo access logs table
CREATE TABLE public.geo_access_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  country_code CHAR(2),
  country_name TEXT,
  allowed BOOLEAN NOT NULL,
  user_id UUID,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.geo_access_logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can view geo access logs"
  ON public.geo_access_logs FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can insert geo access logs"
  ON public.geo_access_logs FOR INSERT
  WITH CHECK (true);

-- Insert Brazil as default allowed country
INSERT INTO public.allowed_countries (country_code, country_name) VALUES ('BR', 'Brasil');

-- Trigger for updated_at
CREATE TRIGGER update_allowed_countries_updated_at
  BEFORE UPDATE ON public.allowed_countries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();