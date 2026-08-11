import type { ImmersiveScenario } from '@/config/behavioralPillars';

export const COMMUNICATION_SCENARIOS: ImmersiveScenario[] = [
  {
    id: 'comunicacao_feedback_dificil',
    titulo: 'A Conversa Temida',
    contexto: 'Você precisa dar feedback negativo a um subordinado.',
    tipo: 'conflito_interpessoal',
    narrativa: `João é querido por todos, mas seu trabalho está abaixo do esperado há 6 meses.
    
    Você adiou essa conversa 3 vezes.
    RH diz que você precisa documentar ou não poderá tomar ações depois.
    João acha que está indo bem - nunca recebeu feedback direto.
    
    Como você estrutura a conversa?`,
    pilaresAvaliados: ['comunicacao', 'integridade', 'inteligencia_emocional', 'lideranca'],
    tempoLimite: 90,
    opcoes: [
      {
        id: 'sanduiche',
        texto: 'Começo com pontos positivos, depois problemas, depois plano de desenvolvimento com metas claras.',
        impacto: { comunicacao: 2, inteligencia_emocional: 2, lideranca: 2 },
        tags: ['estruturado', 'equilibrado', 'tradicional'],
      },
      {
        id: 'direto_cuidado',
        texto: 'Vou direto ao ponto com fatos e dados, mas com tom empático. Sem rodeios.',
        impacto: { comunicacao: 3, integridade: 3, inteligencia_emocional: 1, lideranca: 2 },
        tags: ['direto', 'respeitoso', 'claro'],
      },
      {
        id: 'pergunta_primeiro',
        texto: 'Começo perguntando como ELE acha que está indo. Deixo ele liderar a autoavaliação.',
        impacto: { comunicacao: 2, inteligencia_emocional: 3, colaboracao: 2, lideranca: 1 },
        tags: ['socrático', 'empoderador', 'lento'],
      },
      {
        id: 'por_escrito_antes',
        texto: 'Mando resumo por escrito antes da reunião para ele processar. Depois conversamos.',
        impacto: { comunicacao: 1, inteligencia_emocional: 0, lideranca: 0 },
        tags: ['evitador', 'burocrático', 'distante'],
      },
    ],
  },
  {
    id: 'comunicacao_apresentacao_crise',
    titulo: 'O Palco em Chamas',
    contexto: 'Você vai apresentar para o board.',
    tipo: 'situacao_pressao',
    narrativa: `10 minutos antes da sua apresentação crucial, você descobre:
    
    - O número principal que você ia apresentar está errado
    - O erro não muda a conclusão, mas muda a magnitude
    - Você não tem tempo para corrigir os slides
    - O CEO está na sala esperando
    
    O que você faz?`,
    pilaresAvaliados: ['comunicacao', 'integridade', 'resiliencia', 'adaptabilidade'],
    tempoLimite: 30,
    opcoes: [
      {
        id: 'abrir_transparente',
        texto: 'Abro a apresentação reconhecendo o erro, dou o número correto verbalmente, e sigo com a narrativa.',
        impacto: { comunicacao: 3, integridade: 3, resiliencia: 2, adaptabilidade: 2 },
        tags: ['transparente', 'corajoso', 'profissional'],
        socialmenteDesejavel: true,
      },
      {
        id: 'ajustar_verbal',
        texto: 'Não menciono o erro nos slides, mas digo o número correto verbalmente sem chamar atenção.',
        impacto: { comunicacao: 1, integridade: 0, adaptabilidade: 2, resiliencia: 1 },
        tags: ['sutil', 'arriscado', 'adaptável'],
      },
      {
        id: 'pedir_adiamento',
        texto: 'Peço 5 minutos para corrigir o slide antes de começar. Transparência total.',
        impacto: { comunicacao: 2, integridade: 3, resiliencia: 0, adaptabilidade: 1 },
        tags: ['íntegro', 'perfeccionista', 'atrasador'],
      },
      {
        id: 'seguir_errado',
        texto: 'Sigo com os números errados. A conclusão é a mesma e ninguém vai conferir.',
        impacto: { comunicacao: -1, integridade: -3, resiliencia: 0, adaptabilidade: 0 },
        tags: ['antiético', 'arriscado', 'preguiçoso'],
      },
    ],
  },
  {
    id: 'comunicacao_mediacao',
    titulo: 'O Campo Minado',
    contexto: 'Dois colegas importantes estão em conflito.',
    tipo: 'conflito_interpessoal',
    narrativa: `Ana (marketing) e Pedro (produto) não se falam há 2 meses.
    
    - O conflito começou com um email mal interpretado
    - Escalou para acusações de sabotagem
    - Está afetando entregas de todo o time
    - Ambos vieram desabafar com você separadamente
    
    Você não é gestor de nenhum dos dois.
    
    O que você faz?`,
    pilaresAvaliados: ['comunicacao', 'inteligencia_emocional', 'colaboracao', 'lideranca'],
    tempoLimite: 90,
    opcoes: [
      {
        id: 'mediar_ativo',
        texto: 'Proponho ser mediador: converso com cada um, depois facilito uma conversa conjunta estruturada.',
        impacto: { comunicacao: 3, inteligencia_emocional: 2, colaboracao: 3, lideranca: 2 },
        tags: ['mediador', 'corajoso', 'construtivo'],
      },
      {
        id: 'escalar_gestao',
        texto: 'Recomendo que levem ao gestor. Não é meu papel resolver conflitos dos outros.',
        impacto: { comunicacao: 0, lideranca: -1, colaboracao: -1, proatividade: -1 },
        tags: ['distante', 'burocrático', 'limitado'],
      },
      {
        id: 'lado_razao',
        texto: 'Analiso os fatos e digo a cada um onde acho que estão certos e errados.',
        impacto: { comunicacao: 1, inteligencia_emocional: -1, colaboracao: 0, pensamento_critico: 1 },
        tags: ['juiz', 'arriscado', 'direto'],
      },
      {
        id: 'ouvir_neutro',
        texto: 'Ouço os dois com empatia, sem dar opinião. Às vezes as pessoas só precisam ser ouvidas.',
        impacto: { comunicacao: 2, inteligencia_emocional: 3, colaboracao: 1, lideranca: 0 },
        tags: ['empático', 'neutro', 'passivo'],
      },
    ],
  },
];

/**
 * Cenários focados em PENSAMENTO CRÍTICO SISTÊMICO
 */
