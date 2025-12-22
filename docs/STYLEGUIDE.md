# Style Guide

## Code Style

### TypeScript
- Use strict mode
- Prefer `const` over `let`
- Use explicit types for function parameters
- Use interfaces over types for objects

### React
- Use functional components with hooks
- Use React.memo() for expensive renders
- Use useMemo/useCallback for optimizations
- Follow naming conventions: PascalCase for components

### CSS/Tailwind
- Use Tailwind utility classes
- Follow mobile-first approach
- Use semantic color tokens
- Avoid inline styles

## File Structure
```
src/
├── components/     # Reusable components
├── pages/          # Route pages
├── hooks/          # Custom hooks
├── lib/            # Utilities
├── types/          # TypeScript types
└── contexts/       # React contexts
```

## Naming Conventions
- Components: PascalCase (Button.tsx)
- Hooks: camelCase with 'use' prefix (useAuth.ts)
- Utils: camelCase (formatDate.ts)
- Types: PascalCase (User.ts)

## Git Commits
Follow conventional commits:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting
- refactor: Code restructure
- test: Tests
- chore: Maintenance
