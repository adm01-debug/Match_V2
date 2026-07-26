# 🎯 Match ATS

**Sistema de Gestão de Candidatos (ATS) completo e moderno**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC)](https://tailwindcss.com/)

## ✨ Funcionalidades

### Core
- 📝 Gestão de vagas e candidatos
- 🔄 Pipeline visual de recrutamento (Kanban)
- 📊 Dashboard de analytics
- 🔍 Busca e filtros avançados

### Autenticação & Segurança
- 🔐 Autenticação com 2FA (TOTP)
- 🔑 SSO (SAML 2.0 / OIDC)
- 🛡️ Conformidade LGPD

### Integrações
- **Job Boards**: LinkedIn, Indeed, Catho, Vagas.com.br, InfoJobs
- **Calendários**: Google Calendar, Outlook Calendar
- **Comunicação**: Slack, Microsoft Teams
- **IA**: Parser de currículos, Match Score

### Automação
- ⚙️ Editor de workflows visual (React Flow)
- 🔔 Notificações automáticas
- 📅 Agendamento de entrevistas

## 🚀 Instalação

```bash
git clone https://github.com/adm01-debug/match.git
cd match
npm install
npm run dev
```

### Dependências Adicionais

```bash
npm install reactflow qrcode.react xlsx @react-pdf/renderer workbox-window
npm install -D @chromatic-com/storybook
```

## 📁 Estrutura

```
src/
├── components/
│   ├── admin/        # Configurações
│   ├── analytics/    # Dashboards
│   ├── auth/         # Autenticação
│   ├── common/       # Compartilhados
│   ├── ia/           # IA features
│   ├── integrations/ # Conectores
│   ├── reports/      # Relatórios
│   └── workflow/     # Automações
├── hooks/            # Custom hooks
├── services/         # APIs
└── pages/            # Páginas
```

## 📚 Documentação

### 🔎 Acesso rápido
- 🏁 [Benchmark GeekHunter — análise em 20 etapas](docs/BENCHMARK_GEEKHUNTER.md)
- 🗺️ [Plano de Melhorias — 50 etapas](docs/PLANO_MELHORIAS_50_ETAPAS.md)

### Demais documentos
- [Auditoria Enterprise 10/10 (Markdown)](audit_report.md)
- [Auditoria Enterprise 10/10 (PDF)](audit_report.pdf)
- [API Reference](docs/API_REFERENCE.md)
- [Webhooks](docs/WEBHOOKS.md)
- [SDK](docs/SDK.md)

## 🛠️ Stack

React 18 • TypeScript • Vite • Tailwind • shadcn/ui • TanStack Query • Supabase

---

**Desenvolvido com ❤️**
