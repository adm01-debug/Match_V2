# Testing Guide

## Overview

Match ATS uses a comprehensive testing strategy with unit tests, integration tests, and end-to-end tests.

## Testing Stack

- **Vitest** - Unit and integration testing
- **Testing Library** - React component testing
- **Playwright** - End-to-end testing
- **MSW** - API mocking

## Running Tests

```bash
# Unit tests (watch mode)
npm run test

# Unit tests (single run)
npm run test:run

# Unit tests with coverage
npm run test:coverage

# E2E tests
npm run test:e2e

# E2E tests (UI mode)
npx playwright test --ui
```

## Test Structure

```
src/
├── hooks/*.test.ts       # Hook tests
├── components/**/*.test.tsx  # Component tests
├── pages/*.test.tsx      # Page tests
├── lib/*.test.ts         # Utility tests
├── services/*.test.ts    # Service tests
└── mocks/                # MSW handlers
    ├── handlers.ts
    ├── browser.ts
    └── server.ts

e2e/
├── auth.spec.ts          # Authentication tests
├── vagas.spec.ts         # Jobs tests
├── candidatos.spec.ts    # Candidates tests
└── ...
```

## Writing Tests

### Unit Tests

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';

describe('useMyHook', () => {
  it('should return expected value', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current).toBeDefined();
  });
});
```

### Component Tests

```typescript
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

### E2E Tests

```typescript
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/auth');
  await page.fill('input[type="email"]', 'user@example.com');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

## Mocking

We use MSW (Mock Service Worker) for API mocking. Handlers are defined in `src/mocks/handlers.ts`.

```typescript
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/vagas', () => {
    return HttpResponse.json([{ id: '1', titulo: 'Dev' }]);
  }),
];
```

## Coverage Goals

| Metric | Target |
|--------|--------|
| Statements | 60%+ |
| Branches | 50%+ |
| Functions | 60%+ |
| Lines | 60%+ |

## Best Practices

1. **Test behavior, not implementation**
2. **Use meaningful test names**
3. **Keep tests isolated**
4. **Mock external dependencies**
5. **Test edge cases**
6. **Maintain test data**
