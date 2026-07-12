import type { ImmersiveScenario } from '@/config/behavioralPillars';

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
