-- Rollback: Use supabase db reset or restore from backup
-- This migration can be reverted by dropping added objects

-- Enable realtime for match_scores table to support push notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.match_scores;