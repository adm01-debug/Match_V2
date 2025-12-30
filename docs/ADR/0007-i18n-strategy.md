# ADR 0007: Internationalization (i18n) Strategy

## Status
Accepted

## Context
O Match ATS precisa suportar múltiplos idiomas para atender clientes em diferentes países.

## Decision

### Library Choice: react-i18next

**Reasons:**
- Integração nativa com React
- Suporte a namespaces
- Lazy loading de traduções
- Interpolação e pluralização
- Detecção automática de idioma

### Supported Languages

| Code | Language | Status |
|------|----------|--------|
| pt-BR | Português (Brasil) | Primary |
| en | English | Supported |
| es | Español | Supported |

### File Structure

```
src/i18n/
├── config.ts         # i18next configuration
├── index.ts          # exports
├── pt-BR.ts          # Portuguese translations
├── en.ts             # English translations
└── es.ts             # Spanish translations
```

### Translation Keys Convention

```typescript
// Formato: namespace.section.key
t('common.actions.save')
t('candidates.status.hired')
t('jobs.form.title')
```

### Namespaces

- `common` - Textos gerais (botões, labels)
- `auth` - Autenticação
- `candidates` - Candidatos
- `jobs` - Vagas
- `reports` - Relatórios
- `settings` - Configurações
- `errors` - Mensagens de erro

### Best Practices

1. **Never hardcode text** - Always use translation keys
2. **Use interpolation** - `t('greeting', { name })`
3. **Handle plurals** - `t('items', { count })`
4. **Date/Number formatting** - Use Intl API with locale
5. **RTL support** - Prepared for Arabic/Hebrew (future)

### Language Detection Priority

1. User preference (localStorage)
2. Browser language (navigator.language)
3. Default: pt-BR

## Consequences

### Positive
- Flexible multi-language support
- Easy to add new languages
- Type-safe with TypeScript
- Performance optimized

### Negative
- Translation maintenance overhead
- Context loss in translation
- Larger bundle size

## Implementation

```tsx
// Component usage
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('common.welcome')}</h1>;
}
```
