# Match ATS - Levantamento Completo de Funcionalidades e Ferramentas

## Índice
1. [Stack Tecnológico](#stack-tecnológico)
2. [Funcionalidades de Segurança](#funcionalidades-de-segurança)
3. [Autenticação e Autorização](#autenticação-e-autorização)
4. [Gestão de Candidatos](#gestão-de-candidatos)
5. [Gestão de Vagas](#gestão-de-vagas)
6. [Pipeline e Processos Seletivos](#pipeline-e-processos-seletivos)
7. [Sistema de Provas e Avaliações](#sistema-de-provas-e-avaliações)
8. [Inteligência Artificial](#inteligência-artificial)
9. [Comunicação](#comunicação)
10. [Integrações Externas](#integrações-externas)
11. [Analytics e Relatórios](#analytics-e-relatórios)
12. [Workflow e Automação](#workflow-e-automação)
13. [Portal do Candidato](#portal-do-candidato)
14. [Administração](#administração)
15. [Acessibilidade](#acessibilidade)
16. [Edge Functions (Backend)](#edge-functions-backend)
17. [Hooks Customizados](#hooks-customizados)
18. [Serviços](#serviços)
19. [Utilitários e Bibliotecas](#utilitários-e-bibliotecas)

---

## Stack Tecnológico

| Categoria | Ferramenta/Biblioteca | Versão | Propósito |
|-----------|----------------------|--------|-----------|
| **Framework Frontend** | React | 18.3.1 | UI reativa |
| **Build Tool** | Vite | - | Bundler e dev server |
| **Linguagem** | TypeScript | - | Tipagem estática |
| **Estilização** | TailwindCSS | - | Utility-first CSS |
| **Componentes UI** | shadcn/ui | - | Componentes acessíveis |
| **Gerenciamento de Estado** | TanStack Query | ^5.83.0 | Server state management |
| **Roteamento** | React Router DOM | ^6.30.1 | Navegação SPA |
| **Backend** | Supabase (Lovable Cloud) | ^2.89.0 | PostgreSQL + Auth + Realtime |
| **Formulários** | React Hook Form | ^7.61.1 | Gerenciamento de forms |
| **Validação** | Zod | ^3.25.76 | Schema validation |
| **Drag and Drop** | @dnd-kit | ^6.3.1 | Kanban e ordenação |
| **Gráficos** | Recharts | ^2.15.4 | Visualização de dados |
| **Internacionalização** | i18next | ^23.16.5 | Multi-idioma |
| **Datas** | date-fns | ^3.6.0 | Manipulação de datas |
| **Animações** | tailwindcss-animate | ^1.0.7 | Animações CSS |
| **Temas** | next-themes | ^0.3.0 | Dark/Light mode |
| **Testes** | Vitest | - | Unit testing |
| **Carrossel** | embla-carousel-react | ^8.6.0 | Componentes de carrossel |
| **Toasts** | Sonner | ^1.7.4 | Notificações toast |
| **Métricas** | web-vitals | ^4.2.4 | Core Web Vitals |
| **Speed Insights** | @vercel/speed-insights | ^1.0.12 | Performance monitoring |

---

## Funcionalidades de Segurança

### 1. Bloqueio de IP (IP Whitelist)
| Aspecto | Detalhes |
|---------|----------|
| **Funcionalidade** | Restrição de acesso por IP autorizado |
| **Componente** | `src/components/security/IPGuard.tsx` |
| **Hook** | `src/hooks/useIPVerification.ts` |
| **Serviço** | `src/services/ipService.ts` |
| **Configuração** | `src/config/ipWhitelist.ts` |
| **Edge Function** | `supabase/functions/ip-guard/` |
| **Documentação** | `docs/IP_WHITELIST.md` |

### 2. Rate Limiting
| Aspecto | Detalhes |
|---------|----------|
| **Funcionalidade** | Limitação de requisições por tempo |
| **Biblioteca** | `src/lib/rateLimit.ts` |
| **Configuração** | maxRequests: 100, windowMs: 60000 |

### 3. Security Headers
| Aspecto | Detalhes |
|---------|----------|
| **Funcionalidade** | Headers de segurança HTTP |
| **Biblioteca** | `src/lib/securityHeaders.ts` |
| **Headers** | CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy |

### 4. Sanitização de Dados
| Aspecto | Detalhes |
|---------|----------|
| **Funcionalidade** | Limpeza de inputs contra XSS |
| **Biblioteca** | `src/lib/sanitize.ts` |

### 5. Validação de Upload
| Aspecto | Detalhes |
|---------|----------|
| **Funcionalidade** | Validação de arquivos enviados |
| **Biblioteca** | `src/lib/validateUpload.ts` |

### 6. Validadores
| Aspecto | Detalhes |
|---------|----------|
| **Funcionalidade** | Validação de dados de entrada |
| **Bibliotecas** | `src/lib/validators.ts`, `src/utils/validators.ts` |
| **Schemas** | `src/lib/schemas.ts` (Zod) |

---

## Autenticação e Autorização

### 1. Autenticação Principal
| Aspecto | Detalhes |
|---------|----------|
| **Funcionalidade** | Login/Registro de usuários RH |
| **Contexto** | `src/contexts/AuthContext.tsx` |
| **Hook** | `src/hooks/useAuth.ts` |
| **Página** | `src/pages/AuthPage.tsx` |
| **Componente** | `src/components/auth/ProtectedRoute.tsx` |
| **Backend** | Supabase Auth |

### 2. Autenticação de Candidatos
| Aspecto | Detalhes |
|---------|----------|
| **Funcionalidade** | Login/Registro de candidatos |
| **Contexto** | `src/contexts/CandidatoAuthContext.tsx` |
| **Componente** | `src/components/portal/PortalProtectedRoute.tsx` |
| **Tabela** | `candidatos_auth` |

### 3. Two-Factor Authentication (2FA)
| Aspecto | Detalhes |
|---------|----------|
| **Funcionalidade** | Autenticação em dois fatores |
| **Hook** | `src/hooks/use2FA.ts` |
| **Componentes** | `TwoFactorSetup.tsx`, `TwoFactorVerify.tsx`, `QRCodeGenerator.tsx`, `RecoveryCodesDisplay.tsx` |
| **Diretório** | `src/components/auth/` |

### 4. Gerenciamento de Roles
| Aspecto | Detalhes |
|---------|----------|
| **Funcionalidade** | Controle de papéis (admin, rh, gestor) |
| **Componente** | `src/components/admin/RoleManager.tsx` |
| **Hook** | `src/hooks/usePermissions.ts` |
| **Contexto** | `src/contexts/PermissionContext.tsx` |
| **Tabela** | `user_roles` |
| **Enum** | `app_role: admin | rh | gestor` |

### 5. SSO (Single Sign-On)
| Aspecto | Detalhes |
|---------|----------|
| **Funcionalidade** | Login federado |
| **Componente** | `src/components/admin/SSOSettings.tsx` |

### 6. Session Timeout
| Aspecto | Detalhes |
|---------|----------|
| **Funcionalidade** | Expiração automática de sessão |
| **Hook** | `src/hooks/useSessionTimeout.ts` |

---

## Gestão de Candidatos

### 1. Listagem de Candidatos
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/CandidatosPage.tsx` |
| **Hook** | `src/hooks/useCandidatos.ts`, `src/hooks/useCandidates.ts` |
| **Tabela** | `candidatos` |

### 2. Perfil do Candidato
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/CandidatoPerfilPage.tsx` |
| **Hook** | `src/hooks/useCandidatoPerfil.ts` |

### 3. Timeline do Candidato
| Aspecto | Detalhes |
|---------|----------|
| **Componente** | `src/components/candidatos/CandidateTimeline.tsx` |
| **Funcionalidade** | Histórico de atividades |

### 4. Match Score Card
| Aspecto | Detalhes |
|---------|----------|
| **Componentes** | `src/components/candidatos/MatchScoreCard.tsx`, `src/components/candidatos/MatchScoreCalculator.tsx` |
| **Hook** | `src/hooks/useMatchScores.ts` |
| **Tabela** | `match_scores` |

### 5. AI Match Insights
| Aspecto | Detalhes |
|---------|----------|
| **Componente** | `src/components/candidatos/AIMatchInsights.tsx` |
| **Funcionalidade** | Insights de IA sobre compatibilidade |

### 6. Histórico de Comunicação
| Aspecto | Detalhes |
|---------|----------|
| **Componente** | `src/components/candidatos/ComunicacaoHistorico.tsx` |
| **Tabela** | `comunicacoes` |

### 7. Resume Parser
| Aspecto | Detalhes |
|---------|----------|
| **Componente** | `src/components/candidatos/ResumeParser.tsx` |
| **Página** | `src/pages/ResumeParserPage.tsx` |
| **Edge Function** | `supabase/functions/parse-resume/` |

### 8. Talent Pool
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/TalentPoolPage.tsx` |
| **Hook** | `src/hooks/useTalentPool.ts` |
| **Componentes** | `src/components/talentpool/` |

---

## Gestão de Vagas

### 1. Listagem de Vagas
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/VagasList.tsx` |
| **Hook** | `src/hooks/useVagas.ts`, `src/hooks/useJobs.ts` |
| **Tabela** | `vagas` |
| **Componentes** | `src/components/vagas/` |

### 2. Detalhes da Vaga
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/VagaDetalhes.tsx` |

### 3. Formulário de Vaga
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/VagaForm.tsx` |

### 4. Serviço de Vagas
| Aspecto | Detalhes |
|---------|----------|
| **Serviço** | `src/services/vagasService.ts` |

---

## Pipeline e Processos Seletivos

### 1. Pipeline Kanban
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/Pipeline.tsx` |
| **Componentes** | `PipelineColumn.tsx`, `CandidatoKanbanCard.tsx` |
| **Diretório** | `src/components/pipeline/` |
| **Biblioteca** | @dnd-kit (drag and drop) |

### 2. Processos Seletivos
| Aspecto | Detalhes |
|---------|----------|
| **Hook** | `src/hooks/useProcessosSeletivos.ts`, `src/hooks/useProcessos.ts` |
| **Tabela** | `processos_seletivos` |

### 3. Candidaturas
| Aspecto | Detalhes |
|---------|----------|
| **Hook** | `src/hooks/useCandidaturas.ts` |
| **Tabela** | `candidaturas` |

### 4. Histórico de Etapas
| Aspecto | Detalhes |
|---------|----------|
| **Hook** | `src/hooks/useHistoricoEtapas.ts` |

### 5. Configuração do Pipeline
| Aspecto | Detalhes |
|---------|----------|
| **Config** | `src/config/pipelineConfig.ts` |

---

## Sistema de Provas e Avaliações

### 1. Banco de Provas
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/TestsPage.tsx` |
| **Hook** | `src/hooks/useProvas.ts` |
| **Tabela** | `provas` |

### 2. Editor de Provas
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/ProvaEditor.tsx` |

### 3. Aplicação de Provas
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/ProvaAplicacao.tsx` |

### 4. Questões
| Aspecto | Detalhes |
|---------|----------|
| **Hook** | `src/hooks/useQuestoes.ts` |
| **Tabela** | `questoes` |
| **Componentes** | `QuestaoCard.tsx`, `QuestaoForm.tsx`, `QuestaoAplicacao.tsx` |

### 5. Baterias de Provas
| Aspecto | Detalhes |
|---------|----------|
| **Hook** | `src/hooks/useBateriasProvas.ts` |
| **Tabelas** | `baterias_provas`, `bateria_provas_rel` |
| **Componente** | `BateriaCard.tsx` |

### 6. Resultados de Provas
| Aspecto | Detalhes |
|---------|----------|
| **Hook** | `src/hooks/useResultadosProvas.ts` |
| **Tabela** | `resultados_provas` |
| **Componente** | `ResultadoProvaView.tsx` |

### 7. Timer de Prova
| Aspecto | Detalhes |
|---------|----------|
| **Componente** | `src/components/tests/ProvaTimer.tsx` |

### 8. Filtros de Testes
| Aspecto | Detalhes |
|---------|----------|
| **Componente** | `src/components/tests/TestFilters.tsx` |

### 9. Avaliações
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/AvaliacaoForm.tsx` |
| **Hook** | `src/hooks/useAvaliacoes.ts` |
| **Componentes** | `src/components/avaliacao/` |

### 10. Configuração de Testes
| Aspecto | Detalhes |
|---------|----------|
| **Config** | `src/config/testsConfig.ts` |

---

## Inteligência Artificial

### 1. Match Score
| Aspecto | Detalhes |
|---------|----------|
| **Edge Function** | `supabase/functions/match-score/` |
| **Componentes** | `MatchScoreCalculator.tsx`, `MatchScoreCard.tsx` |
| **Diretório** | `src/components/ia/` |
| **Tabela** | `match_scores` |

### 2. Parser de Currículo
| Aspecto | Detalhes |
|---------|----------|
| **Edge Function** | `supabase/functions/parse-resume/` |
| **Componentes** | `ResumeUploader.tsx`, `ParsedResumePreview.tsx`, `ResumeEditForm.tsx` |
| **Diretório** | `src/components/ia/` |
| **Tipo** | `src/types/resumeParser.ts` |

### 3. AI Insights
| Aspecto | Detalhes |
|---------|----------|
| **Componente** | `src/components/ia/AIInsights.tsx` |

### 4. Serviço de AI
| Aspecto | Detalhes |
|---------|----------|
| **Serviço** | `src/services/aiService.ts` |

### 5. Matching Service
| Aspecto | Detalhes |
|---------|----------|
| **Serviço** | `src/services/matchingService.ts` |

---

## Comunicação

### 1. Email
| Aspecto | Detalhes |
|---------|----------|
| **Edge Function** | `supabase/functions/send-email/` |
| **Serviço** | `src/services/emailService.ts` |

### 2. WhatsApp
| Aspecto | Detalhes |
|---------|----------|
| **Edge Function** | `supabase/functions/send-whatsapp/` |
| **Serviço** | `src/services/whatsappService.ts` |

### 3. Página de Comunicação
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/ComunicacaoPage.tsx` |
| **Hook** | `src/hooks/useComunicacoes.ts` |
| **Tabela** | `comunicacoes` |

### 4. Dialog de Envio de Email
| Aspecto | Detalhes |
|---------|----------|
| **Componente** | `src/components/comunicacao/EnviarEmailDialog.tsx` |

### 5. Histórico de Comunicações
| Aspecto | Detalhes |
|---------|----------|
| **Componente** | `src/components/comunicacao/HistoricoComunicacoes.tsx` |

---

## Integrações Externas

### 1. Job Boards
| Integração | Componente | Serviço |
|------------|------------|---------|
| LinkedIn | `LinkedInConnect.tsx` | `linkedinService.ts` |
| Indeed | `IndeedConnect.tsx` | `indeedService.ts` |
| Catho | `CathoConnect.tsx` | `cathoService.ts` |
| InfoJobs | `InfoJobsConnect.tsx` | `infojobsService.ts` |
| Vagas.com | `VagasConnect.tsx` | `vagasService.ts` |

### 2. Calendário
| Integração | Componente | Serviço |
|------------|------------|---------|
| Google Calendar | `GoogleCalendarConnect.tsx` | `googleCalendarService.ts` |
| Outlook | `OutlookCalendarConnect.tsx` | `outlookService.ts` |

### 3. Comunicação Empresarial
| Integração | Componente | Serviço |
|------------|------------|---------|
| Slack | `SlackConnect.tsx` | `slackService.ts` |
| Microsoft Teams | `TeamsConnect.tsx` | `teamsService.ts` |

### 4. GitHub
| Aspecto | Detalhes |
|---------|----------|
| **Edge Function** | `supabase/functions/github-api/` |
| **Secret** | `GITHUB_PAT` |

### 5. Serviço Genérico de Job Boards
| Aspecto | Detalhes |
|---------|----------|
| **Serviço** | `src/services/jobBoardService.ts` |
| **Tipo** | `src/types/jobBoard.ts` |

---

## Analytics e Relatórios

### 1. Dashboard Principal
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/Dashboard.tsx` |
| **Hooks** | `useDashboard.ts`, `useDashboardData.ts` |
| **Componentes** | `src/components/dashboard/` |

### 2. Página de Analytics
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/AnalyticsPage.tsx` |
| **Hook** | `src/hooks/useAnalytics.ts` |

### 3. Componentes de Analytics
| Componente | Funcionalidade |
|------------|----------------|
| `AnalyticsDashboard.tsx` | Dashboard principal |
| `DiversityDashboard.tsx` | Métricas de diversidade |
| `TimeToHireChart.tsx` | Tempo para contratação |
| `PipelineVelocity.tsx` | Velocidade do pipeline |
| `SourceAnalytics.tsx` | Análise de fontes |
| `EntrevistasChart.tsx` | Gráfico de entrevistas |
| `RecruiterLeaderboard.tsx` | Ranking de recrutadores |

### 4. Relatórios
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/ReportsPage.tsx` |
| **Componentes** | `ReportBuilder.tsx`, `ReportChart.tsx`, `ReportFilters.tsx`, `ReportTable.tsx`, `ReportExport.tsx`, `ReportScheduler.tsx` |
| **Templates** | `src/components/reports/templates/` |
| **Serviço** | `src/services/reportingService.ts` |

### 5. Contexto de Analytics
| Aspecto | Detalhes |
|---------|----------|
| **Contexto** | `src/contexts/AnalyticsProvider.tsx` |

---

## Workflow e Automação

### 1. Editor de Workflow
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/WorkflowEditorPage.tsx` |
| **Componentes** | `WorkflowEditor.tsx`, `WorkflowCanvas.tsx` |
| **Diretório** | `src/components/workflow/` |

### 2. Nós de Workflow
| Aspecto | Detalhes |
|---------|----------|
| **Diretório** | `src/components/workflow/nodes/` |

### 3. Painéis de Workflow
| Aspecto | Detalhes |
|---------|----------|
| **Diretório** | `src/components/workflow/panels/` |

### 4. Engine de Workflow
| Aspecto | Detalhes |
|---------|----------|
| **Serviço** | `src/services/workflowEngine.ts` |
| **Hook** | `src/hooks/useWorkflow.ts` |
| **Tipo** | `src/types/workflow.ts` |

### 5. Auto Scheduling
| Aspecto | Detalhes |
|---------|----------|
| **Serviço** | `src/services/autoSchedulingService.ts` |

---

## Portal do Candidato

### 1. Páginas do Portal
| Página | Localização |
|--------|-------------|
| Login | `src/pages/portal/PortalLogin.tsx` |
| Dashboard | `src/pages/portal/PortalDashboard.tsx` |
| Vagas | `src/pages/portal/PortalVagas.tsx` |
| Candidatura | `src/pages/portal/PortalCandidatura.tsx` |
| Perfil | `src/pages/portal/PortalPerfil.tsx` |

### 2. Upload de Currículo
| Aspecto | Detalhes |
|---------|----------|
| **Componente** | `src/components/portal/CurriculoUpload.tsx` |

### 3. Rota Protegida do Portal
| Aspecto | Detalhes |
|---------|----------|
| **Componente** | `src/components/portal/PortalProtectedRoute.tsx` |

---

## Administração

### 1. Página Admin
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/AdminPage.tsx` |
| **Sub-páginas** | `src/pages/admin/` |

### 2. Audit Logs
| Aspecto | Detalhes |
|---------|----------|
| **Componente** | `src/components/admin/AuditLogViewer.tsx` |
| **Hook** | `src/hooks/useAuditLogs.ts` |

### 3. GDPR
| Aspecto | Detalhes |
|---------|----------|
| **Componentes** | `GDPRConsent.tsx`, `DataRetentionSettings.tsx` |
| **Serviço** | `src/services/gdprService.ts` |

### 4. SLA
| Aspecto | Detalhes |
|---------|----------|
| **Componentes** | `SLAConfig.tsx`, `SLADashboard.tsx` |

### 5. White Label
| Aspecto | Detalhes |
|---------|----------|
| **Componente** | `src/components/admin/WhiteLabelSettings.tsx` |
| **Hook** | `src/hooks/useWhiteLabel.ts` |
| **Tipo** | `src/types/whiteLabel.ts` |

### 6. Multi-Tenant
| Aspecto | Detalhes |
|---------|----------|
| **Hook** | `src/hooks/useTenant.ts` |
| **Contexto** | `src/contexts/TenantContext.tsx` |

---

## Entrevistas e Agenda

### 1. Agenda de Entrevistas
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/AgendaPage.tsx` |
| **Hook** | `src/hooks/useEntrevistas.ts`, `src/hooks/useInterviews.ts` |
| **Tabela** | `entrevistas` |
| **Componentes** | `src/components/agenda/` |

### 2. Serviço de Meeting
| Aspecto | Detalhes |
|---------|----------|
| **Serviço** | `src/services/meetingService.ts` |

---

## Indicações

### 1. Sistema de Indicações
| Aspecto | Detalhes |
|---------|----------|
| **Página** | `src/pages/IndicacoesPage.tsx` |
| **Hook** | `src/hooks/useIndicacoes.ts` |
| **Tabela** | `indicacoes` |

---

## Notificações

### 1. Sistema de Notificações
| Aspecto | Detalhes |
|---------|----------|
| **Contexto** | `src/contexts/NotificationContext.tsx` |
| **Hook** | `src/hooks/useRealtimeNotifications.ts` |
| **Tabela** | `notifications` |
| **Componentes** | `src/components/notifications/` |

### 2. Push Notifications
| Aspecto | Detalhes |
|---------|----------|
| **Hook** | `src/hooks/usePushNotifications.ts` |

---

## Acessibilidade

### 1. Componentes A11y
| Componente | Funcionalidade |
|------------|----------------|
| `LiveRegion.tsx` | Anúncios para screen readers |
| `SkipLinks.tsx` | Links para navegação rápida |
| `VisuallyHidden.tsx` | Conteúdo visível apenas para screen readers |

### 2. Hooks de Acessibilidade
| Hook | Funcionalidade |
|------|----------------|
| `useAnnounce.ts` | Anúncios ARIA |
| `useFocusTrap.ts` | Trap de foco em modais |
| `useReducedMotion.ts` | Detecta preferência de movimento reduzido |

### 3. Utilitários de Acessibilidade
| Aspecto | Detalhes |
|---------|----------|
| **Biblioteca** | `src/lib/accessibilityUtils.ts` |

---

## Edge Functions (Backend)

| Função | Endpoint | Propósito |
|--------|----------|-----------|
| `match-score` | `POST /functions/v1/match-score` | Cálculo de match score com IA |
| `parse-resume` | `POST /functions/v1/parse-resume` | Parser de currículo com IA |
| `send-email` | `POST /functions/v1/send-email` | Envio de emails |
| `send-whatsapp` | `POST /functions/v1/send-whatsapp` | Envio de WhatsApp |
| `ip-guard` | `POST /functions/v1/ip-guard` | Verificação de IP |
| `github-api` | `POST /functions/v1/github-api` | Integração GitHub |
| `health` | `GET /functions/v1/health` | Health check |

---

## Hooks Customizados

### Data Fetching Hooks
| Hook | Propósito |
|------|-----------|
| `useCandidatos` | CRUD de candidatos |
| `useCandidates` | Candidatos (alternativo) |
| `useCandidatoPerfil` | Perfil detalhado |
| `useCandidaturas` | Candidaturas |
| `useVagas` | CRUD de vagas |
| `useJobs` | Vagas (alternativo) |
| `useEntrevistas` | Entrevistas |
| `useInterviews` | Entrevistas (alternativo) |
| `useProcessosSeletivos` | Processos seletivos |
| `useProcessos` | Processos (alternativo) |
| `useProvas` | Provas |
| `useQuestoes` | Questões |
| `useBateriasProvas` | Baterias de provas |
| `useResultadosProvas` | Resultados de provas |
| `useIndicacoes` | Indicações |
| `useComunicacoes` | Comunicações |
| `useMatchScores` | Match scores |
| `useProfiles` | Perfis de usuários |
| `useAvaliacoes` | Avaliações |
| `useHistoricoEtapas` | Histórico de etapas |
| `useDashboard` | Dados do dashboard |
| `useDashboardData` | Dados do dashboard (alternativo) |
| `useAnalytics` | Dados de analytics |
| `useAuditLogs` | Logs de auditoria |
| `useTalentPool` | Talent pool |
| `useViews` | Views customizadas |
| `useScorecard` | Scorecard de avaliação |

### UI/UX Hooks
| Hook | Propósito |
|------|-----------|
| `useDebounce` | Debounce de valores |
| `useDocumentTitle` | Título do documento |
| `usePageTitle` | Título da página |
| `useMobile` | Detecção mobile |
| `useToast` | Toasts/notificações |
| `useOnboarding` | Onboarding de usuários |
| `useAdvancedSearch` | Busca avançada |
| `useBulkActions` | Ações em massa |
| `useBulkSelection` | Seleção em massa |

### Security Hooks
| Hook | Propósito |
|------|-----------|
| `useAuth` | Autenticação principal |
| `use2FA` | Two-factor authentication |
| `useIPVerification` | Verificação de IP |
| `useSessionTimeout` | Timeout de sessão |
| `usePermissions` | Permissões de usuário |

### Feature Hooks
| Hook | Propósito |
|------|-----------|
| `useWorkflow` | Workflow automation |
| `useWhiteLabel` | White label settings |
| `useTenant` | Multi-tenancy |
| `useRealtimeNotifications` | Notificações realtime |
| `usePushNotifications` | Push notifications |

### Accessibility Hooks
| Hook | Propósito |
|------|-----------|
| `useAnnounce` | ARIA announcements |
| `useFocusTrap` | Focus trap |
| `useReducedMotion` | Reduced motion preference |

---

## Serviços

| Serviço | Propósito |
|---------|-----------|
| `aiService.ts` | Integração com IA |
| `autoSchedulingService.ts` | Agendamento automático |
| `cacheService.ts` | Cache de dados |
| `cathoService.ts` | Integração Catho |
| `emailService.ts` | Envio de emails |
| `exportService.ts` | Exportação de dados |
| `gdprService.ts` | Conformidade GDPR |
| `googleCalendarService.ts` | Integração Google Calendar |
| `importService.ts` | Importação de dados |
| `indeedService.ts` | Integração Indeed |
| `infojobsService.ts` | Integração InfoJobs |
| `ipService.ts` | Verificação de IP |
| `jobBoardService.ts` | Job boards genérico |
| `linkedinService.ts` | Integração LinkedIn |
| `logger.ts` | Logging |
| `matchingService.ts` | Matching de candidatos |
| `meetingService.ts` | Gerenciamento de meetings |
| `outlookService.ts` | Integração Outlook |
| `reportingService.ts` | Geração de relatórios |
| `slackService.ts` | Integração Slack |
| `teamsService.ts` | Integração Teams |
| `vagasService.ts` | Integração Vagas.com |
| `whatsappService.ts` | Envio de WhatsApp |
| `workflowEngine.ts` | Engine de workflow |

---

## Utilitários e Bibliotecas

### Core Utilities (`src/lib/`)
| Arquivo | Propósito |
|---------|-----------|
| `accessibilityUtils.ts` | Utilitários de acessibilidade |
| `apiClient.ts` | Cliente HTTP |
| `constants.ts` | Constantes globais |
| `dateUtils.ts` | Manipulação de datas |
| `errorHandler.ts` | Tratamento de erros |
| `export.ts` | Funções de exportação |
| `featureFlags.ts` | Feature flags |
| `formatters.ts` | Formatação de dados |
| `performance.ts` | Métricas de performance |
| `queryConfig.ts` | Configuração React Query |
| `rateLimit.ts` | Rate limiting |
| `sanitize.ts` | Sanitização de dados |
| `schemas.ts` | Schemas Zod |
| `securityHeaders.ts` | Headers de segurança |
| `sentry.ts` | Integração Sentry |
| `storageUtils.ts` | Utilitários de storage |
| `utils.ts` | Utilitários gerais |
| `validateUpload.ts` | Validação de upload |
| `validators.ts` | Validadores |

### Formatters (`src/utils/`)
| Arquivo | Propósito |
|---------|-----------|
| `formatters.ts` | Formatação de dados |
| `validators.ts` | Validadores |
| `test-utils.tsx` | Utilitários de teste |

---

## Tipos TypeScript

| Arquivo | Propósito |
|---------|-----------|
| `api.ts` | Tipos de API |
| `forms.ts` | Tipos de formulários |
| `jobBoard.ts` | Tipos de job boards |
| `recruitment.ts` | Tipos de recrutamento |
| `resumeParser.ts` | Tipos do parser de currículo |
| `tests.ts` | Tipos de testes/provas |
| `whiteLabel.ts` | Tipos de white label |
| `workflow.ts` | Tipos de workflow |

---

## Banco de Dados (Supabase)

### Tabelas Principais
| Tabela | Propósito |
|--------|-----------|
| `candidatos` | Cadastro de candidatos |
| `candidatos_auth` | Autenticação de candidatos |
| `candidaturas` | Candidaturas a vagas |
| `vagas` | Cadastro de vagas |
| `processos_seletivos` | Processos seletivos |
| `entrevistas` | Agendamento de entrevistas |
| `provas` | Banco de provas |
| `questoes` | Questões das provas |
| `baterias_provas` | Baterias de provas |
| `bateria_provas_rel` | Relação bateria-prova |
| `resultados_provas` | Resultados das provas |
| `indicacoes` | Indicações de candidatos |
| `comunicacoes` | Histórico de comunicações |
| `match_scores` | Scores de matching |
| `notifications` | Notificações |
| `profiles` | Perfis de usuários |
| `user_roles` | Papéis de usuários |

### Storage Buckets
| Bucket | Propósito |
|--------|-----------|
| `curriculos` | Armazenamento de currículos |

---

## Internacionalização

| Aspecto | Detalhes |
|---------|----------|
| **Biblioteca** | i18next + react-i18next |
| **Diretório** | `src/i18n/` |
| **Idiomas** | Português (padrão) |

---

## Testes

| Tipo | Ferramenta | Diretório |
|------|------------|-----------|
| Unit Tests | Vitest | `*.test.ts`, `*.test.tsx` |
| Component Tests | Vitest + Testing Library | `*.test.tsx` |
| Stories | Storybook | `*.stories.tsx` |
| Mocks | MSW | `src/mocks/` |
| Test Utils | Custom | `src/test/`, `src/utils/test-utils.tsx` |

---

## Documentação

| Arquivo | Propósito |
|---------|-----------|
| `docs/ARCHITECTURE.md` | Arquitetura do sistema |
| `docs/API.md` | Documentação da API |
| `docs/DATABASE.md` | Schema do banco de dados |
| `docs/ADR.md` | Decisões arquiteturais |
| `docs/GLOSSARY.md` | Glossário de termos |
| `docs/IP_WHITELIST.md` | Documentação de IP Whitelist |
| `CHANGELOG.md` | Log de mudanças |
| `.github/SECURITY.md` | Política de segurança |

---

## CI/CD e DevOps

| Aspecto | Detalhes |
|---------|----------|
| **CI/CD** | GitHub Actions |
| **Hosting** | Lovable (Vercel-like) |
| **Backend** | Lovable Cloud (Supabase) |
| **Monitoring** | Sentry, Web Vitals, Vercel Speed Insights |

---

## Resumo Quantitativo

| Categoria | Quantidade |
|-----------|------------|
| **Páginas** | ~30 |
| **Componentes** | ~100+ |
| **Hooks** | ~50+ |
| **Serviços** | ~20 |
| **Edge Functions** | 7 |
| **Tabelas no Banco** | 17 |
| **Tipos TypeScript** | 8 arquivos |
| **Testes Unitários** | 50+ arquivos |
| **Stories (Storybook)** | 30+ |
