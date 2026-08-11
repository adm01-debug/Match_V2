# Troubleshooting Guide

## Common Issues

### Build Issues

#### Error: Module not found
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

#### TypeScript Errors
```bash
# Check types
npm run type-check

# Clear TypeScript cache
rm -rf node_modules/.cache
```

### Runtime Issues

#### Blank Page After Deploy
1. Check browser console for errors
2. Verify environment variables are set
3. Clear browser cache

#### API Connection Errors
1. Verify Supabase URL and keys
2. Check network connectivity
3. Verify CORS settings

### Database Issues

#### Migration Failures
```bash
# Reset database
npx supabase db reset

# Apply migrations
npx supabase db push
```

#### RLS Policy Errors
- Check user authentication status
- Verify policy conditions
- Review Supabase logs

### Development Issues

#### Hot Reload Not Working
```bash
# Restart dev server
npm run dev -- --force
```

#### Test Failures
```bash
# Run tests in watch mode
npm run test:watch

# Clear test cache
npm run test -- --clearCache
```

## Getting Help

1. Check existing GitHub issues
2. Review documentation
3. Contact support team
