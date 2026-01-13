/**
 * @fileoverview Os 10 Pilares do Comportamento - Framework Disruptivo
 * Sistema de avaliação comportamental baseado em cenários imersivos,
 * dilemas éticos e análise de padrões de resposta.
 */

export interface BehavioralPillar {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
  dimensoes: string[];
  indicadores: string[];
  perguntasChave: string[];
}

export interface ScenarioOption {
  id: string;
  texto: string;
  /** Impacto nos pilares: { pilarId: pontuação (-3 a +3) } */
  impacto: Record<string, number>;
  /** Tags para análise qualitativa */
  tags: string[];
  /** Se é uma resposta "socialmente desejável" */
  socialmenteDesejavel?: boolean;
}

export interface ImmersiveScenario {
  id: string;
  titulo: string;
  contexto: string;
  narrativa: string;
  tipo: 'dilema_etico' | 'situacao_pressao' | 'conflito_interpessoal' | 'decisao_estrategica' | 'crise' | 'inovacao';
  pilaresAvaliados: string[];
  opcoes: ScenarioOption[];
  tempoLimite?: number; // segundos - pressão temporal revela comportamento real
  followUp?: {
    condicao: string; // opção selecionada
    pergunta: string;
    opcoes: ScenarioOption[];
  };
}

export interface CompanyProfile {
  id: string;
  nome: string;
  descricao: string;
  valores: string[];
  cultura: 'startup' | 'corporativa' | 'hibrida' | 'tradicional' | 'inovadora';
  ritmo: 'intenso' | 'moderado' | 'tranquilo';
  hierarquia: 'horizontal' | 'vertical' | 'matricial';
  pilaresValorizados: Record<string, number>; // peso de 1-10 para cada pilar
  dealbreakers: string[]; // comportamentos inaceitáveis
}

/**
 * Os 10 Pilares do Comportamento
 * Baseados em pesquisa científica de psicologia organizacional,
 * neurociência e análise preditiva de performance.
 */
export const BEHAVIORAL_PILLARS: BehavioralPillar[] = [
  {
    id: 'resiliencia',
    nome: 'Resiliência Adaptativa',
    descricao: 'Capacidade de se recuperar de adversidades, aprender com fracassos e emergir mais forte. Não é apenas "aguentar", mas transformar desafios em crescimento.',
    icone: 'Shield',
    cor: 'bg-emerald-500',
    dimensoes: [
      'Recuperação emocional',
      'Aprendizado com erros',
      'Persistência inteligente',
      'Gestão do estresse',
    ],
    indicadores: [
      'Tempo de recuperação após frustração',
      'Qualidade das lições extraídas',
      'Manutenção de performance sob pressão',
      'Flexibilidade de estratégia',
    ],
    perguntasChave: [
      'Conte sobre sua maior falha profissional e o que você fez depois',
      'Como você reagiu quando um projeto importante foi cancelado?',
      'Descreva uma situação onde você teve que recomeçar do zero',
    ],
  },
  {
    id: 'integridade',
    nome: 'Integridade Radical',
    descricao: 'Coerência entre valores, palavras e ações, mesmo quando ninguém está olhando. Coragem moral para fazer o certo, não apenas o conveniente.',
    icone: 'Scale',
    cor: 'bg-blue-600',
    dimensoes: [
      'Consistência ética',
      'Transparência',
      'Responsabilização',
      'Coragem moral',
    ],
    indicadores: [
      'Alinhamento discurso-ação',
      'Reação a dilemas éticos',
      'Admissão de erros',
      'Posicionamento em situações difíceis',
    ],
    perguntasChave: [
      'Você já discordou de uma decisão da liderança por questões éticas? O que fez?',
      'Conte sobre uma vez que você poderia ter levado vantagem, mas escolheu não fazer',
      'Como você age quando descobre que alguém da equipe está agindo de forma antiética?',
    ],
  },
  {
    id: 'colaboracao',
    nome: 'Colaboração Generativa',
    descricao: 'Capacidade de criar valor coletivo maior que a soma das partes individuais. Vai além de "trabalhar em equipe" - é sobre potencializar o outro.',
    icone: 'Users',
    cor: 'bg-violet-500',
    dimensoes: [
      'Complementaridade',
      'Escuta ativa',
      'Construção sobre ideias',
      'Gestão de conflitos construtiva',
    ],
    indicadores: [
      'Frequência de crédito compartilhado',
      'Qualidade das contribuições em grupo',
      'Resolução de conflitos',
      'Mentoria espontânea',
    ],
    perguntasChave: [
      'Descreva um projeto onde o sucesso dependeu totalmente da colaboração',
      'Como você lida quando alguém da equipe não está entregando?',
      'Conte sobre uma vez que você ajudou um colega a brilhar',
    ],
  },
  {
    id: 'lideranca',
    nome: 'Liderança Situacional',
    descricao: 'Capacidade de influenciar positivamente, independente de cargo. Adapta estilo conforme contexto, pessoas e objetivos.',
    icone: 'Crown',
    cor: 'bg-amber-500',
    dimensoes: [
      'Influência sem autoridade',
      'Desenvolvimento de pessoas',
      'Visão estratégica',
      'Tomada de decisão',
    ],
    indicadores: [
      'Seguidores voluntários',
      'Crescimento de liderados',
      'Qualidade de decisões sob incerteza',
      'Capacidade de mobilização',
    ],
    perguntasChave: [
      'Conte sobre uma vez que você liderou sem ter o cargo formal',
      'Como você desenvolve pessoas da sua equipe?',
      'Descreva uma decisão difícil que você tomou e seu impacto',
    ],
  },
  {
    id: 'adaptabilidade',
    nome: 'Adaptabilidade Proativa',
    descricao: 'Não apenas reagir a mudanças, mas antecipá-las e moldá-las. Conforto com ambiguidade e capacidade de operar em cenários incertos.',
    icone: 'Shuffle',
    cor: 'bg-cyan-500',
    dimensoes: [
      'Flexibilidade cognitiva',
      'Antecipação de tendências',
      'Conforto com ambiguidade',
      'Aprendizado contínuo',
    ],
    indicadores: [
      'Velocidade de adaptação',
      'Qualidade de previsões',
      'Performance em cenários novos',
      'Diversidade de experiências buscadas',
    ],
    perguntasChave: [
      'Conte sobre a maior mudança que você enfrentou na carreira',
      'Como você se prepara para cenários incertos?',
      'Descreva uma situação onde você teve que aprender algo completamente novo rapidamente',
    ],
  },
  {
    id: 'proatividade',
    nome: 'Proatividade Estratégica',
    descricao: 'Iniciativa direcionada por propósito e estratégia. Não é apenas "fazer mais", mas fazer o que importa antes de ser pedido.',
    icone: 'Rocket',
    cor: 'bg-orange-500',
    dimensoes: [
      'Antecipação de necessidades',
      'Iniciativa calculada',
      'Ownership',
      'Criação de oportunidades',
    ],
    indicadores: [
      'Projetos iniciados espontaneamente',
      'Problemas resolvidos antes de escalar',
      'Sugestões implementadas',
      'Impacto de iniciativas',
    ],
    perguntasChave: [
      'Conte sobre algo importante que você fez sem ninguém pedir',
      'Como você identifica oportunidades que outros não veem?',
      'Descreva uma melhoria que você implementou por iniciativa própria',
    ],
  },
  {
    id: 'comunicacao',
    nome: 'Comunicação de Alto Impacto',
    descricao: 'Capacidade de transmitir ideias complexas com clareza e adaptar a mensagem ao público. Inclui escuta profunda e feedback construtivo.',
    icone: 'MessageCircle',
    cor: 'bg-pink-500',
    dimensoes: [
      'Clareza e síntese',
      'Escuta profunda',
      'Adaptação ao público',
      'Feedback construtivo',
    ],
    indicadores: [
      'Compreensão da mensagem pelo receptor',
      'Qualidade de perguntas feitas',
      'Efetividade de apresentações',
      'Resolução de mal-entendidos',
    ],
    perguntasChave: [
      'Conte sobre uma vez que você precisou explicar algo complexo para um público leigo',
      'Como você dá feedback difícil para um colega?',
      'Descreva uma situação onde a comunicação foi crucial para o sucesso',
    ],
  },
  {
    id: 'pensamento_critico',
    nome: 'Pensamento Crítico Sistêmico',
    descricao: 'Capacidade de analisar problemas em múltiplas dimensões, questionar premissas e enxergar conexões não óbvias. Pensamento de segunda ordem.',
    icone: 'Brain',
    cor: 'bg-indigo-500',
    dimensoes: [
      'Análise de causa raiz',
      'Pensamento sistêmico',
      'Questionamento de premissas',
      'Síntese de informações',
    ],
    indicadores: [
      'Qualidade de diagnósticos',
      'Identificação de consequências de segunda ordem',
      'Desafio de status quo',
      'Conexão de informações díspares',
    ],
    perguntasChave: [
      'Conte sobre um problema complexo que você resolveu de forma não convencional',
      'Como você questiona decisões que parecem "óbvias"?',
      'Descreva uma vez que sua análise mudou completamente a direção de um projeto',
    ],
  },
  {
    id: 'inteligencia_emocional',
    nome: 'Inteligência Emocional Aplicada',
    descricao: 'Consciência e regulação das próprias emoções e capacidade de navegar as emoções dos outros. Empatia em ação.',
    icone: 'Heart',
    cor: 'bg-rose-500',
    dimensoes: [
      'Autoconsciência',
      'Autorregulação',
      'Empatia',
      'Habilidade social',
    ],
    indicadores: [
      'Reconhecimento de gatilhos emocionais',
      'Tempo de recuperação emocional',
      'Leitura de dinâmicas de grupo',
      'Construção de relacionamentos',
    ],
    perguntasChave: [
      'Conte sobre uma situação onde suas emoções quase atrapalharam e como você lidou',
      'Como você percebe quando algo está errado com um colega?',
      'Descreva como você construiu uma relação difícil no trabalho',
    ],
  },
  {
    id: 'orientacao_resultados',
    nome: 'Orientação a Resultados Sustentáveis',
    descricao: 'Foco em entregar resultados de alto impacto sem sacrificar pessoas, ética ou sustentabilidade. Resultado bom é o que dura.',
    icone: 'Target',
    cor: 'bg-green-600',
    dimensoes: [
      'Definição de metas',
      'Execução disciplinada',
      'Mensuração de impacto',
      'Sustentabilidade',
    ],
    indicadores: [
      'Histórico de metas atingidas',
      'Qualidade vs velocidade',
      'Impacto de longo prazo',
      'Custo humano das entregas',
    ],
    perguntasChave: [
      'Conte sobre seu resultado mais significativo e como você chegou lá',
      'Como você equilibra velocidade de entrega com qualidade?',
      'Descreva uma meta que você não atingiu e o que aprendeu',
    ],
  },
];

/**
 * Cenários Imersivos para Avaliação Comportamental
 * Cada cenário é projetado para revelar comportamentos reais,
 * não respostas "corretas" decoradas.
 */
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

/**
 * Perfis de Cultura Organizacional
 * Para matching bidirecional empresa-candidato
 */
export const COMPANY_CULTURE_DIMENSIONS = {
  velocidade: {
    label: 'Velocidade vs Perfeição',
    extremos: ['Move fast and break things', 'Measure twice, cut once'],
    descricao: 'Preferência por velocidade de entrega vs qualidade e planejamento',
  },
  hierarquia: {
    label: 'Hierarquia vs Autonomia',
    extremos: ['Cadeia de comando clara', 'Holocracia total'],
    descricao: 'Estrutura de decisão e níveis de aprovação',
  },
  conflito: {
    label: 'Conflito Aberto vs Harmonia',
    extremos: ['Debate vigoroso valorizado', 'Consenso priorizado'],
    descricao: 'Como divergências são tratadas',
  },
  inovacao: {
    label: 'Inovação vs Estabilidade',
    extremos: ['Disrupção constante', 'Evolução incremental'],
    descricao: 'Apetite por mudança e risco',
  },
  resultado: {
    label: 'Resultado vs Processo',
    extremos: ['O que importa é entregar', 'Como entregamos define quem somos'],
    descricao: 'Foco em outcomes vs metodologia',
  },
  transparencia: {
    label: 'Transparência Total vs Need-to-Know',
    extremos: ['Todos sabem tudo', 'Informação compartimentada'],
    descricao: 'Fluxo de informação na organização',
  },
  trabalho_vida: {
    label: 'Integração vs Separação',
    extremos: ['Trabalho é vida', 'Work-life balance rígido'],
    descricao: 'Fronteiras entre trabalho e vida pessoal',
  },
  erro: {
    label: 'Erro como Aprendizado vs Erro como Falha',
    extremos: ['Celebra experimentos', 'Zero tolerância a erros'],
    descricao: 'Como falhas são tratadas',
  },
};

/**
 * Índice de Autenticidade
 * Detecta padrões de resposta "socialmente desejáveis"
 */
export interface AuthenticityMetrics {
  tempoMedioResposta: number;
  variacaoTempo: number; // respostas muito uniformes podem indicar automação/decoreba
  respostasSocialmenteDesejaveis: number;
  consistenciaInterna: number; // respostas a cenários similares
  complexidadeResposta: number; // em texto aberto
  contradicoes: string[]; // pilares onde houve comportamento contraditório
}

/**
 * Análise Preditiva de Fit
 */
export interface PredictiveFitAnalysis {
  fitGeral: number; // 0-100
  fitPorPilar: Record<string, { empresa: number; candidato: number; gap: number }>;
  riscos: Array<{
    pilar: string;
    severidade: 'baixo' | 'medio' | 'alto';
    descricao: string;
  }>;
  potencializadores: Array<{
    pilar: string;
    descricao: string;
  }>;
  recomendacao: 'fortemente_recomendado' | 'recomendado' | 'neutro' | 'cautela' | 'nao_recomendado';
  justificativa: string;
}

export default {
  BEHAVIORAL_PILLARS,
  IMMERSIVE_SCENARIOS,
  COMPANY_CULTURE_DIMENSIONS,
};
