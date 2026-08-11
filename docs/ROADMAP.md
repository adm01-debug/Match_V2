# Roadmap — Match ATS / People Lovers

> Última revisão: 2026-Q4 · Owner: Tech Lead · Cadência: mensal

Este roadmap reflete o **estado real** do produto após a auditoria enterprise 10/10.
Marcos concluídos são mantidos por rastreabilidade histórica.

---

## ✅ Entregue (baseline atual — 8.7 / 10)

### Segurança & Auth
- [x] Autenticação por e-mail/senha e Google OAuth (Lovable Cloud)
- [x] Two-Factor Authentication (TOTP) + backup codes + `Admin2FAGuard`
- [x] RBAC granular (admin, rh, gestor) via `user_roles` + `has_role` (SECURITY DEFINER)
- [x] RLS em 100% das tabelas públicas + GRANTs explícitos por role
- [x] Leaked-password protection (HIBP) habilitado
- [x] Rate limiting em nível de UI (`useRateLimiter`)
- [x] IP allow-list + Geo-check (`ip-guard`, `geo-check`)
- [x] Trusted devices + `new-device-alert`

### Recrutamento Core
- [x] Vagas, Candidatos, Candidaturas, Pipeline Kanban (12 etapas)
- [x] Soft-delete (`deleted_at`) em 9 tabelas core
- [x] Portal do Candidato com auth separado (`candidatos_auth`)
- [x] Programa de Indicações (referral)
- [x] Agenda + Entrevistas + Interview Feedback estruturado
- [x] Scorecards automáticos (`generate-scorecard`)

### IA & Automação
- [x] AI Parser de currículos (`parse-resume`) via Lovable AI Gateway
- [x] Match Score (`match-score`) — skills 40 / exp 35 / edu 25
- [x] Behavioral Analysis + Cultural Fit
- [x] AI Assistant (`ai-assistant`)
- [x] Deu Match (Corporate Tinder)

### Behavioral & Gamification
- [x] DISC, Big Five, MBTI, Enneagram, Stress, Triune Brain
- [x] DNA Journey Experience (imersivo)
- [x] XP, badges, leaderboards, streaks, daily challenges
- [x] Job Fit 0-100 + 8 Red Flags + Executive Report

### Integrações
- [x] Resend (e-mail transacional) + templates
- [x] Evolution API v2 (WhatsApp) via proxy Edge Function
- [x] Google Calendar / Outlook / Teams / Slack
- [x] LinkedIn / Indeed / Infojobs / Catho (job boards)

### Qualidade
- [x] TypeScript `strict: true` (todas as flags de segurança)
- [x] Gate de cobertura Vitest ≥ 70% (lines/branches/functions)
- [x] E2E Playwright (34 specs)
- [x] Bundlewatch ≤ 250 kB gzip
- [x] Workflows CI: lint, test, e2e, a11y, lighthouse, codeql, dependency-review
- [x] Sentry integrado (frontend)

### Documentação
- [x] Auditoria Enterprise 10/10 (`docs/AUDITORIA_ENTERPRISE_PEOPLE_LOVERS.md`)
- [x] ADRs 0001-0008 · HOTFIX · POST_MORTEM · RUNBOOK
- [x] `audit_report.pdf` gerado automaticamente via GitHub Action

---

## 🚧 Wave 1 — Quick Wins (2026-Q4)

Meta de saída: **9.2 / 10**

- [ ] Migrar 83 `console.*` restantes para `services/logger.ts`
- [ ] Instrumentar Web Vitals (LCP/CLS/INP) → edge function `track-vitals` + tabela `web_vitals`
- [ ] HMAC verify obrigatório no `webhook-handler` (secret `WEBHOOK_SIGNING_SECRET`)
- [ ] Auto-logout robusto em `TOKEN_REFRESHED` falho (AuthContext)
- [ ] CI gate: falhar build se `SENTRY_DSN` ausente em produção
- [ ] Tornar bloqueantes os workflows `a11y.yml` e `bundle-size.yml`

## 🏗️ Wave 2 — Estrutural (2027-Q1)

Meta de saída: **9.6 / 10**

- [ ] Rate limiting server-side nas 17 edge functions (`_shared/rateLimit.ts`)
- [ ] Zerar os 41 `any` em produção (prioridade: `useAvaliacoes.ts`)
- [ ] Refatorar 10 páginas remanescentes > 400 L em subcomponentes < 200 L
- [ ] Migrar top-20 arquivos com cores hardcoded → tokens semânticos
- [ ] Circuit breaker + retry exponencial nos serviços externos
- [ ] Cache de IA (pgvector + tabela `ai_cache`)
- [ ] Fila PGMQ para reenvio de e-mail/WhatsApp
- [ ] 4 novos specs E2E para Job Boards

## 🎯 Wave 3 — Excelência (2027-Q2)

Meta de saída: **10.0 / 10**

- [ ] Report Builder BI (drag-drop com dnd-kit + export CSV/PDF)
- [ ] Auditoria RBAC mensal automatizada (`rbac-audit` cron)
- [ ] PenTest externo + checklist OWASP ASVS 4.0 nível 2
- [ ] Storybook com ≥ 40 componentes catalogados
- [ ] Mutation testing (Stryker) com gate ≥ 60%
- [ ] i18n com `i18next` (base para EN)
- [ ] Zerar cores hardcoded remanescentes (155 → 0 arquivos)

---

## 📊 Métricas de aceitação (checkpoint por Wave)

| Métrica | Baseline | W1 | W2 | W3 |
|---|---|---|---|---|
| Arquivos > 400 L | 40 | 40 | 0 | 0 |
| Cores hardcoded | 155 | 155 | 135 | 0 |
| `any` em produção | 41 | 41 | 0 | 0 |
| `console.*` fora do logger | 83 | 0 | 0 | 0 |
| Edge functions com rate limit | 0/17 | 0/17 | 17/17 | 17/17 |
| Cobertura de testes | 70% | 70% | 75% | ≥ 85% |
| E2E specs | 34 | 34 | 38 | 45+ |
| Web Vitals LCP p75 | s/ medição | < 2.5 s | < 2.0 s | < 1.8 s |

---

## 🔗 Referências

- [Auditoria Enterprise](./AUDITORIA_ENTERPRISE_PEOPLE_LOVERS.md)
- [Melhorias Pendentes (detalhado)](./MELHORIAS_PENDENTES.md)
- [ADRs](./ADR/)
- [Runbook Operacional](./RUNBOOK.md)
