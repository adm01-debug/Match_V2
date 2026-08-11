export interface Indicacao {
  id: string;
  indicador_user_id: string | null;
  indicador_nome: string;
  indicador_email: string;
  candidato_nome: string;
  candidato_email: string;
  candidato_telefone: string | null;
  vaga_id: string | null;
  vaga_titulo: string;
  observacao: string | null;
  status: 'pendente' | 'em_analise' | 'aprovado' | 'contratado' | 'reprovado';
  bonus: number | null;
  created_at: string;
  updated_at: string;
}

export type IndicacaoStatus = Indicacao['status'];

export interface NovaIndicacaoInput {
  candidatoNome: string;
  candidatoEmail: string;
  candidatoTelefone: string;
  vagaId: string;
  observacao: string;
}

import { Clock, User, CheckCircle, Trophy, XCircle } from 'lucide-react';

export const statusConfig = {
  pendente: { label: 'Pendente', color: 'bg-warning/20 text-warning', icon: Clock },
  em_analise: { label: 'Em Análise', color: 'bg-info/20 text-info', icon: User },
  aprovado: { label: 'Aprovado', color: 'bg-success/20 text-success', icon: CheckCircle },
  contratado: { label: 'Contratado', color: 'bg-success/20 text-success', icon: Trophy },
  reprovado: { label: 'Reprovado', color: 'bg-destructive/20 text-destructive', icon: XCircle },
} as const;
