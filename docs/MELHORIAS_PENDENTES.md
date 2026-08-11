# Melhorias Pendentes — Análise Exaustiva

> Auditoria realizada em 2026-11-13 sobre a base People Lovers (Match ATS).
> Cruza: relatórios `audit_report.md`, `docs/AUDITORIA_ENTERPRISE_PEOPLE_LOVERS.md`, `docs/ROADMAP.md`, ADRs, histórico de refatorações e varredura estática do código-fonte.

---

## 1. Sumário Executivo

| Severidade | Quantidade | Ação sugerida |
|---|---|---|
| 🔴 **Crítico** | 6 | Wave 1 — imediato (≤ 1 semana) |
| 🟠 **Alto** | 11 | Wave 2 — próximas 2 semanas |
| 🟡 **Médio** | 14 | Wave 3 — próximo mês |
| 🔵 **Baixo** | 9 | Backlog contínuo |
| **Total** | **40** | — |

**Nota atual estimada:** 8.7 / 10 → **Meta:** 10 / 10 após Waves 1–3.

**Evidências agregadas (varredura estática):**
- 40 arquivos ainda com **> 400 linhas** (excluindo `types.ts` gerado).
- 155 arquivos com **cores hardcoded** Tailwind (`bg-red-500`, `text-blue-600`, etc.).
- 41 ocorrências de `: any` / `as any` em código de produção.
- 83 `console.log/warn/error` fora do `services/logger.ts`.
- **0** instrumentação de **Web Vitals** (CLS/LCP/INP).
- `tsconfig.app.json` já em **strict + noUncheckedIndexedAccess** ✅ (excelente base).
- Coverage gate em **70%** — sem gate de *mutation testing*.

---

## 2. Matriz de Priorização (Impacto × Esforço)

```text
                Baixo esforço          Alto esforço
              ┌──────────────────┬──────────────────┐
Alto impacto  │ Web Vitals RUM   │ Refatorar 40     │
              │ Sentry/DSN prod  │ arquivos > 400 L │
              │ Rate-limit edge  │ Report Builder BI│
              │ Remover console* │ PenTest externo  │
              ├──────────────────┼──────────────────┤
Baixo impacto │ Roadmap datas    │ Migrar 155 arqs  │
              │ Trocar TODOs     │ p/ design tokens │
              │ Docs FAQ         │ Storybook 100%   │
              └──────────────────┴──────────────────┘
```

---

## 3. Lista Detalhada de Melhorias

### 🔴 CRÍTICO (6)

| # | Item | Categoria | Evidência | Esforço | Impacto |
|---|---|---|---|---|---|
| C1 | **Instrumentar Web Vitals (LCP/CLS/INP)** — nenhum SDK `web-vitals` presente; sem telemetria de performance em produção. | Performance/Obs. | `rg web-vitals src/ → 0 hits` | S | 5 |
| C2 | **Rate limiting nas Edge Functions públicas** (`send-email`, `send-whatsapp`, `parse-resume`, `webhook-handler`) — hoje sem throttle por IP/usuário. | Segurança | `supabase/functions/*/index.ts` | M | 5 |
| C3 | **Roadmap desatualizado** — `docs/ROADMAP.md` ainda promete 2FA/AI Parser como "Q1/Q2 2025" mas já foram entregues; datas obsoletas confundem stakeholders. | Docs/Governança | `docs/ROADMAP.md` L3–20 | S | 4 |
| C4 | **83 `console.*` em produção** — logs sensíveis podem vazar; substituir pelo `logger` já existente. | Segurança/Qualidade | `rg "console\." src \| wc -l → 83` | M | 4 |
| C5 | **41 usos de `any` explícito** — quebra o contrato `strict`, principalmente em `useAvaliacoes.ts` (9), `apiClient.ts` (4), `OfferCard.tsx` (3), `WorkflowCanvas.tsx` (2). | Tipagem | `rg ": any\b\|as any\b" src` | M | 4 |
| C6 | **Sentry sem DSN validado em produção** — `.sentryclirc` presente mas ausência de checagem em CI de `SENTRY_DSN` obrigatório em build de prod. | Observabilidade | `.sentryclirc`, workflows | S | 4 |

### 🟠 ALTO (11)

| # | Item | Evidência | Esforço |
|---|---|---|---|
| A1 | Refatorar **10 páginas ainda > 400 linhas**: `BehavioralAssessmentPage` (583), `HiringManagerPortalPage` (582), `IndicacoesPage` (506), `AvaliacaoForm` (505), `AdminPage` (501), `AgendaPage` (500), `GamificationPage` (473), `App.tsx` (473), `DNAJourneyExperience` (662), `AIInterviewScheduler` (580). | `find src -name '*.tsx' \| wc -l` | L |
| A2 | Migrar **155 arquivos com cores hardcoded** para tokens semânticos — Top: `GamifiedAssessmentEngine` (32), `MatchScoreCard` (24), `status-badge` (23), `DNAMatchSwiper` (23), `CulturalResultView` (23). | `rg -c "bg-(red\|blue\|...)-[0-9]" src` | L |
| A3 | **Circuit breaker / retry** para APIs externas (LinkedIn, Indeed, Evolution API) — hoje falha imediata sem backoff. | Ver `services/*Service.ts` | M |
| A4 | **Cache de resultados** do `parse-resume` e `match-score` (Redis/pg) — reduz custo de IA e latência. | `supabase/functions/{parse-resume,match-score}` | M |
| A5 | **Verificação de assinatura** em `webhook-handler` (HMAC) — hoje aceita qualquer payload. | `supabase/functions/webhook-handler/index.ts` | S |
| A6 | **Report Builder dinâmico** (drag-drop de métricas) — item explícito do roadmap enterprise. | `audit_report.md §5.1` | L |
| A7 | **Filas de retry** (PGMQ/pg_cron) para envios de email/WhatsApp que falharem. | Mitigação da matriz de riscos | M |
| A8 | **Auditoria mensal automatizada de permissões** (relatório RBAC) — cron edge function. | Matriz de riscos | M |
| A9 | **PenTest externo** trimestral — contratação e checklist OWASP ASVS 4.0 nível 2. | Roadmap §5 | L |
| A10 | **Cobertura E2E** dos fluxos Job Board (LinkedIn, Indeed, Catho, Infojobs) — hoje ausentes em `e2e/`. | `ls e2e/*.spec.ts` | M |
| A11 | **Auto-refresh de sessão** + logout em token expirado — checar `AuthContext.tsx`. | UX/Segurança | S |

### 🟡 MÉDIO (14)

| # | Item | Esforço |
|---|---|---|
| M1 | Padronizar `ErrorBoundary` **granular** em cada rota (não só global). | S |
| M2 | Adicionar **Storybook** para componentes-chave (UI kit atual sem catálogo). | M |
| M3 | Ativar **`noImplicitAny`** também no `tsconfig.build.json` e limpar excludes. | S |
| M4 | **Bundle-size gate real** no CI (`bundlewatch` já configurado mas não bloqueante). | S |
| M5 | **A11y bloqueante** no CI (workflow `a11y.yml` hoje é warning). | S |
| M6 | **Mutation testing** (Stryker) com gate ≥ 60%. | M |
| M7 | Padronizar **empty states** com ilustrações do design system em todas as listas. | M |
| M8 | **Skeleton loaders** consistentes por página (algumas usam spinner). | S |
| M9 | **Dark mode audit** — revisar contraste WCAG AA em modo escuro. | S |
| M10 | Docs — atualizar `ROADMAP.md`, `CHANGELOG.md`, `docs/index.md` com estado real. | S |
| M11 | **i18n**: extrair strings PT-BR hardcoded para `i18next` (ADR 0007 sugere). | L |
| M12 | **CSP header estrito** no `nginx.conf` / meta. | S |
| M13 | **Automatizar backup** e teste de restore (docs/BACKUP.md sem cron). | M |
| M14 | **Dependabot auto-merge** apenas para patches — hoje aceita minors. | S |

### 🔵 BAIXO (9)

| # | Item |
|---|---|
| L1 | Refatorar `src/data/immersiveScenariosData.ts` (1505 linhas) — considerar mover para JSON + loader lazy. |
| L2 | Refatorar `src/config/behavioralPillars.ts` (723) em módulos por pilar. |
| L3 | Split de `types/behavioral.ts` (870) por domínio. |
| L4 | Reduzir `App.tsx` (473) — extrair `<AppRoutes />`. |
| L5 | Remover 3 TODOs de placeholder em `TwoFactorVerify.tsx` / `ReauthDialog.tsx`. |
| L6 | Adicionar `<meta name="theme-color">` dinâmico ao trocar tema. |
| L7 | PWA — melhorar prompt de instalação com A/B. |
| L8 | Micro-animações em transições de rota (framer-motion `AnimatePresence`). |
| L9 | Adicionar página `/status` pública consumindo `health` edge function. |

---

## 4. Roadmap de Execução (3 Ondas)

### Wave 1 — Quick Wins (≤ 1 semana)
1. C1 Web Vitals RUM (SDK + envio p/ analytics)
2. C3 Atualizar ROADMAP.md
3. C4 Substituir `console.*` por `logger`
4. C6 Validar `SENTRY_DSN` no CI de produção
5. A5 HMAC no `webhook-handler`
6. A11 Auto-logout em token expirado
7. M4 + M5 tornar bundle-size e a11y **bloqueantes**

**Ganho estimado:** 8.7 → **9.2**

### Wave 2 — Estrutural (2–3 semanas)
1. C2 Rate limiting em todas as edge functions públicas
2. C5 Eliminar `any` (41 → 0)
3. A1 Refatorar 10 páginas > 400 L
4. A2 (parcial) migrar top-20 arquivos de cores hardcoded
5. A3 + A4 Circuit breaker + cache IA
6. A7 Filas PGMQ para email/WhatsApp
7. A10 E2E dos job boards

**Ganho estimado:** 9.2 → **9.6**

### Wave 3 — Excelência (1 mês)
1. A6 Report Builder BI
2. A8 Auditoria RBAC mensal automatizada
3. A9 PenTest externo agendado
4. M2 Storybook completo
5. M6 Mutation testing (Stryker)
6. M11 i18n multi-idioma
7. A2 (restante) — 100% design tokens

**Ganho estimado:** 9.6 → **10.0** ✨

---

## 5. Checklist Rumo ao 10/10

- [ ] 🔴 C1 Web Vitals instrumentados
- [ ] 🔴 C2 Rate limit em edge functions
- [ ] 🔴 C3 ROADMAP.md atualizado
- [ ] 🔴 C4 `console.*` = 0 fora do logger
- [ ] 🔴 C5 `any` = 0 em produção
- [ ] 🔴 C6 Sentry DSN obrigatório em prod build
- [ ] 🟠 A1 Todos os `.tsx/.ts` < 400 linhas (exceto gerados)
- [ ] 🟠 A2 155 → 0 arquivos com cores hardcoded
- [ ] 🟠 A3 Circuit breaker em todas as integrações
- [ ] 🟠 A4 Cache IA implementado
- [ ] 🟠 A5 HMAC verify no webhook-handler
- [ ] 🟠 A6 Report Builder BI entregue
- [ ] 🟠 A7 PGMQ filas ativas
- [ ] 🟠 A8 Job de auditoria RBAC mensal
- [ ] 🟠 A9 PenTest externo executado
- [ ] 🟠 A10 E2E job boards ≥ 4 specs
- [ ] 🟠 A11 Auto-logout em token expirado
- [ ] 🟡 M1..M14 concluídos
- [ ] 🔵 L1..L9 concluídos

---

## 6. Métricas de Acompanhamento

| Métrica | Baseline hoje | Meta 10/10 |
|---|---|---|
| Arquivos > 400 linhas (não gerados) | 40 | 0 |
| Arquivos com cores hardcoded | 155 | 0 |
| Ocorrências de `any` | 41 | 0 |
| `console.*` fora do logger | 83 | 0 |
| Cobertura de testes (linhas) | 70% (gate) | 85%+ |
| Mutation score | — | ≥ 60% |
| Web Vitals LCP p75 | — (sem RUM) | < 2.5s |
| Web Vitals CLS p75 | — | < 0.1 |
| Web Vitals INP p75 | — | < 200ms |
| Edge functions com rate limit | 0/17 | 17/17 |
| E2E specs | 34 | 45+ |

---

*Documento gerado automaticamente pela análise exaustiva do agente. Próxima revisão sugerida: após Wave 1.*
