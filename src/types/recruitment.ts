/**
 * @fileoverview Recruitment process type definitions
 * @module types
 */

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
  readonly pergunta: string;
  readonly  tipo: 'sim_nao' | 'texto' | 'numero' | 'opcoes';
  readonly  opcoes?: string[];
  readonly  eliminatoria: boolean;
  readonly  respostaEsperada?: string;
}

export interface Skill {
  readonly nome: string;
  readonly  nivel: 1 | 2 | 3 | 4 | 5;
}

export interface Vaga {
  readonly id: string;
  readonly  titulo: string;
  readonly  departamento: string;
  readonly  gestorId: string;
  readonly  gestorNome: string;
  readonly  recrutadorId: string;
  readonly  recrutadorNome: string;
  readonly  quantidade: number;
  readonly  tipoContrato: TipoContrato;
  readonly  modalidade: Modalidade;
  readonly  cidade: string;
  readonly  estado: string;
  readonly  salarioMin?: number;
  readonly  salarioMax?: number;
  readonly  salarioACombinar: boolean;
  readonly  beneficios: string[];
  readonly  descricaoEmpresa: string;
  readonly  responsabilidades: string;
  readonly  requisitosObrigatorios: string;
  readonly  requisitosDesejaveis: string;
  readonly  perguntasTriagem: PerguntaTriagem[];
  readonly  skillsAvaliacao: string[];
  readonly  status: StatusVaga;
  readonly  prioridade: Prioridade;
  readonly  dataCriacao: Date;
  readonly  dataPublicacao?: Date;
  readonly  dataEncerramento?: Date;
  readonly  totalCandidatos: number;
  readonly  emProcesso: number;
  readonly  contratados: number;
}

export interface Candidato {
  readonly id: string;
  readonly  nome: string;
  readonly  email: string;
  readonly  telefone: string;
  readonly  linkedin?: string;
  readonly  cidade: string;
  readonly  estado: string;
  readonly  foto?: string;
  readonly  cargoAtual?: string;
  readonly  empresaAtual?: string;
  readonly  experienciaAnos: number;
  readonly  pretensaoSalarial?: number;
  readonly  disponibilidade: 'imediata' | '15_dias' | '30_dias' | '60_dias' | 'negociar';
  readonly  escolaridade: string;
  readonly  skills: Skill[];
  readonly  curriculoUrl?: string;
  readonly  origem: FonteCandidato;
  readonly  indicadoPor?: string;
  readonly  status: StatusCandidato;
  readonly  dataCadastro: Date;
  readonly  ultimaAtualizacao: Date;
}

export interface ProcessoSeletivo {
  readonly id: string;
  readonly  vagaId: string;
  readonly  vagaTitulo: string;
  readonly  candidatoId: string;
  readonly  candidatoNome: string;
  readonly  candidatoFoto?: string;
  readonly  etapaAtual: EtapaProcesso;
  readonly  status: StatusProcesso;
  readonly  matchScore: number;
  readonly  origem: FonteCandidato;
  readonly  dataInscricao: Date;
  readonly  dataUltimaMovimentacao: Date;
  readonly  diasNaEtapa: number;
}

export interface Entrevista {
  readonly id: string;
  readonly  processoId: string;
  readonly  candidatoNome: string;
  readonly  vagaTitulo: string;
  readonly  tipo: TipoEntrevista;
  readonly  etapa: EtapaProcesso;
  readonly  dataHora: Date;
  readonly  duracao: number;
  readonly  local?: string;
  readonly  linkVideo?: string;
  readonly  entrevistadores: string[];
  readonly  status: StatusEntrevista;
}

export interface KPIData {
  readonly vagasAbertas: number;
  readonly  vagasNovas: number;
  readonly  candidatosTotal: number;
  readonly  candidatosNovos: number;
  readonly  emProcesso: number;
  readonly  vagasEmProcesso: number;
  readonly  contratadosMes: number;
  readonly  metaContratacao: number;
  readonly  tempoMedio: number;
  readonly  metaTempo: number;
}

export interface FunilEtapa {
  readonly etapa: string;
  readonly  quantidade: number;
  readonly  percentual: number;
  readonly  cor: string;
}

export interface VagaUrgente {
  readonly id: string;
  readonly  titulo: string;
  readonly  candidatos: number;
  readonly  emProcesso: number;
  readonly  diasAberta: number;
  readonly  quantidade: number;
  readonly  prioridade: Prioridade;
}

export interface AcaoPendente {
  readonly tipo: 'feedback' | 'agendar' | 'avaliar' | 'proposta';
  readonly  quantidade: number;
  readonly  descricao: string;
  readonly  alerta: boolean;
}

export interface AgendaDia {
  readonly id: string;
  readonly  hora: string;
  readonly  tipo: 'entrevista' | 'teste' | 'reuniao';
  readonly  titulo: string;
  readonly  candidato: string;
  readonly  local?: string;
}

// Avaliação Types
export type TipoCompetencia = 'tecnica' | 'comportamental';

export interface Competencia {
  readonly id: string;
  readonly  nome: string;
  readonly  descricao: string;
  readonly  tipo: TipoCompetencia;
}

export interface NotaCompetencia {
  readonly competenciaId: string;
  readonly  nota: 1 | 2 | 3 | 4 | 5;
  readonly  observacao?: string;
}

export interface Avaliacao {
  readonly id: string;
  readonly  processoId: string;
  readonly  candidatoId: string;
  readonly  candidatoNome: string;
  readonly  vagaId: string;
  readonly  vagaTitulo: string;
  readonly  avaliadorId: string;
  readonly  avaliadorNome: string;
  readonly  etapa: EtapaProcesso;
  readonly  dataAvaliacao: Date;
  readonly  notasTecnicas: NotaCompetencia[];
  readonly  notasComportamentais: NotaCompetencia[];
  readonly  notaGeral: number;
  readonly  pontosFortes: string;
  readonly  pontosDesenvolvimento: string;
  readonly  parecer: 'aprovar' | 'reprovar' | 'em_duvida';
  readonly  observacoesGerais: string;
  readonly  recomendacao: string;
}


// Tipos adicionais

export interface Prova {
  readonly id: string;
  readonly  titulo: string;
  readonly  descricao: string | null;
  readonly  categoria: 'logica' | 'tecnica' | 'portugues' | 'ingles' | 'excel' | 'comportamental' | 'fit_cultural';
  readonly  nivel: 'junior' | 'pleno' | 'senior';
  readonly  tempo_limite_minutos: number;
  readonly  nota_minima: number;
  readonly  ativo: boolean;
  readonly  departamento: string | null;
  readonly  created_at: string;
}

export interface Comunicacao {
  readonly id: string;
  readonly  processo_seletivo_id: string | null;
  readonly  candidato_id: string;
  readonly  tipo: 'email' | 'whatsapp' | 'sms' | 'ligacao' | 'nota';
  readonly  assunto: string | null;
  readonly  conteudo: string;
  readonly  remetente_id: string | null;
  readonly  status: 'enviado' | 'entregue' | 'lido' | 'respondido' | 'erro';
  readonly  data_envio: string | null;
  readonly  created_at: string;
}

export interface Indicacao {
  readonly id: string;
  readonly  indicador_nome: string;
  readonly  indicador_email: string;
  readonly  candidato_nome: string;
  readonly  candidato_email: string;
  readonly  vaga_id: string | null;
  readonly  status: 'pendente' | 'aprovada' | 'rejeitada' | 'contratado';
  readonly  created_at: string;
}
