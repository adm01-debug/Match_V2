-- Rollback: Use supabase db reset or restore from backup
-- This migration can be reverted by dropping added objects

-- Enable realtime for entrevistas table
ALTER PUBLICATION supabase_realtime ADD TABLE public.entrevistas;