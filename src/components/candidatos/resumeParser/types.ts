export interface ParsedResume {
  nome: string;
  email: string;
  telefone: string;
  experiencias: {
    empresa: string;
    cargo: string;
    periodo: string;
    descricao: string;
  }[];
  habilidades: string[];
  formacao: {
    instituicao: string;
    curso: string;
    periodo: string;
  }[];
  resumo: string;
}
