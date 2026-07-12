import type { BehavioralQuestion } from '@/types/behavioral';

export const metaprogramsQuestions: BehavioralQuestion[] = [
  {
    id: 'meta-1',
    toolId: 'metaprograms',
    text: 'O que mais te motiva a agir?',
    dimension: 'approach',
    type: 'scale',
    scaleLabels: { min: 'Evitar problemas', max: 'Alcançar objetivos' },
  },
  {
    id: 'meta-2',
    toolId: 'metaprograms',
    text: 'Ao avaliar seu desempenho, você se baseia principalmente em:',
    dimension: 'reference',
    type: 'scale',
    scaleLabels: { min: 'Sua própria opinião', max: 'Opinião dos outros' },
  },
  {
    id: 'meta-3',
    toolId: 'metaprograms',
    text: 'Quando precisa realizar uma tarefa, você prefere:',
    dimension: 'options',
    type: 'scale',
    scaleLabels: { min: 'Ter várias alternativas', max: 'Seguir um processo definido' },
  },
  {
    id: 'meta-4',
    toolId: 'metaprograms',
    text: 'Você prefere trabalhar com:',
    dimension: 'scope',
    type: 'scale',
    scaleLabels: { min: 'Visão geral e conceitos', max: 'Detalhes específicos' },
  },
  {
    id: 'meta-5',
    toolId: 'metaprograms',
    text: 'Em relação a mudanças:',
    dimension: 'change',
    type: 'scale',
    scaleLabels: { min: 'Prefiro estabilidade', max: 'Busco novidades' },
  },
  {
    id: 'meta-6',
    toolId: 'metaprograms',
    text: 'Ao iniciar uma tarefa:',
    dimension: 'initiative',
    type: 'scale',
    scaleLabels: { min: 'Espero instruções', max: 'Tomo iniciativa' },
  },
  {
    id: 'meta-7',
    toolId: 'metaprograms',
    text: 'Você prefere trabalhar:',
    dimension: 'affiliation',
    type: 'scale',
    scaleLabels: { min: 'Sozinho(a)', max: 'Em equipe' },
  },
  {
    id: 'meta-8',
    toolId: 'metaprograms',
    text: 'Ao comparar coisas, você tende a notar:',
    dimension: 'comparison',
    type: 'scale',
    scaleLabels: { min: 'Semelhanças', max: 'Diferenças' },
  },
];

// ========================================
// 4. Gatilhos Mentais
// ========================================
