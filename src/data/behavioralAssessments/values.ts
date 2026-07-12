import type { BehavioralQuestion } from '@/types/behavioral';

export const valuesQuestions: BehavioralQuestion[] = [
  {
    id: 'values-1',
    toolId: 'values',
    text: 'Ordene por importância: O que você mais valoriza no trabalho?',
    dimension: 'work_values',
    type: 'ranking',
    options: [
      { text: 'Autonomia e liberdade', dimension: 'autonomy', score: 0 },
      { text: 'Reconhecimento e status', dimension: 'recognition', score: 0 },
      { text: 'Segurança e estabilidade', dimension: 'security', score: 0 },
      { text: 'Crescimento e aprendizado', dimension: 'growth', score: 0 },
      { text: 'Propósito e impacto', dimension: 'purpose', score: 0 },
    ],
  },
  {
    id: 'values-2',
    toolId: 'values',
    text: 'O que mais te motivaria a aceitar uma nova oportunidade?',
    dimension: 'career_drivers',
    type: 'forced_choice',
    options: [
      { text: 'Salário e benefícios superiores', dimension: 'financial', score: 4 },
      { text: 'Desafios e projetos inovadores', dimension: 'challenge', score: 4 },
      { text: 'Cultura e pessoas inspiradoras', dimension: 'culture', score: 4 },
      { text: 'Equilíbrio vida-trabalho', dimension: 'balance', score: 4 },
    ],
  },
  {
    id: 'values-3',
    toolId: 'values',
    text: 'Ao tomar decisões importantes, qual critério pesa mais?',
    dimension: 'decision_criteria',
    type: 'forced_choice',
    options: [
      { text: 'Análise lógica e dados', dimension: 'logic', score: 4 },
      { text: 'Intuição e sentimento', dimension: 'intuition', score: 4 },
      { text: 'Opinião de pessoas de confiança', dimension: 'social', score: 4 },
      { text: 'Alinhamento com meus valores', dimension: 'values', score: 4 },
    ],
  },
  {
    id: 'values-4',
    toolId: 'values',
    text: 'O que você não toleraria em um ambiente de trabalho?',
    dimension: 'anti_values',
    type: 'forced_choice',
    options: [
      { text: 'Microgerenciamento e falta de autonomia', dimension: 'autonomy', score: 4 },
      { text: 'Falta de reconhecimento pelo trabalho', dimension: 'recognition', score: 4 },
      { text: 'Instabilidade e insegurança', dimension: 'security', score: 4 },
      { text: 'Estagnação e falta de desafios', dimension: 'growth', score: 4 },
    ],
  },
  {
    id: 'values-5',
    toolId: 'values',
    text: 'Quando você se sente mais realizado(a)?',
    dimension: 'fulfillment',
    type: 'forced_choice',
    options: [
      { text: 'Ao completar um projeto desafiador', dimension: 'achievement', score: 4 },
      { text: 'Ao ajudar outros a crescerem', dimension: 'contribution', score: 4 },
      { text: 'Ao inovar e criar algo novo', dimension: 'creativity', score: 4 },
      { text: 'Ao ser reconhecido(a) pelo meu trabalho', dimension: 'recognition', score: 4 },
    ],
  },
  {
    id: 'values-6',
    toolId: 'values',
    text: 'O que define sucesso para você?',
    dimension: 'success_definition',
    type: 'forced_choice',
    options: [
      { text: 'Liberdade financeira e estabilidade', dimension: 'financial', score: 4 },
      { text: 'Impacto positivo na sociedade', dimension: 'purpose', score: 4 },
      { text: 'Crescimento pessoal e profissional contínuo', dimension: 'growth', score: 4 },
      { text: 'Equilíbrio e qualidade de vida', dimension: 'balance', score: 4 },
    ],
  },
];

// ========================================
// 8. Inteligência Emocional
// ========================================
