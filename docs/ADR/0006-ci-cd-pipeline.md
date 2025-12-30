# ADR 0006: CI/CD Pipeline Strategy

## Status
Accepted

## Context
O Match ATS requer um pipeline de CI/CD robusto para garantir qualidade, segurança e deploys consistentes.

## Decision

### Pipeline Structure

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Commit    │───▶│    Build    │───▶│    Test     │───▶│   Deploy    │
│   Trigger   │    │   & Lint    │    │   Suite     │    │   Stages    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

### Stages

1. **Build & Lint**
   - TypeScript compilation
   - ESLint + Prettier
   - Bundle size check (bundlewatch)

2. **Test Suite**
   - Unit tests (Vitest)
   - E2E tests (Playwright)
   - Accessibility tests (axe-core)
   - Visual regression (Chromatic)

3. **Security**
   - CodeQL analysis
   - Dependency audit
   - SAST scanning

4. **Deploy**
   - Preview deployments (PRs)
   - Staging (develop branch)
   - Production (main branch)

### Environments

| Environment | Branch | Auto-deploy | Approval |
|-------------|--------|-------------|----------|
| Preview | PR branches | Yes | No |
| Staging | develop | Yes | No |
| Production | main | Yes | Required |

### Quality Gates

- Code coverage > 80%
- No critical vulnerabilities
- All E2E tests passing
- Lighthouse score > 90
- Bundle size within limits

## Consequences

### Positive
- Consistent quality across releases
- Fast feedback loop
- Automated security checks
- Easy rollbacks

### Negative
- Initial setup complexity
- CI costs for large test suites
- Learning curve for team

## Tools

- GitHub Actions (CI/CD)
- Vercel (Deployments)
- Chromatic (Visual testing)
- CodeQL (Security)
- Bundlewatch (Size monitoring)
