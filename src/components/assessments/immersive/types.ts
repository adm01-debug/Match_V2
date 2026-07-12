import { AlertTriangle, Zap, Brain, Eye, Sparkles } from 'lucide-react';

export interface ScenarioResponse {
  scenarioId: string;
  selectedOption: string;
  timeToRespond: number;
  followUpResponse?: string;
  followUpTime?: number;
  hesitations: number;
  readTime: number;
}

export const tipoLabels: Record<string, { label: string; icon: typeof AlertTriangle; color: string }> = {
  dilema_etico: { label: 'Dilema Ético', icon: AlertTriangle, color: 'text-warning' },
  situacao_pressao: { label: 'Sob Pressão', icon: Zap, color: 'text-destructive' },
  conflito_interpessoal: { label: 'Conflito', icon: Brain, color: 'text-accent' },
  decisao_estrategica: { label: 'Decisão Estratégica', icon: Eye, color: 'text-primary' },
  crise: { label: 'Gestão de Crise', icon: AlertTriangle, color: 'text-destructive' },
  inovacao: { label: 'Inovação', icon: Sparkles, color: 'text-success' },
};
