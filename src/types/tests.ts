/**
 * @fileoverview Assessment and test type definitions
 * @module types
 */

export type NivelCargo = 'estagiario' | 'junior' | 'pleno' | 'senior' | 'especialista' | 'coordenador' | 'gerente' | 'diretor';

export type CategoriaProva = 
  | 'cognitivo' 
  | 'comportamental' 
  | 'tecnico' 
  | 'idiomas' 
  | 'situacional' 
  | 'competencias';

export type Departamento = 
  | 'tecnologia' 
  | 'financeiro' 
  | 'rh' 
  | 'comercial' 
  | 'marketing' 
  | 'administrativo' 
  | 'juridico' 
  | 'operacoes' 
  | 'engenharia'
  | 'geral';

export interface Questao {
  readonly id: string;
  readonly  enunciado: string;
  readonly  tipo: 'multipla_escolha' | 'dissertativa' | 'verdadeiro_falso' | 'pratica';
  readonly  alternativas?: string[];
  readonly  respostaCorreta?: string | number;
  readonly  pontuacao: number;
  readonly  dificuldade: 'facil' | 'medio' | 'dificil';
}

export interface Prova {
  readonly id: string;
  readonly  titulo: string;
  readonly  descricao: string;
  readonly  categoria: CategoriaProva;
  readonly  departamentos: Departamento[];
  readonly  niveisAplicaveis: NivelCargo[];
  readonly  duracao: number; // em minutos
  readonly  totalQuestoes: number;
  readonly  pontuacaoMaxima: number;
  readonly  notaMinima: number;
  readonly  questoes: Questao[];
  readonly  ativo: boolean;
  readonly  criadoEm: string;
  readonly  atualizadoEm: string;
  readonly  aplicacoes: number;
  readonly  mediaNotas: number;
  readonly  tags: string[];
}

export interface BateriaProvas {
  readonly id: string;
  readonly  nome: string;
  readonly  descricao: string;
  readonly  departamento: Departamento;
  readonly  nivel: NivelCargo;
  readonly  provas: string[]; // IDs das provas
  readonly  duracaoTotal: number;
  readonly  obrigatorias: string[];
  readonly  opcionais: string[];
}

export interface ResultadoProva {
  readonly id: string;
  readonly  provaId: string;
  readonly  candidatoId: string;
  readonly  nota: number;
  readonly  percentual: number;
  readonly  tempoGasto: number;
  readonly  respostas: {
    questaoId: string;
    resposta: string | number;
    correta: boolean;
    pontos: number;
  }[];
  readonly  iniciadoEm: string;
  readonly  finalizadoEm: string;
  readonly  status: 'aprovado' | 'reprovado' | 'em_analise';
}
