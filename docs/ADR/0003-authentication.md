# ADR-0003: Estratégia de Autenticação

## Status
Aceito

## Contexto
Sistema precisa de autenticação segura, com suporte a múltiplos métodos e níveis de acesso.

## Decisão
Usar **Supabase Auth** com:
- Email/senha como método principal
- OAuth social (Google, LinkedIn) planejado
- 2FA via TOTP (Google Authenticator)
- JWT para sessões

### Fluxo de Autenticação
1. Login → Supabase valida credenciais
2. Se 2FA ativo → Tela de verificação TOTP
3. JWT armazenado em cookie httpOnly
4. Refresh token automático
5. Logout → Invalidação de sessão

### Níveis de Acesso (RBAC)
- Admin: Acesso total
- Manager: Gerencia vagas e candidatos
- Recruiter: Opera no pipeline
- Viewer: Somente leitura

## Consequências
### Positivas
- Segurança enterprise-grade do Supabase
- 2FA reduz riscos de comprometimento
- RBAC granular

### Negativas
- Dependência do Supabase Auth
- Complexidade adicional com 2FA
