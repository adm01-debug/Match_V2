// Tipos de entrevista
export type TipoEntrevista = 'tecnica' | 'rh' | 'cultural' | 'final' | 'triagem' | 'presencial' | 'online' | 'telefone';

// Status de entrevista
export type StatusEntrevista = 'agendada' | 'confirmada' | 'realizada' | 'cancelada' | 'remarcada' | 'reagendada' | 'no_show';

// Interface de Entrevistador
export interface Entrevistador {
  id: string;
  nome: string;
  email: string;
  cargo?: string;
  departamento?: string;
  avatar_url?: string;
}

// Interface de Entrevista (compatível com componentes existentes)
export interface Entrevista {
  id: string;
  // Campos de data/hora
  data: string | Date;
  data_hora?: string;
  horaInicio: string;
  horaFim: string;
  duracao_minutos?: number;
  // Candidato
  candidato_id?: string;
  candidatoNome: string;
  candidatoEmail?: string;
  candidatoFoto?: string;
  // Vaga
  vaga_id?: string;
  vagaTitulo: string;
  // Entrevistadores
  entrevistador_id?: string;
  entrevistadores: Entrevistador[];
  // Tipo e status
  tipo: TipoEntrevista;
  status: StatusEntrevista;
  etapa?: string;
  // Local
  local?: string;
  linkOnline?: string;
  link_reuniao?: string;
  // Feedback
  notas?: string;
  feedback?: string;
  nota_geral?: number;
  // Timestamps
  created_at?: string;
  updated_at?: string;
  // Relacionamentos legados
  candidato?: {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
    foto_url?: string;
  };
  vaga?: {
    id: string;
    titulo: string;
    empresa?: string;
  };
  entrevistador?: {
    id: string;
    nome: string;
    email: string;
  };
}

// Interface de Feedback
export interface EntrevistaFeedback {
  id: string;
  entrevista_id: string;
  avaliador_id: string;
  nota_tecnica?: number;
  nota_comunicacao?: number;
  nota_cultural?: number;
  nota_geral: number;
  pontos_fortes?: string;
  pontos_melhoria?: string;
  recomendacao: 'contratar' | 'nao_contratar' | 'proxima_etapa' | 'indeciso';
  comentarios?: string;
  created_at: string;
}

// Interface de Local
export interface Local {
  id: string;
  nome: string;
  tipo: 'presencial' | 'remoto';
  endereco?: string;
  link?: string;
  capacidade?: number;
}

// Configurações de tipo de entrevista
export const tipoConfig: Record<string, { label: string; color: string; bgColor: string; icon?: string }> = {
  tecnica: { label: 'Técnica', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: 'Code' },
  rh: { label: 'RH', color: 'text-green-700', bgColor: 'bg-green-100', icon: 'Users' },
  cultural: { label: 'Cultural', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: 'Heart' },
  final: { label: 'Final', color: 'text-orange-700', bgColor: 'bg-orange-100', icon: 'Award' },
  triagem: { label: 'Triagem', color: 'text-gray-700', bgColor: 'bg-gray-100', icon: 'Filter' },
  presencial: { label: 'Presencial', color: 'text-blue-600', bgColor: 'bg-blue-500/10', icon: 'MapPin' },
  online: { label: 'Online', color: 'text-purple-600', bgColor: 'bg-purple-500/10', icon: 'Video' },
  telefone: { label: 'Telefone', color: 'text-green-600', bgColor: 'bg-green-500/10', icon: 'Phone' },
};

// Configurações de status
export const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  agendada: { label: 'Agendada', color: 'text-blue-700', bgColor: 'bg-blue-100' },
  confirmada: { label: 'Confirmada', color: 'text-green-700', bgColor: 'bg-green-100' },
  realizada: { label: 'Realizada', color: 'text-gray-700', bgColor: 'bg-gray-100' },
  cancelada: { label: 'Cancelada', color: 'text-red-700', bgColor: 'bg-red-100' },
  remarcada: { label: 'Remarcada', color: 'text-yellow-700', bgColor: 'bg-yellow-100' },
  reagendada: { label: 'Reagendada', color: 'text-orange-700', bgColor: 'bg-orange-100' },
  no_show: { label: 'No Show', color: 'text-red-700', bgColor: 'bg-red-100' },
};

// Alias para compatibilidade
export const statusStyles = statusConfig;

// Entrevistadores disponíveis (mock)
export const entrevistadoresDisponiveis: Entrevistador[] = [
  { id: '1', nome: 'Ana Silva', email: 'ana@empresa.com', cargo: 'Tech Lead', departamento: 'Engenharia' },
  { id: '2', nome: 'Carlos Santos', email: 'carlos@empresa.com', cargo: 'RH Manager', departamento: 'RH' },
  { id: '3', nome: 'Maria Oliveira', email: 'maria@empresa.com', cargo: 'Senior Dev', departamento: 'Engenharia' },
  { id: '4', nome: 'João Pereira', email: 'joao@empresa.com', cargo: 'CTO', departamento: 'Diretoria' },
];

// Locais disponíveis (mock)
export const locaisDisponiveis: Local[] = [
  { id: '1', nome: 'Sala de Reunião A', tipo: 'presencial', endereco: 'Escritório Principal - 3º andar', capacidade: 6 },
  { id: '2', nome: 'Sala de Reunião B', tipo: 'presencial', endereco: 'Escritório Principal - 2º andar', capacidade: 4 },
  { id: '3', nome: 'Google Meet', tipo: 'remoto', link: 'https://meet.google.com' },
  { id: '4', nome: 'Zoom', tipo: 'remoto', link: 'https://zoom.us' },
  { id: '5', nome: 'Microsoft Teams', tipo: 'remoto', link: 'https://teams.microsoft.com' },
];

// Dados mock para desenvolvimento
export const mockEntrevistas: Entrevista[] = [
  {
    id: '1',
    data: new Date().toISOString(),
    horaInicio: '09:00',
    horaFim: '10:00',
    candidatoNome: 'João Silva',
    vagaTitulo: 'Desenvolvedor Full Stack',
    tipo: 'tecnica',
    status: 'agendada',
    etapa: 'Entrevista Técnica',
    entrevistadores: [entrevistadoresDisponiveis[0]!],
    linkOnline: 'https://meet.google.com/abc-defg-hij',
  },
  {
    id: '2',
    data: new Date(Date.now() + 86400000).toISOString(),
    horaInicio: '14:00',
    horaFim: '14:45',
    candidatoNome: 'Maria Santos',
    vagaTitulo: 'Desenvolvedor Full Stack',
    tipo: 'rh',
    status: 'confirmada',
    etapa: 'Entrevista RH',
    entrevistadores: [entrevistadoresDisponiveis[1]!],
    local: 'Sala de Reunião A',
  },
];

// Helper functions
export function getStatusStyle(status: string) {
  return statusConfig[status] ?? statusConfig['agendada'];
}

export function getTipoStyle(tipo: string) {
  return tipoConfig[tipo] ?? tipoConfig['triagem'];
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
}

export function parseTimeString(timeStr: string): { hours: number; minutes: number } | null {
  const match = timeStr.match(/^(\d{1,2}):(\d{2})$/);
  if (!match || !match[1] || !match[2]) return null;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return { hours, minutes };
}

export default {
  tipoConfig,
  statusConfig,
  statusStyles,
  entrevistadoresDisponiveis,
  locaisDisponiveis,
  mockEntrevistas,
  getStatusStyle,
  getTipoStyle,
  formatDuration,
  parseTimeString,
};
