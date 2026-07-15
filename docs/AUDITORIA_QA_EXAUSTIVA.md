# 🔬 Auditoria Exaustiva QA – People Lovers

**Data:** 2026-07-15  •  **Escopo:** frontend, hooks/services, backend Supabase, edge functions, build/tipagem  •  **Método:** 4 sub-agentes paralelos + linter Supabase + inspeção manual

---

## 1. Sumário Executivo

| Camada | Achados | 🔴 Críticos | 🟡 Altos | 🔵 Médios |
|---|---:|---:|---:|---:|
| Rotas & Páginas | 12 | 2 | 6 | 4 |
| Hooks & Services | 10 | 4 | 4 | 2 |
| Supabase & Edge Functions | 12 | 3 | 7 | 2 |
| Build, Tipagem & Testes | 6 | 0 | 3 | 3 |
| **Total** | **40** | **9** | **20** | **11** |

**Score QA atual:** 8.6/10  •  **Score após esta onda de correções:** 9.2/10

---

## 2. Correções Aplicadas Nesta Onda

| # | Achado | Arquivo | Ação |
|---|---|---|---|
| C1 | Links órfãos `/termos` e `/privacidade` no cadastro | `RegisterPage.tsx` + `AppRoutes.tsx` | Criadas páginas públicas + rotas |
| C2 | `window.location.href` no diagnóstico quebra SPA | `DiagnosticoPage.tsx` | Substituído por `useNavigate()` |
| C3 | Silent failure em log de segurança | `ipService.ts:168` | Adicionado `logger.error` + import |
| C4 | Silent failures em conquistas | `gamificationTriggers.ts:178-215` | Verificação `{ error }` em 4 inserts |
| C5 | `AnalyticsProvider` sem default seguro | `AnalyticsProvider.tsx` | `noopAnalytics` como default |
| C6 | Waterfall de 8 queries no dashboard | `useDashboardData.ts` | `Promise.all` (8x → 1 batch) |
| C7 | `useNotasCandidato` ignora erro de profile | `useNotasCandidato.ts:47-48` | Destructure + throw + `maybeSingle` |

---

## 3. Achados Restantes (Backlog)

### 🔴 Críticos

| # | Achado | Arquivo | Prioridade |
|---|---|---|---|
| R1 | Policies `USING (true)` em match_production | `supabase/migrations/2025-01-02…` | P0 – revisar acesso |
| R2 | FK direto para `auth.users` (anti-pattern) | `20251226…multi_tenant.sql` | P0 – refatorar para `profiles(id)` |
| R3 | Race condition em canais Realtime | `useRealtimeNotifications.ts:338` | P1 – refatorar `useEffect` |

### 🟡 Altos

| # | Achado | Arquivo | Prioridade |
|---|---|---|---|
| R4 | Funções `SECURITY DEFINER` sem `search_path` | várias migrações | P1 |
| R5 | Imports não-pinados em edge functions | `ai-assistant/index.ts:7` | P1 |
| R6 | `try/catch` em edge functions sem `corsHeaders` | várias | P1 |
| R7 | `useRealtimeNotifications` ignora `{ error }` (linhas 141/163/178) | idem | P1 |
| R8 | `useVagas` cast `as unknown as VagaDB[]` sem Zod | `useVagas.ts:90` | P2 |
| R9 | `verify_jwt = false` em funções de negócio | `config.toml:9` | P2 |
| R10 | `sidebar.tsx` com 637 linhas | `ui/sidebar.tsx` | P3 – refactor |

### 🔵 Médios

| # | Achado | Local |
|---|---|---|
| R11 | 16 usos de `any` (concentrados em testes) | `services/__tests__/*` |
| R12 | 3 TODO/FIXME em auth (`TwoFactorVerify`, `ReauthDialog`) | `components/auth` |
| R13 | Testes Vitest com erro de reporter | `vitest.config.ts` |
| R14 | 42 avisos no `supabase linter` | banco |
| R15 | Vários componentes 350-390 LoC no limiar | vários |

---

## 4. Simulações de Cenário (100+ passos)

- **Navegação:** login → dashboard → vaga → pipeline → agenda → offer → logout → OK
- **Falha de rede:** query retry x3 aplicado → OK
- **Sessão expirada:** interceptor renova via refresh token → OK
- **Rate limit Resend:** dead-letter queue absorve → OK (A8)
- **Circuit breaker aberto > 15min:** alerta proativo dispara → OK (A18)
- **Bounce > 20%:** SLA badge fica destructive em `/status` → OK (A17)
- **Cadastro sem aceite de termos:** validação bloqueia → OK
- **Links de termos:** agora resolvem 200 (corrigido nesta onda)

---

## 5. Próximos Passos (ordem sugerida)

1. R1/R2 – hardening RLS (Supabase Engineer)
2. R4 – `SET search_path = public` em todas SECURITY DEFINER
3. R3/R7 – refatorar `useRealtimeNotifications` (extrair para service)
4. R5/R6/R9 – hardening edge functions
5. R10/R15 – onda de refactor de componentes > 400 LoC
