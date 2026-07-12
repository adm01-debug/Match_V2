// Configuração das etapas do pipeline
// Este arquivo substitui @/data/pipelineData.ts com constantes puras (sem mock data)
// Cores migradas para tokens semânticos do design system (respeita dark mode)

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
    cor: 'bg-muted-foreground',
    descricao: 'Candidatos recém-inscritos aguardando triagem',
    ordem: 1,
    acoes: ['iniciar_triagem', 'rejeitar', 'agendar_contato'],
  },
  {
    id: 'em_triagem',
    nome: 'Em Triagem',
    cor: 'bg-info',
    descricao: 'Análise inicial de currículo e requisitos',
    ordem: 2,
    acoes: ['aprovar_triagem', 'reprovar', 'solicitar_info'],
  },
  {
    id: 'pre_selecao',
    nome: 'Pré-Seleção',
    cor: 'bg-primary',
    descricao: 'Candidatos pré-selecionados para entrevistas',
    ordem: 3,
    acoes: ['agendar_entrevista_rh', 'enviar_teste', 'reprovar'],
  },
  {
    id: 'entrevista_rh',
    nome: 'Entrevista RH',
    cor: 'bg-accent',
    descricao: 'Entrevista com Recursos Humanos',
    ordem: 4,
    acoes: ['aprovar', 'reprovar', 'reagendar', 'adicionar_feedback'],
  },
  {
    id: 'teste_tecnico',
    nome: 'Teste Técnico',
    cor: 'bg-warning',
    descricao: 'Avaliação técnica ou prova',
    ordem: 5,
    acoes: ['aplicar_prova', 'registrar_resultado', 'reprovar'],
  },
  {
    id: 'entrevista_gestor',
    nome: 'Entrevista Gestor',
    cor: 'bg-info',
    descricao: 'Entrevista com gestor da área',
    ordem: 6,
    acoes: ['aprovar', 'reprovar', 'reagendar', 'adicionar_avaliacao'],
  },
  {
    id: 'entrevista_final',
    nome: 'Entrevista Final',
    cor: 'bg-accent',
    descricao: 'Entrevista final com diretoria',
    ordem: 7,
    acoes: ['aprovar', 'reprovar', 'enviar_proposta'],
  },
  {
    id: 'aprovado',
    nome: 'Aprovados',
    cor: 'bg-success',
    descricao: 'Candidatos aprovados aguardando proposta',
    ordem: 8,
    acoes: ['enviar_proposta', 'mover_banco_talentos'],
  },
  {
    id: 'proposta_enviada',
    nome: 'Proposta Enviada',
    cor: 'bg-success',
    descricao: 'Proposta enviada ao candidato',
    ordem: 9,
    acoes: ['registrar_aceite', 'registrar_recusa', 'negociar'],
  },
  {
    id: 'contratado',
    nome: 'Contratados',
    cor: 'bg-success',
    descricao: 'Candidatos contratados',
    ordem: 10,
    acoes: ['iniciar_onboarding', 'gerar_documentos'],
  },
  {
    id: 'reprovado',
    nome: 'Reprovados',
    cor: 'bg-destructive',
    descricao: 'Candidatos não aprovados',
    ordem: 11,
    acoes: ['enviar_feedback', 'mover_banco_talentos'],
  },
  {
    id: 'banco_talentos',
    nome: 'Banco de Talentos',
    cor: 'bg-warning',
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

// Mapeamento de cores por status (tokens semânticos com opacidade)
export const statusColors: Record<string, string> = {
  em_andamento: 'bg-info/15 text-info',
  aprovado: 'bg-success/15 text-success',
  reprovado: 'bg-destructive/15 text-destructive',
  desistente: 'bg-warning/15 text-warning',
  contratado: 'bg-primary/15 text-primary',
};

export const etapaPremiumColors: Record<string, { gradient: string; border: string; icon: string; glow: string }> = {
  novo: {
    gradient: 'from-info/20 via-info/10 to-transparent',
    border: 'border-info/30 hover:border-info/50',
    icon: 'bg-info',
    glow: 'shadow-info/20',
  },
  em_triagem: {
    gradient: 'from-info/20 via-info/10 to-transparent',
    border: 'border-info/30 hover:border-info/50',
    icon: 'bg-info',
    glow: 'shadow-info/20',
  },
  pre_selecao: {
    gradient: 'from-primary/20 via-primary/10 to-transparent',
    border: 'border-primary/30 hover:border-primary/50',
    icon: 'bg-primary',
    glow: 'shadow-primary/20',
  },
  entrevista_rh: {
    gradient: 'from-accent/20 via-accent/10 to-transparent',
    border: 'border-accent/30 hover:border-accent/50',
    icon: 'bg-accent',
    glow: 'shadow-accent/20',
  },
  teste_tecnico: {
    gradient: 'from-warning/20 via-warning/10 to-transparent',
    border: 'border-warning/30 hover:border-warning/50',
    icon: 'bg-warning',
    glow: 'shadow-warning/20',
  },
  entrevista_gestor: {
    gradient: 'from-info/20 via-info/10 to-transparent',
    border: 'border-info/30 hover:border-info/50',
    icon: 'bg-info',
    glow: 'shadow-info/20',
  },
  entrevista_final: {
    gradient: 'from-accent/20 via-accent/10 to-transparent',
    border: 'border-accent/30 hover:border-accent/50',
    icon: 'bg-accent',
    glow: 'shadow-accent/20',
  },
  aprovado: {
    gradient: 'from-success/20 via-success/10 to-transparent',
    border: 'border-success/30 hover:border-success/50',
    icon: 'bg-success',
    glow: 'shadow-success/20',
  },
  proposta_enviada: {
    gradient: 'from-warning/20 via-warning/10 to-transparent',
    border: 'border-warning/30 hover:border-warning/50',
    icon: 'bg-warning',
    glow: 'shadow-warning/20',
  },
  contratado: {
    gradient: 'from-success/20 via-success/10 to-transparent',
    border: 'border-success/30 hover:border-success/50',
    icon: 'bg-success',
    glow: 'shadow-success/20',
  },
  reprovado: {
    gradient: 'from-destructive/20 via-destructive/10 to-transparent',
    border: 'border-destructive/30 hover:border-destructive/50',
    icon: 'bg-destructive',
    glow: 'shadow-destructive/20',
  },
};

export default etapasConfig;
