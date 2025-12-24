# Architecture Decision Records

## ADR-001: React Query para Data Fetching

**Status:** Aceito  
**Data:** 2024-12-01

### Contexto
Precisamos de uma solução robusta para gerenciamento de estado servidor.

### Decisão
Usar TanStack Query (React Query) v5.

### Consequências
- ✅ Cache automático
- ✅ Refetch inteligente
- ✅ Optimistic updates
- ⚠️ Curva de aprendizado

## ADR-002: Supabase como Backend

**Status:** Aceito  
**Data:** 2024-12-01

### Contexto
Precisamos de backend escalável com autenticação e realtime.

### Decisão
Usar Supabase (PostgreSQL + Auth + Realtime + Storage).

### Consequências
- ✅ Setup rápido
- ✅ Row Level Security
- ✅ Realtime nativo
- ⚠️ Vendor lock-in

## ADR-003: Shadcn/ui para Componentes

**Status:** Aceito  
**Data:** 2024-12-01

### Contexto
Precisamos de componentes acessíveis e customizáveis.

### Decisão
Usar shadcn/ui com Tailwind CSS.

### Consequências
- ✅ Acessibilidade built-in
- ✅ Full ownership do código
- ✅ Tailwind integration
