# 📦 Inventário Completo do Projeto Match ATS

> Análise exaustiva do repositório - Última atualização: Janeiro 2025
> Construído em parceria: Claude (Anthropic) + Lovable

---

## 📊 Resumo Estatístico

| Categoria | Quantidade |
|-----------|------------|
| **Arquivos de Código (.tsx/.ts)** | ~450+ |
| **Componentes React** | ~180+ |
| **Hooks Customizados** | 85+ |
| **Páginas** | 45+ |
| **Serviços** | 35+ |
| **Edge Functions** | 10 |
| **Testes E2E** | 60+ |
| **Documentação** | 45+ arquivos |
| **GitHub Workflows** | 36 |
| **Migrations SQL** | 44 |

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
| `renovate.json` | Atualizações automáticas |

### Outros
| Arquivo | Função |
|---------|--------|
| `index.html` | Ponto de entrada HTML |
| `components.json` | Configuração shadcn/ui |
| `openapi.yaml` | Especificação API OpenAPI |
| `Makefile` | Comandos make |
| `.env.example` | Template variáveis ambiente |
| `.gitattributes` | Atributos Git |
| `CODEOWNERS` | Donos de código |

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

### src/components/ (180+ componentes)

#### 📂 src/components/ui/ (Biblioteca Base - shadcn/ui)
| Componente | Função | Testes |
|------------|--------|--------|
| `accordion.tsx` | Acordeão expansível | ✅ |
| `alert-dialog.tsx` | Diálogos de alerta | ✅ |
| `alert.tsx` | Mensagens de alerta | ✅ |
| `aspect-ratio.tsx` | Ratio de aspecto | ✅ |
| `avatar.tsx` | Avatares | ✅ |
| `badge.tsx` | Badges/etiquetas | ✅ |
| `breadcrumb.tsx` | Navegação breadcrumb | ✅ |
| `button.tsx` | Botões estilizados | ✅ |
| `calendar.tsx` | Calendário | ✅ |
| `card.tsx` | Cards | ✅ |
| `carousel.tsx` | Carrossel | ✅ |
| `chart.tsx` | Gráficos base | ✅ |
| `checkbox.tsx` | Checkboxes | ✅ |
| `collapsible.tsx` | Seções colapsáveis | ✅ |
| `command.tsx` | Command palette | ✅ |
| `context-menu.tsx` | Menu de contexto | ✅ |
| `dialog.tsx` | Modais/diálogos | ✅ |
| `drawer.tsx` | Drawer lateral | ✅ |
| `dropdown-menu.tsx` | Dropdowns | ✅ |
| `form.tsx` | Formulários com RHF | ✅ |
| `hover-card.tsx` | Cards em hover | ✅ |
| `input-otp.tsx` | Input OTP/2FA | ✅ |
| `input.tsx` | Inputs de texto | ✅ |
| `label.tsx` | Labels | ✅ |
| `match-score-badge.tsx` | Badge score match | - |
| `menubar.tsx` | Barra de menu | ✅ |
| `navigation-menu.tsx` | Menu navegação | ✅ |
| `pagination.tsx` | Paginação | ✅ |
| `password-input.tsx` | Input senha seguro | - |
| `popover.tsx` | Popovers | ✅ |
| `priority-badge.tsx` | Badge prioridade | - |
| `progress.tsx` | Barra progresso | ✅ |
| `radio-group.tsx` | Radio buttons | ✅ |
| `resizable.tsx` | Painéis redimensionáveis | ✅ |
| `scroll-area.tsx` | Área de scroll | ✅ |
| `select.tsx` | Selects | ✅ |
| `separator.tsx` | Separadores | ✅ |
| `sheet.tsx` | Sheet/drawer | ✅ |
| `sidebar.tsx` | Sidebar navegação | ✅ |
| `skeleton.tsx` | Loading skeletons | ✅ |
| `slider.tsx` | Sliders | ✅ |
| `sonner.tsx` | Toast notifications | ✅ |
| `status-badge.tsx` | Badge de status | - |
| `switch.tsx` | Toggle switches | ✅ |
| `table.tsx` | Tabelas | ✅ |
| `tabs.tsx` | Abas | ✅ |
| `textarea.tsx` | Áreas de texto | ✅ |
| `toast.tsx` | Toasts | ✅ |
| `toaster.tsx` | Container toasts | ✅ |
| `toggle-group.tsx` | Grupos toggle | ✅ |
| `toggle.tsx` | Toggles | ✅ |
| `tooltip.tsx` | Tooltips | ✅ |
| `use-toast.ts` | Hook toast | - |

#### 📂 src/components/auth/ (Autenticação)
| Componente | Função | Stories |
|------------|--------|---------|
| `LoginLockoutAlert.tsx` | Alerta bloqueio login | - |
| `MFAMethodSelector.tsx` | Seletor método MFA | - |
| `MFASMSSetup.tsx` | Setup MFA via SMS | - |
| `NewDeviceAlert.tsx` | Alerta novo dispositivo | - |
| `NewDeviceDetector.tsx` | Detector dispositivos | - |
| `PasswordResetRequestForm.tsx` | Formulário reset senha | - |
| `PasswordStrengthIndicator.tsx` | Indicador força senha | - |
| `PermissionGate.tsx` | Gate de permissões | - |
| `PermissionGuard.tsx` | Guard de permissões | - |
| `ProtectedRoute.tsx` | Rotas protegidas | ✅ |
| `QRCodeGenerator.tsx` | Gerador QR Code 2FA | - |
| `ReauthDialog.tsx` | Diálogo reautenticação | - |
| `RecoveryCodesDisplay.tsx` | Códigos recuperação | - |
| `SessionManager.tsx` | Gerenciador sessões | - |
| `TrustedDevicesManager.tsx` | Dispositivos confiáveis | - |
| `TwoFactorSetup.tsx` | Setup 2FA | ✅ |
| `TwoFactorVerify.tsx` | Verificação 2FA | ✅ |

#### 📂 src/components/dashboard/ (Painel Principal)
| Componente | Função | Stories/Tests |
|------------|--------|---------------|
| `AcoesPendentes.tsx` | Ações pendentes | ✅/✅ |
| `AcoesRapidas.tsx` | Ações rápidas | ✅/✅ |
| `AgendaHoje.tsx` | Agenda do dia | ✅/✅ |
| `AlertasInteligentes.tsx` | Alertas IA | ✅/✅ |
| `EntrevistasChart.tsx` | Gráfico entrevistas | ✅/✅ |
| `EntrevistasStats.tsx` | Estatísticas entrevistas | ✅/✅ |
| `FunilChart.tsx` | Gráfico funil | ✅/✅ |
| `KPICard.tsx` | Cards de KPI | ✅/✅ |
| `SmartInsights.tsx` | Insights inteligentes | ✅/✅ |
| `TopCandidatos.tsx` | Top candidatos | ✅/✅ |
| `VagasUrgentes.tsx` | Vagas urgentes | ✅/✅ |

#### 📂 src/components/candidatos/ (Gestão Candidatos)
| Componente | Função | Stories/Tests |
|------------|--------|---------------|
| `AIMatchInsights.tsx` | Insights IA de match | - |
| `CandidateTimeline.tsx` | Timeline candidato | - |
| `CandidatosToolbar.tsx` | Toolbar candidatos | - |
| `ComunicacaoHistorico.tsx` | Histórico comunicação | ✅/✅ |
| `MatchScoreCalculator.tsx` | Calculadora match | ✅/✅ |
| `MatchScoreCard.tsx` | Card score match | ✅/✅ |
| `ResumeParser.tsx` | Parser currículos | ✅/✅ |

#### 📂 src/components/candidato/ (Perfil Candidato)
| Componente | Função | Stories/Tests |
|------------|--------|---------------|
| `AvaliacoesTab.tsx` | Aba avaliações | ✅/✅ |
| `ComunicacaoTab.tsx` | Aba comunicação | ✅/✅ |
| `CurriculoTab.tsx` | Aba currículo | ✅/✅ |
| `DocumentosTab.tsx` | Aba documentos | ✅/✅ |
| `ExperienciaTab.tsx` | Aba experiência | ✅/✅ |
| `FormacaoTab.tsx` | Aba formação | ✅/✅ |
| `HistoricoTab.tsx` | Aba histórico | ✅/✅ |
| `NotasTab.tsx` | Aba notas | ✅/✅ |
| `PerfilHeader.tsx` | Header do perfil | ✅/✅ |

#### 📂 src/components/vagas/ (Gestão Vagas)
| Componente | Função | Stories/Tests |
|------------|--------|---------------|
| `JobPublisher.tsx` | Publicador multi-plataforma | - |
| `JobTemplates.tsx` | Templates de vagas | - |
| `VagaCard.tsx` | Card de vaga | ✅/✅ |

#### 📂 src/components/ia/ (Inteligência Artificial)
| Componente | Função |
|------------|--------|
| `AIInsights.tsx` | Insights gerados por IA |
| `ParsedResumePreview.tsx` | Preview currículo parseado |
| `ResumeEditForm.tsx` | Edição currículo parseado |
| `ResumeUploader.tsx` | Upload de currículos |
| `index.ts` | Exports |

#### 📂 src/components/workflow/ (Automação)
| Arquivo | Função |
|---------|--------|
| `WorkflowCanvas.tsx` | Canvas editor visual |
| `WorkflowEditor.tsx` | Editor workflows |
| `index.ts` | Exports |

##### src/components/workflow/nodes/
| Componente | Função |
|------------|--------|
| `ActionNode.tsx` | Nó de ação |
| `ConditionNode.tsx` | Nó condicional |
| `DelayNode.tsx` | Nó de delay |
| `EndNode.tsx` | Nó final |
| `NotificationNode.tsx` | Nó notificação |
| `TriggerNode.tsx` | Nó gatilho |
| `WebhookNode.tsx` | Nó webhook |
| `index.ts` | Exports |

##### src/components/workflow/panels/
| Componente | Função |
|------------|--------|
| `NodePalette.tsx` | Paleta de nós |
| `NodeProperties.tsx` | Propriedades nó |
| `WorkflowLogs.tsx` | Logs workflow |
| `WorkflowSettings.tsx` | Configurações |

#### 📂 src/components/admin/ (Administração)
| Componente | Função | Stories |
|------------|--------|---------|
| `AuditLogViewer.tsx` | Visualizador logs | - |
| `DataRetentionSettings.tsx` | Retenção dados LGPD | - |
| `GDPRConsent.tsx` | Consentimento GDPR | - |
| `PasswordResetApprovalPanel.tsx` | Aprovação reset | - |
| `RoleManager.tsx` | Gerenciador roles | - |
| `SLAConfig.tsx` | Configuração SLA | - |
| `SLADashboard.tsx` | Dashboard SLA | - |
| `SSOSettings.tsx` | Configurações SSO | - |
| `WhiteLabelSettings.tsx` | White label | ✅ |
| `index.ts` | Exports | - |

#### 📂 src/components/security/ (Segurança)
| Componente | Função |
|------------|--------|
| `ActiveSessionsPanel.tsx` | Sessões ativas |
| `BlockedIPsPanel.tsx` | IPs bloqueados |
| `GeoGuard.tsx` | Guard geográfico |
| `GeoWhitelistPanel.tsx` | Whitelist países |
| `IPGuard.tsx` | Guard de IP |
| `IPWhitelistPanel.tsx` | Whitelist IPs |
| `PasskeyManager.tsx` | Gerenciador Passkeys |
| `PushNotificationSettings.tsx` | Config push |
| `SecurityActivityLog.tsx` | Log atividades |
| `index.ts` | Exports |

#### 📂 src/components/analytics/ (Análises)
| Componente | Função | Stories/Tests |
|------------|--------|---------------|
| `AnalyticsDashboard.tsx` | Dashboard analytics | ✅/✅ |
| `DiversityDashboard.tsx` | Dashboard diversidade | - |
| `PipelineVelocity.tsx` | Velocidade pipeline | - |
| `RecruiterLeaderboard.tsx` | Ranking recrutadores | - |
| `SourceAnalytics.tsx` | Análise fontes | - |
| `TimeToHireChart.tsx` | Tempo contratação | - |
| `index.ts` | Exports | - |

#### 📂 src/components/agenda/ (Agendamento)
| Componente | Função | Stories/Tests |
|------------|--------|---------------|
| `AgendarEntrevistaDialog.tsx` | Agendar entrevista | ✅/✅ |
| `DayView.tsx` | Visão diária | ✅/✅ |
| `EntrevistaCard.tsx` | Card entrevista | ✅/✅ |
| `EntrevistaDetalhesDialog.tsx` | Detalhes entrevista | ✅/✅ |
| `GoogleCalendarExport.tsx` | Export Google Cal | ✅/✅ |
| `WeekView.tsx` | Visão semanal | ✅/✅ |

#### 📂 src/components/pipeline/ (Kanban)
| Componente | Função | Stories/Tests |
|------------|--------|---------------|
| `CandidatoKanbanCard.tsx` | Card Kanban | ✅/✅ |
| `PipelineColumn.tsx` | Coluna Kanban | ✅/✅ |

#### 📂 src/components/tests/ (Provas/Testes)
| Componente | Função | Stories/Tests |
|------------|--------|---------------|
| `BateriaCard.tsx` | Card bateria provas | ✅/✅ |
| `CategoriaCard.tsx` | Card categoria | ✅/✅ |
| `ProvaCard.tsx` | Card prova | ✅/✅ |
| `ProvaTimer.tsx` | Timer prova | ✅/✅ |
| `QuestaoAplicacao.tsx` | Questão em aplicação | ✅/✅ |
| `QuestaoCard.tsx` | Card questão | ✅/✅ |
| `QuestaoForm.tsx` | Formulário questão | ✅/✅ |
| `ResultadoProvaView.tsx` | Resultado prova | ✅/✅ |
| `TestFilters.tsx` | Filtros testes | ✅/✅ |

#### 📂 src/components/avaliacao/ (Avaliação)
| Componente | Função | Stories/Tests |
|------------|--------|---------------|
| `CompetenciaRating.tsx` | Rating competência | ✅/✅ |
| `Feedback360.tsx` | Feedback 360° | - |
| `NotaResumo.tsx` | Resumo notas | ✅/✅ |
| `ScorecardForm.tsx` | Formulário scorecard | - |

#### 📂 src/components/comunicacao/ (Comunicação)
| Componente | Função | Stories/Tests |
|------------|--------|---------------|
| `EnviarEmailDialog.tsx` | Enviar email | ✅/✅ |
| `HistoricoComunicacoes.tsx` | Histórico | ✅/✅ |

#### 📂 src/components/reports/ (Relatórios)
| Arquivo | Função |
|---------|--------|
| `ReportBuilder.tsx` | Construtor relatórios |
| `ReportChart.tsx` | Gráficos relatórios |
| `ReportExport.tsx` | Exportação |
| `ReportFilters.tsx` | Filtros |
| `ReportScheduler.tsx` | Agendamento |
| `ReportTable.tsx` | Tabelas |
| `index.ts` | Exports |

##### src/components/reports/templates/
| Componente | Função |
|------------|--------|
| `DiversityReport.tsx` | Relatório diversidade |
| `HiringFunnelReport.tsx` | Relatório funil |
| `RecruiterPerformanceReport.tsx` | Performance recrutadores |
| `SourceEffectivenessReport.tsx` | Efetividade fontes |
| `TimeToHireReport.tsx` | Tempo contratação |

#### 📂 src/components/common/ (Componentes Comuns)
| Componente | Função | Stories/Tests |
|------------|--------|---------------|
| `BulkActionBar.tsx` | Barra ações em massa | - |
| `BulkProgressModal.tsx` | Modal progresso bulk | - |
| `BulkSelectionBar.tsx` | Barra seleção | ✅ |
| `CommandMenu.tsx` | Menu comandos (⌘K) | - |
| `CommandMenuTrigger.tsx` | Trigger comando | - |
| `ConfirmDialog.tsx` | Diálogo confirmação | - |
| `EmptyState.tsx` | Estado vazio | ✅/✅ |
| `InstallPrompt.tsx` | Prompt instalação PWA | - |
| `LanguageSelector.tsx` | Seletor idioma | - |
| `LazyComponents.tsx` | Lazy loading | - |
| `LoadingOverlay.tsx` | Overlay loading | ✅/✅ |
| `LoadingSkeleton.tsx` | Skeleton loading | - |
| `OfflineFallback.tsx` | Fallback offline | - |
| `PageSuspense.tsx` | Suspense páginas | ✅/✅ |
| `PushNotificationPrompt.tsx` | Prompt push | - |
| `UpdatePrompt.tsx` | Prompt atualização | - |
| `VirtualizedList.tsx` | Lista virtualizada | - |
| `index.ts` | Exports | - |

#### 📂 src/components/layout/ (Layout)
| Componente | Função | Stories/Tests |
|------------|--------|---------------|
| `AppSidebar.tsx` | Sidebar principal | ✅/✅ |
| `Layout.tsx` | Layout base | ✅/✅ |

#### 📂 src/components/portal/ (Portal Candidato)
| Componente | Função | Stories/Tests |
|------------|--------|---------------|
| `CurriculoUpload.tsx` | Upload currículo | ✅/✅ |
| `PortalProtectedRoute.tsx` | Rota protegida portal | ✅/✅ |

#### 📂 src/components/integrations/ (Integrações)
| Componente | Função |
|------------|--------|
| `CathoConnect.tsx` | Integração Catho |
| `IndeedConnect.tsx` | Integração Indeed |
| `InfoJobsConnect.tsx` | Integração InfoJobs |
| `LinkedInConnect.tsx` | Integração LinkedIn |
| `OutlookCalendarConnect.tsx` | Outlook Calendar |
| `SlackConnect.tsx` | Integração Slack |
| `TeamsConnect.tsx` | Integração Teams |
| `VagasConnect.tsx` | Integração Vagas.com |
| `index.ts` | Exports |

#### 📂 src/components/notifications/ (Notificações)
| Componente | Função | Stories/Tests |
|------------|--------|---------------|
| `NotificationPanel.tsx` | Painel notificações | ✅/✅ |

#### 📂 src/components/search/ (Busca)
| Componente | Função |
|------------|--------|
| `AdvancedFilters.tsx` | Filtros avançados |
| `CommandPalette.tsx` | Paleta comandos |

#### 📂 src/components/onboarding/ (Onboarding)
| Componente | Função |
|------------|--------|
| `OnboardingProvider.tsx` | Provider onboarding |
| `OnboardingTour.tsx` | Tour guiado |

#### 📂 src/components/talentpool/ (Pool Talentos)
| Componente | Função |
|------------|--------|
| `CandidateTags.tsx` | Tags candidato |
| `PoolManager.tsx` | Gerenciador pool |

#### 📂 src/components/upload/ (Upload)
| Componente | Função |
|------------|--------|
| `DragDropUploader.tsx` | Upload drag & drop |

#### 📂 src/components/import/ (Importação)
| Componente | Função |
|------------|--------|
| `ImportPreview.tsx` | Preview importação |
| `ImportWizard.tsx` | Wizard importação |

#### 📂 src/components/a11y/ (Acessibilidade)
| Componente | Função | Stories/Tests |
|------------|--------|---------------|
| `LiveRegion.tsx` | Região ARIA live | ✅/✅ |
| `SkipLinks.tsx` | Skip links | ✅/✅ |
| `VisuallyHidden.tsx` | Texto oculto visual | ✅/✅ |
| `index.ts` | Exports | - |

#### 📂 src/components/legal/ (Legal/LGPD)
| Componente | Função |
|------------|--------|
| `CookieConsent.tsx` | Consentimento cookies |
| `PrivacyPolicy.tsx` | Política privacidade |

#### 📂 src/components/landing/ (Landing Page)
| Componente | Função |
|------------|--------|
| `LandingPage.tsx` | Página inicial |

#### 📂 src/components/settings/ (Configurações)
| Componente | Função |
|------------|--------|
| `GoogleCalendarConnect.tsx` | Conectar Google Calendar |

#### Componentes Raiz (src/components/)
| Arquivo | Função |
|---------|--------|
| `BulkActionsBar.tsx` | Barra ações em massa |
| `DataImporter.tsx` | Importador dados |
| `DuplicateButton.tsx` | Botão duplicar |
| `ErrorBoundary.tsx` | Boundary de erros |
| `ExportDropdown.tsx` | Dropdown exportação |
| `InfiniteScrollList.tsx` | Lista scroll infinito |
| `NavLink.tsx` | Link navegação |
| `SavedFiltersDropdown.tsx` | Filtros salvos |
| `SearchInput.tsx` | Input busca |
| `VersionHistory.tsx` | Histórico versões |
| `index.ts` | Exports |

---

### src/pages/ (45+ páginas)

#### Páginas Principais
| Arquivo | Rota | Função |
|---------|------|--------|
| `Index.tsx` | `/` | Página inicial/landing |
| `Dashboard.tsx` | `/dashboard` | Dashboard principal |
| `CandidatosPage.tsx` | `/candidatos` | Lista candidatos |
| `CandidatoPerfilPage.tsx` | `/candidato/:id` | Perfil candidato |
| `VagasList.tsx` | `/vagas` | Lista vagas |
| `VagaDetalhes.tsx` | `/vaga/:id` | Detalhes vaga |
| `VagaForm.tsx` | `/vagas/nova` | Criar/editar vaga |
| `Pipeline.tsx` | `/pipeline` | Kanban pipeline |
| `AgendaPage.tsx` | `/agenda` | Agenda entrevistas |
| `ComunicacaoPage.tsx` | `/comunicacao` | Central comunicação |
| `IndicacoesPage.tsx` | `/indicacoes` | Programa indicações |
| `AvaliacaoForm.tsx` | `/avaliacao` | Formulário avaliação |
| `TestsPage.tsx` | `/testes` | Gestão provas |
| `ProvaEditor.tsx` | `/prova/:id/editor` | Editor de provas |
| `ProvaAplicacao.tsx` | `/prova/:id/aplicar` | Aplicação prova |
| `AnalyticsPage.tsx` | `/analytics` | Dashboard analytics |
| `ReportsPage.tsx` | `/relatorios` | Relatórios |
| `ResumeParserPage.tsx` | `/parser` | Parser currículos |
| `TalentPoolPage.tsx` | `/talent-pool` | Pool talentos |
| `WorkflowEditorPage.tsx` | `/workflows` | Editor automações |
| `AdminPage.tsx` | `/admin` | Painel admin |
| `AuthPage.tsx` | `/auth` | Autenticação |
| `NotFound.tsx` | `*` | Página 404 |
| `DiagnosticoPage.tsx` | `/diagnostico` | Diagnóstico sistema |
| `PrivacyPolicyPage.tsx` | `/privacidade` | Política privacidade |
| `TermsPage.tsx` | `/termos` | Termos de uso |

#### 📂 src/pages/admin/
| Arquivo | Função |
|---------|--------|
| `AuditLogPage.tsx` | Logs de auditoria |
| `IPManagement.tsx` | Gerenciamento IPs |
| `PermissionsPage.tsx` | Gerenciamento permissões |
| `TenantManagement.tsx` | Multi-tenant |

#### 📂 src/pages/auth/
| Arquivo | Função |
|---------|--------|
| `ForgotPasswordPage.tsx` | Esqueci senha |
| `LoginPage.tsx` | Login |
| `RegisterPage.tsx` | Registro |
| `ResetPasswordPage.tsx` | Reset senha |
| `TwoFactorAuthPage.tsx` | Verificação 2FA |

#### 📂 src/pages/portal/ (Portal Candidato)
| Arquivo | Função |
|---------|--------|
| `PortalAuthPage.tsx` | Auth portal |
| `PortalDashboard.tsx` | Dashboard candidato |
| `PortalPerfil.tsx` | Perfil candidato |
| `PortalVagas.tsx` | Vagas disponíveis |

#### 📂 src/pages/security/
| Arquivo | Função |
|---------|--------|
| `RateLimitDashboard.tsx` | Dashboard rate limit |
| `RolesPage.tsx` | Gerenciamento roles |

#### 📂 src/pages/settings/
| Arquivo | Função |
|---------|--------|
| `SecuritySettingsPage.tsx` | Configurações segurança |

---

### src/hooks/ (85+ hooks)

#### Autenticação & Segurança
| Hook | Função |
|------|--------|
| `useAuth.ts` | Autenticação principal |
| `use2FA.ts` | Two-factor auth |
| `useWebAuthn.ts` | Passkeys/WebAuthn |
| `useLoginLockout.ts` | Bloqueio tentativas |
| `useReauth.ts` | Reautenticação |
| `useSessionTimeout.ts` | Timeout sessão |
| `useTrustedDevices.ts` | Dispositivos confiáveis |
| `useNewDeviceDetection.ts` | Detecção novos devices |
| `usePasswordBreachCheck.ts` | Verificação vazamentos |
| `useGeoVerification.ts` | Verificação geográfica |
| `useIPVerification.ts` | Verificação IP |
| `usePermissions.ts` | Permissões RBAC |
| `useRateLimit.ts` | Rate limiting |
| `useAuditLogs.ts` | Logs auditoria |

#### Dados & CRUD
| Hook | Função |
|------|--------|
| `useCandidates.ts` | CRUD candidatos |
| `useCandidatos.ts` | Candidatos (pt-BR) |
| `useCandidatoPerfil.ts` | Perfil candidato |
| `useCandidaturas.ts` | Candidaturas |
| `useJobs.ts` | CRUD vagas |
| `useVagas.ts` | Vagas (pt-BR) |
| `useInterviews.ts` | CRUD entrevistas |
| `useEntrevistas.ts` | Entrevistas (pt-BR) |
| `useProcessos.ts` | Processos seletivos |
| `useProcessosSeletivos.ts` | Processos (alt) |
| `useProvas.ts` | CRUD provas |
| `useQuestoes.ts` | CRUD questões |
| `useBateriasProvas.ts` | Baterias de provas |
| `useResultadosProvas.ts` | Resultados provas |
| `useAvaliacoes.ts` | Avaliações |
| `useIndicacoes.ts` | Indicações |
| `useComunicacoes.ts` | Comunicações |
| `useProfiles.ts` | Perfis usuários |
| `useMatchScores.ts` | Scores de match |
| `useHistoricoEtapas.ts` | Histórico etapas |
| `useNotifications.ts` | Notificações |
| `useRealtimeNotifications.ts` | Notificações realtime |
| `useCRUD.ts` | Hook CRUD genérico |

#### Dashboard & Analytics
| Hook | Função |
|------|--------|
| `useDashboard.ts` | Dados dashboard |
| `useDashboardData.ts` | Dados dashboard (alt) |
| `useAnalytics.ts` | Analytics |
| `useATSData.ts` | Dados ATS completos |
| `useScorecard.ts` | Scorecard |

#### UI & UX
| Hook | Função |
|------|--------|
| `use-mobile.tsx` | Detecção mobile |
| `use-toast.ts` | Toast notifications |
| `useDebounce.ts` | Debounce valores |
| `useDocumentTitle.ts` | Título documento |
| `usePageTitle.ts` | Título página |
| `useFocusTrap.ts` | Trap de foco a11y |
| `useReducedMotion.ts` | Preferência motion |
| `useAnnounce.ts` | Anúncios ARIA |
| `useInfiniteScroll.ts` | Scroll infinito |
| `useOnboarding.ts` | Tour onboarding |
| `usePushNotifications.ts` | Push notifications |

#### Busca & Filtros
| Hook | Função |
|------|--------|
| `useSearch.ts` | Busca geral |
| `useAdvancedSearch.ts` | Busca avançada |
| `useSavedFilters.ts` | Filtros salvos |
| `useViews.ts` | Views customizadas |

#### Operações em Massa
| Hook | Função |
|------|--------|
| `useBulkActions.ts` | Ações em massa |
| `useBulkSelection.ts` | Seleção em massa |
| `useExportData.ts` | Exportação dados |
| `useImportData.ts` | Importação dados |
| `useDuplicate.ts` | Duplicação entidades |
| `useVersions.ts` | Versionamento |

#### Outros
| Hook | Função |
|------|--------|
| `useWorkflow.ts` | Workflows automação |
| `useTalentPool.ts` | Pool talentos |
| `useTenant.ts` | Multi-tenant |
| `useWhiteLabel.ts` | White label |

---

### src/services/ (35+ serviços)

#### IA & Processamento
| Serviço | Função |
|---------|--------|
| `aiService.ts` | Serviço IA central |
| `matchingService.ts` | Cálculo match score |

#### Comunicação
| Serviço | Função |
|---------|--------|
| `emailService.ts` | Envio emails |
| `whatsappService.ts` | Envio WhatsApp |
| `slackService.ts` | Integração Slack |
| `teamsService.ts` | Integração Teams |

#### Calendário & Agendamento
| Serviço | Função |
|---------|--------|
| `googleCalendarService.ts` | Google Calendar |
| `outlookService.ts` | Outlook Calendar |
| `meetingService.ts` | Agendamento meetings |
| `autoSchedulingService.ts` | Auto-agendamento |

#### Job Boards
| Serviço | Função |
|---------|--------|
| `jobBoardService.ts` | Serviço central |
| `linkedinService.ts` | LinkedIn Jobs |
| `indeedService.ts` | Indeed |
| `cathoService.ts` | Catho |
| `infojobsService.ts` | InfoJobs |
| `vagasService.ts` | Vagas.com.br |

#### Segurança
| Serviço | Função |
|---------|--------|
| `ipService.ts` | Verificação IP |
| `geoService.ts` | Verificação geo |
| `loginLockoutService.ts` | Bloqueio login |
| `passwordBreachService.ts` | Verificação breach |
| `passwordResetService.ts` | Reset senha |

#### Dados & Export
| Serviço | Função |
|---------|--------|
| `exportService.ts` | Exportação dados |
| `importService.ts` | Importação dados |
| `reportingService.ts` | Relatórios |
| `cacheService.ts` | Cache local |

#### Compliance & Logs
| Serviço | Função |
|---------|--------|
| `gdprService.ts` | GDPR/LGPD |
| `logger.ts` | Logging estruturado |

#### Automação
| Serviço | Função |
|---------|--------|
| `workflowEngine.ts` | Engine workflows |

---

### src/lib/ (Utilitários Core)

| Arquivo | Função |
|---------|--------|
| `accessibilityUtils.ts` | Utils acessibilidade |
| `apiClient.ts` | Cliente HTTP |
| `constants.ts` | Constantes globais |
| `dateUtils.ts` | Utilitários data |
| `deviceFingerprint.ts` | Fingerprint dispositivo |
| `errorHandler.ts` | Tratamento erros |
| `export.ts` | Exportação arquivos |
| `featureFlags.ts` | Feature flags |
| `formatters.ts` | Formatadores |
| `matchSchemas.ts` | Schemas match |
| `performance.ts` | Métricas performance |
| `queryConfig.ts` | Config React Query |
| `rateLimit.ts` | Rate limiting client |
| `sanitize.ts` | Sanitização inputs |
| `schemas.ts` | Schemas validação |
| `securityHeaders.ts` | Headers segurança |
| `sentry.ts` | Integração Sentry |
| `storageUtils.ts` | Utils localStorage |
| `utils.ts` | Utils gerais |
| `validateUpload.ts` | Validação uploads |
| `validators.ts` | Validadores |
| `index.ts` | Exports |

#### src/lib/crud/
| Arquivo | Função |
|---------|--------|
| `index.ts` | Factory CRUD genérico |

---

### src/types/ (Tipagem TypeScript)

| Arquivo | Função |
|---------|--------|
| `api.ts` | Tipos API |
| `forms.ts` | Tipos formulários |
| `recruitment.ts` | Tipos recrutamento |
| `resumeParser.ts` | Tipos parser currículo |
| `tests.ts` | Tipos provas |
| `jobBoard.ts` | Tipos job boards |
| `whiteLabel.ts` | Tipos white label |
| `workflow.ts` | Tipos workflow |
| `index.ts` | Exports |

---

### src/contexts/ (Contextos React)

| Arquivo | Função |
|---------|--------|
| `AuthContext.tsx` | Contexto autenticação |
| `CandidatoAuthContext.tsx` | Auth candidatos |
| `NotificationContext.tsx` | Contexto notificações |
| `PermissionContext.tsx` | Contexto permissões |
| `TenantContext.tsx` | Contexto multi-tenant |
| `AnalyticsProvider.tsx` | Provider analytics |
| `index.ts` | Exports |

---

### src/config/ (Configurações)

| Arquivo | Função |
|---------|--------|
| `pipelineConfig.ts` | Config etapas pipeline |
| `testsConfig.ts` | Config provas |
| `ipWhitelist.ts` | Config whitelist IP |
| `geoWhitelist.ts` | Config whitelist geo |
| `index.ts` | Exports |

---

### src/constants/ (Constantes)

| Arquivo | Função |
|---------|--------|
| `queryKeys.ts` | Keys React Query |
| `routes.ts` | Rotas aplicação |
| `index.ts` | Exports |

---

### src/data/ (Dados Mock/Iniciais)

| Arquivo | Função |
|---------|--------|
| `agendaData.ts` | Dados agenda mock |
| `avaliacaoData.ts` | Dados avaliação |
| `candidatoPerfilData.ts` | Dados perfil mock |
| `emailTemplatesData.ts` | Templates email |
| `workflowTemplates.ts` | Templates workflow |

---

### src/i18n/ (Internacionalização)

| Arquivo | Função |
|---------|--------|
| `config.ts` | Config i18next |
| `pt-BR.ts` | Traduções português |
| `index.ts` | Exports |

---

### src/mocks/ (Mock Service Worker)

| Arquivo | Função |
|---------|--------|
| `browser.ts` | MSW browser |
| `handlers.ts` | Request handlers |
| `server.ts` | MSW server |
| `index.ts` | Exports |

---

### src/integrations/supabase/

| Arquivo | Função |
|---------|--------|
| `client.ts` | Cliente Supabase |
| `config.ts` | Configurações |
| `customClient.ts` | Cliente customizado |
| `types.ts` | Tipos gerados (read-only) |

---

### Arquivos Raiz src/

| Arquivo | Função |
|---------|--------|
| `App.tsx` | Componente raiz |
| `App.css` | Estilos App |
| `main.tsx` | Entry point |
| `index.css` | Estilos globais/design tokens |
| `vite-env.d.ts` | Tipos Vite |
| `env.d.ts` | Tipos env |

---

## 📁 DIRETÓRIO: supabase/

### supabase/functions/ (10 Edge Functions)

| Função | Arquivo | Descrição |
|--------|---------|-----------|
| `geo-check` | `index.ts` | Verificação geográfica |
| `github-api` | `index.ts` | Integração GitHub |
| `health` | `index.ts` | Health check |
| `ip-guard` | `index.ts` | Guard de IP |
| `match-score` | `index.ts` | Cálculo match IA |
| `new-device-alert` | `index.ts` | Alerta novo dispositivo |
| `parse-resume` | `index.ts` | Parser currículo IA |
| `password-reset-approval` | `index.ts` | Aprovação reset senha |
| `send-email` | `index.ts` | Envio emails |
| `send-whatsapp` | `index.ts` | Envio WhatsApp |

### supabase/migrations/ (44 migrations)

Migrations SQL para evolução do schema:
- Tabelas de candidatos, vagas, processos
- Sistema de provas/questões
- Autenticação e 2FA
- RBAC (roles e permissões)
- Multi-tenant
- Audit trail
- LGPD compliance
- Full-text search indexes
- Workflows
- Scorecards
- Talent pool
- E mais...

### Outros Arquivos
| Arquivo | Função |
|---------|--------|
| `config.toml` | Configuração Supabase |
| `seed.sql` | Dados iniciais |

---

## 📁 DIRETÓRIO: e2e/ (60+ testes E2E)

| Arquivo | Escopo |
|---------|--------|
| `2fa.spec.ts` | Two-factor auth |
| `accessibility.spec.ts` | Acessibilidade |
| `admin-page.spec.ts` | Página admin |
| `agenda-page.spec.ts` | Agenda |
| `analytics-dashboard.spec.ts` | Analytics |
| `auth.spec.ts` | Autenticação |
| `avaliacao-form.spec.ts` | Avaliação |
| `bulk-operations.spec.ts` | Operações em massa |
| `candidato-perfil.spec.ts` | Perfil candidato |
| `candidatos-page.spec.ts` | Lista candidatos |
| `clipboard.spec.ts` | Clipboard |
| `comunicacao.spec.ts` | Comunicação |
| `dark-mode.spec.ts` | Dark mode |
| `dashboard-page.spec.ts` | Dashboard |
| `dashboard-widgets.spec.ts` | Widgets |
| `deep-linking.spec.ts` | Deep links |
| `drag-drop.spec.ts` | Drag & drop |
| `error-handling.spec.ts` | Tratamento erros |
| `export.spec.ts` | Exportação |
| `file-upload.spec.ts` | Upload arquivos |
| `filtering.spec.ts` | Filtros |
| `form-validation.spec.ts` | Validação forms |
| `home-page.spec.ts` | Home |
| `indicacoes.spec.ts` | Indicações |
| `infinite-scroll.spec.ts` | Scroll infinito |
| `job-publisher.spec.ts` | Publicador vagas |
| `keyboard-shortcuts.spec.ts` | Atalhos teclado |
| `localization.spec.ts` | i18n |
| `mobile.spec.ts` | Mobile |
| `navigation.spec.ts` | Navegação |
| `not-found.spec.ts` | 404 |
| `offline.spec.ts` | Offline |
| `pagination.spec.ts` | Paginação |
| `performance.spec.ts` | Performance |
| `pipeline.spec.ts` | Pipeline |
| `portal-*.spec.ts` | Portal candidato (4) |
| `print.spec.ts` | Impressão |
| `prova-*.spec.ts` | Provas (3) |
| `relatorios.spec.ts` | Relatórios |
| `responsive.spec.ts` | Responsividade |
| `resume-parser.spec.ts` | Parser currículo |
| `search.spec.ts` | Busca |
| `seo.spec.ts` | SEO |
| `sorting.spec.ts` | Ordenação |
| `sso-auth.spec.ts` | SSO |
| `tests-page.spec.ts` | Página testes |
| `vaga-*.spec.ts` | Vagas (3) |
| `websocket.spec.ts` | WebSocket |
| `white-label.spec.ts` | White label |
| `workflow-editor.spec.ts` | Editor workflows |

---

## 📁 DIRETÓRIO: docs/ (45+ documentos)

### Documentos Principais
| Arquivo | Conteúdo |
|---------|----------|
| `ARCHITECTURE.md` | Arquitetura sistema |
| `API.md` | Documentação API |
| `API_REFERENCE.md` | Referência API |
| `API_TYPES.md` | Tipos API |
| `DATABASE.md` | Schema banco dados |
| `DEPLOYMENT.md` | Guia deploy |
| `DEVELOPMENT.md` | Guia desenvolvimento |
| `TESTING.md` | Estratégia testes |
| `SECURITY.md` | Políticas segurança |
| `SYSTEM_FEATURES.md` | Features do sistema |
| `USER_GUIDE.md` | Guia usuário |

### Guias Específicos
| Arquivo | Conteúdo |
|---------|----------|
| `COMPONENTS_GUIDE.md` | Guia componentes |
| `HOOKS_GUIDE.md` | Guia hooks |
| `STATE_MANAGEMENT.md` | Gestão estado |
| `INTERNATIONALIZATION.md` | i18n |
| `ACCESSIBILITY.md` | Acessibilidade |
| `PERFORMANCE.md` | Performance |
| `MONITORING.md` | Monitoramento |

### Operacional
| Arquivo | Conteúdo |
|---------|----------|
| `RUNBOOK.md` | Runbook operacional |
| `TROUBLESHOOTING.md` | Solução problemas |
| `DISASTER-RECOVERY.md` | Recuperação desastres |
| `BACKUP.md` | Backup |
| `SCALING.md` | Escalabilidade |
| `MIGRATION.md` | Migrações |

### Processos
| Arquivo | Conteúdo |
|---------|----------|
| `CONTRIBUTING.md` | Contribuição |
| `RELEASE-PROCESS.md` | Processo release |
| `VERSIONING.md` | Versionamento |
| `ROADMAP.md` | Roadmap |

### ADR (Architecture Decision Records)
| Arquivo | Decisão |
|---------|---------|
| `ADR/0001-architecture.md` | Arquitetura |
| `ADR/0002-state-management.md` | Estado |
| `ADR/0003-authentication.md` | Autenticação |
| `ADR/0004-database-structure.md` | Banco dados |
| `ADR/0005-testing-strategy.md` | Testes |
| `ADR/0006-ci-cd-pipeline.md` | CI/CD |
| `ADR/0007-i18n-strategy.md` | i18n |
| `ADR/0008-monitoring-observability.md` | Observabilidade |

### Outros
| Arquivo | Conteúdo |
|---------|----------|
| `FAQ.md` | Perguntas frequentes |
| `GLOSSARY.md` | Glossário |
| `ONBOARDING.md` | Onboarding devs |
| `SDK.md` | SDK |
| `WEBHOOKS.md` | Webhooks |
| `IP_WHITELIST.md` | Whitelist IP |
| `SECURITY-CHECKLIST.md` | Checklist segurança |
| `STYLEGUIDE.md` | Style guide |
| `PROJECT_TEMPLATE.md` | Template projeto |
| `DEPENDENCIES_INSTALL.md` | Instalação deps |
| `postman_collection.json` | Coleção Postman |
| `index.md` | Índice |

---

## 📁 DIRETÓRIO: .github/

### workflows/ (36 workflows CI/CD)

| Workflow | Função |
|----------|--------|
| `ci.yml` | Pipeline CI principal |
| `test.yml` | Testes unitários |
| `e2e.yml` | Testes E2E |
| `lint.yml` | Linting |
| `deploy.yml` | Deploy produção |
| `preview.yml` | Deploy preview |
| `release.yml` | Release |
| `release-please.yml` | Release Please |
| `release-workflow.yml` | Workflow release |
| `semantic-release.yml` | Semantic release |
| `storybook.yml` | Build Storybook |
| `storybook-deploy.yml` | Deploy Storybook |
| `chromatic.yml` | Visual testing |
| `visual-regression.yml` | Regressão visual |
| `security.yml` | Scan segurança |
| `security-scan.yml` | Scan segurança (alt) |
| `codeql.yml` | CodeQL análise |
| `dependency-review.yml` | Review deps |
| `docker-build.yml` | Build Docker |
| `bundle-size.yml` | Size bundle |
| `performance.yml` | Testes perf |
| `lighthouse.yml` | Auditorias Lighthouse |
| `load-test.yml` | Testes carga |
| `a11y.yml` | Acessibilidade |
| `pr-check.yml` | Checks PR |
| `pr-size.yml` | Size PR |
| `changelog.yml` | Changelog |
| `auto-assign.yml` | Auto-assign reviewers |
| `dependabot-auto-merge.yml` | Auto-merge deps |
| `label-sync.yml` | Sync labels |
| `sync-labels.yml` | Sync labels (alt) |
| `size-label.yml` | Labels por size |
| `stale.yml` | Issues stale |
| `lock-threads.yml` | Lock threads |
| `welcome.yml` | Boas-vindas |

### Templates & Configs
| Arquivo | Função |
|---------|--------|
| `ISSUE_TEMPLATE/bug_report.md` | Template bug |
| `ISSUE_TEMPLATE/feature_request.md` | Template feature |
| `PULL_REQUEST_TEMPLATE.md` | Template PR |
| `pull_request_template.md` | Template PR (alt) |
| `CODEOWNERS` | Code owners |
| `SECURITY.md` | Política segurança |
| `FUNDING.yml` | Funding |
| `dependabot.yml` | Dependabot |
| `labeler.yml` | Auto-labeler |
| `labels.yml` | Labels config |
| `release-drafter.yml` | Draft releases |
| `release.yml` | Release config |
| `stale.yml` | Stale config |

---

## 📁 DIRETÓRIO: .storybook/

| Arquivo | Função |
|---------|--------|
| `main.ts` | Config principal |
| `preview.ts` | Preview config |
| `theme.ts` | Tema customizado |
| `manager-head.html` | Head manager |
| `preview-head.html` | Head preview |

---

## 📁 DIRETÓRIO: grafana/

| Arquivo | Função |
|---------|--------|
| `dashboard.json` | Dashboard Grafana |

---

## 📁 DIRETÓRIO: k8s/ (Kubernetes)

| Arquivo | Função |
|---------|--------|
| `configmap.yaml` | ConfigMaps |
| `deployment.yaml` | Deployment |
| `ingress.yaml` | Ingress rules |
| `secrets.yaml` | Secrets |
| `service.yaml` | Service |

---

## 📁 DIRETÓRIO: postman/

| Arquivo | Função |
|---------|--------|
| `collection.json` | Coleção Postman APIs |

---

## 📁 DIRETÓRIO: terraform/

| Arquivo | Função |
|---------|--------|
| `main.tf` | Infraestrutura IaC |

---

## 📁 DIRETÓRIO: scripts/

| Arquivo | Função |
|---------|--------|
| `deploy.sh` | Script deploy |
| `setup.sh` | Script setup |

---

## 📁 DIRETÓRIO: .husky/

| Arquivo | Função |
|---------|--------|
| `pre-commit` | Hook pre-commit |
| `commit-msg` | Hook commit-msg |
| `_/` | Internals husky |

---

## 📁 DIRETÓRIO: public/

| Arquivo | Função |
|---------|--------|
| `favicon.ico` | Favicon ICO |
| `favicon.svg` | Favicon SVG |
| `manifest.json` | PWA manifest |
| `placeholder.svg` | Placeholder image |
| `robots.txt` | Robots.txt |
| `sw.js` | Service Worker |

---

## 🔧 Stack Tecnológica Completa

### Frontend
- **React 18** - UI Library
- **TypeScript** - Tipagem
- **Vite** - Bundler
- **Tailwind CSS** - Styling
- **shadcn/ui** - Componentes
- **React Router DOM** - Routing
- **React Hook Form + Zod** - Forms
- **TanStack Query** - Data fetching
- **Recharts** - Gráficos
- **Framer Motion** (implícito) - Animações
- **i18next** - i18n
- **date-fns** - Datas

### Backend (Lovable Cloud)
- **Supabase** - BaaS
- **Edge Functions (Deno)** - Serverless
- **PostgreSQL** - Database
- **Row Level Security** - Segurança

### Testes
- **Vitest** - Unit tests
- **Testing Library** - Component tests
- **Playwright** - E2E tests
- **Storybook** - Component docs
- **Chromatic** - Visual testing

### DevOps
- **GitHub Actions** - CI/CD
- **Docker** - Containerização
- **Kubernetes** - Orquestração
- **Terraform** - IaC
- **Nginx** - Proxy reverso

### Monitoramento
- **Sentry** - Error tracking
- **Grafana** - Dashboards
- **Prometheus** - Métricas
- **Lighthouse** - Performance

### Qualidade
- **ESLint** - Linting
- **Prettier** - Formatting
- **Husky** - Git hooks
- **Commitlint** - Commits
- **Renovate** - Deps update

---

## 📊 Cobertura de Features

| Feature | Status | Componentes | Hooks | Serviços |
|---------|--------|-------------|-------|----------|
| **Autenticação** | ✅ Completo | 17 | 12 | 5 |
| **Candidatos** | ✅ Completo | 25+ | 8 | 3 |
| **Vagas** | ✅ Completo | 8 | 4 | 6 |
| **Pipeline Kanban** | ✅ Completo | 5 | 3 | 1 |
| **Entrevistas** | ✅ Completo | 10 | 4 | 4 |
| **Provas/Testes** | ✅ Completo | 12 | 5 | 1 |
| **Avaliação** | ✅ Completo | 6 | 2 | 1 |
| **Comunicação** | ✅ Completo | 4 | 2 | 3 |
| **Analytics** | ✅ Completo | 8 | 3 | 2 |
| **Relatórios** | ✅ Completo | 10 | 1 | 1 |
| **Workflows** | ✅ Completo | 12 | 1 | 1 |
| **Portal Candidato** | ✅ Completo | 6 | 2 | - |
| **Admin/RBAC** | ✅ Completo | 10 | 3 | 2 |
| **Segurança** | ✅ Completo | 11 | 8 | 5 |
| **Integrações** | ✅ Completo | 9 | - | 6 |
| **i18n** | ✅ Completo | 2 | - | - |
| **A11y** | ✅ Completo | 4 | 3 | 1 |
| **White Label** | ✅ Completo | 2 | 1 | - |
| **Multi-tenant** | ✅ Completo | 1 | 1 | - |

---

## 🏗️ Arquitetura de Componentes

```
App.tsx
├── Layout.tsx
│   ├── AppSidebar.tsx
│   │   ├── NavLinks
│   │   ├── NotificationPanel
│   │   └── UserMenu
│   └── [Page Components]
│
├── AuthContext.tsx
│   ├── ProtectedRoute.tsx
│   ├── PermissionGate.tsx
│   └── SessionManager.tsx
│
├── ErrorBoundary.tsx
│
└── Routes
    ├── Dashboard (widgets compostos)
    ├── Candidatos (CRUD + pipeline)
    ├── Vagas (CRUD + publicação)
    ├── Agenda (calendário)
    ├── Testes (provas + questões)
    ├── Analytics (gráficos)
    ├── Admin (RBAC + auditoria)
    └── Portal (área candidato)
```

---

## 📝 Observações Importantes

1. **Parceria Claude + Lovable**: O projeto foi construído em colaboração, com arquivos podendo ser adicionados por ambas as plataformas via GitHub.

2. **Testes Extensivos**: ~180+ arquivos de teste entre unit tests, integration tests e E2E.

3. **Documentação Rica**: 45+ documentos de documentação incluindo ADRs.

4. **CI/CD Robusto**: 36 workflows GitHub Actions cobrindo todo o ciclo de desenvolvimento.

5. **Segurança em Camadas**: RLS, RBAC, 2FA, IP whitelist, geo-fencing, rate limiting.

6. **Erros de Build Atuais**: Existem erros de TypeScript que precisam ser corrigidos (arquivos faltando, tipos incorretos).

---

*Documento gerado automaticamente - Match ATS v1.0*
