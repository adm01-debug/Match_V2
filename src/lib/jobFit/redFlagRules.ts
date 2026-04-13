/**
 * @fileoverview Red Flag rules data
 */

import type { RedFlagRule } from '@/types/jobFit';

export const RED_FLAG_RULES: RedFlagRule[] = [
  {
    id: 'rf_baixa_resiliencia_alta_pressao',
    nome: 'Baixa Resiliência em Cargo de Pressão',
    descricao: 'Candidato com baixa resiliência aplicando para vaga de alta pressão',
    categoria: 'resiliencia',
    severidade: 'critico',
    condicao: { tipo: 'combinacao_risco', parametros: { resilienciaMax: 40, vagaAltaPressao: true } },
    mensagem: 'Resiliência abaixo de 40% pode ser insuficiente para cargos de alta pressão',
    recomendacao: 'Avaliar histórico de situações de stress e estratégias de coping em entrevista',
    perguntasEntrevista: [
      'Conte sobre uma situação de extrema pressão e como você lidou',
      'O que você faz quando está sobrecarregado?',
      'Como você recarrega suas energias após períodos intensos?'
    ]
  },
  {
    id: 'rf_d_muito_alto_trabalho_equipe',
    nome: 'Dominância Alta em Cargo Colaborativo',
    descricao: 'Perfil D muito alto para vaga que exige trabalho em equipe',
    categoria: 'comportamental',
    severidade: 'medio',
    condicao: { tipo: 'disc_baixo', parametros: { perfil: 'D', limiar: 80, contexto: 'colaborativo' } },
    mensagem: 'Perfil D acima de 80% pode gerar conflitos em ambientes altamente colaborativos',
    recomendacao: 'Verificar capacidade de ceder controle e ouvir opiniões diversas',
    perguntasEntrevista: [
      'Como você lida quando sua opinião é minoria no grupo?',
      'Descreva uma situação em que você mudou de ideia baseado em feedback da equipe',
      'Como você equilibra assertividade com colaboração?'
    ]
  },
  {
    id: 'rf_s_alto_ambiente_dinamico',
    nome: 'Estabilidade Alta em Ambiente Dinâmico',
    descricao: 'Perfil S muito alto para vaga com mudanças frequentes',
    categoria: 'comportamental',
    severidade: 'medio',
    condicao: { tipo: 'disc_baixo', parametros: { perfil: 'S', limiar: 80, contexto: 'dinamico' } },
    mensagem: 'Perfil S acima de 80% pode ter dificuldade com mudanças frequentes',
    recomendacao: 'Avaliar adaptabilidade e tolerância a ambiguidade',
    perguntasEntrevista: [
      'Como você reage quando prioridades mudam de repente?',
      'Conte sobre uma mudança significativa que você enfrentou no trabalho',
      'O que te deixa desconfortável em ambientes de trabalho?'
    ]
  },
  {
    id: 'rf_c_muito_alto_cargo_agil',
    nome: 'Conformidade Alta em Cargo Ágil',
    descricao: 'Perfil C muito alto para vaga que exige velocidade',
    categoria: 'comportamental',
    severidade: 'baixo',
    condicao: { tipo: 'disc_baixo', parametros: { perfil: 'C', limiar: 85, contexto: 'agil' } },
    mensagem: 'Perfil C acima de 85% pode gerar lentidão em decisões rápidas',
    recomendacao: 'Verificar capacidade de tomar decisões com informações incompletas',
    perguntasEntrevista: [
      'Como você decide quando não tem todas as informações?',
      'Você prefere entregar algo 80% perfeito rápido ou 100% perfeito devagar?'
    ]
  },
  {
    id: 'rf_fight_lideranca_servidora',
    nome: 'Resposta Fight em Liderança Servidora',
    descricao: 'Resposta agressiva ao stress em cargo de liderança servidora',
    categoria: 'stress',
    severidade: 'alto',
    condicao: { tipo: 'stress_alto', parametros: { response: 'fight', intensidade: 70 } },
    mensagem: 'Resposta "fight" intensa pode afetar relacionamento com equipe',
    recomendacao: 'Avaliar inteligência emocional e gestão de conflitos',
    perguntasEntrevista: [
      'Como você gerencia sua frustração quando liderados não performam?',
      'Descreva seu estilo de dar feedback negativo'
    ]
  },
  {
    id: 'rf_freeze_cargo_decisao',
    nome: 'Resposta Freeze em Cargo de Decisão',
    descricao: 'Tendência a paralisar sob stress em cargo que exige decisões rápidas',
    categoria: 'stress',
    severidade: 'alto',
    condicao: { tipo: 'stress_alto', parametros: { response: 'freeze', intensidade: 60 } },
    mensagem: 'Resposta "freeze" pode comprometer tomada de decisão sob pressão',
    recomendacao: 'Avaliar estratégias de decisão em cenários de crise',
    perguntasEntrevista: [
      'Como você decide quando está sob muita pressão?',
      'Conte sobre uma crise que você precisou resolver rapidamente'
    ]
  },
  {
    id: 'rf_reptiliano_dominante_estrategico',
    nome: 'Cérebro Reptiliano Dominante em Cargo Estratégico',
    descricao: 'Foco excessivo em sobrevivência/reatividade para cargo estratégico',
    categoria: 'comportamental',
    severidade: 'medio',
    condicao: { tipo: 'combinacao_risco', parametros: { cerebroDominante: 'reptiliano', cargoTipo: 'estrategico' } },
    mensagem: 'Cérebro reptiliano dominante pode dificultar pensamento estratégico de longo prazo',
    recomendacao: 'Avaliar capacidade de planejamento e visão de futuro',
    perguntasEntrevista: [
      'Como você equilibra urgências do dia-a-dia com planejamento de longo prazo?',
      'Descreva sua abordagem para definir estratégia'
    ]
  },
  {
    id: 'rf_inconsistencia_resultados',
    nome: 'Inconsistência nos Resultados',
    descricao: 'Resultados contraditórios entre diferentes ferramentas',
    categoria: 'consistencia',
    severidade: 'baixo',
    condicao: { tipo: 'inconsistencia', parametros: { limiarVariancia: 30 } },
    mensagem: 'Resultados apresentam variação significativa entre ferramentas',
    recomendacao: 'Pode indicar autoconhecimento em desenvolvimento ou tentativa de manipular respostas',
    perguntasEntrevista: [
      'Como você se descreveria em 3 palavras?',
      'O que seus colegas diriam sobre você?'
    ]
  }
];
