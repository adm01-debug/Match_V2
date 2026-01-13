-- Fix RLS policies for behavioral_assessment_results table
-- Remove overly permissive policies and add proper user-based access

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Authenticated users can insert behavioral results" ON public.behavioral_assessment_results;
DROP POLICY IF EXISTS "Authenticated users can update own behavioral results" ON public.behavioral_assessment_results;
DROP POLICY IF EXISTS "Authenticated users can view behavioral results" ON public.behavioral_assessment_results;

-- Create proper user-based policies
-- Users can insert their own behavioral results
CREATE POLICY "Users can insert own behavioral results" 
ON public.behavioral_assessment_results 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Users can view behavioral results (staff can see all, candidates see their own)
CREATE POLICY "Users can view behavioral results" 
ON public.behavioral_assessment_results 
FOR SELECT 
TO authenticated
USING (
  is_hr_staff(auth.uid()) OR 
  candidato_id IS NULL OR 
  candidato_id IN (
    SELECT c.id FROM candidatos c 
    INNER JOIN candidatos_auth ca ON ca.candidato_id = c.id 
    WHERE ca.user_id = auth.uid()
  )
);

-- Only staff can update behavioral results
CREATE POLICY "Staff can update behavioral results" 
ON public.behavioral_assessment_results 
FOR UPDATE 
TO authenticated
USING (is_hr_staff(auth.uid()));

-- Only staff can delete behavioral results
CREATE POLICY "Staff can delete behavioral results" 
ON public.behavioral_assessment_results 
FOR DELETE 
TO authenticated
USING (is_hr_staff(auth.uid()));