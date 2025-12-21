# Match ATS Documentation

Welcome to the Match ATS documentation. This guide will help you understand, develop, and deploy the application.

## 📚 Documentation Index

### Getting Started

- [Architecture](./ARCHITECTURE.md) - System architecture and design decisions
- [Development](./DEVELOPMENT.md) - Development environment setup and guidelines
- [Testing](./TESTING.md) - Testing strategy and best practices
- [Deployment](./DEPLOYMENT.md) - Deployment procedures and configuration
- [API](./API.md) - API documentation and edge functions

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/adm01-debug/match.git

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 🏗️ Project Structure

```
match/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Route pages
│   ├── hooks/          # Custom React hooks
│   ├── contexts/       # React contexts
│   ├── services/       # API services
│   ├── lib/            # Utilities
│   ├── types/          # TypeScript types
│   └── integrations/   # External integrations
├── supabase/
│   ├── functions/      # Edge functions
│   └── migrations/     # Database migrations
├── e2e/                # E2E tests
├── docs/               # Documentation
└── public/             # Static assets
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS, shadcn/ui
- **State Management**: TanStack Query
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Testing**: Vitest, Playwright, MSW

## 📖 Additional Resources

- [Contributing Guidelines](../CONTRIBUTING.md)
- [Code of Conduct](../CODE_OF_CONDUCT.md)
- [Security Policy](../SECURITY.md)
- [Changelog](../CHANGELOG.md)

## 🤝 Support

For questions or support, please open an issue on GitHub.
