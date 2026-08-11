
-- Hardening: revogar EXECUTE de anon/PUBLIC em funções SECURITY DEFINER internas.
-- Funções que já checam has_role/auth.uid() ganham defesa em profundidade adicional.

-- 1) Funções apenas para service_role (workers, triggers, jobs pg_cron):
REVOKE EXECUTE ON FUNCTION public.cleanup_expired_ai_cache() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_integration_events() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_logs() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.cleanup_old_login_attempts() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.recover_stuck_communication_retries(integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.mark_retry_result(uuid, boolean, text) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.claim_communication_retry_batch(integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enqueue_communication_retry(text, text, jsonb, text, text, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.add_user_xp(uuid, integer, text, text, numeric) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_user_streak(uuid) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.calculate_level_from_xp(integer) FROM PUBLIC, anon, authenticated;

-- 2) Funções admin-only (já checam has_role internamente, revogamos anon como defesa em profundidade):
REVOKE EXECUTE ON FUNCTION public.admin_list_audit_log(text, uuid, integer, integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_list_communication_retries(text, integer, integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_requeue_communication_retry(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_communication_retry_stats() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_integration_health_summary(integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.admin_email_delivery_sla(integer) FROM PUBLIC, anon;

-- 3) Funções para usuários autenticados (revogar anon):
REVOKE EXECUTE ON FUNCTION public.safe_update_gamification(integer, date) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.award_xp(text, integer, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.log_admin_action(text, text, text, jsonb) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.create_candidato_with_details(text, text, text, text, text[], jsonb, jsonb, text, text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.apply_for_job(uuid, uuid, text) FROM PUBLIC, anon;

-- 4) Trigger functions: revogar de todos (chamadas apenas pelo engine de triggers):
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_candidate_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.log_etapa_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.notify_candidato_etapa_change() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.prevent_audit_log_mutation() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- 5) Manter callable por anon: public_email_delivery_sla (usada por /health e /status públicos)
-- e helpers de RLS (has_role, has_permission, get_user_roles, get_user_permissions, is_hr_staff, is_not_deleted)
-- que precisam ser avaliados dentro de policies para usuários autenticados.
