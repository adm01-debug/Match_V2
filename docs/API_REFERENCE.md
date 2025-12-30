# API Reference - Match ATS

## Autenticação

Todas as requisições devem incluir o header `Authorization: Bearer <token>`.

```bash
curl -H "Authorization: Bearer seu_token" https://api.matchats.com/v1/candidatos
```

## Endpoints

### Candidatos

#### Listar Candidatos
```
GET /v1/candidatos
```

**Query Parameters:**
| Param | Tipo | Descrição |
|-------|------|-----------|
| page | int | Página (default: 1) |
| limit | int | Itens por página (default: 20, max: 100) |
| search | string | Busca por nome/email |
| status | string | Filtro por status |
| vaga_id | uuid | Filtro por vaga |

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "nome": "string",
      "email": "string",
      "telefone": "string",
      "status": "string",
      "created_at": "datetime"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

#### Obter Candidato
```
GET /v1/candidatos/:id
```

#### Criar Candidato
```
POST /v1/candidatos
```

**Body:**
```json
{
  "nome": "string (required)",
  "email": "string (required)",
  "telefone": "string",
  "curriculo_url": "string"
}
```

#### Atualizar Candidato
```
PUT /v1/candidatos/:id
```

#### Deletar Candidato
```
DELETE /v1/candidatos/:id
```

### Vagas

#### Listar Vagas
```
GET /v1/vagas
```

#### Criar Vaga
```
POST /v1/vagas
```

**Body:**
```json
{
  "titulo": "string (required)",
  "descricao": "string (required)",
  "departamento": "string",
  "tipo": "CLT|PJ|ESTAGIO",
  "modalidade": "PRESENCIAL|REMOTO|HIBRIDO",
  "salario_min": "number",
  "salario_max": "number"
}
```

### Candidaturas

#### Criar Candidatura
```
POST /v1/candidaturas
```

**Body:**
```json
{
  "candidato_id": "uuid (required)",
  "vaga_id": "uuid (required)"
}
```

#### Atualizar Status
```
PATCH /v1/candidaturas/:id/status
```

**Body:**
```json
{
  "status": "TRIAGEM|ENTREVISTA|PROPOSTA|CONTRATADO|RECUSADO"
}
```

### Entrevistas

#### Agendar Entrevista
```
POST /v1/entrevistas
```

**Body:**
```json
{
  "candidatura_id": "uuid (required)",
  "data_hora": "datetime (required)",
  "tipo": "PRESENCIAL|VIDEO|TELEFONE",
  "entrevistadores": ["uuid"]
}
```

## Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | Sucesso |
| 201 | Criado |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Não encontrado |
| 422 | Erro de validação |
| 429 | Rate limit excedido |
| 500 | Erro interno |

## Rate Limiting

- 1000 requisições/hora por token
- Header `X-RateLimit-Remaining` indica requisições restantes

## Paginação

Todas as listagens suportam paginação:
- `page`: Número da página
- `limit`: Itens por página
- Response inclui `meta.total` e `meta.pages`
