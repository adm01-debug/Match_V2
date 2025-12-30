# ADR-0005: Estratégia de Testes

## Status
Aceito

## Decisão
Pirâmide de testes:
- **Unit**: Vitest para lógica isolada (70%)
- **Integration**: Testing Library para componentes (20%)
- **E2E**: Playwright para fluxos críticos (10%)

### Cobertura Mínima
- Linhas: 80%
- Branches: 75%
- Functions: 80%

### Convenções
- Arquivo `.test.tsx` junto ao componente
- Mocks em `src/mocks/`
- Fixtures em `src/test/fixtures/`
