/**
 * @fileoverview Perfis de Cultura Organizacional.
 * Para matching bidirecional empresa-candidato.
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
