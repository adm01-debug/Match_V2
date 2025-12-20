// Configuração de categorias e níveis para provas
// Este arquivo substitui @/data/testsData.ts com constantes puras (sem mock data)

export interface CategoriaInfo {
  id: string;
  nome: string;
  descricao: string;
  icone: string;
  cor: string;
}

export interface NivelInfo {
  id: string;
  nome: string;
  descricao: string;
}

export interface DepartamentoInfo {
  id: string;
  nome: string;
}

// Categorias de provas
export const categoriasInfo: CategoriaInfo[] = [
  {
    id: 'logica',
    nome: 'Lógica',
    descricao: 'Raciocínio lógico e resolução de problemas',
    icone: 'Brain',
    cor: 'bg-purple-500',
  },
  {
    id: 'tecnica',
    nome: 'Técnica',
    descricao: 'Conhecimentos técnicos específicos da área',
    icone: 'Code',
    cor: 'bg-blue-500',
  },
  {
    id: 'portugues',
    nome: 'Português',
    descricao: 'Gramática, interpretação e redação',
    icone: 'BookOpen',
    cor: 'bg-green-500',
  },
  {
    id: 'ingles',
    nome: 'Inglês',
    descricao: 'Compreensão e escrita em inglês',
    icone: 'Globe',
    cor: 'bg-red-500',
  },
  {
    id: 'excel',
    nome: 'Excel',
    descricao: 'Planilhas, fórmulas e análise de dados',
    icone: 'Table',
    cor: 'bg-emerald-500',
  },
  {
    id: 'comportamental',
    nome: 'Comportamental',
    descricao: 'Perfil comportamental e soft skills',
    icone: 'Users',
    cor: 'bg-amber-500',
  },
  {
    id: 'fit_cultural',
    nome: 'Fit Cultural',
    descricao: 'Alinhamento com valores e cultura',
    icone: 'Heart',
    cor: 'bg-pink-500',
  },
];

// Níveis de dificuldade
export const niveisInfo: NivelInfo[] = [
  {
    id: 'basico',
    nome: 'Básico',
    descricao: 'Conhecimentos fundamentais',
  },
  {
    id: 'intermediario',
    nome: 'Intermediário',
    descricao: 'Conhecimentos aplicados',
  },
  {
    id: 'avancado',
    nome: 'Avançado',
    descricao: 'Conhecimentos especializados',
  },
];

// Departamentos
export const departamentosInfo: DepartamentoInfo[] = [
  { id: 'ti', nome: 'Tecnologia' },
  { id: 'comercial', nome: 'Comercial' },
  { id: 'financeiro', nome: 'Financeiro' },
  { id: 'rh', nome: 'Recursos Humanos' },
  { id: 'marketing', nome: 'Marketing' },
  { id: 'operacoes', nome: 'Operações' },
  { id: 'administrativo', nome: 'Administrativo' },
  { id: 'juridico', nome: 'Jurídico' },
];

// Tipos de questão
export const tiposQuestao = [
  { id: 'multipla_escolha', nome: 'Múltipla Escolha' },
  { id: 'verdadeiro_falso', nome: 'Verdadeiro ou Falso' },
  { id: 'dissertativa', nome: 'Dissertativa' },
];

// Helpers
export function getCategoriaById(id: string): CategoriaInfo | undefined {
  return categoriasInfo.find(c => c.id === id);
}

export function getNivelById(id: string): NivelInfo | undefined {
  return niveisInfo.find(n => n.id === id);
}

export function getDepartamentoById(id: string): DepartamentoInfo | undefined {
  return departamentosInfo.find(d => d.id === id);
}

export default {
  categoriasInfo,
  niveisInfo,
  departamentosInfo,
  tiposQuestao,
};
