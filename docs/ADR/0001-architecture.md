# ADR 0001: Architecture Decision - React + Supabase

## Status
Accepted

## Context
Need a modern, scalable ATS (Applicant Tracking System) with real-time capabilities.

## Decision
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Auth + Realtime + Edge Functions)
- **UI**: shadcn/ui + Tailwind CSS
- **State**: TanStack Query + Context API
- **Testing**: Vitest + Playwright + Storybook

## Consequences
- Fast development with type safety
- Real-time subscriptions out of the box
- Serverless edge functions for custom logic
- Component-driven development with Storybook
