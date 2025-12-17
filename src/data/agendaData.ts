export interface Entrevista {
  id: string;
  candidatoId: string;
  candidatoNome: string;
  candidatoFoto?: string;
  vagaId: string;
  vagaTitulo: string;
  tipo: 'presencial' | 'online' | 'telefone';
  data: Date;
  horaInicio: string;
  horaFim: string;
  local?: string;
  linkOnline?: string;
  entrevistadores: string[];
  etapa: string;
  status: 'agendada' | 'confirmada' | 'realizada' | 'cancelada' | 'reagendada';
  observacoes?: string;
}

export const entrevistasMock: Entrevista[] = [
  {
    id: '1',
    candidatoId: 'cand-1',
    candidatoNome: 'Carlos Eduardo Silva',
    vagaId: 'vaga-1',
    vagaTitulo: 'Operador de Gravação',
    tipo: 'presencial',
    data: new Date(),
    horaInicio: '09:00',
    horaFim: '10:00',
    local: 'Sala de Reuniões 1',
    entrevistadores: ['Maria Santos (RH)', 'Carlos Supervisor'],
    etapa: 'Entrevista RH',
    status: 'confirmada',
    observacoes: 'Candidato com alta pontuação no match score'
  },
  {
    id: '2',
    candidatoId: 'cand-2',
    candidatoNome: 'Ana Paula Oliveira',
    vagaId: 'vaga-2',
    vagaTitulo: 'Designer Gráfico',
    tipo: 'online',
    data: new Date(),
    horaInicio: '10:30',
    horaFim: '11:30',
    linkOnline: 'https://meet.google.com/abc-defg-hij',
    entrevistadores: ['Maria Santos (RH)'],
    etapa: 'Entrevista RH',
    status: 'agendada'
  },
  {
    id: '3',
    candidatoId: 'cand-3',
    candidatoNome: 'Roberto Souza Ferreira',
    vagaId: 'vaga-3',
    vagaTitulo: 'Vendedor Externo',
    tipo: 'presencial',
    data: new Date(),
    horaInicio: '14:00',
    horaFim: '15:00',
    local: 'Sala da Diretoria',
    entrevistadores: ['João Diretor', 'Maria Santos (RH)'],
    etapa: 'Entrevista Final',
    status: 'confirmada'
  },
  {
    id: '4',
    candidatoId: 'cand-4',
    candidatoNome: 'Juliana Mendes',
    vagaId: 'vaga-1',
    vagaTitulo: 'Operador de Gravação',
    tipo: 'telefone',
    data: new Date(Date.now() + 86400000), // tomorrow
    horaInicio: '09:00',
    horaFim: '09:30',
    entrevistadores: ['Maria Santos (RH)'],
    etapa: 'Triagem Telefônica',
    status: 'agendada'
  },
  {
    id: '5',
    candidatoId: 'cand-5',
    candidatoNome: 'Pedro Henrique Costa',
    vagaId: 'vaga-1',
    vagaTitulo: 'Operador de Gravação',
    tipo: 'presencial',
    data: new Date(Date.now() + 86400000), // tomorrow
    horaInicio: '11:00',
    horaFim: '12:00',
    local: 'Sala de Reuniões 2',
    entrevistadores: ['Carlos Supervisor'],
    etapa: 'Entrevista Técnica',
    status: 'agendada'
  },
  {
    id: '6',
    candidatoId: 'cand-6',
    candidatoNome: 'Fernanda Lima',
    vagaId: 'vaga-2',
    vagaTitulo: 'Designer Gráfico',
    tipo: 'presencial',
    data: new Date(Date.now() + 172800000), // day after tomorrow
    horaInicio: '14:00',
    horaFim: '15:30',
    local: 'Sala de Reuniões 1',
    entrevistadores: ['Diretor de Arte', 'Maria Santos (RH)'],
    etapa: 'Entrevista Final',
    status: 'agendada'
  },
  {
    id: '7',
    candidatoId: 'cand-7',
    candidatoNome: 'Lucas Almeida',
    vagaId: 'vaga-3',
    vagaTitulo: 'Vendedor Externo',
    tipo: 'online',
    data: new Date(Date.now() - 86400000), // yesterday
    horaInicio: '10:00',
    horaFim: '11:00',
    linkOnline: 'https://meet.google.com/xyz-uvwx-rst',
    entrevistadores: ['Gerente Comercial'],
    etapa: 'Entrevista Gestor',
    status: 'realizada',
    observacoes: 'Candidato aprovado para próxima etapa'
  },
  {
    id: '8',
    candidatoId: 'cand-8',
    candidatoNome: 'Mariana Souza',
    vagaId: 'vaga-4',
    vagaTitulo: 'Analista Financeiro',
    tipo: 'presencial',
    data: new Date(Date.now() + 259200000), // 3 days from now
    horaInicio: '09:30',
    horaFim: '10:30',
    local: 'Sala de Reuniões 1',
    entrevistadores: ['CFO', 'Maria Santos (RH)'],
    etapa: 'Entrevista Final',
    status: 'agendada'
  }
];

export const vagasDisponiveis = [
  { id: 'vaga-1', titulo: 'Operador de Gravação' },
  { id: 'vaga-2', titulo: 'Designer Gráfico' },
  { id: 'vaga-3', titulo: 'Vendedor Externo' },
  { id: 'vaga-4', titulo: 'Analista Financeiro' },
];

export const candidatosDisponiveis = [
  { id: 'cand-1', nome: 'Carlos Eduardo Silva' },
  { id: 'cand-2', nome: 'Ana Paula Oliveira' },
  { id: 'cand-3', nome: 'Roberto Souza Ferreira' },
  { id: 'cand-4', nome: 'Juliana Mendes' },
  { id: 'cand-5', nome: 'Pedro Henrique Costa' },
  { id: 'cand-6', nome: 'Fernanda Lima' },
  { id: 'cand-7', nome: 'Lucas Almeida' },
  { id: 'cand-8', nome: 'Mariana Souza' },
  { id: 'cand-9', nome: 'Bruno Carvalho' },
  { id: 'cand-10', nome: 'Amanda Gomes' },
];

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
