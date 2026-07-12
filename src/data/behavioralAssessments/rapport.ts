import type { BehavioralQuestion } from '@/types/behavioral';

export const rapportQuestions: BehavioralQuestion[] = [
  {
    id: 'rapport-1',
    toolId: 'rapport',
    text: 'Você naturalmente ajusta seu tom de voz ao falar com diferentes pessoas?',
    dimension: 'voice_matching',
    type: 'scale',
    scaleLabels: { min: 'Nunca', max: 'Sempre' },
  },
  {
    id: 'rapport-2',
    toolId: 'rapport',
    text: 'Você percebe e espelha a linguagem corporal dos outros?',
    dimension: 'body_matching',
    type: 'scale',
    scaleLabels: { min: 'Nunca', max: 'Sempre' },
  },
  {
    id: 'rapport-3',
    toolId: 'rapport',
    text: 'Pessoas se abrem facilmente com você?',
    dimension: 'connection',
    type: 'scale',
    scaleLabels: { min: 'Raramente', max: 'Frequentemente' },
  },
  {
    id: 'rapport-4',
    toolId: 'rapport',
    text: 'Você adapta seu vocabulário para se comunicar melhor com diferentes pessoas?',
    dimension: 'language_matching',
    type: 'scale',
    scaleLabels: { min: 'Nunca', max: 'Sempre' },
  },
  {
    id: 'rapport-5',
    toolId: 'rapport',
    text: 'Você percebe quando alguém está desconfortável em uma conversa?',
    dimension: 'awareness',
    type: 'scale',
    scaleLabels: { min: 'Raramente', max: 'Sempre' },
  },
  {
    id: 'rapport-6',
    toolId: 'rapport',
    text: 'Você consegue criar conexão rapidamente com pessoas novas?',
    dimension: 'adjustment',
    type: 'scale',
    scaleLabels: { min: 'Com dificuldade', max: 'Facilmente' },
  },
];

// ========================================
// Function to get questions for a tool
