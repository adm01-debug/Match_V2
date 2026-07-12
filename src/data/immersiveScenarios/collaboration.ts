import type { ImmersiveScenario } from '@/config/behavioralPillars';

export const COLLABORATION_SCENARIOS: ImmersiveScenario[] = [
  {
    id: 'colaboracao_credito',
    titulo: 'A Vitória Roubada',
    contexto: 'Você trabalha em uma equipe de inovação.',
    tipo: 'conflito_interpessoal',
    narrativa: `Você teve uma ideia brilhante numa reunião de brainstorm.
    Seu colega a desenvolveu, melhorou significativamente e apresentou ao board.
    
    A ideia foi aprovada e ele foi promovido.
    Ele mencionou você brevemente, mas todo o crédito foi para ele.
    
    Algumas pessoas perguntam: "Não foi você que teve a ideia original?"
    
    Como você responde?`,
    pilaresAvaliados: ['colaboracao', 'inteligencia_emocional', 'integridade', 'comunicacao'],
    tempoLimite: 60,
    opcoes: [
      {
        id: 'celebrar_sucesso',
        texto: '"Sim, plantei a semente, mas ele fez o jardim florescer. Estou feliz com o resultado."',
        impacto: { colaboracao: 3, inteligencia_emocional: 3, integridade: 1, resiliencia: 2 },
        tags: ['generoso', 'maduro', 'colaborativo'],
        socialmenteDesejavel: true,
      },
      {
        id: 'esclarecer_contribuicao',
        texto: '"Sim, a ideia original foi minha. É bom ver que ele conseguiu executá-la bem."',
        impacto: { colaboracao: 0, integridade: 2, inteligencia_emocional: 0 },
        tags: ['direto', 'competitivo', 'territorial'],
      },
      {
        id: 'reclamar_lideranca',
        texto: 'Converso reservadamente com a liderança sobre a falta de reconhecimento adequado.',
        impacto: { colaboracao: -2, integridade: 1, comunicacao: 1, inteligencia_emocional: -1 },
        tags: ['reivindicador', 'político', 'competitivo'],
      },
      {
        id: 'ressentido_silencio',
        texto: 'Não digo nada, mas reduzo minha participação em brainstorms futuros. Não vale a pena contribuir.',
        impacto: { colaboracao: -3, resiliencia: -2, inteligencia_emocional: -2 },
        tags: ['passivo-agressivo', 'ressentido', 'fechado'],
      },
    ],
  },
  {
    id: 'colaboracao_colega_dificil',
    titulo: 'O Elo Fraco',
    contexto: 'Você lidera um projeto crítico com 5 pessoas.',
    tipo: 'conflito_interpessoal',
    narrativa: `Maria é tecnicamente competente, mas está criando problemas:
    
    - Chega atrasada em 70% das reuniões
    - Não responde mensagens em tempo hábil
    - Faz trabalho de qualidade, mas sempre fora do prazo
    - Quando confrontada, se vitimiza e diz que "ninguém entende ela"
    
    A equipe está começando a se dividir: uns querem removê-la, outros têm pena.
    O projeto tem deadline em 3 semanas.
    
    O que você faz?`,
    pilaresAvaliados: ['colaboracao', 'lideranca', 'comunicacao', 'inteligencia_emocional'],
    tempoLimite: 120,
    opcoes: [
      {
        id: 'conversa_estruturada',
        texto: 'Conversa 1:1 com Maria: entendo causas, estabeleço expectativas claras e consequências, ofereço suporte.',
        impacto: { colaboracao: 2, lideranca: 3, comunicacao: 2, inteligencia_emocional: 2 },
        tags: ['líder', 'justo', 'estruturado'],
      },
      {
        id: 'redistribuir_tarefas',
        texto: 'Discretamente redistribuo as tarefas críticas dela para não dependermos de sua entrega.',
        impacto: { colaboracao: -1, lideranca: 1, adaptabilidade: 2, comunicacao: -1 },
        tags: ['pragmático', 'evitador', 'protetor'],
      },
      {
        id: 'escalar_rh',
        texto: 'Documento tudo e escalo para RH/gestor. Não é meu papel resolver problemas de performance.',
        impacto: { colaboracao: -1, lideranca: -1, proatividade: -1 },
        tags: ['delegador', 'burocrático', 'distante'],
      },
      {
        id: 'reuniao_equipe',
        texto: 'Faço reunião com toda equipe sobre compromissos coletivos, sem apontar ninguém diretamente.',
        impacto: { colaboracao: 1, lideranca: 0, comunicacao: 1, inteligencia_emocional: 0 },
        tags: ['indireto', 'inclusivo', 'vago'],
      },
    ],
  },
  {
    id: 'colaboracao_competicao',
    titulo: 'A Corrida Interna',
    contexto: 'Você e seu colega competem pela mesma promoção.',
    tipo: 'conflito_interpessoal',
    narrativa: `Você descobriu uma informação estratégica que pode ajudar um projeto importante.
    
    O projeto é liderado pelo seu concorrente à promoção.
    Se você compartilhar, ele vai se destacar ainda mais.
    Se guardar para outro projeto seu, você terá vantagem.
    
    A informação não é confidencial, mas você a descobriu por esforço próprio.
    
    O que você faz?`,
    pilaresAvaliados: ['colaboracao', 'integridade', 'orientacao_resultados'],
    tempoLimite: 60,
    opcoes: [
      {
        id: 'compartilhar_imediato',
        texto: 'Compartilho imediatamente. O sucesso da empresa é mais importante que minha promoção.',
        impacto: { colaboracao: 3, integridade: 3, orientacao_resultados: 1 },
        tags: ['altruísta', 'íntegro', 'coletivista'],
        socialmenteDesejavel: true,
      },
      {
        id: 'compartilhar_conjunto',
        texto: 'Proponho que trabalhemos juntos na aplicação. Dividimos o crédito e potencializamos o resultado.',
        impacto: { colaboracao: 3, pensamento_critico: 2, lideranca: 1, orientacao_resultados: 2 },
        tags: ['estratégico', 'colaborativo', 'criativo'],
      },
      {
        id: 'guardar_meu_projeto',
        texto: 'Guardo para usar no meu projeto. Não é antiético - eu que descobri.',
        impacto: { colaboracao: -2, integridade: -1, orientacao_resultados: 1, proatividade: 0 },
        tags: ['competitivo', 'individualista', 'racional'],
      },
      {
        id: 'vender_informacao',
        texto: 'Compartilho, mas deixo claro que espero reciprocidade futura.',
        impacto: { colaboracao: 0, integridade: 0, pensamento_critico: 1 },
        tags: ['transacional', 'calculista', 'político'],
      },
    ],
  },
];

/**
 * Cenários focados em LIDERANÇA SITUACIONAL
 */
