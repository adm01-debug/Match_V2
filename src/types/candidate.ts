import type {
  ModalidadeTrabalho,
  NivelIdioma,
  RegimeContratacao,
  SenioridadeNivel,
} from '@/types/techProfile';

export interface Experiencia {
  cargo: string;
  empresa: string;
  periodo: string;
}

export interface Formacao {
  curso: string;
  instituicao: string;
}

export interface Candidato {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  resumo: string | null;
  habilidades: string[] | null;
  experiencias: Experiencia[] | null;
  formacao: Formacao[] | null;
  fonte: string | null;
  status: string | null;
  arquivo_curriculo: string | null;
  created_at: string | null;
  updated_at?: string | null;
  /** Colunas do perfil técnico (Onda 1). Opcionais: registros antigos
   *  e projeções parciais podem não trazê-las. */
  senioridade?: SenioridadeNivel | null;
  nivel_ingles?: NivelIdioma | null;
  pretensao_salarial?: number | null;
  pretensao_moeda?: string | null;
  regime?: RegimeContratacao | null;
  modalidade?: ModalidadeTrabalho | null;
  disponibilidade_dias?: number | null;
  aberto_a_oportunidades?: boolean | null;
}

export interface MatchScore {
  id: string;
  candidato_id: string;
  vaga_id: string;
  vaga_titulo: string;
  score_total: number;
  recomendacao: string | null;
  created_at: string | null;
}

export const statusOptions = [
  { value: 'todos', label: 'Todos os Status' },
  { value: 'novo', label: 'Novo' },
  { value: 'em_triagem', label: 'Em Triagem' },
  { value: 'entrevista', label: 'Entrevista' },
  { value: 'aprovado', label: 'Aprovado' },
  { value: 'reprovado', label: 'Reprovado' },
  { value: 'banco_talentos', label: 'Banco de Talentos' },
];

export const getStatusConfig = (status: string | null) => {
  switch (status) {
    case 'novo': return { label: 'Novo', color: 'bg-info text-info-foreground', chartColor: 'hsl(var(--info))' };
    case 'em_triagem': return { label: 'Em Triagem', color: 'bg-warning text-warning-foreground', chartColor: 'hsl(var(--warning))' };
    case 'entrevista': return { label: 'Entrevista', color: 'bg-accent text-accent-foreground', chartColor: 'hsl(var(--accent))' };
    case 'aprovado': return { label: 'Aprovado', color: 'bg-success text-success-foreground', chartColor: 'hsl(var(--success))' };
    case 'reprovado': return { label: 'Reprovado', color: 'bg-destructive text-destructive-foreground', chartColor: 'hsl(var(--destructive))' };
    case 'banco_talentos': return { label: 'Banco de Talentos', color: 'bg-primary text-primary-foreground', chartColor: 'hsl(var(--primary))' };
    default: return { label: status || 'Novo', color: 'bg-muted text-muted-foreground', chartColor: 'hsl(var(--muted-foreground))' };
  }
};

export const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-success bg-success/10 border-success/20';
  if (score >= 60) return 'text-warning bg-warning/10 border-warning/20';
  if (score >= 40) return 'text-accent bg-accent/10 border-accent/20';
  return 'text-destructive bg-destructive/10 border-destructive/20';
};