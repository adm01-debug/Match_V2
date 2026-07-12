import type { BehavioralQuestion } from '@/types/behavioral';

export const sleightOfMouthQuestions: BehavioralQuestion[] = [
  {
    id: 'som-1',
    toolId: 'sleight_of_mouth',
    text: 'Leia a crença: "Não tenho tempo para aprender coisas novas". Qual reframe você usaria?',
    dimension: 'reframe',
    type: 'situational',
    options: [
      { text: 'E se você pudesse aprender enquanto faz outras coisas?', dimension: 'chunk_down', score: 4 },
      { text: 'Aprender coisas novas não economizaria tempo no futuro?', dimension: 'consequence', score: 4 },
      { text: 'O que você faria se tivesse todo o tempo do mundo?', dimension: 'intention', score: 4 },
      { text: 'Quem disse que aprender precisa de muito tempo?', dimension: 'meta_frame', score: 4 },
    ],
  },
  {
    id: 'som-2',
    toolId: 'sleight_of_mouth',
    text: 'Leia: "Sou muito velho para mudar de carreira". Qual reframe ressoa mais com você?',
    dimension: 'reframe',
    type: 'situational',
    options: [
      { text: 'Sua experiência é exatamente o que te qualifica', dimension: 'redefine', score: 4 },
      { text: 'Quantas pessoas de sua idade fizeram mudanças bem-sucedidas?', dimension: 'counter_example', score: 4 },
      { text: 'O que é mais arriscado: mudar ou se arrepender?', dimension: 'consequence', score: 4 },
      { text: 'A idade te dá sabedoria que os jovens não têm', dimension: 'another_outcome', score: 4 },
    ],
  },
  {
    id: 'som-3',
    toolId: 'sleight_of_mouth',
    text: 'Quando alguém apresenta uma crença limitante, você naturalmente:',
    dimension: 'natural_pattern',
    type: 'forced_choice',
    options: [
      { text: 'Busca as consequências positivas de outra perspectiva', dimension: 'consequence', score: 4 },
      { text: 'Procura exemplos que contradizem a crença', dimension: 'counter_example', score: 4 },
      { text: 'Redefine o significado das palavras usadas', dimension: 'redefine', score: 4 },
      { text: 'Questiona a origem ou utilidade da crença', dimension: 'meta_frame', score: 4 },
    ],
  },
];

// ========================================
// 6. Estados Emocionais & Âncoras
// ========================================
