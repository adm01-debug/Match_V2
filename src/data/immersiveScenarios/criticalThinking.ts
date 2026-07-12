import type { ImmersiveScenario } from '@/config/behavioralPillars';

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
