# Deployment Guide

## Docker Deployment

```bash
# Build image
docker build -t match-ats .

# Run container
docker run -p 80:80 match-ats
```

## Docker Compose

```bash
docker-compose up -d
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |
| `VITE_SENTRY_DSN` | Sentry DSN (optional) |
