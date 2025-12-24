# Monitoramento

## Ferramentas

### Sentry
- Tracking de erros em produção
- Performance monitoring
- Session replay

### Lighthouse CI
- Performance audits automatizados
- Accessibility checks
- Best practices validation

## Métricas Monitoradas

### Performance
- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- Time to Interactive (TTI) < 3.8s
- Cumulative Layout Shift (CLS) < 0.1

### Aplicação
- Error rate < 0.1%
- API response time < 200ms
- Uptime > 99.9%

## Alertas

Configurar alertas para:
- Error rate > 1%
- Response time > 500ms
- Memory usage > 80%
- CPU usage > 70%

## Dashboards

- Supabase Dashboard: métricas de banco
- Vercel Analytics: métricas de deploy
- Sentry: erros e performance
