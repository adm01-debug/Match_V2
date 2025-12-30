# Webhooks - Match ATS

## Visão Geral

Webhooks permitem que seu sistema receba notificações em tempo real sobre eventos no Match ATS.

## Configuração

### Criar Webhook
```
POST /v1/webhooks
```

```json
{
  "url": "https://seu-sistema.com/webhook",
  "eventos": ["candidato.criado", "candidatura.atualizada"],
  "secret": "seu_secret_para_verificacao"
}
```

### Listar Webhooks
```
GET /v1/webhooks
```

### Deletar Webhook
```
DELETE /v1/webhooks/:id
```

## Eventos Disponíveis

### Candidatos
| Evento | Descrição |
|--------|-----------|
| `candidato.criado` | Novo candidato cadastrado |
| `candidato.atualizado` | Dados do candidato alterados |
| `candidato.deletado` | Candidato removido |

### Candidaturas
| Evento | Descrição |
|--------|-----------|
| `candidatura.criada` | Nova candidatura recebida |
| `candidatura.atualizada` | Status ou dados alterados |
| `candidatura.etapa_alterada` | Mudança de etapa no pipeline |

### Vagas
| Evento | Descrição |
|--------|-----------|
| `vaga.criada` | Nova vaga publicada |
| `vaga.atualizada` | Vaga alterada |
| `vaga.fechada` | Vaga encerrada |

### Entrevistas
| Evento | Descrição |
|--------|-----------|
| `entrevista.agendada` | Entrevista marcada |
| `entrevista.realizada` | Entrevista concluída |
| `entrevista.cancelada` | Entrevista cancelada |

## Payload

### Estrutura Padrão
```json
{
  "id": "evt_abc123",
  "evento": "candidato.criado",
  "timestamp": "2024-01-15T10:30:00Z",
  "dados": {
    // dados específicos do evento
  }
}
```

### Exemplo: candidato.criado
```json
{
  "id": "evt_abc123",
  "evento": "candidato.criado",
  "timestamp": "2024-01-15T10:30:00Z",
  "dados": {
    "candidato_id": "uuid",
    "nome": "João Silva",
    "email": "joao@email.com",
    "origem": "linkedin"
  }
}
```

### Exemplo: candidatura.etapa_alterada
```json
{
  "id": "evt_def456",
  "evento": "candidatura.etapa_alterada",
  "timestamp": "2024-01-15T11:00:00Z",
  "dados": {
    "candidatura_id": "uuid",
    "candidato_id": "uuid",
    "vaga_id": "uuid",
    "etapa_anterior": "TRIAGEM",
    "etapa_nova": "ENTREVISTA",
    "alterado_por": "uuid"
  }
}
```

## Verificação de Assinatura

Toda requisição inclui o header `X-Webhook-Signature` com HMAC-SHA256.

```javascript
const crypto = require('crypto');

function verificarAssinatura(payload, assinatura, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(assinatura),
    Buffer.from(`sha256=${digest}`)
  );
}
```

## Retry Policy

- Tentativas: 5
- Intervalo: 1min, 5min, 30min, 2h, 24h
- Timeout: 30 segundos
- Status de sucesso: 2xx

## Boas Práticas

1. **Responda rapidamente** - Retorne 200 imediatamente
2. **Processe assincronamente** - Use filas para processamento
3. **Valide assinaturas** - Sempre verifique o HMAC
4. **Seja idempotente** - Use o `id` para evitar duplicatas
5. **Log de eventos** - Registre para debugging
