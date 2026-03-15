
-- Fix: Drop existing policy before creating
DROP POLICY IF EXISTS "Users can update own 2FA" ON public.user_2fa;

CREATE POLICY "Users can update own 2FA" ON public.user_2fa
FOR UPDATE TO authenticated USING (auth.uid() = user_id);
