# ADR-0004: Estrutura de Banco de Dados

## Status
Aceito

## Decisão
Usar **Supabase (PostgreSQL)** com:
- Row Level Security (RLS) para multi-tenancy
- Migrations versionadas
- Full-Text Search nativo
- Realtime subscriptions

### Tabelas Principais
- `profiles`: Usuários do sistema
- `vagas`: Posições abertas
- `candidatos`: Banco de talentos
- `candidaturas`: Relacionamento candidato-vaga
- `entrevistas`: Agendamentos
- `avaliacoes`: Feedbacks estruturados

### Índices
- GIN para full-text search
- B-tree para FKs e filtros comuns
- Partial indexes para status ativos
