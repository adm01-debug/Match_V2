# 📦 Inventário Completo do Projeto Match ATS

> Análise exaustiva do repositório - Última atualização: Janeiro 2025
> Construído em parceria: Claude (Anthropic) + Lovable

---

## 📊 Resumo Estatístico

| Categoria | Quantidade |
|-----------|------------|
| **Componentes React** | ~150+ |
| **Hooks Customizados** | 33 |
| **Páginas** | 29 |
| **Serviços** | 5 |
| **Edge Functions** | 12 |
| **Testes E2E** | 55 |
| **Documentação** | 35+ arquivos |
| **GitHub Workflows** | 31 |

---

## 🗂️ Estrutura Raiz do Projeto

```
match-ats/
├── .github/              # CI/CD, Templates, Workflows
├── .husky/               # Git Hooks
├── .storybook/           # Configuração Storybook
├── docs/                 # Documentação completa
├── e2e/                  # Testes E2E (Playwright)
├── grafana/              # Dashboards de monitoramento
├── k8s/                  # Manifests Kubernetes
├── public/               # Assets estáticos
├── scripts/              # Scripts de automação
├── src/                  # Código fonte principal
├── supabase/             # Backend (Functions + Migrations)
├── terraform/            # Infraestrutura como código
└── [arquivos de config]  # Configs do projeto
```

---

## 📁 ARQUIVOS DE CONFIGURAÇÃO (Raiz)

### Build & Development
| Arquivo | Função |
|---------|--------|
| `vite.config.ts` | Configuração Vite (bundler) |
| `tsconfig.json` | Configuração TypeScript principal |
| `tsconfig.app.json` | TS config para aplicação |
| `tsconfig.node.json` | TS config para Node |
| `tsconfig.build.json` | TS config para build |
| `tailwind.config.ts` | Design system Tailwind |
| `postcss.config.js` | Processamento CSS |
| `vitest.config.ts` | Configuração testes unitários |
| `vitest.workspace.ts` | Workspace de testes |
| `playwright.config.ts` | Configuração testes E2E |

### Linting & Formatting
| Arquivo | Função |
|---------|--------|
| `eslint.config.js` | Config ESLint moderno |
| `.prettierrc` | Formatação código |
| `.prettierignore` | Ignorar formatação |
| `.editorconfig` | Consistência IDE |
| `commitlint.config.js` | Validação commits |
| `lint-staged.config.js` | Config lint-staged |

### Docker & Deploy
| Arquivo | Função |
|---------|--------|
| `Dockerfile` | Imagem Docker desenvolvimento |
| `Dockerfile.prod` | Imagem Docker produção |
| `docker-compose.yaml` | Orquestração containers principal |
| `docker-compose.override.yml` | Overrides locais |
| `docker-compose.prod.yml` | Compose produção |
| `.dockerignore` | Exclusões Docker |
| `nginx.conf` | Configuração Nginx |

### Monitoramento & Performance
| Arquivo | Função |
|---------|--------|
| `prometheus.yml` | Coleta de métricas |
| `lighthouse.config.js` | Auditorias Lighthouse |
| `bundle-analyzer.config.js` | Análise de bundle |
| `.bundlewatch.config.json` | Monitoramento bundle size |
| `.sentryclirc` | Configuração Sentry |

### Dependências & Package
| Arquivo | Função |
|---------|--------|
| `package.json` | Dependências NPM |
| `package-lock.json` | Lock de versões |
| `bun.lock` / `bun.lockb` | Lock files Bun |
| `.npmrc` | Configuração NPM |
| `.nvmrc` | Versão Node |

### Outros
| Arquivo | Função |
|---------|--------|
| `index.html` | Ponto de entrada HTML |
| `components.json` | Configuração shadcn/ui |
| `openapi.yaml` | Especificação API OpenAPI |
| `Makefile` | Comandos make |
| `.env.example` | Template variáveis ambiente |
| `.gitattributes` | Atributos Git |

### Documentação Raiz
| Arquivo | Função |
|---------|--------|
| `README.md` | Documentação principal |
| `CHANGELOG.md` | Histórico de mudanças |
| `CONTRIBUTING.md` | Guia de contribuição |
| `CODE_OF_CONDUCT.md` | Código de conduta |
| `LICENSE` | Licença do projeto |
| `SECURITY.md` | Política de segurança |

---

## 📁 DIRETÓRIO: src/

### src/components/ (150+ componentes)

#### 📂 src/components/ui/ (56 componentes - shadcn/ui)
| Componente | Função |
|------------|--------|
| `accordion.tsx` | Acordeão expansível |
| `alert-dialog.tsx` | Diálogos de alerta |
| `alert.tsx` | Mensagens de alerta |
| `aspect-ratio.tsx` | Ratio de aspecto |
| `avatar.tsx` | Avatares |
| `badge.tsx` | Badges/etiquetas |
| `breadcrumb.tsx` | Navegação breadcrumb |
| `button.tsx` | Botões estilizados |
| `calendar.tsx` | Calendário |
| `card.tsx` | Cards |
| `carousel.tsx` | Carrossel |
| `chart.tsx` | Gráficos base |
| `checkbox.tsx` | Checkboxes |
| `collapsible.tsx` | Seções colapsáveis |
| `command.tsx` | Command palette |
| `context-menu.tsx` | Menu de contexto |
| `contextual-loader.tsx` | Loader contextual |
| `dialog.tsx` | Modais/diálogos |
| `drawer.tsx` | Drawer lateral |
| `dropdown-menu.tsx` | Dropdowns |
| `form.tsx` | Formulários com RHF |
| `haptic-feedback.tsx` | Feedback tátil |
| `hover-card.tsx` | Cards em hover |
| `info-tooltip.tsx` | Tooltip informativo |
| `input-otp.tsx` | Input OTP/2FA |
| `input.tsx` | Inputs de texto |
| `label.tsx` | Labels |
| `match-score-badge.tsx` | Badge score match |
| `menubar.tsx` | Barra de menu |
| `navigation-menu.tsx` | Menu navegação |
| `pagination.tsx` | Paginação |
| `password-input.tsx` | Input senha seguro |
| `popover.tsx` | Popovers |
| `premium-skeleton.tsx` | Skeleton premium |
| `priority-badge.tsx` | Badge prioridade |
| `progress.tsx` | Barra progresso |
| `radio-group.tsx` | Radio buttons |
| `resizable.tsx` | Painéis redimensionáveis |
| `scroll-area.tsx` | Área de scroll |
| `select.tsx` | Selects |
| `separator.tsx` | Separadores |
| `sheet.tsx` | Sheet/drawer |
| `sidebar.tsx` | Sidebar navegação |
| `skeleton.tsx` | Loading skeletons |
| `slider.tsx` | Sliders |
| `sonner.tsx` | Toast notifications |
| `status-badge.tsx` | Badge de status |
| `switch.tsx` | Toggle switches |
| `table.tsx` | Tabelas |
| `tabs.tsx` | Abas |
| `textarea.tsx` | Áreas de texto |
| `toast.tsx` | Toasts |
| `toaster.tsx` | Container toasts |
| `toggle-group.tsx` | Grupos toggle |
| `toggle.tsx` | Toggles |
| `tooltip.tsx` | Tooltips |

#### 📂 src/components/auth/ (15 componentes)
| Componente | Função |
|------------|--------|
| `LoginLockoutAlert.tsx` | Alerta bloqueio login |
| `MFAMethodSelector.tsx` | Seletor método MFA |
| `MFASMSSetup.tsx` | Setup MFA via SMS |
| `NewDeviceAlert.tsx` | Alerta novo dispositivo |
| `NewDeviceDetector.tsx` | Detector dispositivos |
| `PasswordResetRequestForm.tsx` | Formulário reset senha |
| `PasswordStrengthIndicator.tsx` | Indicador força senha |
| `ProtectedRoute.tsx` | Rotas protegidas |
| `QRCodeGenerator.tsx` | Gerador QR Code 2FA |
| `ReauthDialog.tsx` | Diálogo reautenticação |
| `RecoveryCodesDisplay.tsx` | Códigos recuperação |
| `SessionManager.tsx` | Gerenciador sessões |
| `TrustedDevicesManager.tsx` | Dispositivos confiáveis |
| `TwoFactorSetup.tsx` | Setup 2FA |
| `TwoFactorVerify.tsx` | Verificação 2FA |

#### 📂 src/components/dashboard/ (11 componentes)
| Componente | Função |
|------------|--------|
| `AcoesPendentes.tsx` | Ações pendentes |
| `AcoesRapidas.tsx` | Ações rápidas |
| `AgendaHoje.tsx` | Agenda do dia |
| `AlertasInteligentes.tsx` | Alertas IA |
| `EntrevistasChart.tsx` | Gráfico entrevistas |
| `EntrevistasStats.tsx` | Estatísticas entrevistas |
| `FunilChart.tsx` | Gráfico funil |
| `KPICard.tsx` | Cards de KPI |
| `SmartInsights.tsx` | Insights inteligentes |
| `TopCandidatos.tsx` | Top candidatos |
| `VagasUrgentes.tsx` | Vagas urgentes |

#### 📂 src/components/candidatos/ (7 componentes)
| Componente | Função |
|------------|--------|
| `AIMatchInsights.tsx` | Insights IA de match |
| `CandidateTimeline.tsx` | Timeline candidato |
| `CandidatosToolbar.tsx` | Toolbar candidatos |
| `ComunicacaoHistorico.tsx` | Histórico comunicação |
| `MatchScoreCalculator.tsx` | Calculadora match |
| `MatchScoreCard.tsx` | Card score match |
| `ResumeParser.tsx` | Parser currículos |

#### 📂 src/components/candidato/ (9 componentes)
| Componente | Função |
|------------|--------|
| `AvaliacoesTab.tsx` | Aba avaliações |
| `ComunicacaoTab.tsx` | Aba comunicação |
| `CurriculoTab.tsx` | Aba currículo |
| `DocumentosTab.tsx` | Aba documentos |
| `ExperienciaTab.tsx` | Aba experiência |
| `FormacaoTab.tsx` | Aba formação |
| `HistoricoTab.tsx` | Aba histórico |
| `NotasTab.tsx` | Aba notas |
| `PerfilHeader.tsx` | Header do perfil |

#### 📂 src/components/vagas/ (4 componentes)
| Componente | Função |
|------------|--------|
| `JobPublisher.tsx` | Publicador vagas |
| `JobTemplates.tsx` | Templates de vagas |
| `MultiChannelJobPublisher.tsx` | Publicador multi-canal |
| `VagaCard.tsx` | Card de vaga |

#### 📂 src/components/agenda/ (8 componentes)
| Componente | Função |
|------------|--------|
| `AIInterviewScheduler.tsx` | Agendador IA |
| `AgendarEntrevistaDialog.tsx` | Agendar entrevista |
| `DayView.tsx` | Visão diária |
| `EntrevistaCard.tsx` | Card entrevista |
| `EntrevistaDetalhesDialog.tsx` | Detalhes entrevista |
| `GoogleCalendarExport.tsx` | Export Google Cal |
| `InterviewReminderButton.tsx` | Botão lembrete |
| `WeekView.tsx` | Visão semanal |

#### 📂 src/components/pipeline/ (2 componentes)
| Componente | Função |
|------------|--------|
| `CandidatoKanbanCard.tsx` | Card Kanban |
| `PipelineColumn.tsx` | Coluna Kanban |

#### 📂 src/components/tests/ (9 componentes)
| Componente | Função |
|------------|--------|
| `BateriaCard.tsx` | Card bateria provas |
| `CategoriaCard.tsx` | Card categoria |
| `ProvaCard.tsx` | Card prova |
| `ProvaTimer.tsx` | Timer prova |
| `QuestaoAplicacao.tsx` | Questão em aplicação |
| `QuestaoCard.tsx` | Card questão |
| `QuestaoForm.tsx` | Formulário questão |
| `ResultadoProvaView.tsx` | Resultado prova |
| `TestFilters.tsx` | Filtros testes |

#### 📂 src/components/comunicacao/ (2 componentes)
| Componente | Função |
|------------|--------|
| `EnviarEmailDialog.tsx` | Enviar email |
| `HistoricoComunicacoes.tsx` | Histórico comunicações |

#### 📂 src/components/security/ (8 componentes)
| Componente | Função |
|------------|--------|
| `ActiveSessionsPanel.tsx` | Sessões ativas |
| `BlockedIPsPanel.tsx` | IPs bloqueados |
| `IPGuard.tsx` | Guard de IP |
| `IPWhitelistPanel.tsx` | Whitelist IPs |
| `PasskeyManager.tsx` | Gerenciador Passkeys |
| `PushNotificationSettings.tsx` | Config push |
| `SecurityActivityLog.tsx` | Log atividades |
| `index.ts` | Exports |

#### 📂 src/components/common/ (12 componentes)
| Componente | Função |
|------------|--------|
| `BulkProgressModal.tsx` | Modal progresso bulk |
| `CommandMenu.tsx` | Menu comandos (⌘K) |
| `CommandMenuTrigger.tsx` | Trigger comando |
| `ConfirmDialog.tsx` | Diálogo confirmação |
| `EmptyState.tsx` | Estado vazio |
| `LazyLoad.tsx` | Lazy loading |
| `LoadingOverlay.tsx` | Overlay loading |
| `LoadingSkeleton.tsx` | Skeleton loading |
| `PageSuspense.tsx` | Suspense páginas |
| `ThemeToggle.tsx` | Toggle tema |
| `VirtualList.tsx` | Lista virtualizada |
| `index.ts` | Exports |

#### 📂 src/components/layout/ (4 componentes)
| Componente | Função |
|------------|--------|
| `AnimatedRoutes.tsx` | Rotas animadas |
| `AppSidebar.tsx` | Sidebar principal |
| `Layout.tsx` | Layout base |
| `MainLayout.tsx` | Layout principal |

#### 📂 src/components/portal/ (2 componentes)
| Componente | Função |
|------------|--------|
| `CurriculoUpload.tsx` | Upload currículo |
| `PortalProtectedRoute.tsx` | Rota protegida portal |

#### 📂 src/components/notifications/ (1 componente)
| Componente | Função |
|------------|--------|
| `NotificationPanel.tsx` | Painel notificações |

#### 📂 src/components/search/ (1 componente)
| Componente | Função |
|------------|--------|
| `AdvancedFilters.tsx` | Filtros avançados |

#### 📂 src/components/onboarding/ (2 componentes)
| Componente | Função |
|------------|--------|
| `OnboardingProvider.tsx` | Provider onboarding |
| `OnboardingTour.tsx` | Tour guiado |

#### 📂 src/components/settings/ (2 componentes)
| Componente | Função |
|------------|--------|
| `GoogleCalendarConnect.tsx` | Conectar Google Calendar |
| `SoundSettingsCard.tsx` | Configurações de som |

#### 📂 src/components/navigation/ (2 componentes)
| Componente | Função |
|------------|--------|
| `BottomNavigation.tsx` | Navegação inferior |
| `SmartBreadcrumbs.tsx` | Breadcrumbs inteligentes |

#### 📂 src/components/a11y/ (8 componentes)
| Componente | Função |
|------------|--------|
| `FocusRing.tsx` | Anel de foco |
| `HighContrastMode.tsx` | Modo alto contraste |
| `LiveRegion.tsx` | Região ARIA live |
| `ReducedMotion.tsx` | Movimento reduzido |
| `ScreenReaderAnnounce.tsx` | Anúncios screen reader |
| `SkipLinks.tsx` | Skip links |
| `VisuallyHidden.tsx` | Texto oculto visual |
| `index.ts` | Exports |

#### 📂 src/components/assessments/ (4 componentes)
| Componente | Função |
|------------|--------|
| `AssessmentPlayer.tsx` | Player assessments |
| `CulturalResultView.tsx` | Resultado cultural |
| `DISCResultView.tsx` | Resultado DISC |
| `index.ts` | Exports |

#### 📂 src/components/gamification/ (8 componentes)
| Componente | Função |
|------------|--------|
| `AchievementBadge.tsx` | Badge conquista |
| `AchievementNotification.tsx` | Notificação conquista |
| `GamificationDashboard.tsx` | Dashboard gamificação |
| `GamificationWidget.tsx` | Widget gamificação |
| `Leaderboard.tsx` | Ranking |
| `ProgressRing.tsx` | Anel progresso |
| `StreakDisplay.tsx` | Display sequência |
| `index.ts` | Exports |

#### 📂 src/components/intelligence/ (5 componentes)
| Componente | Função |
|------------|--------|
| `ContextualHelp.tsx` | Ajuda contextual |
| `KeyboardShortcuts.tsx` | Atalhos teclado |
| `RecentActions.tsx` | Ações recentes |
| `SmartSuggestions.tsx` | Sugestões inteligentes |
| `index.ts` | Exports |

#### 📂 src/components/mobile/ (5 componentes)
| Componente | Função |
|------------|--------|
| `BottomSheet.tsx` | Bottom sheet |
| `GestureNavigation.tsx` | Navegação por gestos |
| `PullToRefresh.tsx` | Pull to refresh |
| `SwipeActions.tsx` | Ações de swipe |
| `index.ts` | Exports |

#### 📂 src/components/visualization/ (5 componentes)
| Componente | Função |
|------------|--------|
| `AnimatedCharts.tsx` | Gráficos animados |
| `Heatmap.tsx` | Mapa de calor |
| `Sparkline.tsx` | Sparklines |
| `TrendIndicators.tsx` | Indicadores tendência |
| `index.ts` | Exports |

#### 📂 src/components/empty-states/ (8 componentes)
| Componente | Função |
|------------|--------|
| `AgendaEmptyState.tsx` | Empty state agenda |
| `CandidatosEmptyState.tsx` | Empty state candidatos |
| `EmptyStateCard.tsx` | Card empty state |
| `IndicacoesEmptyState.tsx` | Empty state indicações |
| `PipelineEmptyState.tsx` | Empty state pipeline |
| `TestsEmptyState.tsx` | Empty state testes |
| `VagasEmptyState.tsx` | Empty state vagas |
| `index.ts` | Exports |

#### Componentes Raiz (src/components/)
| Arquivo | Função |
|---------|--------|
| `BulkActionsBar.tsx` | Barra ações em massa |
| `DataImporter.tsx` | Importador dados |
| `ErrorBoundary.tsx` | Boundary de erros |
| `SavedFiltersDropdown.tsx` | Dropdown filtros salvos |
| `SearchInput.tsx` | Input de busca |
| `index.ts` | Exports |

---

### 📂 src/pages/ (29 páginas)

| Página | Rota | Função |
|--------|------|--------|
| `Dashboard.tsx` | `/` | Painel principal |
| `AdminPage.tsx` | `/admin` | Administração |
| `AdvancedAnalyticsPage.tsx` | `/analytics/advanced` | Analytics avançado |
| `AgendaPage.tsx` | `/agenda` | Agendamentos |
| `AnalyticsPage.tsx` | `/analytics` | Analytics |
| `AuthPage.tsx` | `/auth` | Autenticação |
| `AvaliacaoForm.tsx` | `/avaliacao/:id` | Formulário avaliação |
| `CandidatoPerfilPage.tsx` | `/candidatos/:id` | Perfil candidato |
| `CandidatosPage.tsx` | `/candidatos` | Lista candidatos |
| `ComunicacaoPage.tsx` | `/comunicacao` | Comunicações |
| `DiagnosticoPage.tsx` | `/diagnostico` | Diagnóstico sistema |
| `EdgeFunctionTestPage.tsx` | `/edge-test` | Teste edge functions |
| `GamificationPage.tsx` | `/gamification` | Gamificação |
| `HiringManagerPortalPage.tsx` | `/hiring-manager` | Portal gestor |
| `IndicacoesPage.tsx` | `/indicacoes` | Indicações |
| `NotFound.tsx` | `*` | 404 |
| `OfferManagementPage.tsx` | `/ofertas` | Gestão ofertas |
| `Pipeline.tsx` | `/pipeline` | Pipeline Kanban |
| `ProvaAplicacao.tsx` | `/testes/:id/aplicar` | Aplicação prova |
| `ProvaEditor.tsx` | `/testes/nova`, `/testes/:id/editar` | Editor provas |
| `ResumeParserPage.tsx` | `/parser-curriculo` | Parser currículos |
| `TestsPage.tsx` | `/testes` | Gestão testes |
| `VagaDetalhes.tsx` | `/vagas/:id` | Detalhes vaga |
| `VagaForm.tsx` | `/vagas/nova` | Formulário vaga |
| `VagasList.tsx` | `/vagas` | Lista vagas |

#### src/pages/auth/ (5 páginas)
| Página | Rota | Função |
|--------|------|--------|
| `ForgotPasswordPage.tsx` | `/auth/forgot-password` | Esqueci senha |
| `LoginPage.tsx` | `/auth/login` | Login |
| `RegisterPage.tsx` | `/auth/register` | Registro |
| `ResetPasswordPage.tsx` | `/auth/reset-password` | Reset senha |
| `TwoFactorAuthPage.tsx` | `/auth/2fa` | Verificação 2FA |

#### src/pages/portal/ (4 páginas)
| Página | Rota | Função |
|--------|------|--------|
| `PortalAuthPage.tsx` | `/portal/auth` | Auth portal |
| `PortalDashboard.tsx` | `/portal/dashboard` | Dashboard portal |
| `PortalPerfil.tsx` | `/portal/perfil` | Perfil candidato |
| `PortalVagas.tsx` | `/portal/vagas` | Vagas portal |

#### src/pages/security/ (2 páginas)
| Página | Rota | Função |
|--------|------|--------|
| `RateLimitDashboard.tsx` | `/security/rate-limit` | Dashboard rate limit |
| `RolesPage.tsx` | `/security/roles` | Gestão roles |

#### src/pages/settings/ (1 página)
| Página | Rota | Função |
|--------|------|--------|
| `SecuritySettingsPage.tsx` | `/settings/security` | Configurações segurança |

---

### 📂 src/hooks/ (33 hooks)

| Hook | Função |
|------|--------|
| `use-mobile.tsx` | Detectar mobile |
| `use-toast.ts` | Toast notifications |
| `use2FA.ts` | Two-factor auth |
| `useAssessments.ts` | Assessments |
| `useAvaliacoes.ts` | Avaliações |
| `useBulkActions.ts` | Ações em massa |
| `useCandidatoPerfil.ts` | Perfil candidato |
| `useCandidatos.ts` | Lista candidatos |
| `useComunicacoes.ts` | Comunicações |
| `useDashboardData.ts` | Dados dashboard |
| `useDebounce.ts` | Debounce |
| `useEntrevistas.ts` | Entrevistas |
| `useIPVerification.ts` | Verificação IP |
| `useImportData.ts` | Importação dados |
| `useIntersectionObserver.ts` | Intersection observer |
| `useInterviewReminders.ts` | Lembretes entrevista |
| `useNewDeviceDetection.ts` | Detecção dispositivo |
| `useOnboarding.ts` | Onboarding |
| `usePageTitle.ts` | Título página |
| `usePasswordBreachCheck.ts` | Verificar vazamento senha |
| `useProcessosSeletivos.ts` | Processos seletivos |
| `useProvas.ts` | Provas/testes |
| `usePushNotifications.ts` | Push notifications |
| `useRealtimeNotifications.ts` | Notificações realtime |
| `useReauth.ts` | Reautenticação |
| `useSavedFilters.ts` | Filtros salvos |
| `useSessionTimeout.ts` | Timeout sessão |
| `useSoundPreferences.ts` | Preferências som |
| `useTrustedDevices.ts` | Dispositivos confiáveis |
| `useVagas.ts` | Vagas |
| `useVirtualScroll.ts` | Virtual scroll |
| `useWebAuthn.ts` | WebAuthn/Passkeys |
| `index.ts` | Exports |

---

### 📂 src/services/ (5 serviços)

| Serviço | Função |
|---------|--------|
| `ipService.ts` | Serviço de IP |
| `logger.ts` | Logger centralizado |
| `passwordBreachService.ts` | Verificar vazamentos |
| `passwordResetService.ts` | Reset de senha |
| `index.ts` | Exports |

---

### 📂 src/contexts/ (5 contextos)

| Contexto | Função |
|----------|--------|
| `AnalyticsProvider.tsx` | Provider analytics |
| `AuthContext.tsx` | Contexto autenticação |
| `CandidatoAuthContext.tsx` | Auth candidato portal |
| `NotificationContext.tsx` | Contexto notificações |
| `index.ts` | Exports |

---

### 📂 src/lib/ (11 utilitários)

| Arquivo | Função |
|---------|--------|
| `apiClient.ts` | Cliente API |
| `constants.ts` | Constantes |
| `dateUtils.ts` | Utilitários data |
| `deviceFingerprint.ts` | Fingerprint dispositivo |
| `errorHandler.ts` | Handler erros |
| `excelImporter.ts` | Importador Excel |
| `matchSchemas.ts` | Schemas de match |
| `queryConfig.ts` | Config React Query |
| `storageUtils.ts` | Utilitários storage |
| `utils.ts` | Utilitários gerais |
| `index.ts` | Exports |

---

### 📂 src/config/ (4 arquivos)

| Arquivo | Função |
|---------|--------|
| `ipWhitelist.ts` | Config whitelist IP |
| `pipelineConfig.ts` | Config pipeline |
| `testsConfig.ts` | Config testes |
| `index.ts` | Exports |

---

### 📂 src/constants/ (3 arquivos)

| Arquivo | Função |
|---------|--------|
| `queryKeys.ts` | Chaves React Query |
| `routes.ts` | Rotas da aplicação |
| `index.ts` | Exports |

---

### 📂 src/types/ (8 arquivos)

| Arquivo | Função |
|---------|--------|
| `api.ts` | Tipos API |
| `forms.ts` | Tipos formulários |
| `jobBoard.ts` | Tipos job board |
| `recruitment.ts` | Tipos recrutamento |
| `resumeParser.ts` | Tipos parser |
| `selection.ts` | Tipos seleção |
| `tests.ts` | Tipos testes |
| `index.ts` | Exports |

---

### 📂 src/data/ (4 arquivos)

| Arquivo | Função |
|---------|--------|
| `agendaData.ts` | Dados agenda mock |
| `avaliacaoData.ts` | Dados avaliação mock |
| `candidatoPerfilData.ts` | Dados perfil mock |
| `emailTemplatesData.ts` | Templates email |

---

## 📁 DIRETÓRIO: supabase/

### Edge Functions (12 funções)

| Função | Caminho | Propósito |
|--------|---------|-----------|
| `generate-scorecard` | `/supabase/functions/generate-scorecard/` | Gerar scorecard |
| `geo-check` | `/supabase/functions/geo-check/` | Verificação geográfica |
| `github-api` | `/supabase/functions/github-api/` | Integração GitHub |
| `health` | `/supabase/functions/health/` | Health check |
| `interview-reminders` | `/supabase/functions/interview-reminders/` | Lembretes entrevista |
| `ip-guard` | `/supabase/functions/ip-guard/` | Verificação IP |
| `match-score` | `/supabase/functions/match-score/` | Calcular match score |
| `new-device-alert` | `/supabase/functions/new-device-alert/` | Alerta novo dispositivo |
| `parse-resume` | `/supabase/functions/parse-resume/` | Parser currículo |
| `password-reset-approval` | `/supabase/functions/password-reset-approval/` | Aprovação reset senha |
| `send-email` | `/supabase/functions/send-email/` | Enviar email |
| `send-whatsapp` | `/supabase/functions/send-whatsapp/` | Enviar WhatsApp |

---

## 📁 DIRETÓRIO: .github/

### Workflows (36 workflows)

| Workflow | Arquivo | Função |
|----------|---------|--------|
| Accessibility | `a11y.yml` | Testes a11y |
| Auto Assign | `auto-assign.yml` | Auto-assign PRs |
| Bundle Size | `bundle-size.yml` | Monitor bundle |
| Changelog | `changelog.yml` | Gerar changelog |
| Chromatic | `chromatic.yml` | Visual testing |
| CI | `ci.yml` | CI principal |
| CodeQL | `codeql.yml` | Análise segurança |
| Compress Images | `compress-images.yml` | Otimizar imagens |
| Dependabot Merge | `dependabot-auto-merge.yml` | Auto-merge deps |
| Dependency Review | `dependency-review.yml` | Review deps |
| Deploy | `deploy.yml` | Deploy produção |
| Docker Build | `docker-build.yml` | Build Docker |
| E2E | `e2e.yml` | Testes E2E |
| Label Sync | `label-sync.yml` | Sincronizar labels |
| Lighthouse | `lighthouse.yml` | Auditorias |
| Lint | `lint.yml` | Linting |
| Load Test | `load-test.yml` | Testes carga |
| Lock Threads | `lock-threads.yml` | Lock threads |
| Performance | `performance.yml` | Testes performance |
| PR Check | `pr-check.yml` | Validar PRs |
| PR Size | `pr-size.yml` | Tamanho PRs |
| Preview | `preview.yml` | Preview deploys |
| Release Please | `release-please.yml` | Release automation |
| Release Workflow | `release-workflow.yml` | Workflow release |
| Release | `release.yml` | Release |
| Security Scan | `security-scan.yml` | Scan segurança |
| Security | `security.yml` | Segurança |
| Semantic Release | `semantic-release.yml` | Semantic versioning |
| Size Label | `size-label.yml` | Labels tamanho |
| Stale | `stale.yml` | Marcar stale |
| Storybook Deploy | `storybook-deploy.yml` | Deploy Storybook |
| Storybook | `storybook.yml` | Build Storybook |
| Sync Labels | `sync-labels.yml` | Sincronizar labels |
| Test | `test.yml` | Testes unitários |
| Visual Regression | `visual-regression.yml` | Regressão visual |
| Welcome | `welcome.yml` | Mensagem boas-vindas |

### Outros arquivos .github/

| Arquivo | Função |
|---------|--------|
| `CODEOWNERS` | Donos de código |
| `FUNDING.yml` | Configuração patrocínio |
| `PULL_REQUEST_TEMPLATE.md` | Template PR |
| `dependabot.yml` | Config Dependabot |
| `labeler.yml` | Config auto-labeler |
| `labels.yml` | Definição labels |
| `release-drafter.yml` | Config release notes |
| `release.yml` | Config release |

---

## 📁 DIRETÓRIO: e2e/ (45+ testes)

Testes Playwright para todas as páginas e funcionalidades principais.

---

## 📁 DIRETÓRIO: k8s/

| Arquivo | Função |
|---------|--------|
| `configmap.yaml` | ConfigMap |
| `deployment.yaml` | Deployment |
| `ingress.yaml` | Ingress |
| `secrets.yaml` | Secrets |
| `service.yaml` | Service |

---

## 📁 DIRETÓRIO: docs/

Documentação completa do projeto (~40 arquivos).

---

## 📁 DIRETÓRIO: .storybook/

| Arquivo | Função |
|---------|--------|
| `main.ts` | Config principal |
| `manager-head.html` | Head manager |
| `preview-head.html` | Head preview |
| `preview.ts` | Config preview |
| `theme.ts` | Tema customizado |

---

*Última atualização: Janeiro 2025*
