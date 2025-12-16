import { Competencia, Avaliacao } from '@/types/recruitment';

export const competenciasTecnicas: Competencia[] = [
  {
    id: 'ct1',
    nome: 'Conhecimento Técnico',
    descricao: 'Domínio das habilidades técnicas necessárias para a função',
    tipo: 'tecnica',
  },
  {
    id: 'ct2',
    nome: 'Experiência Prática',
    descricao: 'Capacidade de aplicar conhecimentos em situações reais',
    tipo: 'tecnica',
  },
  {
    id: 'ct3',
    nome: 'Resolução de Problemas',
    descricao: 'Habilidade de identificar e solucionar problemas técnicos',
    tipo: 'tecnica',
  },
  {
    id: 'ct4',
    nome: 'Ferramentas e Tecnologias',
    descricao: 'Domínio das ferramentas e tecnologias utilizadas na área',
    tipo: 'tecnica',
  },
  {
    id: 'ct5',
    nome: 'Qualidade de Execução',
    descricao: 'Capacidade de entregar trabalho com alto padrão de qualidade',
    tipo: 'tecnica',
  },
];

export const competenciasComportamentais: Competencia[] = [
  {
    id: 'cc1',
    nome: 'Comunicação',
    descricao: 'Capacidade de se expressar com clareza e objetividade',
    tipo: 'comportamental',
  },
  {
    id: 'cc2',
    nome: 'Trabalho em Equipe',
    descricao: 'Habilidade de colaborar e interagir com colegas',
    tipo: 'comportamental',
  },
  {
    id: 'cc3',
    nome: 'Proatividade',
    descricao: 'Iniciativa para agir antecipadamente e resolver questões',
    tipo: 'comportamental',
  },
  {
    id: 'cc4',
    nome: 'Adaptabilidade',
    descricao: 'Flexibilidade para lidar com mudanças e novos desafios',
    tipo: 'comportamental',
  },
  {
    id: 'cc5',
    nome: 'Comprometimento',
    descricao: 'Dedicação e responsabilidade com o trabalho e metas',
    tipo: 'comportamental',
  },
  {
    id: 'cc6',
    nome: 'Inteligência Emocional',
    descricao: 'Controle emocional e empatia nas relações interpessoais',
    tipo: 'comportamental',
  },
];

export const avaliacoesExistentes: Avaliacao[] = [
  {
    id: 'av1',
    processoId: 'p1',
    candidatoId: 'c1',
    candidatoNome: 'Carlos Eduardo Silva',
    vagaId: '1',
    vagaTitulo: 'Operador de Gravação',
    avaliadorId: 'r1',
    avaliadorNome: 'Maria Santos',
    etapa: 'entrevista_rh',
    dataAvaliacao: new Date('2025-12-14'),
    notasTecnicas: [
      { competenciaId: 'ct1', nota: 5, observacao: 'Excelente conhecimento em gravação laser' },
      { competenciaId: 'ct2', nota: 4 },
      { competenciaId: 'ct3', nota: 4 },
      { competenciaId: 'ct4', nota: 5, observacao: 'Domina CorelDraw e CNC' },
      { competenciaId: 'ct5', nota: 4 },
    ],
    notasComportamentais: [
      { competenciaId: 'cc1', nota: 4 },
      { competenciaId: 'cc2', nota: 4 },
      { competenciaId: 'cc3', nota: 5 },
      { competenciaId: 'cc4', nota: 4 },
      { competenciaId: 'cc5', nota: 5 },
      { competenciaId: 'cc6', nota: 4 },
    ],
    notaGeral: 4.4,
    pontosFortes: 'Excelente conhecimento técnico, muito proativo e comprometido com resultados.',
    pontosDesenvolvimento: 'Pode desenvolver mais a comunicação em apresentações.',
    parecer: 'aprovar',
    observacoesGerais: 'Candidato muito qualificado, demonstrou segurança nas respostas e tem experiência relevante.',
    recomendacao: 'Recomendo fortemente a aprovação para a próxima etapa.',
  },
];

export const notasDescricao: Record<number, { label: string; descricao: string }> = {
  1: { label: 'Insuficiente', descricao: 'Não atende aos requisitos mínimos' },
  2: { label: 'Abaixo do esperado', descricao: 'Atende parcialmente, precisa de muito desenvolvimento' },
  3: { label: 'Adequado', descricao: 'Atende às expectativas básicas' },
  4: { label: 'Acima do esperado', descricao: 'Supera as expectativas na maioria dos aspectos' },
  5: { label: 'Excelente', descricao: 'Performance excepcional, referência na competência' },
};
