/**
 * @fileoverview Dados completos das 10 ferramentas de comportamento humano
 * @module BehavioralAssessmentsData
 */

import type { BehavioralTool, BehavioralQuestion } from '@/types/behavioral';

// ========================================
// 1. DISC - Perfis Comportamentais
// ========================================
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
      { text: 'Falta de transparência e honestidade', dimension: 'integrity', score: 4 },
      { text: 'Microgerenciamento constante', dimension: 'autonomy', score: 4 },
      { text: 'Ambiente competitivo e hostil', dimension: 'collaboration', score: 4 },
      { text: 'Estagnação e falta de desafios', dimension: 'growth', score: 4 },
    ],
  },
];

// ========================================
// 8. Inteligência Emocional (EQ)
// ========================================
export const eqQuestions: BehavioralQuestion[] = [
  // Autoconsciência
  {
    id: 'eq-1',
    toolId: 'emotional_intelligence',
    text: 'Consigo identificar claramente quando estou ficando frustrado ou irritado.',
    dimension: 'self_awareness',
    type: 'scale',
    scaleLabels: { min: 'Discordo totalmente', max: 'Concordo totalmente' },
  },
  {
    id: 'eq-2',
    toolId: 'emotional_intelligence',
    text: 'Entendo como minhas emoções afetam meu desempenho.',
    dimension: 'self_awareness',
    type: 'scale',
    scaleLabels: { min: 'Discordo totalmente', max: 'Concordo totalmente' },
  },
  // Autorregulação
  {
    id: 'eq-3',
    toolId: 'emotional_intelligence',
    text: 'Consigo manter a calma em situações de alta pressão.',
    dimension: 'self_regulation',
    type: 'scale',
    scaleLabels: { min: 'Discordo totalmente', max: 'Concordo totalmente' },
  },
  {
    id: 'eq-4',
    toolId: 'emotional_intelligence',
    text: 'Penso antes de agir, mesmo quando estou emocionalmente afetado.',
    dimension: 'self_regulation',
    type: 'scale',
    scaleLabels: { min: 'Discordo totalmente', max: 'Concordo totalmente' },
  },
  // Motivação
  {
    id: 'eq-5',
    toolId: 'emotional_intelligence',
    text: 'Persisto em buscar meus objetivos mesmo quando enfrento obstáculos.',
    dimension: 'motivation',
    type: 'scale',
    scaleLabels: { min: 'Discordo totalmente', max: 'Concordo totalmente' },
  },
  {
    id: 'eq-6',
    toolId: 'emotional_intelligence',
    text: 'Encontro motivação interna mesmo sem reconhecimento externo.',
    dimension: 'motivation',
    type: 'scale',
    scaleLabels: { min: 'Discordo totalmente', max: 'Concordo totalmente' },
  },
  // Empatia
  {
    id: 'eq-7',
    toolId: 'emotional_intelligence',
    text: 'Consigo perceber facilmente quando alguém está desconfortável ou triste.',
    dimension: 'empathy',
    type: 'scale',
    scaleLabels: { min: 'Discordo totalmente', max: 'Concordo totalmente' },
  },
  {
    id: 'eq-8',
    toolId: 'emotional_intelligence',
    text: 'Considero os sentimentos dos outros antes de tomar decisões que os afetam.',
    dimension: 'empathy',
    type: 'scale',
    scaleLabels: { min: 'Discordo totalmente', max: 'Concordo totalmente' },
  },
  // Habilidades Sociais
  {
    id: 'eq-9',
    toolId: 'emotional_intelligence',
    text: 'Construo facilmente relacionamentos de confiança com colegas.',
    dimension: 'social_skills',
    type: 'scale',
    scaleLabels: { min: 'Discordo totalmente', max: 'Concordo totalmente' },
  },
  {
    id: 'eq-10',
    toolId: 'emotional_intelligence',
    text: 'Consigo resolver conflitos de forma que todos se sintam ouvidos.',
    dimension: 'social_skills',
    type: 'scale',
    scaleLabels: { min: 'Discordo totalmente', max: 'Concordo totalmente' },
  },
];

// ========================================
// 9. Vieses Cognitivos
// ========================================
export const cognitiveBiasesQuestions: BehavioralQuestion[] = [
  {
    id: 'bias-1',
    toolId: 'cognitive_biases',
    text: 'Você investiu muito tempo em um projeto que não está dando resultados. Você:',
    dimension: 'sunk_cost',
    type: 'situational',
    options: [
      { text: 'Continua investindo porque já dedicou muito', dimension: 'high', score: 1 },
      { text: 'Avalia objetivamente se vale continuar', dimension: 'medium', score: 3 },
      { text: 'Para imediatamente se os dados indicam', dimension: 'low', score: 5 },
    ],
  },
  {
    id: 'bias-2',
    toolId: 'cognitive_biases',
    text: 'Quando sua primeira impressão de alguém é confirmada por evidências posteriores:',
    dimension: 'confirmation',
    type: 'situational',
    options: [
      { text: 'Sinto que sempre tive razão sobre a pessoa', dimension: 'high', score: 1 },
      { text: 'Considero que talvez eu tenha buscado confirmar', dimension: 'medium', score: 3 },
      { text: 'Busco ativamente evidências que contradigam', dimension: 'low', score: 5 },
    ],
  },
  {
    id: 'bias-3',
    toolId: 'cognitive_biases',
    text: 'Após um evento acontecer, você:',
    dimension: 'hindsight',
    type: 'situational',
    options: [
      { text: 'Frequentemente pensa "eu sabia que isso ia acontecer"', dimension: 'high', score: 1 },
      { text: 'Às vezes sente que deveria ter previsto', dimension: 'medium', score: 3 },
      { text: 'Reconhece que é difícil prever eventos complexos', dimension: 'low', score: 5 },
    ],
  },
  {
    id: 'bias-4',
    toolId: 'cognitive_biases',
    text: 'Quando você é bem-sucedido em algo, você atribui o sucesso a:',
    dimension: 'attribution',
    type: 'forced_choice',
    options: [
      { text: 'Principalmente às minhas habilidades e esforço', dimension: 'internal', score: 2 },
      { text: 'Uma combinação de habilidade e circunstâncias', dimension: 'balanced', score: 4 },
      { text: 'Principalmente a fatores externos favoráveis', dimension: 'external', score: 2 },
    ],
  },
  {
    id: 'bias-5',
    toolId: 'cognitive_biases',
    text: 'Ao estimar quanto tempo uma tarefa vai levar:',
    dimension: 'planning',
    type: 'situational',
    options: [
      { text: 'Geralmente subestimo o tempo necessário', dimension: 'high', score: 1 },
      { text: 'Às vezes acerto, às vezes erro', dimension: 'medium', score: 3 },
      { text: 'Adiciono tempo extra para imprevistos', dimension: 'low', score: 5 },
    ],
  },
];

// ========================================
// 10. Rapport & Espelhamento
// ========================================
export const rapportQuestions: BehavioralQuestion[] = [
  {
    id: 'rapport-1',
    toolId: 'rapport',
    text: 'Com que frequência você naturalmente ajusta seu tom de voz ao falar com diferentes pessoas?',
    dimension: 'voice_matching',
    type: 'scale',
    scaleLabels: { min: 'Nunca', max: 'Sempre' },
  },
  {
    id: 'rapport-2',
    toolId: 'rapport',
    text: 'Você percebe quando está espelhando a linguagem corporal de alguém?',
    dimension: 'body_matching',
    type: 'scale',
    scaleLabels: { min: 'Nunca', max: 'Sempre' },
  },
  {
    id: 'rapport-3',
    toolId: 'rapport',
    text: 'Com que facilidade você estabelece conexão com pessoas desconhecidas?',
    dimension: 'connection',
    type: 'scale',
    scaleLabels: { min: 'Com muita dificuldade', max: 'Com muita facilidade' },
  },
  {
    id: 'rapport-4',
    toolId: 'rapport',
    text: 'Você adapta seu vocabulário e estilo de comunicação conforme a pessoa com quem fala?',
    dimension: 'language_matching',
    type: 'scale',
    scaleLabels: { min: 'Nunca', max: 'Sempre' },
  },
  {
    id: 'rapport-5',
    toolId: 'rapport',
    text: 'Você consegue perceber quando está "em sintonia" com alguém em uma conversa?',
    dimension: 'awareness',
    type: 'scale',
    scaleLabels: { min: 'Raramente', max: 'Frequentemente' },
  },
  {
    id: 'rapport-6',
    toolId: 'rapport',
    text: 'Quando a conexão com alguém não está boa, você consegue ajustar para melhorar?',
    dimension: 'adjustment',
    type: 'scale',
    scaleLabels: { min: 'Raramente', max: 'Frequentemente' },
  },
];

// ========================================
// Export all questions grouped
// ========================================
export const allBehavioralQuestions: Record<string, BehavioralQuestion[]> = {
  disc: discQuestions,
  vakd: vakdQuestions,
  metaprograms: metaprogramsQuestions,
  mental_triggers: mentalTriggersQuestions,
  sleight_of_mouth: sleightOfMouthQuestions,
  emotional_states: emotionalStatesQuestions,
  values: valuesQuestions,
  emotional_intelligence: eqQuestions,
  cognitive_biases: cognitiveBiasesQuestions,
  rapport: rapportQuestions,
};

// Get questions for a specific tool
export const getQuestionsForTool = (toolId: string): BehavioralQuestion[] => {
  return allBehavioralQuestions[toolId] || [];
};
