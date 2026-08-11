# Match ATS - Architecture

## Overview

Match ATS is a modern Applicant Tracking System built with React, TypeScript, and Supabase.

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS, shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **Testing**: Vitest, Playwright, MSW

## Project Structure

```
src/
├── components/    # Reusable UI components
├── hooks/         # Custom React hooks
├── pages/         # Route pages
├── contexts/      # React contexts
├── services/      # API services
├── lib/           # Utilities
├── types/         # TypeScript types
└── integrations/  # External integrations
```

## Key Patterns

1. **React Query** for server state management
2. **Custom hooks** for data fetching
3. **Context providers** for global state
4. **Component composition** with shadcn/ui
