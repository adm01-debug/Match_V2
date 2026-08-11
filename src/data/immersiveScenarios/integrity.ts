import type { ImmersiveScenario } from '@/config/behavioralPillars';

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
