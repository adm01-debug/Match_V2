import type { BehavioralQuestion } from '@/types/behavioral';

export const emotionalStatesQuestions: BehavioralQuestion[] = [
  {
    id: 'emotion-1',
    toolId: 'emotional_states',
    text: 'Com que facilidade você identifica suas próprias emoções?',
    dimension: 'self_awareness',
    type: 'scale',
    scaleLabels: { min: 'Com dificuldade', max: 'Com muita facilidade' },
  },
  {
    id: 'emotion-2',
    toolId: 'emotional_states',
    text: 'Você consegue mudar seu estado emocional intencionalmente?',
    dimension: 'state_management',
    type: 'scale',
    scaleLabels: { min: 'Raramente', max: 'Frequentemente' },
  },
  {
    id: 'emotion-3',
    toolId: 'emotional_states',
    text: 'Com que facilidade você percebe as emoções dos outros?',
    dimension: 'empathy',
    type: 'scale',
    scaleLabels: { min: 'Com dificuldade', max: 'Com muita facilidade' },
  },
  {
    id: 'emotion-4',
    toolId: 'emotional_states',
    text: 'Você usa músicas, imagens ou memórias para mudar seu humor?',
    dimension: 'anchoring',
    type: 'scale',
    scaleLabels: { min: 'Nunca', max: 'Sempre' },
  },
  {
    id: 'emotion-5',
    toolId: 'emotional_states',
    text: 'Quando está em um estado emocional negativo, você:',
    dimension: 'recovery',
    type: 'forced_choice',
    options: [
      { text: 'Permanece nele por um longo tempo', dimension: 'low', score: 1 },
      { text: 'Consegue sair gradualmente', dimension: 'medium', score: 2 },
      { text: 'Usa técnicas específicas para mudar', dimension: 'high', score: 4 },
      { text: 'Muda rapidamente usando âncoras pessoais', dimension: 'expert', score: 5 },
    ],
  },
  {
    id: 'emotion-6',
    toolId: 'emotional_states',
    text: 'Você consegue ajudar outras pessoas a mudarem seus estados emocionais?',
    dimension: 'influence',
    type: 'scale',
    scaleLabels: { min: 'Raramente', max: 'Frequentemente' },
  },
];

// ========================================
// 7. Valores & Critérios de Decisão
// ========================================
