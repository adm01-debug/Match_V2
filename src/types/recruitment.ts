// Types for the Recruitment System

export type StatusVaga = 
  | 'rascunho'
  | 'aguardando_aprovacao'
  | 'aprovada'
  | 'publicada'
  | 'em_selecao'
  | 'pausada'
  | 'encerrada'
  | 'cancelada';

export type Prioridade = 'urgente' | 'alta' | 'media' | 'baixa';

export type TipoContrato = 'clt' | 'pj' | 'estagio' | 'temporario';

export type Modalidade = 'presencial' | 'hibrido' | 'remoto';

export type FonteCandidato = 
  | 'portal'
  | 'linkedin'
  | 'indeed'
  | 'catho'
  | 'infojobs'
  | 'indicacao'
  | 'espontaneo'
  | 'outros';

export type StatusCandidato = 'ativo' | 'em_processo' | 'contratado' | 'desistente' | 'blacklist';

export type EtapaProcesso = 
  | 'novo'
  | 'em_triagem'
  | 'pre_selecao'
  | 'entrevista_rh'
  | 'teste_tecnico'
  | 'entrevista_gestor'
  | 'entrevista_final'
  | 'aprovado'
  | 'proposta_enviada'
  | 'contratado'
  | 'reprovado'
  | 'banco_talentos';

export type StatusProcesso = 'em_andamento' | 'aprovado' | 'reprovado' | 'desistente' | 'contratado';

export type TipoEntrevista = 'telefone' | 'video' | 'presencial';

export type StatusEntrevista = 'agendada' | 'confirmada' | 'realizada' | 'cancelada' | 'no_show';

export interface PerguntaTriagem {
  pergunta: string;
  tipo: 'sim_nao' | 'texto' | 'numero' | 'opcoes';
  opcoes?: string[];
  eliminatoria: boolean;
  respostaEsperada?: string;
}

export interface Skill {
  nome: string;
  nivel: 1 | 2 | 3 | 4 | 5;
}

export interface Vaga {
  id: string;
  titulo: string;
  departamento: string;
  gestorId: string;
  gestorNome: string;
  recrutadorId: string;
  recrutadorNome: string;
  quantidade: number;
  tipoContrato: TipoContrato;
  modalidade: Modalidade;
  cidade: string;
  estado: string;
  salarioMin?: number;
  salarioMax?: number;
  salarioACombinar: boolean;
  beneficios: string[];
  descricaoEmpresa: string;
  responsabilidades: string;
  requisitosObrigatorios: string;
  requisitosDesejaveis: string;
  perguntasTriagem: PerguntaTriagem[];
  skillsAvaliacao: string[];
  status: StatusVaga;
  prioridade: Prioridade;
  dataCriacao: Date;
  dataPublicacao?: Date;
  dataEncerramento?: Date;
  totalCandidatos: number;
  emProcesso: number;
  contratados: number;
}

export interface Candidato {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  linkedin?: string;
  cidade: string;
  estado: string;
  foto?: string;
  cargoAtual?: string;
  empresaAtual?: string;
  experienciaAnos: number;
  pretensaoSalarial?: number;
  disponibilidade: 'imediata' | '15_dias' | '30_dias' | '60_dias' | 'negociar';
  escolaridade: string;
  skills: Skill[];
  curriculoUrl?: string;
  origem: FonteCandidato;
  indicadoPor?: string;
  status: StatusCandidato;
  dataCadastro: Date;
  ultimaAtualizacao: Date;
}

export interface ProcessoSeletivo {
  id: string;
  vagaId: string;
  vagaTitulo: string;
  candidatoId: string;
  candidatoNome: string;
  candidatoFoto?: string;
  etapaAtual: EtapaProcesso;
  status: StatusProcesso;
  matchScore: number;
  origem: FonteCandidato;
  dataInscricao: Date;
  dataUltimaMovimentacao: Date;
  diasNaEtapa: number;
}

export interface Entrevista {
  id: string;
  processoId: string;
  candidatoNome: string;
  vagaTitulo: string;
  tipo: TipoEntrevista;
  etapa: EtapaProcesso;
  dataHora: Date;
  duracao: number;
  local?: string;
  linkVideo?: string;
  entrevistadores: string[];
  status: StatusEntrevista;
}

export interface KPIData {
  vagasAbertas: number;
  vagasNovas: number;
  candidatosTotal: number;
  candidatosNovos: number;
  emProcesso: number;
  vagasEmProcesso: number;
  contratadosMes: number;
  metaContratacao: number;
  tempoMedio: number;
  metaTempo: number;
}

export interface FunilEtapa {
  etapa: string;
  quantidade: number;
  percentual: number;
  cor: string;
}

export interface VagaUrgente {
  id: string;
  titulo: string;
  candidatos: number;
  emProcesso: number;
  diasAberta: number;
  quantidade: number;
  prioridade: Prioridade;
}

export interface AcaoPendente {
  tipo: 'feedback' | 'agendar' | 'avaliar' | 'proposta';
  quantidade: number;
  descricao: string;
  alerta: boolean;
}

export interface AgendaDia {
  id: string;
  hora: string;
  tipo: 'entrevista' | 'teste' | 'reuniao';
  titulo: string;
  candidato: string;
  local?: string;
}
