
-- Create storage bucket for resumes/CVs
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'curriculos', 
  'curriculos', 
  false, 
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Allow authenticated candidates to upload their own resumes
CREATE POLICY "Candidatos podem fazer upload de curriculos"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'curriculos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow candidates to view their own resumes
CREATE POLICY "Candidatos podem ver seus curriculos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'curriculos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow candidates to delete their own resumes
CREATE POLICY "Candidatos podem deletar seus curriculos"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'curriculos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow candidates to update their own resumes
CREATE POLICY "Candidatos podem atualizar seus curriculos"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'curriculos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow RH users to view all resumes
CREATE POLICY "RH pode ver todos curriculos"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'curriculos' 
  AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid())
);

-- Add curriculo_url column to candidatos_auth if not exists
ALTER TABLE public.candidatos_auth 
ADD COLUMN IF NOT EXISTS curriculo_url TEXT,
ADD COLUMN IF NOT EXISTS curriculo_nome TEXT;
