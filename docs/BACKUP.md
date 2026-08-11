# Backup e Disaster Recovery - Match ATS

## Objetivos de Recuperação

| Métrica | Alvo | Descrição |
|---------|------|-----------|
| **RPO** (Recovery Point Objective) | 1 hora | Máximo de perda de dados aceitável |
| **RTO** (Recovery Time Objective) | 4 horas | Tempo máximo para recuperação |

## Estratégia de Backup

### Banco de Dados (Supabase)
- ✅ Backups automáticos diários
- ✅ Point-in-time recovery (últimos 7 dias)
- ✅ Retenção: 30 dias

### Código Fonte (GitHub)
- ✅ Versionamento completo
- ✅ Branch protection no main
- ✅ Tags para releases

### Arquivos/Storage
- ✅ Bucket com versionamento habilitado
- ✅ Backup semanal cross-region

## Procedimentos de Backup

### Backup Manual do Banco
```bash
# Export completo
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql

# Export de tabela específica
pg_dump $DATABASE_URL -t candidatos > candidatos_backup.sql
```

### Backup do Storage
```bash
supabase storage cp -r storage/ backup/storage_$(date +%Y%m%d)/
```

## Procedimentos de Recuperação

### 1. Recuperação via Supabase Dashboard
1. Acesse Supabase Dashboard > Database > Backups
2. Selecione o ponto de restauração desejado
3. Inicie a restauração
4. Aguarde confirmação

### 2. Recuperação Manual
```bash
# Restaurar banco de dados
psql $DATABASE_URL < backup_20241220.sql

# Restaurar storage
supabase storage cp -r backup/storage_20241220/ storage/
```

### 3. Recuperação da Aplicação
1. Identifique o último commit estável
2. `git checkout <commit-hash>`
3. Verifique variáveis de ambiente
4. Deploy: `npm run build && npm run deploy`
5. Execute health checks
6. Monitore logs por 1 hora

## Testes de Recuperação

- **Frequência**: Mensal
- **Escopo**: Restauração completa em ambiente staging
- **Documentação**: Registrar resultados e tempo de execução

## Cadeia de Contato

| Ordem | Papel | Responsabilidade |
|-------|-------|------------------|
| 1 | DevOps Lead | Decisão técnica inicial |
| 2 | Backend Lead | Suporte a banco de dados |
| 3 | CTO | Escalação e comunicação |
