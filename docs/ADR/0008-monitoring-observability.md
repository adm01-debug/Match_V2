# ADR 0008: Monitoring & Observability Strategy

## Status
Accepted

## Context
Precisamos monitorar a aplicação para identificar problemas, otimizar performance e garantir disponibilidade.

## Decision

### Three Pillars of Observability

1. **Logs** - Structured logging for debugging
2. **Metrics** - Performance and business KPIs
3. **Traces** - Request flow tracking

### Tools Stack

| Pillar | Tool | Purpose |
|--------|------|---------|
| Logs | Sentry | Error tracking & logging |
| Metrics | Vercel Analytics | Performance metrics |
| Metrics | Grafana | Custom dashboards |
| Traces | Sentry | Distributed tracing |
| Uptime | UptimeRobot | Availability monitoring |

### Frontend Monitoring

```typescript
// Sentry initialization
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
});

// Performance monitoring
import { SpeedInsights } from '@vercel/speed-insights/react';
```

### Key Metrics

**Performance:**
- LCP (Largest Contentful Paint) < 2.5s
- FID (First Input Delay) < 100ms
- CLS (Cumulative Layout Shift) < 0.1
- TTFB (Time to First Byte) < 600ms

**Business:**
- Active users (DAU/MAU)
- Jobs posted per day
- Applications per job
- Time to hire
- Conversion rates

### Alerting Rules

| Metric | Threshold | Action |
|--------|-----------|--------|
| Error rate | > 1% | PagerDuty |
| Response time | > 3s | Slack |
| Uptime | < 99.9% | PagerDuty |
| API errors | > 5/min | Slack |

### Dashboard Structure

```
Grafana Dashboards/
├── Overview          # High-level health
├── Performance       # Core Web Vitals
├── Business          # KPIs
├── Infrastructure    # Server metrics
└── Errors            # Error breakdown
```

### Log Levels

- `error` - Errors requiring attention
- `warn` - Warning conditions
- `info` - Informational messages
- `debug` - Debug information (dev only)

## Consequences

### Positive
- Proactive issue detection
- Data-driven decisions
- Performance optimization
- SLA monitoring

### Negative
- Additional operational costs
- Data privacy considerations
- Alert fatigue if not tuned

## Implementation Priority

1. Sentry error tracking (immediate)
2. Vercel Speed Insights (immediate)
3. Custom Grafana dashboards (sprint 2)
4. Alerting rules (sprint 3)
