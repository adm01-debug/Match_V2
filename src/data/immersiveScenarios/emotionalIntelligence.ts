import type { ImmersiveScenario } from '@/config/behavioralPillars';

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
