import type { BehavioralQuestion } from '@/types/behavioral';

export const cognitiveBiasesQuestions: BehavioralQuestion[] = [
  {
    id: 'bias-1',
    toolId: 'cognitive_biases',
    text: 'Ao pesquisar uma decisão, você busca:',
    dimension: 'confirmation',
    type: 'forced_choice',
    options: [
      { text: 'Informações que confirmem sua intuição inicial', dimension: 'high_bias', score: 1 },
      { text: 'Algumas visões diferentes, mas priorizo minha perspectiva', dimension: 'medium_bias', score: 2 },
      { text: 'Ativamente visões que contradizem minha opinião', dimension: 'low_bias', score: 5 },
      { text: 'Todas as perspectivas igualmente antes de decidir', dimension: 'no_bias', score: 5 },
    ],
  },
  {
    id: 'bias-2',
    toolId: 'cognitive_biases',
    text: 'Quando uma primeira informação é apresentada, você:',
    dimension: 'anchoring',
    type: 'scale',
    scaleLabels: { min: 'Ignoro e busco outras referências', max: 'Uso como base principal' },
  },
  {
    id: 'bias-3',
    toolId: 'cognitive_biases',
    text: 'Ao avaliar riscos, você se baseia mais em:',
    dimension: 'availability',
    type: 'forced_choice',
    options: [
      { text: 'Exemplos recentes que lembro facilmente', dimension: 'high_bias', score: 1 },
      { text: 'Uma mistura de memórias e alguns dados', dimension: 'medium_bias', score: 3 },
      { text: 'Estatísticas e dados objetivos', dimension: 'low_bias', score: 5 },
      { text: 'Análise sistemática de múltiplas fontes', dimension: 'no_bias', score: 5 },
    ],
  },
  {
    id: 'bias-4',
    toolId: 'cognitive_biases',
    text: 'Quanto você confia em suas previsões e estimativas?',
    dimension: 'overconfidence',
    type: 'scale',
    scaleLabels: { min: 'Sempre questiono', max: 'Confio plenamente' },
  },
  {
    id: 'bias-5',
    toolId: 'cognitive_biases',
    text: 'Ao decidir sobre continuar um projeto que está falhando:',
    dimension: 'sunk_cost',
    type: 'forced_choice',
    options: [
      { text: 'Considero todo o tempo e recursos já investidos', dimension: 'high_bias', score: 1 },
      { text: 'Peso os investimentos passados na decisão', dimension: 'medium_bias', score: 2 },
      { text: 'Foco principalmente nas perspectivas futuras', dimension: 'low_bias', score: 4 },
      { text: 'Decido apenas com base no valor futuro esperado', dimension: 'no_bias', score: 5 },
    ],
  },
];

// ========================================
// 10. Rapport & Espelhamento
// ========================================
