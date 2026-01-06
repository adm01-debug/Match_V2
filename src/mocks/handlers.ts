import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/vagas', () => {
    return HttpResponse.json([
      { id: '1', titulo: 'Desenvolvedor Frontend', status: 'aberta' },
      { id: '2', titulo: 'Desenvolvedor Backend', status: 'aberta' },
    ]);
  }),

  http.get('/api/candidatos', () => {
    return HttpResponse.json([
      { id: '1', nome: 'João Silva', email: 'joao@email.com' },
      { id: '2', nome: 'Maria Santos', email: 'maria@email.com' },
    ]);
  }),

  http.post('/api/candidatos', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>;
    return HttpResponse.json({ id: '3', ...body }, { status: 201 });
  }),
];
