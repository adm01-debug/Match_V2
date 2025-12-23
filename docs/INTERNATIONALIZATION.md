# Internationalization (i18n) Guide

## Overview

Match ATS supports multiple languages through the i18n system.

## Setup

### Configuration
```typescript
// src/i18n/config.ts
export const languages = ['pt-BR', 'en-US', 'es-ES'];
export const defaultLanguage = 'pt-BR';
```

### Translation Files
```
src/i18n/
├── locales/
│   ├── pt-BR.json
│   ├── en-US.json
│   └── es-ES.json
└── index.ts
```

## Usage

### In Components
```tsx
import { useTranslation } from '@/i18n';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('welcome.title')}</h1>;
}
```

### Translation Keys
```json
{
  "welcome": {
    "title": "Bem-vindo ao Match ATS",
    "subtitle": "Sistema de Rastreamento de Candidatos"
  },
  "common": {
    "save": "Salvar",
    "cancel": "Cancelar",
    "delete": "Excluir"
  }
}
```

## Adding New Language

1. Create translation file in `src/i18n/locales/`
2. Add language code to config
3. Import and register translations

## Best Practices

- Use meaningful key names
- Group related translations
- Avoid hardcoded strings
- Use interpolation for dynamic content
- Handle pluralization
