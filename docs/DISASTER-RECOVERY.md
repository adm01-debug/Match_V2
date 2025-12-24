# Disaster Recovery Plan - Match ATS

## RPO/RTO Targets
- **RPO**: 1 hour (Recovery Point Objective)
- **RTO**: 4 hours (Recovery Time Objective)

## Backup Strategy
1. **Database**: Supabase automatic daily backups
2. **Code**: GitHub with branch protection
3. **Configs**: Version controlled in repo

## Recovery Procedures

### Database Recovery
1. Access Supabase Dashboard
2. Navigate to Database > Backups
3. Select restore point
4. Initiate restore

### Application Recovery
1. Deploy from last known good commit
2. Verify environment variables
3. Run health checks
4. Monitor logs

## Contact Chain
1. DevOps Lead
2. Backend Lead
3. CTO
