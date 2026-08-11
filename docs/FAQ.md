# Frequently Asked Questions

## General

### What is Match ATS?
Match ATS is an Applicant Tracking System designed to streamline the recruitment process for Brazilian companies.

### What technologies does it use?
- React 18 with TypeScript
- Vite for build
- Supabase for backend
- Tailwind CSS for styling
- React Query for data fetching

## Development

### How do I start the development server?
```bash
npm install
npm run dev
```

### How do I run tests?
```bash
npm run test        # Unit tests
npm run test:e2e    # E2E tests
```

### How do I build for production?
```bash
npm run build
```

## Features

### Can I customize the pipeline stages?
Yes, pipeline stages are configurable in the admin settings.

### Does it support multiple languages?
Yes, pt-BR is the default with support for en-US and es-ES.

### Is there an API?
Yes, see docs/API.md for documentation.

## Troubleshooting

### Why is the page blank?
Check browser console for errors and verify environment variables.

### Why are tests failing?
Run `npm run test -- --clearCache` and try again.

### How do I reset the database?
```bash
npx supabase db reset
```

## Support

### Where can I report bugs?
Open an issue on GitHub with reproduction steps.

### How do I request features?
Use the feature request template on GitHub.

### Is there documentation?
Yes, see the /docs folder for comprehensive documentation.
