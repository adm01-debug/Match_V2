# Developer Onboarding - Match ATS

## Day 1 Setup

### Prerequisites
- Node.js 20+
- pnpm
- Git

### Clone & Install
```bash
git clone https://github.com/adm01-debug/match.git
cd match
pnpm install
```

### Environment
```bash
cp .env.example .env.local
# Fill in Supabase credentials
```

### Run
```bash
pnpm dev        # Development server
pnpm test       # Run tests
pnpm storybook  # Component library
```

## Architecture Overview
- `/src/components` - React components
- `/src/pages` - Route pages
- `/src/hooks` - Custom hooks
- `/src/lib` - Utilities
- `/supabase` - Database & functions

## Key Contacts
- Tech Lead: [Name]
- Product: [Name]
