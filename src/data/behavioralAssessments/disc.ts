import type { BehavioralQuestion } from '@/types/behavioral';

export const discQuestions: BehavioralQuestion[] = [
  {
    id: 'disc-1',
    toolId: 'disc',
    text: 'Quando enfrento um problema difícil, eu prefiro:',
    dimension: 'D',
    type: 'forced_choice',
    options: [
      { text: 'Tomar a iniciativa e agir rapidamente', dimension: 'D', score: 4 },
      { text: 'Conversar com outras pessoas para encontrar soluções', dimension: 'I', score: 4 },
      { text: 'Analisar calmamente todas as opções', dimension: 'S', score: 4 },
      { text: 'Pesquisar dados e fatos antes de decidir', dimension: 'C', score: 4 },
    ],
  },
  {
    id: 'disc-2',
    toolId: 'disc',
    text: 'Em reuniões de equipe, eu geralmente:',
    dimension: 'I',
    type: 'forced_choice',
    options: [
      { text: 'Lidero a discussão e defino a direção', dimension: 'D', score: 4 },
      { text: 'Encorajo todos a participar e manter o ânimo', dimension: 'I', score: 4 },
      { text: 'Escuto atentamente e apoio as ideias dos outros', dimension: 'S', score: 4 },
      { text: 'Faço perguntas detalhadas sobre os planos', dimension: 'C', score: 4 },
    ],
  },
  {
    id: 'disc-3',
    toolId: 'disc',
    text: 'Quando trabalho sob pressão:',
    dimension: 'D',
    type: 'forced_choice',
    options: [
      { text: 'Me torno mais decisivo e focado nos resultados', dimension: 'D', score: 4 },
      { text: 'Busco motivar a equipe e manter o otimismo', dimension: 'I', score: 4 },
      { text: 'Procuro manter a calma e apoiar os colegas', dimension: 'S', score: 4 },
      { text: 'Me concentro ainda mais nos detalhes e na qualidade', dimension: 'C', score: 4 },
    ],
  },
  {
    id: 'disc-4',
    toolId: 'disc',
    text: 'O que mais me frustra no trabalho é:',
    dimension: 'S',
    type: 'forced_choice',
    options: [
      { text: 'Processos lentos e burocracia excessiva', dimension: 'D', score: 4 },
      { text: 'Ambiente muito sério ou pessoas pessimistas', dimension: 'I', score: 4 },
      { text: 'Mudanças constantes e instabilidade', dimension: 'S', score: 4 },
      { text: 'Falta de organização e padrões claros', dimension: 'C', score: 4 },
    ],
  },
  {
    id: 'disc-5',
    toolId: 'disc',
    text: 'Quando recebo feedback negativo:',
    dimension: 'C',
    type: 'forced_choice',
    options: [
      { text: 'Aceito o desafio e busco provar meu valor', dimension: 'D', score: 4 },
      { text: 'Tento entender como posso melhorar o relacionamento', dimension: 'I', score: 4 },
      { text: 'Preciso de tempo para processar a informação', dimension: 'S', score: 4 },
      { text: 'Analiso criticamente se o feedback é justo', dimension: 'C', score: 4 },
    ],
  },
  {
    id: 'disc-6',
    toolId: 'disc',
    text: 'Minha principal motivação no trabalho é:',
    dimension: 'D',
    type: 'forced_choice',
    options: [
      { text: 'Alcançar resultados e vencer desafios', dimension: 'D', score: 4 },
      { text: 'Reconhecimento e conexão com pessoas', dimension: 'I', score: 4 },
      { text: 'Estabilidade e harmonia no ambiente', dimension: 'S', score: 4 },
      { text: 'Precisão e fazer o trabalho correto', dimension: 'C', score: 4 },
    ],
  },
  {
    id: 'disc-7',
    toolId: 'disc',
    text: 'Ao comunicar uma ideia importante:',
    dimension: 'I',
    type: 'forced_choice',
    options: [
      { text: 'Vou direto ao ponto e foco nos resultados', dimension: 'D', score: 4 },
      { text: 'Uso histórias e entusiasmo para engajar', dimension: 'I', score: 4 },
      { text: 'Explico passo a passo com paciência', dimension: 'S', score: 4 },
      { text: 'Apresento dados e evidências detalhadas', dimension: 'C', score: 4 },
    ],
  },
  {
    id: 'disc-8',
    toolId: 'disc',
    text: 'Em situações de conflito, eu:',
    dimension: 'S',
    type: 'forced_choice',
    options: [
      { text: 'Confronto diretamente e busco resolver', dimension: 'D', score: 4 },
      { text: 'Tento mediar e encontrar um meio-termo', dimension: 'I', score: 4 },
      { text: 'Evito o confronto e busco harmonia', dimension: 'S', score: 4 },
      { text: 'Analiso os fatos e busco a solução lógica', dimension: 'C', score: 4 },
    ],
  },
];

// ========================================
// 2. VAK/D - Sistemas Representacionais
// ========================================
