# ADR-0002: State Management com React Query

## Status
Aceito

## Contexto
Precisamos gerenciar estado server-side de forma eficiente, com cache, invalidação automática e sincronização otimista.

## Decisão
Usar **TanStack Query (React Query)** como solução principal de state management para dados do servidor.

### Razões
1. Cache automático e configurável
2. Invalidação inteligente de queries
3. Retries automáticos com backoff exponencial
4. Suporte a mutations otimistas
5. DevTools excelentes
6. Integração nativa com Suspense

### Padrões Adotados
- QueryKeys centralizados em `src/constants/queryKeys.ts`
- Hooks customizados para cada entidade (useCandidatos, useVagas, etc.)
- Prefetch de dados em rotas frequentes
- Stale time de 5 minutos para dados que mudam pouco

## Consequências
### Positivas
- Redução de código boilerplate
- Melhor UX com dados em cache
- Fácil debug com DevTools

### Negativas
- Curva de aprendizado para novos devs
- Complexidade em cenários de invalidação cruzada
