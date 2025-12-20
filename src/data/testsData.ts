import type { CategoriaProva, Departamento, NivelCargo, Prova } from '@/types/tests';

export type CategoriaInfo = {
  nome: string;
  descricao: string;
  icone: string;
  cor: string; // tailwind class
};

export type DepartamentoInfo = {
  nome: string;
};

export type NivelInfo = {
  nome: string;
  ordem: number;
};

export const categoriasInfo: Record<CategoriaProva, CategoriaInfo> = {
  cognitivo: {
    nome: 'Cognitivo',
    descricao: 'Raciocínio lógico e resolução de problemas',
    icone: 'Brain',
    cor: 'bg-purple-500',
  },
  comportamental: {
    nome: 'Comportamental',
    descricao: 'Perfil comportamental e soft skills',
    icone: 'Heart',
    cor: 'bg-amber-500',
  },
  tecnico: {
    nome: 'Técnico',
    descricao: 'Conhecimentos técnicos específicos da área',
    icone: 'Code',
    cor: 'bg-blue-500',
  },
  idiomas: {
    nome: 'Idiomas',
    descricao: 'Compreensão e escrita em outros idiomas',
    icone: 'Globe',
    cor: 'bg-red-500',
  },
  situacional: {
    nome: 'Situacional',
    descricao: 'Cenários práticos do dia a dia',
    icone: 'Target',
    cor: 'bg-emerald-500',
  },
  competencias: {
    nome: 'Competências',
    descricao: 'Avaliação por competências e habilidades',
    icone: 'Users',
    cor: 'bg-indigo-500',
  },
};

export const departamentosInfo: Record<Departamento, DepartamentoInfo> = {
  tecnologia: { nome: 'Tecnologia' },
  financeiro: { nome: 'Financeiro' },
  rh: { nome: 'Recursos Humanos' },
  comercial: { nome: 'Comercial' },
  marketing: { nome: 'Marketing' },
  administrativo: { nome: 'Administrativo' },
  juridico: { nome: 'Jurídico' },
  operacoes: { nome: 'Operações' },
  engenharia: { nome: 'Engenharia' },
  geral: { nome: 'Geral' },
};

export const niveisInfo: Record<NivelCargo, NivelInfo> = {
  estagiario: { nome: 'Estagiário', ordem: 1 },
  junior: { nome: 'Júnior', ordem: 2 },
  pleno: { nome: 'Pleno', ordem: 3 },
  senior: { nome: 'Sênior', ordem: 4 },
  especialista: { nome: 'Especialista', ordem: 5 },
  coordenador: { nome: 'Coordenador', ordem: 6 },
  gerente: { nome: 'Gerente', ordem: 7 },
  diretor: { nome: 'Diretor', ordem: 8 },
};

// Usado por alguns cards antigos para resolver IDs -> Prova.
// Quando a UI estiver 100% conectada ao banco, isso pode ser removido.
export const todasProvas: Prova[] = [];
