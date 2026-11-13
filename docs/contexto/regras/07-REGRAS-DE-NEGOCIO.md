# 07 · REGRAS DE NEGÓCIO

> Gerado automaticamente por AI Context Sync v1.3.2 · commit `50668aec3b` · branch `main` · 2026-11-13 09:59 UTC
> Não edite à mão — regras humanas vão em `manual/`.

## A. Regras escritas por humanos (`manual/` — prioridade máxima, nunca sobrescrito)

_Nenhum arquivo em `manual/`. Copie `manual/TEMPLATE-regras-de-negocio.md` para `manual/regras.md` e preencha._

## B. Quem pode ver/alterar o quê (RLS — conforme migrations do repo; schema real em `06`)

| Tabela | Política | Comando | Roles | Modo | USING | WITH CHECK |
|---|---|---|---|---|---|---|
| `allowed_ips` | Authenticated users can read active IPs | SELECT | public | permissive | `is_active = true` |  |
| `ip_access_logs` | Admins can view access logs | SELECT | public | permissive | `EXISTS ( SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin') )` |  |
| `ip_access_logs` | System can insert access logs | INSERT | public | permissive |  | `true` |
| `saved_filters` | Users can view own filters | SELECT | public | permissive | `auth.uid() = user_id` |  |
| `saved_filters` | Users can insert own filters | INSERT | public | permissive |  | `auth.uid() = user_id` |
| `saved_filters` | Users can update own filters | UPDATE | public | permissive | `auth.uid() = user_id` | `auth.uid() = user_id` |
| `saved_filters` | Users can delete own filters | DELETE | public | permissive | `auth.uid() = user_id` |  |
| `entity_versions` | Users can view versions | SELECT | public | permissive | `true` |  |
| `entity_versions` | Users can insert versions | INSERT | public | permissive |  | `auth.uid() = changed_by OR changed_by IS NULL` |
| `vagas` | Allow all | ALL | public | permissive | `true` |  |
| `candidatos` | Allow all | ALL | public | permissive | `true` |  |
| `entrevistas` | Allow all | ALL | public | permissive | `true` |  |
| `email_templates` | Allow all | ALL | public | permissive | `true` |  |
| `workflows` | Allow all | ALL | public | permissive | `true` |  |
| `workflow_etapas` | Allow all | ALL | public | permissive | `true` |  |
| `profiles` | Users can view own profile | SELECT | public | permissive | `auth.uid() = user_id` |  |
| `profiles` | Users can update own profile | UPDATE | public | permissive | `auth.uid() = user_id` |  |
| `profiles` | Users can insert own profile | INSERT | public | permissive |  | `auth.uid() = user_id` |
| `profiles` | Admins can view all profiles | SELECT | public | permissive | `public.has_role(auth.uid(), 'admin')` |  |
| `user_roles` | Admins can manage all roles | ALL | public | permissive | `public.has_role(auth.uid(), 'admin')` |  |
| `user_roles` | Admins can insert roles | INSERT | public | permissive |  | `public.has_role(auth.uid(), 'admin')` |
| `user_roles` | Admins can delete roles | DELETE | public | permissive | `public.has_role(auth.uid(), 'admin')` |  |
| `user_roles` | Admins can update roles | UPDATE | public | permissive | `public.has_role(auth.uid(), 'admin')` |  |
| `vagas` | Permitir leitura de vagas | SELECT | public | permissive | `true` |  |
| `vagas` | Permitir inserção de vagas | INSERT | public | permissive |  | `true` |
| `vagas` | Permitir atualização de vagas | UPDATE | public | permissive | `true` |  |
| `vagas` | Permitir exclusão de vagas | DELETE | public | permissive | `true` |  |
| `processos_seletivos` | Permitir leitura de processos | SELECT | public | permissive | `true` |  |
| `processos_seletivos` | Permitir inserção de processos | INSERT | public | permissive |  | `true` |
| `processos_seletivos` | Permitir atualização de processos | UPDATE | public | permissive | `true` |  |
| `processos_seletivos` | Permitir exclusão de processos | DELETE | public | permissive | `true` |  |
| `entrevistas` | Permitir leitura de entrevistas | SELECT | public | permissive | `true` |  |
| `entrevistas` | Permitir inserção de entrevistas | INSERT | public | permissive |  | `true` |
| `entrevistas` | Permitir atualização de entrevistas | UPDATE | public | permissive | `true` |  |
| `entrevistas` | Permitir exclusão de entrevistas | DELETE | public | permissive | `true` |  |
| `avaliacoes` | Permitir leitura de avaliacoes | SELECT | public | permissive | `true` |  |
| `avaliacoes` | Permitir inserção de avaliacoes | INSERT | public | permissive |  | `true` |
| `avaliacoes` | Permitir atualização de avaliacoes | UPDATE | public | permissive | `true` |  |
| `avaliacoes` | Permitir exclusão de avaliacoes | DELETE | public | permissive | `true` |  |
| `provas` | Permitir leitura de provas | SELECT | public | permissive | `true` |  |
| `provas` | Permitir inserção de provas | INSERT | public | permissive |  | `true` |
| `provas` | Permitir atualização de provas | UPDATE | public | permissive | `true` |  |
| `provas` | Permitir exclusão de provas | DELETE | public | permissive | `true` |  |
| `resultados_provas` | Permitir leitura de resultados | SELECT | public | permissive | `true` |  |
| `resultados_provas` | Permitir inserção de resultados | INSERT | public | permissive |  | `true` |
| `resultados_provas` | Permitir atualização de resultados | UPDATE | public | permissive | `true` |  |
| `resultados_provas` | Permitir exclusão de resultados | DELETE | public | permissive | `true` |  |
| `historico_etapas` | Permitir leitura de historico | SELECT | public | permissive | `true` |  |
| `historico_etapas` | Permitir inserção de historico | INSERT | public | permissive |  | `true` |
| `candidatos_auth` | Candidatos podem ver próprio perfil | SELECT | public | permissive | `auth.uid() = user_id` |  |
| `candidatos_auth` | Candidatos podem atualizar próprio perfil | UPDATE | public | permissive | `auth.uid() = user_id` |  |
| `candidatos_auth` | Candidatos podem inserir próprio perfil | INSERT | public | permissive |  | `auth.uid() = user_id` |
| `candidaturas` | Candidatos podem ver próprias candidaturas | SELECT | public | permissive | `candidato_auth_id IN (SELECT id FROM public.candidatos_auth WHERE user_id = auth.uid())` |  |
| `candidaturas` | Candidatos podem criar candidaturas | INSERT | public | permissive |  | `candidato_auth_id IN (SELECT id FROM public.candidatos_auth WHERE user_id = auth.uid())` |
| `candidaturas` | Candidatos podem atualizar candidaturas | UPDATE | public | permissive | `candidato_auth_id IN (SELECT id FROM public.candidatos_auth WHERE user_id = auth.uid())` |  |
| `vagas` | Qualquer pessoa pode ver vagas publicadas | SELECT | public | permissive | `status = 'publicada'` |  |
| `storage.objects` | Candidatos podem fazer upload de curriculos | INSERT | public | permissive |  | `bucket_id = 'curriculos' AND auth.uid()::text = (storage.foldername(name))[1]` |
| `storage.objects` | Candidatos podem ver seus curriculos | SELECT | public | permissive | `bucket_id = 'curriculos' AND auth.uid()::text = (storage.foldername(name))[1]` |  |
| `storage.objects` | Candidatos podem deletar seus curriculos | DELETE | public | permissive | `bucket_id = 'curriculos' AND auth.uid()::text = (storage.foldername(name))[1]` |  |
| `storage.objects` | Candidatos podem atualizar seus curriculos | UPDATE | public | permissive | `bucket_id = 'curriculos' AND auth.uid()::text = (storage.foldername(name))[1]` |  |
| `storage.objects` | RH pode ver todos curriculos | SELECT | public | permissive | `bucket_id = 'curriculos' AND EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid())` |  |
| `indicacoes` | Admins podem deletar indicações | DELETE | public | permissive | `has_role(auth.uid(), 'admin')` |  |
| `vagas` | vagas_select_policy | SELECT | authenticated | permissive | `true` |  |
| `vagas` | vagas_insert_policy | INSERT | authenticated | permissive |  | `EXISTS ( SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'recruiter') )` |
| `vagas` | vagas_update_policy | UPDATE | authenticated | permissive | `EXISTS ( SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'recruiter') )` |  |
| `candidatos` | candidatos_select_policy | SELECT | authenticated | permissive | `EXISTS ( SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'recruiter', 'manager') ) OR id IN ( SELECT candidato_id FROM candidatos_auth WHERE user_id = auth.uid() )` |  |
| `processos_seletivos` | processos_select_policy | SELECT | authenticated | permissive | `EXISTS ( SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'recruiter', 'manager') )` |  |
| `entrevistas` | entrevistas_select_policy | SELECT | authenticated | permissive | `EXISTS ( SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'recruiter', 'manager') ) OR processo_seletivo_id IN ( SELECT ps.id FROM processos_seletivos ps JOIN candidatos c ON c.id = ps.candidato_id JOIN candidatos_auth ca ON ca.candidato_id = c.id WHERE ca.user_id = auth.uid …` |  |
| `provas` | provas_select_policy | SELECT | authenticated | permissive | `ativo = true OR EXISTS ( SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'recruiter') )` |  |
| `comunicacoes` | comunicacoes_select_policy | SELECT | authenticated | permissive | `EXISTS ( SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'recruiter') ) OR candidato_id IN ( SELECT candidato_id FROM candidatos_auth WHERE user_id = auth.uid() )` |  |
| `indicacoes` | indicacoes_select_policy | SELECT | authenticated | permissive | `EXISTS ( SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role IN ('admin', 'recruiter') ) OR indicador_email = (SELECT email FROM auth.users WHERE id = auth.uid())` |  |
| `avaliacoes` | avaliacoes_select_policy | SELECT | authenticated | permissive | `true` |  |
| `avaliacoes` | avaliacoes_insert_policy | INSERT | authenticated | permissive |  | `true` |
| `avaliacoes` | avaliacoes_update_policy | UPDATE | authenticated | permissive | `true` |  |
| `candidatos_auth` | Admins podem deletar candidatos_auth | DELETE | public | permissive | `public.has_role(auth.uid(), 'admin')` |  |
| `resultados_provas` | Admins podem deletar resultados_provas | DELETE | public | permissive | `public.has_role(auth.uid(), 'admin')` |  |
| `user_2fa` | Users can view own 2FA settings | SELECT | public | permissive | `auth.uid() = user_id` |  |
| `user_2fa` | Users can insert own 2FA settings | INSERT | public | permissive |  | `auth.uid() = user_id` |
| `user_2fa` | Users can update own 2FA settings | UPDATE | public | permissive | `auth.uid() = user_id` |  |
| `user_2fa` | Users can delete own 2FA settings | DELETE | public | permissive | `auth.uid() = user_id` |  |
| `user_2fa_logs` | System can insert 2FA logs | INSERT | public | permissive |  | `auth.uid() = user_id` |
| `user_consents` | Users can manage own consents | ALL | public | permissive | `auth.uid() = user_id` |  |
| `data_deletion_requests` | Users can view own deletion requests | SELECT | public | permissive | `auth.uid() = user_id` |  |
| `data_deletion_requests` | Users can create deletion requests | INSERT | public | permissive |  | `auth.uid() = user_id` |
| `data_access_logs` | Users can view own access logs | SELECT | public | permissive | `auth.uid() = user_id` |  |
| `tenants` | Users view own tenants | SELECT | public | permissive | `id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())` |  |
| `tenant_members` | Members view tenant members | SELECT | public | permissive | `tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())` |  |
| `tenant_members` | Admins manage members | ALL | public | permissive | `tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))` |  |
| `workflows` | Users can view workflows | SELECT | public | permissive | `true` |  |
| `workflows` | Users can manage workflows | ALL | public | permissive | `auth.uid() = created_by` |  |
| `workflow_stages` | Users can view stages | SELECT | public | permissive | `true` |  |
| `workflow_transitions` | Users can view transitions | SELECT | public | permissive | `true` |  |
| `workflow_actions` | Users can view actions | SELECT | public | permissive | `true` |  |
| `roles` | Anyone can view roles | SELECT | public | permissive | `true` |  |
| `permissions` | Anyone can view permissions | SELECT | public | permissive | `true` |  |
| `role_permissions` | Anyone can view role_permissions | SELECT | public | permissive | `true` |  |
| `user_roles` | Users can view own roles | SELECT | public | permissive | `auth.uid() = user_id` |  |
| `workflows` | Workflows are viewable by authenticated users | SELECT | authenticated | permissive | `true` |  |
| `workflows` | Workflows are manageable by admins | ALL | authenticated | permissive | `true` |  |
| `workflow_stages` | Workflow stages viewable | SELECT | authenticated | permissive | `true` |  |
| `workflow_stages` | Workflow stages manageable | ALL | authenticated | permissive | `true` |  |
| `workflow_transitions` | Workflow transitions viewable | SELECT | authenticated | permissive | `true` |  |
| `workflow_transitions` | Workflow transitions manageable | ALL | authenticated | permissive | `true` |  |
| `workflow_actions` | Workflow actions viewable | SELECT | authenticated | permissive | `true` |  |
| `workflow_actions` | Workflow actions manageable | ALL | authenticated | permissive | `true` |  |
| `roles` | Roles viewable by authenticated | SELECT | authenticated | permissive | `true` |  |
| `permissions` | Permissions viewable by authenticated | SELECT | authenticated | permissive | `true` |  |
| `role_permissions` | Role permissions viewable | SELECT | authenticated | permissive | `true` |  |
| `user_roles` | User roles viewable | SELECT | authenticated | permissive | `true` |  |
| `talent_pools` | Users view pools | SELECT | public | permissive | `true` |  |
| `talent_pools` | Users manage pools | ALL | public | permissive | `true` |  |
| `talent_pool_members` | Users view pool members | SELECT | public | permissive | `true` |  |
| `talent_pool_members` | Users manage pool members | ALL | public | permissive | `true` |  |
| `candidate_tags` | Users view tags | SELECT | public | permissive | `true` |  |
| `candidate_tags` | Users manage tags | ALL | public | permissive | `true` |  |
| `candidate_tag_assignments` | Users view tag assignments | SELECT | public | permissive | `true` |  |
| `candidate_tag_assignments` | Users manage tag assignments | ALL | public | permissive | `true` |  |
| `audit_logs` | Admins view audit logs | SELECT | public | permissive | `true` |  |
| `tenants` | Users can view own tenants | SELECT | public | permissive | `id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid())` |  |
| `tenants` | Owners can update tenants | UPDATE | public | permissive | `owner_id = auth.uid()` |  |
| `tenant_members` | Users can view own memberships | SELECT | public | permissive | `user_id = auth.uid() OR tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))` |  |
| `tenant_members` | Admins can manage members | ALL | public | permissive | `tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))` |  |
| `tenant_invitations` | View invitations | SELECT | public | permissive | `tenant_id IN (SELECT tenant_id FROM public.tenant_members WHERE user_id = auth.uid() AND role IN ('owner', 'admin'))` |  |
| `audit_logs` | Admins can view all logs | SELECT | public | permissive | `auth.uid() IN (SELECT user_id FROM public.user_roles ur JOIN public.roles r ON ur.role_id = r.id WHERE r.name = 'admin')` |  |
| `scorecard_templates` | Users view templates | SELECT | public | permissive | `true` |  |
| `scorecard_templates` | Users manage templates | ALL | public | permissive | `true` |  |
| `scorecards` | Users view scorecards | SELECT | public | permissive | `true` |  |
| `scorecards` | Users create scorecards | INSERT | public | permissive |  | `avaliador_id = auth.uid()` |
| `scorecards` | Users update own scorecards | UPDATE | public | permissive | `avaliador_id = auth.uid()` |  |
| `roles` | Users view roles | SELECT | public | permissive | `true` |  |
| `permissions` | Users view permissions | SELECT | public | permissive | `true` |  |
| `role_permissions` | Users view role_permissions | SELECT | public | permissive | `true` |  |
| `user_roles` | Users view user_roles | SELECT | public | permissive | `true` |  |
| `notifications` | Users can view their own notifications | SELECT | public | permissive | `auth.uid() = user_id` |  |
| `notifications` | Users can update their own notifications | UPDATE | public | permissive | `auth.uid() = user_id` |  |
| `notifications` | Users can delete their own notifications | DELETE | public | permissive | `auth.uid() = user_id` |  |
| `user_2fa` | Users can insert own 2FA | INSERT | public | permissive |  | `auth.uid() = user_id` |
| `user_2fa_logs` | Users can view own 2FA logs | SELECT | public | permissive | `auth.uid() = user_id` |  |
| `rate_limit_logs` | Admins can view rate limit logs | SELECT | public | permissive | `has_role(auth.uid(), 'admin')` |  |
| `blocked_ips` | Admins can manage blocked IPs | ALL | public | permissive | `has_role(auth.uid(), 'admin')` |  |
| `allowed_ips` | Admins can manage allowed IPs | ALL | public | permissive | `has_role(auth.uid(), 'admin')` |  |
| `ip_access_logs` | Admins can view IP access logs | SELECT | public | permissive | `has_role(auth.uid(), 'admin')` |  |
| `permissions` | Everyone can view permissions | SELECT | public | permissive | `auth.uid() IS NOT NULL` |  |
| `permissions` | Admins can manage permissions | ALL | public | permissive | `has_role(auth.uid(), 'admin')` |  |
| `role_permissions` | Everyone can view role permissions | SELECT | public | permissive | `auth.uid() IS NOT NULL` |  |
| `role_permissions` | Admins can manage role permissions | ALL | public | permissive | `has_role(auth.uid(), 'admin')` |  |
| `trusted_devices` | Users can view own trusted devices | SELECT | public | permissive | `auth.uid() = user_id` |  |
| `trusted_devices` | Users can manage own trusted devices | ALL | public | permissive | `auth.uid() = user_id` |  |
| `webauthn_credentials` | Users can view their own passkeys | SELECT | public | permissive | `auth.uid() = user_id` |  |
| `webauthn_credentials` | Users can register their own passkeys | INSERT | public | permissive |  | `auth.uid() = user_id` |
| `webauthn_credentials` | Users can update their own passkeys | UPDATE | public | permissive | `auth.uid() = user_id` |  |
| `webauthn_credentials` | Users can delete their own passkeys | DELETE | public | permissive | `auth.uid() = user_id` |  |
| `allowed_countries` | Admins can manage allowed countries | ALL | public | permissive | `has_role(auth.uid(), 'admin'::app_role)` |  |
| `allowed_countries` | Authenticated users can view allowed countries | SELECT | public | permissive | `auth.uid() IS NOT NULL` |  |
| `geo_access_logs` | Admins can view geo access logs | SELECT | public | permissive | `has_role(auth.uid(), 'admin'::app_role)` |  |
| `password_reset_requests` | Admins can manage all reset requests | ALL | public | permissive | `has_role(auth.uid(), 'admin'::app_role)` |  |
| `password_reset_requests` | Users can view own reset requests | SELECT | public | permissive | `auth.uid() = user_id` |  |
| `candidatos` | HR staff can view candidates | SELECT | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `candidatos` | HR staff can insert candidates | INSERT | authenticated | permissive |  | `is_hr_staff(auth.uid())` |
| `candidatos` | HR staff can update candidates | UPDATE | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `candidatos` | Admins can delete candidates | DELETE | authenticated | permissive | `has_role(auth.uid(), 'admin')` |  |
| `entrevistas` | HR staff can view interviews | SELECT | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `entrevistas` | HR staff can create interviews | INSERT | authenticated | permissive |  | `is_hr_staff(auth.uid())` |
| `entrevistas` | HR staff can update interviews | UPDATE | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `entrevistas` | Admins can delete interviews | DELETE | authenticated | permissive | `has_role(auth.uid(), 'admin')` |  |
| `processos_seletivos` | HR staff can view selection processes | SELECT | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `processos_seletivos` | HR staff can create selection processes | INSERT | authenticated | permissive |  | `is_hr_staff(auth.uid())` |
| `processos_seletivos` | HR staff can update selection processes | UPDATE | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `processos_seletivos` | Admins can delete selection processes | DELETE | authenticated | permissive | `has_role(auth.uid(), 'admin')` |  |
| `vagas` | HR staff can create vagas | INSERT | authenticated | permissive |  | `is_hr_staff(auth.uid())` |
| `vagas` | HR staff can update vagas | UPDATE | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `vagas` | Admins can delete vagas | DELETE | authenticated | permissive | `has_role(auth.uid(), 'admin')` |  |
| `provas` | HR staff can create provas | INSERT | authenticated | permissive |  | `is_hr_staff(auth.uid())` |
| `provas` | HR staff can update provas | UPDATE | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `provas` | Admins can delete provas | DELETE | authenticated | permissive | `has_role(auth.uid(), 'admin')` |  |
| `questoes` | HR staff can create questoes | INSERT | authenticated | permissive |  | `is_hr_staff(auth.uid())` |
| `questoes` | HR staff can update questoes | UPDATE | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `questoes` | Admins can delete questoes | DELETE | authenticated | permissive | `has_role(auth.uid(), 'admin')` |  |
| `baterias_provas` | HR staff can create baterias | INSERT | authenticated | permissive |  | `is_hr_staff(auth.uid())` |
| `baterias_provas` | HR staff can update baterias | UPDATE | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `baterias_provas` | Admins can delete baterias | DELETE | authenticated | permissive | `has_role(auth.uid(), 'admin')` |  |
| `bateria_provas_rel` | HR staff can create bateria_provas_rel | INSERT | authenticated | permissive |  | `is_hr_staff(auth.uid())` |
| `bateria_provas_rel` | HR staff can update bateria_provas_rel | UPDATE | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `bateria_provas_rel` | Admins can delete bateria_provas_rel | DELETE | authenticated | permissive | `has_role(auth.uid(), 'admin')` |  |
| `resultados_provas` | HR staff can create resultados | INSERT | authenticated | permissive |  | `is_hr_staff(auth.uid())` |
| `resultados_provas` | HR staff can update resultados | UPDATE | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `indicacoes` | HR staff can create indicacoes | INSERT | authenticated | permissive |  | `is_hr_staff(auth.uid())` |
| `indicacoes` | HR staff can update indicacoes | UPDATE | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `comunicacoes` | HR staff can create comunicacoes | INSERT | authenticated | permissive |  | `is_hr_staff(auth.uid())` |
| `match_scores` | HR staff can create match_scores | INSERT | authenticated | permissive |  | `is_hr_staff(auth.uid())` |
| `avaliacoes_comportamentais_resultados` | Staff can view all behavioral assessments | SELECT | public | permissive | `public.is_hr_staff(auth.uid())` |  |
| `avaliacoes_comportamentais_resultados` | Staff can insert behavioral assessments | INSERT | public | permissive |  | `public.is_hr_staff(auth.uid())` |
| `avaliacoes_comportamentais_resultados` | Staff can update behavioral assessments | UPDATE | public | permissive | `public.is_hr_staff(auth.uid())` |  |
| `avaliacoes_comportamentais_resultados` | Staff can delete behavioral assessments | DELETE | public | permissive | `public.is_hr_staff(auth.uid())` |  |
| `perfis_comportamentais_empresa` | Staff can view all company profiles | SELECT | public | permissive | `public.is_hr_staff(auth.uid())` |  |
| `perfis_comportamentais_empresa` | Staff can insert company profiles | INSERT | public | permissive |  | `public.is_hr_staff(auth.uid())` |
| `perfis_comportamentais_empresa` | Staff can update company profiles | UPDATE | public | permissive | `public.is_hr_staff(auth.uid())` |  |
| `perfis_comportamentais_empresa` | Staff can delete company profiles | DELETE | public | permissive | `public.is_hr_staff(auth.uid())` |  |
| `user_gamification` | Users can view their own gamification data | SELECT | public | permissive | `auth.uid() = user_id` |  |
| `user_achievements` | Users can view their own achievements | SELECT | public | permissive | `auth.uid() = user_id` |  |
| `xp_transactions` | Users can view their own XP transactions | SELECT | public | permissive | `auth.uid() = user_id` |  |
| `user_badges` | Users can view their own badges | SELECT | public | permissive | `auth.uid() = user_id` |  |
| `behavioral_assessment_results` | Staff can update behavioral results | UPDATE | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `behavioral_assessment_results` | Staff can delete behavioral results | DELETE | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `password_reset_tokens` | Users can view own reset tokens | SELECT | authenticated | permissive | `auth.uid() = user_id` |  |
| `login_attempts` | Admins can view login_attempts | SELECT | authenticated | permissive | `public.has_role(auth.uid(), 'admin')` |  |
| `template_perguntas` | HR staff can manage template_perguntas | ALL | authenticated | permissive | `public.is_hr_staff(auth.uid())` | `public.is_hr_staff(auth.uid())` |
| `match_scores` | HR staff can view match_scores | SELECT | authenticated | permissive | `public.is_hr_staff(auth.uid())` |  |
| `comunicacoes` | HR staff can view comunicacoes | SELECT | authenticated | permissive | `public.is_hr_staff(auth.uid())` |  |
| `indicacoes` | HR staff can view indicacoes | SELECT | authenticated | permissive | `public.is_hr_staff(auth.uid())` |  |
| `assessment_respostas` | HR staff can manage assessment_respostas | ALL | authenticated | permissive | `public.is_hr_staff(auth.uid())` | `public.is_hr_staff(auth.uid())` |
| `scorecards` | HR staff can manage scorecards | ALL | authenticated | permissive | `public.is_hr_staff(auth.uid())` | `public.is_hr_staff(auth.uid())` |
| `entrevista_respostas` | HR staff can manage entrevista_respostas | ALL | authenticated | permissive | `public.is_hr_staff(auth.uid())` | `public.is_hr_staff(auth.uid())` |
| `comparativos_candidatos` | HR staff can manage comparativos | ALL | authenticated | permissive | `public.is_hr_staff(auth.uid())` | `public.is_hr_staff(auth.uid())` |
| `candidaturas` | HR staff can view all candidaturas | SELECT | authenticated | permissive | `public.is_hr_staff(auth.uid())` |  |
| `regras_automacao` | HR staff can manage regras_automacao | ALL | authenticated | permissive | `public.is_hr_staff(auth.uid())` | `public.is_hr_staff(auth.uid())` |
| `assessment_questoes` | HR staff can manage assessment_questoes | ALL | authenticated | permissive | `public.is_hr_staff(auth.uid())` | `public.is_hr_staff(auth.uid())` |
| `perfis_cargo` | HR staff can manage perfis_cargo | ALL | authenticated | permissive | `public.is_hr_staff(auth.uid())` | `public.is_hr_staff(auth.uid())` |
| `scorecard_competencias` | HR staff can manage scorecard_competencias | ALL | authenticated | permissive | `public.is_hr_staff(auth.uid())` | `public.is_hr_staff(auth.uid())` |
| `competencias` | HR staff can manage competencias | ALL | authenticated | permissive | `public.is_hr_staff(auth.uid())` | `public.is_hr_staff(auth.uid())` |
| `criterios_selecao` | HR staff can manage criterios_selecao | ALL | authenticated | permissive | `public.is_hr_staff(auth.uid())` | `public.is_hr_staff(auth.uid())` |
| `regras_log` | HR staff can manage regras_log | ALL | authenticated | permissive | `public.is_hr_staff(auth.uid())` | `public.is_hr_staff(auth.uid())` |
| `templates_entrevista` | HR staff can manage templates_entrevista | ALL | authenticated | permissive | `public.is_hr_staff(auth.uid())` | `public.is_hr_staff(auth.uid())` |
| `templates_entrevista` | Authenticated can view templates_entrevista | SELECT | authenticated | permissive | `true` |  |
| `assessments` | HR staff can manage assessments | ALL | authenticated | permissive | `public.is_hr_staff(auth.uid())` | `public.is_hr_staff(auth.uid())` |
| `assessments` | Authenticated can view assessments | SELECT | authenticated | permissive | `true` |  |
| `valores_culturais` | HR staff can manage valores_culturais | ALL | authenticated | permissive | `public.is_hr_staff(auth.uid())` | `public.is_hr_staff(auth.uid())` |
| `valores_culturais` | Authenticated can view valores_culturais | SELECT | authenticated | permissive | `true` |  |
| `perfil_valores` | HR staff can manage perfil_valores | ALL | authenticated | permissive | `public.is_hr_staff(auth.uid())` | `public.is_hr_staff(auth.uid())` |
| `provas` | Authenticated can view provas | SELECT | authenticated | permissive | `true` |  |
| `baterias_provas` | Authenticated can view baterias | SELECT | authenticated | permissive | `true` |  |
| `bateria_provas_rel` | Authenticated can view bateria_rel | SELECT | authenticated | permissive | `true` |  |
| `resultados_provas` | HR staff can view all resultados | SELECT | authenticated | permissive | `public.is_hr_staff(auth.uid())` |  |
| `resultados_provas` | Candidates can view own resultados | SELECT | authenticated | permissive | `candidato_id IN ( SELECT c.id FROM candidatos c JOIN candidatos_auth ca ON ca.candidato_id = c.id WHERE ca.user_id = auth.uid() )` |  |
| `assessment_respostas` | Candidates view own assessment_respostas | SELECT | authenticated | permissive | `public.is_hr_staff(auth.uid()) OR candidato_id IN ( SELECT c.id FROM candidatos c JOIN candidatos_auth ca ON ca.candidato_id = c.id WHERE ca.user_id = auth.uid() )` |  |
| `regras_log` | HR staff can view regras_log | SELECT | authenticated | permissive | `public.is_hr_staff(auth.uid())` |  |
| `vagas` | HR staff can view all vagas | SELECT | authenticated | permissive | `public.is_hr_staff(auth.uid())` |  |
| `questoes` | HR staff can view all questoes | SELECT | authenticated | permissive | `public.is_hr_staff(auth.uid())` |  |
| `avaliacoes` | HR staff can manage avaliacoes | ALL | authenticated | permissive | `is_hr_staff(auth.uid())` | `is_hr_staff(auth.uid())` |
| `avaliacoes` | Users can view own avaliacoes | SELECT | authenticated | permissive | `avaliador_id = auth.uid()` |  |
| `user_2fa` | Users can update own 2FA | UPDATE | authenticated | permissive | `auth.uid() = user_id` |  |
| `password_reset_requests` | Auth users create own reset requests | INSERT | authenticated | permissive |  | `auth.uid() = user_id` |
| `behavioral_assessment_results` | HR inserts behavioral results | INSERT | authenticated | permissive |  | `is_hr_staff(auth.uid())` |
| `assessment_respostas` | Validated assessment insert | INSERT | authenticated | permissive |  | `is_hr_staff(auth.uid()) OR candidato_id IN ( SELECT c.id FROM candidatos c JOIN candidatos_auth ca ON ca.candidato_id = c.id WHERE ca.user_id = auth.uid() )` |
| `template_perguntas` | HR views template_perguntas | SELECT | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `user_2fa` | Service role reads 2FA | SELECT | service_role | permissive | `true` |  |
| `behavioral_assessment_results` | Users view behavioral results | SELECT | authenticated | permissive | `is_hr_staff(auth.uid()) OR candidato_id IN ( SELECT c.id FROM candidatos c JOIN candidatos_auth ca ON ca.candidato_id = c.id WHERE ca.user_id = auth.uid() )` |  |
| `allowed_ips` | HR staff can view allowed IPs | SELECT | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `assessment_questoes` | HR staff can view assessment_questoes | SELECT | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `competencias` | HR staff can view competencias | SELECT | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `perfis_cargo` | HR staff can view perfis_cargo | SELECT | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `criterios_selecao` | HR staff can view criterios_selecao | SELECT | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `perfil_valores` | HR staff can view perfil_valores | SELECT | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `regras_automacao` | HR staff can view regras_automacao | SELECT | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `email_templates` | HR view email templates | SELECT | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `email_templates` | HR manage email templates | ALL | authenticated | permissive | `is_hr_staff(auth.uid())` | `is_hr_staff(auth.uid())` |
| `documentos_candidatos` | HR view documents | SELECT | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `documentos_candidatos` | HR manage documents | ALL | authenticated | permissive | `is_hr_staff(auth.uid())` | `is_hr_staff(auth.uid())` |
| `documentos_candidatos` | Candidates view own docs | SELECT | authenticated | permissive | `candidato_id IN (SELECT c.id FROM candidatos c JOIN candidatos_auth ca ON ca.candidato_id = c.id WHERE ca.user_id = auth.uid())` |  |
| `documentos_candidatos` | Candidates upload own docs | INSERT | authenticated | permissive |  | `candidato_id IN (SELECT c.id FROM candidatos c JOIN candidatos_auth ca ON ca.candidato_id = c.id WHERE ca.user_id = auth.uid())` |
| `notas_candidatos` | HR view notes | SELECT | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `notas_candidatos` | HR manage notes | ALL | authenticated | permissive | `is_hr_staff(auth.uid())` | `is_hr_staff(auth.uid())` |
| `historico_etapas` | HR view history | SELECT | authenticated | permissive | `is_hr_staff(auth.uid())` |  |
| `notificacoes_candidato` | Candidates view own notifications | SELECT | authenticated | permissive | `candidato_auth_id IN ( SELECT id FROM public.candidatos_auth WHERE user_id = auth.uid() )` |  |
| `notificacoes_candidato` | Candidates update own notifications | UPDATE | authenticated | permissive | `candidato_auth_id IN ( SELECT id FROM public.candidatos_auth WHERE user_id = auth.uid() )` |  |
| `notificacoes_candidato` | HR insert candidate notifications | INSERT | authenticated | permissive |  | `is_hr_staff(auth.uid())` |
| `feature_flags` | Feature flags are viewable by everyone | SELECT | public | permissive | `true` |  |
| `feature_flags` | Only admins can manage feature flags | ALL | public | permissive | `public.has_role(auth.uid(), 'admin')` | `public.has_role(auth.uid(), 'admin')` |
| `departamentos` | Departamentos viewable by everyone | SELECT | public | permissive | `true` |  |
| `departamentos` | Admins can manage departamentos | ALL | public | permissive | `public.has_role(auth.uid(), 'admin')` |  |
| `vagas` | Gestores can view their department jobs | SELECT | public | permissive | `public.has_role(auth.uid(), 'gestor') AND departamento_id = (SELECT departamento_id FROM public.profiles WHERE user_id = auth.uid())` |  |
| `web_vitals` | Admins can read web vitals | SELECT | authenticated | permissive | `public.has_role(auth.uid(), 'admin')` |  |
| `user_badges` | Service role inserts badges | INSERT | service_role | permissive |  | `true` |
| `notificacoes_candidato` | Service role insert notifications | INSERT | service_role | permissive |  | `true` |
| `user_2fa_logs` | Service role inserts 2FA logs | INSERT | service_role | permissive |  | `true` |
| `ip_access_logs` | Service role inserts IP logs | INSERT | service_role | permissive |  | `true` |
| `xp_transactions` | Service role inserts XP | INSERT | service_role | permissive |  | `true` |
| `user_achievements` | Service role inserts achievements | INSERT | service_role | permissive |  | `true` |
| `user_gamification` | Service role inserts gamification | INSERT | service_role | permissive |  | `true` |
| `user_gamification` | Service role updates gamification | UPDATE | service_role | permissive | `true` |  |
| `geo_access_logs` | Service role inserts geo logs | INSERT | service_role | permissive |  | `true` |
| `historico_etapas` | Service role inserts history | INSERT | service_role | permissive |  | `true` |
| `notifications` | Service role inserts notifications | INSERT | service_role | permissive |  | `true` |
| `rate_limit_logs` | Service role inserts rate limit logs | INSERT | service_role | permissive |  | `true` |
| `login_attempts` | Service role manages login_attempts | ALL | service_role | permissive | `true` | `true` |
| `password_reset_tokens` | Service role manages reset tokens | ALL | service_role | permissive | `true` | `true` |
| `password_reset_requests` | Service role manages resets | ALL | service_role | permissive | `true` | `true` |
| `rate_limits` | service role manages rate limits | ALL | service_role | permissive | `true` | `true` |
| `web_vitals` | Anyone can insert web vitals | INSERT | anon, authenticated | permissive |  | `true` |
| `ai_cache` | ai_cache service_role only | ALL | service_role | permissive | `true` | `true` |
| `communication_retry_queue` | Service role manages retry queue | ALL | service_role | permissive | `true` | `true` |
| `integration_health_events` | service_role manages integration health events | ALL | service_role | permissive | `true` | `true` |
| `admin_audit_log` | admins read audit log | SELECT | authenticated | permissive | `public.has_role(auth.uid(), 'admin')` |  |
| `admin_audit_log` | nobody updates audit log | UPDATE | authenticated | permissive | `false` |  |
| `admin_audit_log` | nobody deletes audit log | DELETE | authenticated | permissive | `false` |  |
| `empresa_branding` | Branding público visível para todos | SELECT | public | permissive | `ativo = true` |  |
| `empresa_branding` | Admins gerenciam branding | ALL | authenticated | permissive | `public.has_role(auth.uid(), 'admin')` | `public.has_role(auth.uid(), 'admin')` |
| `hunter_leads` | Recrutadores gerenciam seus próprios leads | ALL | authenticated | permissive | `auth.uid() = recrutador_id OR public.is_hr_staff(auth.uid())` | `auth.uid() = recrutador_id OR public.is_hr_staff(auth.uid())` |
| `vaga_interview_kits` | Authenticated can view vaga_interview_kits | SELECT | authenticated | permissive | `true` |  |
| `vaga_interview_kits` | HR staff can manage vaga_interview_kits | ALL | authenticated | permissive | `public.is_hr_staff(auth.uid())` | `public.is_hr_staff(auth.uid())` |
| … +21 linhas — lista completa em `context.json` | | | | | | |

## C. Restrições de dados (obrigatório / único / default / CHECK / FK / calculada)

| Tabela | Coluna | Regra |
|---|---|---|
| `allowed_ips` | `id` | PK; default gen_random_uuid() |
| `allowed_ips` | `ip_address` | obrigatório; único |
| `allowed_ips` | `is_active` | default true |
| `allowed_ips` | `created_at` | default now() |
| `allowed_ips` | `updated_at` | default now() |
| `ip_access_logs` | `id` | PK; default gen_random_uuid() |
| `ip_access_logs` | `ip_address` | obrigatório |
| `ip_access_logs` | `action` | obrigatório |
| `ip_access_logs` | `allowed` | obrigatório |
| `ip_access_logs` | `created_at` | default now() |
| `saved_filters` | `id` | PK; default gen_random_uuid() |
| `saved_filters` | `user_id` | obrigatório; FK → users.id ON DELETE CASCADE |
| `saved_filters` | `entity_type` | obrigatório |
| `saved_filters` | `name` | obrigatório |
| `saved_filters` | `filters` | default '{}'::jsonb |
| `saved_filters` | `is_default` | default false |
| `saved_filters` | `created_at` | default NOW() |
| `saved_filters` | `updated_at` | default NOW() |
| `saved_filters` | `(tabela)` | CONSTRAINT unique_filter_name_per_user_entity UNIQUE (user_id, entity_type, name) |
| `entity_versions` | `id` | PK; default gen_random_uuid() |
| `entity_versions` | `entity_type` | obrigatório |
| `entity_versions` | `entity_id` | obrigatório |
| `entity_versions` | `version_number` | obrigatório |
| `entity_versions` | `data` | default '{}'::jsonb |
| `entity_versions` | `changed_by` | FK → users.id |
| `entity_versions` | `changed_at` | default NOW() |
| `entity_versions` | `(tabela)` | CONSTRAINT unique_entity_version UNIQUE (entity_type, entity_id, version_number) |
| `vagas` | `id` | PK; default gen_random_uuid() |
| `vagas` | `titulo` | obrigatório |
| `vagas` | `departamento` | obrigatório |
| `vagas` | `quantidade` | default 1 |
| `vagas` | `tipo_contrato` | default 'clt' |
| `vagas` | `modalidade` | default 'presencial' |
| `vagas` | `salario_a_combinar` | default false |
| `vagas` | `beneficios` | default '{}'::TEXT[] |
| `vagas` | `perguntas_triagem` | default '[]'::JSONB |
| `vagas` | `skills_avaliacao` | default '{}'::TEXT[] |
| `vagas` | `status` | default 'rascunho' |
| `vagas` | `prioridade` | default 'media' |
| `vagas` | `data_criacao` | default now() |
| `vagas` | `total_candidatos` | default 0 |
| `vagas` | `em_processo` | default 0 |
| `vagas` | `contratados` | default 0 |
| `vagas` | `created_at` | default now() |
| `vagas` | `updated_at` | default now() |
| `vagas` | `workflow_id` | FK → workflows.id |
| `vagas` | `departamento_id` | FK → departamentos.id |
| `candidatos` | `id` | PK; default gen_random_uuid() |
| `candidatos` | `nome` | obrigatório |
| `candidatos` | `email` | obrigatório |
| `candidatos` | `habilidades` | default '{}' |
| `candidatos` | `experiencias` | default '[]' |
| `candidatos` | `formacao` | default '[]' |
| `candidatos` | `fonte` | default 'parser_curriculo' |
| `candidatos` | `status` | default 'novo' |
| `candidatos` | `created_at` | default now() |
| `candidatos` | `updated_at` | default now() |
| `candidatos` | `in_talent_pool` | default false |
| `candidatos` | `tags` | default '{}' |
| `candidatos` | `aberto_a_oportunidades` | obrigatório |
| `candidatos` | `pretensao_moeda` | obrigatório |
| `entrevistas` | `id` | PK; default gen_random_uuid() |
| `entrevistas` | `candidato_id` | FK → candidatos.id ON DELETE CASCADE |
| `entrevistas` | `candidato_nome` | obrigatório |
| `entrevistas` | `vaga_id` | obrigatório; FK → vagas.id ON DELETE SET NULL |
| `entrevistas` | `vaga_titulo` | obrigatório |
| `entrevistas` | `tipo` | obrigatório; CHECK tipo IN ('presencial', 'online', 'telefone') |
| `entrevistas` | `data` | obrigatório |
| `entrevistas` | `hora_inicio` | obrigatório |
| `entrevistas` | `hora_fim` | obrigatório |
| `entrevistas` | `entrevistadores` | default ARRAY[]::TEXT[] |
| `entrevistas` | `etapa` | obrigatório |
| `entrevistas` | `status` | default 'agendada'; CHECK status IN ('agendada', 'confirmada', 'realizada', 'cancelada', 'reagendada') |
| `entrevistas` | `feedback_resultado` | CHECK feedback_resultado IN ('aprovado', 'reprovado', 'pendente') |
| `entrevistas` | `feedback_pontos_fortes` | default ARRAY[]::TEXT[] |
| `entrevistas` | `feedback_pontos_melhorar` | default ARRAY[]::TEXT[] |
| `entrevistas` | `created_at` | default now() |
| `entrevistas` | `updated_at` | default now() |
| `entrevistas` | `created_by` | FK → users.id |
| `entrevistas` | `template_id` | FK → templates_entrevista.id ON DELETE SET NULL |
| `entrevistas` | `(tabela)` | constraint entrevistas_vaga_id_fkey FOREIGN KEY (vaga_id) REFERENCES vagas(id) ON DELETE SET NULL |
| `email_templates` | `id` | PK; default gen_random_uuid() |
| `email_templates` | `nome` | obrigatório |
| `email_templates` | `assunto` | obrigatório |
| `email_templates` | `conteudo` | obrigatório |
| `email_templates` | `etapa` | default 'geral' |
| `email_templates` | `categoria` | default 'geral' |
| `email_templates` | `variaveis` | default '{}' |
| `email_templates` | `ativo` | default true |
| `email_templates` | `created_by` | FK → users.id ON DELETE SET NULL |
| `email_templates` | `created_at` | default now() |
| `email_templates` | `updated_at` | default now() |
| `workflows` | `id` | PK; default gen_random_uuid() |
| `workflows` | `name` | obrigatório |
| `workflows` | `is_default` | default false |
| `workflows` | `is_active` | default true |
| `workflows` | `created_by` | FK → users.id |
| `workflows` | `created_at` | default NOW() |
| `workflows` | `updated_at` | default NOW() |
| `workflow_etapas` | `id` | PK; default gen_random_uuid() |
| `workflow_etapas` | `workflow_id` | obrigatório; FK → workflows.id ON DELETE CASCADE |
| `workflow_etapas` | `nome` | obrigatório |
| `workflow_etapas` | `ordem` | obrigatório |
| `workflow_etapas` | `tipo` | default 'manual'; CHECK tipo IN ('automatico', 'manual') |
| `match_scores` | `id` | PK; default gen_random_uuid() |
| `match_scores` | `candidato_id` | obrigatório; FK → candidatos.id ON DELETE CASCADE |
| `match_scores` | `vaga_id` | obrigatório |
| `match_scores` | `vaga_titulo` | obrigatório |
| `match_scores` | `score_total` | obrigatório |
| `match_scores` | `habilidades_match` | default '{}' |
| `match_scores` | `habilidades_faltantes` | default '{}' |
| `match_scores` | `habilidades_extras` | default '{}' |
| `match_scores` | `pontos_fortes` | default '{}' |
| `match_scores` | `pontos_atencao` | default '{}' |
| `match_scores` | `created_at` | default now() |
| `profiles` | `id` | PK; default gen_random_uuid() |
| `profiles` | `user_id` | obrigatório; único; FK → users.id ON DELETE CASCADE |
| `profiles` | `nome` | obrigatório |
| `profiles` | `email` | obrigatório |
| `profiles` | `created_at` | default now() |
| `profiles` | `updated_at` | default now() |
| `profiles` | `role` | default 'recrutador' |
| `profiles` | `departamento_id` | FK → departamentos.id |
| `user_roles` | `id` | PK; default gen_random_uuid() |
| `user_roles` | `user_id` | obrigatório; FK → users.id ON DELETE CASCADE |
| `user_roles` | `role_id` | obrigatório; FK → roles.id ON DELETE CASCADE |
| `user_roles` | `tenant_id` | FK → tenants.id ON DELETE CASCADE |
| `user_roles` | `created_at` | default NOW() |
| `user_roles` | `requires_2fa` | default FALSE |
| `user_roles` | `role` | obrigatório |
| `user_roles` | `(tabela)` | UNIQUE(user_id, role_id, tenant_id) |
| `comunicacoes` | `id` | PK; default gen_random_uuid() |
| `comunicacoes` | `candidato_id` | obrigatório; FK → candidatos.id ON DELETE CASCADE |
| `comunicacoes` | `template_nome` | obrigatório |
| `comunicacoes` | `template_etapa` | obrigatório |
| `comunicacoes` | `assunto` | obrigatório |
| `comunicacoes` | `conteudo` | obrigatório |
| `comunicacoes` | `enviado_por` | FK → users.id |
| `comunicacoes` | `enviado_em` | default now() |
| `comunicacoes` | `created_at` | default now() |
| `comunicacoes` | `idempotency_key` | único |
| `processos_seletivos` | `id` | PK; default gen_random_uuid() |
| `processos_seletivos` | `vaga_id` | FK → vagas.id ON DELETE CASCADE |
| `processos_seletivos` | `vaga_titulo` | obrigatório |
| `processos_seletivos` | `candidato_id` | FK → candidatos.id ON DELETE CASCADE |
| `processos_seletivos` | `candidato_nome` | obrigatório |
| `processos_seletivos` | `etapa_atual` | default 'novo' |
| `processos_seletivos` | `status` | default 'em_andamento' |
| `processos_seletivos` | `match_score` | default 0 |
| `processos_seletivos` | `origem` | default 'portal' |
| `processos_seletivos` | `data_inscricao` | default now() |
| `processos_seletivos` | `data_ultima_movimentacao` | default now() |
| `processos_seletivos` | `dias_na_etapa` | default 0 |
| `processos_seletivos` | `created_at` | default now() |
| `processos_seletivos` | `updated_at` | default now() |
| `avaliacoes` | `id` | PK; default gen_random_uuid() |
| `avaliacoes` | `processo_id` | FK → processos_seletivos.id ON DELETE CASCADE |
| `avaliacoes` | `etapa` | default 'entrevista_rh' |
| `avaliacoes` | `parecer` | default 'em_duvida' |
| `avaliacoes` | `notas_tecnicas` | default '[]'::jsonb |
| `avaliacoes` | `notas_comportamentais` | default '[]'::jsonb |
| `avaliacoes` | `created_at` | default now() |
| `avaliacoes` | `updated_at` | default now() |
| `provas` | `id` | PK; default gen_random_uuid() |
| `provas` | `titulo` | obrigatório |
| `provas` | `categoria` | obrigatório; CHECK categoria IN ('cognitivo', 'comportamental', 'tecnico', 'idiomas', 'situacional', 'competencias') |
| `provas` | `departamentos` | default '{"geral"}' |
| `provas` | `niveis_aplicaveis` | default '{}' |
| `provas` | `duracao` | default 30 |
| `provas` | `total_questoes` | default 0 |
| `provas` | `pontuacao_maxima` | default 100 |
| `provas` | `nota_minima` | default 60 |
| `provas` | `ativo` | default true |
| `provas` | `aplicacoes` | default 0 |
| `provas` | `media_notas` | default 0 |
| `provas` | `tags` | default '{}' |
| `provas` | `created_at` | default now() |
| `provas` | `updated_at` | default now() |
| `resultados_provas` | `id` | PK; default gen_random_uuid() |
| `resultados_provas` | `prova_id` | obrigatório; FK → provas.id ON DELETE CASCADE |
| `resultados_provas` | `candidato_id` | FK → candidatos.id ON DELETE SET NULL |
| `resultados_provas` | `candidato_nome` | obrigatório |
| `resultados_provas` | `processo_id` | FK → processos_seletivos.id ON DELETE SET NULL |
| `resultados_provas` | `nota` | default 0 |
| `resultados_provas` | `percentual` | default 0 |
| `resultados_provas` | `tempo_gasto` | default 0 |
| `resultados_provas` | `respostas` | default '[]' |
| `resultados_provas` | `status` | default 'em_andamento'; CHECK status IN ('em_andamento', 'finalizado', 'aprovado', 'reprovado', 'em_analise') |
| `resultados_provas` | `iniciado_em` | default now() |
| `resultados_provas` | `created_at` | default now() |
| `historico_etapas` | `id` | PK; default gen_random_uuid() |
| `historico_etapas` | `processo_id` | obrigatório; FK → processos_seletivos.id ON DELETE CASCADE |
| `historico_etapas` | `etapa_nova` | obrigatório |
| `historico_etapas` | `responsavel_id` | FK → users.id ON DELETE SET NULL |
| `historico_etapas` | `created_at` | default now() |
| `candidatos_auth` | `id` | PK; default gen_random_uuid() |
| `candidatos_auth` | `user_id` | obrigatório; FK → users.id ON DELETE CASCADE |
| `candidatos_auth` | `candidato_id` | FK → candidatos.id ON DELETE SET NULL |
| `candidatos_auth` | `nome` | obrigatório |
| `candidatos_auth` | `email` | obrigatório |
| `candidatos_auth` | `created_at` | default now() |
| `candidatos_auth` | `updated_at` | default now() |
| `candidatos_auth` | `(tabela)` | UNIQUE(user_id) |
| `candidatos_auth` | `(tabela)` | UNIQUE(email) |
| `candidaturas` | `id` | PK; default gen_random_uuid() |
| `candidaturas` | `candidato_auth_id` | obrigatório; FK → candidatos_auth.id ON DELETE CASCADE |
| `candidaturas` | `vaga_id` | obrigatório; FK → vagas.id ON DELETE CASCADE |
| `candidaturas` | `processo_id` | FK → processos_seletivos.id ON DELETE SET NULL |
| `candidaturas` | `status` | default 'pendente' |
| `candidaturas` | `etapa_atual` | default 'inscricao' |
| `candidaturas` | `data_candidatura` | default now() |
| `candidaturas` | `created_at` | default now() |
| `candidaturas` | `updated_at` | default now() |
| `candidaturas` | `(tabela)` | UNIQUE(candidato_auth_id, vaga_id) |
| `indicacoes` | `id` | PK; default gen_random_uuid() |
| `indicacoes` | `indicador_user_id` | FK → users.id ON DELETE SET NULL |
| `indicacoes` | `indicador_nome` | obrigatório |
| `indicacoes` | `indicador_email` | obrigatório |
| `indicacoes` | `candidato_nome` | obrigatório |
| `indicacoes` | `candidato_email` | obrigatório |
| `indicacoes` | `vaga_id` | FK → vagas.id ON DELETE SET NULL |
| `indicacoes` | `vaga_titulo` | obrigatório |
| `indicacoes` | `status` | default 'pendente'; CHECK status IN ('pendente', 'em_analise', 'aprovado', 'contratado', 'reprovado') |
| `indicacoes` | `bonus` | default 0 |
| `indicacoes` | `created_at` | default now() |
| `indicacoes` | `updated_at` | default now() |
| `questoes` | `id` | PK; default gen_random_uuid() |
| `questoes` | `prova_id` | obrigatório; FK → provas.id ON DELETE CASCADE |
| `questoes` | `enunciado` | obrigatório |
| `questoes` | `tipo` | obrigatório; CHECK tipo IN ('multipla_escolha', 'dissertativa', 'verdadeiro_falso', 'pratica') |
| `questoes` | `alternativas` | default '[]' |
| `questoes` | `pontuacao` | default 1 |
| `questoes` | `dificuldade` | default 'medio'; CHECK dificuldade IN ('facil', 'medio', 'dificil') |
| `questoes` | `ordem` | default 0 |
| `questoes` | `created_at` | default now() |
| `baterias_provas` | `id` | PK; default gen_random_uuid() |
| `baterias_provas` | `nome` | obrigatório |
| `baterias_provas` | `departamento` | default 'geral' |
| `baterias_provas` | `nivel` | default 'junior' |
| `baterias_provas` | `duracao_total` | default 0 |
| `baterias_provas` | `ativo` | default true |
| `baterias_provas` | `created_at` | default now() |
| `baterias_provas` | `updated_at` | default now() |
| `bateria_provas_rel` | `id` | PK; default gen_random_uuid() |
| `bateria_provas_rel` | `bateria_id` | obrigatório; FK → baterias_provas.id ON DELETE CASCADE |
| `bateria_provas_rel` | `prova_id` | obrigatório; FK → provas.id ON DELETE CASCADE |
| `bateria_provas_rel` | `obrigatoria` | default true |
| `bateria_provas_rel` | `ordem` | default 0 |
| `bateria_provas_rel` | `(tabela)` | UNIQUE(bateria_id, prova_id) |
| `user_2fa` | `id` | PK; default gen_random_uuid() |
| `user_2fa` | `user_id` | obrigatório; único |
| `user_2fa` | `secret` | obrigatório |
| `user_2fa` | `backup_codes` | default '{}' |
| `user_2fa` | `enabled` | default false |
| `user_2fa` | `created_at` | default now() |
| `user_2fa` | `updated_at` | default now() |
| `user_2fa_logs` | `id` | PK; default gen_random_uuid() |
| `user_2fa_logs` | `user_id` | obrigatório |
| `user_2fa_logs` | `action` | obrigatório |
| `user_2fa_logs` | `success` | default false |
| `user_2fa_logs` | `created_at` | default now() |
| `user_consents` | `id` | PK; default gen_random_uuid() |
| `user_consents` | `user_id` | obrigatório; FK → users.id ON DELETE CASCADE |
| `user_consents` | `marketing` | default false |
| `user_consents` | `analytics` | default false |
| `user_consents` | `third_party` | default false |
| `user_consents` | `created_at` | default NOW() |
| `user_consents` | `updated_at` | default NOW() |
| `user_consents` | `(tabela)` | UNIQUE(user_id) |
| `data_deletion_requests` | `id` | PK; default gen_random_uuid() |
| `data_deletion_requests` | `user_id` | obrigatório; FK → users.id ON DELETE CASCADE |
| `data_deletion_requests` | `status` | default 'pending'; CHECK status IN ('pending', 'processing', 'completed', 'rejected') |
| `data_deletion_requests` | `requested_at` | default NOW() |
| `data_deletion_requests` | `processed_by` | FK → users.id |
| `data_access_logs` | `id` | PK; default gen_random_uuid() |
| `data_access_logs` | `user_id` | obrigatório; FK → users.id ON DELETE CASCADE |
| `data_access_logs` | `access_type` | obrigatório |
| `data_access_logs` | `accessed_at` | default NOW() |
| `tenants` | `id` | PK; default gen_random_uuid() |
| `tenants` | `name` | obrigatório |
| `tenants` | `slug` | obrigatório; único |
| `tenants` | `settings` | default '{}' |
| `tenants` | `plan` | default 'free'; CHECK plan IN ('free', 'starter', 'professional', 'enterprise') |
| `tenants` | `owner_id` | FK → users.id |
| `tenants` | `is_active` | default true |
| `tenants` | `created_at` | default NOW() |
| `tenants` | `updated_at` | default NOW() |
| `tenant_members` | `id` | PK; default gen_random_uuid() |
| `tenant_members` | `tenant_id` | obrigatório; FK → tenants.id ON DELETE CASCADE |
| `tenant_members` | `user_id` | obrigatório; FK → users.id ON DELETE CASCADE |
| `tenant_members` | `role` | default 'member'; CHECK role IN ('owner', 'admin', 'member', 'viewer') |
| `tenant_members` | `created_at` | default NOW() |
| `tenant_members` | `(tabela)` | UNIQUE(tenant_id, user_id) |
| `tenant_invites` | `id` | PK; default gen_random_uuid() |
| `tenant_invites` | `tenant_id` | obrigatório; FK → tenants.id ON DELETE CASCADE |
| `tenant_invites` | `email` | obrigatório |
| `tenant_invites` | `role` | default 'member' |
| `tenant_invites` | `token` | único; default encode(gen_random_bytes(32) |
| `tenant_invites` | `expires_at` | default NOW() |
| `tenant_invites` | `created_at` | default NOW() |
| … +542 linhas — lista completa em `context.json` | | |

## D. Automações no banco (triggers e funções — regras que rodam sozinhas)

| Trigger | Quando | Tabela | Executa | Condição |
|---|---|---|---|---|
| trigger_update_allowed_ips_timestamp | BEFORE UPDATE | `allowed_ips` | `update_allowed_ips_timestamp` |  |
| trigger_saved_filters_updated_at | BEFORE UPDATE | `saved_filters` | `update_saved_filters_updated_at` |  |
| trigger_single_default_filter | BEFORE INSERT OR UPDATE OF IS_DEFAULT | `saved_filters` | `ensure_single_default_filter` | `NEW.is_default = true` |
| update_candidatos_updated_at | BEFORE UPDATE | `candidatos` | `update_updated_at_column` |  |
| update_profiles_updated_at | BEFORE UPDATE | `profiles` | `update_updated_at_column` |  |
| on_auth_user_created | AFTER INSERT | `auth.users` | `handle_new_user` |  |
| update_resultados_provas_updated_at | BEFORE UPDATE | `resultados_provas` | `update_updated_at_column` |  |
| update_vaga_metrics_on_processo_change | AFTER INSERT OR UPDATE OR DELETE | `processos_seletivos` | `update_vaga_metrics` |  |
| log_processo_etapa_change | BEFORE UPDATE | `processos_seletivos` | `log_etapa_change` |  |
| update_entrevistas_updated_at | BEFORE UPDATE | `entrevistas` | `update_updated_at_column` |  |
| update_vagas_updated_at | BEFORE UPDATE | `vagas` | `update_updated_at_column` |  |
| update_processos_seletivos_updated_at | BEFORE UPDATE | `processos_seletivos` | `update_updated_at_column` |  |
| on_auth_user_created_candidate | AFTER INSERT | `auth.users` | `handle_new_candidate_user` |  |
| update_candidatos_auth_updated_at | BEFORE UPDATE | `candidatos_auth` | `update_updated_at_column` |  |
| update_candidaturas_updated_at | BEFORE UPDATE | `candidaturas` | `update_updated_at_column` |  |
| update_indicacoes_updated_at | BEFORE UPDATE | `indicacoes` | `update_updated_at_column` |  |
| update_provas_updated_at | BEFORE UPDATE | `provas` | `update_updated_at_column` |  |
| update_baterias_updated_at | BEFORE UPDATE | `baterias_provas` | `update_updated_at_column` |  |
| trigger_avaliacoes_updated_at | BEFORE UPDATE | `avaliacoes` | `update_avaliacoes_updated_at` |  |
| trigger_user_2fa_updated_at | BEFORE UPDATE | `user_2fa` | `update_user_2fa_updated_at` |  |
| trig_candidatos_search_vector | BEFORE INSERT OR UPDATE | `candidatos` | `update_candidatos_search_vector` |  |
| trig_vagas_search_vector | BEFORE INSERT OR UPDATE | `vagas` | `update_vagas_search_vector` |  |
| trg_candidatos_search_vector | BEFORE INSERT OR UPDATE | `candidatos` | `update_candidatos_search_vector` |  |
| trg_vagas_search_vector | BEFORE INSERT OR UPDATE | `vagas` | `update_vagas_search_vector` |  |
| update_allowed_countries_updated_at | BEFORE UPDATE | `allowed_countries` | `update_updated_at_column` |  |
| update_password_reset_requests_updated_at | BEFORE UPDATE | `password_reset_requests` | `update_updated_at_column` |  |
| update_login_attempts_updated_at | BEFORE UPDATE | `login_attempts` | `update_updated_at_column` |  |
| update_behavioral_assessment_results_updated_at | BEFORE UPDATE | `behavioral_assessment_results` | `update_updated_at_column` |  |
| update_avaliacoes_comp_updated_at | BEFORE UPDATE | `avaliacoes_comportamentais_resultados` | `update_updated_at_column` |  |
| update_perfis_comp_updated_at | BEFORE UPDATE | `perfis_comportamentais_empresa` | `update_updated_at_column` |  |
| update_user_gamification_updated_at | BEFORE UPDATE | `user_gamification` | `update_updated_at_column` |  |
| update_avaliacoes_updated_at | BEFORE UPDATE | `avaliacoes` | `update_updated_at_column` |  |
| set_email_templates_updated_at | BEFORE UPDATE | `email_templates` | `update_updated_at_column` |  |
| set_documentos_updated_at | BEFORE UPDATE | `documentos_candidatos` | `update_updated_at_column` |  |
| set_notas_updated_at | BEFORE UPDATE | `notas_candidatos` | `update_updated_at_column` |  |
| trg_log_etapa_change | AFTER UPDATE | `processos_seletivos` | `log_etapa_change` |  |
| trg_notify_candidato_etapa | AFTER UPDATE | `processos_seletivos` | `notify_candidato_etapa_change` |  |
| update_feature_flags_updated_at | BEFORE UPDATE | `feature_flags` | `update_updated_at_column` |  |
| update_communication_retry_queue_updated_at | BEFORE UPDATE | `communication_retry_queue` | `update_updated_at_column` |  |
| admin_audit_log_no_update | BEFORE UPDATE OR DELETE | `admin_audit_log` | `prevent_audit_log_mutation` |  |
| update_empresa_branding_updated_at | BEFORE UPDATE | `empresa_branding` | `update_updated_at_column` |  |
| update_hunter_leads_updated_at | BEFORE UPDATE | `hunter_leads` | `update_updated_at_column` |  |
| update_vaga_interview_kits_updated_at | BEFORE UPDATE | `vaga_interview_kits` | `update_updated_at_column` |  |
| update_triagem_ia_updated_at | BEFORE UPDATE | `triagem_ia` | `update_updated_at_column` |  |
| trg_propostas_updated_at | BEFORE UPDATE | `propostas` | `update_updated_at_column` |  |
| trg_propostas_eventos_no_update | BEFORE UPDATE OR DELETE | `propostas_eventos` | `prevent_propostas_eventos_mutation` |  |
| trg_propostas_visualizacao | AFTER UPDATE OF STATUS | `propostas` | `registrar_visualizacao_proposta` |  |
| trg_skills_updated_at | BEFORE UPDATE | `skills` | `update_updated_at_column` |  |
| trg_candidato_skills_updated_at | BEFORE UPDATE | `candidato_skills` | `update_updated_at_column` |  |
| trg_cognitive_items_updated_at | BEFORE UPDATE | `cognitive_items` | `update_updated_at_column` |  |
| trg_cognitive_sessions_updated_at | BEFORE UPDATE | `cognitive_sessions` | `update_updated_at_column` |  |
| trg_cognitive_responses_updated_at | BEFORE UPDATE | `cognitive_responses` | `update_updated_at_column` |  |

Erros lançados por funções SQL (`RAISE EXCEPTION` = regra de negócio no banco):

| Função | Mensagem | Origem |
|---|---|---|
| `award_xp` | Invalid XP amount | `supabase/migrations/20260315120152_ffcb825c-94af-478e-9a70-896ca734b034.sql` |
| `admin_list_communication_retries` | forbidden | `supabase/migrations/20260713124101_225da807-6e73-4a99-b812-7d6ecdf6b3cb.sql` |
| `admin_communication_retry_stats` | forbidden | `supabase/migrations/20260713124101_225da807-6e73-4a99-b812-7d6ecdf6b3cb.sql` |
| `admin_integration_health_summary` | forbidden | `supabase/migrations/20260713124254_47a40955-6466-46f0-b73e-7e1c0d25c73e.sql` |
| `prevent_audit_log_mutation` | admin_audit_log is immutable | `supabase/migrations/20260713124627_e0d102d4-2c2f-4462-ad19-58b2f9959fe9.sql` |
| `log_admin_action` | unauthenticated | `supabase/migrations/20260713124627_e0d102d4-2c2f-4462-ad19-58b2f9959fe9.sql` |
| `admin_list_audit_log` | forbidden | `supabase/migrations/20260713124627_e0d102d4-2c2f-4462-ad19-58b2f9959fe9.sql` |
| `admin_requeue_communication_retry` | forbidden | `supabase/migrations/20260713124627_e0d102d4-2c2f-4462-ad19-58b2f9959fe9.sql` |
| `admin_requeue_communication_retry` | not_found | `supabase/migrations/20260713124627_e0d102d4-2c2f-4462-ad19-58b2f9959fe9.sql` |
| `admin_email_delivery_sla` | forbidden | `supabase/migrations/20260715141111_76a89cc9-6130-49cf-9c71-b1dcb4fba012.sql` |
| `prevent_propostas_eventos_mutation` | propostas_eventos é imutável | `supabase/migrations/20260723133834_279fba0d-2c46-4350-8b50-1d2cb21cd652.sql` |
| `search_candidatos` | ordenacao_invalida: % | `supabase/migrations/20260726183459_bdb61566-5c86-4cfe-9c69-4e1b4bc22e62.sql` |
| `get_cognitive_session_items` | forbidden | `supabase/migrations/20260726185447_7a55c08e-dfed-437e-b9be-744c64859eed.sql` |
| `start_cognitive_session` | unauthenticated | `supabase/migrations/20260726185714_7ed8eac0-0c96-4b24-a1a7-c1d1ef853c4d.sql` |
| `start_cognitive_session` | dominios_obrigatorios | `supabase/migrations/20260726185714_7ed8eac0-0c96-4b24-a1a7-c1d1ef853c4d.sql` |
| `start_cognitive_session` | banco_de_itens_vazio | `supabase/migrations/20260726185714_7ed8eac0-0c96-4b24-a1a7-c1d1ef853c4d.sql` |
| `submit_cognitive_response` | sessao_nao_encontrada | `supabase/migrations/20260726185714_7ed8eac0-0c96-4b24-a1a7-c1d1ef853c4d.sql` |
| `submit_cognitive_response` | forbidden | `supabase/migrations/20260726185714_7ed8eac0-0c96-4b24-a1a7-c1d1ef853c4d.sql` |
| `submit_cognitive_response` | sessao_encerrada | `supabase/migrations/20260726185714_7ed8eac0-0c96-4b24-a1a7-c1d1ef853c4d.sql` |
| `submit_cognitive_response` | tempo_esgotado | `supabase/migrations/20260726185714_7ed8eac0-0c96-4b24-a1a7-c1d1ef853c4d.sql` |
| `submit_cognitive_response` | item_nao_encontrado | `supabase/migrations/20260726185714_7ed8eac0-0c96-4b24-a1a7-c1d1ef853c4d.sql` |
| `submit_cognitive_response` | item_fora_da_sessao | `supabase/migrations/20260726185714_7ed8eac0-0c96-4b24-a1a7-c1d1ef853c4d.sql` |
| `finish_cognitive_session` | sessao_nao_encontrada | `supabase/migrations/20260726185714_7ed8eac0-0c96-4b24-a1a7-c1d1ef853c4d.sql` |
| `finish_cognitive_session` | forbidden | `supabase/migrations/20260726185714_7ed8eac0-0c96-4b24-a1a7-c1d1ef853c4d.sql` |
| `get_cognitive_result` | sessao_nao_encontrada | `supabase/migrations/20260726185714_7ed8eac0-0c96-4b24-a1a7-c1d1ef853c4d.sql` |
| `get_cognitive_result` | forbidden | `supabase/migrations/20260726185714_7ed8eac0-0c96-4b24-a1a7-c1d1ef853c4d.sql` |
| `hr_funnel_sla` | forbidden | `supabase/migrations/20260726192651_4cd9b64b-769d-4e91-a063-dfa982d39319.sql` |
| `hr_sla_overdue_list` | forbidden | `supabase/migrations/20260726193022_668ebe4f-48b1-450a-9f31-f90046a86344.sql` |
| `hr_register_first_response` | forbidden | `supabase/migrations/20260726193230_ad6685cd-ad9e-49af-b697-f6803c80a3e5.sql` |
| `hr_register_first_response` | candidatura_nao_encontrada | `supabase/migrations/20260726193230_ad6685cd-ad9e-49af-b697-f6803c80a3e5.sql` |
| `hr_register_first_response` | candidatura_sem_processo | `supabase/migrations/20260726193230_ad6685cd-ad9e-49af-b697-f6803c80a3e5.sql` |
| `hr_candidatura_timeline` | forbidden | `supabase/migrations/20260726195938_0ba0193a-1e78-4bd0-a574-c15638ee6adf.sql` |
| `hr_candidatura_timeline` | candidatura_nao_encontrada | `supabase/migrations/20260726195938_0ba0193a-1e78-4bd0-a574-c15638ee6adf.sql` |

## E. Estados, máquinas de estado e transições

### E.1 Colunas de status no banco

| Tabela | Coluna | Valores permitidos (enum/CHECK) | Default |
|---|---|---|---|
| `vagas` | `estado` | **livre (sem enum/CHECK)** |  |
| `vagas` | `status` | **livre (sem enum/CHECK)** | `rascunho` |
| `candidatos` | `status` | **livre (sem enum/CHECK)** | `novo` |
| `entrevistas` | `etapa` | **livre (sem enum/CHECK)** |  |
| `entrevistas` | `status` | `agendada`, `cancelada`, `confirmada`, `reagendada`, `realizada` | `agendada` |
| `email_templates` | `etapa` | **livre (sem enum/CHECK)** | `geral` |
| `comunicacoes` | `template_etapa` | **livre (sem enum/CHECK)** |  |
| `processos_seletivos` | `status` | **livre (sem enum/CHECK)** | `em_andamento` |
| `processos_seletivos` | `dias_na_etapa` | **livre (sem enum/CHECK)** | `0` |
| `avaliacoes` | `etapa` | **livre (sem enum/CHECK)** | `entrevista_rh` |
| `resultados_provas` | `status` | `aprovado`, `em_analise`, `em_andamento`, `finalizado`, `reprovado` | `em_andamento` |
| `historico_etapas` | `etapa_anterior` | **livre (sem enum/CHECK)** |  |
| `historico_etapas` | `etapa_nova` | **livre (sem enum/CHECK)** |  |
| `candidaturas` | `status` | **livre (sem enum/CHECK)** | `pendente` |
| `indicacoes` | `status` | `aprovado`, `contratado`, `em_analise`, `pendente`, `reprovado` | `pendente` |
| `data_deletion_requests` | `status` | `completed`, `pending`, `processing`, `rejected` | `pending` |
| `workflow_stages` | `stage_order` | **livre (sem enum/CHECK)** |  |
| `password_reset_requests` | `status` | `approved`, `completed`, `expired`, `pending`, `rejected` | `pending` |
| `assessment_respostas` | `status` | **livre (sem enum/CHECK)** | `em_andamento` |
| `avaliacoes_comportamentais_resultados` | `status` | `abandonado`, `completo`, `em_andamento` | `em_andamento` |
| `communication_retry_queue` | `status` | `dead`, `failed`, `pending`, `processing`, `sent` | `pending` |
| `hunter_leads` | `status` | **livre (sem enum/CHECK)** | `novo` |
| `vaga_interview_kits` | `etapa` | **livre (sem enum/CHECK)** |  |
| `propostas` | `status` | `aceita`, `cancelada`, `enviada`, `expirada`, `rascunho`, `recusada`, `visualizada` | `rascunho` |
| `cognitive_sessions` | `status` | `em_andamento`, `concluida`, `expirada`, `cancelada` | `em_andamento` |

### E.2 Mapas de transição declarados no código

- **pulseTransition** (`src/components/empty-states/illustrations/shared.ts`):
  ```ts
  duration: 2, repeat: Infinity, ease: 'easeInOut',
  ```
- **floatTransition** (`src/components/empty-states/illustrations/shared.ts`):
  ```ts
  duration: 3, repeat: Infinity, ease: 'easeInOut',
  ```
- **shimmerTransition** (`src/components/empty-states/illustrations/shared.ts`):
  ```ts
  duration: 1.5, repeat: Infinity, ease: 'easeInOut',
  ```
- **springTransition** (`src/components/layout/AnimatedRoutes.tsx`):
  ```ts
  type: 'spring' as const, stiffness: 300, damping: 30, mass: 0.8,
  ```
- **tweenTransition** (`src/components/layout/AnimatedRoutes.tsx`):
  ```ts
  type: 'tween' as const, duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const, // Custom easing
  ```
- **workflow** (`src/hooks/useWorkflow.ts`):
  ```ts
  id: crypto.randomUUID(), name, description, active: false, nodes: [], edges: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  ```

### E.3 Valores de status usados no código (escreve / compara / filtra)

| Campo | Valor | Uso | Onde |
|---|---|---|---|
| `type` | `ADD_TOAST` | compara, escreve | `src/hooks/use-toast.ts` |
| `type` | `DISMISS_TOAST` | compara, escreve | `src/hooks/use-toast.ts` |
| `type` | `REMOVE_TOAST` | compara, escreve | `src/hooks/use-toast.ts` |
| `type` | `SKIP_WAITING` | compara, escreve | `public/sw.js`<br>`src/main.tsx` |
| `type` | `UPDATE_TOAST` | compara, escreve | `src/hooks/use-toast.ts` |
| `type` | `achievement` | compara | `src/hooks/useSoundPreferences.ts` |
| `type` | `action` | escreve | `src/components/intelligence/SmartSuggestions.tsx`<br>`src/hooks/useRegrasAutomacao.ts` |
| `type` | `agendar_entrevista` | compara, escreve | `src/hooks/useRegrasAutomacao.ts`<br>`src/services/workflowEngine.ts` |
| `type` | `array` | escreve | `src/hooks/useImportData.ts` |
| `type` | `atribuir_tag` | compara | `src/services/workflowEngine.ts` |
| `type` | `bonus_multiplier` | escreve | `src/components/gamification/PowerUps.tsx` |
| `type` | `candidate` | compara, escreve | `src/components/dna/DNAMatchSwiper.tsx`<br>`src/components/dna/DNAProfileCard.tsx`<br>`src/types/behavioralDNA.ts` |
| `type` | `candidate_moved` | escreve | `src/components/dashboard/LiveActivityFeed.tsx` |
| `type` | `candidate_new` | escreve | `src/components/dashboard/LiveActivityFeed.tsx` |
| `type` | `candidato_novo` | compara, escreve | `src/hooks/useRegrasAutomacao.ts`<br>`src/services/workflowEngine.ts`<br>`src/types/workflow.ts` |
| `type` | `candidatos` | compara, escreve | `src/components/gamification/dailyChallenges/demoChallenges.ts`<br>`src/services/reportingService.ts` |
| `type` | `celebration` | compara | `src/components/ui/confetti.tsx`<br>`src/hooks/useSoundPreferences.ts` |
| `type` | `choice` | compara, escreve | `src/components/assessments/gamified/phases/GamifiedPlayingPhase.tsx`<br>`src/data/gamifiedAssessmentData.ts` |
| `type` | `click` | compara | `src/hooks/useSoundPreferences.ts` |
| `type` | `condition` | escreve | `src/hooks/useRegrasAutomacao.ts` |
| `type` | `date` | compara | `src/components/search/AdvancedFilters.tsx` |
| `type` | `days` | compara, escreve | `src/components/gamification/StreakDisplay.tsx` |
| `type` | `delay` | escreve | `src/hooks/useRegrasAutomacao.ts` |
| `type` | `diversidade` | escreve | `src/services/reportingService.ts` |
| `type` | `doc` | compara | `src/components/intelligence/ContextualHelp.tsx` |
| `type` | `double_xp` | compara, escreve | `src/components/gamification/PowerUps.tsx` |
| `type` | `dragenter` | compara | `src/components/portal/CurriculoUpload.tsx` |
| `type` | `dragleave` | compara | `src/components/portal/CurriculoUpload.tsx` |
| `type` | `dragover` | compara | `src/components/portal/CurriculoUpload.tsx` |
| `type` | `email` | escreve | `src/components/auth/SignupForm.tsx` |
| `type` | `empresa` | compara, escreve | `src/components/deu-match/DeuMatchProfileResult.tsx` |
| `type` | `entrevista_agendada` | compara, escreve | `src/hooks/useRegrasAutomacao.ts`<br>`src/services/workflowEngine.ts` |
| `type` | `entrevistas` | compara, escreve | `src/services/reportingService.ts` |
| `type` | `enviar_email` | compara, escreve | `src/hooks/useRegrasAutomacao.ts`<br>`src/services/workflowEngine.ts`<br>`src/types/workflow.ts` |
| `type` | `enviar_teste` | compara | `src/services/workflowEngine.ts` |
| `type` | `error` | compara | `src/components/notifications/NotificationPanel.tsx`<br>`src/hooks/useSoundPreferences.ts` |
| `type` | `etapa_mudou` | compara, escreve | `src/hooks/useRegrasAutomacao.ts`<br>`src/services/workflowEngine.ts` |
| `type` | `faq` | compara | `src/components/intelligence/ContextualHelp.tsx` |
| `type` | `feedback` | compara | `supabase/functions/ai-assistant/index.ts` |
| `type` | `forced_choice` | compara, escreve | `src/components/assessments/behavioralPlayer/BehavioralQuestionRenderer.tsx`<br>`src/data/advancedBehavioralData.ts`<br>`src/data/behavioralAssessments/cognitiveBiases.ts`<br>`src/data/behavioralAssessments/disc.ts`<br>`src/data/behavioralAssessments/emotionalStates.ts`<br>… +4 |
| `type` | `funil` | compara, escreve | `src/services/reportingService.ts` |
| `type` | `games` | escreve | `src/components/gamification/dailyChallenges/demoChallenges.ts` |
| `type` | `google_meet` | compara, escreve | `src/services/meetingService.ts` |
| `type` | `guide` | compara | `src/components/intelligence/ContextualHelp.tsx` |
| `type` | `high_match` | compara, escreve | `src/components/notifications/NotificationPanel.tsx`<br>`src/hooks/useRealtimeNotifications.ts` |
| `type` | `hired` | escreve | `src/components/dashboard/LiveActivityFeed.tsx` |
| `type` | `hover` | compara | `src/hooks/useSoundPreferences.ts` |
| `type` | `interview_questions` | compara | `supabase/functions/ai-assistant/index.ts` |
| `type` | `interview_reminder` | escreve | `supabase/functions/interview-reminders/index.ts` |
| `type` | `interview_scheduled` | compara, escreve | `src/components/dashboard/LiveActivityFeed.tsx`<br>`src/components/notifications/NotificationPanel.tsx`<br>`src/hooks/useRealtimeNotifications.ts` |
| `type` | `interview_updated` | compara, escreve | `src/components/notifications/NotificationPanel.tsx`<br>`src/hooks/useRealtimeNotifications.ts` |
| `type` | `job_description` | compara | `supabase/functions/ai-assistant/index.ts` |
| `type` | `levelUp` | compara | `src/hooks/useSoundPreferences.ts` |
| `type` | `like` | escreve | `src/components/assessments/gamified/SwipeValuesCard.tsx` |
| `type` | `login` | escreve | `src/components/gamification/dailyChallenges/demoChallenges.ts` |
| `type` | `manual` | compara, escreve | `src/hooks/useRegrasAutomacao.ts`<br>`src/services/workflowEngine.ts` |
| `type` | `match_high` | escreve | `src/components/dashboard/LiveActivityFeed.tsx` |
| `type` | `mover_etapa` | compara, escreve | `src/hooks/useRegrasAutomacao.ts`<br>`src/services/workflowEngine.ts` |
| `type` | `navigation` | escreve | `src/components/intelligence/RecentActionsWidget.tsx` |
| `type` | `new_candidate` | compara | `src/components/notifications/NotificationPanel.tsx` |
| `type` | `notificar` | compara, escreve | `src/hooks/useRegrasAutomacao.ts`<br>`src/services/workflowEngine.ts` |
| `type` | `notification` | compara | `src/hooks/useSoundPreferences.ts` |
| `type` | `number` | compara | `src/components/search/AdvancedFilters.tsx` |
| `type` | `offer_sent` | escreve | `src/components/dashboard/LiveActivityFeed.tsx` |
| `type` | `overlap` | escreve | `src/components/agenda/aiScheduler/types.ts`<br>`src/components/agenda/aiScheduler/useSuggestedSlots.ts` |
| `type` | `password` | escreve | `src/components/auth/SignupForm.tsx` |
| `type` | `presencial` | escreve | `src/services/meetingService.ts` |
| `type` | `pride` | compara | `src/components/ui/confetti.tsx` |
| `type` | `priority-sort` | compara | `src/components/assessments/gamified/personalityMiniGame/PlayingPhase.tsx` |
| `type` | `public-key` | escreve | `src/hooks/useWebAuthn.ts` |
| `type` | `quick-choice` | compara, escreve | `src/components/assessments/gamified/personalityMiniGame/PlayingPhase.tsx`<br>`src/data/gamifiedAssessmentData.ts` |
| `type` | `quick-fire` | escreve | `src/data/gamifiedAssessmentData.ts` |
| `type` | `ranking` | compara, escreve | `src/components/assessments/behavioralPlayer/BehavioralQuestionRenderer.tsx`<br>`src/data/behavioralAssessments/values.ts`<br>`src/data/gamifiedAssessmentData.ts` |
| `type` | `reply` | escreve | `src/services/evolutionApiService.ts` |
| `type` | `scale` | compara, escreve | `src/components/assessments/behavioralPlayer/BehavioralQuestionRenderer.tsx`<br>`src/components/assessments/gamified/phases/GamifiedPlayingPhase.tsx`<br>`src/data/behavioralAssessments/cognitiveBiases.ts`<br>`src/data/behavioralAssessments/emotionalIntelligence.ts`<br>`src/data/behavioralAssessments/emotionalStates.ts`<br>… +6 |
| `type` | `scenario-pick` | compara, escreve | `src/components/assessments/gamified/personalityMiniGame/PlayingPhase.tsx`<br>`src/data/gamifiedAssessmentData.ts` |
| `type` | `score_threshold` | compara, escreve | `src/config/behavioralGamification.ts` |
| `type` | `security` | escreve | `supabase/functions/new-device-alert/index.ts` |
| `type` | `select` | compara, escreve | `src/components/search/AdvancedFilters.tsx`<br>`src/lib/matchSchemas.ts` |
| `type` | `situational` | compara, escreve | `src/components/assessments/behavioralPlayer/BehavioralQuestionRenderer.tsx`<br>`src/data/behavioralAssessments/sleightOfMouth.ts`<br>`src/lib/behavioral/behavioralScoring.ts` |
| `type` | `sla` | compara, escreve | `src/services/reportingService.ts` |
| `type` | `sla_vencido` | compara, escreve | `src/hooks/useRegrasAutomacao.ts`<br>`src/services/workflowEngine.ts` |
| `type` | `small` | escreve | `src/hooks/useAssessmentEngine.ts` |
| `type` | `specific_tool` | compara, escreve | `src/config/behavioralGamification.ts` |
| `type` | `spring` | escreve | `src/components/assessments/gamified/SwipeValuesCard.tsx`<br>`src/components/behavioral/BehavioralGamifiedTab.tsx`<br>`src/components/candidatos/BulkActionsBar.tsx`<br>`src/components/dashboard/AcoesPendentes.tsx`<br>`src/components/dashboard/AcoesRapidas.tsx`<br>… +44 |
| `type` | `stage_change` | compara, escreve | `src/components/notifications/NotificationPanel.tsx`<br>`src/contexts/NotificationContext.tsx`<br>`src/hooks/useRealtimeNotifications.ts` |
| `type` | `stars` | compara | `src/components/ui/confetti.tsx` |
| `type` | `streak` | escreve | `src/components/gamification/dailyChallenges/demoChallenges.ts`<br>`src/config/behavioralGamification.ts` |
| `type` | `streak_shield` | compara, escreve | `src/components/gamification/PowerUps.tsx` |
| `type` | `string` | compara | `supabase/functions/webhook-handler/index.ts` |
| `type` | `success` | compara | `src/components/notifications/NotificationPanel.tsx`<br>`src/hooks/useSoundPreferences.ts` |
| `type` | `super` | compara | `src/components/assessments/gamified/SwipeValuesCard.tsx` |
| `type` | `swipe` | compara, escreve | `src/components/assessments/gamified/engineConfig.ts`<br>`src/components/assessments/gamified/phases/GamifiedPlayingPhase.tsx` |
| `type` | `tasks` | compara | `src/components/gamification/StreakDisplay.tsx` |
| `type` | `teams` | compara | `src/services/meetingService.ts` |
| `type` | `template` | escreve | `src/services/whatsappService.ts` |
| `type` | `test_completed` | escreve | `src/components/dashboard/LiveActivityFeed.tsx` |
| `type` | `teste_concluido` | compara, escreve | `src/hooks/useRegrasAutomacao.ts`<br>`src/services/workflowEngine.ts` |
| `type` | `text` | compara, escreve | `src/components/auth/SignupForm.tsx`<br>`src/components/search/AdvancedFilters.tsx` |
| `type` | `this-or-that` | compara, escreve | `src/components/assessments/gamified/personalityMiniGame/PlayingPhase.tsx`<br>`src/data/gamifiedAssessmentData.ts` |
| `type` | `time_boost` | compara, escreve | `src/components/gamification/PowerUps.tsx` |
| `type` | `time_challenge` | compara, escreve | `src/config/behavioralGamification.ts` |
| `type` | `time_proximity` | escreve | `src/components/agenda/aiScheduler/useSuggestedSlots.ts` |
| `type` | `tip` | compara, escreve | `src/components/intelligence/ContextualHelp.tsx` |
| `type` | `tools_completed` | compara, escreve | `src/config/behavioralGamification.ts` |
| `type` | `trigger` | escreve | `src/hooks/useRegrasAutomacao.ts` |
| `type` | `tween` | escreve | `src/components/layout/AnimatedRoutes.tsx` |
| `type` | `urgent` | compara, escreve | `src/components/notifications/NotificationPanel.tsx`<br>`src/hooks/useRealtimeNotifications.ts` |
| `type` | `vagas` | compara, escreve | `src/components/reports/ReportBuilder.tsx`<br>`src/services/reportingService.ts` |
| `type` | `video` | compara | `src/components/intelligence/ContextualHelp.tsx` |
| `type` | `warning` | compara | `src/components/notifications/NotificationPanel.tsx`<br>`src/hooks/useSoundPreferences.ts` |
| `type` | `webhook` | compara | `src/services/workflowEngine.ts` |
| `type` | `weeks` | compara | `src/components/gamification/StreakDisplay.tsx` |
| `type` | `word-association` | compara, escreve | `src/components/assessments/gamified/personalityMiniGame/PlayingPhase.tsx`<br>`src/data/gamifiedAssessmentData.ts` |
| `type` | `zoom` | compara | `src/services/meetingService.ts` |
| `status` | `CHANNEL_ERROR` | compara | `src/hooks/useRealtimeNotifications.ts` |
| `status` | `CLOSED` | compara | `src/hooks/useRealtimeNotifications.ts` |
| `status` | `CONNECTED` | compara | `supabase/functions/evolution-health/index.ts` |
| `status` | `SUBSCRIBED` | compara | `src/hooks/useRealtimeNotifications.ts` |
| `status` | `TIMED_OUT` | compara | `src/hooks/useRealtimeNotifications.ts` |
| `status` | `abandonado` | escreve | `src/hooks/behavioralResults/session.ts` |
| `status` | `aberta` | compara | `src/pages/AnalyticsPage.tsx` |
| `status` | `aceita` | compara | `src/components/offers/OfferCard.tsx`<br>`src/hooks/useAdvancedAnalytics.ts`<br>`src/pages/OfferManagementPage.tsx` |
| `status` | `agendada` | compara, escreve, filtra | `src/components/agenda/AgendarEntrevistaDialog.tsx`<br>`src/components/agenda/EntrevistaCard.tsx`<br>`src/components/agenda/EntrevistaDetalhesDialog.tsx`<br>`src/components/hiring-manager/hiringManagerMockData.ts`<br>`src/data/agendaData.ts`<br>… +4 |
| `status` | `agendado` | compara, escreve | `src/components/agenda/AgendaTimeline.tsx` |
| `status` | `aguardando_aprovacao` | compara | `src/pages/VagasList.tsx` |
| `status` | `alto` | compara, escreve | `src/components/assessments/CulturalResultView.tsx`<br>`src/types/selection.ts` |
| `status` | `approved` | escreve, filtra | `src/services/passwordResetService.ts`<br>`supabase/functions/password-reset-approval/index.ts` |
| `status` | `aprovado` | compara, escreve | `src/pages/CandidatosPage.tsx`<br>`src/pages/VagaDetalhes.tsx`<br>`src/pages/portal/PortalDashboard.tsx`<br>`src/types/candidate.ts`<br>`src/types/tests.ts` |
| `status` | `arquivado` | escreve | `src/hooks/useBulkActions.ts` |
| `status` | `ativo` | compara, escreve | `src/hooks/useTalentPool.ts`<br>`src/services/reportingService.ts` |
| `status` | `baixo` | compara | `src/components/assessments/CulturalResultView.tsx` |
| `status` | `banco_talentos` | compara, escreve, filtra | `src/hooks/useTalentPool.ts`<br>`src/types/candidate.ts` |
| `status` | `cancelada` | compara, escreve | `src/components/agenda/EntrevistaDetalhesDialog.tsx`<br>`src/hooks/useAgendaActions.ts`<br>`src/hooks/usePropostas.ts` |
| `status` | `cancelado` | compara | `src/components/agenda/AgendaTimeline.tsx` |
| `status` | `completed` | escreve | `src/services/passwordResetService.ts` |
| `status` | `completo` | escreve | `src/hooks/behavioralResults/session.ts` |
| `status` | `concluida` | filtra | `src/hooks/usePotentialIndex.ts`<br>`src/hooks/usePotentialIndexBatch.ts` |
| `status` | `concluido` | compara | `src/components/agenda/AgendaTimeline.tsx`<br>`src/components/candidato/FormacaoTab.tsx` |
| `status` | `confirmada` | compara, escreve | `src/components/agenda/EntrevistaCard.tsx`<br>`src/data/agendaData.ts`<br>`src/hooks/useAgendaActions.ts`<br>`src/hooks/useEntrevistas.ts` |
| `status` | `confirmado` | compara | `src/components/agenda/AgendaTimeline.tsx` |
| `status` | `contratado` | compara, escreve, filtra | `src/hooks/useDashboardData.ts`<br>`src/hooks/useIndicacoes.ts`<br>`src/pages/AnalyticsPage.tsx`<br>`src/pages/IndicacoesPage.tsx`<br>`src/pages/VagaDetalhes.tsx`<br>… +1 |
| `status` | `critico` | escreve | `src/lib/jobFit/jobFitCalculator.ts` |
| `status` | `dead` | compara | `src/pages/admin/DeadLetterQueuePage.tsx`<br>`supabase/functions/health/index.ts` |
| `status` | `degraded` | compara, escreve | `supabase/functions/health/index.ts` |
| `status` | `distante` | escreve | `src/lib/jobFit/jobFitCalculator.ts` |
| `status` | `down` | compara, escreve | `supabase/functions/health/index.ts` |
| `status` | `em_analise` | compara, escreve | `src/pages/IndicacoesPage.tsx` |
| `status` | `em_andamento` | compara, escreve, filtra | `src/components/agenda/AgendaTimeline.tsx`<br>`src/hooks/behavioralResults/session.ts`<br>`src/hooks/behavioralResults/types.ts`<br>`src/hooks/useDashboardData.ts`<br>`src/hooks/useProcessosSeletivos.ts`<br>… +4 |
| `status` | `em_triagem` | compara | `src/types/candidate.ts` |
| `status` | `encerrada` | compara | `src/pages/VagasList.tsx`<br>`src/services/reportingService.ts` |
| `status` | `entrevista` | compara | `src/types/candidate.ts` |
| `status` | `enviada` | compara, escreve | `src/hooks/usePropostas.ts`<br>`src/pages/AssinarPropostaPage.tsx` |
| `status` | `enviado` | escreve | `src/pages/ComunicacaoPage.tsx`<br>`src/types/recruitment.ts` |
| `status` | `error` | compara, escreve | `src/components/common/BulkProgressModal.tsx`<br>`src/pages/DiagnosticoPage.tsx`<br>`src/pages/edgeFunctionTest/StatusIndicators.tsx`<br>`src/pages/edgeFunctionTest/useEdgeFunctionTests.ts` |
| `status` | `fechada` | compara | `src/pages/AnalyticsPage.tsx` |
| `status` | `finalizado` | escreve | `src/hooks/useAssessments.ts` |
| `status` | `fulfilled` | compara | `src/hooks/useOptimisticUpdate.ts`<br>`src/hooks/useRegisterFirstResponse.ts`<br>`src/services/emailService.ts` |
| `status` | `idle` | compara, escreve | `src/pages/edgeFunctionTest/FunctionTestCard.tsx`<br>`src/pages/edgeFunctionTest/types.ts` |
| `status` | `importing` | compara | `src/components/DataImporter.tsx`<br>`src/hooks/useImportData.ts` |
| `status` | `loading` | compara, escreve | `src/pages/DiagnosticoPage.tsx`<br>`src/pages/edgeFunctionTest/FunctionTestCard.tsx`<br>`src/pages/edgeFunctionTest/StatusIndicators.tsx`<br>`src/pages/edgeFunctionTest/useEdgeFunctionTests.ts` |
| `status` | `match` | escreve | `src/lib/jobFit/jobFitCalculator.ts`<br>`src/types/jobFit.ts` |
| `status` | `medio` | compara | `src/components/assessments/CulturalResultView.tsx` |
| `status` | `nao_compareceu` | compara | `src/services/reportingService.ts` |
| `status` | `novo` | compara, escreve | `src/hooks/useLinkedInImport.ts`<br>`src/pages/CandidatosPage.tsx`<br>`src/services/reportingService.ts`<br>`src/types/candidate.ts`<br>`supabase/functions/public-apply/index.ts` |
| `status` | `ok` | escreve | `supabase/functions/health/index.ts` |
| `status` | `parsing` | compara | `src/components/DataImporter.tsx`<br>`src/hooks/useImportData.ts` |
| `status` | `pendente` | compara, escreve | `src/components/indicacoes/types.ts`<br>`src/hooks/useIndicacoes.ts`<br>`src/pages/IndicacoesPage.tsx`<br>`src/pages/portal/PortalDashboard.tsx`<br>`src/pages/portal/portalVagas/usePortalVagas.ts`<br>… +1 |
| `status` | `pending` | compara, escreve, filtra | `src/components/common/BulkProgressModal.tsx`<br>`src/services/passwordResetService.ts`<br>`supabase/functions/health/index.ts`<br>`supabase/functions/password-reset-approval/index.ts` |
| `status` | `processing` | compara | `src/components/common/BulkProgressModal.tsx`<br>`src/pages/admin/DeadLetterQueuePage.tsx` |
| `status` | `publicada` | compara, escreve, filtra | `src/components/hiring-manager/hiringManagerMockData.ts`<br>`src/components/vagas/VagaCard.tsx`<br>`src/hooks/useDashboardData.ts`<br>`src/hooks/useHiringManagerData.ts`<br>`src/hooks/useIndicacoes.ts`<br>… +11 |
| `status` | `rascunho` | compara, escreve | `src/components/offers/OfferCard.tsx`<br>`src/components/offers/OfferDetailDialog.tsx`<br>`src/components/offers/ViewOfferDialog.tsx`<br>`src/pages/VagaDetalhes.tsx` |
| `status` | `realizada` | compara, escreve, filtra | `src/components/agenda/EntrevistaDetalhesDialog.tsx`<br>`src/hooks/useAdvancedAnalytics.ts`<br>`src/hooks/useAgendaActions.ts`<br>`src/hooks/useDashboardData.ts`<br>`src/hooks/useEntrevistas.ts`<br>… +1 |
| `status` | `recusada` | compara | `src/components/offers/OfferCard.tsx` |
| `status` | `rejected` | compara, escreve | `src/services/emailService.ts`<br>`supabase/functions/password-reset-approval/index.ts` |
| `status` | `reprovado` | compara | `src/pages/CandidatosPage.tsx`<br>`src/pages/VagaDetalhes.tsx`<br>`src/pages/portal/PortalDashboard.tsx`<br>`src/types/candidate.ts` |
| `status` | `saving` | compara | `src/hooks/useFormAutoSave.ts` |
| `status` | `success` | compara, escreve | `src/components/common/BulkProgressModal.tsx`<br>`src/pages/DiagnosticoPage.tsx`<br>`src/pages/edgeFunctionTest/StatusIndicators.tsx`<br>`src/pages/edgeFunctionTest/useEdgeFunctionTests.ts`<br>`supabase/functions/geo-check/index.ts` |
| `status` | `validating` | compara | `src/components/DataImporter.tsx`<br>`src/hooks/useImportData.ts` |
| `status` | `visualizada` | escreve | `src/pages/AssinarPropostaPage.tsx` |
| `status` | `warning` | compara, escreve | `src/pages/DiagnosticoPage.tsx` |
| `etapa` | `Entrevista` | compara | `src/components/dashboard/SmartInsights.tsx` |
| `etapa` | `Proposta` | escreve | `src/components/admin/SLAConfig.tsx` |
| `etapa` | `Triagem` | compara, escreve | `src/components/admin/SLAConfig.tsx`<br>`src/components/dashboard/SmartInsights.tsx` |
| `etapa` | `avaliacao` | escreve | `src/hooks/useAvaliacaoForm.ts` |
| `etapa` | `candidatura` | escreve | `src/data/emailTemplatesData.ts` |
| `etapa` | `entrevista_final` | compara | `src/components/dashboard/TopCandidatos.tsx` |
| `etapa` | `entrevista_gestor` | compara | `src/components/dashboard/TopCandidatos.tsx` |
| `etapa` | `entrevista_rh` | escreve | `src/data/emailTemplatesData.ts` |
| `etapa` | `feedback_negativo` | escreve | `src/data/emailTemplatesData.ts` |
| `etapa` | `feedback_positivo` | escreve | `src/data/emailTemplatesData.ts` |
| `tipo` | `Final` | escreve | `src/components/hiring-manager/hiringManagerMockData.ts` |
| `tipo` | `Gestor` | escreve | `src/components/hiring-manager/hiringManagerMockData.ts` |
| `tipo` | `Técnica` | escreve | `src/components/hiring-manager/hiringManagerMockData.ts` |
| `tipo` | `agendamento` | compara | `src/hooks/useRegrasAutomacao.ts` |
| `tipo` | `agendar` | escreve | `src/hooks/useDashboardData.ts` |
| `tipo` | `alerta` | escreve | `src/components/dashboard/SmartInsights.tsx` |
| `tipo` | `aprovacao_automatica` | escreve | `src/types/selection.ts` |
| `tipo` | `atencao` | escreve | `src/components/dashboard/AlertasInteligentes.tsx` |
| `tipo` | `avaliacao` | compara | `src/components/candidato/HistoricoTab.tsx` |
| `tipo` | `avaliar` | escreve | `src/hooks/useDashboardData.ts` |
| `tipo` | `boolean` | compara | `src/components/carreiras/KnockoutQuestionsForm.tsx`<br>`src/types/knockout.ts`<br>`supabase/functions/_shared/knockout.ts` |
| `tipo` | `candidatura` | compara | `src/components/candidato/HistoricoTab.tsx` |
| `tipo` | `carta` | compara | `src/components/candidato/CurriculoTab.tsx` |
| `tipo` | `certificado` | compara | `src/components/candidato/CurriculoTab.tsx` |
| `tipo` | `combinacao_risco` | compara, escreve | `src/lib/jobFit/redFlagDetector.ts`<br>`src/lib/jobFit/redFlagRules.ts` |
| `tipo` | `comportamental` | escreve | `src/data/avaliacaoData.ts`<br>`src/hooks/useAvaliacoes.ts` |
| `tipo` | `comunicacao` | compara | `src/components/candidato/HistoricoTab.tsx`<br>`src/hooks/useRegrasAutomacao.ts` |
| `tipo` | `conflito_interpessoal` | escreve | `src/config/behavioralPillars/scenarios.ts`<br>`src/data/immersiveScenarios/collaboration.ts`<br>`src/data/immersiveScenarios/communication.ts`<br>`src/data/immersiveScenarios/emotionalIntelligence.ts` |
| `tipo` | `crise` | escreve | `src/config/behavioralPillars/scenarios.ts`<br>`src/data/immersiveScenarios/leadership.ts`<br>`src/data/immersiveScenarios/resilience.ts` |
| `tipo` | `cultural` | compara | `src/components/assessments/AssessmentPlayer.tsx`<br>`src/hooks/useAssessments.ts`<br>`supabase/functions/generate-scorecard/index.ts` |
| `tipo` | `curriculo` | compara | `src/components/candidato/CurriculoTab.tsx` |
| `tipo` | `decisao_estrategica` | escreve | `src/data/immersiveScenarios/adaptability.ts`<br>`src/data/immersiveScenarios/criticalThinking.ts`<br>`src/data/immersiveScenarios/leadership.ts`<br>`src/data/immersiveScenarios/resultsOrientation.ts` |
| `tipo` | `dilema_etico` | escreve | `src/config/behavioralPillars/scenarios.ts`<br>`src/data/immersiveScenarios/integrity.ts` |
| `tipo` | `disc` | compara | `src/components/assessments/AssessmentPlayer.tsx`<br>`src/hooks/useAssessments.ts`<br>`supabase/functions/generate-scorecard/index.ts` |
| `tipo` | `disc_baixo` | compara, escreve | `src/lib/jobFit/redFlagDetector.ts`<br>`src/lib/jobFit/redFlagRules.ts`<br>`src/types/jobFit.ts` |
| `tipo` | `dissertativa` | compara | `src/pages/ProvaAplicacao.tsx`<br>`src/pages/ProvaEditor.tsx` |
| `tipo` | `eliminatorio` | escreve | `src/types/selection.ts` |
| `tipo` | `email` | escreve | `src/pages/ComunicacaoPage.tsx`<br>`src/types/recruitment.ts` |
| `tipo` | `empresa` | compara, escreve | `src/lib/matchCalculator.ts` |
| `tipo` | `entrevista` | compara, escreve | `src/components/candidato/HistoricoTab.tsx`<br>`src/components/candidato/NotasTab.tsx`<br>`src/types/recruitment.ts` |
| `tipo` | `entrevista_final` | compara | `src/components/candidato/AvaliacoesTab.tsx` |
| `tipo` | `entrevista_gestor` | compara | `src/components/candidato/AvaliacoesTab.tsx` |
| `tipo` | `entrevista_rh` | compara | `src/components/candidato/AvaliacoesTab.tsx` |
| `tipo` | `escala` | compara, escreve | `src/components/assessments/AssessmentPlayer.tsx`<br>`src/types/match.ts` |
| `tipo` | `escolha_forcada` | compara | `src/components/assessments/AssessmentPlayer.tsx` |
| `tipo` | `feedback` | compara, escreve | `src/components/dashboard/AlertasInteligentes.tsx`<br>`src/hooks/useDashboardData.ts`<br>`src/hooks/useRegrasAutomacao.ts`<br>`src/types/recruitment.ts` |
| `tipo` | `followup` | compara | `src/hooks/useRegrasAutomacao.ts` |
| `tipo` | `geral` | escreve | `src/components/candidato/NotasTab.tsx` |
| `tipo` | `inconsistencia` | escreve | `src/lib/jobFit/redFlagRules.ts` |
| `tipo` | `inovacao` | escreve | `src/config/behavioralPillars/scenarios.ts`<br>`src/data/immersiveScenarios/adaptability.ts`<br>`src/data/immersiveScenarios/proactivity.ts` |
| `tipo` | `limbico` | compara | `src/components/assessments/JobProfileBuilder.tsx` |
| `tipo` | `mudanca_etapa` | compara | `src/components/candidato/HistoricoTab.tsx` |
| `tipo` | `mudar_status` | escreve | `src/types/selection.ts` |
| `tipo` | `multipla` | compara | `src/components/assessments/AssessmentPlayer.tsx` |
| `tipo` | `multipla_escolha` | compara, escreve | `src/pages/ProvaAplicacao.tsx`<br>`src/pages/ProvaEditor.tsx`<br>`src/types/tests.ts` |
| `tipo` | `neocortex` | compara | `src/components/assessments/JobProfileBuilder.tsx` |
| `tipo` | `notificacao` | compara | `src/hooks/useRegrasAutomacao.ts` |
| `tipo` | `number` | compara | `src/components/carreiras/KnockoutQuestionsForm.tsx`<br>`src/types/knockout.ts`<br>`supabase/functions/_shared/knockout.ts` |
| `tipo` | `online` | compara | `src/components/agenda/AgendarEntrevistaDialog.tsx`<br>`src/components/agenda/entrevistaDetalhes/EntrevistaEditForm.tsx`<br>`supabase/functions/interview-reminders/index.ts` |
| `tipo` | `portfolio` | compara | `src/components/candidato/CurriculoTab.tsx` |
| `tipo` | `positivo` | escreve | `src/components/dashboard/SmartInsights.tsx` |
| `tipo` | `presencial` | compara, escreve | `src/components/agenda/AgendaTimeline.tsx`<br>`src/components/agenda/AgendarEntrevistaDialog.tsx`<br>`src/components/agenda/GoogleCalendarExport.tsx`<br>`src/components/agenda/entrevistaDetalhes/EntrevistaDetailsView.tsx`<br>`src/components/agenda/entrevistaDetalhes/EntrevistaEditForm.tsx`<br>… +3 |
| `tipo` | `proposta` | compara, escreve | `src/components/dashboard/AlertasInteligentes.tsx`<br>`src/hooks/useDashboardData.ts`<br>`src/hooks/useRegrasAutomacao.ts` |
| `tipo` | `reengajamento` | compara | `src/hooks/useRegrasAutomacao.ts` |
| `tipo` | `remoto` | escreve | `src/data/agendaData.ts` |
| `tipo` | `reptiliano` | compara | `src/components/assessments/JobProfileBuilder.tsx` |
| `tipo` | `rh` | escreve | `src/data/agendaData.ts` |
| `tipo` | `select` | compara | `src/components/carreiras/KnockoutQuestionsForm.tsx`<br>`src/types/knockout.ts`<br>`supabase/functions/_shared/knockout.ts` |
| `tipo` | `sim_nao` | escreve | `src/pages/VagaForm.tsx`<br>`src/types/recruitment.ts` |
| `tipo` | `situacao_pressao` | escreve | `src/config/behavioralPillars/scenarios.ts`<br>`src/data/immersiveScenarios/adaptability.ts`<br>`src/data/immersiveScenarios/communication.ts`<br>`src/data/immersiveScenarios/emotionalIntelligence.ts`<br>`src/data/immersiveScenarios/leadership.ts`<br>… +2 |
| `tipo` | `situacional` | compara | `src/components/assessments/AssessmentPlayer.tsx` |
| `tipo` | `stress_alto` | compara, escreve | `src/lib/jobFit/redFlagDetector.ts`<br>`src/lib/jobFit/redFlagRules.ts` |
| `tipo` | `sugestao` | escreve | `src/components/dashboard/SmartInsights.tsx` |
| `tipo` | `tecnica` | compara, escreve | `src/data/agendaData.ts`<br>`src/data/avaliacaoData.ts`<br>`src/hooks/useAvaliacaoForm.ts`<br>`src/hooks/useAvaliacoes.ts`<br>`src/types/selection.ts` |
| `tipo` | `tecnico` | escreve | `src/components/candidato/NotasTab.tsx` |
| `tipo` | `telefone` | compara | `src/components/agenda/AgendaTimeline.tsx` |
| `tipo` | `teste` | compara | `src/components/candidato/HistoricoTab.tsx` |
| `tipo` | `teste_tecnico` | compara | `src/components/candidato/AvaliacoesTab.tsx` |
| `tipo` | `text` | compara | `src/components/carreiras/KnockoutQuestionsForm.tsx`<br>`src/types/knockout.ts`<br>`supabase/functions/_shared/knockout.ts` |
| `tipo` | `triagem` | compara | `src/components/candidato/AvaliacoesTab.tsx`<br>`src/components/candidato/HistoricoTab.tsx`<br>`src/hooks/useRegrasAutomacao.ts` |
| `tipo` | `urgente` | escreve | `src/components/dashboard/AlertasInteligentes.tsx` |
| `tipo` | `validacao` | compara | `src/hooks/useRegrasAutomacao.ts` |
| `tipo` | `verdadeiro_falso` | compara | `src/pages/ProvaEditor.tsx` |
| `tipo` | `video` | compara, escreve | `src/components/agenda/AgendaTimeline.tsx`<br>`src/hooks/useDashboardData.ts` |
| `phase` | `assessment` | compara | `src/pages/BehavioralAssessmentPage.tsx` |
| `phase` | `choices` | compara | `src/components/dna/ImmersiveScenarioPlayer.tsx` |
| `phase` | `click` | compara | `src/components/dna/miniGames/ReactionGame.tsx` |
| `phase` | `complete` | compara | `src/components/assessments/gamified/GamifiedAssessmentEngine.tsx`<br>`src/components/assessments/gamified/PersonalityMiniGame.tsx` |
| `phase` | `consequence` | compara | `src/components/dna/ImmersiveScenarioPlayer.tsx` |
| `phase` | `context` | compara | `src/components/dna/ImmersiveScenarioPlayer.tsx` |
| `phase` | `feedback` | compara | `src/components/assessments/gamified/PersonalityMiniGame.tsx` |
| `phase` | `followup` | compara | `src/components/assessments/ImmersiveScenarioPlayer.tsx` |
| `phase` | `intro` | compara | `src/components/assessments/ImmersiveScenarioPlayer.tsx`<br>`src/components/assessments/gamified/GamifiedAssessmentEngine.tsx`<br>`src/components/dna/DNAJourneyExperience.tsx` |
| `phase` | `minigame` | compara | `src/components/dna/DNAJourneyExperience.tsx` |
| `phase` | `narrative` | compara | `src/components/assessments/ImmersiveScenarioPlayer.tsx`<br>`src/components/assessments/immersive/useScenarioPlayer.ts` |
| `phase` | `options` | compara | `src/components/assessments/ImmersiveScenarioPlayer.tsx` |
| `phase` | `playing` | compara | `src/components/assessments/gamified/GamifiedAssessmentEngine.tsx`<br>`src/components/assessments/gamified/PersonalityMiniGame.tsx`<br>`src/components/assessments/gamified/personalityMiniGame/usePersonalityMiniGame.ts` |
| `phase` | `ready` | compara | `src/components/assessments/gamified/PersonalityMiniGame.tsx`<br>`src/components/dna/miniGames/ReactionGame.tsx` |
| `phase` | `results` | compara | `src/components/dna/DNAJourneyExperience.tsx`<br>`src/pages/BehavioralAssessmentPage.tsx` |
| `phase` | `scenario` | compara | `src/components/dna/DNAJourneyExperience.tsx` |
| `phase` | `transitioning` | compara | `src/components/assessments/ImmersiveScenarioPlayer.tsx`<br>`src/components/assessments/immersive/useScenarioPlayer.ts` |
| `phase` | `wait` | compara | `src/components/dna/miniGames/ReactionGame.tsx` |
| `perfil` | `conformidade` | compara | `src/components/assessments/JobProfileBuilder.tsx` |
| `perfil` | `dominancia` | compara | `src/components/assessments/JobProfileBuilder.tsx` |
| `perfil` | `estabilidade` | compara | `src/components/assessments/JobProfileBuilder.tsx` |
| `perfil` | `influencia` | compara | `src/components/assessments/JobProfileBuilder.tsx` |
| `step` | `2fa` | compara | `src/components/auth/ReauthDialog.tsx` |
| `step` | `badge` | compara | `src/components/gamification/GiftBadge.tsx` |
| `step` | `colleague` | compara | `src/components/gamification/GiftBadge.tsx` |
| `step` | `complete` | compara | `src/components/auth/MFASMSSetup.tsx`<br>`src/components/auth/TwoFactorSetup.tsx` |
| `step` | `done` | compara | `src/components/candidatos/LinkedInImportDialog.tsx` |
| `step` | `generate` | compara | `src/components/auth/TwoFactorSetup.tsx` |
| `step` | `input` | compara | `src/components/candidatos/LinkedInImportDialog.tsx` |
| `step` | `message` | compara | `src/components/gamification/GiftBadge.tsx` |
| `step` | `password` | compara | `src/components/auth/ReauthDialog.tsx` |
| `step` | `phone` | compara | `src/components/auth/MFASMSSetup.tsx` |
| `step` | `preview` | compara | `src/components/candidatos/LinkedInImportDialog.tsx` |
| `step` | `recovery` | compara | `src/components/auth/TwoFactorSetup.tsx` |
| `step` | `verify` | compara | `src/components/auth/MFASMSSetup.tsx`<br>`src/components/auth/TwoFactorSetup.tsx` |
| … +18 linhas — lista completa em `context.json` | | | |

### E.4 Enums e listas de valores

| Nome | Valores | Onde |
|---|---|---|
| app_role | `admin`, `rh`, `gestor` | banco |
| senioridade_nivel | `estagio`, `junior`, `pleno`, `senior`, `staff`, `principal`, `lead` | banco |
| nivel_idioma | `nenhum`, `basico`, `intermediario`, `avancado`, `fluente`, `nativo` | banco |
| regime_contratacao | `clt`, `pj`, `ambos` | banco |
| modalidade_trabalho | `remoto`, `hibrido`, `presencial` | banco |
| cognitive_domain | `logico`, `numerico`, `verbal`, `atencao` | banco |
| cognitive_session_status | `em_andamento`, `concluida`, `expirada`, `cancelada` | banco |
| JANELAS_DIAS | 7, 15, 30, 60, 90 | `src/components/analytics/SlaConfigBar.tsx` |
| LIMITES_SLA_HORAS | 12, 24, 48, 72, 120 | `src/components/analytics/SlaConfigBar.tsx` |
| NOTAS_RAPIDAS | "Contato por e-mail", "Contato por WhatsApp", "Contato por telefone", "Retorno agendado", | `src/components/analytics/SlaNoteTemplates.tsx` |
| EnginePhase | intro \| playing \| complete | `src/components/assessments/gamified/engineConfig.ts` |
| EngineTheme | default \| playful \| minimal \| cosmic | `src/components/assessments/gamified/engineConfig.ts` |
| MiniGameType | quick-choice \| word-association \| scenario-pick \| this-or-that \| priority-sort | `src/components/assessments/gamified/personalityMiniGame/types.ts` |
| Phase | ready \| playing \| feedback \| complete | `src/components/assessments/gamified/personalityMiniGame/usePersonalityMiniGame.ts` |
| KPIVariant | primary \| success \| warning \| info \| accent | `src/components/dashboard/interactiveKPI/types.ts` |
| KPIFormat | number \| percentage \| currency \| days | `src/components/dashboard/interactiveKPI/types.ts` |
| PowerUpType | double_xp \| streak_shield \| time_boost \| bonus_multiplier | `src/components/gamification/PowerUps.tsx` |
| AchievementTier | bronze \| silver \| gold \| platinum \| diamond | `src/components/gamification/achievementProfile/types.ts` |
| StatColor | yellow \| primary \| orange \| purple | `src/components/gamification/achievementProfile/types.ts` |
| AchievementTier | bronze \| silver \| gold \| platinum \| diamond | `src/components/gamification/achievements/achievementTypes.ts` |
| AchievementCategory | recruitment \| speed \| quality \| engagement \| milestone \| streak \| special | `src/components/gamification/achievements/achievementTypes.ts` |
| AchievementBadgeSize | sm \| md \| lg \| xl | `src/components/gamification/achievements/achievementTypes.ts` |
| ChallengeType | login \| candidatos \| entrevistas \| vagas \| avaliacoes \| games \| streak | `src/components/gamification/dailyChallenges/types.ts` |
| ChallengeDifficulty | easy \| medium \| hard \| epic | `src/components/gamification/dailyChallenges/types.ts` |
| GamifiedMode | quiz \| swipe \| minigame \| phases | `src/components/gamification/page/gameCardsConfig.ts` |
| MissionTier | bronze \| silver \| gold \| platinum | `src/components/gamification/weeklyMissions/types.ts` |
| SearchResultType | candidato \| vaga \| entrevista \| documento \| acao | `src/components/intelligence/PredictiveSearch.tsx` |
| OfferStatus | rascunho \| enviada \| visualizada \| aceita \| recusada \| expirada \| cancelada | `src/components/offers/OfferCard.tsx` |
| TrendDirection | up \| down \| neutral | `src/components/visualization/trendIndicators/trendUtils.ts` |
| DEVELOPMENT_IPS | '127.0.0.1', '::1', 'localhost' | `src/config/ipWhitelist.ts` |
| AppRole | admin \| rh \| gestor | `src/contexts/AuthContext.tsx` |
| AgendaTipoEntrevista | tecnica \| rh \| cultural \| final \| triagem \| presencial \| online \| telefone | `src/data/agendaData.ts` |
| AgendaStatusEntrevista | agendada \| confirmada \| realizada \| cancelada \| remarcada \| reagendada \| no_show | `src/data/agendaData.ts` |
| AnalyticsPeriodo | 30d \| 3m \| 6m \| 1y | `src/hooks/useAdvancedAnalytics.ts` |
| PARECERES | { value: 'aprovar', label: 'Aprovar', color: 'green' }, { value: 'reprovar', label: 'Reprovar', color: 'red' }, { value: 'em_duvida', label: 'Em Dúvida', color: 'yellow' }, | `src/hooks/useAvaliacoes.ts` |
| ImportStatus | idle \| parsing \| validating \| importing \| complete \| error | `src/hooks/useImportData.ts` |
| PersonalityFramework | bigfive \| mbti \| enneagram \| all | `src/hooks/usePersonalityAssessment.ts` |
| NotificationType | high_match \| stage_change \| new_candidate \| urgent \| interview_scheduled \| interview_updated \| info \| success \| warning \| error | `src/hooks/useRealtimeNotifications.ts` |
| SensitiveAction | change_password \| change_email \| configure_mfa \| admin_action \| delete_account \| export_data \| manage_api_keys | `src/hooks/useReauth.ts` |
| SkillCategoria | linguagem \| frontend \| backend \| mobile \| banco_de_dados \| cloud \| devops \| dados_ia \| qa_testes \| seguranca \| ferramentas \| produto_gestao \| design_ux \| soft_skills \| idioma | `src/hooks/useSkills.ts` |
| SoundType | celebration \| notification \| success \| error \| warning \| click \| hover \| levelUp \| achievement | `src/hooks/useSoundPreferences.ts` |
| SearchOrder | created_at \| nome \| pretensao_asc \| pretensao_desc \| skills_match | `src/hooks/useTalentSearch.ts` |
| STATUS_VAGA | { id: 'rascunho', nome: 'Rascunho', cor: 'gray' }, { id: 'publicada', nome: 'Publicada', cor: 'green' }, { id: 'pausada', nome: 'Pausada', cor: 'yellow' }, { id: 'fechada', nome: 'Fechada', cor: 'blue' }, { id: 'cancelada', nome: 'Cancelada', cor: 'red' }, | `src/lib/constants.ts` |
| PRIORIDADES | { id: 'baixa', nome: 'Baixa', cor: 'gray' }, { id: 'media', nome: 'Média', cor: 'yellow' }, { id: 'alta', nome: 'Alta', cor: 'orange' }, { id: 'urgente', nome: 'Urgente', cor: 'red' }, | `src/lib/constants.ts` |
| TIPOS_CONTRATO | { id: 'clt', nome: 'CLT' }, { id: 'pj', nome: 'PJ' }, { id: 'estagio', nome: 'Estágio' }, { id: 'temporario', nome: 'Temporário' }, { id: 'freelancer', nome: 'Freelancer' }, | `src/lib/constants.ts` |
| MODALIDADES_TRABALHO | { id: 'presencial', nome: 'Presencial' }, { id: 'remoto', nome: 'Remoto' }, { id: 'hibrido', nome: 'Híbrido' }, | `src/lib/constants.ts` |
| NIVEIS_EXPERIENCIA | { id: 'estagiario', nome: 'Estagiário', anosMin: 0, anosMax: 0 }, { id: 'junior', nome: 'Júnior', anosMin: 0, anosMax: 2 }, { id: 'pleno', nome: 'Pleno', anosMin: 2, anosMax: 5 }, { id: 'senior', nome: 'Sênior', anosMin: 5, anosMax: 10 }, { id: 'especialista', nome: 'Especialista', anosMin: 10, anos … | `src/lib/constants.ts` |
| FONTES_CANDIDATOS | { id: 'linkedin', nome: 'LinkedIn' }, { id: 'indeed', nome: 'Indeed' }, { id: 'site', nome: 'Site Próprio' }, { id: 'indicacao', nome: 'Indicação' }, { id: 'banco_talentos', nome: 'Banco de Talentos' }, { id: 'universidade', nome: 'Universidade' }, { id: 'evento', nome: 'Evento' }, { id: 'outro', no … | `src/lib/constants.ts` |
| TIPOS_ENTREVISTA | { id: 'telefone', nome: 'Telefone', icone: 'Phone' }, { id: 'video', nome: 'Videoconferência', icone: 'Video' }, { id: 'presencial', nome: 'Presencial', icone: 'Users' }, | `src/lib/constants.ts` |
| CATEGORIAS_PROVA | { id: 'logica', nome: 'Lógica', icone: 'Brain' }, { id: 'tecnica', nome: 'Técnica', icone: 'Code' }, { id: 'portugues', nome: 'Português', icone: 'BookOpen' }, { id: 'ingles', nome: 'Inglês', icone: 'Globe' }, { id: 'excel', nome: 'Excel', icone: 'Table' }, { id: 'comportamental', nome: 'Comportamen … | `src/lib/constants.ts` |
| DEPARTAMENTOS | 'Tecnologia', 'Comercial', 'Marketing', 'Recursos Humanos', 'Financeiro', 'Operações', 'Administrativo', 'Jurídico', 'Produto', 'Design', | `src/lib/constants.ts` |
| PotentialConfidence | alta \| media \| baixa \| insuficiente | `src/lib/potentialIndex.ts` |
| PotentialTier | alto \| promissor \| moderado \| atencao | `src/lib/potentialIndex.ts` |
| JobBoard | linkedin \| indeed \| catho \| infojobs \| vagas | `src/services/jobBoardService.ts` |
| ReportType | vagas \| candidatos \| funil \| entrevistas \| sla \| diversidade \| custom | `src/services/reportingService.ts` |
| ChartType | bar \| line \| area \| pie \| radar \| table | `src/services/reportingService.ts` |
| ExportFormat | csv \| xlsx \| pdf \| json \| png | `src/services/reportingService.ts` |
| GenerationType | silent \| baby_boomer \| gen_x \| millennial \| gen_z \| gen_alpha | `src/types/advancedBehavioral.ts` |
| StressResponse | fight \| flight \| freeze \| fawn | `src/types/advancedBehavioral.ts` |
| BrainType | reptiliano \| limbico \| neocortex | `src/types/advancedBehavioral.ts` |
| HttpMethod | GET \| POST \| PUT \| PATCH \| DELETE | `src/types/api.ts` |
| MiniGameType | value-tower \| reaction \| pressure \| emotional-radar | `src/types/behavioralDNA.ts` |
| CognitiveDomain | logico \| numerico \| verbal \| atencao | `src/types/cognitive.ts` |
| CognitiveSessionStatus | em_andamento \| concluida \| expirada \| cancelada | `src/types/cognitive.ts` |
| CognitiveFaixa | abaixo \| mediano \| acima \| superior | `src/types/cognitive.ts` |
| FormFieldType | text \| email \| password \| number \| date \| select \| textarea \| checkbox \| radio \| file \| tel \| url | `src/types/forms.ts` |
| JobFitNivel | excelente \| alto \| moderado \| baixo \| incompativel | `src/types/jobFit.ts` |
| RedFlagSeveridade | critico \| alto \| medio \| baixo | `src/types/jobFit.ts` |
| RedFlagCategoria | comportamental \| resiliencia \| compatibilidade \| consistencia \| stress \| cultural | `src/types/jobFit.ts` |
| KnockoutTipo | boolean \| text \| select \| number | `src/types/knockout.ts` |
| ValorCulturalId | inovacao \| colaboracao \| excelencia \| transparencia \| diversidade \| sustentabilidade \| agilidade \| autonomia \| aprendizado \| cliente_foco \| integridade \| paixao \| resiliencia \| equidade \| bem_estar \| meritocracia \| empreendedorismo \| tradicao \| criatividade \| resultado | `src/types/match.ts` |
| MBTIDichotomy | E \| I | `src/types/personality.ts` |
| MBTIType | INTJ \| INTP \| ENTJ \| ENTP \| INFJ \| INFP \| ENFJ \| ENFP \| ISTJ \| ISFJ \| ESTJ \| ESFJ \| ISTP \| ISFP \| ESTP \| ESFP | `src/types/personality.ts` |
| EnneagramTriad | instintivo \| emocional \| mental | `src/types/personality.ts` |
| EnneagramInstinct | autopreservacao \| social \| sexual | `src/types/personality.ts` |
| EnneagramHealthLevel | muito_saudavel \| saudavel \| medio \| nao_saudavel \| muito_nao_saudavel | `src/types/personality.ts` |
| StatusVaga | rascunho \| aguardando_aprovacao \| aprovada \| publicada \| em_selecao \| pausada \| encerrada \| cancelada | `src/types/recruitment.ts` |
| Prioridade | urgente \| alta \| media \| baixa | `src/types/recruitment.ts` |
| TipoContrato | clt \| pj \| estagio \| temporario | `src/types/recruitment.ts` |
| Modalidade | presencial \| hibrido \| remoto | `src/types/recruitment.ts` |
| FonteCandidato | portal \| linkedin \| indeed \| catho \| infojobs \| indicacao \| espontaneo \| outros | `src/types/recruitment.ts` |
| StatusCandidato | ativo \| em_processo \| contratado \| desistente \| blacklist | `src/types/recruitment.ts` |
| EtapaProcesso | novo \| em_triagem \| pre_selecao \| entrevista_rh \| teste_tecnico \| entrevista_gestor \| entrevista_final \| aprovado \| proposta_enviada \| contratado \| reprovado \| banco_talentos | `src/types/recruitment.ts` |
| StatusProcesso | em_andamento \| aprovado \| reprovado \| desistente \| contratado | `src/types/recruitment.ts` |
| TipoEntrevista | telefone \| video \| presencial | `src/types/recruitment.ts` |
| StatusEntrevista | agendada \| confirmada \| realizada \| cancelada \| no_show | `src/types/recruitment.ts` |
| TipoCompetencia | tecnica \| comportamental | `src/types/recruitment.ts` |
| TipoAssessment | disc \| cultural \| situacional \| valores | `src/types/selection.ts` |
| TipoQuestaoAssessment | escala \| escolha_forcada \| multipla \| situacional | `src/types/selection.ts` |
| MOEDAS | "BRL", "USD", "EUR" | `src/types/techProfile.ts` |
| NivelCargo | basico \| intermediario \| avancado | `src/types/tests.ts` |
| CategoriaProva | logica \| tecnica \| portugues \| ingles \| excel \| comportamental \| fit_cultural | `src/types/tests.ts` |
| Departamento | ti \| comercial \| rh \| financeiro \| marketing \| operacoes \| administrativo \| juridico \| geral | `src/types/tests.ts` |
| WorkflowNodeType | trigger \| action \| condition \| delay | `src/types/workflow.ts` |
| CognitiveBias | confirmacao \| ancoragem \| disponibilidade \| excesso_confianca \| aversao_perda \| efeito_manada \| retrospectiva \| projecao \| atribuicao \| enquadramento | `src/types/behavioral/cognitive.ts` |
| EmotionalState | confianca \| motivacao \| calma \| foco \| criatividade \| determinacao \| empatia \| entusiasmo \| resiliencia \| curiosidade | `src/types/behavioral/emotional.ts` |
| ValueCategory | realizacao \| seguranca \| relacionamento \| autonomia \| crescimento \| contribuicao \| reconhecimento \| equilibrio \| desafio \| criatividade | `src/types/behavioral/emotional.ts` |
| DISCProfile | D \| I \| S \| C | `src/types/behavioral/nlpFrameworks.ts` |
| VAKDChannel | visual \| auditivo \| cinestesico \| digital | `src/types/behavioral/nlpFrameworks.ts` |
| MetaprogramType | aproximacao_afastamento \| interno_externo \| opcoes_procedimentos \| global_especifico \| proativo_reativo \| igual_diferente \| tempo | `src/types/behavioral/nlpFrameworks.ts` |
| MentalTrigger | escassez \| autoridade \| prova_social \| reciprocidade \| compromisso \| afinidade \| urgencia \| novidade \| curiosidade \| exclusividade | `src/types/behavioral/persuasion.ts` |
| SleightPattern | intencao \| redefinicao \| consequencia \| chunk_up \| chunk_down \| analogia \| modelo_mundo \| estrategia_realidade \| contra_exemplo \| hierarquia_criterios \| aplicar_a_si \| meta_frame | `src/types/behavioral/persuasion.ts` |
| KnockoutTipo | boolean \| text \| select \| number | `supabase/functions/_shared/knockout.ts` |

## F. Validações de entrada

### F.1 Schemas Zod

- **loginSchema** (`src/components/auth/LoginForm.tsx`, z.object):
  ```ts
  { email: z.string().email('Email inválido'), password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'), }
  ```
- **signupSchema** (`src/components/auth/SignupForm.tsx`, z.object, encadeia refine):
  ```ts
  { nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'), email: z.string().email('Email inválido'), password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'), confirmPassword: z.string(), }
  ```
  - Regras cruzadas (refine): “Senhas não conferem”
- **vagaSchema** (`src/lib/matchSchemas.ts`, z.object):
  ```ts
  { titulo: z.string().min(1), departamento: z.string().optional(), descricao: z.string().optional(), requisitos: z.string().optional(), tipo_contrato: z.enum(['clt', 'pj', 'estagio', 'temporario']).optional(), modalidade: z.enum(['presencial', 'remoto', 'hibrido']).optional(), salario_min: z.coerce.number().positive().optional(), salario_max: z.coerce.number().positive().optional(), status: z.enum(['aberta', 'em_selecao', 'finalizada', 'cancelada']).default('aberta'), data_limite: z.string().optional(), }
  ```
- **candidatoSchema** (`src/lib/matchSchemas.ts`, z.object):
  ```ts
  { nome: z.string().min(1), email: z.string().email(), telefone: z.string().optional(), linkedin: z.string().url().optional(), curriculo_url: z.string().url().optional(), vaga_id: z.string().uuid().optional(), etapa: z.enum(['triagem', 'entrevista_rh', 'entrevista_tecnica', 'proposta', 'contratado', 'reprovado']).default('triagem'), avaliacao: z.coerce.number().min(0).max(10).optional(), observacoes: z.string().optional(), }
  ```
- **emailSchema** (`src/pages/auth/ForgotPasswordPage.tsx`, z.object):
  ```ts
  { email: z.string().email('Email inválido').max(255), }
  ```
- **loginSchema** (`src/pages/auth/LoginPage.tsx`, z.object):
  ```ts
  { email: z.string().email('Email inválido').max(255), password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(128), }
  ```
- **registerSchema** (`src/pages/auth/RegisterPage.tsx`, z.object, encadeia refine):
  ```ts
  { nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(100), email: z.string().email('Email inválido').max(255), password: z.string() .min(8, 'Senha deve ter pelo menos 8 caracteres') .max(128) .regex(/[A-Z]/, 'Senha deve ter pelo menos uma letra maiúscula') .regex(/[a-z]/, 'Senha deve ter pelo menos uma letra minúscula') .regex(/[0-9]/, 'Senha deve ter pelo menos um número'), confirmPassword: z.string(), acceptTerms: z.boolean().refine(val => val === true, 'Você deve aceitar os termos'), }
  ```
  - Regras cruzadas (refine): “Você deve aceitar os termos” · “Senhas não conferem”
- **passwordSchema** (`src/pages/auth/ResetPasswordPage.tsx`, z.object, encadeia refine):
  ```ts
  { password: z.string() .min(8, 'Senha deve ter pelo menos 8 caracteres') .max(128) .regex(/[A-Z]/, 'Senha deve ter pelo menos uma letra maiúscula') .regex(/[a-z]/, 'Senha deve ter pelo menos uma letra minúscula') .regex(/[0-9]/, 'Senha deve ter pelo menos um número'), confirmPassword: z.string(), }
  ```
  - Regras cruzadas (refine): “Senhas não conferem”
- **BodySchema** (`supabase/functions/sign-proposal/index.ts`, z.object):
  ```ts
  { token: z.string().min(16).max(128), aceitar: z.boolean(), motivo_recusa: z.string().max(1000).optional(), assinatura_nome: z.string().min(2).max(200).optional(), }
  ```

### F.2 react-hook-form (register/rules)

_nenhum item encontrado_

### F.3 Restrições em inputs HTML (required/min/max/pattern)

| Campo | Restrições | Arquivo |
|---|---|---|
| `sla-nota-lote` | max, disabled=registrarLote.isPending | `src/components/analytics/SlaOverdueList.tsx` |
| `login-email` | type=email | `src/components/auth/LoginForm.tsx` |
| `login-password` | type=password | `src/components/auth/LoginForm.tsx` |
| `phone` | type=tel, max | `src/components/auth/MFASMSSetup.tsx` |
| `sms-code` | pattern=[0-9]*, max | `src/components/auth/MFASMSSetup.tsx` |
| `email` | type=email | `src/components/auth/PasswordResetRequestForm.tsx` |
| `verification-code` | pattern=[0-9]*, max | `src/components/auth/QRCodeGenerator.tsx` |
| `reauth-password` | type=password | `src/components/auth/ReauthDialog.tsx` |
| `reauth-2fa` | pattern=[0-9]*, max | `src/components/auth/ReauthDialog.tsx` |
| `verification-code` | pattern=[0-9]*, max | `src/components/auth/TwoFactorSetup.tsx` |
| `2fa-code` | pattern=useRecoveryCode ? , max | `src/components/auth/TwoFactorVerify.tsx` |
| `tp-pretensao` | type=number, min=0, step=100, disabled=readOnly | `src/components/candidatos/CandidatoTechProfileForm.tsx` |
| `tp-disponibilidade` | type=number, min=0, step=1, disabled=readOnly | `src/components/candidatos/CandidatoTechProfileForm.tsx` |
| `filtro-pretensao-min` | min, type=number, min=0 | `src/components/candidatos/TalentAdvancedFilters.tsx` |
| `filtro-pretensao-max` | max, type=number, min=0 | `src/components/candidatos/TalentAdvancedFilters.tsx` |
| `resume-upload` | accept=.txt,.pdf,.docx, disabled=isLoading | `src/components/candidatos/resumeParser/ResumeUploadArea.tsx` |
| `fieldId` | type=number | `src/components/carreiras/KnockoutQuestionsForm.tsx` |
| `name` | max, max, disabled=disabled | `src/components/forms/SmartFormField.tsx` |
| `candidato-email` | type=email | `src/components/indicacoes/NovaIndicacaoDialog.tsx` |
| `email` | type=email | `src/components/offers/CreateOfferDialog.tsx` |
| `salario` | type=number | `src/components/offers/CreateOfferDialog.tsx` |
| `data` | type=date | `src/components/offers/CreateOfferDialog.tsx` |
| `quantidade` | type=number, min=1 | `src/components/vaga-form/VagaFormBasicInfo.tsx` |
| `email` | type=email | `src/pages/AplicarVagaPage.tsx` |
| `curriculo` | accept=.pdf,.doc,.docx | `src/pages/AplicarVagaPage.tsx` |
| `email` | type=email | `src/pages/auth/ForgotPasswordPage.tsx` |
| `email` | type=email | `src/pages/auth/LoginPage.tsx` |
| `password` | type=password | `src/pages/auth/LoginPage.tsx` |
| `email` | type=email | `src/pages/auth/RegisterPage.tsx` |
| `password` | type=password | `src/pages/auth/RegisterPage.tsx` |
| `confirmPassword` | type=password | `src/pages/auth/RegisterPage.tsx` |
| `password` | type=password | `src/pages/auth/ResetPasswordPage.tsx` |
| `confirmPassword` | type=password | `src/pages/auth/ResetPasswordPage.tsx` |
| `login-email` | type=email | `src/pages/portal/PortalAuthPage.tsx` |
| `login-password` | type=password | `src/pages/portal/PortalAuthPage.tsx` |
| `register-email` | type=email | `src/pages/portal/PortalAuthPage.tsx` |
| `register-telefone` | type=tel | `src/pages/portal/PortalAuthPage.tsx` |
| `register-password` | type=password | `src/pages/portal/PortalAuthPage.tsx` |
| `register-confirm-password` | type=password | `src/pages/portal/PortalAuthPage.tsx` |
| `email` | disabled | `src/pages/portal/PortalPerfil.tsx` |
| `new-password` | type=password | `src/pages/portal/PortalPerfil.tsx` |
| `confirm-password` | type=password | `src/pages/portal/PortalPerfil.tsx` |

## G. Fórmulas e derivações (como valores são calculados)

### G.1 Colunas calculadas no banco

_nenhum item encontrado_

### G.2 Views (consultas derivadas)

| View | SELECT |
|---|---|
| `v_pipeline` | `SELECT ps.id, ps.etapa_atual, ps.status, ps.match_score, ps.data_inscricao, ps.data_ultima_movimentacao, EXTRACT(DAY FROM (now() - ps.data_ultima_movimentacao)) as dias_na_etapa, c.id as candidato_id, c.nome as candidato_nome, c.email as candidato_email, c.foto_url as candidato_foto, c.cargo_atual, …` |
| `v_agenda_entrevistas` | `SELECT e.id, e.tipo, e.etapa, e.data_hora, e.duracao_minutos, e.local, e.link_video, e.status, e.entrevistadores_nomes, c.nome as candidato_nome, c.email as candidato_email, c.foto_url as candidato_foto, v.titulo as vaga_titulo, v.departamento as vaga_departamento FROM public.entrevistas e JOIN publ …` |
| `v_vagas_kpis` | `SELECT v.id, v.titulo, v.departamento, v.status, v.prioridade, v.quantidade, v.created_at, EXTRACT(DAY FROM (now() - v.created_at)) as dias_aberta, COUNT(DISTINCT ps.id) as total_candidatos, COUNT(DISTINCT ps.id) FILTER (WHERE ps.status = 'em_andamento') as em_processo, COUNT(DISTINCT ps.id) FILTER …` |

### G.3 Funções de cálculo/decisão no código

- **FeedbackDialog({ open, onOpenChange, onSubmit }: FeedbackDialogProps)** — `src/components/agenda/FeedbackDialog.tsx`
  ```
  return ( <Dialog open={open} onOpenChange={onOpenChange}> <DialogContent> <DialogHeader> <DialogTitle>Registrar Feedback da Entrevista</DialogTitle> </DialogHeader> <form onSubmit={(e) => { e.preventDefault(); const form = e.target as HTMLFormElement; const feedback = (form.elements.namedItem("feedback") as HTMLTextAreaElement).value; const avaliacao = parseInt( (form.elements.namedItem("avaliacao") as HTMLSelectElement).value, ); onSubmit(feedback, avaliacao); }} > <div className="space-y-4"> < …
  ```
- **aplicar(texto: string)** — `src/components/analytics/SlaNoteTemplates.tsx`
  ```
  const atual = value.trim(); // Idempotente: reclicar o mesmo atalho não duplica a frase. if (atual.includes(texto)) return; const combinado = atual ? `${atual} · ${texto}` : texto; onChange(combinado.slice(0, maxLength));
  ```
- **getValorDimensao(candidato: CandidatoComparativo, key: string)** — `src/components/assessments/CandidateComparison.tsx`
  ```
  if (key.startsWith('disc')) { const perfil = key.replace('disc', '') as 'D' | 'I' | 'S' | 'C'; return candidato.discScores?.[perfil]; } if (key === 'resiliencia') return candidato.resiliencia; if (key === 'jobFitScore') return candidato.jobFitScore; return candidato.competencias?.[key];
  ```
- **FeedbackPhase({ showXP }: Props)** — `src/components/assessments/gamified/personalityMiniGame/FeedbackPhase.tsx`
  ```
  return ( <motion.div key="feedback" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="text-center" > <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.5 }} className="w-20 h-20 mx-auto mb-4 rounded-full bg-success flex items-center justify-center" > <Check className="h-10 w-10 text-success-foreground" /> </motion.div> {showXP && ( <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="te …
  ```
- **calculateStrength(password: string)** — `src/components/auth/PasswordStrengthIndicator.tsx`
  ```
  let score = 0; if (!password) { return { score: 0, level: 'weak', label: 'Muito fraca', color: 'bg-destructive', bgColor: 'bg-destructive/20' }; } // Comprimento if (password.length >= 8) score += 1; if (password.length >= 12) score += 1; if (password.length >= 16) score += 1; // Complexidade if (/[a-z]/.test(password)) score += 1; if (/[A-Z]/.test(password)) score += 1; if (/[0-9]/.test(password)) score += 1; if (/[^a-zA-Z0-9]/.test(password)) score += 1; // Penalidades if (/^[a-zA-Z]+$/.test(p …
  ```
- **generateQRCodeSVG(_url: string, size: number = 200)** — `src/components/auth/QRCodeGenerator.tsx`
  ```
  // Placeholder - em produção usar qrcode.react return `data:image/svg+xml,${encodeURIComponent(` <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"> <rect width="100%" height="100%" fill="white"/> <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="12" fill="currentColor" className="text-muted-foreground"> QR Code </text> </svg> `)}`;
  ```
- **generateSecret()** — `src/components/auth/TwoFactorSetup.tsx`
  ```
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; let secret = ''; for (let i = 0; i < 16; i++) { secret += chars.charAt(Math.floor(Math.random() * chars.length)); } return secret;
  ```
- **generateRecoveryCodes()** — `src/components/auth/TwoFactorSetup.tsx`
  ```
  const codes: string[] = []; for (let i = 0; i < 10; i++) { const code = Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase(); codes.push(code); } return codes;
  ```
- **generateSkillKey(skill: string, index: number, prefix: string)** — `src/components/candidatos/MatchScoreCard.tsx`
  ```
  return `${prefix}-${skill.toLowerCase().replace(/\s+/g, '-')}-${index}`;
  ```
- **ScoreBar({ icon: Icon, label, score }: ScoreBarProps)** — `src/components/candidatos/MatchScoreCard.tsx`
  ```
  const color = getScoreColor(score); return ( <div className="flex items-center gap-3"> <Icon className="h-4 w-4 text-primary" aria-hidden="true" /> <div className="flex-1"> <div className="flex justify-between text-sm mb-1"> <span>{label}</span> <span className={color}>{score}%</span> </div> <Progress value={score} className="h-2" aria-label={`${label}: ${score}%`} /> </div> </div> );
  ```
- **generateAlertas(acoesPendentes: AlertasInteligentesProps['acoesPendentes'], vagasUrgentes: AlertasInteligentesProps['vagasUrgentes'])** — `src/components/dashboard/AlertasInteligentes.tsx`
  ```
  const alertas: Alerta[] = []; const feedbackPendente = acoesPendentes.find(a => a.tipo === 'feedback'); if (feedbackPendente && feedbackPendente.quantidade > 5) { alertas.push({ id: 'feedback-urgente', tipo: 'urgente', categoria: 'candidato', titulo: 'Candidatos aguardando feedback', descricao: `${feedbackPendente.quantidade} candidatos há mais de 3 dias sem retorno.`, quantidade: feedbackPendente.quantidade, }); } const vagasMuitoAbertas = vagasUrgentes.filter(v => v.diasAberta > 15); if (vagas …
  ```
- **generateMockActivities()** — `src/components/dashboard/LiveActivityFeed.tsx`
  ```
  const activities: ActivityItem[] = [ { id: '1', type: 'candidate_new', title: 'Novo candidato cadastrado', description: 'Maria Silva aplicou para Desenvolvedor Full Stack', timestamp: new Date(Date.now() - 5 * 60 * 1000), metadata: { candidateName: 'Maria Silva', vagaTitle: 'Desenvolvedor Full Stack' }, isNew: true, }, { id: '2', type: 'match_high', title: 'Match de 95% identificado', description: 'João Santos tem alta compatibilidade com Product Manager', timestamp: new Date(Date.now() - 15 * 6 …
  ```
- **generateInsights(kpiData: SmartInsightsProps['kpiData'], funilData: SmartInsightsProps['funilData'])** — `src/components/dashboard/SmartInsights.tsx`
  ```
  const insights: Insight[] = []; // Análise de tempo médio if (kpiData.tempoMedio > kpiData.metaTempo) { const diferenca = kpiData.tempoMedio - kpiData.metaTempo; insights.push({ id: 'tempo-acima', tipo: 'alerta', titulo: 'Tempo de contratação acima da meta', descricao: `O tempo médio está ${diferenca} dias acima da meta. Considere otimizar etapas do processo.`, acao: 'Ver gargalos', impacto: 'alto', }); } else { insights.push({ id: 'tempo-ok', tipo: 'positivo', titulo: 'Tempo de contratação saud …
  ```
- **startRound()** — `src/components/dna/miniGames/ReactionGame.tsx`
  ```
  setPhase('wait'); const delay = 1000 + Math.random() * 3000; setTimeout(() => { setWaitStart(Date.now()); setPhase('click'); }, delay);
  ```
- **generateDemoLeaderboard(currentUserId?: string)** — `src/components/gamification/RealtimeLeaderboard.tsx`
  ```
  const names = [ 'Ana Silva', 'Carlos Santos', 'Maria Oliveira', 'João Pedro', 'Fernanda Costa', 'Ricardo Lima', 'Juliana Alves', 'Bruno Martins', 'Patrícia Souza', 'André Ferreira', 'Camila Rocha', 'Lucas Ribeiro', 'Amanda Nascimento', 'Gabriel Santos', 'Isabela Cruz' ]; const departments = ['RH', 'Tech', 'Vendas', 'Marketing', 'Operações']; return names.map((name, index) => ({ id: `user-${index + 1}`, userId: index === 4 ? (currentUserId || `user-${index + 1}`) : `user-${index + 1}`, name, avat …
  ```
- **generateDailyChallenges()** — `src/components/gamification/dailyChallenges/demoChallenges.ts`
  ```
  const today = new Date(); today.setHours(23, 59, 59, 999); return [ { id: "daily-login", type: "login", title: "Check-in Diário", description: "Faça login no sistema hoje", icon: Calendar, xpReward: 15, target: 1, progress: 1, difficulty: "easy", expiresAt: today, isCompleted: true, isClaimed: false, }, { id: "daily-candidatos", type: "candidatos", title: "Avaliador Dedicado", description: "Avalie 3 candidatos hoje", icon: Users, xpReward: 45, bonusXP: 15, target: 3, progress: 2, difficulty: "me …
  ```
- **generateStreakDays()** — `src/components/gamification/dashboard/demoData.ts`
  ```
  const days: Date[] = []; const today = new Date(); for (let i = 0; i < 12; i++) { const date = new Date(today); date.setDate(date.getDate() - i); days.push(date); } for (let i = 15; i < 20; i++) { const date = new Date(today); date.setDate(date.getDate() - i); days.push(date); } return days;
  ```
- **generateDemoTeams(currentTeamId?: string)** — `src/components/gamification/teamCompetition/demoTeams.ts`
  ```
  const teams: Team[] = [ { id: 'team-rh', name: 'RH Champions', icon: '👥', color: 'from-info to-accent', members: [ { id: 'm1', name: 'Ana Silva', xp: 4500, contributionPercent: 35 }, { id: 'm2', name: 'Carlos Santos', xp: 3200, contributionPercent: 25 }, { id: 'm3', name: 'Maria Oliveira', xp: 2800, contributionPercent: 22 }, { id: 'm4', name: 'João Pedro', xp: 2300, contributionPercent: 18 }, ], totalXP: 12800, weeklyXP: 3500, rank: 1, previousRank: 2, streak: 5, goalProgress: 12800, goalTarget …
  ```
- **generateWeeklyMissions()** — `src/components/gamification/weeklyMissions/demoMissions.ts`
  ```
  [
  ```
- **canAccessItem(itemRoles?: AppRole[])** — `src/components/layout/AppSidebar.tsx`
  ```
  if (!itemRoles || itemRoles.length === 0) return true; return itemRoles.some(role => hasRole(role));
  ```
- **calculateDaysOpen(dateStr?: string)** — `src/components/vagas/VagaCard.tsx`
  ```
  if (!dateStr) return 0; try { const diff = new Date().getTime() - new Date(dateStr).getTime(); return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24))); } catch { return 0; }
  ```
- **generateMockData(weeks: number)** — `src/components/visualization/CandidateHeatmap.tsx`
  ```
  const data: HeatmapCell[] = []; const today = new Date(); for (let i = weeks * 7 - 1; i >= 0; i--) { const date = new Date(today); date.setDate(date.getDate() - i); // Simulate activity patterns (more on weekdays) const dayOfWeek = date.getDay(); const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; const baseValue = isWeekend ? Math.random() * 3 : Math.random() * 10; const value = Math.floor(baseValue); const dateStr = date.toISOString().split('T')[0]; if (dateStr) { data.push({ date: dateStr, …
  ```
- **calculateTotalBehavioralXP()** — `src/config/behavioralGamification.ts`
  ```
  const toolsXP = Object.values(BEHAVIORAL_XP_REWARDS).reduce((a, b) => a + b, 0); const achievementsXP = BEHAVIORAL_ACHIEVEMENTS.reduce((a, b) => a + b.xpReward, 0); return toolsXP + achievementsXP;
  ```
- **calculateBehavioralXP(toolId: string, timeSpent: number, dailyCombo: number = 0, isFirstToday: boolean = false)** — `src/config/behavioralGamification.ts`
  ```
  baseXP: number; bonusXP: number; totalXP: number; bonuses: string[]
  ```
- **selectBalancedScenarios(count: number, requireAllPillars: boolean = true,)** — `src/data/immersiveScenariosData.ts`
  ```
  if (requireAllPillars && count >= 10) { const selected: ImmersiveScenario[] = []; const pillars = Object.keys(SCENARIOS_BY_PILLAR); pillars.forEach((pilar) => { const scenarios = SCENARIOS_BY_PILLAR[pilar]; if (scenarios && scenarios.length > 0) { const randomIndex = Math.floor(Math.random() * scenarios.length); const scenario = scenarios[randomIndex]; if (scenario) selected.push(scenario); } }); while (selected.length < count) { const randomPillar = pillars[Math.floor(Math.random() * pillars.le …
  ```
- **calculateLevel(xp: number)** — `src/domain/gamification/calculator.ts`
  ```
  for (let i = levels.length - 1; i >= 0; i--) { const level = levels[i]; if (level && xp >= level.minXP) { return level.level; } } return 1;
  ```
- **calculateLevelProgress(xp: number, level: number)** — `src/domain/gamification/calculator.ts`
  ```
  const current = getLevelInfo(level); const next = levels.find(l => l.level === level + 1); if (!next) return 100; const xpInCurrentLevel = xp - current.minXP; const xpNeededForLevel = next.minXP - current.minXP; return Math.min(100, (xpInCurrentLevel / xpNeededForLevel) * 100);
  ```
- **calcularDISC(respostas: Record<string, number | string>, questoes: { id: string; opcoes: unknown }[])** — `src/hooks/useAssessments.ts`
  ```
  const scores = { D: 0, I: 0, S: 0, C: 0 }; Object.entries(respostas).forEach(([questaoId, respostaIdx]) => { const questao = questoes.find(q => q.id === questaoId); if (questao?.opcoes && Array.isArray(questao.opcoes)) { const opcao = (questao.opcoes as { dimensao?: string; valor?: number }[])[Number(respostaIdx)]; if (opcao?.dimensao && opcao.dimensao in scores) { scores[opcao.dimensao as keyof typeof scores] += opcao.valor || 1; } } }); const total = scores.D + scores.I + scores.S + scores.C; …
  ```
- **calcularCultural(respostas: Record<string, number | string>, questoes: { id: string; dimensao?: string | null }[])** — `src/hooks/useAssessments.ts`
  ```
  const scores: Record<string, number[]> = {}; Object.entries(respostas).forEach(([questaoId, valor]) => { const questao = questoes.find(q => q.id === questaoId); const dimensao = questao?.dimensao; if (dimensao) { if (!scores[dimensao]) scores[dimensao] = []; scores[dimensao].push(Number(valor)); } }); const averages: Record<string, number> = {}; Object.entries(scores).forEach(([dim, vals]) => { averages[dim] = vals.length > 0 ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 20) : 0 …
  ```
- **generateJustificativa(fit: number, riscos: number, pontos: number)** — `src/hooks/useBehavioralScoreCalculation.ts`
  ```
  if (fit >= 80) return `Excelente alinhamento comportamental com a cultura da empresa. ${pontos} áreas onde o candidato supera expectativas.`; if (fit >= 65) return `Bom alinhamento geral com alguns pontos de atenção. ${riscos} área(s) podem requerer desenvolvimento.`; if (fit >= 50) return `Alinhamento moderado. Recomenda-se análise detalhada das ${riscos} áreas de gap identificadas.`; return `Alinhamento abaixo do esperado. ${riscos} áreas críticas de divergência com a cultura organizacional.`;
  ```
- **shouldCalculate(fw: 'bigfive' | 'mbti' | 'enneagram')** — `src/hooks/usePersonalityAssessment.ts`
  ```
  
  ```
- **calculateOverallConsistency(results: { bigFive?: BigFiveResult; mbti?: MBTIResult; enneagram?: EnneagramResult; })** — `src/hooks/usePersonalityAssessment.ts`
  ```
  const scores: number[] = []; if (results.bigFive?.consistencyScore) scores.push(results.bigFive.consistencyScore); if (results.mbti?.consistencyScore) scores.push(results.mbti.consistencyScore); if (results.enneagram?.consistencyScore) scores.push(results.enneagram.consistencyScore); return scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
  ```
- **maisRecente(a: string | null, b: string | null)** — `src/hooks/usePotentialIndexBatch.ts`
  ```
  if (a === null) return false; if (b === null) return true; return Date.parse(a) > Date.parse(b);
  ```
- **generateId()** — `src/hooks/useSavedFilters.ts`
  ```
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  ```
- **score(d)** — `src/hooks/useSkills.ts`
  ```
  skill: Skill; score: number
  ```
- **generateTone(frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1)** — `src/hooks/useSoundEffects.ts`
  ```
  try { const ctx = getAudioContext(); const oscillator = ctx.createOscillator(); const gainNode = ctx.createGain(); oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, ctx.currentTime); gainNode.gain.setValueAtTime(volume, ctx.currentTime); gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration); oscillator.connect(gainNode); gainNode.connect(ctx.destination); oscillator.start(ctx.currentTime); oscillator.stop(ctx.currentTime + duration); } catch { // Ignor …
  ```
- **generateChord(frequencies: number[], duration: number, type: OscillatorType = 'sine', volume: number = 0.05)** — `src/hooks/useSoundEffects.ts`
  ```
  frequencies.forEach((freq, index) => { setTimeout(() => { generateTone(freq, duration, type, volume); }, index * 50); });
  ```
- **generateDeviceFingerprint()** — `src/lib/deviceFingerprint.ts`
  ```
  const browser = getBrowser(); const os = getOS(); const device = getDeviceType(); const screenResolution = `${screen.width}x${screen.height}`; const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone; const language = navigator.language; // Collect fingerprint components const components = [ navigator.userAgent, screenResolution, screen.colorDepth.toString(), timezone, language, navigator.hardwareConcurrency?.toString() || 'unknown', getCanvasFingerprint(), navigator.plugins?.length?.to …
  ```
- **calcularMatch(empresa: PerfilCulturalEmpresa, candidato: PerfilCulturalCandidato, vagaId?: string)** — `src/lib/matchCalculator.ts`
  ```
  const detalhes: MatchDetalhe[] = []; // Mapear respostas por valorId const empresaMap = new Map(empresa.valores.map(v => [v.valorId, v.intensidade])); const candidatoMap = new Map(candidato.valores.map(v => [v.valorId, v.intensidade])); // Calcular alinhamento para cada valor for (const valor of VALORES_CULTURAIS) { const intensidadeEmpresa = empresaMap.get(valor.id) ?? 3; const intensidadeCandidato = candidatoMap.get(valor.id) ?? 3; const diferencaAbsoluta = Math.abs(intensidadeEmpresa - intens …
  ```
- **gerarAnaliseTexto(empresaNome: string, candidatoNome: string, score: number, perfeitos: number, conflitos: number, pontosFortes: string[],)** — `src/lib/matchCalculator.ts`
  ```
  const partes: string[] = []; if (score >= 85) { partes.push(`${candidatoNome} e ${empresaNome} têm um alinhamento cultural excepcional!`); } else if (score >= 70) { partes.push(`Há uma forte compatibilidade entre ${candidatoNome} e ${empresaNome}.`); } else if (score >= 55) { partes.push(`${candidatoNome} e ${empresaNome} compartilham valores importantes.`); } else { partes.push(`Existem diferenças significativas de valores entre ${candidatoNome} e ${empresaNome}.`); } if (perfeitos > 3) { parte …
  ```
- **calcularAlinhamento(intensidadeEmpresa: number, intensidadeCandidato: number)** — `src/lib/matchHelpers.ts`
  ```
  const diferenca = Math.abs(intensidadeEmpresa - intensidadeCandidato); if (diferenca === 0) return 'perfeito'; if (diferenca === 1) return 'alto'; if (diferenca === 2) return 'medio'; if (diferenca === 3) return 'baixo'; return 'conflito';
  ```
- **getValorPorId(id: ValorCulturalId)** — `src/lib/matchHelpers.ts`
  ```
  return VALORES_CULTURAIS.find((v) => v.id === id);
  ```
- **arredondar(valor: number, casas = 1)** — `src/lib/potentialIndex.ts`
  ```
  const fator = 10 ** casas; return Math.round(valor * fator) / fator;
  ```
- **calcularIndicePotencial(entrada: PotentialIndexInput, pesos: Record<PotentialSignal, number> = POTENTIAL_WEIGHTS,)** — `src/lib/potentialIndex.ts`
  ```
  const brutos: Record<PotentialSignal, number | null> = { cognitivo: normalizar(entrada.cognitivo), comportamental: normalizar(entrada.comportamental), cultural: normalizar(entrada.cultural), }; const presentes = (Object.keys(brutos) as PotentialSignal[]).filter( (sinal) => brutos[sinal] !== null, ); const ausentes = (Object.keys(brutos) as PotentialSignal[]).filter( (sinal) => brutos[sinal] === null, ); if (presentes.length === 0) { return { score: null, confianca: "insuficiente", componentes: [ …
  ```
- **calculateGenerationalResult(answers: Record<string, number | string>, toolId: string, timeSpent: number)** — `src/lib/advancedBehavioral/generational.ts`
  ```
  const generationScores: Record<string, number> = { silent: 0, baby_boomer: 0, gen_x: 0, millennial: 0, gen_z: 0, gen_alpha: 0, }; Object.entries(answers).forEach(([, answerIndex]) => { if (typeof answerIndex !== 'number') return; const genMap = ['silent_boomer', 'gen_x', 'millennial', 'gen_z']; const selectedGen = genMap[answerIndex]; if (!selectedGen) return; const add = (key: string, val: number) => { generationScores[key] = (generationScores[key] ?? 0) + val; }; if (selectedGen === 'silent_bo …
  ```
- **calculateAdvancedResult(toolId: string, answers: Record<string, number | string>, timeSpent: number, existingResults?: BehavioralResult[])** — `src/lib/advancedBehavioral/index.ts`
  ```
  const existingDISC = existingResults ? extractDISCFromResults(existingResults) : undefined; switch (toolId) { case 'generational': return calculateGenerationalResult(answers, toolId, timeSpent); case 'stress_profile': return calculateStressProfileResult(answers, toolId, timeSpent, existingDISC); case 'triune_brain': return calculateTriuneBrainResult(answers, toolId, timeSpent); default: return { toolId, completedAt: new Date().toISOString(), timeSpent, scores: {}, primaryProfile: '', rawAnswers: …
  ```
- **calculateStressProfileResult(answers: Record<string, number | string>, toolId: string, timeSpent: number, existingDISCProfile?: 'D' | 'I' | 'S' | 'C')** — `src/lib/advancedBehavioral/stressProfile.ts`
  ```
  const discScores: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 }; Object.entries(answers).forEach(([, answerIndex]) => { if (typeof answerIndex !== 'number') return; const profiles: ('D' | 'I' | 'S' | 'C')[] = ['D', 'I', 'S', 'C']; const selectedProfile = profiles[answerIndex]; if (selectedProfile) { discScores[selectedProfile] = (discScores[selectedProfile] ?? 0) + 4; } }); const sorted = Object.entries(discScores).sort(([, a], [, b]) => b - a); const stressProfile = (sorted[0]?.[0] || exi …
  ```
- **calculateTriuneBrainResult(answers: Record<string, number | string>, toolId: string, timeSpent: number)** — `src/lib/advancedBehavioral/triuneBrain.ts`
  ```
  const brainScores: Record<BrainType, number> = { reptiliano: 0, limbico: 0, neocortex: 0, }; Object.entries(answers).forEach(([, answerIndex]) => { if (typeof answerIndex !== 'number') return; const brains: BrainType[] = ['reptiliano', 'limbico', 'neocortex']; const selectedBrain = brains[answerIndex]; if (selectedBrain) brainScores[selectedBrain] += 4; }); const total = Object.values(brainScores).reduce((a, b) => a + b, 0); const reptilianoScore = Math.round((brainScores.reptiliano / Math.max(t …
  ```
- **calculateStandardResults(ctx: CalcContext)** — `src/lib/behavioral/behavioralScoring.ts`
  ```
  const { toolId, candidatoId, timeElapsed, answers, questions } = ctx; const scores: Record<string, number> = {}; const dimensionCounts: Record<string, number> = {}; questions.forEach((q) => { const answer = answers[q.id]; if (answer === undefined) return; const dimension = q.dimension; if (!scores[dimension]) { scores[dimension] = 0; dimensionCounts[dimension] = 0; } if (q.type === 'scale') { scores[dimension] = (scores[dimension] || 0) + Number(answer); dimensionCounts[dimension] = (dimensionCo …
  ```
- **calculateAdvancedResults(ctx: CalcContext)** — `src/lib/behavioral/behavioralScoring.ts`
  ```
  const { toolId, candidatoId, timeElapsed, answers } = ctx; const baseResult: BehavioralResult = { toolId, candidatoId, completedAt: new Date().toISOString(), timeSpent: timeElapsed, scores: {}, primaryProfile: '', rawAnswers: answers, }; if (toolId === 'generational') { const genScores: Record<string, number> = { silent: 0, baby_boomer: 0, gen_x: 0, millennial: 0, gen_z: 0, gen_alpha: 0, }; const genMap = ['baby_boomer', 'gen_x', 'millennial', 'gen_z']; Object.entries(answers).forEach(([, answer …
  ```
- **calculateBehavioralResults(ctx: CalcContext)** — `src/lib/behavioral/behavioralScoring.ts`
  ```
  if (ADVANCED_TOOLS.has(ctx.toolId)) { return calculateAdvancedResults(ctx); } return calculateStandardResults(ctx);
  ```
- **gerarRelatorioExecutivo(candidato: CandidatoComparativo, jobFit?: JobFitResult, redFlags?: RedFlagDetectado[])** — `src/lib/jobFit/executiveReport.ts`
  ```
  const scoreConsolidado = jobFit?.scoreTotalFit || calcularScoreConsolidado(candidato); const classificacao = determinarClassificacao(scoreConsolidado); return { id: crypto.randomUUID(), candidatoId: candidato.id, candidatoNome: candidato.nome, vagaId: jobFit?.vagaId, vagaTitulo: jobFit?.vagaTitulo, scoreFinalConsolidado: scoreConsolidado, classificacaoGeral: classificacao, manchetePrincipal: gerarManchete(candidato, classificacao, redFlags), secoes: { perfilComportamental: { titulo: 'Perfil Comp …
  ```
- **calcularScoreConsolidado(candidato: CandidatoComparativo)** — `src/lib/jobFit/executiveReport.ts`
  ```
  let total = 0; let count = 0; if (candidato.discScores) { total += (candidato.discScores.D + candidato.discScores.I + candidato.discScores.S + candidato.discScores.C) / 4; count++; } if (candidato.resiliencia) { total += candidato.resiliencia; count++; } if (candidato.jobFitScore) { total += candidato.jobFitScore; count++; } return count > 0 ? Math.round(total / count) : 50;
  ```
- **gerarManchete(candidato: CandidatoComparativo, classificacao: RelatorioExecutivo['classificacaoGeral'], redFlags?: RedFlagDetectado[])** — `src/lib/jobFit/executiveReport.ts`
  ```
  const numCriticos = redFlags?.filter(r => r.severidade === 'critico').length || 0; if (numCriticos > 0) return `⚠️ ${candidato.nome} apresenta ${numCriticos} ponto(s) crítico(s) de atenção`; const manchetes = { excepcional: `🌟 ${candidato.nome} é um candidato excepcional para a posição`, acima_media: `✅ ${candidato.nome} demonstra perfil acima da média`, adequado: `📊 ${candidato.nome} atende aos requisitos da posição`, abaixo_media: `📉 ${candidato.nome} apresenta gaps significativos`, nao_recome …
  ```
- **gerarSecaoPerfilComportamental(cand: CandidatoComparativo)** — `src/lib/jobFit/executiveReport.ts`
  ```
  const partes: string[] = []; if (cand.discPrimario) partes.push(`Perfil DISC primário: ${cand.discPrimario}`); if (cand.cerebroDominante) partes.push(`Cérebro dominante: ${cand.cerebroDominante}`); if (cand.geracao) partes.push(`Perfil geracional: ${cand.geracao}`); if (cand.stressResponse) partes.push(`Resposta ao stress: ${cand.stressResponse}`); return partes.join('. ') || 'Avaliações comportamentais pendentes';
  ```
- **gerarSecaoPontosFortes(jf?: JobFitResult)** — `src/lib/jobFit/executiveReport.ts`
  ```
  const fortes = jf?.matchesPositivos.slice(0, 5).map(m => m.nome) || []; return fortes.length > 0 ? fortes.join(', ') : 'Aguardando mais avaliações';
  ```
- **gerarSecaoAreasDesenvolvimento(jf?: JobFitResult)** — `src/lib/jobFit/executiveReport.ts`
  ```
  const areas = jf?.alertas.slice(0, 5).map(a => a.nome) || []; return areas.length > 0 ? areas.join(', ') : 'Nenhuma área crítica identificada';
  ```
- **gerarSecaoRiscos(redFlags?: RedFlagDetectado[])** — `src/lib/jobFit/executiveReport.ts`
  ```
  if (!redFlags || redFlags.length === 0) return 'Nenhum risco significativo identificado'; return redFlags.map(rf => `${rf.severidade.toUpperCase()}: ${rf.mensagem}`).join('. ');
  ```
- **gerarSecaoRecomendacao(classificacao: RelatorioExecutivo['classificacaoGeral'], redFlags?: RedFlagDetectado[])** — `src/lib/jobFit/executiveReport.ts`
  ```
  const numCriticos = redFlags?.filter(r => r.severidade === 'critico').length || 0; if (numCriticos > 0) return 'Recomenda-se não prosseguir devido a riscos críticos identificados. Caso decida prosseguir, aprofunde especificamente nos pontos de risco em entrevista.'; if (classificacao === 'excepcional') return 'Candidato altamente recomendado. Priorize para próximas etapas.'; if (classificacao === 'acima_media') return 'Bom candidato. Recomenda-se entrevista para validar pontos específicos.'; if …
  ```
- **calcularConfianca(candidato: CandidatoComparativo)** — `src/lib/jobFit/executiveReport.ts`
  ```
  return Math.min(95, 50 + candidato.avaliacoesCompletadas.length * 10);
  ```
- **gerarProximosPassos(classificacao: RelatorioExecutivo['classificacaoGeral'], redFlags?: RedFlagDetectado[])** — `src/lib/jobFit/executiveReport.ts`
  ```
  const passos: string[] = []; if (classificacao === 'excepcional' || classificacao === 'acima_media') passos.push('Agendar entrevista com gestor da área'); if (redFlags && redFlags.length > 0) { passos.push('Aprofundar pontos de atenção em entrevista comportamental'); passos.push(...redFlags.slice(0, 2).map(rf => rf.perguntasEntrevista[0] || '').filter(Boolean)); } if (classificacao === 'adequado' || classificacao === 'abaixo_media') passos.push('Comparar com outros candidatos antes de decidir'); …
  ```
- **calcularJobFit(candidato: CandidatoComparativo, perfilIdeal: PerfilIdealComportamental)** — `src/lib/jobFit/jobFitCalculator.ts`
  ```
  const detalhes: JobFitDetalhe[] = []; const alertas: JobFitDetalhe[] = []; const dealbreakersViolados: string[] = []; let scoreDISC = 0; let scoreCompetencias = 0; let scoreResiliencia = 0; let scoreCerebroTrino = 0; if (candidato.discScores) { const discFit = calcularDISCFit(candidato.discScores, perfilIdeal.discIdeal); scoreDISC = discFit.score; detalhes.push(...discFit.matches); alertas.push(...discFit.alertas); } if (perfilIdeal.dealbreakers.discProfilesIncompativeis && candidato.discPrimari …
  ```
- **calcularDISCFit(candidatoScores: { D: number; I: number; S: number; C: number }, idealDISC: PerfilIdealComportamental['discIdeal'])** — `src/lib/jobFit/jobFitCalculator.ts`
  ```
  score: number; matches: JobFitDetalhe[]; alertas: JobFitDetalhe[]
  ```
- **calcularCompetenciasFit(candidatoComp: Record<string, number>, idealComp: PerfilIdealComportamental['competencias'])** — `src/lib/jobFit/jobFitCalculator.ts`
  ```
  score: number; matches: JobFitDetalhe[]; alertas: JobFitDetalhe[]
  ```
- **gerarResumoExecutivo(candidato: CandidatoComparativo, nivel: JobFitNivel, matches: JobFitDetalhe[], alertas: JobFitDetalhe[])** — `src/lib/jobFit/jobFitCalculator.ts`
  ```
  const nivelTexto = { excelente: 'excelente compatibilidade', alto: 'alta compatibilidade', moderado: 'compatibilidade moderada', baixo: 'baixa compatibilidade', incompativel: 'não é compatível' }; return `${candidato.nome} apresenta ${nivelTexto[nivel]} com a vaga. Foram identificados ${matches.length} pontos positivos e ${alertas.length} áreas de atenção. ${candidato.discPrimario ? `Perfil comportamental predominante: ${candidato.discPrimario}.` : ''}`;
  ```
- **gerarJustificativa(matches: JobFitDetalhe[], alertas: JobFitDetalhe[], dealbreakers: string[])** — `src/lib/jobFit/jobFitCalculator.ts`
  ```
  if (dealbreakers.length > 0) return `Não recomendado devido a: ${dealbreakers.join('; ')}.`; const pontosFortes = matches.slice(0, 2).map(m => m.nome).join(', '); const pontosAtencao = alertas.slice(0, 2).map(a => a.nome).join(', '); let texto = ''; if (pontosFortes) texto += `Destaques positivos: ${pontosFortes}. `; if (pontosAtencao) texto += `Requer atenção: ${pontosAtencao}.`; return texto || 'Análise baseada nos resultados comportamentais disponíveis.';
  ```
- **gerarPerguntasValidacao(alertas: JobFitDetalhe[], candidato: CandidatoComparativo)** — `src/lib/jobFit/jobFitCalculator.ts`
  ```
  const perguntas: string[] = []; alertas.forEach(alerta => { if (alerta.categoria === 'DISC') { if (alerta.nome === 'Dominância' && alerta.diferenca > 0) perguntas.push('Como você equilibra assertividade com escuta ativa em situações de conflito?'); if (alerta.nome === 'Estabilidade' && alerta.diferenca > 0) perguntas.push('Conte sobre uma situação em que precisou se adaptar rapidamente a mudanças'); } if (alerta.categoria === 'Competências' && alerta.diferenca < -15) perguntas.push(`Quais experi …
  ```
- **calculateBigFiveResult(answers: PersonalityAnswer[])** — `src/lib/personality/bigFiveCalculator.ts`
  ```
  const dimensions: Record<string, { scores: number[]; facets: Record<string, number[]> }> = { openness: { scores: [], facets: {} }, conscientiousness: { scores: [], facets: {} }, extraversion: { scores: [], facets: {} }, agreeableness: { scores: [], facets: {} }, neuroticism: { scores: [], facets: {} }, }; BIG_FIVE_QUESTIONS.forEach(question => { const answer = answers.find(a => a.questionId === question.id); if (!answer || !question.dimension) return; let value = answer.value; if (question.rever …
  ```
- **calculatePercentile(score: number)** — `src/lib/personality/bigFiveCalculator.ts`
  ```
  return Math.min(99, Math.max(1, score + Math.floor(Math.random() * 10) - 5));
  ```
- **generatePersonalitySummary(dimensions: BigFiveDimension[])** — `src/lib/personality/bigFiveCalculator.ts`
  ```
  const high = dimensions.filter(d => d.score > 65); const low = dimensions.filter(d => d.score < 35); let summary = 'Você possui um perfil '; if (high.length > 0) summary += `com destaque em ${high.map(d => d.label).join(' e ')}. `; if (low.length > 0) summary += `Apresenta menor intensidade em ${low.map(d => d.label).join(' e ')}.`; return summary || 'Você possui um perfil equilibrado entre as dimensões de personalidade.';
  ```
- **generateWorkStyle(dimensions: BigFiveDimension[])** — `src/lib/personality/bigFiveCalculator.ts`
  ```
  const C = dimensions.find(d => d.dimension === 'conscientiousness')?.score || 50; const E = dimensions.find(d => d.dimension === 'extraversion')?.score || 50; const O = dimensions.find(d => d.dimension === 'openness')?.score || 50; if (C > 70 && E < 40) return 'Metódico e focado, prefere trabalhar de forma independente e estruturada.'; if (E > 70 && C > 60) return 'Colaborativo e organizado, lidera bem projetos em equipe.'; if (O > 70) return 'Criativo e inovador, busca constantemente novas abor …
  ```
- **generateCommunicationStyle(dimensions: BigFiveDimension[])** — `src/lib/personality/bigFiveCalculator.ts`
  ```
  const E = dimensions.find(d => d.dimension === 'extraversion')?.score || 50; const A = dimensions.find(d => d.dimension === 'agreeableness')?.score || 50; if (E > 70 && A > 70) return 'Expressivo e empático, conecta-se facilmente com outros.'; if (E > 70 && A < 40) return 'Direto e assertivo, comunica-se com clareza e objetividade.'; if (E < 40 && A > 70) return 'Atencioso e reservado, ouve mais do que fala.'; return 'Equilibrado, adapta o estilo de comunicação ao contexto.';
  ```
- **generateLeadershipStyle(dimensions: BigFiveDimension[])** — `src/lib/personality/bigFiveCalculator.ts`
  ```
  const E = dimensions.find(d => d.dimension === 'extraversion')?.score || 50; const C = dimensions.find(d => d.dimension === 'conscientiousness')?.score || 50; const A = dimensions.find(d => d.dimension === 'agreeableness')?.score || 50; if (E > 70 && C > 70) return 'Líder carismático e organizado, inspira e estrutura a equipe.'; if (C > 70 && A > 70) return 'Líder servidor, focado em apoiar o desenvolvimento da equipe.'; if (E > 70 && A < 50) return 'Líder visionário, define direção com autorida …
  ```
- **generateTeamRole(dimensions: BigFiveDimension[])** — `src/lib/personality/bigFiveCalculator.ts`
  ```
  const O = dimensions.find(d => d.dimension === 'openness')?.score || 50; const C = dimensions.find(d => d.dimension === 'conscientiousness')?.score || 50; const E = dimensions.find(d => d.dimension === 'extraversion')?.score || 50; if (O > 70) return 'Inovador - gera ideias e soluções criativas'; if (C > 70) return 'Implementador - transforma ideias em ação'; if (E > 70) return 'Coordenador - conecta pessoas e recursos'; return 'Especialista - contribui com conhecimento técnico';
  ```
- **generateStressResponse(dimensions: BigFiveDimension[])** — `src/lib/personality/bigFiveCalculator.ts`
  ```
  const N = dimensions.find(d => d.dimension === 'neuroticism')?.score || 50; if (N > 70) return 'Pode experimentar estresse intensamente. Recomenda-se técnicas de regulação emocional.'; if (N < 30) return 'Geralmente resiliente sob pressão. Mantém a calma em situações difíceis.'; return 'Resposta moderada ao estresse, com capacidade de recuperação.';
  ```
- **generateDevelopmentAreas(dimensions: BigFiveDimension[])** — `src/lib/personality/bigFiveCalculator.ts`
  ```
  const areas: string[] = []; dimensions.forEach(dim => { if (dim.dimension === 'neuroticism' && dim.score > 60) areas.push('Desenvolver técnicas de gerenciamento de estresse'); if (dim.dimension === 'conscientiousness' && dim.score < 40) areas.push('Trabalhar organização e gestão do tempo'); if (dim.dimension === 'agreeableness' && dim.score < 40) areas.push('Praticar empatia e colaboração'); if (dim.dimension === 'openness' && dim.score < 40) areas.push('Explorar novas perspectivas e ideias'); i …
  ```
- **calculateEnneagramResult(answers: PersonalityAnswer[])** — `src/lib/personality/enneagramCalculator.ts`
  ```
  const typeScores: Record<number, number[]> = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [] }; ENNEAGRAM_QUESTIONS.forEach(question => { const answer = answers.find(a => a.questionId === question.id); if (!answer || !question.dimension) return; const typeNum = parseInt(question.dimension); if (typeScores[typeNum]) typeScores[typeNum].push(answer.value); }); const typeResults: EnneagramTypeScore[] = Object.entries(typeScores).map(([typeStr, scores]) => { const typeNum = parseInt( …
  ```
- **calculateDominantInstinct()** — `src/lib/personality/enneagramCalculator.ts`
  ```
  return 'autopreservacao';
  ```
- **calculateHealthLevel(coreScore: number)** — `src/lib/personality/enneagramCalculator.ts`
  ```
  if (coreScore > 85) return 'muito_saudavel'; if (coreScore > 70) return 'saudavel'; if (coreScore > 50) return 'medio'; if (coreScore > 30) return 'nao_saudavel'; return 'muito_nao_saudavel';
  ```
- **calculateConsistency(typeResults: EnneagramTypeScore[])** — `src/lib/personality/enneagramCalculator.ts`
  ```
  if (typeResults.length < 2) return 100; const first = typeResults[0]; const second = typeResults[1]; if (!first || !second) return 100; const gap = first.score - second.score; if (gap > 20) return 95; if (gap > 10) return 80; if (gap > 5) return 65; return 50;
  ```
- **calculateMBTIResult(answers: PersonalityAnswer[])** — `src/lib/personality/mbtiCalculator.ts`
  ```
  const dichotomyScores: Record<string, { left: number[]; right: number[] }> = { EI: { left: [], right: [] }, SN: { left: [], right: [] }, TF: { left: [], right: [] }, JP: { left: [], right: [] }, }; MBTI_QUESTIONS.forEach(question => { const answer = answers.find(a => a.questionId === question.id); if (!answer || !question.dimension) return; const dim = dichotomyScores[question.dimension]; if (!dim) return; if (question.reverse) { dim.right.push(answer.value); } else { dim.left.push(answer.value) …
  ```
- **dichotomyScore(s)** — `src/lib/personality/mbtiCalculator.ts`
  ```
  left: number[]; right: number[]
  ```
- **calculateDichotomy(dimension: 'EI' | 'SN' | 'TF' | 'JP', leftLabel: string, rightLabel: string, scores: { left: number[]; right: number[] })** — `src/lib/personality/mbtiCalculator.ts`
  ```
  const leftAvg = scores.left.length > 0 ? scores.left.reduce((a, b) => a + b, 0) / scores.left.length : 4; const rightAvg = scores.right.length > 0 ? scores.right.reduce((a, b) => a + b, 0) / scores.right.length : 4; const leftNorm = normalizeScore(leftAvg, 1, 7); const rightNorm = normalizeScore(rightAvg, 1, 7); const totalScore = Math.round((100 - leftNorm + rightNorm) / 2); const clarity = Math.abs(totalScore - 50) * 2; const leftLetter = dimension[0] as 'E' | 'S' | 'T' | 'J'; const rightLette …
  ```
- **calculateCognitiveFunctions(type: MBTIType)** — `src/lib/personality/mbtiCalculator.ts`
  ```
  const functionStacks: Record<MBTIType, string[]> = { INTJ: ['Ni', 'Te', 'Fi', 'Se'], INTP: ['Ti', 'Ne', 'Si', 'Fe'], ENTJ: ['Te', 'Ni', 'Se', 'Fi'], ENTP: ['Ne', 'Ti', 'Fe', 'Si'], INFJ: ['Ni', 'Fe', 'Ti', 'Se'], INFP: ['Fi', 'Ne', 'Si', 'Te'], ENFJ: ['Fe', 'Ni', 'Se', 'Ti'], ENFP: ['Ne', 'Fi', 'Te', 'Si'], ISTJ: ['Si', 'Te', 'Fi', 'Ne'], ISFJ: ['Si', 'Fe', 'Ti', 'Ne'], ESTJ: ['Te', 'Si', 'Ne', 'Fi'], ESFJ: ['Fe', 'Si', 'Ne', 'Ti'], ISTP: ['Ti', 'Se', 'Ni', 'Fe'], ISFP: ['Fi', 'Se', 'Ni', 'Te'], …
  ```
- **calculateConsistency(answers: PersonalityAnswer[], validationPairs: Record<string, string>)** — `src/lib/personality/utils.ts`
  ```
  let consistentPairs = 0; let totalPairs = 0; Object.entries(validationPairs).forEach(([questionId, pairId]) => { const answer1 = answers.find(a => a.questionId === questionId); const answer2 = answers.find(a => a.questionId === pairId); if (answer1 && answer2) { totalPairs++; const diff = Math.abs(answer1.value - (6 - answer2.value)); if (diff <= 1) consistentPairs++; } }); return totalPairs > 0 ? Math.round((consistentPairs / totalPairs) * 100) : 100;
  ```
- **normalizeScore(raw: number, min: number, max: number)** — `src/lib/personality/utils.ts`
  ```
  return Math.round(((raw - min) / (max - min)) * 100);
  ```
- **openFeedback(e: EntrevistaCardData)** — `src/pages/AgendaPage.tsx`
  ```
  setEntrevistaSelecionada(e); setFeedbackDialog(true);
  ```
- **AplicarVagaPage()** — `src/pages/AplicarVagaPage.tsx`
  ```
  const { vagaId = '' } = useParams<{ vagaId: string }>(); const navigate = useNavigate(); const [nome, setNome] = useState(''); const [email, setEmail] = useState(''); const [telefone, setTelefone] = useState(''); const [linkedin, setLinkedin] = useState(''); const [carta, setCarta] = useState(''); const [curriculo, setCurriculo] = useState<File | null>(null); const [knockoutAnswers, setKnockoutAnswers] = useState<Record<string, KnockoutAnswer>>({}); const [submitting, setSubmitting] = useState(f …
  ```
- **scoreColor(score: number)** — `src/pages/RankingVagaPage.tsx`
  ```
  if (score >= 80) return "text-success"; if (score >= 60) return "text-warning"; return "text-destructive";
  ```
- **RankingVagaPage()** — `src/pages/RankingVagaPage.tsx`
  ```
  const { vagaId } = useParams<{ vagaId: string }>(); const { data: rows = [], isLoading } = useRankingVaga(vagaId); const bulk = useBulkAiScreening(vagaId); const stats = useRankingStats(rows); const [running, setRunning] = useState(false); const { data: vaga } = useQuery({ queryKey: ["vaga-mini", vagaId], enabled: !!vagaId, queryFn: async () => { const { data } = await supabase.from("vagas").select("id, titulo").eq("id", vagaId!).maybeSingle(); return data; }, }); const pendentes = useMemo(() => …
  ```
- **generateReport(config: ReportConfig)** — `src/pages/ReportsPage.tsx`
  ```
  setIsLoading(true); setActiveReport(config); try { const data = await fetchReportData(config); setReportData(data); setActiveTab('result'); toast({ title: 'Relatório gerado!', description: config.name }); } catch (error) { toast({ title: 'Erro', description: 'Falha ao gerar relatório', variant: 'destructive' }); } finally { setIsLoading(false); }
  ```
- **securityScore()** — `src/pages/settings/SecuritySettingsPage.tsx`
  ```
  let score = 30; if (is2FAEnabled) score += 40; if (passkeys.length > 0) score += 30; return Math.min(score, 100);
  ```
- **calculateMatchScore(candidatoId: string, vagaId: string)** — `src/services/aiService.ts`
  ```
  const { data, error } = await supabase.functions.invoke('match-score', { body: { candidatoId, vagaId }, }); if (error) throw error; return data;
  ```
- **generateScorecard(processoId: string)** — `src/services/aiService.ts`
  ```
  const { data, error } = await supabase.functions.invoke('generate-scorecard', { body: { processoId }, }); if (error) throw error; return data;
  ```
- **generateInsights(context: string)** — `src/services/aiService.ts`
  ```
  edgeFunctionLogger.info('Generate insights', { context }); return { insights: [] };
  ```
- **validate(data: Record<string, string>[], schema: z.ZodSchema)** — `src/services/importService.ts`
  ```
  const result: ImportResult = { total: data.length, success: 0, errors: [] }; data.forEach((row, i) => { const parsed = schema.safeParse(row); if (parsed.success) { result.success++; } else { result.errors.push({ row: i + 1, message: parsed.error.issues.map((e) => e.message).join(', ') }); } }); return result;
  ```
- **shouldLog(level: LogLevel)** — `src/services/logger.ts`
  ```
  if (!this.config.enabled) return false; return LOG_LEVELS[level] >= LOG_LEVELS[this.config.minLevel];
  ```
- **calculateSkillMatch(candidateSkills: string[], jobSkills: string[])** — `src/services/matchingService.ts`
  ```
  if (!jobSkills.length) return { score: 100, matched: [], missing: [], extra: candidateSkills }; const normalizedCandidate = candidateSkills.map((s) => s.toLowerCase().trim()); const normalizedJob = jobSkills.map((s) => s.toLowerCase().trim()); const matched = normalizedJob.filter((s) => normalizedCandidate.includes(s)); const missing = normalizedJob.filter((s) => !normalizedCandidate.includes(s)); const extra = normalizedCandidate.filter((s) => !normalizedJob.includes(s)); const score = Math.rou …
  ```
- **generateMeetingLink(type: 'google_meet' | 'teams' | 'zoom')** — `src/services/meetingService.ts`
  ```
  const id = crypto.randomUUID().slice(0, 12); switch (type) { case 'google_meet': return `https://meet.google.com/${id}`; case 'teams': return `https://teams.microsoft.com/l/meetup-join/${id}`; case 'zoom': return `https://zoom.us/j/${id}`; default: return ''; }
  ```
- **calculateDuration(start: string, end: string)** — `src/services/meetingService.ts`
  ```
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
  ```
- **validateResetToken(token: string)** — `src/services/passwordResetService.ts`
  ```
  valid: boolean; email?: string; requestId?: string
  ```
- **calculateDNACode(helix: DNAHelix)** — `src/types/behavioralDNA.ts`
  ```
  return `S${Math.round(helix.strategic)}-E${Math.round(helix.emotional)}-I${Math.round(helix.influence)}-V${Math.round(helix.values)}-A${Math.round(helix.adaptive)}`;
  ```
- **score(s)** — `src/types/behavioralDNA.ts`
  ```
  id: DNAArchetypeId; score: number
  ```
- **calculateMatchCompatibility(profile1: DNAProfile, profile2: DNAProfile)** — `src/types/behavioralDNA.ts`
  ```
  const arch1 = DNA_ARCHETYPES.find(a => a.id === profile1.archetype); const arch2 = DNA_ARCHETYPES.find(a => a.id === profile2.archetype); if (!arch1 || !arch2) return 50; // Base score from helix similarity let helixScore = 0; const helixKeys: (keyof DNAHelix)[] = ['strategic', 'emotional', 'influence', 'values', 'adaptive']; helixKeys.forEach(key => { const diff = Math.abs(profile1.helix[key] - profile2.helix[key]); helixScore += (100 - diff) / 5; }); // Archetype compatibility bonus let archet …
  ```
- **generateCandidateEmail(entrevista: Entrevista)** — `supabase/functions/interview-reminders/index.ts`
  ```
  const locationInfo = entrevista.tipo === 'online' && entrevista.link_online ? `<p><strong>Link da reunião:</strong> <a href="${entrevista.link_online}">${entrevista.link_online}</a></p>` : entrevista.local ? `<p><strong>Local:</strong> ${entrevista.local}</p>` : ''; return ` <!DOCTYPE html> <html lang="pt-BR"> <head> <meta charset="UTF-8"> <style> body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; } .header { background: linear-gra …
  ```
- **generateInterviewerEmail(entrevista: Entrevista, interviewerName: string)** — `supabase/functions/interview-reminders/index.ts`
  ```
  const locationInfo = entrevista.tipo === 'online' && entrevista.link_online ? `<p><strong>Link da reunião:</strong> <a href="${entrevista.link_online}">${entrevista.link_online}</a></p>` : entrevista.local ? `<p><strong>Local:</strong> ${entrevista.local}</p>` : ''; return ` <!DOCTYPE html> <html lang="pt-BR"> <head> <meta charset="UTF-8"> <style> body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; } .header { background: linear-gra …
  ```

### G.4 Percentuais e multiplicadores no código

| Trecho | Arquivo |
|---|---|
| `transition={{ delay: index * 0.05 }}` | `src/components/agenda/AgendaTimeline.tsx` |
| `transition={{ delay: index * 0.1 }}` | `src/components/agenda/aiScheduler/SuggestedSlotCard.tsx` |
| `<span>0%</span>` | `src/components/assessments/CulturalResultView.tsx` |
| `<span>100%</span>` | `src/components/assessments/CulturalResultView.tsx` |
| `transition={{ delay: index * 0.1 }}` | `src/components/assessments/gamified/PhaseChallenge.tsx` |
| `transition={{ delay: index * 0.05 }}` | `src/components/assessments/gamified/personalityMiniGame/GameRenderers.tsx` |
| `transition={{ delay: index * 0.1 }}` | `src/components/assessments/gamified/personalityMiniGame/GameRenderers.tsx` |
| `transition={{ delay: index * 0.1 }}` | `src/components/assessments/gamified/phases/GamifiedPlayingPhase.tsx` |
| `transition={{ delay: value * 0.05 }}` | `src/components/assessments/gamified/phases/GamifiedPlayingPhase.tsx` |
| `transition={{ delay: index * 0.1 }}` | `src/components/assessments/immersive/FollowUpPhase.tsx` |
| `transition={{ delay: index * 0.1 }}` | `src/components/assessments/immersive/OptionsPhase.tsx` |
| `transition={{ delay: index * 0.05 }}` | `src/components/behavioral/BehavioralToolsGrid.tsx` |
| `transition={{ delay: index * 0.03, duration: 0.3 }}` | `src/components/candidatos/CandidatoCardEnhanced.tsx` |
| `transition={{ delay: Math.min(index * 0.02, 0.3) }}` | `src/components/common/VirtualList.tsx` |
| `transition={{ delay: index * 0.05 + 0.1, type: 'spring' as const }}` | `src/components/dashboard/AcoesPendentes.tsx` |
| `transition={{ delay: index * 0.05, type: 'spring' as const, stiffness: 300 }}` | `src/components/dashboard/AcoesPendentes.tsx` |
| `transition={{ delay: index * 0.08, type: 'spring', stiffness: 400 }}` | `src/components/dashboard/AcoesRapidas.tsx` |
| `transition={{ delay: index * 0.08 + 0.1 }}` | `src/components/dashboard/AgendaHoje.tsx` |
| `transition={{ delay: index * 0.08, type: 'spring', stiffness: 300 }}` | `src/components/dashboard/AgendaHoje.tsx` |
| `transition={{ delay: index * 0.08, type: 'spring' as const, stiffness: 300 }}` | `src/components/dashboard/AlertasInteligentes.tsx` |
| `transition={{ delay: index * 0.1 + 0.2, type: 'spring' as const }}` | `src/components/dashboard/EntrevistasChart.tsx` |
| `transition={{ delay: index * 0.1 }}` | `src/components/dashboard/EntrevistasChart.tsx` |
| `transition={{ delay: index * 0.08 }}` | `src/components/dashboard/FunilChart.tsx` |
| `transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}` | `src/components/dashboard/FunilChart.tsx` |
| `transition={{ duration: 1.5, delay: index * 0.1 + 0.6, ease: "easeInOut" }}` | `src/components/dashboard/FunilChart.tsx` |
| `const isOnTrack = target ? value >= target * 0.8 : true;` | `src/components/dashboard/InteractiveKPICard.tsx` |
| `transition={{ delay: index * 0.05, type: 'spring', stiffness: 200 }}` | `src/components/dashboard/InteractiveKPICard.tsx` |
| `transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}` | `src/components/dashboard/InteractiveKPICard.tsx` |
| `delay: index * 0.08,` | `src/components/dashboard/KPICard.tsx` |
| `transition={{ delay: index * 0.08 + 0.2, type: 'spring', stiffness: 400 }}` | `src/components/dashboard/KPICard.tsx` |
| `transition={{ delay: index * 0.08 + 0.3 }}` | `src/components/dashboard/KPICard.tsx` |
| `transition={{ delay: index * 0.08 + 0.4 }}` | `src/components/dashboard/KPICard.tsx` |
| `transition={{ delay: index * 0.08 + 0.5 }}` | `src/components/dashboard/KPICard.tsx` |
| `transition={{ delay: index * 0.08 + 0.6 }}` | `src/components/dashboard/KPICard.tsx` |
| `transition={{ duration: 0.3, delay: index * 0.02 }}` | `src/components/dashboard/LiveActivityFeed.tsx` |
| `transition={{ delay: index * 0.08 }}` | `src/components/dashboard/SmartInsights.tsx` |
| `transition={{ delay: index * 0.08, type: 'spring' as const, stiffness: 300 }}` | `src/components/dashboard/TopCandidatos.tsx` |
| `transition={{ delay: index * 0.1, type: 'spring', stiffness: 300 }}` | `src/components/dashboard/VagasUrgentes.tsx` |
| `transition={{ delay: i * 0.1 }}` | `src/components/deu-match/DeuMatchProfileResult.tsx` |
| `transition={{ delay: index * 0.1 }}` | `src/components/dna/DNAHelix3D.tsx` |
| `next.emotional = Math.min(100, prev.emotional + adjustment * 0.5);` | `src/components/dna/DNAJourneyExperience.tsx` |
| `next.influence = Math.min(100, prev.influence + adjustment * 0.5);` | `src/components/dna/DNAJourneyExperience.tsx` |
| `transition={{ delay: index * 0.1 }}` | `src/components/dna/ImmersiveScenarioPlayer.tsx` |
| `transition={{ delay: 0.4 + i * 0.1 }}` | `src/components/dna/journey/DNAJourneyIntro.tsx` |
| `value.length > maxLength * 0.9 ? "text-warning" : "text-muted-foreground",` | `src/components/forms/SmartFormField.tsx` |
| `transition={{ duration: 0.8, delay: i * 0.05 }}` | `src/components/gamification/MicroInteractionCards.tsx` |
| `transition={{ delay: 0.5 + index * 0.1 }}` | `src/components/gamification/ProgressRing.tsx` |
| `transition={{ duration: 1.5, ease: "easeOut", delay: index * 0.2 }}` | `src/components/gamification/ProgressRing.tsx` |
| `level: Math.floor(15 - (index * 0.8)),` | `src/components/gamification/RealtimeLeaderboard.tsx` |
| `transition={{ delay: index * 0.05 }}` | `src/components/gamification/RealtimeLeaderboard.tsx` |
| `delay: i * 0.3,` | `src/components/gamification/StreakDisplay.tsx` |
| `transition={{ delay: index * 0.02 }}` | `src/components/gamification/StreakDisplay.tsx` |
| `delay={i * 0.1}` | `src/components/gamification/XPToast.tsx` |
| `transition={{ delay: index * 0.1 }}` | `src/components/gamification/achievementProfile/AchievementShowcase.tsx` |
| `transition={{ delay: index * 0.05, duration: 0.3 }}` | `src/components/gamification/achievements/AchievementGrid.tsx` |
| `transition={{ delay: 0.3 + index * 0.1, type: "spring" }}` | `src/components/gamification/leaderboard/LeaderboardPodium.tsx` |
| `transition={{ delay: index * 0.1 }}` | `src/components/gamification/leaderboard/LeaderboardPodium.tsx` |
| `transition={{ delay: index * 0.05 }}` | `src/components/gamification/leaderboard/LeaderboardRow.tsx` |
| `transition={{ delay: index * 0.05 }}` | `src/components/gamification/leaderboard/MiniLeaderboard.tsx` |
| `transition={{ delay: orderIndex * 0.2 }}` | `src/components/gamification/teamCompetition/TeamPodium.tsx` |
| `transition={{ delay: index * 0.05 }}` | `src/components/hiring-manager/HiringManagerCandidates.tsx` |
| `transition={{ delay: index * 0.1 }}` | `src/components/hiring-manager/HiringManagerSidebar.tsx` |
| `transition={{ delay: index * 0.1 }}` | `src/components/hiring-manager/HiringManagerVagas.tsx` |
| `transition={{ delay: index * 0.03 }}` | `src/components/intelligence/PredictiveSearch.tsx` |
| `transition={{ delay: index * 0.02 }}` | `src/components/intelligence/RecentActions.tsx` |
| `transition={{ delay: index * 0.05 }}` | `src/components/intelligence/RecentActionsWidget.tsx` |
| `transition={{ delay: index * 0.05 }}` | `src/components/intelligence/SmartSuggestions.tsx` |
| `transition={{ delay: groupIndex * 0.05 + itemIndex * 0.02 }}` | `src/components/layout/AppSidebar.tsx` |
| `transition={{ delay: index * 0.05 }}` | `src/components/match/MatchDashboard.tsx` |
| `transition={{ delay: index * 0.1 }}` | `src/components/match/candidateValuesQuiz/ResultsScreen.tsx` |
| `transition={{ delay: index * 0.1 }}` | `src/components/match/companyValuesQuiz/ResultsScreen.tsx` |
| `if (snap === 'full') return window.innerHeight * 0.9;` | `src/components/mobile/BottomSheet.tsx` |
| `if (snap === 'half') return window.innerHeight * 0.5;` | `src/components/mobile/BottomSheet.tsx` |
| `const dampedDiff = Math.min(maxPull, diff * 0.5);` | `src/components/mobile/PullToRefresh.tsx` |
| `transition={{ delay: index * 0.05 }}` | `src/components/navigation/SmartBreadcrumbs.tsx` |
| `transition={{ delay: index * 0.05 }}` | `src/components/offers/OfferCard.tsx` |
| `Apenas top candidatos (80%+)` | `src/components/pipeline/PipelineFilters.tsx` |
| `transition={{ delay: 0.1 + index * 0.05 }}` | `src/components/pipeline/PipelineStatsCards.tsx` |
| `transition={{ delay: index * 0.15 + 0.1 }}` | `src/components/portal/PortalProtectedRoute.tsx` |
| `transition={{ delay: index * 0.15 }}` | `src/components/portal/PortalProtectedRoute.tsx` |
| `delay: i * 0.15,` | `src/components/ui/contextual-loader.tsx` |
| `transition={{ delay: i * 0.1 }}` | `src/components/ui/contextual-loader.tsx` |
| `delay: index * 0.05` | `src/components/vagas/VagaCard.tsx` |
| `transition={{ delay: (index * 0.05) + (i * 0.05) }}` | `src/components/vagas/VagaCard.tsx` |
| `transition={{ delay: index * 0.05 }}` | `src/components/vagas/publisher/ConnectedBoardCard.tsx` |
| `transition={{ delay: i * 0.1 }}` | `src/components/vagas-list/VagasListStats.tsx` |
| `transition={{ delay: i * 0.02 }}` | `src/components/visualization/CandidateHeatmap.tsx` |
| `transition={{ delay: weekIndex * 0.02 + dayIndex * 0.01 }}` | `src/components/visualization/CandidateHeatmap.tsx` |
| `delay: (x + y) * 0.02,` | `src/components/visualization/Heatmap.tsx` |
| `delay: weekIndex * 0.01,` | `src/components/visualization/Heatmap.tsx` |
| `transition={{ delay: i * 0.05 }}` | `src/components/visualization/Heatmap.tsx` |
| `transition={{ duration: 0.5, delay: index * 0.02 }}` | `src/components/visualization/Sparkline.tsx` |
| `fast: 1.2, // < 80% do tempo estimado` | `src/config/behavioralGamification.ts` |
| `superFast: 1.5, // < 50% do tempo estimado` | `src/config/behavioralGamification.ts` |
| `- Alternativa improvisada: 4 dias, mas com 30% de chance de bugs críticos` | `src/config/behavioralPillars/scenarios.ts` |
| `- Pivotar 40% do negócio atual (lucrativo)` | `src/config/behavioralPillars/scenarios.ts` |
| `- Novo escopo invalida 40% do que já foi feito` | `src/data/immersiveScenarios/adaptability.ts` |
| `narrativa: `Mês 4 de 6. 70% do projeto concluído.` | `src/data/immersiveScenarios/adaptability.ts` |
| `narrativa: `Uma nova tecnologia (IA generativa) ameaça eliminar 60% do trabalho manual da sua equipe em 2 anos.` | `src/data/immersiveScenarios/adaptability.ts` |
| `- Chega atrasada em 70% das reuniões` | `src/data/immersiveScenarios/collaboration.ts` |
| `- Ignora novo entrante chinês com preços 40% menores` | `src/data/immersiveScenarios/criticalThinking.ts` |
| `- O eixo Y começa em 90%, exagerando a variação` | `src/data/immersiveScenarios/criticalThinking.ts` |
| `Opção B: Reduzir salários em 15% para todos por 6 meses` | `src/data/immersiveScenarios/leadership.ts` |
| `- Concorrentes têm taxa de 5%` | `src/data/immersiveScenarios/resultsOrientation.ts` |
| `- Turnover no time foi de 40% no ano` | `src/data/immersiveScenarios/resultsOrientation.ts` |
| `30% a mais de produção significa:` | `src/data/immersiveScenarios/resultsOrientation.ts` |
| `Probabilidade de problema: ~20%` | `src/data/immersiveScenarios/resultsOrientation.ts` |
| `narrativa: `Descoberta recente: você pode aumentar produção em 30% com pequena queda de qualidade.` | `src/data/immersiveScenarios/resultsOrientation.ts` |
| `narrativa: `Trimestre fantástico: 140% da meta, bônus recorde, CEO te elogiou publicamente.` | `src/data/immersiveScenarios/resultsOrientation.ts` |
| `? { count: combo.count + 1, multiplier: Math.min(4, 1 + combo.count * 0.5), lastAnswerTime: now }` | `src/hooks/useAssessmentEngine.ts` |
| `const resistedDistance = Math.min(maxPull, distance * 0.5);` | `src/hooks/usePullToRefresh.tsx` |
| `setPullDistance(threshold * 0.6); // Keep some distance while refreshing` | `src/hooks/usePullToRefresh.tsx` |
| `createOscillator(ctx, 1000, 0.03, 'sine', vol * 0.1);` | `src/hooks/useSoundPreferences.ts` |
| `createOscillator(ctx, 1046.50, 0.5, 'sine', vol * 0.4);` | `src/hooks/useSoundPreferences.ts` |
| `createOscillator(ctx, 200, 0.15, 'sawtooth', vol * 0.2);` | `src/hooks/useSoundPreferences.ts` |
| `createOscillator(ctx, 2000, 0.02, 'sine', vol * 0.05);` | `src/hooks/useSoundPreferences.ts` |
| `createOscillator(ctx, 440, 0.1, 'triangle', vol * 0.25);` | `src/hooks/useSoundPreferences.ts` |
| `createOscillator(ctx, 523.25, 0.15, 'sine', vol * 0.3);` | `src/hooks/useSoundPreferences.ts` |
| `createOscillator(ctx, 880, 0.15, 'sine', vol * 0.3);` | `src/hooks/useSoundPreferences.ts` |
| `setTimeout(() => createOscillator(ctx, 1108.73, 0.15, 'sine', vol * 0.3), 150);` | `src/hooks/useSoundPreferences.ts` |
| `setTimeout(() => createOscillator(ctx, 150, 0.2, 'sawtooth', vol * 0.15), 100);` | `src/hooks/useSoundPreferences.ts` |
| `setTimeout(() => createOscillator(ctx, 440, 0.1, 'triangle', vol * 0.25), 200);` | `src/hooks/useSoundPreferences.ts` |
| `setTimeout(() => createOscillator(ctx, 783.99, 0.2, 'sine', vol * 0.4), 100);` | `src/hooks/useSoundPreferences.ts` |
| `setTimeout(() => createOscillator(ctx, freq, 0.15, 'sine', vol * 0.2), i * 50);` | `src/hooks/useSoundPreferences.ts` |
| `setTimeout(() => createOscillator(ctx, freq, 0.25, 'sine', vol * 0.35), i * 80);` | `src/hooks/useSoundPreferences.ts` |
| `setTimeout(() => createOscillator(ctx, freq, 0.3, 'sine', vol * 0.4), delay);` | `src/hooks/useSoundPreferences.ts` |
| `setTimeout(() => createOscillator(ctx, freq, 0.3, 'sine', vol * 0.4), i * 100);` | `src/hooks/useSoundPreferences.ts` |
| `const temMatchPerfeito = matchesPerfeitos.length >= Math.ceil(detalhes.length * 0.5);` | `src/lib/matchCalculator.ts` |
| `const score = dentroRange ? 100 - (diferenca * 0.5) : Math.max(0, 100 - diferenca * 1.5);` | `src/lib/jobFit/jobFitCalculator.ts` |
| `confidence: Math.round(avgClarity * 0.95),` | `src/lib/personality/mbtiCalculator.ts` |
| `transition={{ delay: index * 0.1 }}` | `src/pages/OfferManagementPage.tsx` |
| `score: dominantScore * 0.6 + secondaryScore * 0.4` | `src/types/behavioralDNA.ts` |
| `const jitter = Math.random() * exp * 0.25;` | `supabase/functions/_shared/resilience.ts` |

## H. Parâmetros de negócio (constantes, prazos, limites)

### H.1 Constantes

| Constante | Valor | Arquivo |
|---|---|---|
| `CACHE_VERSION` | `'v2'` | `public/sw.js` |
| `TODAS_AS_VAGAS` | `"__todas__"` | `src/components/analytics/SlaOverdueList.tsx` |
| `SWIPE_THRESHOLD` | `100` | `src/components/assessments/gamified/SwipeValuesCard.tsx` |
| `COMBO_THRESHOLD` | `3000` | `src/components/assessments/gamified/engineConfig.ts` |
| `FAST_ANSWER_THRESHOLD` | `2000` | `src/components/assessments/gamified/engineConfig.ts` |
| `QUICK_TIME_BONUS` | `5` | `src/components/assessments/gamified/personalityMiniGame/types.ts` |
| `SESSION_TIMEOUT` | `24` | `src/components/auth/SessionManager.tsx` |
| `WARNING_BEFORE` | `5` | `src/components/auth/SessionManager.tsx` |
| `REFRESH_INTERVAL` | `23` | `src/components/auth/SessionManager.tsx` |
| `SLA_HORAS` | `48` | `src/components/dashboard/SlaAlertBanner.tsx` |
| `JANELA_DIAS` | `30` | `src/components/dashboard/SlaAlertBanner.tsx` |
| `MAX_VAGAS_LISTADAS` | `3` | `src/components/dashboard/SlaAlertBanner.tsx` |
| `SWIPE_THRESHOLD` | `100` | `src/components/match/MatchSwiper.tsx` |
| `SIDEBAR_COOKIE_MAX_AGE` | `60` | `src/components/ui/sidebar.tsx` |
| `SIDEBAR_WIDTH` | `"16rem"` | `src/components/ui/sidebar.tsx` |
| `SIDEBAR_WIDTH_MOBILE` | `"18rem"` | `src/components/ui/sidebar.tsx` |
| `MOBILE_BREAKPOINT` | `768` | `src/hooks/use-mobile.tsx` |
| `TOAST_LIMIT` | `1` | `src/hooks/use-toast.ts` |
| `TOAST_REMOVE_DELAY` | `1000000` | `src/hooks/use-toast.ts` |
| `DEFAULT_BATCH_SIZE` | `10` | `src/hooks/useBulkActions.ts` |
| `DEVICE_EXPIRY_DAYS` | `30` | `src/hooks/useNewDeviceDetection.ts` |
| `MAX_IDS_POR_LOTE` | `200` | `src/hooks/usePotentialIndexBatch.ts` |
| `DEFAULT_VALIDITY` | `5` | `src/hooks/useReauth.ts` |
| `CONCORRENCIA` | `4` | `src/hooks/useRegisterFirstResponse.ts` |
| `NOTA_MAX_CHARS` | `500` | `src/hooks/useRegisterFirstResponse.ts` |
| `BATCH_SIZE` | `200` | `src/hooks/useTalentExport.ts` |
| `EXPORT_MAX_ROWS` | `5` | `src/hooks/useTalentExport.ts` |
| `TALENT_PAGE_SIZE` | `24` | `src/hooks/useTalentSearch.ts` |
| `DEVICE_EXPIRY_DAYS` | `30` | `src/hooks/useTrustedDevices.ts` |
| `APP_VERSION` | `'1.0.0'` | `src/lib/constants.ts` |
| `SEPARATOR` | `";"` | `src/lib/csvExport.ts` |
| `BOM` | `"\uFEFF"` | `src/lib/csvExport.ts` |
| `TEMPO_LIMITE_SEG` | `20` | `src/pages/CognitiveTestPage.tsx` |
| `ITENS_POR_DOMINIO` | `5` | `src/pages/CognitiveTestPage.tsx` |
| `NAO_INFORMADO` | `"__none__"` | `src/types/techProfile.ts` |
| `CACHE_VERSION` | `"gemini-2.5-flash:ai-screening:v1"` | `supabase/functions/ai-screening/index.ts` |
| `MODEL` | `"gemini-2.5-flash"` | `supabase/functions/ai-screening/index.ts` |
| `RATE_LIMIT` | `100` | `supabase/functions/ip-guard/index.ts` |
| `WINDOW_MS` | `60000` | `supabase/functions/ip-guard/index.ts` |
| `CACHE_VERSION` | `"gemini-2.5-flash:v1"` | `supabase/functions/match-score/index.ts` |
| `CACHE_VERSION` | `"gemini-2.5-flash:v1"` | `supabase/functions/parse-resume/index.ts` |
| `SLA_THRESHOLD` | `80` | `supabase/functions/proactive-alerts/index.ts` |
| `BREAKER_OPEN_MINUTES` | `15` | `supabase/functions/proactive-alerts/index.ts` |
| `DEDUP_WINDOW_MINUTES` | `30` | `supabase/functions/proactive-alerts/index.ts` |

### H.2 Prazos, expirações e janelas de tempo

| Trecho | Arquivo |
|---|---|
| `timeout: 120 * 1000,` | `playwright.config.ts` |
| `setTimeout(() => { if (politeness === "polite") { setPoliteMessage(""); } else { setAssertiveMessage(""); } }, 3000);` | `src/components/a11y/ScreenReaderAnnounce.tsx` |
| `await new Promise(resolve => setTimeout(resolve, 1500));` | `src/components/agenda/AIInterviewScheduler.tsx` |
| `setTimeout(() => setShowXP(null), 1000);` | `src/components/assessments/gamified/personalityMiniGame/usePersonalityMiniGame.ts` |
| `setTimeout(() => { setPhase('options'); setIsTimerActive(true); startTimeRef.current = Date.now(); }, 3000);` | `src/components/assessments/immersive/useScenarioPlayer.ts` |
| `await new Promise(resolve => setTimeout(resolve, 1000));` | `src/components/auth/MFASMSSetup.tsx` |
| `setTimeout(() => setCopied(false), 2000);` | `src/components/auth/RecoveryCodesDisplay.tsx` |
| `const REFRESH_INTERVAL = 23 * 60 * 60 * 1000;` | `src/components/auth/SessionManager.tsx` |
| `const SESSION_TIMEOUT = 24 * 60 * 60 * 1000;` | `src/components/auth/SessionManager.tsx` |
| `const WARNING_BEFORE = 5 * 60 * 1000;` | `src/components/auth/SessionManager.tsx` |
| `timeoutId = setTimeout(() => setCopiedSecret(false), 2000);` | `src/components/auth/TwoFactorSetup.tsx` |
| `return candidatoDate < subDays(today, 29);` | `src/components/candidatos/CandidatosChartsSection.tsx` |
| `setTimeout(() => { onOpenChange(false); onSuccess?.(); setStep('input'); setUrl(''); }, 1500);` | `src/components/candidatos/LinkedInImportDialog.tsx` |
| `timestamp: new Date(Date.now() - 15 * 60 * 1000),` | `src/components/dashboard/LiveActivityFeed.tsx` |
| `timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),` | `src/components/dashboard/LiveActivityFeed.tsx` |
| `timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),` | `src/components/dashboard/LiveActivityFeed.tsx` |
| `timestamp: new Date(Date.now() - 30 * 60 * 1000),` | `src/components/dashboard/LiveActivityFeed.tsx` |
| `timestamp: new Date(Date.now() - 45 * 60 * 1000),` | `src/components/dashboard/LiveActivityFeed.tsx` |
| `timestamp: new Date(Date.now() - 5 * 60 * 1000),` | `src/components/dashboard/LiveActivityFeed.tsx` |
| `timestamp: new Date(Date.now() - 60 * 60 * 1000),` | `src/components/dashboard/LiveActivityFeed.tsx` |
| `const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);` | `src/components/dna/miniGames/PressureGame.tsx` |
| `autoSaveTimeoutRef.current = window.setTimeout(async () => { try { setIsSaving(true); await onAutoSave(value); lastSavedValueRef.current = value; setSavedSucces …` | `src/components/forms/SmartFormField.tsx` |
| `const timer = setTimeout(onClose, 5000);` | `src/components/gamification/AchievementNotification.tsx` |
| `const timer = setTimeout(onClose, 6000);` | `src/components/gamification/LevelUpCelebration.tsx` |
| `setTimeout(() => { setShowXPGain(false); setParticles([]); }, 1000);` | `src/components/gamification/MicroInteractionCards.tsx` |
| `const remainingHours = Math.floor(remainingTime / (1000 * 60 * 60));` | `src/components/gamification/PowerUps.tsx` |
| `const remainingMinutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));` | `src/components/gamification/PowerUps.tsx` |
| `expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),` | `src/components/gamification/PowerUps.tsx` |
| `<span>{new Date(today.getTime() - (daysToShow - 1) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}</span>` | `src/components/gamification/StreakDisplay.tsx` |
| `setTimeout(() => setCopied(false), 2000);` | `src/components/gamification/achievementProfile/ShareProfileDialog.tsx` |
| `const hours = Math.floor(diff / (1000 * 60 * 60));` | `src/components/gamification/dailyChallenges/useDailyChallenges.ts` |
| `const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));` | `src/components/gamification/dailyChallenges/useDailyChallenges.ts` |
| `setTimeout(() => audioContext.close(), 1000);` | `src/components/portal/PortalProtectedRoute.tsx` |
| `expires_at: data.permanent ? null : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),` | `src/components/security/BlockedIPsPanel.tsx` |
| `await new Promise(r => setTimeout(r, 1500));` | `src/components/settings/GoogleCalendarConnect.tsx` |
| `setTimeout(() => { const next = !isConnected; setIsConnected(next); setIsLoading(false); toast({ title: next ? 'Indeed conectado' : 'Indeed desconectado' }); ne …` | `src/components/settings/IndeedConnect.tsx` |
| `setTimeout(() => { const next = !isConnected; setIsConnected(next); setIsLoading(false); toast({ title: next ? `${name} conectado` : `${name} desconectado` }); …` | `src/components/settings/JobBoardConnects.tsx` |
| `setTimeout(() => { setIsConnected(true); setIsLoading(false); toast({ title: 'LinkedIn conectado com sucesso' }); onConnect?.(); }, 1500);` | `src/components/settings/LinkedInConnect.tsx` |
| `setTimeout(() => { const next = !isConnected; setIsConnected(next); setIsLoading(false); toast({ title: next ? 'Outlook Calendar conectado' : 'Outlook Calendar …` | `src/components/settings/OutlookCalendarConnect.tsx` |
| `setTimeout(() => { const next = !isConnected; setIsConnected(next); setIsLoading(false); toast({ title: next ? 'Slack conectado' : 'Slack desconectado' }); next …` | `src/components/settings/SlackConnect.tsx` |
| `setTimeout(() => { const next = !isConnected; setIsConnected(next); setIsLoading(false); toast({ title: next ? 'Teams conectado' : 'Teams desconectado' }); next …` | `src/components/settings/TeamsConnect.tsx` |
| `await new Promise(r => setTimeout(r, 1000));` | `src/components/vagas/JobPublisher.tsx` |
| `return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));` | `src/components/vagas/VagaCard.tsx` |
| `const start = startDate \|\| new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);` | `src/components/visualization/Heatmap.tsx` |
| `cacheTimeout: 5 * 60 * 1000,` | `src/config/ipWhitelist.ts` |
| `staleTime: 5 * 60 * 1000,` | `src/hooks/useAdvancedAnalytics.ts` |
| `staleTime: 5 * 60 * 1000,` | `src/hooks/useAnalytics.ts` |
| `setTimeout(() => setShowXPGain(null), 1000);` | `src/hooks/useAssessmentEngine.ts` |
| `gcTime: 10 * 60 * 1000,` | `src/hooks/useAvaliacoes.ts` |
| `staleTime: 5 * 60 * 1000,` | `src/hooks/useAvaliacoes.ts` |
| `staleTime: 5 * 60 * 1000, // 5 minutes` | `src/hooks/useBehavioralAssessments.ts` |
| `gcTime: 10 * 60 * 1000,` | `src/hooks/useCandidatos.ts` |
| `staleTime: 5 * 60 * 1000,` | `src/hooks/useCandidatos.ts` |
| `gcTime: 10 * 60 * 1000,` | `src/hooks/useComunicacoes.ts` |
| `staleTime: 5 * 60 * 1000,` | `src/hooks/useComunicacoes.ts` |
| `staleTime: 5 * 60 * 1000,` | `src/hooks/useEmailTemplates.ts` |
| `gcTime: 10 * 60 * 1000,` | `src/hooks/useEntrevistas.ts` |
| `staleTime: 5 * 60 * 1000,` | `src/hooks/useEntrevistas.ts` |
| `setTimeout(() => setIsSuccess(false), 3000);` | `src/hooks/useFormAutoSave.ts` |
| `setTimeout(() => { if (isMountedRef.current) { setStatus('idle'); } }, 2000);` | `src/hooks/useFormAutoSave.ts` |
| `staleTime: 2 * 60 * 1000,` | `src/hooks/useHiringManagerData.ts` |
| `setTimeout(() => { setStatus('idle'); setResult(null); setProgress(0); }, 2000);` | `src/hooks/useImportData.ts` |
| `const timer = setTimeout(checkDevice, 1000);` | `src/hooks/useNewDeviceDetection.ts` |
| `staleTime: 5 * 60 * 1000,` | `src/hooks/usePermissions.ts` |
| `gcTime: 10 * 60 * 1000,` | `src/hooks/useProcessosSeletivos.ts` |
| `staleTime: 5 * 60 * 1000,` | `src/hooks/useProcessosSeletivos.ts` |
| `const DEFAULT_VALIDITY = 5 * 60 * 1000;` | `src/hooks/useReauth.ts` |
| `* timeout: 30 * 60 * 1000, // 30 min` | `src/hooks/useSessionTimeout.ts` |
| `* warningBefore: 5 * 60 * 1000, // aviso 5 min antes` | `src/hooks/useSessionTimeout.ts` |
| `timeout = 30 * 60 * 1000, // 30 minutes default` | `src/hooks/useSessionTimeout.ts` |
| `warningBefore = 5 * 60 * 1000, // 5 minutes warning` | `src/hooks/useSessionTimeout.ts` |
| `gcTime: 1000 * 60 * 60 * 2,` | `src/hooks/useSkills.ts` |
| `staleTime: 1000 * 60 * 60, // 1h — taxonomia é estável` | `src/hooks/useSkills.ts` |
| `setTimeout(() => createOscillator(ctx, 1108.73, 0.15, 'sine', vol * 0.3), 150);` | `src/hooks/useSoundPreferences.ts` |
| `setTimeout(() => { [1318.51, 1567.98, 2093.00].forEach((freq, i) => {` | `src/hooks/useSoundPreferences.ts` |
| `setTimeout(() => { createOscillator(ctx, 1046.50, 0.5, 'sine', vol * 0.4);` | `src/hooks/useSoundPreferences.ts` |
| `(new Date().getTime() - new Date(row.data_criacao).getTime()) / (1000 * 60 * 60 * 24)` | `src/hooks/useVagas.ts` |
| `gcTime: 10 * 60 * 1000,` | `src/hooks/useVagas.ts` |
| `staleTime: 5 * 60 * 1000,` | `src/hooks/useVagas.ts` |
| `timeout: 60000,` | `src/hooks/useWebAuthn.ts` |
| `const days = Math.floor(diff / (1000 * 60 * 60 * 24));` | `src/lib/dateUtils.ts` |
| `defaultGcTime: 10 * 60 * 1000,` | `src/lib/queryConfig.ts` |
| `defaultStaleTime: 5 * 60 * 1000,` | `src/lib/queryConfig.ts` |
| `const timer = setTimeout(() => startOnboarding(), 1000);` | `src/pages/GamificationPage.tsx` |
| `setTimeout(() => navigate('/auth/login'), 3000);` | `src/pages/auth/ResetPasswordPage.tsx` |
| `case '1h': return new Date(now.getTime() - 60 * 60 * 1000).toISOString();` | `src/pages/security/RateLimitDashboard.tsx` |
| `case '24h': return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();` | `src/pages/security/RateLimitDashboard.tsx` |
| `case '30d': return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();` | `src/pages/security/RateLimitDashboard.tsx` |
| `case '7d': return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();` | `src/pages/security/RateLimitDashboard.tsx` |
| `default: return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();` | `src/pages/security/RateLimitDashboard.tsx` |
| `set<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000) {` | `src/services/cacheService.ts` |
| `const futureDate = new Date(now.getTime() + hoursAhead * 60 * 60 * 1000);` | `supabase/functions/interview-reminders/index.ts` |
| `const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);` | `supabase/functions/password-reset-approval/index.ts` |
| `WHERE e.data_hora >= now() - interval '1 day'` | `supabase/migrations/20251216223301_evolve_data_model.sql` |
| `('Assistente Administrativo', 'Administrativo', 'Lucia Ferreira', 'Maria Santos', 1, 'clt', 'presencial', 'São Paulo', 'SP', 2000, 2500, false, ARRAY['Vale Tran …` | `supabase/migrations/20251220132952_b5b8e801-a9c5-49b6-a85f-371946802ca8.sql` |
| `('Designer Gráfico', 'Amanda Garcia', 'em_triagem', 'em_andamento', 82, 'indicacao', now() - interval '4 days', 2),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Designer Gráfico', 'Ana Costa', 'novo', 'em_andamento', 90, 'linkedin', now() - interval '3 days', 3),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Designer Gráfico', 'Camila Ribeiro', 'proposta_enviada', 'em_andamento', 93, 'indicacao', now() - interval '31 days', 4),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Designer Gráfico', 'Lucas Almeida', 'entrevista_rh', 'em_andamento', 91, 'linkedin', now() - interval '9 days', 3),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Operador de Gravação', 'Ana Paula Oliveira', 'pre_selecao', 'em_andamento', 85, 'linkedin', now() - interval '8 days', 4),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Operador de Gravação', 'Bruno Costa', 'pre_selecao', 'em_andamento', 80, 'portal', now() - interval '7 days', 3),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Operador de Gravação', 'Carla Mendes', 'entrevista_rh', 'em_andamento', 86, 'linkedin', now() - interval '10 days', 4),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Operador de Gravação', 'Carlos Eduardo', 'em_triagem', 'em_andamento', 90, 'indeed', now() - interval '6 days', 3),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Operador de Gravação', 'Diego Santos', 'reprovado', 'reprovado', 58, 'portal', now() - interval '34 days', 24),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Operador de Gravação', 'Felipe Rodrigues', 'em_triagem', 'em_andamento', 85, 'catho', now() - interval '5 days', 3),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Operador de Gravação', 'Gustavo Pereira', 'aprovado', 'aprovado', 94, 'portal', now() - interval '26 days', 6),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Operador de Gravação', 'João Mendes', 'novo', 'em_andamento', 92, 'indeed', now() - interval '2 days', 2),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Operador de Gravação', 'Juliana Silva', 'teste_tecnico', 'em_andamento', 79, 'catho', now() - interval '14 days', 6),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Operador de Gravação', 'Lucas Ferreira', 'entrevista_final', 'em_andamento', 95, 'linkedin', now() - interval '21 days', 10),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Operador de Gravação', 'Marcos Antonio', 'entrevista_gestor', 'em_andamento', 84, 'indicacao', now() - interval '18 days', 8),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Operador de Gravação', 'Maria Lima', 'novo', 'em_andamento', 88, 'linkedin', now() - interval '2 days', 2),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Operador de Gravação', 'Patricia Lima', 'banco_talentos', 'em_andamento', 72, 'linkedin', now() - interval '41 days', 21);` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Operador de Gravação', 'Paulo Vieira', 'novo', 'em_andamento', 75, 'portal', now() - interval '1 day', 1),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Operador de Gravação', 'Pedro Martins', 'teste_tecnico', 'em_andamento', 82, 'indeed', now() - interval '15 days', 7),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `('Operador de Gravação', 'Ricardo Oliveira', 'contratado', 'contratado', 96, 'indeed', now() - interval '45 days', 15),` | `supabase/migrations/20251220134226_30c08747-ba59-46f1-b399-2539807ba259.sql` |
| `DELETE FROM public.ip_access_logs WHERE created_at < now() - interval '90 days';` | `supabase/migrations/20251231115857_057d443b-736d-4406-8ad8-623188db8aef.sql` |
| `DELETE FROM public.rate_limit_logs WHERE created_at < now() - interval '30 days';` | `supabase/migrations/20251231115857_057d443b-736d-4406-8ad8-623188db8aef.sql` |
| `DELETE FROM public.user_2fa_logs WHERE created_at < now() - interval '90 days';` | `supabase/migrations/20251231115857_057d443b-736d-4406-8ad8-623188db8aef.sql` |
| `WHERE last_attempt_at < now() - interval '24 hours'` | `supabase/migrations/20251231132406_8fe32def-ce57-4d0b-84fc-16f62c76ef85.sql` |
| `DELETE FROM public.rate_limits WHERE window_start < now() - interval '24 hours';` | `supabase/migrations/20260711164752_0c09d686-0d45-4c1c-88d9-2bb84a3225d3.sql` |
| `expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '30 days'),` | `supabase/migrations/20260713105519_a04bcdf9-04aa-42ac-a95d-bcaf4e7ffcc6.sql` |
| `VALUES (p_channel, p_recipient, p_payload, p_error, p_dedup_key, p_max_attempts, now() + interval '1 minute')` | `supabase/migrations/20260713105846_1b5fdb73-316d-4070-8961-75f03e1d0e5f.sql` |
| `WHERE created_at < now() - interval '30 days';` | `supabase/migrations/20260713124254_47a40955-6466-46f0-b73e-7e1c0d25c73e.sql` |

### H.3 Limites de paginação

| Limite | Arquivo |
|---|---|
| 1 | `test-supabase.mjs` |
| 3 | `test-supabase.mjs` |
| 10 | `src/components/security/ActiveSessionsPanel.tsx` |
| 20 | `src/components/security/SecurityActivityLog.tsx` |
| 500 | `src/hooks/useAuditLogs.ts` |
| 20 | `src/hooks/useCandidatoCandidaturas.ts` |
| 10 | `src/hooks/useCognitiveTest.ts` |
| 10 | `src/hooks/useDashboardData.ts` |
| 5 | `src/hooks/useDashboardData.ts` |
| 50 | `src/hooks/useDashboardData.ts` |
| 20 | `src/hooks/useHiringManagerData.ts` |
| 50 | `src/hooks/useHiringManagerData.ts` |
| 500 | `src/hooks/useHunterLeads.ts` |
| 50 | `src/hooks/useNotificacoesCandidato.ts` |
| 1 | `src/hooks/usePotentialIndex.ts` |
| 50 | `src/hooks/useRealtimeNotifications.ts` |
| 5 | `src/hooks/useVagas.ts` |
| 1 | `src/hooks/behavioralResults/queries.ts` |
| 20 | `src/hooks/gamification/loader.ts` |
| 1 | `src/pages/AplicarVagaPage.tsx` |
| 50 | `src/pages/ComunicacaoPage.tsx` |
| 1 | `src/pages/DiagnosticoPage.tsx` |
| 5 | `src/pages/portal/PortalDashboard.tsx` |
| 100 | `src/pages/security/RateLimitDashboard.tsx` |
| 1 | `src/services/gamificationTriggers.ts` |
| 1 | `supabase/functions/health/index.ts` |

## I. Regras implícitas em mensagens de erro/validação

| Mensagem | Arquivo |
|---|---|
| ${msg}: esperado ${JSON.stringify(b)} obtido ${JSON.stringify(a)} | `scripts/ai-context/cenarios.mjs` |
| ${TIPOS_SUPABASE} sem o bloco public.Tables | `scripts/inventario/gerar-banco.mjs` |
| ${TIPOS_SUPABASE}: nenhuma tabela reconhecida em public.Tables | `scripts/inventario/gerar-banco.mjs` |
| ${bandeira} exige o caminho do arquivo | `scripts/inventario/gerar-banco.mjs` |
| Management API ${caminho} respondeu HTTP ${res.status} | `scripts/inventario/gerar-banco.mjs` |
| SUPABASE_PROJECT_REF=${ref} nao e o banco oficial (${PROJETO_OFICIAL}). | `scripts/inventario/gerar-banco.mjs` |
| a resposta nao parece ser do banco oficial: ${comuns} tabelas em comum com ${TIPOS_SUPABASE}  | `scripts/inventario/gerar-banco.mjs` |
| a resposta nao parece ser do banco oficial: ledger com ${registros} registros e maior versao ${max};  | `scripts/inventario/gerar-banco.mjs` |
| a resposta nao traz resumo.ledger_versao_max/ledger_registros; rode o banco.sql atual. | `scripts/inventario/gerar-banco.mjs` |
| a saida tem algo com cara de credencial; nada foi gravado. Revise banco.sql. | `scripts/inventario/gerar-banco.mjs` |
| entrada sem as chaves: ${faltando.join( | `scripts/inventario/gerar-banco.mjs` |
| entrada sem tabelas | `scripts/inventario/gerar-banco.mjs` |
| format_version ${dado.format_version} desconhecido (esperado 1) | `scripts/inventario/gerar-banco.mjs` |
| resposta do banco-cron.sql sem a lista jobs | `scripts/inventario/gerar-banco.mjs` |
| sem --entrada e sem SUPABASE_ACCESS_TOKEN: nada para ler (veja o cabecalho do script). | `scripts/inventario/gerar-banco.mjs` |
| ripgrep (rg) falhou com exit ${status}; o inventário não foi gerado. | `scripts/inventario/gerar-repo.mjs` |
| ripgrep (rg) não encontrado; o inventário não pode ser gerado com segurança. | `scripts/inventario/gerar-repo.mjs` |
| Root element not found | `src/main.tsx` |
| ; import {   Dialog,   DialogContent,   DialogDescription,   DialogFooter,   DialogHeader,   DialogTitle,   DialogTrigger, } from  | `src/components/DataImporter.tsx` |
| useHighContrast must be used within a HighContrastProvider | `src/components/a11y/HighContrastMode.tsx` |
| useReducedMotion must be used within a ReducedMotionProvider | `src/components/a11y/ReducedMotion.tsx` |
| useAnnounce must be used within a ScreenReaderAnnounceProvider | `src/components/a11y/ScreenReaderAnnounce.tsx` |
| Preencha todos os campos obrigatórios | `src/components/agenda/AgendarEntrevistaDialog.tsx` |
| Vaga inválida | `src/components/agenda/AgendarEntrevistaDialog.tsx` |
|      >       <div className= | `src/components/agenda/aiScheduler/ConflictBanner.tsx` |
| Erro ao enviar assessment | `src/components/assessments/AssessmentPlayer.tsx` |
| Você precisa responder ${unanswered.length} questões obrigatórias | `src/components/assessments/AssessmentPlayer.tsx` |
| Erro ao processar resultados | `src/components/assessments/BehavioralAssessmentPlayer.tsx` |
| Você precisa responder ${unansweredCount} questões | `src/components/assessments/BehavioralAssessmentPlayer.tsx` |
| Erro ao finalizar o teste | `src/components/assessments/PersonalityAssessmentPlayer.tsx` |
| Por favor, selecione uma resposta | `src/components/assessments/PersonalityAssessmentPlayer.tsx` |
| ; import { ShieldAlert } from  | `src/components/auth/Admin2FAGuard.tsx` |
| ; import { cn } from  | `src/components/auth/LoginLockoutAlert.tsx` |
| ; import { useToast } from  | `src/components/auth/MFASMSSetup.tsx` |
| ; import {   Card,   CardContent,   CardDescription,   CardHeader,   CardTitle, } from  | `src/components/auth/PasswordResetRequestForm.tsx` |
| Código incorreto | `src/components/auth/QRCodeGenerator.tsx` |
| Código inválido | `src/components/auth/QRCodeGenerator.tsx` |
| ; import { Loader2, Shield, Lock, AlertTriangle } from  | `src/components/auth/ReauthDialog.tsx` |
| ; import { Badge } from  | `src/components/auth/TwoFactorSetup.tsx` |
| Atenção! | `src/components/auth/TwoFactorSetup.tsx` |
| Não foi possível copiar. Selecione e copie manualmente. | `src/components/auth/TwoFactorSetup.tsx` |
| ; import { Checkbox } from  | `src/components/auth/TwoFactorVerify.tsx` |
| >             <AlertTriangle className= | `src/components/auth/TwoFactorVerify.tsx` |
| Digite o conteúdo da nota | `src/components/candidato/NotasTab.tsx` |
|  className= | `src/components/candidatos/CandidatoTimelineSection.tsx` |
| Nenhum dado | `src/components/candidatos/CandidatosToolbar.tsx` |
|  className= | `src/components/candidatos/CandidaturaTimelineList.tsx` |
| ; import { Calculator, Star, CheckCircle2, XCircle, AlertCircle, Sparkles, TrendingUp } from  | `src/components/candidatos/MatchScoreCalculator.tsx` |
| Atenção | `src/components/candidatos/MatchScoreCalculator.tsx` |
| Falha ao calcular | `src/components/candidatos/MatchScoreCalculator.tsx` |
| Arquivo inválido | `src/components/candidatos/resumeParser/useResumeParser.ts` |
| Erro ao processar | `src/components/candidatos/resumeParser/useResumeParser.ts` |
| Erro ao salvar | `src/components/candidatos/resumeParser/useResumeParser.ts` |
| Formato não suportado | `src/components/candidatos/resumeParser/useResumeParser.ts` |
| ; import { toast } from  | `src/components/cognitive/CognitiveTestPlayer.tsx` |
| Tempo esgotado. Finalizando a avaliação. | `src/components/cognitive/CognitiveTestPlayer.tsx` |
| useGlobalShortcuts must be used within GlobalShortcutsProvider | `src/components/common/GlobalShortcutsProvider.tsx` |
| Erro ao registrar e-mail | `src/components/comunicacao/EnviarEmailDialog.tsx` |
| Preencha o assunto e o conteúdo do e-mail | `src/components/comunicacao/EnviarEmailDialog.tsx` |
| ; import { Button } from  | `src/components/dashboard/SlaAlertBanner.tsx` |
|            >             <AlertCircle className= | `src/components/forms/SmartFormField.tsx` |
| Erro ao copiar link | `src/components/gamification/achievementProfile/ShareProfileDialog.tsx` |
| Preencha os campos obrigatórios | `src/components/indicacoes/NovaIndicacaoDialog.tsx` |
| useOnboarding must be used within OnboardingProvider | `src/components/onboarding/OnboardingProvider.tsx` |
| Arquivo muito grande. Máximo 10MB. | `src/components/portal/CurriculoUpload.tsx` |
| Erro ao baixar currículo | `src/components/portal/CurriculoUpload.tsx` |
| Erro ao enviar currículo | `src/components/portal/CurriculoUpload.tsx` |
| Erro ao remover currículo | `src/components/portal/CurriculoUpload.tsx` |
| Tipo de arquivo não permitido. Use PDF ou Word. | `src/components/portal/CurriculoUpload.tsx` |
| Usuário não autenticado | `src/components/portal/CurriculoUpload.tsx` |
| Falha ao exportar relatório | `src/components/reports/ReportExport.tsx` |
| Erro ao carregar sessões | `src/components/security/ActiveSessionsPanel.tsx` |
| Erro ao encerrar sessões | `src/components/security/ActiveSessionsPanel.tsx` |
| Erro ao bloquear IP | `src/components/security/BlockedIPsPanel.tsx` |
| Erro ao adicionar IP | `src/components/security/IPWhitelistPanel.tsx` |
| Não foi possível conectar. | `src/components/settings/GoogleCalendarConnect.tsx` |
|  className={cn(alertVariants({ variant }), className)} {...props} /> )); Alert.displayName =  | `src/components/ui/alert.tsx` |
| useCarousel must be used within a <Carousel /> | `src/components/ui/carousel.tsx` |
| useChart must be used within a <ChartContainer /> | `src/components/ui/chart.tsx` |
| useFormField should be used within <FormField> | `src/components/ui/form.tsx` |
| useSidebar must be used within a SidebarProvider. | `src/components/ui/sidebar.tsx` |
| Selecione ao menos um canal | `src/components/vagas/JobPublisher.tsx` |
| Selecione ao menos um canal | `src/components/vagas/MultiChannelJobPublisher.tsx` |
| Erro ao excluir vaga. Tente novamente. | `src/components/vagas/VagaCard.tsx` |
| Selecione um roteiro | `src/components/vagas/VagaInterviewKitsManager.tsx` |
| useAuth must be used within an AuthProvider | `src/contexts/AuthContext.tsx` |
| useCandidatoAuth must be used within a CandidatoAuthProvider | `src/contexts/CandidatoAuthContext.tsx` |
| useNotifications must be used within a NotificationProvider | `src/contexts/NotificationContext.tsx` |
| usePermissionContext must be used within PermissionProvider | `src/contexts/PermissionContext.tsx` |
| useTenantContext must be used within TenantProvider | `src/contexts/TenantContext.tsx` |
| Invalid backup code | `src/hooks/use2FA.ts` |
| Invalid code format | `src/hooks/use2FA.ts` |
| Não foi possível ativar o 2FA. | `src/hooks/use2FA.ts` |
| Não foi possível desativar o 2FA. | `src/hooks/use2FA.ts` |
| User not authenticated | `src/hooks/use2FA.ts` |
| Resposta inesperada da triagem | `src/hooks/useAiScreening.ts` |
| Falha ao adicionar tags. | `src/hooks/useBulkActions.ts` |
| Falha ao arquivar candidatos. | `src/hooks/useBulkActions.ts` |
| Falha ao excluir candidatos. | `src/hooks/useBulkActions.ts` |
| Falha ao mover candidatos. | `src/hooks/useBulkActions.ts` |
| Falha ao remover tags. | `src/hooks/useBulkActions.ts` |
| Disponibilidade em dias não pode ser negativa | `src/hooks/useCandidatoTechProfile.ts` |
| Pretensão salarial não pode ser negativa | `src/hooks/useCandidatoTechProfile.ts` |
| candidatoId é obrigatório | `src/hooks/useCandidatoTechProfile.ts` |
| Não foi possível iniciar a avaliação. | `src/hooks/useCognitiveTest.ts` |
| Erro ao registrar comunicação | `src/hooks/useComunicacoes.ts` |
| Erro ao enviar documento | `src/hooks/useDocumentosCandidato.ts` |
| Erro ao duplicar | `src/hooks/useDuplicate.ts` |
| Erro ao atualizar template | `src/hooks/useEmailTemplates.ts` |
| Erro ao criar template | `src/hooks/useEmailTemplates.ts` |
| Erro ao processar entrevista | `src/hooks/useEntrevistas.ts` |
| Erro na exportação | `src/hooks/useExportData.ts` |
| Empty response from hunter-sync | `src/hooks/useHunterLeads.ts` |
| Erro ao importar: ${error instanceof Error ? error.message :  | `src/hooks/useImportData.ts` |
| Erro ao processar arquivo: ${error instanceof Error ? error.message :  | `src/hooks/useImportData.ts` |
| Nenhum dado válido para importar | `src/hooks/useImportData.ts` |
| Erro ao atualizar status | `src/hooks/useIndicacoes.ts` |
| Erro ao registrar indicação | `src/hooks/useIndicacoes.ts` |
| Falha ao enviar lembretes | `src/hooks/useInterviewReminders.ts` |
| Erro ao importar do LinkedIn | `src/hooks/useLinkedInImport.ts` |
| Erro ao salvar candidato | `src/hooks/useLinkedInImport.ts` |
| Nenhum dado retornado | `src/hooks/useLinkedInImport.ts` |
| URL inválida. Use o formato: https://linkedin.com/in/nome-do-perfil | `src/hooks/useLinkedInImport.ts` |
| Erro ao adicionar nota | `src/hooks/useNotasCandidato.ts` |
| Usuário não autenticado | `src/hooks/useNotasCandidato.ts` |
| Falha ao cancelar | `src/hooks/usePropostas.ts` |
| Falha ao criar proposta | `src/hooks/usePropostas.ts` |
| Falha ao enviar proposta | `src/hooks/usePropostas.ts` |
| Proposta enviada, mas email falhou. Copie o link manualmente. | `src/hooks/usePropostas.ts` |
| not_authenticated | `src/hooks/usePropostas.ts` |
| Erro de configuração | `src/hooks/usePushNotifications.ts` |
| Falha ao cancelar inscrição. | `src/hooks/usePushNotifications.ts` |
| Falha ao inscrever para notificações. | `src/hooks/usePushNotifications.ts` |
| Não foi possível solicitar permissão. | `src/hooks/usePushNotifications.ts` |
| Permissão negada | `src/hooks/usePushNotifications.ts` |
| Subscription inválida | `src/hooks/usePushNotifications.ts` |
| ${falha} falharam. ${primeiroErro ??  | `src/hooks/useRegisterFirstResponse.ts` |
| Não foi possível registrar os contatos em lote. | `src/hooks/useRegisterFirstResponse.ts` |
| Nível deve estar entre 1 e 5 | `src/hooks/useSkills.ts` |
| candidatoId é obrigatório | `src/hooks/useSkills.ts` |
| Não foi possível exportar | `src/hooks/useTalentExport.ts` |
| Erro ao remover dispositivo | `src/hooks/useTrustedDevices.ts` |
| Erro ao remover dispositivos | `src/hooks/useTrustedDevices.ts` |
| Erro ao salvar dispositivo | `src/hooks/useTrustedDevices.ts` |
| Erro ao registrar passkey | `src/hooks/useWebAuthn.ts` |
| Erro ao remover passkey | `src/hooks/useWebAuthn.ts` |
| Erro ao renomear passkey | `src/hooks/useWebAuthn.ts` |
| Falha ao criar credencial | `src/hooks/useWebAuthn.ts` |
| Registro cancelado pelo usuário | `src/hooks/useWebAuthn.ts` |
| WebAuthn não suportado neste dispositivo | `src/hooks/useWebAuthn.ts` |
| Erro ao salvar perfil da empresa | `src/hooks/behavioralResults/companyProfile.ts` |
| Erro ao salvar resultado da avaliação | `src/hooks/behavioralResults/mutations.ts` |
| Method ${options.method} not supported | `src/lib/apiClient.ts` |
| ✕ ${title} | `src/lib/toast-utils.tsx` |
| No type results calculated | `src/lib/personality/enneagramCalculator.ts` |
| Currículo deve ter no máximo 4MB | `src/pages/AplicarVagaPage.tsx` |
| Nome e email são obrigatórios | `src/pages/AplicarVagaPage.tsx` |
| Responda todas as perguntas obrigatórias | `src/pages/AplicarVagaPage.tsx` |
| Confirme seu nome e aceite os termos | `src/pages/AssinarPropostaPage.tsx` |
| Falha ao registrar assinatura. | `src/pages/AssinarPropostaPage.tsx` |
| Informe o motivo da recusa | `src/pages/AssinarPropostaPage.tsx` |
| ; import { useToast } from  | `src/pages/AuthPage.tsx` |
| Atenção | `src/pages/AvaliacaoForm.tsx` |
| Erro ao finalizar | `src/pages/AvaliacaoForm.tsx` |
| Erro ao salvar | `src/pages/AvaliacaoForm.tsx` |
| Selecione um candidato | `src/pages/AvaliacaoForm.tsx` |
| Erro ao salvar. | `src/pages/BehavioralAssessmentsPage.tsx` |
| ; import { toast } from  | `src/pages/CognitiveTestPage.tsx` |
| Erro ao carregar dados | `src/pages/ComunicacaoPage.tsx` |
| Erro ao enviar | `src/pages/ComunicacaoPage.tsx` |
| Preencha todos os campos | `src/pages/ComunicacaoPage.tsx` |
| Preencha todos os campos obrigatórios | `src/pages/OfferManagementPage.tsx` |
| ; import { ArrowLeft, ArrowRight, Clock, CheckCircle2, AlertCircle, Send, Timer, FileText } from  | `src/pages/ProvaAplicacao.tsx` |
| Dados incompletos | `src/pages/ProvaAplicacao.tsx` |
| Adicione questões | `src/pages/ProvaEditor.tsx` |
| Erro ao salvar | `src/pages/ProvaEditor.tsx` |
| Preencha campos obrigatórios | `src/pages/ProvaEditor.tsx` |
| Triagem parcial: ${ok} ok, ${fail} falha(s). | `src/pages/RankingVagaPage.tsx` |
| Falha ao gerar relatório | `src/pages/ReportsPage.tsx` |
| Campos obrigatórios | `src/pages/VagaForm.tsx` |
| Erro ao salvar | `src/pages/VagaForm.tsx` |
| Falha ao reenfileirar: ${err.message} | `src/pages/admin/DeadLetterQueuePage.tsx` |
| ; import { usePageTitle } from  | `src/pages/auth/ForgotPasswordPage.tsx` |
| ; import { useToast } from  | `src/pages/auth/LoginPage.tsx` |
| ; import { Checkbox } from  | `src/pages/auth/RegisterPage.tsx` |
| ; import { usePageTitle } from  | `src/pages/auth/ResetPasswordPage.tsx` |
| ; import { Badge } from  | `src/pages/auth/TwoFactorAuthPage.tsx` |
| ; import { Button } from  | `src/pages/edgeFunctionTest/AuthStatusCard.tsx` |
| ; import { toast } from  | `src/pages/portal/PortalAuthPage.tsx` |
| A senha deve ter pelo menos 6 caracteres | `src/pages/portal/PortalAuthPage.tsx` |
| As senhas não coincidem | `src/pages/portal/PortalAuthPage.tsx` |
| Erro ao criar conta | `src/pages/portal/PortalAuthPage.tsx` |
| Erro ao entrar | `src/pages/portal/PortalAuthPage.tsx` |
| A nova senha deve ter pelo menos 6 caracteres | `src/pages/portal/PortalPerfil.tsx` |
| As senhas não coincidem | `src/pages/portal/PortalPerfil.tsx` |
| Erro ao alterar senha | `src/pages/portal/PortalPerfil.tsx` |
| Erro ao atualizar perfil | `src/pages/portal/PortalPerfil.tsx` |
| Perfil não encontrado | `src/pages/portal/PortalPerfil.tsx` |
| Erro ao fazer upload do currículo | `src/pages/portal/PortalVagas.tsx` |
| Arquivo muito grande. Máximo 5MB. | `src/pages/portal/portalVagas/CandidatarDialog.tsx` |
| Formato inválido. Envie PDF ou DOC/DOCX. | `src/pages/portal/portalVagas/CandidatarDialog.tsx` |
| Erro ao enviar candidatura | `src/pages/portal/portalVagas/usePortalVagas.ts` |
| Usuário não autenticado | `src/pages/portal/portalVagas/usePortalVagas.ts` |
| ; import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from  | `src/pages/security/RateLimitDashboard.tsx` |
| ; import { useToast } from  | `src/pages/security/RolesPage.tsx` |
| Erro ao adicionar role | `src/pages/security/RolesPage.tsx` |
| Erro ao remover role | `src/pages/security/RolesPage.tsx` |
| Email não encontrado | `src/pages/settings/SecuritySettingsPage.tsx` |
| Erro ao solicitar redefinição de senha | `src/pages/settings/SecuritySettingsPage.tsx` |
| Template não encontrado | `src/services/emailService.ts` |
| Evolution API request failed | `src/services/evolutionApiService.ts` |
| Falha ao verificar senha | `src/services/passwordBreachService.ts` |
| Circuit breaker  | `supabase/functions/_shared/resilience.ts` |
| HTTP ${r.status} | `supabase/functions/_shared/resilience.ts` |
| AI gateway ${resp.status} | `supabase/functions/ai-screening/index.ts` |
| AI payment required | `supabase/functions/ai-screening/index.ts` |
| AI rate limit | `supabase/functions/ai-screening/index.ts` |
| Empty AI response | `supabase/functions/ai-screening/index.ts` |
| AI gateway error ${response.status} | `supabase/functions/match-score/index.ts` |
| Resposta vazia da IA | `supabase/functions/match-score/index.ts` |
| , max: 30 });   if (limited) return limited;    try {     const supabaseUrl = Deno.env.get( | `supabase/functions/new-device-alert/index.ts` |
| Missing Supabase configuration | `supabase/functions/new-device-alert/index.ts` |
| AI gateway error ${response.status} | `supabase/functions/parse-resume/index.ts` |
| Dados incompletos: nome e email são obrigatórios | `supabase/functions/parse-resume/index.ts` |
| Resposta vazia da IA | `supabase/functions/parse-resume/index.ts` |
| Email send failed: ${error} | `supabase/functions/password-reset-approval/index.ts` |
| Method Not Allowed | `supabase/functions/resend-webhook/index.ts` |

## J. Controle de acesso no código (checagens de perfil/permissão)

| Valor comparado | Arquivo |
|---|---|
| `C` | `src/components/assessments/JobProfileBuilder.tsx` |
| `D` | `src/components/assessments/JobProfileBuilder.tsx` |
| `I` | `src/components/assessments/JobProfileBuilder.tsx` |
| `S` | `src/components/assessments/JobProfileBuilder.tsx` |
| `conformidade` | `src/components/assessments/JobProfileBuilder.tsx` |
| `dominancia` | `src/components/assessments/JobProfileBuilder.tsx` |
| `estabilidade` | `src/components/assessments/JobProfileBuilder.tsx` |
| `influencia` | `src/components/assessments/JobProfileBuilder.tsx` |
| `admin` | `src/components/auth/Admin2FAGuard.tsx` |
| `denied` | `src/components/security/PushNotificationSettings.tsx` |
| `role` | `src/contexts/AuthContext.tsx` |
| `r` | `src/hooks/useAdminUsers.ts` |
| `granted` | `src/hooks/usePushNotifications.ts` |
| `admin` | `src/pages/AdminPage.tsx` |
| `gestor` | `src/pages/AdminPage.tsx` |
| `rh` | `src/pages/AdminPage.tsx` |
| `admin` | `src/pages/security/RateLimitDashboard.tsx` |
| `admin` | `src/pages/security/RolesPage.tsx` |
| `r` | `src/pages/security/RolesPage.tsx` |

## K. Testes como especificação (529 testes em 68 arquivos — nomes completos em `context.json`)

| Arquivo | Testes | Exemplos do que o sistema DEVE fazer |
|---|---|---|
| `src/lib/__tests__/constants.test.ts` | 53 | APP constants · APP_NAME é  · APP_VERSION segue semver · API_ENDPOINTS … |
| `src/lib/__tests__/matchCalculator.test.ts` | 38 | calcularAlinhamento · retorna  · retorna  · retorna  … |
| `src/lib/__tests__/advancedBehavioralCalculator.test.ts` | 30 | calculateGenerationalResult · retorna resultado com generation type · confiança entre 0 e 100 · scores normalizados entre 0 e 100 … |
| `src/services/__tests__/workflowEngine.test.ts` | 30 | WorkflowEngine · executeTrigger · candidato_novo retorna true com candidatoId · candidato_novo retorna false sem candidatoId … |
| `src/lib/__tests__/dateUtils.test.ts` | 19 | formatDate · formata string ISO corretamente · formata objeto Date corretamente · lança erro para data inválida … |
| `src/lib/__tests__/storageUtils.test.ts` | 18 | storage object · set e get string · set e get objeto complexo · set e get array … |
| `src/types/__tests__/behavioralDNA.test.ts` | 16 | DNA_STRANDS · contém 5 hélices · cada hélice tem 2 pilares · IDs são válidos: strategic, emotional, influence, values, adaptive … |
| `src/services/__tests__/matchingService.test.ts` | 15 | matchingService.calculateSkillMatch · retorna 100 quando todos os skills batem · retorna 0 quando nenhum skill bate · calcula score parcial corretamente … |
| `src/services/__tests__/jobBoardService.test.ts` | 14 | jobBoardService · publishToBoard · catho retorna not configured · indeed retorna not configured … |
| `src/test/techProfile.test.ts` | 13 | normalizeSkillTerm · remove acentos e normaliza caixa · preserva caracteres significativos de linguagens · é idempotente e tolera string vazia … |
| `src/services/__tests__/aiService.test.ts` | 12 | aiService · analyzeResume · invoca parse-resume com texto do currículo · lança erro quando a função falha … |
| `src/services/__tests__/cacheService.test.ts` | 12 | cacheService · set e get valor simples · set e get objeto complexo · retorna null para chave inexistente … |
| `src/services/__tests__/emailService.test.ts` | 12 | emailService · sendEmail · invoca send-email com parâmetros corretos · aceita replyTo opcional … |
| `src/services/__tests__/exportService.test.ts` | 11 | exportService.toCSV · gera CSV com headers e dados · retorna apenas header para array vazio · escapa vírgulas em valores … |
| `src/test/potentialIndex.test.ts` | 11 | calcularIndicePotencial · pondera os três sinais conforme os pesos padrão · renormaliza os pesos quando um sinal está ausente · não trata sinal ausente como zero … |
| `src/lib/__tests__/errorHandler.test.ts` | 10 | handleError · extrai mensagem de Error · retorna  · aceita contexto opcional … |
| `e2e/offer-signature-flow.spec.ts` | 9 | Permissões — /ofertas exige autenticação · usuário anônimo é redirecionado para /auth · tela de autenticação renderiza campos e CTA · Gestão de Propostas — UI e fluxo até assinatura … |
| `src/services/__tests__/linkedinService.test.ts` | 9 | linkedinService · importProfile · retorna null (não implementado) · publishJob … |
| `e2e/portal.spec.ts` | 8 | Portal do Candidato · Acesso ao Portal · deve carregar o portal de candidatos · deve mostrar página de login do portal … |
| `src/services/__tests__/whatsappService.test.ts` | 8 | whatsappService · sendMessage · invoca send-whatsapp com telefone e mensagem · lança erro quando envio falha … |
| `src/components/auth/__tests__/ProtectedRoute.test.tsx` | 7 | ProtectedRoute · mostra loading spinner quando carregando · redireciona para /auth quando não autenticado · renderiza conteúdo quando autenticado sem roles requeridas … |
| `src/hooks/__tests__/useCandidatos.test.ts` | 7 | STATUS_CANDIDATO · contém todos os status esperados · tem 8 status diferentes · todos os valores são strings não vazias … |
| `src/lib/__tests__/apiClient.test.ts` | 7 | createApiUrl · retorna path simples sem params · adiciona prefixo / quando ausente · adiciona query params … |
| `src/lib/__tests__/excelImporter.test.ts` | 7 | parseCSV · parseia CSV simples · retorna array vazio para CSV sem dados · lida com linhas vazias … |
| `src/services/__tests__/gdprService.test.ts` | 7 | gdprService · exportUserData retorna mensagem de registro · deleteUserData retorna false (requer aprovação) · getConsentStatus retorna consentimentos padrão … |
| `src/services/__tests__/integrations.test.ts` | 7 | $name (stub) · publishJob retorna success:false · importCandidates retorna array vazio · isConfigured retorna false … |
| `src/test/csvExport.test.ts` | 7 | csvExport · normaliza valores nulos, arrays, booleanos e objetos · neutraliza fórmulas para evitar CSV injection · escapa aspas, quebras de linha e separadores … |
| `e2e/filtering.spec.ts` | 6 | Filtering Functionality · filters candidates by status · filters jobs by department · applies multiple filters … |
| `e2e/seo.spec.ts` | 6 | SEO · has proper title tag · has meta description · has proper heading hierarchy … |
| `e2e/form-validation.spec.ts` | 5 | Form Validation · validates required fields on job form · validates email format · validates date fields … |
| `e2e/keyboard-shortcuts.spec.ts` | 5 | Keyboard Shortcuts · navigates with tab key · escape closes modals · enter submits forms … |
| `e2e/pagination.spec.ts` | 5 | Pagination · displays pagination controls · navigates to next page · navigates to previous page … |
| `e2e/print.spec.ts` | 5 | Print Functionality · has print-friendly styles · hides navigation in print · candidate profile is printable … |
| `e2e/responsive.spec.ts` | 5 | Responsive Design · mobile viewport shows hamburger menu · tablet viewport adapts layout · desktop viewport shows sidebar … |
| `e2e/search.spec.ts` | 5 | Search Functionality · searches candidates by name · searches jobs · shows no results message … |
| `e2e/sorting.spec.ts` | 5 | Sorting Functionality · sorts candidates by name · sorts jobs by date · toggles sort direction … |
| `e2e/infinite-scroll.spec.ts` | 4 | Infinite Scroll · loads more candidates on scroll · shows loading indicator while fetching · shows end of list message |
| `e2e/localization.spec.ts` | 4 | Localization · displays content in Portuguese · formats dates in Brazilian format · formats currency in BRL |
| `e2e/mobile.spec.ts` | 4 | Mobile Responsiveness · dashboard renders on mobile · navigation menu works on mobile · forms are usable on mobile |
| `e2e/portal-auth.spec.ts` | 4 | Portal Auth Page · should load page · should render content · should show login form |
| `e2e/websocket.spec.ts` | 4 | WebSocket / Realtime · page loads and supports realtime · pipeline page loads · handles offline/online transition |
| `src/pages/__tests__/IndicacoesPage.integration.test.tsx` | 4 | IndicacoesPage (integration) · renderiza header e KPIs após carregar · valida campos obrigatórios ao registrar indicação · registra indicação quando os campos obrigatórios estão preenchidos |
| `e2e/home-page.spec.ts` | 3 | HomePage · should load page · should be accessible |
| `e2e/job-publisher.spec.ts` | 3 | Job Publisher · should load vagas page · should load vaga details page |
| `e2e/offline.spec.ts` | 3 | Offline/PWA · service worker registration check · app handles offline gracefully |
| `e2e/performance.spec.ts` | 3 | Performance · page load time should be under 3s · LCP should be under 2.5s |
| `e2e/portal-home.spec.ts` | 3 | PortalHome · should load page · should be accessible |
| `e2e/prova-editor.spec.ts` | 3 | Prova Editor · should load new prova page · should load edit prova page |
| `e2e/tests.spec.ts` | 3 | Tests Page · should load tests page · should render main content |
| `e2e/vagas-list.spec.ts` | 3 | VagasList · should load page · should be accessible |
| `supabase/functions/ip-guard/index.test.ts` | 3 | ip-guard - check action com IP local · ip-guard - check action com IP público · ip-guard - sem body retorna erro controlado |
| `e2e/indicacoes.spec.ts` | 2 | Indicacoes · loads |
| `e2e/navigation.spec.ts` | 2 | Navigation · should navigate to main routes |
| `e2e/not-found.spec.ts` | 2 | Not Found Page · should display 404 for non-existent route |
| `e2e/pipeline.spec.ts` | 2 | Pipeline · should load pipeline page |
| `e2e/portal-dashboard.spec.ts` | 2 | Portal Dashboard · should load page |
| `e2e/portal-perfil.spec.ts` | 2 | Portal Perfil · should load page |
| `e2e/portal-vagas.spec.ts` | 2 | Portal Vagas · should load page |
| `e2e/prova-aplicacao.spec.ts` | 2 | Prova Aplicação · should load prova aplicação page |
| `e2e/relatorios.spec.ts` | 2 | Relatorios · loads |
| `e2e/resume-parser.spec.ts` | 2 | Resume Parser · should load page |
| `e2e/vaga-detalhes.spec.ts` | 2 | Vaga Detalhes · should load page |
| `e2e/vaga-form.spec.ts` | 2 | Vaga Form · should load page |
| `src/components/agenda/__tests__/AIInterviewScheduler.integration.test.tsx` | 2 | AIInterviewScheduler (integration) · renderiza intro e permite acionar análise |
| `src/components/layout/Layout.test.tsx` | 2 | Layout Accessibility · should have no accessibility violations |
| `src/test/no-hardcoded-colors.test.ts` | 2 | Design System — sem cores hardcoded em componentes · não deve haver cores hardcoded fora da allowlist |
| `supabase/functions/geo-check/index.test.ts` | 2 | geo-check - verifica IP válido · geo-check - lida com IP vazio |
| `supabase/functions/health/index.test.ts` | 2 | health - retorna status ok · health - aceita GET |

## L. Eventos de webhook tratados (contratos com sistemas externos)

| Evento | Arquivo |
|---|---|
| `SKIP_WAITING` | `public/sw.js` |

## M. Efeitos colaterais (e-mail, SMS, cobrança, fila — não são idempotentes por padrão)

| Chamada | Arquivo |
|---|---|
| `.add("high-contrast"` | `src/components/a11y/HighContrastMode.tsx` |
| `.add("reduce-motion"` | `src/components/a11y/ReducedMotion.tsx` |
| `invoke(` | `src/components/candidatos/MatchScoreCalculator.tsx` |
| `invoke(` | `src/components/candidatos/resumeParser/useResumeParser.ts` |
| `.add('reduce-motion'` | `src/components/settings/AccessibilitySettings.tsx` |
| `notifyAdmin` | `src/config/ipWhitelist.ts` |
| `notifyStageChange` | `src/contexts/NotificationContext.tsx` |
| `invoke(` | `src/hooks/useComunicacoes.ts` |
| `invoke(` | `src/hooks/useInterviewReminders.ts` |
| `invoke(` | `src/hooks/useLinkedInImport.ts` |
| `invoke(` | `src/hooks/useNewDeviceDetection.ts` |
| `invoke(` | `src/hooks/usePropostas.ts` |
| `invoke(` | `src/hooks/useRankingVaga.ts` |
| `invoke(` | `src/pages/AplicarVagaPage.tsx` |
| `invoke(` | `src/pages/AssinarPropostaPage.tsx` |
| `invoke(` | `src/pages/edgeFunctionTest/useEdgeFunctionTests.ts` |
| `invoke(` | `src/services/aiService.ts` |
| `invoke(` | `src/services/emailService.ts` |
| `sendEmail` | `src/services/emailService.ts` |
| `invoke(` | `src/services/evolutionApiService.ts` |
| `invoke(` | `src/services/passwordResetService.ts` |
| `notifyNewCandidate` | `src/services/slackService.ts` |
| `notifyStageChange` | `src/services/slackService.ts` |
| `notifyNewCandidate` | `src/services/teamsService.ts` |
| `invoke(` | `src/services/whatsappService.ts` |
| `sendWhatsAppAudio` | `supabase/functions/evolution-api/index.ts` |
| `sendEmail` | `supabase/functions/interview-reminders/index.ts` |
| `sendEmail` | `supabase/functions/password-reset-approval/index.ts` |
| `sendEmail` | `supabase/functions/process-retry-queue/index.ts` |
| `sendWhatsApp` | `supabase/functions/process-retry-queue/index.ts` |
| `notify` | `supabase/migrations/20260315122914_59e1b154-21d2-4c20-a0b1-3456e5f06d71.sql` |
| `notify_candidato_etapa_change` | `supabase/migrations/20260315122914_59e1b154-21d2-4c20-a0b1-3456e5f06d71.sql` |
| `notify_candidato_etapa_change` | `supabase/migrations/20260713102017_4b1f4aa9-eaaf-4db7-9499-2be53622b019.sql` |
| `notify_candidato_etapa_change` | `supabase/migrations/20260715155057_867ca1a1-a632-4154-8c8e-5fb155100f45.sql` |

## N. Regras citadas em comentários do código

| Comentário | Arquivo |
|---|---|
| * Regra de leitura: "aguardando agora" é a fila de risco do presente — são | `src/components/analytics/FunnelSlaTab.tsx` |
| candidaturas que já estouraram o prazo e continuam sem retorno. É o número | `src/components/analytics/FunnelSlaTab.tsx` |
| acionável; o percentual histórico é apenas diagnóstico. | `src/components/analytics/FunnelSlaTab.tsx` |
| @description Controles de janela de análise e limite de SLA. | `src/components/analytics/SlaConfigBar.tsx` |
| * Limite de caracteres da nota — evita estourar o cap do RPC. */ | `src/components/analytics/SlaNoteTemplates.tsx` |
| * Só busca dados quando aberto (`enabled`), para não onerar quem apenas olha o | `src/components/analytics/SlaOverdueList.tsx` |
| Check if user has required role(s) | `src/components/auth/ProtectedRoute.tsx` |
| * @todo Implement Zod validation schema for form inputs | `src/components/candidato/FormacaoTab.tsx` |
| * @fileoverview Formação Tab component with form validation | `src/components/candidato/FormacaoTab.tsx` |
| * Somente leitura quando o usuário não tem permissão de escrita. */ | `src/components/candidatos/CandidatoSkillsEditor.tsx` |
| Filtrar apenas vagas ativas | `src/components/candidatos/MatchScoreCalculator.tsx` |
| * Regra de exibição: quando não há nenhum sinal, o badge NÃO aparece — | `src/components/candidatos/PotentialIndexBadge.tsx` |
| mostrar "0" seria mentir sobre um candidato que apenas não foi avaliado. | `src/components/candidatos/PotentialIndexBadge.tsx` |
| filtros avançados de talentos. Emite apenas IDs — o casamento acontece no | `src/components/candidatos/TalentSkillsFilter.tsx` |
| não apenas a página carregada. | `src/components/candidatos/TalentSkillsFilter.tsx` |
| * Resumo visual do perfil técnico. Renderiza apenas o que existe — | `src/components/candidatos/TechProfileBadges.tsx` |
| um candidato sem dados estruturados não deve virar uma fileira de | `src/components/candidatos/TechProfileBadges.tsx` |
| aqui apenas evitamos deixar o candidato preso numa tela morta. | `src/components/cognitive/CognitiveTestPlayer.tsx` |
| * Regra de exibição: o banner só aparece quando existe fila real de atraso | `src/components/dashboard/SlaAlertBanner.tsx` |
| Enhanced form field with auto-save, validation, and accessibility | `src/components/forms/SmartFormField.tsx` |
| Validation logic | `src/components/forms/SmartFormField.tsx` |
| Enhanced form components with auto-save, validation, and accessibility | `src/components/forms/index.ts` |
| A implementação foi movida para `./achievements/` para respeitar o limite de 400 linhas. | `src/components/gamification/AchievementBadge.tsx` |
| Calculate required XP for next level | `src/components/gamification/GamificationWidget.tsx` |
| Permitir apenas Escape e ? em campos de input | `src/components/intelligence/KeyboardShortcuts.tsx` |
| carregar apenas os cenários do pilar em uso. | `src/data/immersiveScenariosData.ts` |
| * Toda a lógica sensível (sorteio de itens, correção, tempo limite, pontuação) | `src/hooks/useCognitiveTest.ts` |
| roda no banco via RPCs `SECURITY DEFINER`. Este hook é apenas o transporte: | `src/hooks/useCognitiveTest.ts` |
| * Converte o JSONB de alternativas com validação defensiva. */ | `src/hooks/useCognitiveTest.ts` |
| apenas para dar feedback visual e disparar o encerramento automático. | `src/hooks/useCognitiveTest.ts` |
| razões: (1) o dado bruto é volumoso e não deve trafegar; (2) a definição de | `src/hooks/useFunnelSla.ts` |
| SECURITY DEFINER com checagem de RH, então a regra de acesso não depende de | `src/hooks/useFunnelSla.ts` |
| * Localização aproximada onde o padrão deve ser encontrado */ | `src/hooks/useFuzzySearch.ts` |
| * Número máximo de resultados */ | `src/hooks/useFuzzySearch.ts` |
| * Se deve incluir pontuação no resultado */ | `src/hooks/useFuzzySearch.ts` |
| * Se deve incluir correspondências no resultado */ | `src/hooks/useFuzzySearch.ts` |
| * Peso mínimo de caracteres para corresponder */ | `src/hooks/useFuzzySearch.ts` |
| * Se a busca deve ser sensível a maiúsculas */ | `src/hooks/useFuzzySearch.ts` |
| * Se deve buscar no início da string */ | `src/hooks/useFuzzySearch.ts` |
| * Se deve ignorar a localização */ | `src/hooks/useFuzzySearch.ts` |
| * Se deve usar busca estendida */ | `src/hooks/useFuzzySearch.ts` |
| Extrair apenas os itens | `src/hooks/useFuzzySearch.ts` |
| * Busca rígida - apenas correspondências muito próximas */ | `src/hooks/useFuzzySearch.ts` |
| @description Importação de CSV e Excel com validação Zod | `src/hooks/useImportData.ts` |
| @description Estado de UI persistido em `localStorage`, com validação. | `src/hooks/useLocalStorageState.ts` |
| - **Validação obrigatória (`isValid`)**: o conteúdo do `localStorage` é | `src/hooks/useLocalStorageState.ts` |
| Quota cheia ou storage bloqueado: seguimos apenas em memória. | `src/hooks/useLocalStorageState.ts` |
| Consultas independentes → paralelas. Falha em uma não deve derrubar a outra, | `src/hooks/usePotentialIndex.ts` |
| * Limite defensivo: acima disso a cláusula IN degrada e o payload fica caro. */ | `src/hooks/usePotentialIndexBatch.ts` |
| Executa sequencialmente para respeitar rate-limit da edge function | `src/hooks/useRankingVaga.ts` |
| aceita insert por `service_role` — a regra de quem pode registrar mora no | `src/hooks/useRegisterFirstResponse.ts` |
| * Limite defensivo da nota — o histórico é para rastro, não para redação. */ | `src/hooks/useRegisterFirstResponse.ts` |
| tolerante — uma candidatura sem processo vinculado não pode abortar as | `src/hooks/useRegisterFirstResponse.ts` |
| * Callback quando sessão expira */ | `src/hooks/useSessionTimeout.ts` |
| * Exportação CSV do resultado COMPLETO da busca (não apenas da página | `src/hooks/useTalentExport.ts` |
| o teto de 200 do servidor. Um limite absoluto evita que um filtro vazio | `src/hooks/useTalentExport.ts` |
| ').eq('user_id', userId).order('created_at', { ascending: false }).limit(20), | `src/hooks/gamification/loader.ts` |
| - Se o Sentry não estiver ativo, apenas executa `fn` sem overhead. | `src/lib/sentryRpc.ts` |
| Em desenvolvimento, apenas loga no console via logger. | `src/lib/webVitals.ts` |
| Fail-silent: telemetria nunca deve quebrar a app | `src/lib/webVitals.ts` |
| Não faz chamadas server-side: apenas monta URLs seguras para intake. | `src/lib/whatsappIntake.ts` |
| Validação client-side dos knockouts (dupla checagem no server) | `src/pages/AplicarVagaPage.tsx` |
| Auth Required Alert */} | `src/pages/portal/PortalAuthPage.tsx` |
| Fetch rate limit logs | `src/pages/security/RateLimitDashboard.tsx` |
| Usa k-anonymity: apenas os 5 primeiros caracteres do hash SHA-1 são enviados | `src/services/passwordBreachService.ts` |
| Usa k-anonymity: apenas os 5 primeiros caracteres do hash são enviados à API | `src/services/passwordBreachService.ts` |
| Se a pontuação deve ser invertida | `src/types/personality.ts` |
| ID de questão para validação de consistência | `src/types/personality.ts` |
| * Retorna `Response` 429 se o limite foi excedido; caso contrário `null`. | `supabase/functions/_shared/rateLimit.ts` |
| observer não deve quebrar o breaker */ | `supabase/functions/_shared/resilience.ts` |
| Autorização: apenas equipe de RH | `supabase/functions/ai-screening/index.ts` |
| Validação JWT | `supabase/functions/github-api/index.ts` |
| No auth required - designed for external uptime monitors (UptimeRobot, BetterStack, etc.) | `supabase/functions/health/index.ts` |
| --- RATE LIMIT --------------------------------------------------------- | `supabase/functions/hunter-sync/index.ts` |
| Validação JWT | `supabase/functions/match-score/index.ts` |
| Validação JWT | `supabase/functions/parse-resume/index.ts` |
| 1. Rate limit por IP. | `supabase/functions/public-apply/index.ts` |
| 1b. Validação server-side dos knockouts (fonte da verdade) | `supabase/functions/public-apply/index.ts` |
| Validação JWT | `supabase/functions/send-email/index.ts` |
| Validação JWT | `supabase/functions/send-whatsapp/index.ts` |
