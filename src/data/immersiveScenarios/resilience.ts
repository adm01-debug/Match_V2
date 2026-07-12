import type { ImmersiveScenario } from '@/config/behavioralPillars';

export const RESILIENCE_SCENARIOS: ImmersiveScenario[] = [
  {
    id: 'resiliencia_projeto_cancelado',
    titulo: 'O Projeto Fantasma',
    contexto: 'Você liderou um projeto estratégico por 8 meses.',
    tipo: 'crise',
    narrativa: `Após 8 meses de dedicação intensa, seu projeto foi cancelado por mudança de estratégia corporativa.
    
    A equipe está devastada. Você está devastado.
    Nenhum erro foi cometido - foi apenas "priorização estratégica".
    
    O CEO oferece duas opções:
    - Liderar outro projeto (menor, menos visível)
    - Ser realocado para outra área
    
    A equipe olha para você esperando sua reação.
    
    O que você faz PRIMEIRO?`,
    pilaresAvaliados: ['resiliencia', 'lideranca', 'inteligencia_emocional'],
    tempoLimite: 90,
    opcoes: [
      {
        id: 'processar_reunir',
        texto: 'Peço 24h para processar, depois reúno a equipe para celebrar o que construímos e planejar próximos passos juntos.',
        impacto: { resiliencia: 3, inteligencia_emocional: 3, lideranca: 2, colaboracao: 2 },
        tags: ['maduro', 'líder', 'resiliente'],
      },
      {
        id: 'seguir_frente',
        texto: 'Aceito o novo projeto imediatamente. Não adianta lamentar - vamos em frente.',
        impacto: { resiliencia: 1, inteligencia_emocional: -1, proatividade: 2, orientacao_resultados: 1 },
        tags: ['pragmático', 'supressor', 'focado'],
      },
      {
        id: 'questionar_decisao',
        texto: 'Marco reunião com o CEO para entender melhor a decisão e apresentar argumentos para reconsideração.',
        impacto: { pensamento_critico: 2, lideranca: 1, resiliencia: 0, adaptabilidade: -1 },
        tags: ['questionador', 'assertivo', 'resistente'],
      },
      {
        id: 'pedir_demissao',
        texto: 'Considero seriamente mudar de empresa. Isso mostra que não valorizam meu trabalho.',
        impacto: { resiliencia: -3, inteligencia_emocional: -2, adaptabilidade: -2 },
        tags: ['reativo', 'impulsivo', 'frágil'],
      },
    ],
  },
  {
    id: 'resiliencia_feedback_duro',
    titulo: 'O Espelho Brutal',
    contexto: 'Você acabou de receber sua avaliação anual.',
    tipo: 'situacao_pressao',
    narrativa: `Seu gestor, que você respeita muito, acabou de entregar um feedback devastador:
    
    "Você é tecnicamente brilhante, mas está criando um ambiente tóxico. 
    Três pessoas pediram para sair da sua equipe por causa do seu estilo. 
    Se isso não mudar em 6 meses, não vejo como mantê-lo em posição de liderança."
    
    Você está em choque. Nunca imaginou que as pessoas se sentiam assim.
    
    Qual sua primeira reação?`,
    pilaresAvaliados: ['resiliencia', 'inteligencia_emocional', 'adaptabilidade'],
    tempoLimite: 60,
    opcoes: [
      {
        id: 'absorver_pedir_ajuda',
        texto: 'Agradeço o feedback sincero, peço exemplos específicos e proponho um plano de desenvolvimento com mentoria.',
        impacto: { resiliencia: 3, inteligencia_emocional: 3, adaptabilidade: 3, colaboracao: 2 },
        tags: ['corajoso', 'humilde', 'growth mindset'],
        socialmenteDesejavel: true,
      },
      {
        id: 'defender_contexto',
        texto: 'Peço para contextualizar: estava sob pressão extrema. Normalmente não sou assim.',
        impacto: { resiliencia: -1, inteligencia_emocional: -1, integridade: -1 },
        tags: ['defensivo', 'justificador', 'negador'],
      },
      {
        id: 'questionar_fontes',
        texto: 'Quero saber quem disse isso. Tenho direito de confrontar essas acusações.',
        impacto: { resiliencia: -2, inteligencia_emocional: -2, colaboracao: -2 },
        tags: ['combativo', 'resistente', 'vitimista'],
      },
      {
        id: 'aceitar_silencio',
        texto: 'Ouço em silêncio, agradeço e digo que vou refletir. Preciso de tempo para processar.',
        impacto: { resiliencia: 1, inteligencia_emocional: 1, adaptabilidade: 1 },
        tags: ['reflexivo', 'contido', 'processador'],
      },
    ],
  },
  {
    id: 'resiliencia_fracasso_publico',
    titulo: 'O Tombo Visível',
    contexto: 'Você é diretor de uma startup que acabou de pivotar.',
    tipo: 'crise',
    narrativa: `Você era a estrela da empresa. Fez a apresentação no board que convenceu todos a investir R$10M no novo produto.
    
    6 meses depois, o produto fracassou espetacularmente. 
    A imprensa está noticiando como "o pior lançamento do ano".
    
    O CEO te chama: "Você tem 5 minutos na reunião de segunda para explicar o que aconteceu ao board."
    
    O que você faz?`,
    pilaresAvaliados: ['resiliencia', 'integridade', 'comunicacao', 'lideranca'],
    tempoLimite: 120,
    opcoes: [
      {
        id: 'assumir_aprender',
        texto: 'Preparo apresentação assumindo responsabilidade total, detalhando aprendizados e propondo como avançar.',
        impacto: { resiliencia: 3, integridade: 3, comunicacao: 2, lideranca: 2 },
        tags: ['íntegro', 'corajoso', 'construtivo'],
        socialmenteDesejavel: true,
      },
      {
        id: 'compartilhar_culpa',
        texto: 'Documento todas as decisões coletivas e falhas de execução de outras áreas. Eu não errei sozinho.',
        impacto: { resiliencia: -1, integridade: -2, colaboracao: -2, lideranca: -1 },
        tags: ['defensivo', 'distribuidor de culpa', 'político'],
      },
      {
        id: 'minimizar_dados',
        texto: 'Foco a apresentação nos aprendizados estratégicos valiosos. Erro de execução, não de estratégia.',
        impacto: { resiliencia: 0, integridade: -1, comunicacao: 1, pensamento_critico: -1 },
        tags: ['spin doctor', 'evitador', 'otimista'],
      },
      {
        id: 'pedir_demissao',
        texto: 'Antes da reunião, ofereço minha demissão. A empresa precisa de um bode expiatório claro.',
        impacto: { resiliencia: -2, integridade: 1, lideranca: 0, proatividade: 0 },
        tags: ['honrado', 'extremo', 'escapista'],
      },
    ],
  },
];

/**
 * Cenários focados em INTEGRIDADE RADICAL
 */
