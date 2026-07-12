/**
 * @fileoverview Cenários Imersivos para Avaliação Comportamental.
 * Cada cenário é projetado para revelar comportamentos reais,
 * não respostas "corretas" decoradas.
 */
import type { ImmersiveScenario } from './types';

export const IMMERSIVE_SCENARIOS: ImmersiveScenario[] = [
  // DILEMAS ÉTICOS
  {
    id: 'dilema_dados_cliente',
    titulo: 'O Vazamento Silencioso',
    contexto: 'Você é gerente de produto em uma fintech.',
    tipo: 'dilema_etico',
    narrativa: `Você descobre que um bug no sistema expôs dados sensíveis de 50 clientes por 2 horas há uma semana. 
    O bug já foi corrigido, nenhum dado parece ter sido acessado maliciosamente, e ninguém mais sabe disso. 
    Reportar pode gerar multa milionária, demissões e dano reputacional severo. 
    O CEO te disse informalmente que "prefere não saber de problemas que já foram resolvidos".
    
    O que você faz?`,
    pilaresAvaliados: ['integridade', 'resiliencia', 'comunicacao'],
    tempoLimite: 90,
    opcoes: [
      {
        id: 'reportar_formal',
        texto: 'Reporto formalmente o incidente às autoridades e clientes afetados, documentando tudo.',
        impacto: { integridade: 3, resiliencia: 1, lideranca: 2 },
        tags: ['ético', 'corajoso', 'transparente'],
        socialmenteDesejavel: true,
      },
      {
        id: 'reportar_interno',
        texto: 'Escalo para o jurídico e compliance internamente, deixando a decisão final com eles.',
        impacto: { integridade: 1, colaboracao: 1, adaptabilidade: 0 },
        tags: ['cauteloso', 'delegador', 'processual'],
      },
      {
        id: 'investigar_mais',
        texto: 'Investigo mais profundamente antes de qualquer ação. Preciso ter 100% de certeza.',
        impacto: { pensamento_critico: 1, integridade: -1, proatividade: -1 },
        tags: ['analítico', 'evasivo', 'procrastinador'],
      },
      {
        id: 'deixar_quieto',
        texto: 'O problema já foi resolvido. Reportar agora só causaria dano desnecessário a todos.',
        impacto: { integridade: -3, adaptabilidade: 1, orientacao_resultados: -1 },
        tags: ['pragmático', 'antiético', 'autopreservação'],
      },
    ],
    followUp: {
      condicao: 'reportar_formal',
      pergunta: 'O CEO te chama e diz que você destruiu a empresa. Você foi demitido. Como você se sente?',
      opcoes: [
        {
          id: 'convicto',
          texto: 'Fiz o certo. Minha consciência está limpa e minha reputação intacta.',
          impacto: { integridade: 2, resiliencia: 2, inteligencia_emocional: 1 },
          tags: ['convicção', 'paz interior', 'princípios'],
        },
        {
          id: 'arrependido',
          texto: 'Talvez eu devesse ter sido mais estratégico. Fui ingênuo.',
          impacto: { integridade: -1, adaptabilidade: 1, inteligencia_emocional: 0 },
          tags: ['arrependimento', 'aprendizado', 'pragmatismo'],
        },
      ],
    },
  },
  {
    id: 'credito_roubado',
    titulo: 'A Apresentação Roubada',
    contexto: 'Você trabalha em uma consultoria estratégica.',
    tipo: 'conflito_interpessoal',
    narrativa: `Você desenvolveu uma estratégia inovadora para um cliente importante durante semanas. 
    Seu gerente pediu para ver o material "para dar feedback" e no dia seguinte, 
    apresentou a estratégia para os sócios como se fosse inteiramente dele, sem mencionar seu nome.
    
    Os sócios ficaram impressionados e seu gerente será promovido.
    Você tem provas (emails, versões de documentos).
    
    O que você faz?`,
    pilaresAvaliados: ['integridade', 'comunicacao', 'inteligencia_emocional', 'lideranca'],
    tempoLimite: 120,
    opcoes: [
      {
        id: 'confronto_direto',
        texto: 'Confronto meu gerente diretamente, mostrando as evidências, e exijo reconhecimento público.',
        impacto: { integridade: 2, comunicacao: 1, inteligencia_emocional: -1, colaboracao: -1 },
        tags: ['assertivo', 'confrontacional', 'direto'],
      },
      {
        id: 'escalar_rh',
        texto: 'Documento tudo e escalo para RH/compliance como uma questão de conduta profissional.',
        impacto: { integridade: 1, proatividade: 1, colaboracao: -1 },
        tags: ['formal', 'processual', 'cauteloso'],
      },
      {
        id: 'conversa_reservada',
        texto: 'Peço uma conversa reservada com meu gerente para entender o que aconteceu e buscar uma solução.',
        impacto: { inteligencia_emocional: 2, comunicacao: 2, colaboracao: 1 },
        tags: ['diplomático', 'maduro', 'conciliador'],
      },
      {
        id: 'deixar_passar',
        texto: 'Deixo passar dessa vez, mas fico mais esperto. Documento tudo a partir de agora.',
        impacto: { integridade: -1, adaptabilidade: 1, resiliencia: -1 },
        tags: ['passivo', 'estratégico', 'ressentido'],
      },
      {
        id: 'sabotar_silencioso',
        texto: 'Não digo nada, mas sutilmente deixo os sócios saberem através de "comentários casuais".',
        impacto: { integridade: -2, comunicacao: -2, inteligencia_emocional: -1 },
        tags: ['passivo-agressivo', 'manipulador', 'vingativo'],
      },
    ],
  },
  // SITUAÇÕES DE PRESSÃO
  {
    id: 'deadline_impossivel',
    titulo: 'A Entrega Impossível',
    contexto: 'Você lidera uma equipe de desenvolvimento.',
    tipo: 'situacao_pressao',
    narrativa: `Faltam 5 dias para um lançamento crítico prometido ao maior cliente da empresa.
    Hoje você descobriu que uma integração essencial não vai funcionar - o parceiro tecnológico faliu.
    
    Opções técnicas:
    - Construir do zero: 15 dias mínimo
    - Alternativa improvisada: 4 dias, mas com 30% de chance de bugs críticos
    - Funcionalidade reduzida: 3 dias, mas cliente pode cancelar contrato
    
    O CEO espera que você "dê um jeito".
    Sua equipe já está em burnout após 2 meses de crunch.
    
    O que você faz?`,
    pilaresAvaliados: ['lideranca', 'resiliencia', 'pensamento_critico', 'orientacao_resultados', 'integridade'],
    tempoLimite: 180,
    opcoes: [
      {
        id: 'renegociar_prazo',
        texto: 'Vou ao CEO e cliente com a verdade completa: renegociar prazo ou escopo. Apresento cenários claros.',
        impacto: { integridade: 3, comunicacao: 2, lideranca: 2, orientacao_resultados: 0 },
        tags: ['transparente', 'corajoso', 'realista'],
      },
      {
        id: 'solucao_improvisada',
        texto: 'Vamos com a solução improvisada. Mitigo riscos ao máximo e preparo plano de contingência.',
        impacto: { adaptabilidade: 2, orientacao_resultados: 1, integridade: -1, resiliencia: 1 },
        tags: ['pragmático', 'arriscado', 'orientado a entrega'],
      },
      {
        id: 'crunch_heroico',
        texto: 'Convoco a equipe para um esforço heroico. Vamos construir do zero em 5 dias, custe o que custar.',
        impacto: { orientacao_resultados: 1, lideranca: -1, colaboracao: -2, inteligencia_emocional: -2 },
        tags: ['workaholic', 'tóxico', 'míope'],
      },
      {
        id: 'funcionalidade_reduzida',
        texto: 'Entrego versão reduzida com comunicação impecável sobre valor entregue e roadmap futuro.',
        impacto: { comunicacao: 2, adaptabilidade: 2, pensamento_critico: 1, orientacao_resultados: -1 },
        tags: ['estratégico', 'comunicador', 'adaptável'],
      },
      {
        id: 'escalar_problema',
        texto: 'Escalo para o CEO decidir. Não vou assumir sozinho a responsabilidade por essa situação.',
        impacto: { lideranca: -2, integridade: 0, proatividade: -2 },
        tags: ['delegador', 'evasivo', 'protecionista'],
      },
    ],
  },
  // INOVAÇÃO E RISCO
  {
    id: 'inovacao_arriscada',
    titulo: 'A Aposta de Carreira',
    contexto: 'Você é diretor de inovação em uma empresa tradicional.',
    tipo: 'inovacao',
    narrativa: `Você identificou uma oportunidade disruptiva que pode multiplicar o valor da empresa em 5x em 3 anos.
    Mas exige:
    - Pivotar 40% do negócio atual (lucrativo)
    - Investimento de R$50M
    - Sua reputação está em jogo
    
    Os dados suportam, mas há incerteza significativa.
    O conselho está dividido 50/50.
    Se der errado, você será o bode expiatório.
    Se der certo, será o herói.
    
    O que você faz?`,
    pilaresAvaliados: ['lideranca', 'pensamento_critico', 'resiliencia', 'proatividade', 'orientacao_resultados'],
    tempoLimite: 150,
    opcoes: [
      {
        id: 'all_in',
        texto: 'Vou all-in. Apresento a visão com convicção e me comprometo pessoalmente com o resultado.',
        impacto: { lideranca: 3, proatividade: 3, resiliencia: 1, pensamento_critico: -1 },
        tags: ['visionário', 'corajoso', 'arriscado'],
      },
      {
        id: 'piloto_controlado',
        texto: 'Proponho um piloto controlado: 10% do investimento para validar hipóteses em 6 meses.',
        impacto: { pensamento_critico: 3, adaptabilidade: 2, lideranca: 1, proatividade: 1 },
        tags: ['estratégico', 'científico', 'prudente'],
      },
      {
        id: 'buscar_aliados',
        texto: 'Antes de propor, construo coalizão no conselho. Só avanço com maioria garantida.',
        impacto: { colaboracao: 2, lideranca: 1, proatividade: 0, inteligencia_emocional: 2 },
        tags: ['político', 'estratégico', 'cauteloso'],
      },
      {
        id: 'recuar',
        texto: 'O risco é muito alto para minha carreira. Documento a oportunidade e deixo para outro momento.',
        impacto: { lideranca: -2, proatividade: -2, resiliencia: -1, adaptabilidade: 0 },
        tags: ['medroso', 'conservador', 'autopreservação'],
      },
    ],
  },
  // GESTÃO DE PESSOAS
  {
    id: 'demissao_dificil',
    titulo: 'O Amigo Incompetente',
    contexto: 'Você é gerente de uma equipe de 8 pessoas.',
    tipo: 'conflito_interpessoal',
    narrativa: `Carlos foi seu mentor quando você entrou na empresa. Hoje você é chefe dele.
    Nos últimos 6 meses, o desempenho dele despencou:
    - 3 projetos atrasados
    - Conflitos constantes com a equipe
    - Erros técnicos graves
    
    Você já deu feedback formal 2 vezes. Ele melhorou por 2 semanas e regrediu.
    RH diz que você tem base para demitir.
    Carlos está passando por um divórcio e tem 2 filhos pequenos.
    
    O que você faz?`,
    pilaresAvaliados: ['lideranca', 'inteligencia_emocional', 'integridade', 'orientacao_resultados', 'comunicacao'],
    tempoLimite: 120,
    opcoes: [
      {
        id: 'demitir_agora',
        texto: 'Processo de desligamento imediato. É o melhor para a equipe e para ele buscar algo mais adequado.',
        impacto: { orientacao_resultados: 2, lideranca: 1, inteligencia_emocional: -1, integridade: 1 },
        tags: ['decisivo', 'duro', 'pragmático'],
      },
      {
        id: 'ultima_chance',
        texto: 'Dou 30 dias finais com metas claríssimas e suporte intensivo. Documento tudo.',
        impacto: { inteligencia_emocional: 2, integridade: 2, lideranca: 1, colaboracao: 1 },
        tags: ['justo', 'empático', 'processual'],
      },
      {
        id: 'realocacao',
        texto: 'Busco uma posição diferente na empresa onde ele possa ter sucesso. Função lateral.',
        impacto: { colaboracao: 2, inteligencia_emocional: 2, orientacao_resultados: -1 },
        tags: ['criativo', 'empático', 'evitador'],
      },
      {
        id: 'delegar_rh',
        texto: 'Entrego para o RH conduzir. Não quero destruir nossa amizade de anos.',
        impacto: { lideranca: -2, integridade: -1, inteligencia_emocional: 0 },
        tags: ['evasivo', 'covarde', 'conflitante'],
      },
      {
        id: 'ignorar',
        texto: 'Aguento mais um pouco. As coisas pessoais dele vão se resolver e ele vai voltar ao normal.',
        impacto: { lideranca: -2, orientacao_resultados: -2, pensamento_critico: -1 },
        tags: ['passivo', 'esperançoso', 'negligente'],
      },
    ],
  },
  // CRISE
  {
    id: 'crise_reputacional',
    titulo: 'O Viral Negativo',
    contexto: 'Você é diretor de comunicação de uma empresa de e-commerce.',
    tipo: 'crise',
    narrativa: `Um vídeo viralizou (5M de views em 3 horas) mostrando um entregador da sua empresa 
    jogando um pacote por cima de um muro, que quebrou um item de R$2.000.
    
    O cliente está furioso nas redes, influenciadores estão amplificando, 
    hashtag #BoicoteEmpresaX está trending.
    
    Detalhes que você sabe:
    - O entregador é terceirizado
    - A política da empresa proíbe isso, mas fiscalização é fraca
    - Já houve casos similares não publicizados
    
    O CEO quer uma resposta em 1 hora.
    
    O que você faz?`,
    pilaresAvaliados: ['comunicacao', 'pensamento_critico', 'integridade', 'lideranca', 'adaptabilidade'],
    tempoLimite: 90,
    opcoes: [
      {
        id: 'transparencia_total',
        texto: 'Comunicado público assumindo responsabilidade total, detalhando ações imediatas e mudanças estruturais.',
        impacto: { integridade: 3, comunicacao: 2, lideranca: 2 },
        tags: ['transparente', 'corajoso', 'responsável'],
      },
      {
        id: 'culpar_terceirizado',
        texto: 'Nota técnica explicando que era terceirizado, já foi desligado, reforçando processos de fiscalização.',
        impacto: { integridade: -2, comunicacao: -1, pensamento_critico: 0 },
        tags: ['defensivo', 'evasivo', 'corporativista'],
      },
      {
        id: 'contato_direto',
        texto: 'Antes de qualquer nota, contato pessoal com o cliente: reembolso + compensação + pedido de desculpas genuíno.',
        impacto: { inteligencia_emocional: 3, comunicacao: 2, orientacao_resultados: 2 },
        tags: ['empático', 'estratégico', 'resolutivo'],
      },
      {
        id: 'aguardar',
        texto: 'Espero 24-48h para ver se esfria. Às vezes, responder rápido amplia a crise.',
        impacto: { pensamento_critico: 0, comunicacao: -2, adaptabilidade: -1, lideranca: -1 },
        tags: ['passivo', 'arriscado', 'calculista'],
      },
    ],
    followUp: {
      condicao: 'transparencia_total',
      pergunta: 'O público respondeu bem. Mas o CEO está furioso porque você "admitiu culpa" sem consultar jurídico. O que você diz?',
      opcoes: [
        {
          id: 'defender_decisao',
          texto: 'Defendo minha decisão com dados: o sentimento mudou 180° e evitamos processo maior. Era o certo.',
          impacto: { lideranca: 2, comunicacao: 2, resiliencia: 1 },
          tags: ['assertivo', 'baseado em dados', 'confiante'],
        },
        {
          id: 'pedir_desculpas',
          texto: 'Peço desculpas por não alinhar. Reconheço que deveria ter consultado, mesmo na urgência.',
          impacto: { inteligencia_emocional: 2, colaboracao: 1, integridade: 1 },
          tags: ['humilde', 'colaborativo', 'aprendiz'],
        },
      ],
    },
  },
];
