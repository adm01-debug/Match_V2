-- Enable realtime for match_scores table to support push notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.match_scores;