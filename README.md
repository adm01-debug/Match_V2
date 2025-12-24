# Match ATS

[![CI](https://github.com/adm01-debug/match/actions/workflows/ci.yml/badge.svg)](https://github.com/adm01-debug/match/actions/workflows/ci.yml)
[![E2E Tests](https://github.com/adm01-debug/match/actions/workflows/e2e.yml/badge.svg)](https://github.com/adm01-debug/match/actions/workflows/e2e.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)


## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)


## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia nosso [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre nosso código de conduta e o processo para enviar pull requests.

### Como contribuir

1. Faça um Fork do projeto
2. Crie sua Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a Branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

### Padrões de código

- Use TypeScript para todo código novo
- Siga as convenções do ESLint configurado
- Escreva testes para novas funcionalidades
- Mantenha a cobertura de código acima de 80%

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.


## ✨ Features

- 📋 **Pipeline de Recrutamento** - Kanban visual para gerenciar candidatos
- 👥 **Gestão de Candidatos** - Perfis completos com histórico
- 📅 **Agendamento de Entrevistas** - Integração com calendário
- 📝 **Sistema de Provas** - Avaliações técnicas automatizadas
- 📊 **Analytics & Dashboards** - Métricas em tempo real
- 🔔 **Comunicação Integrada** - Email e WhatsApp
- 🤖 **Match Score IA** - Ranking inteligente de candidatos
- 🌐 **Portal do Candidato** - Acompanhamento de candidaturas


## 🚀 Installation

```bash
# Clone o repositório
git clone https://github.com/adm01-debug/match.git
cd match

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```


## 📡 API

### Edge Functions

| Endpoint | Descrição |
|----------|-----------|
| `/functions/v1/match-score` | Calcula score de compatibilidade |
| `/functions/v1/parse-resume` | Parser de currículos |
| `/functions/v1/send-email` | Envio de emails |
| `/functions/v1/send-whatsapp` | Envio de WhatsApp |

### Database

Utilizamos Supabase (PostgreSQL) com RLS (Row Level Security) habilitado.


## 🏗️ Architecture

```
├── src/
│   ├── components/     # Componentes React
│   ├── hooks/          # Custom hooks
│   ├── pages/          # Páginas da aplicação
│   ├── services/       # Serviços e APIs
│   ├── contexts/       # Context providers
│   └── lib/            # Utilitários
├── supabase/
│   ├── functions/      # Edge functions
│   └── migrations/     # Database migrations
├── e2e/                # Testes E2E
└── docs/               # Documentação
```

