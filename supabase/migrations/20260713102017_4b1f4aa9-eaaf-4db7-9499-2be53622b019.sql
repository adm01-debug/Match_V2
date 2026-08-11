-- Hardening: revoke EXECUTE from PUBLIC/anon on SECURITY DEFINER functions.
-- Grant EXECUTE to authenticated only where the function is legitimately called by end users.
-- Service-role always retains EXECUTE (bypasses privilege checks).

-- 1) Revoke public/anon access on all SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.is_hr_staff(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_permission(uuid, text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_roles(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_user_permissions(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.safe_update_gamification(integer, date) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.update_user_streak(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.add_user_xp(uuid, integer, text, text, numeric) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.award_xp(text, integer, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.calculate_level_from_xp(integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.apply_for_job(uuid, uuid, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.create_candidato_with_details(text, text, text, text, text[], jsonb, jsonb, text, text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_logs() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_login_attempts() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.log_etapa_change() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.notify_candidato_etapa_change() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_candidate_user() FROM PUBLIC, anon;

-- 2) Grant EXECUTE only to authenticated where end-user callable (via RLS or app RPC)
GRANT EXECUTE ON FUNCTION public.is_hr_staff(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_permission(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_roles(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_permissions(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.safe_update_gamification(integer, date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_user_streak(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_user_xp(uuid, integer, text, text, numeric) TO authenticated;
GRANT EXECUTE ON FUNCTION public.award_xp(text, integer, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.calculate_level_from_xp(integer) TO authenticated;
GRANT EXECUTE ON FUNCTION public.apply_for_job(uuid, uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_candidato_with_details(text, text, text, text, text[], jsonb, jsonb, text, text, text) TO authenticated;
-- check_rate_limit, cleanup_*, handle_new_*, update_updated_at_column, log_etapa_change, notify_candidato_etapa_change:
-- called only by triggers/edge functions with service_role — no authenticated grant needed.