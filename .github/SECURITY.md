# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability within Match ATS, please send an email to security@example.com. All security vulnerabilities will be promptly addressed.

Please include the following information:
- Type of issue (e.g., buffer overflow, SQL injection, XSS)
- Full paths of source file(s) related to the issue
- Location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit it

## Security Measures

This application implements:
- Row Level Security (RLS) on all database tables
- JWT authentication via Supabase
- Input sanitization and validation
- CORS configuration
- Rate limiting on API endpoints
- XSS protection headers
- CSRF protection
