# API Types Documentation

## Supabase Tables

### Candidatos
```typescript
interface Candidato {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  curriculo_url?: string;
  status: 'novo' | 'em_analise' | 'aprovado' | 'rejeitado';
  created_at: string;
  updated_at: string;
}
```

### Vagas
```typescript
interface Vaga {
  id: string;
  titulo: string;
  descricao: string;
  requisitos: string[];
  salario_min?: number;
  salario_max?: number;
  status: 'aberta' | 'pausada' | 'fechada';
  created_at: string;
  updated_at: string;
}
```

### Entrevistas
```typescript
interface Entrevista {
  id: string;
  candidato_id: string;
  vaga_id: string;
  data_hora: string;
  tipo: 'presencial' | 'online' | 'telefone';
  status: 'agendada' | 'realizada' | 'cancelada';
  notas?: string;
  created_at: string;
}
```

## Edge Functions

### health
- **Endpoint:** `/functions/v1/health`
- **Method:** GET
- **Response:** `{ status: 'ok', timestamp: string }`

### match-score
- **Endpoint:** `/functions/v1/match-score`
- **Method:** POST
- **Body:** `{ candidato_id: string, vaga_id: string }`
- **Response:** `{ score: number, details: MatchDetails }`

## Rate Limiting

All API endpoints implement rate limiting:
- 100 requests per minute per IP
- 1000 requests per hour per user

## Authentication

All endpoints require Bearer token authentication:
```
Authorization: Bearer <supabase_jwt>
```
