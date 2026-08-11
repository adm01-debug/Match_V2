# SDK - Match ATS

## Instalação

### JavaScript/TypeScript
```bash
npm install @matchats/sdk
```

### Python
```bash
pip install matchats
```

## Configuração

### JavaScript
```javascript
import { MatchATS } from '@matchats/sdk';

const client = new MatchATS({
  apiKey: 'sua_api_key',
  baseUrl: 'https://api.matchats.com', // opcional
});
```

### Python
```python
from matchats import MatchATS

client = MatchATS(api_key='sua_api_key')
```

## Uso

### Candidatos

#### Listar
```javascript
const candidatos = await client.candidatos.list({
  page: 1,
  limit: 20,
  search: 'João',
});
```

#### Criar
```javascript
const novoCandidato = await client.candidatos.create({
  nome: 'Maria Silva',
  email: 'maria@email.com',
  telefone: '11999999999',
});
```

#### Obter
```javascript
const candidato = await client.candidatos.get('uuid');
```

#### Atualizar
```javascript
await client.candidatos.update('uuid', {
  telefone: '11888888888',
});
```

### Vagas

#### Listar
```javascript
const vagas = await client.vagas.list({
  status: 'ABERTA',
  departamento: 'Tecnologia',
});
```

#### Criar
```javascript
const novaVaga = await client.vagas.create({
  titulo: 'Desenvolvedor Full Stack',
  descricao: 'Descrição da vaga...',
  tipo: 'CLT',
  modalidade: 'REMOTO',
});
```

### Candidaturas

#### Criar
```javascript
const candidatura = await client.candidaturas.create({
  candidato_id: 'uuid',
  vaga_id: 'uuid',
});
```

#### Atualizar Status
```javascript
await client.candidaturas.updateStatus('uuid', 'ENTREVISTA');
```

### Entrevistas

#### Agendar
```javascript
const entrevista = await client.entrevistas.create({
  candidatura_id: 'uuid',
  data_hora: new Date('2024-02-15T14:00:00'),
  tipo: 'VIDEO',
  entrevistadores: ['uuid1', 'uuid2'],
});
```

## Tratamento de Erros

```javascript
import { MatchATSError, ValidationError, NotFoundError } from '@matchats/sdk';

try {
  await client.candidatos.get('id-invalido');
} catch (error) {
  if (error instanceof NotFoundError) {
    console.log('Candidato não encontrado');
  } else if (error instanceof ValidationError) {
    console.log('Erros de validação:', error.errors);
  } else if (error instanceof MatchATSError) {
    console.log('Erro da API:', error.message);
  }
}
```

## Paginação

```javascript
// Usando cursor
let page = await client.candidatos.list({ limit: 50 });

while (page.hasMore) {
  for (const candidato of page.data) {
    console.log(candidato.nome);
  }
  page = await page.next();
}

// Ou com async iterator
for await (const candidato of client.candidatos.listAll()) {
  console.log(candidato.nome);
}
```

## Webhooks

```javascript
import { verifyWebhookSignature } from '@matchats/sdk';

app.post('/webhook', (req, res) => {
  const isValid = verifyWebhookSignature(
    req.body,
    req.headers['x-webhook-signature'],
    'seu_webhook_secret'
  );

  if (!isValid) {
    return res.status(401).send('Invalid signature');
  }

  const { evento, dados } = req.body;
  // Processar evento...
  
  res.status(200).send('OK');
});
```

## TypeScript

O SDK inclui tipos completos:

```typescript
import { Candidato, Vaga, Candidatura } from '@matchats/sdk';

const candidato: Candidato = await client.candidatos.get('uuid');
```

## Recursos Avançados

### Batch Operations
```javascript
const resultados = await client.batch([
  { method: 'POST', path: '/candidatos', body: { nome: 'A' } },
  { method: 'POST', path: '/candidatos', body: { nome: 'B' } },
]);
```

### Retry Automático
```javascript
const client = new MatchATS({
  apiKey: 'key',
  retry: {
    maxRetries: 3,
    retryDelay: 1000,
  },
});
```
