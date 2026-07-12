import type { BehavioralQuestion } from '@/types/behavioral';

export const mentalTriggersQuestions: BehavioralQuestion[] = [
  {
    id: 'trigger-1',
    toolId: 'mental_triggers',
    text: 'Quando algo é apresentado como uma oportunidade única e limitada:',
    dimension: 'scarcity',
    type: 'scale',
    scaleLabels: { min: 'Fico cético', max: 'Sinto urgência em agir' },
  },
  {
    id: 'trigger-2',
    toolId: 'mental_triggers',
    text: 'Quando um especialista recomenda algo:',
    dimension: 'authority',
    type: 'scale',
    scaleLabels: { min: 'Questiono a recomendação', max: 'Confio plenamente' },
  },
  {
    id: 'trigger-3',
    toolId: 'mental_triggers',
    text: 'Quando muitas pessoas estão fazendo algo:',
    dimension: 'social_proof',
    type: 'scale',
    scaleLabels: { min: 'Isso não me influencia', max: 'Tendo a seguir o grupo' },
  },
  {
    id: 'trigger-4',
    toolId: 'mental_triggers',
    text: 'Quando alguém faz algo bom para mim:',
    dimension: 'reciprocity',
    type: 'scale',
    scaleLabels: { min: 'Agradeço e sigo em frente', max: 'Sinto forte necessidade de retribuir' },
  },
  {
    id: 'trigger-5',
    toolId: 'mental_triggers',
    text: 'Quanto você valoriza consistência com compromissos anteriores?',
    dimension: 'commitment',
    type: 'scale',
    scaleLabels: { min: 'Mudo facilmente de ideia', max: 'Mantenho minhas posições' },
  },
  {
    id: 'trigger-6',
    toolId: 'mental_triggers',
    text: 'Quando gosto de alguém:',
    dimension: 'liking',
    type: 'scale',
    scaleLabels: { min: 'Isso não afeta minhas decisões', max: 'Tendo a concordar mais' },
  },
];

// ========================================
// 5. Sleight of Mouth
// ========================================
