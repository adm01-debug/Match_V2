# Migration Guide

## Database Migrations

### Creating Migrations
```bash
npx supabase migration new migration_name
```

### Applying Migrations
```bash
npx supabase db push
```

### Rolling Back
```bash
npx supabase db reset
```

## Version Upgrades

### v1.x to v2.x

#### Breaking Changes
- API response format changed
- New authentication flow
- Updated component props

#### Migration Steps
1. Update dependencies
2. Run migration scripts
3. Update API calls
4. Test thoroughly

### Dependency Updates

#### React Query v4 to v5
```typescript
// Before
import { useQuery } from 'react-query';

// After
import { useQuery } from '@tanstack/react-query';
```

#### Tailwind v3 Updates
- Review class changes
- Update configuration

## Data Migration

### Export Data
```sql
COPY table_name TO '/path/file.csv' CSV HEADER;
```

### Import Data
```sql
COPY table_name FROM '/path/file.csv' CSV HEADER;
```

## Checklist

- [ ] Backup database
- [ ] Review breaking changes
- [ ] Update dependencies
- [ ] Run migrations
- [ ] Test all features
- [ ] Update documentation
- [ ] Deploy to staging
- [ ] Monitor for issues
