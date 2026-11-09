# 11 · GLOSSÁRIO, DADOS DE REFERÊNCIA E LACUNAS

> Gerado automaticamente por AI Context Sync v1.3.2 · commit `838a4dcc6b` · branch `main` · 2026-11-09 01:35 UTC
> Não edite à mão — regras humanas vão em `manual/`.

## Glossário do domínio (entidades do sistema)

| Termo | Significado / valores | Tamanho | Origem |
|---|---|---|---|
| `admin_audit_log` | _(sem COMMENT ON TABLE — significado não documentado)_ | 10 colunas | migration |
| `ai_cache` | _(sem COMMENT ON TABLE — significado não documentado)_ | 8 colunas | migration |
| `allowed_countries` | _(sem COMMENT ON TABLE — significado não documentado)_ | 7 colunas | migration |
| `allowed_ips` | Lista de IPs permitidos para acesso ao sistema | 7 colunas | migration |
| `assessment_questoes` | _(sem COMMENT ON TABLE — significado não documentado)_ | 10 colunas | migration |
| `assessment_respostas` | _(sem COMMENT ON TABLE — significado não documentado)_ | 11 colunas | migration |
| `assessments` | _(sem COMMENT ON TABLE — significado não documentado)_ | 12 colunas | migration |
| `audit_logs` | _(sem COMMENT ON TABLE — significado não documentado)_ | 11 colunas | migration |
| `avaliacoes` | Avaliações de candidatos em processos seletivos | 15 colunas | migration |
| `avaliacoes_comportamentais_resultados` | _(sem COMMENT ON TABLE — significado não documentado)_ | 37 colunas | migration |
| `bateria_provas_rel` | _(sem COMMENT ON TABLE — significado não documentado)_ | 5 colunas | migration |
| `baterias_provas` | _(sem COMMENT ON TABLE — significado não documentado)_ | 9 colunas | migration |
| `behavioral_assessment_results` | _(sem COMMENT ON TABLE — significado não documentado)_ | 15 colunas | migration |
| `blocked_ips` | _(sem COMMENT ON TABLE — significado não documentado)_ | 8 colunas | migration |
| `candidate_tag_assignments` | _(sem COMMENT ON TABLE — significado não documentado)_ | 4 colunas | migration |
| `candidate_tags` | _(sem COMMENT ON TABLE — significado não documentado)_ | 5 colunas | migration |
| `candidato_skills` | _(sem COMMENT ON TABLE — significado não documentado)_ | 7 colunas | migration |
| `candidatos` | _(sem COMMENT ON TABLE — significado não documentado)_ | 26 colunas | migration |
| `candidatos_auth` | _(sem COMMENT ON TABLE — significado não documentado)_ | 10 colunas | migration |
| `candidaturas` | _(sem COMMENT ON TABLE — significado não documentado)_ | 12 colunas | migration |
| `cognitive_items` | _(sem COMMENT ON TABLE — significado não documentado)_ | 14 colunas | migration |
| `cognitive_responses` | _(sem COMMENT ON TABLE — significado não documentado)_ | 10 colunas | migration |
| `cognitive_sessions` | _(sem COMMENT ON TABLE — significado não documentado)_ | 16 colunas | migration |
| `communication_retry_queue` | _(sem COMMENT ON TABLE — significado não documentado)_ | 12 colunas | migration |
| `comparativos_candidatos` | _(sem COMMENT ON TABLE — significado não documentado)_ | 7 colunas | migration |
| `competencias` | _(sem COMMENT ON TABLE — significado não documentado)_ | 10 colunas | migration |
| `comunicacoes` | _(sem COMMENT ON TABLE — significado não documentado)_ | 10 colunas | migration |
| `criterios_selecao` | _(sem COMMENT ON TABLE — significado não documentado)_ | 11 colunas | migration |
| `data_access_logs` | _(sem COMMENT ON TABLE — significado não documentado)_ | 6 colunas | migration |
| `data_deletion_requests` | _(sem COMMENT ON TABLE — significado não documentado)_ | 7 colunas | migration |
| `departamentos` | _(sem COMMENT ON TABLE — significado não documentado)_ | 6 colunas | migration |
| `documentos_candidatos` | _(sem COMMENT ON TABLE — significado não documentado)_ | 10 colunas | migration |
| `email_templates` | _(sem COMMENT ON TABLE — significado não documentado)_ | 11 colunas | migration |
| `empresa_branding` | _(sem COMMENT ON TABLE — significado não documentado)_ | 19 colunas | migration |
| `entity_versions` | _(sem COMMENT ON TABLE — significado não documentado)_ | 8 colunas | migration |
| `entrevista_respostas` | _(sem COMMENT ON TABLE — significado não documentado)_ | 9 colunas | migration |
| `entrevistas` | _(sem COMMENT ON TABLE — significado não documentado)_ | 28 colunas | migration |
| `feature_flags` | _(sem COMMENT ON TABLE — significado não documentado)_ | 7 colunas | migration |
| `geo_access_logs` | _(sem COMMENT ON TABLE — significado não documentado)_ | 8 colunas | migration |
| `historico_etapas` | _(sem COMMENT ON TABLE — significado não documentado)_ | 7 colunas | migration |
| `hunter_leads` | _(sem COMMENT ON TABLE — significado não documentado)_ | 21 colunas | migration |
| `indicacoes` | _(sem COMMENT ON TABLE — significado não documentado)_ | 14 colunas | migration |
| `integration_health_events` | _(sem COMMENT ON TABLE — significado não documentado)_ | 7 colunas | migration |
| `ip_access_logs` | Log de tentativas de acesso por IP | 8 colunas | migration |
| `login_attempts` | _(sem COMMENT ON TABLE — significado não documentado)_ | 9 colunas | migration |
| `match_scores` | _(sem COMMENT ON TABLE — significado não documentado)_ | 16 colunas | migration |
| `notas_candidatos` | _(sem COMMENT ON TABLE — significado não documentado)_ | 10 colunas | migration |
| `notificacoes_candidato` | _(sem COMMENT ON TABLE — significado não documentado)_ | 8 colunas | migration |
| `notifications` | _(sem COMMENT ON TABLE — significado não documentado)_ | 11 colunas | migration |
| `password_reset_requests` | _(sem COMMENT ON TABLE — significado não documentado)_ | 15 colunas | migration |
| `password_reset_tokens` | _(sem COMMENT ON TABLE — significado não documentado)_ | 6 colunas | migration |
| `perfil_valores` | _(sem COMMENT ON TABLE — significado não documentado)_ | 6 colunas | migration |
| `perfis_cargo` | _(sem COMMENT ON TABLE — significado não documentado)_ | 15 colunas | migration |
| `perfis_comportamentais_empresa` | _(sem COMMENT ON TABLE — significado não documentado)_ | 20 colunas | migration |
| `permissions` | _(sem COMMENT ON TABLE — significado não documentado)_ | 6 colunas | migration |
| `processos_seletivos` | _(sem COMMENT ON TABLE — significado não documentado)_ | 16 colunas | migration |
| `profiles` | _(sem COMMENT ON TABLE — significado não documentado)_ | 10 colunas | migration |
| `propostas` | _(sem COMMENT ON TABLE — significado não documentado)_ | 26 colunas | migration |
| `propostas_eventos` | _(sem COMMENT ON TABLE — significado não documentado)_ | 9 colunas | migration |
| `provas` | _(sem COMMENT ON TABLE — significado não documentado)_ | 17 colunas | migration |
| `questoes` | _(sem COMMENT ON TABLE — significado não documentado)_ | 10 colunas | migration |
| `rate_limit_logs` | _(sem COMMENT ON TABLE — significado não documentado)_ | 6 colunas | migration |
| `rate_limits` | _(sem COMMENT ON TABLE — significado não documentado)_ | 7 colunas | migration |
| `regras_automacao` | _(sem COMMENT ON TABLE — significado não documentado)_ | 11 colunas | migration |
| `regras_log` | _(sem COMMENT ON TABLE — significado não documentado)_ | 8 colunas | migration |
| `resultados_provas` | _(sem COMMENT ON TABLE — significado não documentado)_ | 13 colunas | migration |
| `role_permissions` | _(sem COMMENT ON TABLE — significado não documentado)_ | 4 colunas | migration |
| `roles` | _(sem COMMENT ON TABLE — significado não documentado)_ | 6 colunas | migration |
| `saved_filters` | Filtros salvos por usuários para diferentes entidades | 8 colunas | migration |
| `scorecard_competencias` | _(sem COMMENT ON TABLE — significado não documentado)_ | 11 colunas | migration |
| `scorecard_templates` | _(sem COMMENT ON TABLE — significado não documentado)_ | 9 colunas | migration |
| `scorecards` | _(sem COMMENT ON TABLE — significado não documentado)_ | 22 colunas | migration |
| `skills` | _(sem COMMENT ON TABLE — significado não documentado)_ | 7 colunas | migration |
| `talent_pool_members` | _(sem COMMENT ON TABLE — significado não documentado)_ | 6 colunas | migration |
| `talent_pools` | _(sem COMMENT ON TABLE — significado não documentado)_ | 9 colunas | migration |
| `template_perguntas` | _(sem COMMENT ON TABLE — significado não documentado)_ | 11 colunas | migration |
| `templates_entrevista` | _(sem COMMENT ON TABLE — significado não documentado)_ | 10 colunas | migration |
| `tenant_invitations` | _(sem COMMENT ON TABLE — significado não documentado)_ | 8 colunas | migration |
| `tenant_invites` | _(sem COMMENT ON TABLE — significado não documentado)_ | 7 colunas | migration |
| `tenant_members` | _(sem COMMENT ON TABLE — significado não documentado)_ | 5 colunas | migration |
| `tenants` | _(sem COMMENT ON TABLE — significado não documentado)_ | 10 colunas | migration |
| `triagem_ia` | _(sem COMMENT ON TABLE — significado não documentado)_ | 14 colunas | migration |
| `trusted_devices` | _(sem COMMENT ON TABLE — significado não documentado)_ | 7 colunas | migration |
| `user_2fa` | Stores 2FA secrets and backup codes for users | 8 colunas | migration |
| `user_2fa_logs` | Audit log for 2FA-related actions | 7 colunas | migration |
| `user_achievements` | _(sem COMMENT ON TABLE — significado não documentado)_ | 5 colunas | migration |
| `user_badges` | _(sem COMMENT ON TABLE — significado não documentado)_ | 4 colunas | migration |
| `user_consents` | _(sem COMMENT ON TABLE — significado não documentado)_ | 7 colunas | migration |
| `user_gamification` | _(sem COMMENT ON TABLE — significado não documentado)_ | 10 colunas | migration |
| `user_roles` | _(sem COMMENT ON TABLE — significado não documentado)_ | 7 colunas | migration |
| `vaga_interview_kits` | _(sem COMMENT ON TABLE — significado não documentado)_ | 8 colunas | migration |
| `vagas` | _(sem COMMENT ON TABLE — significado não documentado)_ | 34 colunas | migration |
| `valores_culturais` | _(sem COMMENT ON TABLE — significado não documentado)_ | 9 colunas | migration |
| `web_vitals` | _(sem COMMENT ON TABLE — significado não documentado)_ | 12 colunas | migration |
| `webauthn_credentials` | _(sem COMMENT ON TABLE — significado não documentado)_ | 10 colunas | migration |
| `workflow_actions` | _(sem COMMENT ON TABLE — significado não documentado)_ | 7 colunas | migration |
| `workflow_etapas` | _(sem COMMENT ON TABLE — significado não documentado)_ | 7 colunas | migration |
| `workflow_stages` | _(sem COMMENT ON TABLE — significado não documentado)_ | 11 colunas | migration |
| `workflow_transitions` | _(sem COMMENT ON TABLE — significado não documentado)_ | 10 colunas | migration |
| `workflows` | _(sem COMMENT ON TABLE — significado não documentado)_ | 8 colunas | migration |
| `xp_transactions` | _(sem COMMENT ON TABLE — significado não documentado)_ | 7 colunas | migration |
| `app_role` (enum) | admin, rh, gestor |  | banco |
| `senioridade_nivel` (enum) | estagio, junior, pleno, senior, staff, principal, lead |  | banco |
| `nivel_idioma` (enum) | nenhum, basico, intermediario, avancado, fluente, nativo |  | banco |
| `regime_contratacao` (enum) | clt, pj, ambos |  | banco |
| `modalidade_trabalho` (enum) | remoto, hibrido, presencial |  | banco |
| `cognitive_domain` (enum) | logico, numerico, verbal, atencao |  | banco |
| `cognitive_session_status` (enum) | em_andamento, concluida, expirada, cancelada |  | banco |
| `JANELAS_DIAS` (TS) | 7, 15, 30, 60, 90 |  | `src/components/analytics/SlaConfigBar.tsx` |
| `LIMITES_SLA_HORAS` (TS) | 12, 24, 48, 72, 120 |  | `src/components/analytics/SlaConfigBar.tsx` |
| `NOTAS_RAPIDAS` (TS) | "Contato por e-mail", "Contato por WhatsApp", "Contato por telefone", "Retorno agendado", |  | `src/components/analytics/SlaNoteTemplates.tsx` |
| `EnginePhase` (TS) | intro \| playing \| complete |  | `src/components/assessments/gamified/engineConfig.ts` |
| `EngineTheme` (TS) | default \| playful \| minimal \| cosmic |  | `src/components/assessments/gamified/engineConfig.ts` |
| `MiniGameType` (TS) | quick-choice \| word-association \| scenario-pick \| this-or-that \| priority-sort |  | `src/components/assessments/gamified/personalityMiniGame/types.ts` |
| `Phase` (TS) | ready \| playing \| feedback \| complete |  | `src/components/assessments/gamified/personalityMiniGame/usePersonalityMiniGame.ts` |
| `KPIVariant` (TS) | primary \| success \| warning \| info \| accent |  | `src/components/dashboard/interactiveKPI/types.ts` |
| `KPIFormat` (TS) | number \| percentage \| currency \| days |  | `src/components/dashboard/interactiveKPI/types.ts` |
| `PowerUpType` (TS) | double_xp \| streak_shield \| time_boost \| bonus_multiplier |  | `src/components/gamification/PowerUps.tsx` |
| `AchievementTier` (TS) | bronze \| silver \| gold \| platinum \| diamond |  | `src/components/gamification/achievementProfile/types.ts` |
| `StatColor` (TS) | yellow \| primary \| orange \| purple |  | `src/components/gamification/achievementProfile/types.ts` |
| `AchievementTier` (TS) | bronze \| silver \| gold \| platinum \| diamond |  | `src/components/gamification/achievements/achievementTypes.ts` |
| `AchievementCategory` (TS) | recruitment \| speed \| quality \| engagement \| milestone \| streak \| special |  | `src/components/gamification/achievements/achievementTypes.ts` |
| `AchievementBadgeSize` (TS) | sm \| md \| lg \| xl |  | `src/components/gamification/achievements/achievementTypes.ts` |
| `ChallengeType` (TS) | login \| candidatos \| entrevistas \| vagas \| avaliacoes \| games \| streak |  | `src/components/gamification/dailyChallenges/types.ts` |
| `ChallengeDifficulty` (TS) | easy \| medium \| hard \| epic |  | `src/components/gamification/dailyChallenges/types.ts` |
| `GamifiedMode` (TS) | quiz \| swipe \| minigame \| phases |  | `src/components/gamification/page/gameCardsConfig.ts` |
| `MissionTier` (TS) | bronze \| silver \| gold \| platinum |  | `src/components/gamification/weeklyMissions/types.ts` |
| `SearchResultType` (TS) | candidato \| vaga \| entrevista \| documento \| acao |  | `src/components/intelligence/PredictiveSearch.tsx` |
| `OfferStatus` (TS) | rascunho \| enviada \| visualizada \| aceita \| recusada \| expirada \| cancelada |  | `src/components/offers/OfferCard.tsx` |
| `TrendDirection` (TS) | up \| down \| neutral |  | `src/components/visualization/trendIndicators/trendUtils.ts` |
| `DEVELOPMENT_IPS` (TS) | '127.0.0.1', '::1', 'localhost' |  | `src/config/ipWhitelist.ts` |
| `AppRole` (TS) | admin \| rh \| gestor |  | `src/contexts/AuthContext.tsx` |
| `AgendaTipoEntrevista` (TS) | tecnica \| rh \| cultural \| final \| triagem \| presencial \| online \| telefone |  | `src/data/agendaData.ts` |
| `AgendaStatusEntrevista` (TS) | agendada \| confirmada \| realizada \| cancelada \| remarcada \| reagendada \| no_show |  | `src/data/agendaData.ts` |
| `AnalyticsPeriodo` (TS) | 30d \| 3m \| 6m \| 1y |  | `src/hooks/useAdvancedAnalytics.ts` |
| `PARECERES` (TS) | { value: 'aprovar', label: 'Aprovar', color: 'green' }, { value: 'reprovar', label: 'Reprovar', color: 'red' }, { value: 'em_duvida', label: 'Em Dúvida', color: 'yellow' }, |  | `src/hooks/useAvaliacoes.ts` |
| `ImportStatus` (TS) | idle \| parsing \| validating \| importing \| complete \| error |  | `src/hooks/useImportData.ts` |
| `PersonalityFramework` (TS) | bigfive \| mbti \| enneagram \| all |  | `src/hooks/usePersonalityAssessment.ts` |
| `NotificationType` (TS) | high_match \| stage_change \| new_candidate \| urgent \| interview_scheduled \| interview_updated \| info \| success \| warning \| error |  | `src/hooks/useRealtimeNotifications.ts` |
| `SensitiveAction` (TS) | change_password \| change_email \| configure_mfa \| admin_action \| delete_account \| export_data \| manage_api_keys |  | `src/hooks/useReauth.ts` |
| `SkillCategoria` (TS) | linguagem \| frontend \| backend \| mobile \| banco_de_dados \| cloud \| devops \| dados_ia \| qa_testes \| seguranca \| ferramentas \| produto_gestao \| design_ux \| soft_skills \| idioma |  | `src/hooks/useSkills.ts` |
| `SoundType` (TS) | celebration \| notification \| success \| error \| warning \| click \| hover \| levelUp \| achievement |  | `src/hooks/useSoundPreferences.ts` |
| `SearchOrder` (TS) | created_at \| nome \| pretensao_asc \| pretensao_desc \| skills_match |  | `src/hooks/useTalentSearch.ts` |
| `STATUS_VAGA` (TS) | { id: 'rascunho', nome: 'Rascunho', cor: 'gray' }, { id: 'publicada', nome: 'Publicada', cor: 'green' }, { id: 'pausada', nome: 'Pausada', cor: 'yellow' }, { id: 'fechada', nome: 'Fechada', cor: 'blue' }, { id: 'cancelada', nome: 'Cancelada', cor: 'red' }, |  | `src/lib/constants.ts` |
| `PRIORIDADES` (TS) | { id: 'baixa', nome: 'Baixa', cor: 'gray' }, { id: 'media', nome: 'Média', cor: 'yellow' }, { id: 'alta', nome: 'Alta', cor: 'orange' }, { id: 'urgente', nome: 'Urgente', cor: 'red' }, |  | `src/lib/constants.ts` |
| `TIPOS_CONTRATO` (TS) | { id: 'clt', nome: 'CLT' }, { id: 'pj', nome: 'PJ' }, { id: 'estagio', nome: 'Estágio' }, { id: 'temporario', nome: 'Temporário' }, { id: 'freelancer', nome: 'Freelancer' }, |  | `src/lib/constants.ts` |
| `MODALIDADES_TRABALHO` (TS) | { id: 'presencial', nome: 'Presencial' }, { id: 'remoto', nome: 'Remoto' }, { id: 'hibrido', nome: 'Híbrido' }, |  | `src/lib/constants.ts` |
| `NIVEIS_EXPERIENCIA` (TS) | { id: 'estagiario', nome: 'Estagiário', anosMin: 0, anosMax: 0 }, { id: 'junior', nome: 'Júnior', anosMin: 0, anosMax: 2 }, { id: 'pleno', nome: 'Pleno', anosMin: 2, anosMax: 5 }, { id: 'senior', nome: 'Sênior', anosMin: 5, anosMax: 10 }, { id: 'especialista', nome: 'Especialista', anosMin: 10, anos … |  | `src/lib/constants.ts` |
| `FONTES_CANDIDATOS` (TS) | { id: 'linkedin', nome: 'LinkedIn' }, { id: 'indeed', nome: 'Indeed' }, { id: 'site', nome: 'Site Próprio' }, { id: 'indicacao', nome: 'Indicação' }, { id: 'banco_talentos', nome: 'Banco de Talentos' }, { id: 'universidade', nome: 'Universidade' }, { id: 'evento', nome: 'Evento' }, { id: 'outro', no … |  | `src/lib/constants.ts` |
| `TIPOS_ENTREVISTA` (TS) | { id: 'telefone', nome: 'Telefone', icone: 'Phone' }, { id: 'video', nome: 'Videoconferência', icone: 'Video' }, { id: 'presencial', nome: 'Presencial', icone: 'Users' }, |  | `src/lib/constants.ts` |
| `CATEGORIAS_PROVA` (TS) | { id: 'logica', nome: 'Lógica', icone: 'Brain' }, { id: 'tecnica', nome: 'Técnica', icone: 'Code' }, { id: 'portugues', nome: 'Português', icone: 'BookOpen' }, { id: 'ingles', nome: 'Inglês', icone: 'Globe' }, { id: 'excel', nome: 'Excel', icone: 'Table' }, { id: 'comportamental', nome: 'Comportamen … |  | `src/lib/constants.ts` |
| `DEPARTAMENTOS` (TS) | 'Tecnologia', 'Comercial', 'Marketing', 'Recursos Humanos', 'Financeiro', 'Operações', 'Administrativo', 'Jurídico', 'Produto', 'Design', |  | `src/lib/constants.ts` |
| `PotentialConfidence` (TS) | alta \| media \| baixa \| insuficiente |  | `src/lib/potentialIndex.ts` |
| `PotentialTier` (TS) | alto \| promissor \| moderado \| atencao |  | `src/lib/potentialIndex.ts` |
| `JobBoard` (TS) | linkedin \| indeed \| catho \| infojobs \| vagas |  | `src/services/jobBoardService.ts` |
| `ReportType` (TS) | vagas \| candidatos \| funil \| entrevistas \| sla \| diversidade \| custom |  | `src/services/reportingService.ts` |
| `ChartType` (TS) | bar \| line \| area \| pie \| radar \| table |  | `src/services/reportingService.ts` |
| `ExportFormat` (TS) | csv \| xlsx \| pdf \| json \| png |  | `src/services/reportingService.ts` |
| `GenerationType` (TS) | silent \| baby_boomer \| gen_x \| millennial \| gen_z \| gen_alpha |  | `src/types/advancedBehavioral.ts` |
| `StressResponse` (TS) | fight \| flight \| freeze \| fawn |  | `src/types/advancedBehavioral.ts` |
| `BrainType` (TS) | reptiliano \| limbico \| neocortex |  | `src/types/advancedBehavioral.ts` |
| `HttpMethod` (TS) | GET \| POST \| PUT \| PATCH \| DELETE |  | `src/types/api.ts` |
| `MiniGameType` (TS) | value-tower \| reaction \| pressure \| emotional-radar |  | `src/types/behavioralDNA.ts` |
| `CognitiveDomain` (TS) | logico \| numerico \| verbal \| atencao |  | `src/types/cognitive.ts` |
| `CognitiveSessionStatus` (TS) | em_andamento \| concluida \| expirada \| cancelada |  | `src/types/cognitive.ts` |
| `CognitiveFaixa` (TS) | abaixo \| mediano \| acima \| superior |  | `src/types/cognitive.ts` |
| `FormFieldType` (TS) | text \| email \| password \| number \| date \| select \| textarea \| checkbox \| radio \| file \| tel \| url |  | `src/types/forms.ts` |
| `JobFitNivel` (TS) | excelente \| alto \| moderado \| baixo \| incompativel |  | `src/types/jobFit.ts` |
| `RedFlagSeveridade` (TS) | critico \| alto \| medio \| baixo |  | `src/types/jobFit.ts` |
| `RedFlagCategoria` (TS) | comportamental \| resiliencia \| compatibilidade \| consistencia \| stress \| cultural |  | `src/types/jobFit.ts` |
| `KnockoutTipo` (TS) | boolean \| text \| select \| number |  | `src/types/knockout.ts` |
| `ValorCulturalId` (TS) | inovacao \| colaboracao \| excelencia \| transparencia \| diversidade \| sustentabilidade \| agilidade \| autonomia \| aprendizado \| cliente_foco \| integridade \| paixao \| resiliencia \| equidade \| bem_estar \| meritocracia \| empreendedorismo \| tradicao \| criatividade \| resultado |  | `src/types/match.ts` |
| `MBTIDichotomy` (TS) | E \| I |  | `src/types/personality.ts` |
| `MBTIType` (TS) | INTJ \| INTP \| ENTJ \| ENTP \| INFJ \| INFP \| ENFJ \| ENFP \| ISTJ \| ISFJ \| ESTJ \| ESFJ \| ISTP \| ISFP \| ESTP \| ESFP |  | `src/types/personality.ts` |
| `EnneagramTriad` (TS) | instintivo \| emocional \| mental |  | `src/types/personality.ts` |
| `EnneagramInstinct` (TS) | autopreservacao \| social \| sexual |  | `src/types/personality.ts` |
| `EnneagramHealthLevel` (TS) | muito_saudavel \| saudavel \| medio \| nao_saudavel \| muito_nao_saudavel |  | `src/types/personality.ts` |
| `StatusVaga` (TS) | rascunho \| aguardando_aprovacao \| aprovada \| publicada \| em_selecao \| pausada \| encerrada \| cancelada |  | `src/types/recruitment.ts` |
| `Prioridade` (TS) | urgente \| alta \| media \| baixa |  | `src/types/recruitment.ts` |
| `TipoContrato` (TS) | clt \| pj \| estagio \| temporario |  | `src/types/recruitment.ts` |
| `Modalidade` (TS) | presencial \| hibrido \| remoto |  | `src/types/recruitment.ts` |
| `FonteCandidato` (TS) | portal \| linkedin \| indeed \| catho \| infojobs \| indicacao \| espontaneo \| outros |  | `src/types/recruitment.ts` |
| `StatusCandidato` (TS) | ativo \| em_processo \| contratado \| desistente \| blacklist |  | `src/types/recruitment.ts` |
| `EtapaProcesso` (TS) | novo \| em_triagem \| pre_selecao \| entrevista_rh \| teste_tecnico \| entrevista_gestor \| entrevista_final \| aprovado \| proposta_enviada \| contratado \| reprovado \| banco_talentos |  | `src/types/recruitment.ts` |
| `StatusProcesso` (TS) | em_andamento \| aprovado \| reprovado \| desistente \| contratado |  | `src/types/recruitment.ts` |
| `TipoEntrevista` (TS) | telefone \| video \| presencial |  | `src/types/recruitment.ts` |
| `StatusEntrevista` (TS) | agendada \| confirmada \| realizada \| cancelada \| no_show |  | `src/types/recruitment.ts` |
| `TipoCompetencia` (TS) | tecnica \| comportamental |  | `src/types/recruitment.ts` |
| `TipoAssessment` (TS) | disc \| cultural \| situacional \| valores |  | `src/types/selection.ts` |
| `TipoQuestaoAssessment` (TS) | escala \| escolha_forcada \| multipla \| situacional |  | `src/types/selection.ts` |
| `MOEDAS` (TS) | "BRL", "USD", "EUR" |  | `src/types/techProfile.ts` |
| `NivelCargo` (TS) | basico \| intermediario \| avancado |  | `src/types/tests.ts` |
| `CategoriaProva` (TS) | logica \| tecnica \| portugues \| ingles \| excel \| comportamental \| fit_cultural |  | `src/types/tests.ts` |
| `Departamento` (TS) | ti \| comercial \| rh \| financeiro \| marketing \| operacoes \| administrativo \| juridico \| geral |  | `src/types/tests.ts` |
| `WorkflowNodeType` (TS) | trigger \| action \| condition \| delay |  | `src/types/workflow.ts` |
| `CognitiveBias` (TS) | confirmacao \| ancoragem \| disponibilidade \| excesso_confianca \| aversao_perda \| efeito_manada \| retrospectiva \| projecao \| atribuicao \| enquadramento |  | `src/types/behavioral/cognitive.ts` |
| `EmotionalState` (TS) | confianca \| motivacao \| calma \| foco \| criatividade \| determinacao \| empatia \| entusiasmo \| resiliencia \| curiosidade |  | `src/types/behavioral/emotional.ts` |
| `ValueCategory` (TS) | realizacao \| seguranca \| relacionamento \| autonomia \| crescimento \| contribuicao \| reconhecimento \| equilibrio \| desafio \| criatividade |  | `src/types/behavioral/emotional.ts` |
| `DISCProfile` (TS) | D \| I \| S \| C |  | `src/types/behavioral/nlpFrameworks.ts` |
| `VAKDChannel` (TS) | visual \| auditivo \| cinestesico \| digital |  | `src/types/behavioral/nlpFrameworks.ts` |
| `MetaprogramType` (TS) | aproximacao_afastamento \| interno_externo \| opcoes_procedimentos \| global_especifico \| proativo_reativo \| igual_diferente \| tempo |  | `src/types/behavioral/nlpFrameworks.ts` |
| `MentalTrigger` (TS) | escassez \| autoridade \| prova_social \| reciprocidade \| compromisso \| afinidade \| urgencia \| novidade \| curiosidade \| exclusividade |  | `src/types/behavioral/persuasion.ts` |
| `SleightPattern` (TS) | intencao \| redefinicao \| consequencia \| chunk_up \| chunk_down \| analogia \| modelo_mundo \| estrategia_realidade \| contra_exemplo \| hierarquia_criterios \| aplicar_a_si \| meta_frame |  | `src/types/behavioral/persuasion.ts` |
| `KnockoutTipo` (TS) | boolean \| text \| select \| number |  | `supabase/functions/_shared/knockout.ts` |

## Dados de referência (seed — planos, categorias, perfis fixos)

| Tabela | Colunas | Valores | Origem |
|---|---|---|---|
| `vagas` | `id, titulo, departamento, status, prioridade, modalidade, tipo_contrato, quantidade, descricao_empresa, responsabilidades, requisitos_obrigatorios, requisitos_desejaveis, beneficios, salario_min, salario_max, cidade, estado, total_candidatos, em_processo, contratados` | `('00000000-0000-0000-0000-000000000010', 'Desenvolvedor Frontend Senior', 'Tecnologia', 'aberta', 'alta', 'remoto', 'CLT', 2, 'Empresa líder em tecnologia', 'Desenvolver interfaces web responsivas', 'React, TypeScript, 4+ anos de experiência', 'Next.js, Tailwind CSS, Testes automatizados', ARRAY['Vale Refeição', 'Plano de Saúde', 'Home Office'], 12000, 18000, 'São Paulo', 'SP', 45, 12, 0), ('00000 …` | `supabase/seed.sql` |
| `candidatos` | `id, nome, email, telefone, status, habilidades, resumo, fonte` | `('00000000-0000-0000-0000-000000000020', 'João Silva Santos', 'joao.silva@email.com', '11999999901', 'ativo', ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL'], 'Desenvolvedor Full Stack com 5 anos de experiência', 'LinkedIn'), ('00000000-0000-0000-0000-000000000021', 'Maria Oliveira Costa', 'maria.oliveira@email.com', '11999999902', 'ativo', ARRAY['React', 'Next.js', 'Tailwind', 'Jest'], 'Fro …` | `supabase/seed.sql` |
| `processos_seletivos` | `id, candidato_id, candidato_nome, vaga_id, vaga_titulo, etapa_atual, status, match_score, origem, dias_na_etapa` | `('00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000020', 'João Silva Santos', '00000000-0000-0000-0000-000000000010', 'Desenvolvedor Frontend Senior', 'entrevista_tecnica', 'em_andamento', 85, 'LinkedIn', 3), ('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000021', 'Maria Oliveira Costa', '00000000-0000-0000-0000-000000000010', 'Desenvolvedor Fronten …` | `supabase/seed.sql` |
| `entrevistas` | `id, candidato_id, candidato_nome, vaga_id, vaga_titulo, data, hora_inicio, hora_fim, tipo, etapa, status, entrevistadores, local, link_online` | `('00000000-0000-0000-0000-000000000040', '00000000-0000-0000-0000-000000000020', 'João Silva Santos', '00000000-0000-0000-0000-000000000010', 'Desenvolvedor Frontend Senior', CURRENT_DATE + 1, '10:00', '11:00', 'online', 'entrevista_tecnica', 'agendada', ARRAY['Tech Lead', 'Senior Dev'], NULL, 'https://meet.google.com/abc-defg-hij'), ('00000000-0000-0000-0000-000000000041', '00000000-0000-0000-000 …` | `supabase/seed.sql` |
| `indicacoes` | `id, indicador_nome, indicador_email, candidato_nome, candidato_email, candidato_telefone, vaga_id, vaga_titulo, status, observacao` | `('00000000-0000-0000-0000-000000000050', 'Roberto Santos', 'roberto@empresa.com', 'Marcos Paulo Silva', 'marcos.paulo@email.com', '11988887777', '00000000-0000-0000-0000-000000000010', 'Desenvolvedor Frontend Senior', 'pendente', 'Trabalhamos juntos na empresa anterior'), ('00000000-0000-0000-0000-000000000051', 'Amanda Costa', 'amanda@empresa.com', 'Patricia Almeida', 'patricia.almeida@email.com' …` | `supabase/seed.sql` |
| `provas` | `id, titulo, categoria, descricao, duracao, total_questoes, pontuacao_maxima, nota_minima, departamentos, niveis_aplicaveis, ativo, aplicacoes, media_notas, tags` | `('00000000-0000-0000-0000-000000000060', 'Teste Técnico React', 'tecnico', 'Avaliação de conhecimentos em React, hooks e boas práticas', 60, 20, 100, 70, ARRAY['Tecnologia'], ARRAY['pleno', 'senior'], true, 45, 78.5, ARRAY['react', 'frontend', 'javascript']), ('00000000-0000-0000-0000-000000000061', 'Lógica de Programação', 'tecnico', 'Teste de raciocínio lógico e algoritmos', 45, 15, 100, 60, ARR …` | `supabase/seed.sql` |
| `questoes` | `id, prova_id, enunciado, tipo, alternativas, resposta_correta, pontuacao, dificuldade, ordem` | `('00000000-0000-0000-0000-000000000070', '00000000-0000-0000-0000-000000000060', 'Qual hook do React é usado para gerenciar estado local em componentes funcionais?', 'multipla_escolha', '[{"id": "a", "texto": "useEffect"}, {"id": "b", "texto": "useState"}, {"id": "c", "texto": "useContext"}, {"id": "d", "texto": "useReducer"}]', 'b', 5, 'facil', 1), ('00000000-0000-0000-0000-000000000071', '000000 …` | `supabase/seed.sql` |
| `match_scores` | `id, candidato_id, vaga_id, vaga_titulo, score_total, score_habilidades, score_experiencia, score_formacao, habilidades_match, habilidades_faltantes, habilidades_extras, pontos_fortes, pontos_atencao, recomendacao, analise` | `('00000000-0000-0000-0000-000000000080', '00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000010', 'Desenvolvedor Frontend Senior', 85, 90, 80, 85, ARRAY['React', 'TypeScript'], ARRAY['Next.js'], ARRAY['Node.js', 'PostgreSQL'], ARRAY['Experiência sólida em React', 'Conhecimento full stack'], ARRAY['Falta experiência com Next.js'], 'Altamente recomendado', 'Candidato com perfi …` | `supabase/seed.sql` |
| `comunicacoes` | `id, candidato_id, template_nome, template_etapa, assunto, conteudo, enviado_em` | `('00000000-0000-0000-0000-000000000090', '00000000-0000-0000-0000-000000000020', 'Convite Entrevista Técnica', 'entrevista_tecnica', 'Convite para Entrevista Técnica - Match ATS', 'Olá João, gostaríamos de convidá-lo para a próxima etapa do processo seletivo...', NOW() - INTERVAL '2 days'), ('00000000-0000-0000-0000-000000000091', '00000000-0000-0000-0000-000000000021', 'Proposta de Trabalho', 'pr …` | `supabase/seed.sql` |
| `baterias_provas` | `id, nome, descricao, departamento, nivel, duracao_total, ativo` | `('00000000-0000-0000-0000-0000000000a0', 'Bateria Frontend Pleno', 'Conjunto de provas para avaliar desenvolvedores frontend nível pleno', 'Tecnologia', 'pleno', 105, true), ('00000000-0000-0000-0000-0000000000a1', 'Bateria Geral Junior', 'Avaliação básica para candidatos júnior', 'Todos', 'junior', 75, true)` | `supabase/seed.sql` |
| `bateria_provas_rel` | `id, bateria_id, prova_id, ordem, obrigatoria` | `('00000000-0000-0000-0000-0000000000b0', '00000000-0000-0000-0000-0000000000a0', '00000000-0000-0000-0000-000000000060', 1, true), ('00000000-0000-0000-0000-0000000000b1', '00000000-0000-0000-0000-0000000000a0', '00000000-0000-0000-0000-000000000062', 2, true), ('00000000-0000-0000-0000-0000000000b2', '00000000-0000-0000-0000-0000000000a0', '00000000-0000-0000-0000-000000000063', 3, false), ('0000 …` | `supabase/seed.sql` |

## Auditoria de consistência (código × schema) — trate como NÃO VERIFICADO

> `status`: inclui estados só de UI/realtime (ex.: `uploading`, `SUBSCRIBED`) que nunca vão ao banco — confira o arquivo antes de concluir que falta valor no enum.

| Tipo | Problema | Onde |
|---|---|---|
| status | valor `cancelado` para `status` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/agenda/AgendaTimeline.tsx` |
| status | valor `confirmado` para `status` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/agenda/AgendaTimeline.tsx` |
| status | valor `concluido` para `status` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/agenda/AgendaTimeline.tsx`<br>`compara:src/components/candidato/FormacaoTab.tsx` |
| status | valor `arquivado` para `status` usado no código não existe em nenhum enum do banco/TS | `escreve:src/hooks/useBulkActions.ts` |
| status | valor `saving` para `status` usado no código não existe em nenhum enum do banco/TS | `compara:src/hooks/useFormAutoSave.ts` |
| status | valor `fulfilled` para `status` usado no código não existe em nenhum enum do banco/TS | `compara:src/hooks/useOptimisticUpdate.ts`<br>`compara:src/hooks/useRegisterFirstResponse.ts`<br>`compara:src/services/emailService.ts` |
| status | valor `SUBSCRIBED` para `status` usado no código não existe em nenhum enum do banco/TS | `compara:src/hooks/useRealtimeNotifications.ts` |
| status | valor `CHANNEL_ERROR` para `status` usado no código não existe em nenhum enum do banco/TS | `compara:src/hooks/useRealtimeNotifications.ts` |
| status | valor `TIMED_OUT` para `status` usado no código não existe em nenhum enum do banco/TS | `compara:src/hooks/useRealtimeNotifications.ts` |
| status | valor `CLOSED` para `status` usado no código não existe em nenhum enum do banco/TS | `compara:src/hooks/useRealtimeNotifications.ts` |
| status | valor `match` para `status` usado no código não existe em nenhum enum do banco/TS | `escreve:src/lib/jobFit/jobFitCalculator.ts`<br>`escreve:src/types/jobFit.ts` |
| status | valor `distante` para `status` usado no código não existe em nenhum enum do banco/TS | `escreve:src/lib/jobFit/jobFitCalculator.ts` |
| status | valor `aberta` para `status` usado no código não existe em nenhum enum do banco/TS | `compara:src/pages/AnalyticsPage.tsx` |
| status | valor `enviado` para `status` usado no código não existe em nenhum enum do banco/TS | `escreve:src/pages/ComunicacaoPage.tsx`<br>`escreve:src/types/recruitment.ts` |
| status | valor `loading` para `status` usado no código não existe em nenhum enum do banco/TS | `compara:src/pages/DiagnosticoPage.tsx`<br>`compara:src/pages/edgeFunctionTest/FunctionTestCard.tsx`<br>`compara:src/pages/edgeFunctionTest/StatusIndicators.tsx`<br>`compara:src/pages/edgeFunctionTest/useEdgeFunctionTests.ts` |
| status | valor `nao_compareceu` para `status` usado no código não existe em nenhum enum do banco/TS | `compara:src/services/reportingService.ts` |
| status | valor `CONNECTED` para `status` usado no código não existe em nenhum enum do banco/TS | `compara:supabase/functions/evolution-health/index.ts` |
| status | valor `ok` para `status` usado no código não existe em nenhum enum do banco/TS | `escreve:supabase/functions/health/index.ts` |
| status | valor `degraded` para `status` usado no código não existe em nenhum enum do banco/TS | `compara:supabase/functions/health/index.ts`<br>`escreve:supabase/functions/health/index.ts` |
| status | valor `Triagem` para `etapa` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/dashboard/SmartInsights.tsx`<br>`escreve:src/components/admin/SLAConfig.tsx` |
| status | valor `Proposta` para `etapa` usado no código não existe em nenhum enum do banco/TS | `escreve:src/components/admin/SLAConfig.tsx` |
| status | valor `Entrevista` para `etapa` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/dashboard/SmartInsights.tsx` |
| status | valor `candidatura` para `etapa` usado no código não existe em nenhum enum do banco/TS | `escreve:src/data/emailTemplatesData.ts` |
| status | valor `feedback_positivo` para `etapa` usado no código não existe em nenhum enum do banco/TS | `escreve:src/data/emailTemplatesData.ts` |
| status | valor `feedback_negativo` para `etapa` usado no código não existe em nenhum enum do banco/TS | `escreve:src/data/emailTemplatesData.ts` |
| status | valor `avaliacao` para `etapa` usado no código não existe em nenhum enum do banco/TS | `escreve:src/hooks/useAvaliacaoForm.ts` |
| status | valor `narrative` para `phase` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/assessments/ImmersiveScenarioPlayer.tsx`<br>`compara:src/components/assessments/immersive/useScenarioPlayer.ts` |
| status | valor `options` para `phase` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/assessments/ImmersiveScenarioPlayer.tsx` |
| status | valor `followup` para `phase` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/assessments/ImmersiveScenarioPlayer.tsx` |
| status | valor `transitioning` para `phase` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/assessments/ImmersiveScenarioPlayer.tsx`<br>`compara:src/components/assessments/immersive/useScenarioPlayer.ts` |
| status | valor `scenario` para `phase` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/dna/DNAJourneyExperience.tsx` |
| status | valor `results` para `phase` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/dna/DNAJourneyExperience.tsx`<br>`compara:src/pages/BehavioralAssessmentPage.tsx` |
| status | valor `context` para `phase` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/dna/ImmersiveScenarioPlayer.tsx` |
| status | valor `choices` para `phase` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/dna/ImmersiveScenarioPlayer.tsx` |
| status | valor `consequence` para `phase` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/dna/ImmersiveScenarioPlayer.tsx` |
| status | valor `wait` para `phase` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/dna/miniGames/ReactionGame.tsx` |
| status | valor `assessment` para `phase` usado no código não existe em nenhum enum do banco/TS | `compara:src/pages/BehavioralAssessmentPage.tsx` |
| status | valor `phone` para `step` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/auth/MFASMSSetup.tsx` |
| status | valor `verify` para `step` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/auth/MFASMSSetup.tsx`<br>`compara:src/components/auth/TwoFactorSetup.tsx` |
| status | valor `2fa` para `step` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/auth/ReauthDialog.tsx` |
| status | valor `generate` para `step` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/auth/TwoFactorSetup.tsx` |
| status | valor `recovery` para `step` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/auth/TwoFactorSetup.tsx` |
| status | valor `input` para `step` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/candidatos/LinkedInImportDialog.tsx` |
| status | valor `preview` para `step` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/candidatos/LinkedInImportDialog.tsx` |
| status | valor `done` para `step` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/candidatos/LinkedInImportDialog.tsx` |
| status | valor `badge` para `step` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/gamification/GiftBadge.tsx` |
| status | valor `colleague` para `step` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/gamification/GiftBadge.tsx` |
| status | valor `message` para `step` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/gamification/GiftBadge.tsx` |
| status | valor `collapsed` para `state` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/layout/AppSidebar.tsx`<br>`compara:src/components/ui/sidebar.tsx` |
| status | valor `refreshing` para `state` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/mobile/PullToRefresh.tsx` |
| status | valor `pulling` para `state` usado no código não existe em nenhum enum do banco/TS | `compara:src/components/mobile/PullToRefresh.tsx` |
| status | valor `expanded` para `state` usado no código não existe em nenhum enum do banco/TS | `escreve:src/components/ui/sidebar.tsx` |
| status | valor `suspended` para `state` usado no código não existe em nenhum enum do banco/TS | `compara:src/hooks/useSoundPreferences.ts` |
| status | valor `open` para `state` usado no código não existe em nenhum enum do banco/TS | `compara:supabase/functions/_shared/resilience.ts` |
| status | valor `half-open` para `state` usado no código não existe em nenhum enum do banco/TS | `compara:supabase/functions/_shared/resilience.ts` |
| status | valor `breaker_open` para `state` usado no código não existe em nenhum enum do banco/TS | `compara:supabase/functions/proactive-alerts/index.ts` |
| status | valor `SP` para `estado` usado no código não existe em nenhum enum do banco/TS | `escreve:src/data/candidatoPerfilData.ts`<br>`escreve:src/pages/VagaForm.tsx` |
| status | valor `breaker_open` para `last_state` usado no código não existe em nenhum enum do banco/TS | `compara:src/pages/admin/DeadLetterQueuePage.tsx` |
| status | valor `breaker_half_open` para `last_state` usado no código não existe em nenhum enum do banco/TS | `compara:src/pages/admin/DeadLetterQueuePage.tsx` |
| coluna | coluna `count` usada no código não existe no schema de `profiles` |  |
| coluna | coluna `descricao` usada no código não existe no schema de `vagas` |  |
| coluna | coluna `nivel` usada no código não existe no schema de `vagas` |  |
| coluna | coluna `idempotency_key` usada no código não existe no schema de `notificacoes_candidato` |  |
| tabela | tabela `a` usada no código não existe nas migrations/types do repo | `scripts/ai-context/cenarios.mjs` |
| tabela | tabela `contacts` usada no código não existe nas migrations/types do repo | `scripts/ai-context/gerar.unit.mjs` |
| tabela | tabela `curriculos` usada no código não existe nas migrations/types do repo | `src/components/portal/CurriculoUpload.tsx`<br>`supabase/functions/public-apply/index.ts` |
| tabela | tabela `dashboard_table` usada no código não existe nas migrations/types do repo | `scripts/ai-context/gerar.unit.mjs` |
| tabela | tabela `documentos` usada no código não existe nas migrations/types do repo | `src/hooks/useDocumentosCandidato.ts` |
| tabela | tabela `emails` usada no código não existe nas migrations/types do repo | `scripts/ai-context/gerar.unit.mjs` |
| tabela | tabela `fantasma` usada no código não existe nas migrations/types do repo | `scripts/ai-context/cenarios.mjs` |
| tabela | tabela `fixture_table` usada no código não existe nas migrations/types do repo | `scripts/ai-context/gerar.unit.mjs` |
| tabela | tabela `ghost_table` usada no código não existe nas migrations/types do repo | `scripts/ai-context/gerar.unit.mjs` |
| tabela | tabela `outra` usada no código não existe nas migrations/types do repo | `scripts/ci/inventario-banco.unit.mjs` |
| tabela | tabela `payments` usada no código não existe nas migrations/types do repo | `scripts/ai-context/gerar.unit.mjs` |
| tabela | tabela `runtime_table` usada no código não existe nas migrations/types do repo | `scripts/ai-context/gerar.unit.mjs` |
| tabela | tabela `so_teste` usada no código não existe nas migrations/types do repo | `scripts/ai-context/cenarios.mjs` |
| tabela | tabela `t` usada no código não existe nas migrations/types do repo | `scripts/ai-context/cenarios.mjs` |
| tabela | tabela `t1` usada no código não existe nas migrations/types do repo | `scripts/ai-context/cenarios.mjs` |
| tabela | tabela `tabela` usada no código não existe nas migrations/types do repo | `scripts/inventario/gerar-banco.mjs`<br>`scripts/inventario/gerar-repo.mjs` |
| tabela | tabela `tools_runtime` usada no código não existe nas migrations/types do repo | `scripts/ai-context/gerar.unit.mjs` |
| tabela | tabela `tx` usada no código não existe nas migrations/types do repo | `scripts/ai-context/cenarios.mjs` |
| rls | `user_achievements`: front faz DELETE mas nenhuma política RLS permite DELETE → vai falhar/retornar vazio para usuários | `src/hooks/useGamificationSupabase.ts` |
| rls | `user_badges`: front faz DELETE mas nenhuma política RLS permite DELETE → vai falhar/retornar vazio para usuários | `src/hooks/useGamificationSupabase.ts` |
| rls | `user_gamification`: front faz DELETE mas nenhuma política RLS permite DELETE → vai falhar/retornar vazio para usuários | `src/hooks/useGamificationSupabase.ts` |
| rls | `xp_transactions`: front faz DELETE mas nenhuma política RLS permite DELETE → vai falhar/retornar vazio para usuários | `src/hooks/useGamificationSupabase.ts` |
| edge | edge function `dashboard-edge` invocada mas não existe em supabase/functions/ | `scripts/ai-context/gerar.unit.mjs` |
| edge | edge function `fixture-edge` invocada mas não existe em supabase/functions/ | `scripts/ai-context/gerar.unit.mjs` |
| edge | edge function `ghost-edge` invocada mas não existe em supabase/functions/ | `scripts/ai-context/gerar.unit.mjs` |
| edge | edge function `inexistente` invocada mas não existe em supabase/functions/ | `scripts/ai-context/cenarios.mjs` |
| edge | edge function `orphan-fn` invocada mas não existe em supabase/functions/ | `scripts/ai-context/gerar.unit.mjs` |
| edge | edge function `other` invocada mas não existe em supabase/functions/ | `scripts/ai-context/cenarios.mjs` |
| edge | edge function `runtime-fn` invocada mas não existe em supabase/functions/ | `scripts/ai-context/gerar.unit.mjs` |
| edge | edge function `runtime-missing` invocada mas não existe em supabase/functions/ | `scripts/ai-context/gerar.unit.mjs` |
| edge | edge function `tools-edge` invocada mas não existe em supabase/functions/ | `scripts/ai-context/gerar.unit.mjs` |
| rpc | RPC `dashboard_rpc` chamada mas não definida nas migrations/types | `scripts/ai-context/gerar.unit.mjs` |
| rpc | RPC `fixture_rpc` chamada mas não definida nas migrations/types | `scripts/ai-context/gerar.unit.mjs` |
| rpc | RPC `ghost_rpc` chamada mas não definida nas migrations/types | `scripts/ai-context/gerar.unit.mjs` |
| rpc | RPC `is_admin` chamada mas não definida nas migrations/types | `scripts/ai-context/gerar.unit.mjs` |
| rpc | RPC `match_score` chamada mas não definida nas migrations/types | `scripts/ci/inventario-rotas.unit.mjs` |
| rpc | RPC `r1` chamada mas não definida nas migrations/types | `scripts/ai-context/cenarios.mjs` |
| rpc | RPC `runtime_rpc` chamada mas não definida nas migrations/types | `scripts/ai-context/gerar.unit.mjs` |
| rpc | RPC `tools_rpc` chamada mas não definida nas migrations/types | `scripts/ai-context/gerar.unit.mjs` |
| dinâmico | 1 chamada(s) `.from(variável)` — tabela só conhecida em runtime | `scripts/inventario/gerar-banco.mjs` |
| dinâmico | 2 chamada(s) `.from(variável)` — tabela só conhecida em runtime | `scripts/regras_negocio/generate.py` |
| segurança | função `create_default_tenant` é SECURITY DEFINER sem `set search_path` (risco de escalação) | `supabase/migrations/20251226000013_multi_tenant.sql` |
| segurança | função `check_user_permission` é SECURITY DEFINER sem `set search_path` (risco de escalação) | `supabase/migrations/20251226000017_rbac.sql` |
| segurança | função `audit_trigger_func` é SECURITY DEFINER sem `set search_path` (risco de escalação) | `supabase/migrations/20251226000021_audit_trail.sql` |
| segurança | função `log_audit_event` é SECURITY DEFINER sem `set search_path` (risco de escalação) | `supabase/migrations/20251226000021_audit_trail.sql` |

## Lacunas — o que este contexto NÃO consegue responder (perguntas para o dono do negócio)

- Nenhuma regra manual em `manual/`: prazos, limites, exceções comerciais, quem aprova o quê — só o negócio sabe.
- `vagas.estado` é uma coluna de status sem enum/CHECK — os valores válidos e as transições permitidas não estão no banco.
- `vagas.status` é uma coluna de status sem enum/CHECK — os valores válidos e as transições permitidas não estão no banco.
- `candidatos.status` é uma coluna de status sem enum/CHECK — os valores válidos e as transições permitidas não estão no banco.
- `entrevistas.etapa` é uma coluna de status sem enum/CHECK — os valores válidos e as transições permitidas não estão no banco.
- `email_templates.etapa` é uma coluna de status sem enum/CHECK — os valores válidos e as transições permitidas não estão no banco.
- `comunicacoes.template_etapa` é uma coluna de status sem enum/CHECK — os valores válidos e as transições permitidas não estão no banco.
- `processos_seletivos.status` é uma coluna de status sem enum/CHECK — os valores válidos e as transições permitidas não estão no banco.
- `processos_seletivos.dias_na_etapa` é uma coluna de status sem enum/CHECK — os valores válidos e as transições permitidas não estão no banco.
- `avaliacoes.etapa` é uma coluna de status sem enum/CHECK — os valores válidos e as transições permitidas não estão no banco.
- `historico_etapas.etapa_anterior` é uma coluna de status sem enum/CHECK — os valores válidos e as transições permitidas não estão no banco.
- `historico_etapas.etapa_nova` é uma coluna de status sem enum/CHECK — os valores válidos e as transições permitidas não estão no banco.
- `candidaturas.status` é uma coluna de status sem enum/CHECK — os valores válidos e as transições permitidas não estão no banco.
- `workflow_stages.stage_order` é uma coluna de status sem enum/CHECK — os valores válidos e as transições permitidas não estão no banco.
- `assessment_respostas.status` é uma coluna de status sem enum/CHECK — os valores válidos e as transições permitidas não estão no banco.
- `hunter_leads.status` é uma coluna de status sem enum/CHECK — os valores válidos e as transições permitidas não estão no banco.
- `vaga_interview_kits.etapa` é uma coluna de status sem enum/CHECK — os valores válidos e as transições permitidas não estão no banco.
- 95/101 tabelas sem `COMMENT ON TABLE` — o significado de negócio não está no schema: `entity_versions`, `vagas`, `candidatos`, `entrevistas`, `email_templates`, `workflows`, `workflow_etapas`, `match_scores`, `profiles`, `user_roles`, `comunicacoes`, `processos_seletivos` …
- Há tabelas usadas no código sem migration no repo — o schema real pode ter sido alterado pelo painel.

## Regras manuais presentes

_nenhuma — copie `manual/TEMPLATE-regras-de-negocio.md`_
