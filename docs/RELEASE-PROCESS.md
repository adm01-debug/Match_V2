# Release Process - Match ATS

## Versioning
Semantic Versioning (MAJOR.MINOR.PATCH)

## Release Checklist

### Pre-Release
- [ ] All tests passing
- [ ] Code review approved
- [ ] Changelog updated
- [ ] Version bumped

### Release
1. Merge to main
2. Tag release: `git tag v1.x.x`
3. Push tag: `git push origin v1.x.x`
4. CI/CD deploys automatically

### Post-Release
- [ ] Verify production deploy
- [ ] Monitor error rates
- [ ] Update documentation
- [ ] Notify stakeholders

## Rollback
```bash
git revert <commit>
git push origin main
```
