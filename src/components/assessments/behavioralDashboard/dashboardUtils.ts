import {
  Shield,
  Scale,
  Users,
  Crown,
  Shuffle,
  Rocket,
  MessageCircle,
  Brain,
  Heart,
  Target,
} from 'lucide-react';

export const pilarIcons: Record<string, typeof Shield> = {
  resiliencia: Shield,
  integridade: Scale,
  colaboracao: Users,
  lideranca: Crown,
  adaptabilidade: Shuffle,
  proatividade: Rocket,
  comunicacao: MessageCircle,
  pensamento_critico: Brain,
  inteligencia_emocional: Heart,
  orientacao_resultados: Target,
};

export const getScoreColor = (score: number): string => {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-primary';
  if (score >= 40) return 'text-warning';
  return 'text-destructive';
};

export const getScoreLabel = (score: number): string => {
  if (score >= 80) return 'Excepcional';
  if (score >= 60) return 'Forte';
  if (score >= 40) return 'Moderado';
  return 'Em Desenvolvimento';
};
