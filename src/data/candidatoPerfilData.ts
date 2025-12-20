import type React from 'react';

export type TipoArquivo = 'curriculo' | 'certificado' | 'carta' | 'portfolio' | 'outro';

export interface ArquivoAnexo {
  id: string;
  nome: string;
  tipo: TipoArquivo;
  tamanho: string;
  dataUpload: string;
  url?: string;
}

export interface SkillPerfil {
  nome: string;
  nivel: number; // 1-5
}

export interface ExperienciaPerfil {
  id: string;
  cargo: string;
  empresa: string;
  dataInicio: string;
  dataFim?: string;
  atual: boolean;
  descricao: string[];
}

export interface FormacaoPerfil {
  id: string;
  curso: string;
  instituicao: string;
  nivel: 'medio' | 'tecnico' | 'graduacao' | 'pos_graduacao' | 'mestrado' | 'doutorado' | string;
  status: 'concluido' | 'cursando' | 'trancado' | string;
  anoConclusao: string;
}

export interface CertificacaoPerfil {
  id: string;
  nome: string;
  instituicao: string;
  dataEmissao: string;
  dataValidade?: string;
}

export interface HistoricoEvento {
  id: string;
  data: string; // dd/mm/yyyy
  hora: string; // hh:mm
  tipo: string;
  tipoIcon: React.ReactNode;
  descricao: string;
  detalhes?: string;
  usuario?: string;
}

export interface AvaliacaoNota {
  criterio: string;
  nota: number;
}

export interface AvaliacaoResumo {
  id: string;
  tipo: string;
  tipoLabel: string;
  data: string;
  avaliador: string;
  notaGeral: number;
  recomendacao: 'aprovar' | 'reprovar' | 'em_duvida' | string;
  notas: AvaliacaoNota[];
  observacoes: string;
}

export interface CandidatoPerfil {
  id: string;
  nome: string;
  foto?: string;
  email: string;
  telefone: string;
  linkedin?: string;
  cidade: string;
  estado: string;

  cargoAtual: string;
  empresaAtual?: string;

  matchScore: number;
  disponibilidadeLabel: string;
  pretensaoSalarial: number;

  vagaAtual?: string;
  etapaAtualLabel: string;
  dataCadastro: string;

  resumoProfissional: string;

  skills: SkillPerfil[];
  experiencias: ExperienciaPerfil[];
  formacao: FormacaoPerfil[];
  certificacoes: CertificacaoPerfil[];
  arquivos: ArquivoAnexo[];
  historico: HistoricoEvento[];
  avaliacoes: AvaliacaoResumo[];
}
