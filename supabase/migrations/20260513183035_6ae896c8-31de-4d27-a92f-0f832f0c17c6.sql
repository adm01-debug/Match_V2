-- Ajustando search_path para segurança
ALTER FUNCTION public.has_role(uuid, public.app_role) SET search_path = public;
ALTER FUNCTION public.has_permission(uuid, text, text) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.handle_new_candidate_user() SET search_path = public;
ALTER FUNCTION public.award_xp(text, integer, text) SET search_path = public;
ALTER FUNCTION public.get_user_roles(uuid) SET search_path = public;
ALTER FUNCTION public.get_user_permissions(uuid) SET search_path = public;
ALTER FUNCTION public.is_hr_staff(uuid) SET search_path = public;
ALTER FUNCTION public.add_user_xp(uuid, integer, text, text, numeric) SET search_path = public;

-- Revogando permissões de execução pública (anon) para funções críticas
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.has_permission(uuid, text, text) FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.award_xp(text, integer, text) FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.add_user_xp(uuid, integer, text, text, numeric) FROM public, anon;
