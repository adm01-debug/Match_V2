export type EntrevistaTipo = 'presencial' | 'online' | 'telefone';

export type EntrevistaStatus =
  | 'agendada'
  | 'confirmada'
  | 'realizada'
  | 'cancelada'
  | 'reagendada'
  | 'no_show';

export interface EntrevistaFeedback {
  resultado: 'aprovado' | 'reprovado' | 'pendente';
  notaGeral: number;
  pontosFortes: string[];
  pontosAMelhorar: string[];
  comentarios: string;
  recomendacao: string;
  avaliadoPor: string;
  avaliadoEm: string;
}

export interface Entrevista {
  id: string;
  candidatoId?: string;
  candidatoNome: string;
  vagaId: string;
  vagaTitulo: string;
  tipo: EntrevistaTipo;
  data: Date;
  horaInicio: string;
  horaFim: string;
  local?: string;
  linkOnline?: string;
  entrevistadores: string[];
  etapa: string;
  status: EntrevistaStatus;
  observacoes?: string;
  feedback?: EntrevistaFeedback;
}

export const entrevistadoresDisponiveis = [
  'Maria Santos (RH)',
  'Carlos Supervisor',
  'João Diretor',
  'Gerente Comercial',
  'Diretor de Arte',
  'CFO',
  'CTO',
];

export const locaisDisponiveis = [
  'Sala de Reuniões 1',
  'Sala de Reuniões 2',
  'Sala da Diretoria',
  'Auditório',
];
