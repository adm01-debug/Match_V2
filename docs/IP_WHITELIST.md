# 🔐 Sistema de Whitelist de IPs - MATCH ATS

## Visão Geral

O sistema de whitelist de IPs restringe o acesso ao MATCH ATS apenas para endereços IP previamente autorizados. Esta é uma camada adicional de segurança que complementa a autenticação de usuários.

## Arquitetura

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Cliente/User   │────▶│   IPGuard        │────▶│  Supabase DB    │
│  (Browser)      │     │   Component      │     │  allowed_ips    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │                       │                        │
         │                       ▼                        │
         │              ┌──────────────────┐              │
         └─────────────▶│  Edge Function   │◀─────────────┘
                        │  ip-guard        │
                        └──────────────────┘
```

## Componentes

### 1. Configuração (`src/config/ipWhitelist.ts`)
- Lista estática de IPs permitidos (fallback)
- Configurações de segurança
- IPs de desenvolvimento

### 2. Serviço (`src/services/ipService.ts`)
- `getClientIP()` - Obtém IP do cliente
- `isIPAllowed()` - Verifica se IP está autorizado
- `addIPToWhitelist()` - Adiciona novo IP
- `removeIPFromWhitelist()` - Remove IP

### 3. Hook (`src/hooks/useIPVerification.ts`)
- React hook para verificação de IP
- Cache automático
- Estados de loading/error

### 4. Componente (`src/components/security/IPGuard.tsx`)
- Wrapper para rotas protegidas
- Telas de loading, bloqueio e erro

### 5. Edge Function (`supabase/functions/ip-guard/`)
- Verificação server-side
- Logging de tentativas

### 6. Banco de Dados
- `allowed_ips` - IPs autorizados
- `ip_access_logs` - Logs de acesso

## Como Usar

### Proteger uma Rota

```tsx
import { IPGuard } from '@/components/security/IPGuard';

function App() {
  return (
    <IPGuard>
      <ProtectedContent />
    </IPGuard>
  );
}
```

### Adicionar IP via Interface

1. Acesse: `/admin/ips`
2. Clique em "Adicionar IP"
3. Informe o IP e descrição
4. Confirme

### Adicionar IP via Código

```typescript
import { addIPToWhitelist } from '@/services/ipService';

await addIPToWhitelist(
  '192.168.1.100',
  'Escritório Principal',
  'admin@empresa.com'
);
```

### Adicionar IP via SQL

```sql
INSERT INTO allowed_ips (ip, description, added_by) 
VALUES ('192.168.1.100', 'Escritório Principal', 'admin');
```

## Configurações

### Habilitar/Desabilitar

```typescript
// src/config/ipWhitelist.ts
export const IP_SECURITY_CONFIG = {
  enabled: true,  // false para desabilitar
  allowDevBypass: true,  // permitir bypass em dev
  // ...
};
```

### Tempo de Cache

```typescript
cacheTimeout: 5 * 60 * 1000,  // 5 minutos
```

## Ambiente de Desenvolvimento

Por padrão, os seguintes IPs são sempre permitidos em desenvolvimento:
- `127.0.0.1` (localhost IPv4)
- `::1` (localhost IPv6)
- `localhost`

Para desabilitar bypass em dev:
```typescript
allowDevBypass: false
```

## Logs e Monitoramento

### Ver logs de acesso

```sql
SELECT * FROM ip_access_logs 
WHERE timestamp > NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;
```

### Tentativas bloqueadas

```sql
SELECT ip, COUNT(*) as tentativas
FROM ip_access_logs 
WHERE action = 'BLOCKED'
AND timestamp > NOW() - INTERVAL '24 hours'
GROUP BY ip
ORDER BY tentativas DESC;
```

## Segurança

- ✅ RLS habilitado nas tabelas
- ✅ Apenas admins podem gerenciar IPs
- ✅ Logs de todas as tentativas
- ✅ Validação de formato IPv4/IPv6
- ✅ Suporte a expiração de acesso

## Troubleshooting

### "Meu IP foi bloqueado acidentalmente"

1. Acesse via outro IP autorizado
2. Adicione o IP bloqueado novamente
3. Ou execute SQL diretamente no Supabase

### "Não consigo acessar em desenvolvimento"

Verifique se:
- `allowDevBypass: true` está configurado
- Você está acessando via `localhost`

### "Verificação está lenta"

- Aumente o `cacheTimeout`
- Verifique conectividade com Supabase
