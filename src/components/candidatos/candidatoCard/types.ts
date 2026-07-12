export interface Experiencia {
  cargo: string;
  empresa: string;
  periodo: string;
}

export interface MatchScore {
  id: string;
  vaga_titulo: string;
  score_total: number;
  recomendacao: string | null;
}

export interface CandidatoCardData {
  id: string;
  nome: string;
  email: string;
  telefone?: string | null;
  resumo?: string | null;
  habilidades?: string[] | null;
  experiencias?: Experiencia[] | null;
  status?: string | null;
  created_at?: string | null;
  fonte?: string | null;
}

export const statusConfig: Record<string, { label: string; color: string }> = {
  novo: { label: 'Novo', color: 'bg-info text-info-foreground' },
  em_triagem: { label: 'Em Triagem', color: 'bg-warning text-warning-foreground' },
  entrevista: { label: 'Entrevista', color: 'bg-accent text-accent-foreground' },
  aprovado: { label: 'Aprovado', color: 'bg-success text-success-foreground' },
  reprovado: { label: 'Reprovado', color: 'bg-destructive text-destructive-foreground' },
  banco_talentos: { label: 'Banco de Talentos', color: 'bg-primary text-primary-foreground' },
};

export const getScoreColor = (score: number) => {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-muted-foreground';
};

export const getScoreBg = (score: number) => {
  if (score >= 80) return 'bg-success/10 border-success/20';
  if (score >= 60) return 'bg-warning/10 border-warning/20';
  return 'bg-muted/50 border-muted';
};
