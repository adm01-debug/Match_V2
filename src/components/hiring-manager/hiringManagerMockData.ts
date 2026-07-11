export interface ManagerVaga {
  id: string;
  titulo: string;
  departamento: string;
  status: string;
  totalCandidatos: number;
  emProcesso: number;
  contratados: number;
  diasAberta: number;
  urgente: boolean;
  meta: number;
}

export interface ManagerCandidato {
  id: string;
  nome: string;
  foto?: string;
  vaga: string;
  etapa: string;
  matchScore: number;
  diasNaEtapa: number;
  proximaAcao?: string;
  avaliacao?: 'positiva' | 'negativa' | 'pendente';
}

export interface ManagerEntrevista {
  id: string;
  candidato: string;
  vaga: string;
  data: Date;
  hora: string;
  tipo: string;
  status: 'agendada' | 'realizada' | 'cancelada';
}

export const mockVagas: ManagerVaga[] = [
  { id: '1', titulo: 'Desenvolvedor Full Stack Senior', departamento: 'Tecnologia', status: 'publicada', totalCandidatos: 45, emProcesso: 12, contratados: 0, diasAberta: 15, urgente: true, meta: 2 },
  { id: '2', titulo: 'Product Manager', departamento: 'Produto', status: 'publicada', totalCandidatos: 28, emProcesso: 5, contratados: 1, diasAberta: 30, urgente: false, meta: 1 },
  { id: '3', titulo: 'DevOps Engineer', departamento: 'Tecnologia', status: 'publicada', totalCandidatos: 18, emProcesso: 8, contratados: 0, diasAberta: 10, urgente: true, meta: 1 },
];

export const mockCandidatos: ManagerCandidato[] = [
  { id: '1', nome: 'Ana Carolina Silva', vaga: 'Desenvolvedor Full Stack Senior', etapa: 'Entrevista Técnica', matchScore: 92, diasNaEtapa: 3, proximaAcao: 'Agendar entrevista técnica', avaliacao: 'pendente' },
  { id: '2', nome: 'Pedro Henrique Santos', vaga: 'Desenvolvedor Full Stack Senior', etapa: 'Entrevista Gestor', matchScore: 88, diasNaEtapa: 1, avaliacao: 'positiva' },
  { id: '3', nome: 'Marina Costa', vaga: 'Product Manager', etapa: 'Entrevista Final', matchScore: 95, diasNaEtapa: 2, proximaAcao: 'Decisão final', avaliacao: 'positiva' },
  { id: '4', nome: 'Lucas Ferreira', vaga: 'DevOps Engineer', etapa: 'Teste Técnico', matchScore: 78, diasNaEtapa: 5, avaliacao: 'pendente' },
];

export const mockEntrevistas: ManagerEntrevista[] = [
  { id: '1', candidato: 'Ana Carolina Silva', vaga: 'Desenvolvedor Full Stack Senior', data: new Date(), hora: '14:00', tipo: 'Técnica', status: 'agendada' },
  { id: '2', candidato: 'Pedro Henrique Santos', vaga: 'Desenvolvedor Full Stack Senior', data: new Date(Date.now() + 86400000), hora: '10:00', tipo: 'Gestor', status: 'agendada' },
  { id: '3', candidato: 'Marina Costa', vaga: 'Product Manager', data: new Date(Date.now() + 172800000), hora: '15:30', tipo: 'Final', status: 'agendada' },
];

export const progressData = [
  { semana: 'Sem 1', candidatos: 12, entrevistas: 4, contratacoes: 0 },
  { semana: 'Sem 2', candidatos: 18, entrevistas: 6, contratacoes: 0 },
  { semana: 'Sem 3', candidatos: 25, entrevistas: 8, contratacoes: 1 },
  { semana: 'Sem 4', candidatos: 32, entrevistas: 10, contratacoes: 1 },
];
