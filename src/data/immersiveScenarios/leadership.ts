import type { ImmersiveScenario } from '@/config/behavioralPillars';

export const LEADERSHIP_SCENARIOS: ImmersiveScenario[] = [
  {
    id: 'lideranca_crise_equipe',
    titulo: 'O Capitão na Tempestade',
    contexto: 'Você gerencia uma equipe de 12 pessoas.',
    tipo: 'crise',
    narrativa: `Quinta-feira, 18h. Você acaba de receber a notícia:
    
    - Demissões na segunda: 4 da sua equipe serão cortadas
    - Você sabe quem, mas não pode contar
    - O clima já está tenso por rumores
    - Uma funcionária te pergunta diretamente: "Vai ter demissão?"
    
    Você não pode mentir, mas também não pode confirmar.
    
    O que você responde?`,
    pilaresAvaliados: ['lideranca', 'comunicacao', 'integridade', 'inteligencia_emocional'],
    tempoLimite: 45,
    opcoes: [
      {
        id: 'honestidade_parcial',
        texto: '"Não posso dar detalhes agora, mas teremos comunicado oficial na segunda. Estarei aqui para qualquer um que precisar conversar."',
        impacto: { lideranca: 3, comunicacao: 3, integridade: 2, inteligencia_emocional: 2 },
        tags: ['honesto', 'compassivo', 'presente'],
      },
      {
        id: 'desconversar',
        texto: '"Sempre há mudanças nas empresas. Vamos focar no trabalho e ver o que acontece."',
        impacto: { lideranca: -1, comunicacao: -1, integridade: -1, inteligencia_emocional: -1 },
        tags: ['evasivo', 'distante', 'burocrático'],
      },
      {
        id: 'negar',
        texto: '"Não sei de nada. Se soubesse, te contaria."',
        impacto: { lideranca: -2, integridade: -3, comunicacao: -2 },
        tags: ['mentiroso', 'covarde', 'desconectado'],
      },
      {
        id: 'preparar_sem_falar',
        texto: '"Independente do que aconteça, você tem um talento incrível. Mantenha seu currículo atualizado sempre."',
        impacto: { lideranca: 1, inteligencia_emocional: 2, integridade: 1, comunicacao: 1 },
        tags: ['indireto', 'cuidador', 'protetor'],
      },
    ],
  },
  {
    id: 'lideranca_decisao_impopular',
    titulo: 'O Peso da Coroa',
    contexto: 'Você é diretor de uma área com 50 pessoas.',
    tipo: 'decisao_estrategica',
    narrativa: `A empresa precisa cortar custos. Você tem duas opções:
    
    Opção A: Demitir 5 pessoas
    - Salva os outros 45 empregos
    - É rápido e definitivo
    
    Opção B: Reduzir salários em 15% para todos por 6 meses
    - Ninguém perde emprego
    - Moral pode despencar
    - Se não funcionar, terá que demitir depois
    
    A equipe quer votar democraticamente.
    RH recomenda decisão unilateral.
    
    O que você faz?`,
    pilaresAvaliados: ['lideranca', 'pensamento_critico', 'colaboracao', 'comunicacao'],
    tempoLimite: 120,
    opcoes: [
      {
        id: 'decidir_explicar',
        texto: 'Tomo a decisão (demitir 5), explico os critérios com transparência e assumo totalmente a responsabilidade.',
        impacto: { lideranca: 3, integridade: 2, comunicacao: 2, pensamento_critico: 1 },
        tags: ['decisivo', 'transparente', 'corajoso'],
      },
      {
        id: 'votacao_democratica',
        texto: 'Apresento as duas opções e deixo a equipe votar. Executo o que escolherem.',
        impacto: { lideranca: -1, colaboracao: 2, integridade: 1, resiliencia: -1 },
        tags: ['democrático', 'evitador', 'distribuidor'],
      },
      {
        id: 'hibrido_consulta',
        texto: 'Consulto informalmente líderes-chave, peso inputs, e depois tomo decisão final assumindo autoria.',
        impacto: { lideranca: 2, colaboracao: 2, pensamento_critico: 2, inteligencia_emocional: 1 },
        tags: ['consultivo', 'estratégico', 'equilibrado'],
      },
      {
        id: 'escalar_cima',
        texto: 'Escalo para o CEO decidir. Decisão dessa magnitude não deveria ser minha.',
        impacto: { lideranca: -3, proatividade: -2, resiliencia: -1 },
        tags: ['escapista', 'inseguro', 'delegador'],
      },
    ],
  },
  {
    id: 'lideranca_sem_cargo',
    titulo: 'O Líder Informal',
    contexto: 'Você é analista sênior, não tem cargo de liderança.',
    tipo: 'situacao_pressao',
    narrativa: `O gerente da sua equipe pediu licença médica de 30 dias inesperadamente.
    
    A diretora pergunta quem pode "segurar as pontas".
    Três colegas se olham esperando que alguém se voluntarie.
    Ninguém se move.
    
    Assumir significa:
    - Mais trabalho sem aumento
    - Coordenar pessoas do seu mesmo nível
    - Possível reconhecimento futuro (ou não)
    - Risco de conflitos
    
    O que você faz?`,
    pilaresAvaliados: ['lideranca', 'proatividade', 'colaboracao', 'resiliencia'],
    tempoLimite: 30,
    opcoes: [
      {
        id: 'assumir_total',
        texto: 'Levanto a mão: "Eu assumo. Podemos conversar sobre escopo e suporte?"',
        impacto: { lideranca: 3, proatividade: 3, resiliencia: 1, colaboracao: 1 },
        tags: ['corajoso', 'proativo', 'líder natural'],
      },
      {
        id: 'propor_rotativo',
        texto: 'Proponho que dividamos responsabilidades entre os três. Evita sobrecarga e conflitos.',
        impacto: { colaboracao: 3, lideranca: 1, pensamento_critico: 2, proatividade: 1 },
        tags: ['colaborativo', 'democrático', 'cauteloso'],
      },
      {
        id: 'esperar',
        texto: 'Espero alguém se voluntariar. Se ninguém fizer, considero.',
        impacto: { lideranca: -1, proatividade: -2, resiliencia: 0 },
        tags: ['passivo', 'calculista', 'evitador'],
      },
      {
        id: 'recusar_legitimo',
        texto: 'Explico que meu projeto atual é crítico e não posso dividir atenção agora.',
        impacto: { lideranca: -1, proatividade: -1, integridade: 1, orientacao_resultados: 1 },
        tags: ['focado', 'honesto', 'limitado'],
      },
    ],
  },
];

/**
 * Cenários focados em ADAPTABILIDADE PROATIVA
 */
