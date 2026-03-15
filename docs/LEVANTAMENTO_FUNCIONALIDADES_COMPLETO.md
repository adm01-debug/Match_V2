# 📋 MATCH ATS — LEVANTAMENTO EXAUSTIVO DE FUNCIONALIDADES

> **Gerado em:** 15/03/2026  
> **Fonte:** Cruzamento de 3 documentos de especificação + análise do código-fonte + banco de dados  
> **Documentos base:** MATCH_ATS_ESPECIFICACAO_COMPLETA.md, MATCH_ATS_FUNCIONALIDADES_COMPLETAS.md, SYSTEM_FEATURES.md

---

## 📊 RESUMO EXECUTIVO

| Métrica | Valor |
|---------|-------|
| **Total de funcionalidades listadas** | 400+ |
| **Módulos do sistema** | 18 |
| **Páginas/Rotas** | 35+ |
| **Hooks customizados** | 50+ |
| **Services** | 24+ |
| **Edge Functions** | 12 |
| **Tabelas no banco** | 60+ |
| **Testes E2E** | 50+ |
| **Componentes TSX** | 497 |

---

## ÍNDICE

1. [Dashboard Principal](#1-dashboard-principal)
2. [Gestão de Vagas](#2-gestão-de-vagas)
3. [Gestão de Candidatos](#3-gestão-de-candidatos)
4. [Pipeline de Seleção](#4-pipeline-de-seleção)
5. [Agenda e Entrevistas](#5-agenda-e-entrevistas)
6. [Avaliações e Testes](#6-avaliações-e-testes)
7. [Comunicação](#7-comunicação)
8. [Dashboard e Analytics](#8-dashboard-e-analytics)
9. [Relatórios e Exportação](#9-relatórios-e-exportação)
10. [Integrações Externas](#10-integrações-externas)
11. [Autenticação e Segurança](#11-autenticação-e-segurança)
12. [Portal do Candidato](#12-portal-do-candidato)
13. [Administração](#13-administração)
14. [Workflows e Automações](#14-workflows-e-automações)
15. [Notificações](#15-notificações)
16. [Multi-Tenant e White Label](#16-multi-tenant-e-white-label)
17. [Acessibilidade e UX](#17-acessibilidade-e-ux)
18. [Funcionalidades CRUD Avançadas](#18-funcionalidades-crud-avançadas)
19. [Gamificação](#19-gamificação)
20. [Avaliações Comportamentais](#20-avaliações-comportamentais)
21. [Ofertas](#21-ofertas)
22. [Ferramentas Estratégicas de R&S](#22-ferramentas-estratégicas-de-rs)
23. [Edge Functions (Backend)](#23-edge-functions-backend)
24. [Hooks Customizados](#24-hooks-customizados)
25. [Services](#25-services)
26. [Componentes Comuns](#26-componentes-comuns)
27. [Infraestrutura e DevOps](#27-infraestrutura-e-devops)
28. [Testes](#28-testes)
29. [Banco de Dados](#29-banco-de-dados)

---

## 1. DASHBOARD PRINCIPAL

**Rota:** `/`  
**Página:** `Dashboard.tsx`  
**Hooks:** `useDashboard.ts`, `useDashboardData.ts`

### 1.1 Componentes do Dashboard
- **KPICard** — Cards de métricas com título, valor, ícone, tendência (up/down/neutral), variação %, link
- **FunilChart** — Gráfico de funil de conversão por etapa, taxa de conversão, cores por status
- **EntrevistasChart** — Gráfico de entrevistas por período/tipo/resultado
- **EntrevistasStats** — Total agendadas, realizadas, pendentes, taxa de comparecimento
- **TopCandidatos** — Ranking com foto, nome, match score, vaga, dias no processo, ação rápida, ordenação imutável (spread operator)
- **SmartInsights** — Insights com IA: alertas, sugestões, previsões, gargalos
- **AlertasUrgentes** — SLA vencendo, candidatos aguardando, entrevistas hoje, ações pendentes
- **AgendaDoDia** — Entrevistas, reuniões, prazos, lembretes
- **AcoesRapidas** — Atalhos: nova vaga, novo candidato, agendar entrevista, buscar

### 1.2 KPIs Exibidos
1. Tempo Médio de Contratação
2. Meta de Contratação (progresso vs objetivo)
3. Candidatos em Processo
4. Taxa de Conversão
5. SLA de Resposta
6. Vagas Abertas
7. Entrevistas Hoje
8. Candidatos VIP

---

## 2. GESTÃO DE VAGAS

### 2.1 Lista de Vagas (`/vagas`)
**Página:** `VagasList.tsx` | **Hook:** `useVagas.ts`

- Listagem paginada
- Filtros avançados:
  - Status (Rascunho, Publicada, Em Seleção, Pausada, Encerrada)
  - Departamento
  - Recrutador responsável
  - Prioridade (Baixa, Média, Alta, Urgente)
  - Modalidade (Presencial, Remoto, Híbrido)
  - Tipo de contrato (CLT, PJ, Estágio, Temporário)
  - Data de criação (range)
  - Cidade/Estado
- Ordenação multi-coluna
- Busca fulltext (título, descrição, requisitos)
- Visualização grid/lista
- Ações em lote (bulk actions)
- Exportação (CSV, Excel, PDF)
- Filtros salvos pelo usuário

### 2.2 Nova Vaga (`/vagas/nova`)
**Página:** `VagaForm.tsx`

**Informações Básicas:**
- Título (obrigatório)
- Departamento (select)
- Gestor responsável
- Recrutador responsável
- Quantidade de vagas
- Prioridade

**Localização e Contrato:**
- Tipo de contrato (CLT, PJ, Estágio, Temporário, Freelancer)
- Modalidade (Presencial, Remoto, Híbrido)
- Dias presenciais (se híbrido)
- Cidade, Estado, País, CEP, Endereço

**Remuneração:**
- Toggle exibir salário
- Tipo (Mensal, Anual, Por hora)
- Salário mínimo/máximo
- "A combinar"
- Moeda (BRL, USD, EUR)
- Benefícios multi-select: VR, VA, VT, Plano de Saúde, Odontológico, Gympass, PLR, Bônus, Stock Options, Home Office Allowance, Outros

**Descrição:**
- Descrição da empresa (rich text)
- Sobre a vaga (rich text)
- Responsabilidades
- Requisitos obrigatórios
- Requisitos desejáveis
- O que oferecemos

**Skills e Avaliação:**
- Skills requeridas (tags com nível: Básico, Intermediário, Avançado)
- Skills desejáveis
- Competências comportamentais (multi-select)
- Perguntas de triagem customizadas
- Teste técnico associado
- Scorecard de avaliação (template)

**Pipeline e Processo:**
- Funil/Pipeline (select ou criar)
- Etapas do processo (customizáveis)
- SLA por etapa (dias)
- Recrutadores adicionais
- Entrevistadores

**Publicação:**
- Status inicial (Rascunho/Publicada)
- Data de publicação (agendamento)
- Data de encerramento
- Job boards: LinkedIn, Indeed, Catho, InfoJobs, Vagas.com, Glassdoor, Portal próprio
- Divulgação interna (programa de indicações)

**Metadados:**
- Tags internas
- Código da vaga (auto/manual)
- Centro de custo
- Projeto associado

### 2.3 Detalhes da Vaga (`/vagas/:id`)
**Página:** `VagaDetalhes.tsx`

**Seções:**
1. Header: título, status badge, prioridade, ações (Editar, Duplicar, Pausar, Encerrar, Excluir), compartilhar link
2. Resumo: departamento, localização, modalidade, contrato, salário, publicação, dias aberto
3. Descrição completa formatada
4. Pipeline visual (mini-kanban)
5. Métricas: total candidatos, por fonte, conversão por etapa, tempo médio, projeção fechamento
6. Atividade recente (timeline)
7. Equipe (gestor, recrutadores, entrevistadores)

### 2.4 Editar Vaga (`/vagas/:id/editar`)
- Mesmo formulário de criação
- Campos preenchidos
- Histórico de versões
- Restaurar versão anterior

### 2.5 Operações CRUD
- Criar, Listar, Visualizar, Editar, Excluir (soft delete), Duplicar, Restaurar, Publicar, Pausar, Encerrar

### 2.6 Job Publisher
- Publicação em múltiplos canais simultaneamente
- Preview antes de publicar
- Templates de vagas

---

## 3. GESTÃO DE CANDIDATOS

### 3.1 Banco de Talentos (`/talentos`)
**Página:** `CandidatosPage.tsx` | **Hook:** `useCandidatos.ts`

**Filtros:**
- Nome/email
- Skills
- Nível de experiência
- Localização
- Faixa salarial
- Disponibilidade
- Origem/fonte
- Status
- Tags
- Data de cadastro
- Última atividade

**Funcionalidades:**
- Busca fulltext em currículo
- Ordenação múltipla
- Visualização cards/tabela
- Match score prévio com vagas abertas
- Ações em lote: Adicionar a vaga, Tags, Exportar, Excluir
- Infinite scroll
- Filtros salvos

### 3.2 Perfil do Candidato (`/candidato/:id`)
**Página:** `CandidatoPerfilPage.tsx` | **Hook:** `useCandidatoPerfil.ts`

**13 Seções:**
1. **Header:** foto, nome, cargo, empresa, localização, match score, status, ações
2. **Contato:** email, telefone(s), LinkedIn, portfolio, GitHub, outros links
3. **Resumo Profissional:** cargo pretendido, nível, anos experiência, pretensão salarial, disponibilidade, disposição mudança, PCD
4. **Skills/Competências:** lista com nível, tags visuais, match com vagas
5. **Experiência Profissional:** empresa, cargo, período, descrição, destaques
6. **Formação Acadêmica:** instituição, curso, nível (Graduação/Pós/MBA/Mestrado/Doutorado), período, status
7. **Idiomas:** lista com nível (Básico/Intermediário/Avançado/Fluente/Nativo)
8. **Currículo:** visualização PDF, download, re-upload, dados extraídos
9. **Processos Seletivos:** lista atual/passada, vaga, etapa, histórico, avaliações, status final
10. **Timeline/Histórico:** todas ações cronologicamente
11. **Comunicações:** histórico emails/mensagens, enviar nova
12. **Notas Internas:** notas recrutadores, privadas ou públicas
13. **Documentos:** anexos, certificados, portfólio

### 3.3 Parser de Currículo (`/parser-curriculo`)
**Página:** `ResumeParserPage.tsx` | **Edge Function:** `parse-resume`

- Upload PDF/DOC/DOCX
- Extração automática: nome, email(s), telefone(s), LinkedIn, endereço, objetivo, resumo, experiências, formações, idiomas, skills, certificações
- Preview dos dados extraídos
- Edição manual antes de salvar
- Criação de candidato
- Associação a vaga

### 3.4 Match Score com IA
**Edge Function:** `match-score` | **Tabela:** `match_scores`

- Cálculo automático de compatibilidade (0-100%)
- Breakdown: Skills, Experiência, Formação, Localização, Salário
- Recomendação (Forte, Moderado, Baixo)
- AI Match Insights
- Match Score Card visual com:
  - Score principal (círculo)
  - Barras de progresso por categoria
  - Análise textual da IA
  - Badges: habilidades compatíveis (verde), faltantes (vermelho), extras (azul)
  - Pontos fortes e de atenção
  - Recomendação

### 3.5 Talent Pool
**Página:** `TalentPoolPage.tsx` | **Hook:** `useTalentPool.ts`

- Adicionar ao banco de talentos
- Busca avançada no banco
- Segmentação por tags
- Reaproveitamento de candidatos

### 3.6 Timeline do Candidato
- Histórico de etapas com timestamps
- Registro de comunicações, avaliações, testes

---

## 4. PIPELINE DE SELEÇÃO

### 4.1 Kanban Visual (`/pipeline`)
**Página:** `Pipeline.tsx` | **Biblioteca:** `@dnd-kit`

- Colunas por etapa do funil
- Cards de candidatos arrastáveis (drag and drop)
- Drop zones destacadas

**Card do Candidato:**
- Foto/avatar, Nome, Vaga, Match score (badge colorido), Dias na etapa, Origem, Tags, Próxima ação, Menu de ações rápidas

### 4.2 Filtros do Pipeline
- Por vaga, recrutador, prioridade, match score (range), dias na etapa, data de entrada

### 4.3 Etapas Padrão (10)
1. Novo
2. Triagem
3. Entrevista RH
4. Teste Técnico
5. Entrevista Gestor
6. Entrevista Final
7. Proposta
8. Contratado
9. Reprovado
10. Desistência

### 4.4 Ações por Candidato
- Mover para etapa
- Agendar entrevista
- Enviar para avaliação
- Aplicar teste
- Enviar mensagem
- Adicionar nota
- Ver perfil completo
- Reprovar com motivo
- Aprovar/Contratar

### 4.5 Bulk Actions
- Seleção múltipla
- Mover em lote
- Tags em lote (add/remove)
- Mensagem em lote
- Exportar selecionados
- Excluir em lote
- Progresso visual

### 4.6 Gestão do Pipeline
- Customização de etapas por funil
- Múltiplos funis por vaga
- Histórico de movimentações
- Status badges com cores e ícones

---

## 5. AGENDA E ENTREVISTAS

### 5.1 Calendário (`/agenda`)
**Página:** `AgendaPage.tsx` | **Hook:** `useEntrevistas.ts`

- Vista diária, semanal, mensal
- Navegação entre períodos
- Eventos: entrevistas (cor por tipo), testes, reuniões, prazos, lembretes

### 5.2 Criar Entrevista
- Candidato (select/busca)
- Vaga associada
- Tipo: Presencial, Remota (video), Telefone, Painel
- Data/horário, Duração estimada
- Entrevistadores (multi-select)
- Sala/local ou Link reunião
- Notas de preparação
- Template de perguntas
- Enviar convite candidato e entrevistadores

### 5.3 Status da Entrevista
- Agendada → Convite enviado → Confirmada → Em andamento → Realizada/No-show/Reagendada/Cancelada

### 5.4 Feedback Pós-Entrevista
- Scorecard de avaliação
- Notas do entrevistador
- Pontos fortes/atenção
- Recomendação (Aprovar/Reprovar/Incerto)
- Assinatura digital

### 5.5 Serviços de Meeting
- `meetingService.ts` — Gerenciamento de meetings
- `autoSchedulingService.ts` — Agendamento automático

---

## 6. AVALIAÇÕES E TESTES

### 6.1 Gestão de Provas (`/testes`)
**Página:** `TestsPage.tsx` | **Hook:** `useProvas.ts`

- Lista de provas, Criar, Editar, Duplicar, Excluir
- Ver resultados, Estatísticas por prova

### 6.2 Editor de Provas (`/testes/nova`, `/testes/:id/editar`)
**Página:** `ProvaEditor.tsx`

**Estrutura:**
- Título, Descrição, Instruções
- Tempo limite (min), Pontuação máxima, Nota de corte
- Área de conhecimento, Nível de dificuldade, Tags

**Tipos de Questão:**
1. **Múltipla Escolha:** enunciado rich text, 4-5 alternativas, resposta correta, pontuação, feedback
2. **Verdadeiro/Falso:** enunciado, resposta, pontuação
3. **Dissertativa:** enunciado, gabarito, critérios, pontuação máxima
4. **Código:** enunciado, linguagem, template, casos de teste, pontuação

**Recursos:**
- Reordenar questões (drag), Duplicar questão, Preview, Banco de questões (reutilizar)

### 6.3 Aplicação de Prova (`/testes/:provaId/aplicar`)
**Página:** `ProvaAplicacao.tsx`

- Instruções iniciais
- Timer visível com countdown
- Navegação entre questões
- Marcar para revisão
- Salvamento automático de rascunho
- Submissão final com confirmação

**Anti-fraude:**
- Detecção de troca de aba
- Tela cheia obrigatória
- Log de eventos

### 6.4 Resultados
**Hook:** `useResultadosProvas.ts` | **Tabela:** `resultados_provas`

- Lista candidatos que fizeram
- Nota de cada um
- Tempo utilizado
- Correção automática (objetivas)
- Correção manual (dissertativas)
- Comparativo entre candidatos
- Exportar resultados

### 6.5 Baterias de Provas
**Hook:** `useBateriasProvas.ts` | **Tabelas:** `baterias_provas`, `bateria_provas_rel`

- Criar bateria, Listar, Editar, Aplicar
- Por departamento, cargo e nível
- 6 categorias: Técnicos, Comportamentais, Linguagens, Testes Online, Práticos, Cases

### 6.6 Scorecards de Avaliação
**Hook:** `useScorecard.ts`

- Critérios customizáveis
- Escala de notas
- Peso por critério
- Cálculo de média ponderada
- Comentários por critério

### 6.7 Formulário de Avaliação (`/avaliacao/:processoId`)
**Página:** `AvaliacaoForm.tsx` | **Hook:** `useAvaliacoes.ts`

---

## 7. COMUNICAÇÃO

### 7.1 Centro de Comunicação (`/comunicacao`)
**Página:** `ComunicacaoPage.tsx` | **Hook:** `useComunicacoes.ts`

- Histórico de todas as comunicações
- Filtro por candidato, canal, período, tipo, conteúdo

### 7.2 Enviar Mensagem
- Selecionar destinatário(s)
- Selecionar canal (Email, SMS, WhatsApp, Chat interno)
- Usar template ou escrever
- Variáveis dinâmicas: `{{nome_candidato}}`, `{{nome_recrutador}}`, `{{nome_vaga}}`, `{{nome_empresa}}`, `{{link_portal}}`, `{{data_entrevista}}`, `{{horario_entrevista}}`, `{{local_entrevista}}`, `{{link_reuniao}}`
- Preview antes de enviar
- Agendar envio

### 7.3 Templates de Mensagem
- Confirmação de candidatura
- Convite para entrevista
- Confirmação de entrevista
- Lembrete de entrevista
- Agradecimento pós-entrevista
- Feedback positivo (aprovado)
- Feedback negativo (reprovado)
- Proposta de emprego
- Follow-up
- Reativação de candidato

### 7.4 Automações de Comunicação
- Email de confirmação ao candidatar
- Convite para entrevista
- Lembrete de entrevista
- Feedback de reprovação
- Proposta de emprego

---

## 8. DASHBOARD E ANALYTICS

### 8.1 Analytics Básico (`/analytics-basico`)
**Página:** `AnalyticsPage.tsx` | **Hook:** `useAnalytics.ts`

### 8.2 Analytics Avançado (`/analytics`)
**Página:** `AdvancedAnalyticsPage.tsx`

**Componentes:**
- `AnalyticsDashboard.tsx`
- `DiversityDashboard.tsx` — Métricas de diversidade
- `TimeToHireChart.tsx` — Tempo para contratação
- `PipelineVelocity.tsx` — Velocidade do pipeline
- `SourceAnalytics.tsx` — Análise de fontes
- `EntrevistasChart.tsx` — Gráfico de entrevistas
- `RecruiterLeaderboard.tsx` — Ranking de recrutadores

---

## 9. RELATÓRIOS E EXPORTAÇÃO

### 9.1 Relatórios (`/relatorios`)
**Página:** `ReportsPage.tsx` | **Serviço:** `reportingService.ts`

**Relatórios Pré-definidos:**
1. **Vagas:** abertas por período, por departamento, tempo fechamento, vagas difíceis
2. **Candidatos:** por período, por fonte, por status, por localização, qualidade por fonte
3. **Funil:** conversão por etapa, gargalos, tempo por etapa, drop-off
4. **Entrevistas:** por período, taxa comparecimento, por tipo, por entrevistador
5. **SLA:** cumprimento prazos, tempo resposta, candidatos em risco
6. **Diversidade:** inclusão, gênero, região, PCD

**Report Builder:**
- Criar relatório customizado
- Selecionar métricas e filtros
- Visualização (tabela, gráfico)
- Salvar relatório

**Componentes:**
- `ReportBuilder.tsx`, `ReportTable.tsx`, `ReportChart.tsx`, `ReportFilters.tsx`, `ReportExport.tsx`, `ReportScheduler.tsx`

### 9.2 Exportação
- CSV (separador configurável)
- Excel (XLSX com formatação)
- PDF (com template)
- JSON
- Imagem (PNG/screenshot)
- Selecionar colunas, aplicar filtros, ordenação

### 9.3 Importação
**Hook:** `useImportData.ts` | **Componente:** `DataImporter.tsx`

- Upload CSV, XLSX, XLS
- Preview dos dados
- Mapeamento de colunas
- Validação com Zod schema
- Tratamento de erros por linha
- Progresso visual
- Relatório de importação

### 9.4 Agendamento de Relatórios
- Envio periódico por email
- Frequência configurável
- Destinatários múltiplos

---

## 10. INTEGRAÇÕES EXTERNAS

### 10.1 Job Boards

| Integração | Componente | Serviço |
|------------|------------|---------|
| LinkedIn | `LinkedInConnect.tsx` | `linkedinService.ts` |
| Indeed | `IndeedConnect.tsx` | `indeedService.ts` |
| Catho | `CathoConnect.tsx` | `cathoService.ts` |
| InfoJobs | `InfoJobsConnect.tsx` | `infojobsService.ts` |
| Vagas.com | `VagasConnect.tsx` | `vagasService.ts` |

**Funcionalidades por integração:**
- Conexão OAuth/API
- Publicar/atualizar vagas
- Importar candidatos/CVs
- Sincronizar status
- Analytics de publicação

**Serviço genérico:** `jobBoardService.ts`

### 10.2 Calendários

| Integração | Componente | Serviço |
|------------|------------|---------|
| Google Calendar | `GoogleCalendarConnect.tsx` | `googleCalendarService.ts` |
| Outlook | `OutlookCalendarConnect.tsx` | `outlookService.ts` |

**Funcionalidades:**
- OAuth 2.0 / Microsoft Graph API
- Criar/atualizar/deletar eventos
- Sincronização bidirecional
- Verificar disponibilidade
- Convidar participantes
- Lembretes

### 10.3 Comunicação Empresarial

| Integração | Componente | Serviço |
|------------|------------|---------|
| Slack | `SlackConnect.tsx` | `slackService.ts` |
| Microsoft Teams | `TeamsConnect.tsx` | `teamsService.ts` |

**Slack:**
- Bot token, Webhook URL
- Enviar mensagem para canal
- Notificar novo candidato e mudança de etapa
- Blocks formatados (rich messages)
- Listar canais

**Teams:**
- Graph API
- Enviar mensagens
- Criar reuniões
- Notificações, Cards adaptáveis

### 10.4 Outros
- **GitHub** — Edge function `github-api` (integração com PAT)
- **WhatsApp** — Edge function `send-whatsapp` + `whatsappService.ts`
- **Email** — Edge function `send-email` + `emailService.ts`

---

## 11. AUTENTICAÇÃO E SEGURANÇA

### 11.1 Autenticação Básica
**Contexto:** `AuthContext.tsx` | **Hook:** `useAuth.ts`

- Login com email/senha
- Registro de novos usuários
- Recuperação de senha (link por email, token com expiração)
- "Lembrar de mim"
- Verificação de email
- Logout (local + invalidar refresh token + limpar sessão)
- Cross-tab logout sync

### 11.2 Páginas de Auth
- `/auth` — AuthPage
- `/auth/login` — LoginPage
- `/auth/register` — RegisterPage
- `/auth/forgot-password` — ForgotPasswordPage
- `/auth/reset-password` — ResetPasswordPage
- `/auth/2fa` — TwoFactorAuthPage

### 11.3 Autenticação de Dois Fatores (2FA)
**Hook:** `use2FA.ts`

1. **Configuração:**
   - QR Code + chave secreta manual
   - Botão copiar chave
   - Instruções do app autenticador
2. **Verificação:** Input 6 dígitos, validação, retry
3. **Códigos de recuperação:** 10 códigos únicos, download TXT, aviso segurança
4. **Login com 2FA:** Auto-focus, inputMode="numeric", "Usar código de recuperação", "Confiar neste dispositivo"

### 11.4 Segurança Avançada
- **WebAuthn** (`useWebAuthn.ts`) — Biometria/hardware, registrar/login/gerenciar dispositivos
- **Dispositivos Confiáveis** (`TrustedDevices.tsx`) — Lista, registro, última atividade, remover, notificação novo dispositivo
- **Detecção Novo Dispositivo** (`NewDeviceDetector.tsx`) — Detectar, enviar código, confirmar via email/SMS, adicionar confiáveis
- **Rate Limiting** (`useRateLimiter.ts`) — Limite requisições, bloqueio temporário, feedback visual, contador regressivo
- **Session Management** (`useSessionTimeout.ts`) — Refresh automático, detecção expiração, renovação, logout inatividade, cross-tab sync
- **Password Breach Check** — Verificar HaveIBeenPwned, alerta, forçar troca
- **IP Verification** (`useIPVerification.ts`) — IP whitelist, edge function `ip-guard`
- **Geo Verification** — Edge function `geo-check`, allowed countries
- **Login Lockout** — Bloqueio após tentativas falhas
- **Reautenticação** — Para ações sensíveis

### 11.5 Controle de Acesso
- **Roles:** admin, rh, gestor, viewer
- **Tabela:** `user_roles` (separada de profiles)
- **Permissões por role** (matriz CRUD)
- **Hook:** `usePermissions.ts`
- **Contexto:** `PermissionContext.tsx`
- **RLS** (Row Level Security) em todas as tabelas
- **Audit Logs** (`useAuditLogs.ts`) — Registro de todas ações: usuário, ação, entidade, timestamp, IP, user agent

### 11.6 Segurança de Infraestrutura
- Security Headers (CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- Sanitização de dados contra XSS
- Validação de upload (tipo, tamanho)
- Validadores e schemas Zod

---

## 12. PORTAL DO CANDIDATO

### 12.1 Autenticação
**Contexto:** `CandidatoAuthContext.tsx` | **Rota protegida:** `PortalProtectedRoute.tsx`

- Login do candidato (`/portal`)
- Registro
- Recuperação de senha

### 12.2 Dashboard (`/portal/dashboard`)
- Candidaturas ativas com status
- Próximas etapas
- Entrevistas agendadas
- Mensagens recebidas
- Histórico de ações

### 12.3 Vagas (`/portal/vagas`)
- Lista de vagas abertas
- Filtros (área, localização, tipo)
- Busca por palavra-chave
- Ver detalhes
- Candidatar-se com um clique

### 12.4 Perfil (`/portal/perfil`)
**Seções editáveis:**
- Dados pessoais e Contato
- Experiência profissional
- Formação acadêmica
- Skills
- Idiomas
- Upload de currículo
- Foto

### 12.5 Notificações do Candidato
**Tabela:** `notificacoes_candidato`
- Notificações de status de candidatura
- Convites para entrevista
- Alertas gerais

---

## 13. ADMINISTRAÇÃO

### 13.1 Painel Admin (`/admin`)
**Página:** `AdminPage.tsx`

- Visão geral do sistema
- Métricas de uso
- Usuários ativos
- Saúde do sistema

### 13.2 Gestão de Usuários
- Listar, Criar, Editar, Desativar/ativar
- Resetar senha, Forçar logout
- Atribuir roles
- Campos: Nome, Email, Role, Departamento, Status, 2FA ativo, Último login

### 13.3 Gestão de Roles (`/security/roles`)
**Página:** `RolesPage.tsx` | **Componente:** `RoleManager.tsx`

### 13.4 Rate Limit Dashboard (`/security/rate-limit`)
**Página:** `RateLimitDashboard.tsx`

### 13.5 Configurações de Segurança (`/configuracoes/seguranca`)
**Página:** `SecuritySettingsPage.tsx`

### 13.6 Audit Logs
**Componente:** `AuditLogViewer.tsx` | **Hook:** `useAuditLogs.ts`

- Registro de todas as ações
- Filtro por usuário, ação, data
- Detalhes da ação

### 13.7 GDPR
**Componentes:** `GDPRConsent.tsx`, `DataRetentionSettings.tsx` | **Serviço:** `gdprService.ts`

### 13.8 SLA
**Componentes:** `SLAConfig.tsx`, `SLADashboard.tsx`

### 13.9 SSO (Single Sign-On)
**Componente:** `SSOSettings.tsx`

### 13.10 White Label Settings
**Componente:** `WhiteLabelSettings.tsx`

### 13.11 Configurações Gerais
- Nome empresa, Logo, Cores, Timezone, Idioma, Formato data
- SMTP (host, porta, credenciais, email remetente, template base)
- Notificações (push, email, frequência digest)

---

## 14. WORKFLOWS E AUTOMAÇÕES

### 14.1 Editor de Workflow (`/workflows`)
**Página:** `WorkflowEditorPage.tsx` | **Biblioteca:** ReactFlow

- Editor visual
- Nodes arrastáveis com conexões
- Salvamento de workflow

### 14.2 Tipos de Nodes (5)

1. **TriggerNode** — Gatilhos: Nova candidatura, Mudança etapa, Entrevista agendada, Teste concluído, SLA vencendo, Manual
2. **ActionNode** — Ações: Enviar email, SMS, Slack, Mover etapa, Adicionar tag, Criar tarefa, Webhook
3. **ConditionNode** — Decisões: If/else, Match score > X, Dias > Y, Origem == Z, Tag contém
4. **DelayNode** — Aguardar: X min/horas/dias, Até horário, Até dia da semana
5. **WebhookNode** — Método HTTP, URL, Headers, Body template, Timeout, Retry, Validação URL, Status enabled/disabled

### 14.3 Automações Pré-definidas
1. Email de boas-vindas (nova candidatura → email confirmação)
2. Lembrete de entrevista (24h antes → email + SMS)
3. Alerta de SLA (80% consumido → notificar recrutador)
4. Feedback automático (reprovado → delay 2h → email agradecimento)
5. Escalação (dias > SLA → notificar gestor)

### 14.4 Engine de Workflow
**Serviço:** `workflowEngine.ts` | **Hook:** `useWorkflow.ts`

---

## 15. NOTIFICAÇÕES

### 15.1 Sistema de Notificações
**Contexto:** `NotificationContext.tsx` | **Hook:** `useRealtimeNotifications.ts` | **Tabela:** `notifications`

- Notification Panel
- Tempo real (Realtime/Supabase)
- Marcar como lida / todas como lidas
- Limpar notificações
- Indicador de não lidas (badge)
- Reconexão automática

### 15.2 Push Notifications
**Hook:** `usePushNotifications.ts`

- Push no navegador
- Permissão do usuário
- Configuração por tipo

### 15.3 Tipos de Notificação
- Nova candidatura
- Candidato moveu etapa
- Entrevista agendada
- Teste concluído
- Alerta de SLA
- Menção em comentário

---

## 16. MULTI-TENANT E WHITE LABEL

### 16.1 Multi-Tenant
**Hook:** `useTenant.ts` | **Contexto:** `TenantContext.tsx`

- Current tenant
- Switch entre tenants
- Tenant persistido
- Isolamento de dados (RLS + tenant_id)
- Filtro automático por tenant

### 16.2 White Label
**Hook:** `useWhiteLabel.ts` | **Tipo:** `whiteLabel.ts`

- Nome empresa
- Logo (URL)
- Favicon
- Cores primárias/secundárias
- Fontes
- Domínio personalizado
- CSS Variables dinâmicas
- Theme provider

### 16.3 Planos
- Diferentes níveis de plano
- Limites por plano
- Feature flags

---

## 17. ACESSIBILIDADE E UX

### 17.1 A11y (Acessibilidade)
- ARIA labels em todos os componentes
- Roles semânticos
- Navegação por teclado
- aria-live para conteúdo dinâmico
- aria-hidden em ícones decorativos
- **Skip Links** (`SkipLinks.tsx`)
- **Focus Trap** (`useFocusTrap.ts`)
- **Reduced Motion** (`useReducedMotion.ts`)
- **Screen Reader Announcements** (`useAnnounce.ts`, `LiveRegion.tsx`)
- **Visually Hidden** (`VisuallyHidden.tsx`)
- Contraste adequado
- Focus indicators

### 17.2 Feedback Visual
- Loading states (skeletons)
- Empty States com ícone, título, descrição, ação
- Mensagens de erro
- Toasts de sucesso (Sonner)
- Progresso de operações
- Indicadores de tendência

### 17.3 Navegação
- Sidebar com navegação principal (colapsável)
- **Command Menu** (Ctrl+K / Cmd+K) — Ir para página, buscar candidato/vaga, criar, agendar
- **Command Palette**
- Breadcrumbs
- NavLink ativo
- Page title dinâmico (`useDocumentTitle.ts`)

### 17.4 Responsividade
- Layout responsivo
- Mobile-first
- Sidebar colapsável
- Tabelas responsivas
- Detecção mobile (`useMobile.ts`)

### 17.5 Onboarding
**Componente:** `OnboardingProvider.tsx` | **Hook:** `useOnboarding.ts`

- Tour guiado com steps
- Spotlight no elemento
- Tooltip com instruções
- Navegação (próximo/anterior)
- Skip tour
- Progresso salvo

### 17.6 Dark Mode
- Suporte dark/light/system
- `next-themes` integration

### 17.7 Offline Fallback
**Componente:** `OfflineFallback.tsx`

- Detectar offline/online
- Mostrar dados em cache
- Última sincronização
- Botão retry
- Animação reconexão

---

## 18. FUNCIONALIDADES CRUD AVANÇADAS

### 18.1 Busca e Filtros
- Busca fulltext em múltiplos campos
- Debounce 300ms
- Mínimo 2 caracteres
- Filtros avançados por campo, data (range), status, origem
- Highlight de resultados

### 18.2 Filtros Salvos
**Hook:** `useSavedFilters.ts` | **Componente:** `SavedFiltersDropdown.tsx`

- Salvar filtro com nome
- Listar, Aplicar, Atualizar, Deletar
- Definir filtro padrão
- Por usuário e entidade

### 18.3 Paginação e Scroll
- Paginação tradicional
- Infinite Scroll (`useInfiniteScroll` / `useIntersectionObserver.ts`)
- Ordenação multi-coluna
- Limite por página configurável

### 18.4 Versionamento
**Hook:** `useVersions.ts`

- Histórico de versões
- Visualizar versão específica
- Comparar versões
- Restaurar versão anterior
- Registro de quem alterou

### 18.5 Soft Delete e Restore
- Exclusão lógica (deleted_at)
- Lixeira com itens excluídos
- Restauração de itens
- Exclusão permanente

### 18.6 Duplicação
**Hook:** `useDuplicate.ts`

- Duplicar qualquer entidade
- Sufixo "(Cópia)"
- Novo ID gerado
- Redirecionar para novo

### 18.7 Seleção em Massa
**Hook:** `useBulkSelection.ts`

- Selecionar/desselecionar item
- Selecionar todos
- Toggle seleção
- Limpar seleção
- Verificar se selecionado

### 18.8 Ações em Lote
**Hook:** `useBulkActions.ts` | **Componente:** `BulkActionsBar.tsx`

- Processar múltiplos itens
- Progresso individual
- Controle de concorrência
- Retry em falhas
- Relatório final

### 18.9 Busca Avançada
**Hook:** `useAdvancedSearch.ts`

- Busca fulltext combinada com filtros
- Debounce, Mínimo 2 chars
- Highlight de resultados

### 18.10 Exportação de Dados
**Hook:** `useExportData.ts` | **Serviço:** `exportService.ts`

- CSV, Excel, PDF, JSON, Imagem
- Selecionar colunas, filtros, ordenação

---

## 19. GAMIFICAÇÃO

**Rota:** `/gamification`  
**Página:** `GamificationPage.tsx`  
**Tabelas:** `user_gamification`, `user_achievements`, `xp_transactions`, `user_badges`

- Sistema de XP (pontos de experiência)
- Níveis de progressão
- Badges/Conquistas
- Achievements desbloqueáveis
- Leaderboard de recrutadores

---

## 20. AVALIAÇÕES COMPORTAMENTAIS

### 20.1 Assessments (`/avaliacoes-comportamentais`)
**Página:** `BehavioralAssessmentsPage.tsx`

### 20.2 Assessment Individual (`/avaliacao-comportamental`)
**Página:** `BehavioralAssessmentPage.tsx`

**14 Ferramentas:**
- DISC
- Big Five (OCEAN)
- MBTI
- Eneagrama
- Inteligência Emocional
- Resiliência
- Liderança
- Comunicação
- Adaptabilidade
- Pensamento Crítico
- Orientação a Resultados
- Colaboração
- Proatividade
- Integridade

**Tabelas:** `behavioral_assessment_results`, `avaliacoes_comportamentais_resultados`, `assessments`, `assessment_questoes`, `assessment_respostas`

**Funcionalidades:**
- Questões por dimensão
- Score por pilar
- Fit cultural (0-100%)
- Potencializadores e riscos
- Consistência interna
- Detecção de respostas socialmente desejáveis

---

## 21. OFERTAS

**Rota:** `/ofertas`  
**Página:** `OfferManagementPage.tsx`

- Gestão de propostas de emprego
- Criação e envio de ofertas
- Acompanhamento de status

---

## 22. FERRAMENTAS ESTRATÉGICAS DE R&S

### 22.1 Job Fit
- Cálculo de compatibilidade 0-100% entre candidato e vaga
- Breakdown por categorias
- Recomendação automática

### 22.2 Comparativo de Candidatos
- Visualização lado a lado
- Gráficos de radar
- Critérios comparados

### 22.3 Red Flags
- Detecção automática de 8 tipos de riscos
- Sugestões de perguntas para entrevista

### 22.4 Relatório Executivo
- Resumo consolidado para tomada de decisão gerencial
- Exportação para stakeholders

### 22.5 Deu Match (`/deu-match`)
**Página:** `DeuMatchPage.tsx`

- Quiz de cultural fit
- Valores culturais
- Matching candidato-empresa

### 22.6 Portal Gestor (`/gestor`)
**Página:** `HiringManagerPortalPage.tsx`

- Portal para gestores de contratação
- Visão simplificada do pipeline
- Aprovação de candidatos
- Feedback de entrevistas

---

## 23. EDGE FUNCTIONS (BACKEND)

| Função | Endpoint | Propósito |
|--------|----------|-----------|
| `match-score` | POST | Cálculo de match score com IA |
| `parse-resume` | POST | Parser de currículo com IA |
| `send-email` | POST | Envio de emails |
| `send-whatsapp` | POST | Envio de WhatsApp |
| `ip-guard` | POST | Verificação de IP |
| `geo-check` | POST | Verificação geográfica |
| `github-api` | POST | Integração GitHub |
| `health` | GET | Health check |
| `generate-scorecard` | POST | Geração de scorecard |
| `interview-reminders` | POST | Lembretes de entrevista |
| `new-device-alert` | POST | Alerta de novo dispositivo |
| `password-reset-approval` | POST | Aprovação de reset de senha |

---

## 24. HOOKS CUSTOMIZADOS

### Data Fetching
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
| `useDashboardData` | Dashboard (alternativo) |
| `useAnalytics` | Analytics |
| `useAuditLogs` | Logs de auditoria |
| `useTalentPool` | Talent pool |
| `useViews` | Views customizadas |
| `useScorecard` | Scorecard avaliação |

### CRUD Avançados
| Hook | Propósito |
|------|-----------|
| `useSavedFilters` | Filtros salvos |
| `useImportData` | Importação CSV/Excel |
| `useExportData` | Exportação de dados |
| `useVersions` | Versionamento |
| `useAdvancedSearch` | Busca avançada |
| `useInfiniteScroll` | Scroll infinito |
| `useBulkActions` | Ações em lote |
| `useBulkSelection` | Seleção múltipla |
| `useDuplicate` | Duplicação de registros |

### Security
| Hook | Propósito |
|------|-----------|
| `useAuth` | Autenticação principal |
| `use2FA` | Two-factor authentication |
| `useIPVerification` | Verificação de IP |
| `useSessionTimeout` | Timeout de sessão |
| `usePermissions` | Permissões de usuário |
| `useWebAuthn` | Autenticação biométrica |
| `useTrustedDevices` | Dispositivos confiáveis |
| `useNewDeviceDetection` | Detecção novo dispositivo |
| `useRateLimiter` | Rate limiting |

### Feature
| Hook | Propósito |
|------|-----------|
| `useWorkflow` | Workflow automation |
| `useWhiteLabel` | White label settings |
| `useTenant` | Multi-tenancy |
| `useRealtimeNotifications` | Notificações realtime |
| `usePushNotifications` | Push notifications |
| `useOnboarding` | Onboarding tour |

### UI/UX
| Hook | Propósito |
|------|-----------|
| `useDebounce` | Debounce de valores |
| `useDocumentTitle` | Título do documento |
| `usePageTitle` | Título da página |
| `useMobile` | Detecção mobile |
| `useToast` | Toasts |
| `useFocusTrap` | Focus trap |
| `useReducedMotion` | Reduced motion |
| `useAnnounce` | Screen reader announcements |

---

## 25. SERVICES

| Serviço | Propósito |
|---------|-----------|
| `aiService.ts` | Integração com IA |
| `autoSchedulingService.ts` | Agendamento automático |
| `cacheService.ts` | Cache de dados |
| `cathoService.ts` | Integração Catho |
| `emailService.ts` | Envio de emails |
| `exportService.ts` | Exportação de dados |
| `gdprService.ts` | Conformidade GDPR |
| `googleCalendarService.ts` | Google Calendar |
| `importService.ts` | Importação de dados |
| `indeedService.ts` | Integração Indeed |
| `infojobsService.ts` | Integração InfoJobs |
| `ipService.ts` | Verificação de IP |
| `jobBoardService.ts` | Job boards genérico |
| `linkedinService.ts` | Integração LinkedIn |
| `logger.ts` | Logging |
| `matchingService.ts` | Matching de candidatos |
| `meetingService.ts` | Meetings |
| `outlookService.ts` | Integração Outlook |
| `reportingService.ts` | Geração de relatórios |
| `slackService.ts` | Integração Slack |
| `teamsService.ts` | Integração Teams |
| `vagasService.ts` | Integração Vagas.com |
| `whatsappService.ts` | Envio de WhatsApp |
| `workflowEngine.ts` | Engine de workflow |
| `passwordBreachService.ts` | Verificação senha vazada |
| `passwordResetService.ts` | Reset de senha |
| `gamificationTriggers.ts` | Triggers de gamificação |

---

## 26. COMPONENTES COMUNS

### Feedback
- `ErrorBoundary.tsx` — Captura erros, UI fallback, retry, HOC
- `LoadingSkeleton.tsx` — Card, List, Table, Profile variants
- `EmptyState.tsx` — Ícone, título, descrição, ações
- `ConfirmDialog.tsx` — Tipo (info/warning/danger), loading state

### Dados
- `StatusBadge.tsx` — 8 status com cores
- `MatchScoreBadge.tsx` — Cores por range (80-100 verde, 60-79 amarelo, etc.)
- `MatchScoreCard.tsx` — Componente completo com breakdown

### Navegação
- `CommandMenu.tsx` — Ctrl+K, busca global
- `NotificationPanel.tsx` — Lista, marcar lida, realtime
- `OnboardingTour.tsx` — Steps guiados, spotlight, progresso

### UI Components (shadcn/ui)
- Button, Input, Select, Textarea
- Card, Dialog, Sheet, Popover
- Table, Badge, Avatar
- Progress, Skeleton
- Alert, Toast, Sonner
- Tabs, Accordion
- Calendar, DatePicker
- Command, DropdownMenu
- Form (React Hook Form + Zod)

---

## 27. INFRAESTRUTURA E DEVOPS

| Aspecto | Detalhes |
|---------|----------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Estilização | TailwindCSS |
| Componentes | shadcn/ui |
| State Management | TanStack Query |
| Roteamento | React Router DOM |
| Backend | Lovable Cloud (Supabase) |
| Formulários | React Hook Form + Zod |
| Drag & Drop | @dnd-kit |
| Gráficos | Recharts |
| Workflows | ReactFlow |
| i18n | i18next |
| Datas | date-fns |
| Temas | next-themes |
| Testes | Vitest + Playwright |
| Monitoring | Sentry, Web Vitals, Vercel Speed Insights |
| Performance | Code splitting (lazy loading), staleTime 5min |

### Variáveis de Ambiente Necessárias
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`
- `VITE_LINKEDIN_CLIENT_ID`
- `VITE_GOOGLE_CLIENT_ID`
- `VITE_SLACK_CLIENT_ID`
- `VITE_TEAMS_CLIENT_ID`
- `GITHUB_PAT` (secret)

---

## 28. TESTES

### E2E (Playwright) — 50+ specs
- 2fa, accessibility, admin-page, agenda-page, analytics-dashboard
- auth, avaliacao-form, bulk-operations, candidato-perfil, candidatos-page
- clipboard, comunicacao, dark-mode, dashboard-page, dashboard-widgets
- deep-linking, drag-drop, error-handling, export, file-upload
- filtering, form-validation, home-page, indicacoes, infinite-scroll
- job-publisher, keyboard-shortcuts, localization, mobile, navigation
- not-found, offline, pagination, performance, pipeline
- portal-auth, portal-dashboard, portal-home, portal-perfil, portal-vagas
- print, prova-aplicacao, prova-editor, provas, relatorios

### Unitários (Vitest) — 200+ files
- Hooks, Services, Utils, Components

---

## 29. BANCO DE DADOS

### Tabelas Principais
| Tabela | Propósito |
|--------|-----------|
| `candidatos` | Cadastro de candidatos |
| `candidatos_auth` | Autenticação candidatos portal |
| `candidaturas` | Candidaturas a vagas |
| `vagas` | Cadastro de vagas |
| `processos_seletivos` | Processos seletivos |
| `entrevistas` | Entrevistas agendadas |
| `provas` | Banco de provas |
| `questoes` | Questões das provas |
| `resultados_provas` | Resultados das provas |
| `baterias_provas` | Baterias de provas |
| `bateria_provas_rel` | Relação bateria-prova |
| `avaliacoes` | Avaliações de candidatos |
| `indicacoes` | Indicações de candidatos |
| `comunicacoes` | Histórico de comunicações |
| `email_templates` | Templates de email |
| `match_scores` | Scores de matching |
| `notifications` | Notificações sistema |
| `notificacoes_candidato` | Notificações portal candidato |
| `profiles` | Perfis de usuários |
| `user_roles` | Papéis de usuários |
| `role_permissions` | Permissões por role |
| `permissions` | Lista de permissões |
| `historico_etapas` | Histórico movimentações |
| `notas_candidatos` | Notas internas |
| `documentos_candidatos` | Documentos anexos |
| `competencias` | Competências |
| `criterios_selecao` | Critérios seleção |
| `perfis_cargo` | Perfis de cargo |
| `perfil_valores` | Valores por perfil |
| `valores_culturais` | Valores culturais |
| `comparativos_candidatos` | Comparativos |
| `assessments` | Assessments comportamentais |
| `assessment_questoes` | Questões assessment |
| `assessment_respostas` | Respostas assessment |
| `behavioral_assessment_results` | Resultados comportamentais |
| `avaliacoes_comportamentais_resultados` | Resultados avaliação comportamental |
| `perfis_comportamentais_empresa` | Perfis empresa |
| `entrevista_respostas` | Respostas entrevista |
| `templates_entrevista` | Templates entrevista |
| `template_perguntas` | Perguntas template |
| `user_gamification` | Gamificação usuário |
| `user_achievements` | Conquistas |
| `xp_transactions` | Transações XP |
| `user_badges` | Badges |
| `login_attempts` | Tentativas login |
| `blocked_ips` | IPs bloqueados |
| `allowed_ips` | IPs permitidos |
| `allowed_countries` | Países permitidos |
| `ip_access_logs` | Logs acesso IP |
| `geo_access_logs` | Logs acesso geográfico |
| `password_reset_tokens` | Tokens reset senha |
| `password_reset_requests` | Requisições reset |
| `saved_filters` | Filtros salvos |

### Storage Buckets
| Bucket | Propósito |
|--------|-----------|
| `curriculos` | Armazenamento de currículos |

---

## 📊 CHECKLIST FINAL

### ✅ Módulos Core
- [x] Dashboard com KPIs e insights
- [x] Gestão completa de vagas (CRUD + publicação)
- [x] Gestão completa de candidatos (CRUD + perfil 13 seções)
- [x] Pipeline Kanban com drag-and-drop
- [x] Agenda e entrevistas com calendário
- [x] Sistema de testes e provas
- [x] Comunicação multicanal
- [x] Relatórios e analytics
- [x] Portal do candidato

### ✅ IA e Automação
- [x] Match Score com IA
- [x] Parser de currículo com IA
- [x] Smart Insights
- [x] Workflows visuais (ReactFlow)
- [x] Automações pré-definidas

### ✅ Segurança
- [x] Auth básica + 2FA + WebAuthn
- [x] Roles e permissões (tabela separada)
- [x] Rate limiting
- [x] IP/Geo verification
- [x] Password breach check
- [x] Session management
- [x] Audit logs
- [x] RLS em todas as tabelas

### ✅ Integrações
- [x] Job boards (LinkedIn, Catho, Indeed, InfoJobs, Vagas.com)
- [x] Calendários (Google Calendar, Outlook)
- [x] Comunicação (Slack, Teams, WhatsApp, Email)
- [x] GitHub

### ✅ Enterprise
- [x] Multi-tenant
- [x] White label
- [x] GDPR compliance
- [x] SLA management
- [x] SSO
- [x] Gamificação

### ✅ UX/A11y
- [x] Acessibilidade completa (ARIA, Skip Links, Focus Trap, Reduced Motion)
- [x] Dark mode
- [x] Responsivo/Mobile-first
- [x] Onboarding tour
- [x] Command menu (Ctrl+K)
- [x] Offline fallback
- [x] i18n

### ✅ CRUD Avançado
- [x] Filtros salvos
- [x] Versionamento
- [x] Soft delete/restore
- [x] Duplicação
- [x] Bulk actions/selection
- [x] Import/Export (CSV, Excel, PDF, JSON)
- [x] Infinite scroll
- [x] Busca avançada fulltext

---

**Total: 400+ funcionalidades especificadas**

---

*Documento gerado em 15/03/2026 a partir da análise exaustiva dos documentos de especificação MATCH_ATS_ESPECIFICACAO_COMPLETA.md, MATCH_ATS_FUNCIONALIDADES_COMPLETAS.md e SYSTEM_FEATURES.md.*
