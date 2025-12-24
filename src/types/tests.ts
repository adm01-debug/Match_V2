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
  id: string;
  enunciado: string;
  tipo: 'multipla_escolha' | 'dissertativa' | 'verdadeiro_falso' | 'pratica';
  alternativas?: string[];
  respostaCorreta?: string | number;
  pontuacao: number;
  dificuldade: 'facil' | 'medio' | 'dificil';
}

export interface Prova {
  id: string;
  titulo: string;
  descricao: string;
  categoria: CategoriaProva;
  departamentos: Departamento[];
  niveisAplicaveis: NivelCargo[];
  duracao: number; // em minutos
  totalQuestoes: number;
  pontuacaoMaxima: number;
  notaMinima: number;
  questoes: Questao[];
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
  aplicacoes: number;
  mediaNotas: number;
  tags: string[];
}

export interface BateriaProvas {
  id: string;
  nome: string;
  descricao: string;
  departamento: Departamento;
  nivel: NivelCargo;
  provas: string[]; // IDs das provas
  duracaoTotal: number;
  obrigatorias: string[];
  opcionais: string[];
}

export interface ResultadoProva {
  id: string;
  provaId: string;
  candidatoId: string;
  nota: number;
  percentual: number;
  tempoGasto: number;
  respostas: {
    questaoId: string;
    resposta: string | number;
    correta: boolean;
    pontos: number;
  }[];
  iniciadoEm: string;
  finalizadoEm: string;
  status: 'aprovado' | 'reprovado' | 'em_analise';
}
