import type { ImmersiveScenario } from '@/config/behavioralPillars';

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
