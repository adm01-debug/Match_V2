import type { BehavioralQuestion } from '@/types/behavioral';

export const vakdQuestions: BehavioralQuestion[] = [
  {
    id: 'vakd-1',
    toolId: 'vakd',
    text: 'Quando aprendo algo novo, prefiro:',
    dimension: 'V',
    type: 'forced_choice',
    options: [
      { text: 'Ver diagramas, gráficos e demonstrações visuais', dimension: 'V', score: 4 },
      { text: 'Ouvir explicações detalhadas e discussões', dimension: 'A', score: 4 },
      { text: 'Fazer na prática e experimentar', dimension: 'K', score: 4 },
      { text: 'Ler e analisar a documentação escrita', dimension: 'D', score: 4 },
    ],
  },
  {
    id: 'vakd-2',
    toolId: 'vakd',
    text: 'Ao lembrar de um evento importante, você:',
    dimension: 'V',
    type: 'forced_choice',
    options: [
      { text: 'Visualiza cenas e imagens claramente', dimension: 'V', score: 4 },
      { text: 'Lembra dos sons e conversas', dimension: 'A', score: 4 },
      { text: 'Sente as emoções e sensações físicas', dimension: 'K', score: 4 },
      { text: 'Analisa os fatos e a lógica do que aconteceu', dimension: 'D', score: 4 },
    ],
  },
  {
    id: 'vakd-3',
    toolId: 'vakd',
    text: 'Quando toma uma decisão importante, você:',
    dimension: 'D',
    type: 'forced_choice',
    options: [
      { text: 'Imagina como será o resultado visualmente', dimension: 'V', score: 4 },
      { text: 'Conversa consigo mesmo sobre os prós e contras', dimension: 'A', score: 4 },
      { text: 'Confia no que sente ser certo', dimension: 'K', score: 4 },
      { text: 'Lista e analisa todos os dados disponíveis', dimension: 'D', score: 4 },
    ],
  },
  {
    id: 'vakd-4',
    toolId: 'vakd',
    text: 'Ao explicar algo para alguém, você tende a:',
    dimension: 'A',
    type: 'forced_choice',
    options: [
      { text: 'Desenhar ou mostrar imagens e exemplos visuais', dimension: 'V', score: 4 },
      { text: 'Explicar verbalmente com detalhes', dimension: 'A', score: 4 },
      { text: 'Demonstrar fisicamente ou dar exemplos práticos', dimension: 'K', score: 4 },
      { text: 'Escrever passos lógicos e estruturados', dimension: 'D', score: 4 },
    ],
  },
  {
    id: 'vakd-5',
    toolId: 'vakd',
    text: 'Qual tipo de conteúdo você prefere consumir?',
    dimension: 'K',
    type: 'forced_choice',
    options: [
      { text: 'Vídeos, infográficos e apresentações visuais', dimension: 'V', score: 4 },
      { text: 'Podcasts, audiobooks e discussões', dimension: 'A', score: 4 },
      { text: 'Workshops práticos e experiências hands-on', dimension: 'K', score: 4 },
      { text: 'Artigos, relatórios e análises escritas', dimension: 'D', score: 4 },
    ],
  },
  {
    id: 'vakd-6',
    toolId: 'vakd',
    text: 'Ao relaxar, você prefere:',
    dimension: 'K',
    type: 'forced_choice',
    options: [
      { text: 'Assistir filmes, séries ou apreciar arte', dimension: 'V', score: 4 },
      { text: 'Ouvir música ou conversar com amigos', dimension: 'A', score: 4 },
      { text: 'Praticar esportes ou atividades físicas', dimension: 'K', score: 4 },
      { text: 'Ler livros ou resolver puzzles', dimension: 'D', score: 4 },
    ],
  },
];

// ========================================
// 3. Metaprogramas
// ========================================
