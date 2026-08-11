-- Rollback: Use supabase db reset or restore from backup
-- This migration can be reverted by dropping added objects

-- Corrigir search_path da função
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;