# Backup e Recuperação

## Estratégia de Backup

### Supabase (Banco de Dados)
- Backups automáticos diários
- Point-in-time recovery (últimos 7 dias)
- Retenção: 30 dias

### Arquivos
- Storage bucket com versionamento
- Replicação cross-region

## Procedimentos

### Backup Manual
```bash
# Export do banco
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Backup do storage
supabase storage cp -r storage/ backup/
```

### Restauração
```bash
# Restaurar banco
psql $DATABASE_URL < backup_20241220.sql

# Restaurar storage
supabase storage cp -r backup/ storage/
```

## RPO e RTO

- **RPO** (Recovery Point Objective): 24 horas
- **RTO** (Recovery Time Objective): 4 horas

## Testes de Backup

- Testes mensais de restauração
- Documentar resultado de cada teste
- Atualizar procedimentos conforme necessário
