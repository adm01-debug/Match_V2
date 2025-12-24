# Operational Runbook - Match ATS

## Quick Reference

### Health Checks
```bash
curl https://api.match-ats.com/health
```

### Common Issues

#### 1. Database Connection Issues
- Check Supabase status
- Verify connection string
- Check network policies

#### 2. Auth Issues
- Clear browser cookies
- Check JWT expiration
- Verify Supabase auth settings

#### 3. Performance Issues
- Check database indexes
- Review query performance
- Monitor edge function logs

### Emergency Contacts
- On-call: See PagerDuty
- Supabase Support: support@supabase.com
