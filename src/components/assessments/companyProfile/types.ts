import type { CompanyProfile } from '@/config/behavioralPillars';

export interface CompanyProfileBuilderProps {
  initialProfile?: Partial<CompanyProfile>;
  onSave: (profile: CompanyProfile) => void;
  vagaId?: string;
}

export const DEALBREAKER_SUGGESTIONS = [
  'Falta de integridade/desonestidade',
  'Incapacidade de trabalhar em equipe',
  'Resistência a feedback',
  'Falta de proatividade',
  'Comunicação agressiva',
  'Inflexibilidade',
  'Desrespeito a prazos',
  'Falta de ownership',
  'Comportamento político excessivo',
  'Resistência a mudanças',
];

export const DEFAULT_CULTURA_DIMENSOES: Record<string, number> = {
  velocidade: 50,
  hierarquia: 50,
  conflito: 50,
  inovacao: 50,
  resultado: 50,
  transparencia: 50,
  trabalho_vida: 50,
  erro: 50,
};
