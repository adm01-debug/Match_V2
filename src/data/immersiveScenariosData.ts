/**
 * @fileoverview Cenários Imersivos Expandidos para Avaliação Comportamental
 * Cobertura equilibrada dos 10 pilares comportamentais
 * Cada pilar tem pelo menos 3 cenários dedicados
 */

import type { ImmersiveScenario } from '@/config/behavioralPillars';

/**
 * Cenários focados em RESILIÊNCIA ADAPTATIVA
 */
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
export const INTEGRITY_SCENARIOS: ImmersiveScenario[] = [
  {
    id: 'integridade_propina',
    titulo: 'O Envelope Pesado',
    contexto: 'Você é gerente de compras de uma multinacional.',
    tipo: 'dilema_etico',
    narrativa: `Um fornecedor te convida para jantar e, ao final, discretamente coloca um envelope na sua mão.
    
    "Um agradecimento pela nossa parceria. 20 mil. Ninguém precisa saber."
    
    O fornecedor é o mais barato e competente do mercado. 
    Você continuaria indicando ele mesmo sem isso.
    Sua empresa não tem política explícita sobre isso (área cinzenta).
    
    O que você faz?`,
    pilaresAvaliados: ['integridade', 'pensamento_critico', 'comunicacao'],
    tempoLimite: 60,
    opcoes: [
      {
        id: 'devolver_reportar',
        texto: 'Devolvo o envelope imediatamente, explico que não aceito e reporto o incidente ao compliance.',
        impacto: { integridade: 3, comunicacao: 2, resiliencia: 1, proatividade: 1 },
        tags: ['íntegro', 'transparente', 'corajoso'],
        socialmenteDesejavel: true,
      },
      {
        id: 'devolver_silencio',
        texto: 'Devolvo o envelope e peço para nunca mais fazer isso, mas não reporto para não prejudicá-lo.',
        impacto: { integridade: 1, inteligencia_emocional: 1, comunicacao: 0 },
        tags: ['parcialmente íntegro', 'empático', 'protetor'],
      },
      {
        id: 'aceitar_como_bonus',
        texto: 'Aceito discretamente. É prática de mercado e não vai influenciar minhas decisões.',
        impacto: { integridade: -3, pensamento_critico: -2, resiliencia: 0 },
        tags: ['antiético', 'corrupto', 'racionalizador'],
      },
      {
        id: 'doar_anonimamente',
        texto: 'Aceito, mas doo integralmente para caridade. O dinheiro não vai para mim.',
        impacto: { integridade: -2, pensamento_critico: -1, inteligencia_emocional: 0 },
        tags: ['confuso', 'criativo', 'racionalizador'],
      },
    ],
  },
  {
    id: 'integridade_curriculo',
    titulo: 'A Pequena Mentira',
    contexto: 'Você está entrevistando um candidato excelente.',
    tipo: 'dilema_etico',
    narrativa: `O candidato é perfeito para a vaga. Durante a verificação de referências, você descobre:
    
    - Ele disse ter MBA completo, mas abandonou faltando 1 semestre
    - O motivo foi financeiro (mãe doente)
    - Todas as outras informações são verdadeiras
    - Habilidades técnicas foram comprovadas nos testes
    
    Se você reportar, ele será automaticamente desqualificado.
    Ninguém mais sabe dessa descoberta ainda.
    
    O que você faz?`,
    pilaresAvaliados: ['integridade', 'inteligencia_emocional', 'pensamento_critico'],
    tempoLimite: 90,
    opcoes: [
      {
        id: 'confrontar_candidato',
        texto: 'Converso com o candidato primeiro, dou chance de explicar, e juntos decidimos como proceder.',
        impacto: { integridade: 2, inteligencia_emocional: 3, comunicacao: 2, colaboracao: 1 },
        tags: ['justo', 'empático', 'processual'],
      },
      {
        id: 'reportar_imediato',
        texto: 'Reporto imediatamente ao RH. Política é política - não posso fazer exceções.',
        impacto: { integridade: 2, colaboracao: 0, inteligencia_emocional: -1, pensamento_critico: 0 },
        tags: ['rigoroso', 'seguidor de regras', 'inflexível'],
      },
      {
        id: 'ignorar_contratar',
        texto: 'Ignoro a discrepância. O candidato é bom, o motivo foi legítimo, e já comprovamos competência.',
        impacto: { integridade: -2, inteligencia_emocional: 1, pensamento_critico: -1 },
        tags: ['flexível demais', 'empático', 'arriscado'],
      },
      {
        id: 'negociar_retificacao',
        texto: 'Peço ao candidato que retifique o currículo antes de prosseguir. Erro corrigido, seguimos em frente.',
        impacto: { integridade: 1, pensamento_critico: 2, comunicacao: 2, adaptabilidade: 2 },
        tags: ['pragmático', 'solucionador', 'equilibrado'],
      },
    ],
  },
  {
    id: 'integridade_relatorio',
    titulo: 'Os Números Incômodos',
    contexto: 'Você é analista financeiro preparando relatório para investidores.',
    tipo: 'dilema_etico',
    narrativa: `O CFO te pede para "ajustar" algumas métricas no relatório trimestral:
    
    "Tecnicamente está correto, só muda a forma de apresentar. 
    Os investidores vão entender errado se virem os números crus.
    Todas as empresas fazem isso. É só contabilidade criativa."
    
    As mudanças são tecnicamente legais, mas escondem uma tendência negativa real.
    O CFO pode demitir você. O CEO provavelmente sabe.
    
    O que você faz?`,
    pilaresAvaliados: ['integridade', 'resiliencia', 'comunicacao', 'lideranca'],
    tempoLimite: 90,
    opcoes: [
      {
        id: 'recusar_documentar',
        texto: 'Recuso por escrito, explicando os riscos legais e reputacionais. Documento tudo.',
        impacto: { integridade: 3, resiliencia: 2, comunicacao: 2, lideranca: 2 },
        tags: ['íntegro', 'corajoso', 'prudente'],
        socialmenteDesejavel: true,
      },
      {
        id: 'propor_alternativa',
        texto: 'Proponho uma apresentação que seja otimizada mas ainda verdadeira. Encontro meio-termo.',
        impacto: { integridade: 1, pensamento_critico: 2, adaptabilidade: 2, comunicacao: 1 },
        tags: ['criativo', 'negociador', 'equilibrado'],
      },
      {
        id: 'obedecer_silencio',
        texto: 'Faço o que pedem. Não é minha decisão e não quero perder meu emprego.',
        impacto: { integridade: -3, resiliencia: -2, lideranca: -2 },
        tags: ['submisso', 'cúmplice', 'medroso'],
      },
      {
        id: 'denunciar_anonimo',
        texto: 'Faço conforme pedido, mas faço denúncia anônima ao conselho de administração.',
        impacto: { integridade: 0, resiliencia: 1, comunicacao: -1 },
        tags: ['dividido', 'conflituado', 'passivo-agressivo'],
      },
    ],
  },
];

/**
 * Cenários focados em COLABORAÇÃO GENERATIVA
 */
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
export const ADAPTABILITY_SCENARIOS: ImmersiveScenario[] = [
  {
    id: 'adaptabilidade_tecnologia',
    titulo: 'A Onda que Vem',
    contexto: 'Você é gerente em uma área tradicional.',
    tipo: 'inovacao',
    narrativa: `Uma nova tecnologia (IA generativa) ameaça eliminar 60% do trabalho manual da sua equipe em 2 anos.
    
    Você tem 3 cenários possíveis:
    - Ignorar: continuar como está e ver o que acontece
    - Adaptar: treinar equipe atual nas novas ferramentas
    - Antecipar: já começar a reduzir equipe e pilotar automação
    
    A liderança não se posicionou oficialmente.
    Sua equipe não percebeu a ameaça ainda.
    
    O que você faz?`,
    pilaresAvaliados: ['adaptabilidade', 'lideranca', 'pensamento_critico', 'proatividade'],
    tempoLimite: 90,
    opcoes: [
      {
        id: 'piloto_urgente',
        texto: 'Inicio piloto de automação imediatamente + programa de upskilling para a equipe. Não espero aprovação formal.',
        impacto: { adaptabilidade: 3, proatividade: 3, lideranca: 2, pensamento_critico: 2 },
        tags: ['visionário', 'proativo', 'arriscado'],
      },
      {
        id: 'proposta_formal',
        texto: 'Preparo business case detalhado e apresento à liderança antes de qualquer ação.',
        impacto: { adaptabilidade: 1, proatividade: 1, pensamento_critico: 2, comunicacao: 2 },
        tags: ['estruturado', 'político', 'cauteloso'],
      },
      {
        id: 'observar_mercado',
        texto: 'Monitoro o que concorrentes estão fazendo antes de agir. Não quero ser cobaia.',
        impacto: { adaptabilidade: -1, proatividade: -2, pensamento_critico: 1 },
        tags: ['seguidor', 'cauteloso', 'reativo'],
      },
      {
        id: 'alertar_equipe',
        texto: 'Converso abertamente com a equipe sobre o cenário. Juntos decidimos como nos preparar.',
        impacto: { adaptabilidade: 2, colaboracao: 3, lideranca: 2, comunicacao: 2 },
        tags: ['transparente', 'colaborativo', 'empoderador'],
      },
    ],
  },
  {
    id: 'adaptabilidade_mudanca_escopo',
    titulo: 'O Alvo Móvel',
    contexto: 'Você está no meio de um projeto de 6 meses.',
    tipo: 'situacao_pressao',
    narrativa: `Mês 4 de 6. 70% do projeto concluído.
    
    O cliente acabou de mudar completamente os requisitos:
    - Novo escopo invalida 40% do que já foi feito
    - Prazo mantido (2 meses)
    - Orçamento mantido
    - "É assim ou perdemos o contrato"
    
    Sua equipe está exausta. O trabalho feito foi excelente.
    
    Qual sua primeira reação?`,
    pilaresAvaliados: ['adaptabilidade', 'resiliencia', 'comunicacao', 'lideranca'],
    tempoLimite: 60,
    opcoes: [
      {
        id: 'aceitar_replanejar',
        texto: 'Aceito a mudança, replanejo com a equipe identificando o que pode ser reaproveitado, e apresento novo plano realista.',
        impacto: { adaptabilidade: 3, resiliencia: 2, lideranca: 2, pensamento_critico: 2 },
        tags: ['adaptável', 'líder', 'realista'],
      },
      {
        id: 'negociar_tradeoffs',
        texto: 'Volto ao cliente: aceito mudança de escopo SE puder renegociar prazo OU orçamento. Não os dois.',
        impacto: { adaptabilidade: 1, comunicacao: 3, pensamento_critico: 2, integridade: 2 },
        tags: ['negociador', 'assertivo', 'realista'],
      },
      {
        id: 'executar_sacrificio',
        texto: 'A gente dá um jeito. Vou compensar a equipe depois, mas agora é all-in para entregar.',
        impacto: { adaptabilidade: 1, orientacao_resultados: 2, lideranca: -1, inteligencia_emocional: -1 },
        tags: ['workhorse', 'sacrificador', 'míope'],
      },
      {
        id: 'recusar_limite',
        texto: 'Recuso as condições. Se perdemos o contrato, perdemos. Não vou destruir minha equipe.',
        impacto: { adaptabilidade: -2, resiliencia: 1, integridade: 2, lideranca: 1 },
        tags: ['firme', 'protetor', 'inflexível'],
      },
    ],
  },
  {
    id: 'adaptabilidade_nova_funcao',
    titulo: 'O Terreno Desconhecido',
    contexto: 'Você acaba de ser promovido.',
    tipo: 'decisao_estrategica',
    narrativa: `Após 5 anos sendo o melhor técnico da equipe, você foi promovido a gerente.
    
    Primeiras 2 semanas foram desastrosas:
    - Você continua fazendo tarefas técnicas ao invés de delegar
    - A equipe parece confusa sobre quem manda
    - Seu antigo par te questiona em reuniões
    - Você não dormiu direito em 10 dias
    
    Como você reage?`,
    pilaresAvaliados: ['adaptabilidade', 'inteligencia_emocional', 'lideranca', 'resiliencia'],
    tempoLimite: 90,
    opcoes: [
      {
        id: 'pedir_mentor',
        texto: 'Busco mentoria com um gerente experiente e sigo um plano estruturado de transição.',
        impacto: { adaptabilidade: 3, inteligencia_emocional: 2, resiliencia: 2, colaboracao: 1 },
        tags: ['humilde', 'aprendiz', 'estratégico'],
      },
      {
        id: 'confrontar_par',
        texto: 'Converso diretamente com o colega que me questiona. Preciso estabelecer autoridade.',
        impacto: { adaptabilidade: 1, lideranca: 2, comunicacao: 1, inteligencia_emocional: 0 },
        tags: ['assertivo', 'direto', 'territorial'],
      },
      {
        id: 'dobrar_esforco',
        texto: 'Trabalho mais horas até dominar o novo papel. Vai passar.',
        impacto: { adaptabilidade: -1, resiliencia: -2, inteligencia_emocional: -2, orientacao_resultados: 1 },
        tags: ['workaholic', 'stubborn', 'negador'],
      },
      {
        id: 'voltar_tecnico',
        texto: 'Considero pedir para voltar ao cargo técnico. Não nasci para gestão.',
        impacto: { adaptabilidade: -2, resiliencia: -2, lideranca: -2, inteligencia_emocional: 1 },
        tags: ['derrotista', 'autoconsciente', 'limitado'],
      },
    ],
  },
];

/**
 * Cenários focados em PROATIVIDADE ESTRATÉGICA
 */
export const PROACTIVITY_SCENARIOS: ImmersiveScenario[] = [
  {
    id: 'proatividade_oportunidade',
    titulo: 'A Janela Invisível',
    contexto: 'Você trabalha em uma empresa de médio porte.',
    tipo: 'inovacao',
    narrativa: `Lendo notícias, você identifica uma oportunidade de mercado que ninguém na empresa viu:
    
    - Um concorrente grande vai sair de um segmento
    - Isso abre espaço para sua empresa entrar
    - A janela é de 3-6 meses
    - Você não tem autoridade para tomar decisões estratégicas
    
    Trazer isso à tona pode te destacar ou te fazer parecer intrometido.
    
    O que você faz?`,
    pilaresAvaliados: ['proatividade', 'pensamento_critico', 'comunicacao', 'lideranca'],
    tempoLimite: 60,
    opcoes: [
      {
        id: 'preparar_proposta',
        texto: 'Preparo análise estruturada com dados e plano de ação, e agendo reunião com diretoria.',
        impacto: { proatividade: 3, pensamento_critico: 3, comunicacao: 2, lideranca: 2 },
        tags: ['estratégico', 'preparado', 'ambicioso'],
      },
      {
        id: 'comentar_informal',
        texto: 'Comento casualmente com meu gestor para ver se há interesse antes de investir tempo.',
        impacto: { proatividade: 1, comunicacao: 1, adaptabilidade: 1, lideranca: 0 },
        tags: ['cauteloso', 'teste', 'político'],
      },
      {
        id: 'guardar_para_si',
        texto: 'Anoto para acompanhar, mas não é meu papel trazer oportunidades estratégicas.',
        impacto: { proatividade: -2, lideranca: -1, pensamento_critico: 0 },
        tags: ['limitado', 'hierárquico', 'passivo'],
      },
      {
        id: 'compartilhar_rede',
        texto: 'Compartilho a análise no Slack/email da empresa para que os interessados peguem.',
        impacto: { proatividade: 2, colaboracao: 2, comunicacao: 0, lideranca: 0 },
        tags: ['aberto', 'democratizador', 'distante'],
      },
    ],
  },
  {
    id: 'proatividade_processo_ruim',
    titulo: 'O Entulho Corporativo',
    contexto: 'Você percebe um processo ineficiente no seu dia a dia.',
    tipo: 'inovacao',
    narrativa: `Um relatório manual que você faz toda semana:
    
    - Leva 4 horas para produzir
    - Você sabe que pode automatizar em 30 minutos
    - A automação levaria 2 dias para construir
    - Ninguém pediu para você otimizar isso
    - Seu gestor gosta das coisas "como sempre foram"
    
    O que você faz?`,
    pilaresAvaliados: ['proatividade', 'adaptabilidade', 'pensamento_critico', 'orientacao_resultados'],
    tempoLimite: 60,
    opcoes: [
      {
        id: 'automatizar_pedir_perdao',
        texto: 'Automatizo por conta própria, depois mostro o resultado. É mais fácil pedir perdão que permissão.',
        impacto: { proatividade: 3, orientacao_resultados: 2, adaptabilidade: 1, integridade: 0 },
        tags: ['disruptivo', 'executor', 'arriscado'],
      },
      {
        id: 'propor_formalmente',
        texto: 'Documento a ineficiência, calculo ROI e apresento formalmente ao gestor para aprovação.',
        impacto: { proatividade: 2, comunicacao: 2, pensamento_critico: 2, integridade: 2 },
        tags: ['estruturado', 'político', 'processual'],
      },
      {
        id: 'manter_status_quo',
        texto: 'Continuo fazendo manual. Não foi pedido e pode criar problemas mexer no que funciona.',
        impacto: { proatividade: -3, orientacao_resultados: -2, adaptabilidade: -1 },
        tags: ['passivo', 'conformista', 'estagnado'],
      },
      {
        id: 'automatizar_em_casa',
        texto: 'Automatizo no meu tempo livre e uso silenciosamente. Guardo as 4h de economia para mim.',
        impacto: { proatividade: 1, integridade: -1, orientacao_resultados: 1, colaboracao: -1 },
        tags: ['esperto', 'individualista', 'oculto'],
      },
    ],
  },
  {
    id: 'proatividade_cliente_problema',
    titulo: 'O Alarme Silencioso',
    contexto: 'Você é gerente de contas de um cliente importante.',
    tipo: 'situacao_pressao',
    narrativa: `Analisando dados, você percebe que seu maior cliente está usando cada vez menos o produto.
    
    Ainda não reclamaram de nada.
    Outros gerentes de conta não monitoram isso.
    Se você alertar, podem te perguntar por que só agora.
    Se esperar, o cliente pode cancelar.
    
    O contrato renova em 3 meses.
    
    O que você faz?`,
    pilaresAvaliados: ['proatividade', 'orientacao_resultados', 'comunicacao', 'integridade'],
    tempoLimite: 45,
    opcoes: [
      {
        id: 'acionar_imediato',
        texto: 'Ligo para o cliente hoje mesmo para entender a situação e oferecer suporte proativo.',
        impacto: { proatividade: 3, orientacao_resultados: 3, comunicacao: 2, inteligencia_emocional: 2 },
        tags: ['proativo', 'focado no cliente', 'corajoso'],
      },
      {
        id: 'alertar_gestor',
        texto: 'Informo meu gestor antes de contatar o cliente. Quero cobertura se der problema.',
        impacto: { proatividade: 1, integridade: 1, comunicacao: 1, lideranca: -1 },
        tags: ['cauteloso', 'político', 'protetor'],
      },
      {
        id: 'aguardar_sinal',
        texto: 'Monitoro mais algumas semanas para confirmar tendência antes de agir.',
        impacto: { proatividade: -2, orientacao_resultados: -1, pensamento_critico: 1 },
        tags: ['analítico', 'passivo', 'atrasado'],
      },
      {
        id: 'preparar_substituto',
        texto: 'Começo a prospectar novos clientes para compensar possível perda. Não mexo no cliente.',
        impacto: { proatividade: 1, orientacao_resultados: 1, colaboracao: -1, comunicacao: -1 },
        tags: ['pragmático', 'evitador', 'estratégico'],
      },
    ],
  },
];

/**
 * Cenários focados em COMUNICAÇÃO DE ALTO IMPACTO
 */
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
export const CRITICAL_THINKING_SCENARIOS: ImmersiveScenario[] = [
  {
    id: 'pensamento_critico_dados',
    titulo: 'O Gráfico Mentiroso',
    contexto: 'Você é analista numa reunião de planejamento.',
    tipo: 'decisao_estrategica',
    narrativa: `O diretor apresenta um gráfico mostrando sucesso espetacular de uma iniciativa.
    
    Você percebe que:
    - O eixo Y começa em 90%, exagerando a variação
    - O período comparado exclui 3 meses ruins
    - A correlação mostrada não implica causalidade
    
    A sala inteira está aplaudindo. O CEO parece impressionado.
    A decisão de expandir o projeto será tomada agora.
    
    Você é o único que percebeu o problema.
    
    O que você faz?`,
    pilaresAvaliados: ['pensamento_critico', 'integridade', 'comunicacao', 'lideranca'],
    tempoLimite: 60,
    opcoes: [
      {
        id: 'questionar_publico',
        texto: 'Levanto a mão e peço esclarecimento sobre a metodologia, de forma respeitosa mas firme.',
        impacto: { pensamento_critico: 3, integridade: 3, comunicacao: 2, lideranca: 2 },
        tags: ['corajoso', 'analítico', 'íntegro'],
      },
      {
        id: 'questionar_privado',
        texto: 'Abordo o diretor após a reunião para discutir minhas preocupações em particular.',
        impacto: { pensamento_critico: 2, inteligencia_emocional: 2, comunicacao: 1, integridade: 1 },
        tags: ['diplomático', 'cauteloso', 'político'],
      },
      {
        id: 'documentar_email',
        texto: 'Envio email pós-reunião ao grupo levantando as questões metodológicas para registro.',
        impacto: { pensamento_critico: 2, integridade: 2, comunicacao: 0, colaboracao: -1 },
        tags: ['CYA', 'passivo-agressivo', 'burocrático'],
      },
      {
        id: 'deixar_passar',
        texto: 'Fico quieto. Não é meu projeto e questionar um diretor publicamente é suicídio político.',
        impacto: { pensamento_critico: -2, integridade: -2, lideranca: -1 },
        tags: ['covarde', 'político', 'cúmplice'],
      },
    ],
  },
  {
    id: 'pensamento_critico_decisao_rapida',
    titulo: 'O Tiro no Escuro',
    contexto: 'Você lidera um projeto de M&A.',
    tipo: 'decisao_estrategica',
    narrativa: `Oportunidade única de aquisição: decisão precisa ser tomada em 48 horas.
    
    O que você sabe:
    - Target tem tecnologia promissora
    - Financeiro parece sólido (due diligence parcial)
    - Fundadores têm boa reputação
    
    O que você NÃO sabe:
    - Situação real dos contratos de clientes
    - Retenção de funcionários-chave
    - Pendências legais (ainda analisando)
    
    O CEO quer sua recomendação AGORA.
    
    O que você recomenda?`,
    pilaresAvaliados: ['pensamento_critico', 'lideranca', 'adaptabilidade', 'comunicacao'],
    tempoLimite: 120,
    opcoes: [
      {
        id: 'recomendar_estrutura',
        texto: 'Recomendo avançar COM condições: cláusulas de earnout e garantias específicas para riscos não validados.',
        impacto: { pensamento_critico: 3, lideranca: 3, adaptabilidade: 2, comunicacao: 2 },
        tags: ['estratégico', 'criativo', 'realista'],
      },
      {
        id: 'recomendar_sim',
        texto: 'Recomendo aprovar. A oportunidade é única e os indicadores são positivos o suficiente.',
        impacto: { pensamento_critico: -1, proatividade: 2, orientacao_resultados: 1, lideranca: 0 },
        tags: ['otimista', 'arriscado', 'decisivo'],
      },
      {
        id: 'recomendar_nao',
        texto: 'Recomendo recusar. Decisão dessa magnitude precisa de mais informação. Outra oportunidade virá.',
        impacto: { pensamento_critico: 1, resiliencia: 1, orientacao_resultados: -1, lideranca: 0 },
        tags: ['conservador', 'prudente', 'medroso'],
      },
      {
        id: 'pedir_mais_tempo',
        texto: 'Peço mais 1 semana mesmo sabendo que pode perder a oportunidade. Não recomendo no escuro.',
        impacto: { pensamento_critico: 2, integridade: 2, adaptabilidade: -1, proatividade: -1 },
        tags: ['íntegro', 'inflexível', 'perfeccionista'],
      },
    ],
  },
  {
    id: 'pensamento_critico_consenso',
    titulo: 'O Rebanho Pensante',
    contexto: 'Você participa do comitê de estratégia.',
    tipo: 'decisao_estrategica',
    narrativa: `Todos os 7 membros do comitê (incluindo CEO) apoiam fortemente uma nova estratégia.
    
    Você vê falhas sérias que ninguém mencionou:
    - Assume crescimento de mercado de 15% (média histórica é 3%)
    - Ignora novo entrante chinês com preços 40% menores
    - Depende de retenção de 3 pessoas que você sabe que estão insatisfeitas
    
    Já está tudo decidido. Só falta formalizar.
    
    Você é o mais júnior da sala.
    
    O que você faz?`,
    pilaresAvaliados: ['pensamento_critico', 'integridade', 'comunicacao', 'resiliencia'],
    tempoLimite: 60,
    opcoes: [
      {
        id: 'levantar_riscos',
        texto: '"Antes de formalizar, posso levantar 3 riscos que me preocupam para termos registro?"',
        impacto: { pensamento_critico: 3, integridade: 3, comunicacao: 2, lideranca: 2 },
        tags: ['corajoso', 'construtivo', 'profissional'],
        socialmenteDesejavel: true,
      },
      {
        id: 'aprovar_ressalva',
        texto: 'Aprovo com ressalva formal no ata sobre os riscos identificados.',
        impacto: { pensamento_critico: 1, integridade: 1, comunicacao: 1, colaboracao: 0 },
        tags: ['CYA', 'político', 'passivo'],
      },
      {
        id: 'concordar_silencio',
        texto: 'Concordo com o grupo. Eles têm mais experiência e acesso a informação que eu não tenho.',
        impacto: { pensamento_critico: -2, integridade: -1, colaboracao: 1, resiliencia: -1 },
        tags: ['groupthink', 'submisso', 'inseguro'],
      },
      {
        id: 'falar_pos_reuniao',
        texto: 'Após a reunião, mando email só para o CEO com minhas preocupações.',
        impacto: { pensamento_critico: 1, integridade: 0, comunicacao: -1, colaboracao: -1 },
        tags: ['político', 'indireto', 'covarde'],
      },
    ],
  },
];

/**
 * Cenários focados em INTELIGÊNCIA EMOCIONAL
 */
export const EMOTIONAL_INTELLIGENCE_SCENARIOS: ImmersiveScenario[] = [
  {
    id: 'ie_colega_chorando',
    titulo: 'As Lágrimas no Escritório',
    contexto: 'Você encontra um colega chorando no banheiro.',
    tipo: 'conflito_interpessoal',
    narrativa: `Você entra no banheiro e encontra Lucas, gerente sênior respeitado, chorando.
    
    Ele tenta disfarçar: "Ah, é só alergia."
    
    Você sabe que ele passou por uma reunião difícil com o CEO há 30 minutos.
    Vocês não são próximos - relação puramente profissional.
    
    O que você faz?`,
    pilaresAvaliados: ['inteligencia_emocional', 'comunicacao', 'colaboracao'],
    tempoLimite: 30,
    opcoes: [
      {
        id: 'oferecer_espaco',
        texto: '"Entendo. Se precisar de 5 minutos de privacidade, posso garantir que ninguém entre. Ou se quiser conversar, estou aqui."',
        impacto: { inteligencia_emocional: 3, comunicacao: 2, colaboracao: 2 },
        tags: ['empático', 'respeitoso', 'presente'],
      },
      {
        id: 'ignorar_sair',
        texto: 'Finjo que não vi nada, uso o banheiro rapidamente e saio.',
        impacto: { inteligencia_emocional: -1, colaboracao: -1, comunicacao: 0 },
        tags: ['evitador', 'desconfortável', 'distante'],
      },
      {
        id: 'perguntar_direto',
        texto: '"Lucas, claramente não é alergia. O que aconteceu? Posso ajudar?"',
        impacto: { inteligencia_emocional: 1, comunicacao: 1, colaboracao: 1 },
        tags: ['direto', 'bem intencionado', 'invasivo'],
      },
      {
        id: 'mandar_mensagem_depois',
        texto: 'Saio discretamente e mando uma mensagem depois: "Vi que estava difícil. Se precisar, estou disponível."',
        impacto: { inteligencia_emocional: 2, comunicacao: 2, colaboracao: 1 },
        tags: ['respeitoso', 'discreto', 'atencioso'],
      },
    ],
  },
  {
    id: 'ie_propria_raiva',
    titulo: 'O Vulcão Interno',
    contexto: 'Você está numa reunião tensa.',
    tipo: 'situacao_pressao',
    narrativa: `Um colega acabou de te culpar publicamente por um erro que você NÃO cometeu.
    
    O CEO está presente. Seu sangue está fervendo.
    Você tem provas no email de que a culpa não é sua.
    Todos olham esperando sua resposta.
    
    Você sente vontade de explodir.
    
    O que você faz nos próximos 5 segundos?`,
    pilaresAvaliados: ['inteligencia_emocional', 'comunicacao', 'resiliencia', 'integridade'],
    tempoLimite: 20,
    opcoes: [
      {
        id: 'respirar_responder',
        texto: 'Respiro fundo, pauso 3 segundos, e digo calmamente: "Tenho uma perspectiva diferente. Podemos ver os fatos?"',
        impacto: { inteligencia_emocional: 3, comunicacao: 3, resiliencia: 2, lideranca: 2 },
        tags: ['regulado', 'profissional', 'assertivo'],
        socialmenteDesejavel: true,
      },
      {
        id: 'contra_atacar',
        texto: 'Rebato imediatamente: "Isso não é verdade e você sabe. Tenho emails provando."',
        impacto: { inteligencia_emocional: -2, comunicacao: -1, integridade: 1, resiliencia: -1 },
        tags: ['reativo', 'defensivo', 'combativo'],
      },
      {
        id: 'calar_depois',
        texto: 'Fico em silêncio agora. Vou resolver isso depois da reunião, em particular.',
        impacto: { inteligencia_emocional: 1, comunicacao: -1, resiliencia: 0, lideranca: -1 },
        tags: ['controlado', 'passivo', 'estratégico'],
      },
      {
        id: 'sair_sala',
        texto: '"Preciso de 2 minutos. Volto já." Saio para me acalmar.',
        impacto: { inteligencia_emocional: 2, resiliencia: 1, comunicacao: -1 },
        tags: ['autoconsciente', 'extremo', 'visível'],
      },
    ],
  },
  {
    id: 'ie_leitura_sala',
    titulo: 'O Clima Pesado',
    contexto: 'Você está facilitando uma reunião de alinhamento.',
    tipo: 'situacao_pressao',
    narrativa: `15 minutos de reunião e você percebe:
    
    - O diretor de vendas está com braços cruzados, mal falou
    - A diretora de produto olha o celular insistentemente  
    - Há tensão palpável entre dois gerentes que não se olham
    - A pauta não está avançando
    
    Você é o facilitador. Tem mais 45 minutos.
    
    O que você faz?`,
    pilaresAvaliados: ['inteligencia_emocional', 'lideranca', 'comunicacao', 'adaptabilidade'],
    tempoLimite: 45,
    opcoes: [
      {
        id: 'pausar_enderear',
        texto: '"Pausa rápida. Sinto que há algo além da pauta aqui. Alguém quer trazer algo antes de continuarmos?"',
        impacto: { inteligencia_emocional: 3, lideranca: 3, comunicacao: 2, adaptabilidade: 2 },
        tags: ['perceptivo', 'corajoso', 'facilitador'],
      },
      {
        id: 'break_informal',
        texto: '"Vamos fazer um break de 5 minutos. Peguem café." Uso o tempo para conversas 1:1.',
        impacto: { inteligencia_emocional: 2, lideranca: 2, adaptabilidade: 2, comunicacao: 1 },
        tags: ['tático', 'indireto', 'facilitador'],
      },
      {
        id: 'seguir_pauta',
        texto: 'Sigo a pauta mais firmemente. Profissionais precisam separar pessoal do trabalho.',
        impacto: { inteligencia_emocional: -2, lideranca: 0, orientacao_resultados: 1, comunicacao: -1 },
        tags: ['rígido', 'cego', 'focado'],
      },
      {
        id: 'encerrar_reagendar',
        texto: 'Proponho encerrar e reagendar. "Não estamos conseguindo avançar hoje. Melhor voltar com mente fresca."',
        impacto: { inteligencia_emocional: 1, lideranca: 0, adaptabilidade: 1, orientacao_resultados: -1 },
        tags: ['desistente', 'realista', 'evitador'],
      },
    ],
  },
];

/**
 * Cenários focados em ORIENTAÇÃO A RESULTADOS SUSTENTÁVEIS
 */
export const RESULTS_ORIENTATION_SCENARIOS: ImmersiveScenario[] = [
  {
    id: 'resultados_atalho',
    titulo: 'O Caminho Curto',
    contexto: 'Você precisa entregar um projeto em tempo recorde.',
    tipo: 'decisao_estrategica',
    narrativa: `Deadline em 2 semanas. Normalmente levaria 6.
    
    Você identificou um "atalho":
    - Pular testes de segurança (economiza 1 semana)
    - Documentação mínima (economiza 3 dias)
    - Código "bom o suficiente" (economiza 4 dias)
    
    Se der certo: você é herói.
    Se der problema: você é responsável.
    Probabilidade de problema: ~20%
    
    O que você faz?`,
    pilaresAvaliados: ['orientacao_resultados', 'integridade', 'pensamento_critico', 'lideranca'],
    tempoLimite: 90,
    opcoes: [
      {
        id: 'renegociar_escopo',
        texto: 'Volto ao stakeholder: "Posso entregar em 2 semanas, mas com escopo reduzido. Qual parte é essencial?"',
        impacto: { orientacao_resultados: 2, integridade: 3, comunicacao: 2, pensamento_critico: 2 },
        tags: ['negociador', 'realista', 'íntegro'],
      },
      {
        id: 'atalho_documentado',
        texto: 'Tomo o atalho, mas documento os riscos e faço stakeholder assinar termo de aceite.',
        impacto: { orientacao_resultados: 2, integridade: 1, pensamento_critico: 1, comunicacao: 1 },
        tags: ['pragmático', 'CYA', 'arriscado'],
      },
      {
        id: 'atalho_silencioso',
        texto: 'Tomo o atalho sem documentar. Se der problema, resolvo depois.',
        impacto: { orientacao_resultados: 1, integridade: -3, pensamento_critico: -2 },
        tags: ['irresponsável', 'arriscado', 'antiético'],
      },
      {
        id: 'recusar_deadline',
        texto: 'Recuso o deadline. Não é possível entregar com qualidade aceitável.',
        impacto: { orientacao_resultados: -1, integridade: 2, lideranca: 1, resiliencia: 0 },
        tags: ['íntegro', 'inflexível', 'limitado'],
      },
    ],
  },
  {
    id: 'resultados_burnout_equipe',
    titulo: 'O Preço da Vitória',
    contexto: 'Sua equipe está batendo todas as metas.',
    tipo: 'decisao_estrategica',
    narrativa: `Trimestre fantástico: 140% da meta, bônus recorde, CEO te elogiou publicamente.
    
    O que ninguém sabe:
    - 3 pessoas estão tomando remédio para dormir
    - 1 pediu demissão ontem (você convenceu a ficar "mais um mês")
    - Você mesmo está tendo crises de ansiedade
    - Turnover no time foi de 40% no ano
    
    O board quer repetir o resultado no próximo trimestre.
    
    O que você faz?`,
    pilaresAvaliados: ['orientacao_resultados', 'inteligencia_emocional', 'lideranca', 'integridade'],
    tempoLimite: 120,
    opcoes: [
      {
        id: 'transparencia_board',
        texto: 'Apresento ao board o custo humano real e proponho metas sustentáveis com plano de recuperação.',
        impacto: { orientacao_resultados: 1, inteligencia_emocional: 3, integridade: 3, lideranca: 3 },
        tags: ['corajoso', 'sustentável', 'líder real'],
        socialmenteDesejavel: true,
      },
      {
        id: 'contratar_mais',
        texto: 'Peço aumento de headcount para distribuir carga. Mantém o ritmo com mais gente.',
        impacto: { orientacao_resultados: 2, inteligencia_emocional: 1, pensamento_critico: 1, lideranca: 1 },
        tags: ['prático', 'band-aid', 'parcial'],
      },
      {
        id: 'continuar_sprint',
        texto: 'Mais um trimestre de esforço. Depois vamos ter recursos para contratar e aliviar.',
        impacto: { orientacao_resultados: 1, inteligencia_emocional: -3, integridade: -2, lideranca: -2 },
        tags: ['tóxico', 'míope', 'workaholic'],
      },
      {
        id: 'pedir_demissao',
        texto: 'Não aguento mais. Preparo minha saída de forma organizada.',
        impacto: { orientacao_resultados: -1, inteligencia_emocional: 1, integridade: 0, resiliencia: -1 },
        tags: ['autopreservação', 'desistente', 'honesto'],
      },
    ],
  },
  {
    id: 'resultados_qualidade_quantidade',
    titulo: 'O Dilema da Fábrica',
    contexto: 'Você gerencia uma equipe de produção.',
    tipo: 'decisao_estrategica',
    narrativa: `Descoberta recente: você pode aumentar produção em 30% com pequena queda de qualidade.
    
    - De 100 itens, 2-3 teriam defeitos menores (hoje é 0.5)
    - Defeitos são estetéticos, não funcionais
    - Cliente não especificou esse nível de qualidade
    - Concorrentes têm taxa de 5%
    
    30% a mais de produção significa:
    - Bônus maior para a equipe
    - Meta do ano atingida com sobra
    - Sua promoção praticamente garantida
    
    O que você faz?`,
    pilaresAvaliados: ['orientacao_resultados', 'integridade', 'pensamento_critico', 'comunicacao'],
    tempoLimite: 90,
    opcoes: [
      {
        id: 'manter_qualidade',
        texto: 'Mantenho os padrões atuais. Nossa qualidade é nosso diferencial - não vale comprometer.',
        impacto: { orientacao_resultados: 0, integridade: 3, pensamento_critico: 2 },
        tags: ['íntegro', 'conservador', 'qualidade'],
      },
      {
        id: 'consultar_cliente',
        texto: 'Consulto o cliente sobre tolerância a defeitos. Deixo eles decidirem o trade-off.',
        impacto: { orientacao_resultados: 2, integridade: 2, comunicacao: 3, colaboracao: 2 },
        tags: ['transparente', 'colaborativo', 'cliente-cêntrico'],
      },
      {
        id: 'implementar_silencioso',
        texto: 'Implemento a mudança. O cliente não vai perceber e estamos dentro do padrão de mercado.',
        impacto: { orientacao_resultados: 2, integridade: -2, pensamento_critico: -1 },
        tags: ['pragmático', 'antiético', 'arriscado'],
      },
      {
        id: 'piloto_controlado',
        texto: 'Faço piloto de 1 mês, monitoro reclamações de clientes, e decido com dados.',
        impacto: { orientacao_resultados: 1, pensamento_critico: 3, adaptabilidade: 2, integridade: 1 },
        tags: ['científico', 'cauteloso', 'data-driven'],
      },
    ],
  },
];

/**
 * CENÁRIOS CONSOLIDADOS
 * Exporta todos os cenários organizados por pilar
 */
export const ALL_EXPANDED_SCENARIOS: ImmersiveScenario[] = [
  ...RESILIENCE_SCENARIOS,
  ...INTEGRITY_SCENARIOS,
  ...COLLABORATION_SCENARIOS,
  ...LEADERSHIP_SCENARIOS,
  ...ADAPTABILITY_SCENARIOS,
  ...PROACTIVITY_SCENARIOS,
  ...COMMUNICATION_SCENARIOS,
  ...CRITICAL_THINKING_SCENARIOS,
  ...EMOTIONAL_INTELLIGENCE_SCENARIOS,
  ...RESULTS_ORIENTATION_SCENARIOS,
];

/**
 * Mapa de cenários por pilar para fácil acesso
 */
export const SCENARIOS_BY_PILLAR: Record<string, ImmersiveScenario[]> = {
  resiliencia: RESILIENCE_SCENARIOS,
  integridade: INTEGRITY_SCENARIOS,
  colaboracao: COLLABORATION_SCENARIOS,
  lideranca: LEADERSHIP_SCENARIOS,
  adaptabilidade: ADAPTABILITY_SCENARIOS,
  proatividade: PROACTIVITY_SCENARIOS,
  comunicacao: COMMUNICATION_SCENARIOS,
  pensamento_critico: CRITICAL_THINKING_SCENARIOS,
  inteligencia_emocional: EMOTIONAL_INTELLIGENCE_SCENARIOS,
  orientacao_resultados: RESULTS_ORIENTATION_SCENARIOS,
};

/**
 * Função utilitária para selecionar cenários balanceados
 * @param count Número de cenários a selecionar
 * @param requireAllPillars Se deve garantir cobertura de todos os pilares
 */
export function selectBalancedScenarios(count: number, requireAllPillars: boolean = true): ImmersiveScenario[] {
  if (requireAllPillars && count >= 10) {
    // Seleciona pelo menos 1 de cada pilar
    const selected: ImmersiveScenario[] = [];
    const pillars = Object.keys(SCENARIOS_BY_PILLAR);
    
    pillars.forEach(pilar => {
      const scenarios = SCENARIOS_BY_PILLAR[pilar];
      if (scenarios && scenarios.length > 0) {
        const randomIndex = Math.floor(Math.random() * scenarios.length);
        selected.push(scenarios[randomIndex]);
      }
    });
    
    // Preenche o resto aleatoriamente
    while (selected.length < count) {
      const randomPillar = pillars[Math.floor(Math.random() * pillars.length)];
      const scenarios = SCENARIOS_BY_PILLAR[randomPillar];
      if (scenarios && scenarios.length > 0) {
        const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
        if (!selected.find(s => s.id === randomScenario.id)) {
          selected.push(randomScenario);
      }
    }
    
    // Embaralha
    return selected.sort(() => Math.random() - 0.5);
  }
  
  // Seleção aleatória simples
  const shuffled = [...ALL_EXPANDED_SCENARIOS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export default {
  ALL_EXPANDED_SCENARIOS,
  SCENARIOS_BY_PILLAR,
  selectBalancedScenarios,
  RESILIENCE_SCENARIOS,
  INTEGRITY_SCENARIOS,
  COLLABORATION_SCENARIOS,
  LEADERSHIP_SCENARIOS,
  ADAPTABILITY_SCENARIOS,
  PROACTIVITY_SCENARIOS,
  COMMUNICATION_SCENARIOS,
  CRITICAL_THINKING_SCENARIOS,
  EMOTIONAL_INTELLIGENCE_SCENARIOS,
  RESULTS_ORIENTATION_SCENARIOS,
};
