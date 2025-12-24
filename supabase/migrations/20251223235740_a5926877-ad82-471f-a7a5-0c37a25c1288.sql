-- Rollback: Use supabase db reset or restore from backup
-- This migration can be reverted by dropping added objects

-- Adicionar policy UPDATE para bateria_provas_rel
CREATE POLICY "Usuários autenticados podem atualizar relações"
ON public.bateria_provas_rel
FOR UPDATE
USING (true);

-- Adicionar policy DELETE para candidatos_auth (apenas admin)
CREATE POLICY "Admins podem deletar candidatos_auth"
ON public.candidatos_auth
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Adicionar policy DELETE para resultados_provas (apenas admin)
CREATE POLICY "Admins podem deletar resultados_provas"
ON public.resultados_provas
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));