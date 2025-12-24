/**
 * @fileoverview Constantes da aplicação
 * @module constants
 */

// Constantes do sistema Match ATS

export const APP_NAME = 'Match ATS';
export const APP_VERSION = '1.0.0';

// Etapas do processo seletivo
export const ETAPAS_PROCESSO = [
  { id: 'novo', nome: 'Novo', cor: 'gray', ordem: 1 },
  { id: 'em_triagem', nome: 'Em Triagem', cor: 'blue', ordem: 2 },
  { id: 'pre_selecao', nome: 'Pré-seleção', cor: 'indigo', ordem: 3 },
  { id: 'entrevista_rh', nome: 'Entrevista RH', cor: 'purple', ordem: 4 },
  { id: 'teste_tecnico', nome: 'Teste Técnico', cor: 'orange', ordem: 5 },
  { id: 'entrevista_gestor', nome: 'Entrevista Gestor', cor: 'cyan', ordem: 6 },
  { id: 'entrevista_final', nome: 'Entrevista Final', cor: 'teal', ordem: 7 },
  { id: 'aprovado', nome: 'Aprovado', cor: 'green', ordem: 8 },
  { id: 'proposta_enviada', nome: 'Proposta Enviada', cor: 'emerald', ordem: 9 },
  { id: 'contratado', nome: 'Contratado', cor: 'green', ordem: 10 },
  { id: 'reprovado', nome: 'Reprovado', cor: 'red', ordem: 11 },
  { id: 'banco_talentos', nome: 'Banco de Talentos', cor: 'amber', ordem: 12 },
] as const;

// Status de vaga
export const STATUS_VAGA = [
  { id: 'rascunho', nome: 'Rascunho', cor: 'gray' },
  { id: 'publicada', nome: 'Publicada', cor: 'green' },
  { id: 'pausada', nome: 'Pausada', cor: 'yellow' },
  { id: 'fechada', nome: 'Fechada', cor: 'blue' },
  { id: 'cancelada', nome: 'Cancelada', cor: 'red' },
] as const;

// Prioridades
export const PRIORIDADES = [
  { id: 'baixa', nome: 'Baixa', cor: 'gray' },
  { id: 'media', nome: 'Média', cor: 'yellow' },
  { id: 'alta', nome: 'Alta', cor: 'orange' },
  { id: 'urgente', nome: 'Urgente', cor: 'red' },
] as const;

// Tipos de contrato
export const TIPOS_CONTRATO = [
  { id: 'clt', nome: 'CLT' },
  { id: 'pj', nome: 'PJ' },
  { id: 'estagio', nome: 'Estágio' },
  { id: 'temporario', nome: 'Temporário' },
  { id: 'freelancer', nome: 'Freelancer' },
] as const;

// Modalidades de trabalho
export const MODALIDADES_TRABALHO = [
  { id: 'presencial', nome: 'Presencial' },
  { id: 'remoto', nome: 'Remoto' },
  { id: 'hibrido', nome: 'Híbrido' },
] as const;

// Níveis de experiência
export const NIVEIS_EXPERIENCIA = [
  { id: 'estagiario', nome: 'Estagiário', anosMin: 0, anosMax: 0 },
  { id: 'junior', nome: 'Júnior', anosMin: 0, anosMax: 2 },
  { id: 'pleno', nome: 'Pleno', anosMin: 2, anosMax: 5 },
  { id: 'senior', nome: 'Sênior', anosMin: 5, anosMax: 10 },
  { id: 'especialista', nome: 'Especialista', anosMin: 10, anosMax: 99 },
] as const;

// Fontes de candidatos
export const FONTES_CANDIDATOS = [
  { id: 'linkedin', nome: 'LinkedIn' },
  { id: 'indeed', nome: 'Indeed' },
  { id: 'site', nome: 'Site Próprio' },
  { id: 'indicacao', nome: 'Indicação' },
  { id: 'banco_talentos', nome: 'Banco de Talentos' },
  { id: 'universidade', nome: 'Universidade' },
  { id: 'evento', nome: 'Evento' },
  { id: 'outro', nome: 'Outro' },
] as const;

// Tipos de entrevista
export const TIPOS_ENTREVISTA = [
  { id: 'telefone', nome: 'Telefone', icone: 'Phone' },
  { id: 'video', nome: 'Videoconferência', icone: 'Video' },
  { id: 'presencial', nome: 'Presencial', icone: 'Users' },
] as const;

// Categorias de prova
export const CATEGORIAS_PROVA = [
  { id: 'logica', nome: 'Lógica', icone: 'Brain' },
  { id: 'tecnica', nome: 'Técnica', icone: 'Code' },
  { id: 'portugues', nome: 'Português', icone: 'BookOpen' },
  { id: 'ingles', nome: 'Inglês', icone: 'Globe' },
  { id: 'excel', nome: 'Excel', icone: 'Table' },
  { id: 'comportamental', nome: 'Comportamental', icone: 'Heart' },
  { id: 'fit_cultural', nome: 'Fit Cultural', icone: 'Users' },
] as const;

// Departamentos padrão
export const DEPARTAMENTOS = [
  'Tecnologia',
  'Comercial',
  'Marketing',
  'Recursos Humanos',
  'Financeiro',
  'Operações',
  'Administrativo',
  'Jurídico',
  'Produto',
  'Design',
] as const;

// Cores para gráficos
export const CHART_COLORS = [
  '#6366F1', // indigo
  '#8B5CF6', // violet
  '#A855F7', // purple
  '#D946EF', // fuchsia
  '#EC4899', // pink
  '#F43F5E', // rose
  '#22C55E', // green
  '#EAB308', // yellow
  '#F97316', // orange
  '#14B8A6', // teal
];

// Metas padrão
export const METAS_PADRAO = {
  tempoMedioContratacao: 25, // dias
  taxaConversao: 15, // %
  contratacoesMensais: 5,
  satisfacaoCandidato: 4.5, // 1-5
};
