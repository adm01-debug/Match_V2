# 10 · ACESSO E SEGURANÇA — quem pode o quê

> Gerado automaticamente por AI Context Sync v1.3.2 · commit `50668aec3b` · branch `main` · 2026-11-13 09:59 UTC
> Não edite à mão — regras humanas vão em `manual/`.

## Perfis / roles identificados

`admin`, `conformidade`, `denied`, `dominancia`, `estabilidade`, `gestor`, `granted`, `influencia`, `r`, `rh`, `role`

- Tabelas de perfil/permissão: `user_roles`, `tenant_members`, `roles`, `permissions`, `role_permissions`, `talent_pool_members`, `perfil_valores`
- Colunas de perfil: `profiles.role` (TEXT DEFAULT 'recrutador'), `user_roles.role` (Database["public"]["Enums"]["app_role"] not null), `tenant_members.role` (TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer'))), `tenant_invites.role` (TEXT DEFAULT 'member'), `role_permissions.role` (app_role NOT NULL), `tenant_invitations.role` (TEXT DEFAULT 'member')
- Claims do JWT usados em políticas/funções: nenhum
- Funções usadas dentro de políticas RLS (a regra real está no corpo delas — veja `06`): `has_role`, `is_hr_staff`

## Matriz tabela × operação → quem pode (derivada das políticas RLS)

| Tabela | RLS | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|---|
| `admin_audit_log` | enabled | authenticated: public.has_role(auth.uid(), 'admin') | — | authenticated: false | authenticated: false |
| `ai_cache` | enabled | service_role: true | service_role: true | service_role: true | service_role: true |
| `allowed_countries` | enabled | public: has_role(auth.uid(), 'admin'::app_role)<br>public: auth.uid() IS NOT NULL | public: has_role(auth.uid(), 'admin'::app_role) | public: has_role(auth.uid(), 'admin'::app_role) | public: has_role(auth.uid(), 'admin'::app_role) |
| `allowed_ips` | enabled | public: is_active = true<br>public: has_role(auth.uid(), 'admin')<br>authenticated: is_hr_staff(auth.uid()) | public: has_role(auth.uid(), 'admin') | public: has_role(auth.uid(), 'admin') | public: has_role(auth.uid(), 'admin') |
| `assessment_questoes` | enabled | authenticated: public.is_hr_staff(auth.uid())<br>authenticated: is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) |
| `assessment_respostas` | enabled | authenticated: public.is_hr_staff(auth.uid())<br>authenticated: public.is_hr_staff(auth.uid()) OR candidato_id IN ( SELECT c.id FROM candidatos c JOIN candidatos_auth ca ON ca.candidato_id  | authenticated: public.is_hr_staff(auth.uid())<br>authenticated: is_hr_staff(auth.uid()) OR candidato_id IN ( SELECT c.id FROM candidatos c JOIN candidatos_auth ca ON ca.candidato_id = c.id  | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) |
| `assessments` | enabled | authenticated: public.is_hr_staff(auth.uid())<br>authenticated: true | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) |
| `audit_logs` | enabled | public: true<br>public: auth.uid() IN (SELECT user_id FROM public.user_roles ur JOIN public.roles r ON ur.role_id = r.id WHERE r.name = 'admin') | — | — | — |
| `avaliacoes` | enabled | public: true<br>authenticated: true<br>authenticated: is_hr_staff(auth.uid())<br>authenticated: avaliador_id = auth.uid() | public: true<br>authenticated: true<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>authenticated: true<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>authenticated: is_hr_staff(auth.uid()) |
| `avaliacoes_comportamentais_resultados` | enabled | public: public.is_hr_staff(auth.uid()) | public: public.is_hr_staff(auth.uid()) | public: public.is_hr_staff(auth.uid()) | public: public.is_hr_staff(auth.uid()) |
| `bateria_provas_rel` | enabled | authenticated: true | authenticated: is_hr_staff(auth.uid()) | authenticated: is_hr_staff(auth.uid()) | authenticated: has_role(auth.uid(), 'admin') |
| `baterias_provas` | enabled | authenticated: true | authenticated: is_hr_staff(auth.uid()) | authenticated: is_hr_staff(auth.uid()) | authenticated: has_role(auth.uid(), 'admin') |
| `behavioral_assessment_results` | enabled | authenticated: is_hr_staff(auth.uid()) OR candidato_id IN ( SELECT c.id FROM candidatos c JOIN candidatos_auth ca ON ca.candidato_id = c.id  | authenticated: is_hr_staff(auth.uid()) | authenticated: is_hr_staff(auth.uid()) | authenticated: is_hr_staff(auth.uid()) |
| `blocked_ips` | enabled | public: has_role(auth.uid(), 'admin') | public: has_role(auth.uid(), 'admin') | public: has_role(auth.uid(), 'admin') | public: has_role(auth.uid(), 'admin') |
| `candidate_tag_assignments` | enabled | public: true<br>public: true | public: true | public: true | public: true |
| `candidate_tags` | enabled | public: true<br>public: true | public: true | public: true | public: true |
| `candidato_skills` | enabled | authenticated: public.is_hr_staff(auth.uid())<br>authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) |
| `candidatos` | enabled | public: true<br>authenticated: EXISTS ( SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'recruiter', 'manager') ) OR id IN ( SELEC<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>authenticated: has_role(auth.uid(), 'admin') |
| `candidatos_auth` | enabled | public: auth.uid() = user_id | public: auth.uid() = user_id | public: auth.uid() = user_id | public: public.has_role(auth.uid(), 'admin') |
| `candidaturas` | enabled | public: candidato_auth_id IN (SELECT id FROM public.candidatos_auth WHERE user_id = auth.uid())<br>authenticated: public.is_hr_staff(auth.uid()) | public: candidato_auth_id IN (SELECT id FROM public.candidatos_auth WHERE user_id = auth.uid()) | public: candidato_auth_id IN (SELECT id FROM public.candidatos_auth WHERE user_id = auth.uid()) | — |
| `cognitive_items` | enabled | authenticated: public.is_hr_staff(auth.uid())<br>service_role: true | authenticated: public.is_hr_staff(auth.uid())<br>service_role: true | authenticated: public.is_hr_staff(auth.uid())<br>service_role: true | authenticated: public.is_hr_staff(auth.uid())<br>service_role: true |
| `cognitive_responses` | enabled | authenticated: public.is_hr_staff(auth.uid()) OR EXISTS ( SELECT 1 FROM public.cognitive_sessions s WHERE s.id = cognitive_responses.session<br>service_role: true | authenticated: public.is_hr_staff(auth.uid()) OR EXISTS ( SELECT 1 FROM public.cognitive_sessions s WHERE s.id = cognitive_responses.session<br>service_role: true | authenticated: public.is_hr_staff(auth.uid()) OR EXISTS ( SELECT 1 FROM public.cognitive_sessions s WHERE s.id = cognitive_responses.session<br>service_role: true | service_role: true |
| `cognitive_sessions` | enabled | authenticated: public.is_hr_staff(auth.uid()) OR user_id = auth.uid()<br>service_role: true | authenticated: public.is_hr_staff(auth.uid()) OR user_id = auth.uid()<br>service_role: true | authenticated: public.is_hr_staff(auth.uid()) OR user_id = auth.uid()<br>service_role: true | service_role: true |
| `communication_retry_queue` | enabled | service_role: true | service_role: true | service_role: true | service_role: true |
| `comparativos_candidatos` | enabled | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) |
| `competencias` | enabled | authenticated: public.is_hr_staff(auth.uid())<br>authenticated: is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) |
| `comunicacoes` | enabled | authenticated: EXISTS ( SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'recruiter') ) OR candidato_id IN ( SELECT<br>authenticated: public.is_hr_staff(auth.uid()) | authenticated: is_hr_staff(auth.uid()) | — | — |
| `criterios_selecao` | enabled | authenticated: public.is_hr_staff(auth.uid())<br>authenticated: is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) |
| `data_access_logs` | enabled | public: auth.uid() = user_id | — | — | — |
| `data_deletion_requests` | enabled | public: auth.uid() = user_id | public: auth.uid() = user_id | — | — |
| `departamentos` | enabled | public: true<br>public: public.has_role(auth.uid(), 'admin') | public: public.has_role(auth.uid(), 'admin') | public: public.has_role(auth.uid(), 'admin') | public: public.has_role(auth.uid(), 'admin') |
| `documentos_candidatos` | enabled | authenticated: is_hr_staff(auth.uid())<br>authenticated: is_hr_staff(auth.uid())<br>authenticated: candidato_id IN (SELECT c.id FROM candidatos c JOIN candidatos_auth ca ON ca.candidato_id = c.id WHERE ca.user_id = auth.uid( | authenticated: is_hr_staff(auth.uid())<br>authenticated: candidato_id IN (SELECT c.id FROM candidatos c JOIN candidatos_auth ca ON ca.candidato_id = c.id WHERE ca.user_id = auth.uid( | authenticated: is_hr_staff(auth.uid()) | authenticated: is_hr_staff(auth.uid()) |
| `email_templates` | enabled | public: true<br>authenticated: is_hr_staff(auth.uid())<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>authenticated: is_hr_staff(auth.uid()) |
| `empresa_branding` | enabled | public: ativo = true<br>authenticated: public.has_role(auth.uid(), 'admin') | authenticated: public.has_role(auth.uid(), 'admin') | authenticated: public.has_role(auth.uid(), 'admin') | authenticated: public.has_role(auth.uid(), 'admin') |
| `entity_versions` | enabled | public: true | public: auth.uid() = changed_by OR changed_by IS NULL | — | — |
| `entrevista_respostas` | enabled | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) |
| `entrevistas` | enabled | public: true<br>public: true<br>authenticated: EXISTS ( SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'recruiter', 'manager') ) OR processo_sele<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>public: true<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>public: true<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>public: true<br>authenticated: has_role(auth.uid(), 'admin') |
| `feature_flags` | enabled | public: true<br>public: public.has_role(auth.uid(), 'admin') | public: public.has_role(auth.uid(), 'admin') | public: public.has_role(auth.uid(), 'admin') | public: public.has_role(auth.uid(), 'admin') |
| `geo_access_logs` | enabled | public: has_role(auth.uid(), 'admin'::app_role) | service_role: true | — | — |
| `historico_etapas` | enabled | public: true<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>service_role: true | — | — |
| `hunter_leads` | enabled | authenticated: auth.uid() = recrutador_id OR public.is_hr_staff(auth.uid()) | authenticated: auth.uid() = recrutador_id OR public.is_hr_staff(auth.uid()) | authenticated: auth.uid() = recrutador_id OR public.is_hr_staff(auth.uid()) | authenticated: auth.uid() = recrutador_id OR public.is_hr_staff(auth.uid()) |
| `indicacoes` | enabled | authenticated: EXISTS ( SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'recruiter') ) OR indicador_email = (SELEC<br>authenticated: public.is_hr_staff(auth.uid()) | authenticated: is_hr_staff(auth.uid()) | authenticated: is_hr_staff(auth.uid()) | public: has_role(auth.uid(), 'admin') |
| `integration_health_events` | enabled | service_role: true | service_role: true | service_role: true | service_role: true |
| `ip_access_logs` | enabled | public: EXISTS ( SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin') )<br>public: has_role(auth.uid(), 'admin') | public: true<br>service_role: true | — | — |
| `login_attempts` | enabled | authenticated: public.has_role(auth.uid(), 'admin')<br>service_role: true | service_role: true | service_role: true | service_role: true |
| `match_scores` | enabled | authenticated: public.is_hr_staff(auth.uid()) | authenticated: is_hr_staff(auth.uid()) | — | — |
| `notas_candidatos` | enabled | authenticated: is_hr_staff(auth.uid())<br>authenticated: is_hr_staff(auth.uid()) | authenticated: is_hr_staff(auth.uid()) | authenticated: is_hr_staff(auth.uid()) | authenticated: is_hr_staff(auth.uid()) |
| `notificacoes_candidato` | enabled | authenticated: candidato_auth_id IN ( SELECT id FROM public.candidatos_auth WHERE user_id = auth.uid() ) | authenticated: is_hr_staff(auth.uid())<br>service_role: true | authenticated: candidato_auth_id IN ( SELECT id FROM public.candidatos_auth WHERE user_id = auth.uid() ) | — |
| `notifications` | enabled | public: auth.uid() = user_id | service_role: true | public: auth.uid() = user_id | public: auth.uid() = user_id |
| `password_reset_requests` | enabled | public: has_role(auth.uid(), 'admin'::app_role)<br>public: auth.uid() = user_id<br>service_role: true | public: has_role(auth.uid(), 'admin'::app_role)<br>authenticated: auth.uid() = user_id<br>service_role: true | public: has_role(auth.uid(), 'admin'::app_role)<br>service_role: true | public: has_role(auth.uid(), 'admin'::app_role)<br>service_role: true |
| `password_reset_tokens` | enabled | authenticated: auth.uid() = user_id<br>service_role: true | service_role: true | service_role: true | service_role: true |
| `perfil_valores` | enabled | authenticated: public.is_hr_staff(auth.uid())<br>authenticated: is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) |
| `perfis_cargo` | enabled | authenticated: public.is_hr_staff(auth.uid())<br>authenticated: is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) |
| `perfis_comportamentais_empresa` | enabled | public: public.is_hr_staff(auth.uid()) | public: public.is_hr_staff(auth.uid()) | public: public.is_hr_staff(auth.uid()) | public: public.is_hr_staff(auth.uid()) |
| `permissions` | enabled | public: true<br>authenticated: true<br>public: true<br>public: auth.uid() IS NOT NULL<br>public: has_role(auth.uid(), 'admin') | public: has_role(auth.uid(), 'admin') | public: has_role(auth.uid(), 'admin') | public: has_role(auth.uid(), 'admin') |
| `processos_seletivos` | enabled | public: true<br>authenticated: EXISTS ( SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'recruiter', 'manager') )<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>authenticated: has_role(auth.uid(), 'admin') |
| `profiles` | enabled | public: auth.uid() = user_id<br>public: public.has_role(auth.uid(), 'admin') | public: auth.uid() = user_id | public: auth.uid() = user_id | — |
| `propostas` | enabled | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) AND criado_por = auth.uid() | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.has_role(auth.uid(), 'admin') |
| `propostas_eventos` | enabled | authenticated: public.is_hr_staff(auth.uid()) | — | — | — |
| `provas` | enabled | public: true<br>authenticated: ativo = true OR EXISTS ( SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'recruiter') )<br>authenticated: true | public: true<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>authenticated: has_role(auth.uid(), 'admin') |
| `questoes` | enabled | authenticated: public.is_hr_staff(auth.uid()) | authenticated: is_hr_staff(auth.uid()) | authenticated: is_hr_staff(auth.uid()) | authenticated: has_role(auth.uid(), 'admin') |
| `rate_limit_logs` | enabled | public: has_role(auth.uid(), 'admin') | service_role: true | — | — |
| `rate_limits` | enabled | service_role: true | service_role: true | service_role: true | service_role: true |
| `regras_automacao` | enabled | authenticated: public.is_hr_staff(auth.uid())<br>authenticated: is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) |
| `regras_log` | enabled | authenticated: public.is_hr_staff(auth.uid())<br>authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) |
| `resultados_provas` | enabled | public: true<br>authenticated: public.is_hr_staff(auth.uid())<br>authenticated: candidato_id IN ( SELECT c.id FROM candidatos c JOIN candidatos_auth ca ON ca.candidato_id = c.id WHERE ca.user_id = auth.uid | public: true<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>public: public.has_role(auth.uid(), 'admin') |
| `role_permissions` | enabled | public: true<br>authenticated: true<br>public: true<br>public: auth.uid() IS NOT NULL<br>public: has_role(auth.uid(), 'admin') | public: has_role(auth.uid(), 'admin') | public: has_role(auth.uid(), 'admin') | public: has_role(auth.uid(), 'admin') |
| `roles` | enabled | public: true<br>authenticated: true<br>public: true | — | — | — |
| `saved_filters` | enabled | public: auth.uid() = user_id | public: auth.uid() = user_id | public: auth.uid() = user_id | public: auth.uid() = user_id |
| `scorecard_competencias` | enabled | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) |
| `scorecard_templates` | enabled | public: true<br>public: true | public: true | public: true | public: true |
| `scorecards` | enabled | public: true<br>authenticated: public.is_hr_staff(auth.uid()) | public: avaliador_id = auth.uid()<br>authenticated: public.is_hr_staff(auth.uid()) | public: avaliador_id = auth.uid()<br>authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) |
| `skills` | enabled | public: true<br>authenticated: public.has_role(auth.uid(), 'admin') | authenticated: public.has_role(auth.uid(), 'admin') | authenticated: public.has_role(auth.uid(), 'admin') | authenticated: public.has_role(auth.uid(), 'admin') |
| `talent_pool_members` | enabled | public: true<br>public: true | public: true | public: true | public: true |
| `talent_pools` | enabled | public: true<br>public: true | public: true | public: true | public: true |
| `template_perguntas` | enabled | authenticated: public.is_hr_staff(auth.uid())<br>authenticated: is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) |
| `templates_entrevista` | enabled | authenticated: public.is_hr_staff(auth.uid())<br>authenticated: true | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) |
| `tenant_invitations` | enabled | public: tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')) | — | — | — |
| `tenant_invites` | enabled | — | — | — | — |
| `tenant_members` | enabled | public: tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())<br>public: tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))<br>public: user_id = auth.uid() OR tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND role IN ('owner', '<br>public: tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')) | public: tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))<br>public: tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')) | public: tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))<br>public: tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')) | public: tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))<br>public: tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin')) |
| `tenants` | enabled | public: id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())<br>public: id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid()) | — | public: owner_id = auth.uid() | — |
| `triagem_ia` | enabled | authenticated: public.is_hr_staff(auth.uid()) | — | — | authenticated: public.is_hr_staff(auth.uid()) |
| `trusted_devices` | enabled | public: auth.uid() = user_id<br>public: auth.uid() = user_id | public: auth.uid() = user_id | public: auth.uid() = user_id | public: auth.uid() = user_id |
| `user_2fa` | enabled | public: auth.uid() = user_id<br>service_role: true | public: auth.uid() = user_id<br>public: auth.uid() = user_id | public: auth.uid() = user_id<br>authenticated: auth.uid() = user_id | public: auth.uid() = user_id |
| `user_2fa_logs` | enabled | public: auth.uid() = user_id | public: auth.uid() = user_id<br>service_role: true | — | — |
| `user_achievements` | enabled | public: auth.uid() = user_id | service_role: true | — | — |
| `user_badges` | enabled | public: auth.uid() = user_id | service_role: true | — | — |
| `user_consents` | enabled | public: auth.uid() = user_id | public: auth.uid() = user_id | public: auth.uid() = user_id | public: auth.uid() = user_id |
| `user_gamification` | enabled | public: auth.uid() = user_id | service_role: true | service_role: true | — |
| `user_roles` | enabled | public: public.has_role(auth.uid(), 'admin')<br>public: auth.uid() = user_id<br>authenticated: true<br>public: true | public: public.has_role(auth.uid(), 'admin')<br>public: public.has_role(auth.uid(), 'admin') | public: public.has_role(auth.uid(), 'admin')<br>public: public.has_role(auth.uid(), 'admin') | public: public.has_role(auth.uid(), 'admin')<br>public: public.has_role(auth.uid(), 'admin') |
| `vaga_interview_kits` | enabled | authenticated: true<br>authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) |
| `vagas` | enabled | public: true<br>public: true<br>public: status = 'publicada'<br>authenticated: true<br>authenticated: public.is_hr_staff(auth.uid())<br>public: public.has_role(auth.uid(), 'gestor') AND departamento_id = (SELECT departamento_id FROM public.profiles WHERE user_id = auth.uid()) | public: true<br>public: true<br>authenticated: EXISTS ( SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'recruiter') )<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>public: true<br>authenticated: EXISTS ( SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'recruiter') )<br>authenticated: is_hr_staff(auth.uid()) | public: true<br>public: true<br>authenticated: has_role(auth.uid(), 'admin') |
| `valores_culturais` | enabled | authenticated: public.is_hr_staff(auth.uid())<br>authenticated: true | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) | authenticated: public.is_hr_staff(auth.uid()) |
| `web_vitals` | enabled | authenticated: public.has_role(auth.uid(), 'admin') | anon, authenticated: true | — | — |
| `webauthn_credentials` | enabled | public: auth.uid() = user_id | public: auth.uid() = user_id | public: auth.uid() = user_id | public: auth.uid() = user_id |
| `workflow_actions` | enabled | public: true<br>authenticated: true<br>authenticated: true | authenticated: true | authenticated: true | authenticated: true |
| `workflow_etapas` | enabled | public: true | public: true | public: true | public: true |
| `workflow_stages` | enabled | public: true<br>authenticated: true<br>authenticated: true | authenticated: true | authenticated: true | authenticated: true |
| `workflow_transitions` | enabled | public: true<br>authenticated: true<br>authenticated: true | authenticated: true | authenticated: true | authenticated: true |
| `workflows` | enabled | public: true<br>public: true<br>public: auth.uid() = created_by<br>authenticated: true<br>authenticated: true | public: true<br>public: auth.uid() = created_by<br>authenticated: true | public: true<br>public: auth.uid() = created_by<br>authenticated: true | public: true<br>public: auth.uid() = created_by<br>authenticated: true |
| `xp_transactions` | enabled | public: auth.uid() = user_id | service_role: true | — | — |

> `—` com RLS ligado = ninguém além de service_role. `sem RLS` = qualquer chave anon lê/escreve tudo.

## Onde o RLS é IGNORADO (service_role) — 52 arquivo(s)

- `scripts/ai-context/cenarios.mjs`
- `scripts/ai-context/gerar.unit.mjs`
- `scripts/inventario/gerar-banco.mjs`
- `scripts/regras_negocio/generate.py`
- `src/hooks/useRegisterFirstResponse.ts`
- `supabase/functions/_shared/aiCache.ts`
- `supabase/functions/_shared/metrics.ts`
- `supabase/functions/_shared/rateLimit.ts`
- `supabase/functions/_shared/retryQueue.ts`
- `supabase/functions/ai-screening/index.ts`
- `supabase/functions/geo-check/index.ts`
- `supabase/functions/health/index.ts`
- `supabase/functions/hunter-sync/index.ts`
- `supabase/functions/interview-reminders/index.ts`
- `supabase/functions/ip-guard/index.ts`
- `supabase/functions/new-device-alert/index.ts`
- `supabase/functions/password-reset-approval/index.ts`
- `supabase/functions/proactive-alerts/index.ts`
- `supabase/functions/process-retry-queue/index.ts`
- `supabase/functions/public-apply/index.ts`
- `supabase/functions/resend-webhook/index.ts`
- `supabase/functions/sign-proposal/index.ts`
- `supabase/functions/webhook-handler/index.ts`
- `supabase/migrations/20260315114907_803dca6b-c9dc-425a-b6f5-5698f628effc.sql`
- `supabase/migrations/20260315120152_ffcb825c-94af-478e-9a70-896ca734b034.sql`
- `supabase/migrations/20260315120509_4308a1fc-1262-4a60-a10e-cbad203f5288.sql`
- `supabase/migrations/20260315121530_f128ac6a-8fb3-4217-80a2-b331dfd78d87.sql`
- `supabase/migrations/20260315121923_33a091ed-6f4c-455e-8f29-bed34201a472.sql`
- `supabase/migrations/20260315122914_59e1b154-21d2-4c20-a0b1-3456e5f06d71.sql`
- `supabase/migrations/20260711164526_16902f97-b898-49fd-a62e-952e2fd37ce2.sql`
- `supabase/migrations/20260711164752_0c09d686-0d45-4c1c-88d9-2bb84a3225d3.sql`
- `supabase/migrations/20260713102017_4b1f4aa9-eaaf-4db7-9499-2be53622b019.sql`
- `supabase/migrations/20260713102103_10e4df20-e80c-4465-a2d4-34d0ab1a83ab.sql`
- `supabase/migrations/20260713105519_a04bcdf9-04aa-42ac-a95d-bcaf4e7ffcc6.sql`
- `supabase/migrations/20260713105846_1b5fdb73-316d-4070-8961-75f03e1d0e5f.sql`
- `supabase/migrations/20260713123954_5a6241d1-e0c1-4771-9126-cd0a17df65eb.sql`
- `supabase/migrations/20260713124254_47a40955-6466-46f0-b73e-7e1c0d25c73e.sql`
- `supabase/migrations/20260713124627_e0d102d4-2c2f-4462-ad19-58b2f9959fe9.sql`
- `supabase/migrations/20260715141111_76a89cc9-6130-49cf-9c71-b1dcb4fba012.sql`
- `supabase/migrations/20260715155057_867ca1a1-a632-4154-8c8e-5fb155100f45.sql`
- `supabase/migrations/20260723114807_a00385e2-159b-45f9-9afd-3f936cd49f6b.sql`
- `supabase/migrations/20260723122350_0081e2ae-c0a6-4a9c-8a51-12577a664b42.sql`
- `supabase/migrations/20260723130309_82ff49b1-c65f-4bf3-864f-fe6f7659843f.sql`
- `supabase/migrations/20260723130530_dba01602-0ecc-461d-bf36-e749d1c28be6.sql`
- `supabase/migrations/20260723133834_279fba0d-2c46-4350-8b50-1d2cb21cd652.sql`
- `supabase/migrations/20260726181749_10770cce-c535-4d8c-9af4-cc2066a0e360.sql`
- `supabase/migrations/20260726183459_bdb61566-5c86-4cfe-9c69-4e1b4bc22e62.sql`
- `supabase/migrations/20260726185447_7a55c08e-dfed-437e-b9be-744c64859eed.sql`
- `supabase/migrations/20260726185714_7ed8eac0-0c96-4b24-a1a7-c1d1ef853c4d.sql`
- `supabase/migrations/20260726192651_4cd9b64b-769d-4e91-a063-dfa982d39319.sql`
- `supabase/migrations/20260726193022_668ebe4f-48b1-450a-9f31-f90046a86344.sql`
- `supabase/migrations/20260726193230_ad6685cd-ad9e-49af-b697-f6803c80a3e5.sql`

## Funções SQL `SECURITY DEFINER` (rodam com privilégio do dono, ignoram RLS)

- `add_user_xp`
- `admin_communication_retry_stats`
- `admin_email_delivery_sla`
- `admin_integration_health_summary`
- `admin_list_audit_log`
- `admin_list_communication_retries`
- `admin_requeue_communication_retry`
- `apply_for_job`
- `assinar_proposta`
- `audit_trigger_func`
- `award_xp`
- `calculate_level_from_xp`
- `check_rate_limit`
- `check_user_permission`
- `claim_communication_retry_batch`
- `cleanup_expired_ai_cache`
- `cleanup_old_integration_events`
- `cleanup_old_login_attempts`
- `cleanup_old_logs`
- `create_candidato_with_details`
- `create_default_tenant`
- `enqueue_communication_retry`
- `finish_cognitive_session`
- `get_cognitive_result`
- `get_cognitive_session_items`
- `get_proposta_by_token`
- `get_user_permissions`
- `get_user_roles`
- `handle_new_candidate_user`
- `handle_new_user`
- `has_permission`
- `has_role`
- `hr_candidatura_timeline`
- `hr_funnel_sla`
- `hr_register_first_response`
- `hr_sla_overdue_list`
- `is_hr_staff`
- `log_admin_action`
- `log_audit_event`
- `log_etapa_change`
- `mark_retry_result`
- `notify_candidato_etapa_change`
- `public_email_delivery_sla`
- `recover_stuck_communication_retries`
- `registrar_visualizacao_proposta`
- `safe_update_gamification`
- `start_cognitive_session`
- `submit_cognitive_response`
- `update_updated_at_column`
- `update_user_streak`
- `update_vaga_metrics`

## Edge functions públicas (sem JWT — qualquer um chama)

- `health`
- `resend-webhook`
- `proactive-alerts`
- `public-apply`
- `sign-proposal`

## Rotas protegidas no front

| Rota | Guard | Roles | Arquivo |
|---|---|---|---|
| /admin | ProtectedRoute |  | `scripts/ci/inventario-rotas.unit.mjs` |
| /admin | ProtectedRoute |  | `src/routes/AdminRoutes.tsx` |
| /admin/audit-log | ProtectedRoute |  | `src/routes/AdminRoutes.tsx` |
| /admin/dlq | ProtectedRoute |  | `src/routes/AdminRoutes.tsx` |
| /app | ProtectedRoute |  | `scripts/ai-context/gerar.unit.mjs` |
| /auth/2fa | ProtectedRoute |  | `src/routes/AuthRoutes.tsx` |
| /configuracoes/seguranca | ProtectedRoute |  | `src/routes/AdminRoutes.tsx` |
| /diagnostico | ProtectedRoute |  | `src/routes/AdminRoutes.tsx` |
| /edge-functions-test | ProtectedRoute |  | `src/routes/AdminRoutes.tsx` |
| /security/rate-limit | ProtectedRoute |  | `src/routes/AdminRoutes.tsx` |
| /security/roles | ProtectedRoute |  | `src/routes/AdminRoutes.tsx` |
| path | ProtectedRoute |  | `src/components/auth/__tests__/ProtectedRoute.test.tsx` |

Guards usados: Protected, ProtectedRoute

Middleware matcher (Next.js): nenhum

## Grants / Revokes (agrupados por role e privilégio)

| Ação | Para/De | Privilégios | Objetos |
|---|---|---|---|
| grant | anon | select | `skills` |
| grant | anon, authenticated | insert | `web_vitals` |
| grant | anon, authenticated | select | `empresa_branding` |
| grant | anon, authenticated, service_role | execute | `public_email_delivery_sla`, `get_proposta_by_token`, `assinar_proposta` |
| grant | authenticated | all | `user_2fa`, `user_2fa_logs`, `user_consents`, `data_deletion_requests`, `workflows`, `workflow_stages`, `workflow_transitions`, `workflow_actions`, `roles`, `permissions`, `role_permissions`, `user_roles` |
| grant | authenticated | execute | `check_user_permission`, `create_candidato_with_details`, `create_candidato_with_details`, `is_hr_staff`, `has_role`, `has_permission`, `get_user_roles`, `get_user_permissions`, `safe_update_gamification`, `update_user_streak`, `add_user_xp`, `award_xp`, `calculate_level_from_xp`, `apply_for_job`, `create_candidato_with_details` … +9 |
| grant | authenticated | insert, update, delete | `empresa_branding` |
| grant | authenticated | select | `web_vitals`, `admin_audit_log`, `triagem_ia`, `propostas_eventos`, `skills` |
| grant | authenticated | select, insert | `data_access_logs` |
| grant | authenticated | select, insert, update | `cognitive_sessions`, `cognitive_responses` |
| grant | authenticated | select, insert, update, delete | `hunter_leads`, `vaga_interview_kits`, `propostas`, `candidato_skills`, `cognitive_items` |
| grant | authenticated, service_role | execute | `admin_email_delivery_sla`, `search_candidatos`, `get_cognitive_session_items`, `start_cognitive_session`, `submit_cognitive_response`, `finish_cognitive_session`, `get_cognitive_result` |
| grant | service_role | all | `web_vitals`, `rate_limits`, `ai_cache`, `communication_retry_queue`, `integration_health_events`, `admin_audit_log`, `empresa_branding`, `hunter_leads`, `vaga_interview_kits`, `triagem_ia`, `propostas`, `propostas_eventos`, `skills`, `candidato_skills`, `cognitive_items` … +2 |
| grant | service_role | execute | `check_rate_limit`, `cleanup_expired_ai_cache`, `enqueue_communication_retry`, `claim_communication_retry_batch`, `mark_retry_result`, `recover_stuck_communication_retries`, `cleanup_old_integration_events`, `hr_funnel_sla`, `hr_sla_overdue_list`, `hr_register_first_response` |
| revoke | PUBLIC | all | `check_rate_limit`, `recover_stuck_communication_retries`, `admin_list_communication_retries`, `admin_requeue_communication_retry`, `admin_communication_retry_stats`, `admin_integration_health_summary`, `cleanup_old_integration_events`, `public_email_delivery_sla`, `admin_email_delivery_sla`, `get_proposta_by_token`, `assinar_proposta`, `search_candidatos`, `get_cognitive_session_items`, `start_cognitive_session`, `submit_cognitive_response` … +5 |
| revoke | PUBLIC | execute | `create_candidato_with_details`, `log_admin_action`, `admin_list_audit_log` |
| revoke | PUBLIC, anon | execute | `is_hr_staff`, `has_role`, `has_permission`, `get_user_roles`, `get_user_permissions`, `safe_update_gamification`, `update_user_streak`, `add_user_xp`, `award_xp`, `calculate_level_from_xp`, `check_rate_limit`, `apply_for_job`, `create_candidato_with_details`, `cleanup_old_logs`, `cleanup_old_login_attempts` … +16 |
| revoke | PUBLIC, anon, authenticated | execute | `cleanup_expired_ai_cache`, `enqueue_communication_retry`, `claim_communication_retry_batch`, `mark_retry_result`, `cleanup_expired_ai_cache`, `cleanup_old_integration_events`, `cleanup_old_logs`, `cleanup_old_login_attempts`, `recover_stuck_communication_retries`, `mark_retry_result`, `claim_communication_retry_batch`, `enqueue_communication_retry`, `check_rate_limit`, `add_user_xp`, `update_user_streak` … +7 |
| revoke | public, anon | execute | `has_role`, `has_permission`, `award_xp`, `add_user_xp` |

## Riscos de acesso detectados

| Tabela | Problema | Arquivos |
|---|---|---|
| `user_achievements` | front faz DELETE mas nenhuma política RLS permite DELETE → vai falhar/retornar vazio para usuários | `src/hooks/useGamificationSupabase.ts` |
| `user_badges` | front faz DELETE mas nenhuma política RLS permite DELETE → vai falhar/retornar vazio para usuários | `src/hooks/useGamificationSupabase.ts` |
| `user_gamification` | front faz DELETE mas nenhuma política RLS permite DELETE → vai falhar/retornar vazio para usuários | `src/hooks/useGamificationSupabase.ts` |
| `xp_transactions` | front faz DELETE mas nenhuma política RLS permite DELETE → vai falhar/retornar vazio para usuários | `src/hooks/useGamificationSupabase.ts` |

## Multi-tenancy

- Chave de tenant: **`tenant_id`** presente em 8 tabela(s): `user_roles`, `tenant_members`, `tenant_invites`, `roles`, `talent_pools`, `candidate_tags`, `tenant_invitations`, `scorecard_templates`
- Cobertura: 8% das tabelas. Abaixo de 60% — isolamento provavelmente por usuário (auth.uid()) ou misto; não flagado por tabela.

## Soft delete (registros 'apagados' continuam na tabela — filtre!)

| Tabela | Coluna |
|---|---|
| `allowed_ips` | `is_active` |
| `vagas` | `deleted_at` |
| `candidatos` | `deleted_at` |
| `entrevistas` | `deleted_at` |
| `email_templates` | `ativo` |
| `workflows` | `is_active` |
| `profiles` | `deleted_at` |
| `processos_seletivos` | `deleted_at` |
| `avaliacoes` | `deleted_at` |
| `provas` | `ativo` |
| `provas` | `deleted_at` |
| `candidaturas` | `deleted_at` |
| `baterias_provas` | `ativo` |
| `tenants` | `is_active` |
| `workflow_actions` | `is_active` |
| `talent_pools` | `is_active` |
| `notifications` | `deleted_at` |
| `allowed_countries` | `is_active` |
| `valores_culturais` | `ativo` |
| `competencias` | `ativo` |
| `criterios_selecao` | `ativo` |
| `assessments` | `ativo` |
| `assessments` | `deleted_at` |
| `templates_entrevista` | `ativo` |
| `regras_automacao` | `ativo` |
| `perfis_comportamentais_empresa` | `ativo` |
| `empresa_branding` | `ativo` |
| `cognitive_items` | `ativo` |
| `cognitive_items` | `deleted_at` |
| `cognitive_sessions` | `deleted_at` |

## Auditoria (colunas de rastreio)

| Tabela | Colunas |
|---|---|
| `allowed_ips` | `created_at`, `updated_at` |
| `ip_access_logs` | `created_at` |
| `saved_filters` | `created_at`, `updated_at` |
| `vagas` | `created_at`, `updated_at` |
| `candidatos` | `created_at`, `updated_at` |
| `entrevistas` | `created_at`, `created_by`, `updated_at` |
| `email_templates` | `created_at`, `created_by`, `updated_at` |
| `workflows` | `created_at`, `created_by`, `updated_at` |
| `match_scores` | `created_at` |
| `profiles` | `created_at`, `updated_at` |
| `user_roles` | `created_at` |
| `comunicacoes` | `created_at` |
| `processos_seletivos` | `created_at`, `updated_at` |
| `avaliacoes` | `created_at`, `updated_at` |
| `provas` | `created_at`, `updated_at` |
| `resultados_provas` | `created_at` |
| `historico_etapas` | `created_at` |
| `candidatos_auth` | `created_at`, `updated_at` |
| `candidaturas` | `created_at`, `updated_at` |
| `indicacoes` | `created_at`, `updated_at` |
| `questoes` | `created_at` |
| `baterias_provas` | `created_at`, `updated_at` |
| `user_2fa` | `created_at`, `updated_at` |
| `user_2fa_logs` | `created_at` |
| `user_consents` | `created_at`, `updated_at` |
| `tenants` | `created_at`, `updated_at` |
| `tenant_members` | `created_at` |
| `tenant_invites` | `created_at` |
| `workflow_stages` | `created_at` |
| `workflow_transitions` | `created_at` |
| `workflow_actions` | `created_at` |
| `roles` | `created_at` |
| `permissions` | `created_at` |
| `role_permissions` | `created_at` |
| `talent_pools` | `created_at`, `created_by`, `updated_at` |
| `talent_pool_members` | `created_at` |
| `candidate_tags` | `created_at` |
| `candidate_tag_assignments` | `created_at` |
| `audit_logs` | `created_at` |
| `tenant_invitations` | `created_at` |
| `scorecard_templates` | `created_at`, `created_by`, `updated_at` |
| `scorecards` | `atualizado_em`, `created_at` |
| `notifications` | `created_at` |
| `rate_limit_logs` | `created_at` |
| `blocked_ips` | `created_at` |
| `password_reset_tokens` | `created_at` |
| `trusted_devices` | `created_at` |
| `webauthn_credentials` | `created_at` |
| `allowed_countries` | `created_at`, `updated_at` |
| `geo_access_logs` | `created_at` |
| `password_reset_requests` | `created_at`, `updated_at` |
| `login_attempts` | `created_at`, `updated_at` |
| `valores_culturais` | `created_at`, `updated_at` |
| `competencias` | `created_at`, `updated_at` |
| `perfis_cargo` | `created_at`, `updated_at` |
| `criterios_selecao` | `created_at` |
| `perfil_valores` | `created_at` |
| `assessments` | `created_at`, `updated_at` |
| `assessment_questoes` | `created_at` |
| `assessment_respostas` | `created_at` |
| `templates_entrevista` | `created_at`, `updated_at` |
| `template_perguntas` | `created_at` |
| `entrevista_respostas` | `created_at` |
| `scorecard_competencias` | `created_at` |
| `regras_automacao` | `created_at`, `updated_at` |
| `comparativos_candidatos` | `created_at` |
| `behavioral_assessment_results` | `created_at`, `updated_at` |
| `avaliacoes_comportamentais_resultados` | `created_at`, `updated_at` |
| `perfis_comportamentais_empresa` | `created_at`, `created_by`, `updated_at` |
| `user_gamification` | `created_at`, `updated_at` |
| `xp_transactions` | `created_at` |
| `documentos_candidatos` | `created_at`, `updated_at` |
| `notas_candidatos` | `created_at`, `updated_at` |
| `notificacoes_candidato` | `created_at` |
| `feature_flags` | `created_at`, `updated_at` |
| `departamentos` | `created_at`, `updated_at` |
| `web_vitals` | `created_at` |
| `rate_limits` | `created_at`, `updated_at` |
| `ai_cache` | `created_at` |
| `communication_retry_queue` | `created_at`, `updated_at` |
| `integration_health_events` | `created_at` |
| `admin_audit_log` | `created_at` |
| `empresa_branding` | `created_at`, `updated_at` |
| `hunter_leads` | `created_at`, `updated_at` |
| `vaga_interview_kits` | `created_at`, `created_by`, `updated_at` |
| `triagem_ia` | `created_at`, `updated_at` |
| `propostas` | `created_at`, `criado_por`, `updated_at` |
| `propostas_eventos` | `created_at` |
| `skills` | `created_at`, `updated_at` |
| `candidato_skills` | `created_at`, `updated_at` |
| `cognitive_items` | `created_at`, `updated_at` |
| `cognitive_sessions` | `created_at`, `updated_at` |
| `cognitive_responses` | `created_at`, `updated_at` |

## Dados pessoais / sensíveis (LGPD — cuidado em logs, exports, prompts de IA)

| Tabela | Coluna |
|---|---|
| `allowed_ips` | `ip_address` |
| `ip_access_logs` | `ip_address` |
| `candidatos` | `email` |
| `candidatos` | `telefone` |
| `profiles` | `email` |
| `candidatos_auth` | `email` |
| `candidatos_auth` | `telefone` |
| `user_2fa_logs` | `ip_address` |
| `data_access_logs` | `ip_address` |
| `tenant_invites` | `email` |
| `audit_logs` | `ip_address` |
| `tenant_invitations` | `email` |
| `rate_limit_logs` | `ip_address` |
| `blocked_ips` | `ip_address` |
| `geo_access_logs` | `ip_address` |
| `avaliacoes_comportamentais_resultados` | `ip_address` |
| `admin_audit_log` | `ip_address` |
| `hunter_leads` | `email` |
| `hunter_leads` | `phone` |
| `propostas` | `salario` |

## Colunas de dinheiro (tipo importa: numeric ✅ / float ❌)

| Tabela | Coluna | Tipo |
|---|---|---|
| `vagas` | `total_candidatos` | `INTEGER` |
| `entrevistas` | `feedback_resultado` | `TEXT` |
| `entrevistas` | `feedback_nota` | `DECIMAL(3,1)` |
| `entrevistas` | `feedback_pontos_fortes` | `TEXT[]` |
| `entrevistas` | `feedback_pontos_melhorar` | `TEXT[]` |
| `entrevistas` | `feedback_comentarios` | `TEXT` |
| `entrevistas` | `feedback_recomendacao` | `TEXT` |
| `entrevistas` | `feedback_avaliado_por` | `TEXT` |
| `entrevistas` | `feedback_avaliado_em` | `TIMESTAMP` |
| `provas` | `total_questoes` | `INTEGER` |
| `assessments` | `total_questoes` | `INTEGER` |
| `avaliacoes_comportamentais_resultados` | `total_hesitacoes` | `INTEGER` |
| `user_gamification` | `total_actions` | `INTEGER` |
| `xp_transactions` | `amount` | `INTEGER` |
| `cognitive_sessions` | `total_itens` | `INTEGER` |
