// Configuração das etapas do pipeline
// Este arquivo substitui @/data/pipelineData.ts com constantes puras (sem mock data)

import { EtapaProcesso } from '@/types/recruitment';

export interface EtapaConfig {
  id: EtapaProcesso;
  nome: string;
  cor: string;
  descricao: string;
  ordem: number;
  acoes: string[];
}

export const etapasConfig: EtapaConfig[] = [
  {
    id: 'novo',
    nome: 'Novos',
    cor: 'bg-gray-500',
    descricao: 'Candidatos recém-inscritos aguardando triagem',
    ordem: 1,
    acoes: ['iniciar_triagem', 'rejeitar', 'agendar_contato'],
  },
  {
    id: 'em_triagem',
    nome: 'Em Triagem',
    cor: 'bg-blue-500',
    descricao: 'Análise inicial de currículo e requisitos',
    ordem: 2,
    acoes: ['aprovar_triagem', 'reprovar', 'solicitar_info'],
  },
  {
    id: 'pre_selecao',
    nome: 'Pré-Seleção',
    cor: 'bg-indigo-500',
    descricao: 'Candidatos pré-selecionados para entrevistas',
    ordem: 3,
    acoes: ['agendar_entrevista_rh', 'enviar_teste', 'reprovar'],
  },
  {
    id: 'entrevista_rh',
    nome: 'Entrevista RH',
    cor: 'bg-purple-500',
    descricao: 'Entrevista com Recursos Humanos',
    ordem: 4,
    acoes: ['aprovar', 'reprovar', 'reagendar', 'adicionar_feedback'],
  },
  {
    id: 'teste_tecnico',
    nome: 'Teste Técnico',
    cor: 'bg-orange-500',
    descricao: 'Avaliação técnica ou prova',
    ordem: 5,
    acoes: ['aplicar_prova', 'registrar_resultado', 'reprovar'],
  },
  {
    id: 'entrevista_gestor',
    nome: 'Entrevista Gestor',
    cor: 'bg-cyan-500',
    descricao: 'Entrevista com gestor da área',
    ordem: 6,
    acoes: ['aprovar', 'reprovar', 'reagendar', 'adicionar_avaliacao'],
  },
  {
    id: 'entrevista_final',
    nome: 'Entrevista Final',
    cor: 'bg-teal-500',
    descricao: 'Entrevista final com diretoria',
    ordem: 7,
    acoes: ['aprovar', 'reprovar', 'enviar_proposta'],
  },
  {
    id: 'aprovado',
    nome: 'Aprovados',
    cor: 'bg-green-500',
    descricao: 'Candidatos aprovados aguardando proposta',
    ordem: 8,
    acoes: ['enviar_proposta', 'mover_banco_talentos'],
  },
  {
    id: 'proposta_enviada',
    nome: 'Proposta Enviada',
    cor: 'bg-emerald-500',
    descricao: 'Proposta enviada ao candidato',
    ordem: 9,
    acoes: ['registrar_aceite', 'registrar_recusa', 'negociar'],
  },
  {
    id: 'contratado',
    nome: 'Contratados',
    cor: 'bg-green-700',
    descricao: 'Candidatos contratados',
    ordem: 10,
    acoes: ['iniciar_onboarding', 'gerar_documentos'],
  },
  {
    id: 'reprovado',
    nome: 'Reprovados',
    cor: 'bg-red-500',
    descricao: 'Candidatos não aprovados',
    ordem: 11,
    acoes: ['enviar_feedback', 'mover_banco_talentos'],
  },
  {
    id: 'banco_talentos',
    nome: 'Banco de Talentos',
    cor: 'bg-amber-500',
    descricao: 'Candidatos para oportunidades futuras',
    ordem: 12,
    acoes: ['reativar_processo', 'enviar_comunicacao'],
  },
];

// Helper para buscar config de uma etapa
export function getEtapaConfig(etapaId: EtapaProcesso): EtapaConfig | undefined {
  return etapasConfig.find(e => e.id === etapaId);
}

// Helper para ordenar etapas
export function ordenarEtapas(etapas: EtapaProcesso[]): EtapaProcesso[] {
  return [...etapas].sort((a, b) => {
    const configA = getEtapaConfig(a);
    const configB = getEtapaConfig(b);
    return (configA?.ordem || 0) - (configB?.ordem || 0);
  });
}

// Etapas visíveis no pipeline (excluindo finais)
export const etapasPipeline: EtapaProcesso[] = [
  'novo',
  'em_triagem',
  'pre_selecao',
  'entrevista_rh',
  'teste_tecnico',
  'entrevista_gestor',
  'entrevista_final',
  'aprovado',
  'proposta_enviada',
];

// Mapeamento de cores por status
export const statusColors: Record<string, string> = {
  em_andamento: 'bg-blue-100 text-blue-700',
  aprovado: 'bg-green-100 text-green-700',
  reprovado: 'bg-red-100 text-red-700',
  desistente: 'bg-amber-100 text-amber-700',
  contratado: 'bg-purple-100 text-purple-700',
};

export const etapaPremiumColors: Record<string, { gradient: string; border: string; icon: string; glow: string }> = {
  novo: { 
    gradient: "from-blue-500/20 via-blue-500/10 to-transparent", 
    border: "border-blue-500/30 hover:border-blue-500/50",
    icon: "bg-blue-500",
    glow: "shadow-blue-500/20"
  },
  em_triagem: { 
    gradient: "from-cyan-500/20 via-cyan-500/10 to-transparent", 
    border: "border-cyan-500/30 hover:border-cyan-500/50",
    icon: "bg-cyan-500",
    glow: "shadow-cyan-500/20"
  },
  pre_selecao: { 
    gradient: "from-indigo-500/20 via-indigo-500/10 to-transparent", 
    border: "border-indigo-500/30 hover:border-indigo-500/50",
    icon: "bg-indigo-500",
    glow: "shadow-indigo-500/20"
  },
  entrevista_rh: { 
    gradient: "from-violet-500/20 via-violet-500/10 to-transparent", 
    border: "border-violet-500/30 hover:border-violet-500/50",
    icon: "bg-violet-500",
    glow: "shadow-violet-500/20"
  },
  teste_tecnico: { 
    gradient: "from-orange-500/20 via-orange-500/10 to-transparent", 
    border: "border-orange-500/30 hover:border-orange-500/50",
    icon: "bg-orange-500",
    glow: "shadow-orange-500/20"
  },
  entrevista_gestor: { 
    gradient: "from-cyan-500/20 via-cyan-500/10 to-transparent", 
    border: "border-cyan-500/30 hover:border-cyan-500/50",
    icon: "bg-cyan-500",
    glow: "shadow-cyan-500/20"
  },
  entrevista_final: { 
    gradient: "from-pink-500/20 via-pink-500/10 to-transparent", 
    border: "border-pink-500/30 hover:border-pink-500/50",
    icon: "bg-pink-500",
    glow: "shadow-pink-500/20"
  },
  aprovado: { 
    gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent", 
    border: "border-emerald-500/30 hover:border-emerald-500/50",
    icon: "bg-emerald-500",
    glow: "shadow-emerald-500/20"
  },
  proposta_enviada: { 
    gradient: "from-amber-500/20 via-amber-500/10 to-transparent", 
    border: "border-amber-500/30 hover:border-amber-500/50",
    icon: "bg-amber-500",
    glow: "shadow-amber-500/20"
  },
  contratado: { 
    gradient: "from-emerald-500/20 via-emerald-500/10 to-transparent", 
    border: "border-emerald-500/30 hover:border-emerald-500/50",
    icon: "bg-emerald-500",
    glow: "shadow-emerald-500/20"
  },
  reprovado: { 
    gradient: "from-red-500/20 via-red-500/10 to-transparent", 
    border: "border-red-500/30 hover:border-red-500/50",
    icon: "bg-red-500",
    glow: "shadow-red-500/20"
  },
};

export default etapasConfig;
