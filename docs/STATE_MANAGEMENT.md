# State Management - Match ATS

## Arquitetura

O Match ATS utiliza uma arquitetura de state management híbrida:

| Tipo de Estado | Solução | Uso |
|----------------|---------|-----|
| Server State | TanStack Query | Dados da API |
| Client State | React Context | Auth, Theme, Tenant |
| UI State | useState/useReducer | Formulários, modais |
| URL State | React Router | Filtros, paginação |

## TanStack Query (React Query)

### Query Keys
```typescript
// src/constants/queryKeys.ts
export const queryKeys = {
  candidatos: {
    all: ["candidatos"] as const,
    list: (filters: Filters) => ["candidatos", "list", filters] as const,
    detail: (id: string) => ["candidatos", "detail", id] as const,
  },
  vagas: {
    all: ["vagas"] as const,
    // ...
  },
};
```

### Padrão de Hooks
```typescript
// src/hooks/useCandidatos.ts
export function useCandidatos(filters?: CandidatoFilters) {
  return useQuery({
    queryKey: queryKeys.candidatos.list(filters),
    queryFn: () => candidatoService.list(filters),
    staleTime: 1000 * 60 * 5, // 5 min
  });
}
```

### Mutations com Invalidação
```typescript
const mutation = useMutation({
  mutationFn: candidatoService.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.candidatos.all });
  },
});
```

## React Context

### AuthContext
```typescript
const { user, isAuthenticated, permissions } = useAuth();
```

### TenantContext
```typescript
const { tenant, settings } = useTenant();
```

### WhiteLabelContext
```typescript
const { config } = useWhiteLabel();
```

## Boas Práticas

1. **Evite prop drilling** - Use Context para dados globais
2. **Prefetch inteligente** - Antecipe dados prováveis
3. **Optimistic updates** - Atualize UI antes da resposta
4. **Stale-while-revalidate** - Mostre dados antigos enquanto atualiza
5. **Error boundaries** - Trate erros por região da UI

## DevTools

```bash
# TanStack Query DevTools
# Já incluso no App.tsx em dev
```
