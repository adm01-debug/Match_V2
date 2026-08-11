# Guia de Hooks - Match ATS

## Hooks de Dados

### useCandidatos
```typescript
import { useCandidatos } from "@/hooks/useCandidatos";

const { data, isLoading, error } = useCandidatos({
  filters: { etapa: "triagem", fonte: "linkedin" },
  pagination: { page: 1, limit: 20 },
});
```

### useVagas
```typescript
import { useVagas } from "@/hooks/useVagas";

const { data, createVaga, updateVaga, deleteVaga } = useVagas();
```

### useCandidatura
```typescript
import { useCandidatura } from "@/hooks/useCandidatura";

const { moveToStage, addNote, scheduleInterview } = useCandidatura(candidaturaId);
```

## Hooks de UI

### useBulkSelection
```typescript
import { useBulkSelection } from "@/hooks/useBulkSelection";

const { selected, isSelected, toggle, selectAll, clearSelection } = useBulkSelection();
```

### useFilters
```typescript
import { useFilters } from "@/hooks/useFilters";

const { filters, updateFilter, clearFilters, applyFilters } = useFilters({
  defaultFilters: { status: "active" },
});
```

## Hooks de Autenticação

### useAuth
```typescript
import { useAuth } from "@/hooks/useAuth";

const { user, isAuthenticated, login, logout, hasPermission } = useAuth();
```

### use2FA
```typescript
import { use2FA } from "@/hooks/use2FA";

const { isEnabled, enable2FA, verify2FA, generateRecoveryCodes } = use2FA();
```

## Hooks de Workflow

### useWorkflow
```typescript
import { useWorkflow } from "@/hooks/useWorkflow";

const { workflows, createWorkflow, executeWorkflow } = useWorkflow();
```

## Hooks de Configuração

### useWhiteLabel
```typescript
import { useWhiteLabel } from "@/hooks/useWhiteLabel";

const { config, updateConfig } = useWhiteLabel();
```

### useTenant
```typescript
import { useTenant } from "@/hooks/useTenant";

const { tenant, settings, updateSettings } = useTenant();
```

## Boas Práticas

1. **Sempre use React Query para dados do servidor**
2. **Prefira hooks compostos para lógica complexa**
3. **Mantenha hooks pequenos e focados**
4. **Use TypeScript para tipos seguros**
5. **Documente parâmetros e retornos**
