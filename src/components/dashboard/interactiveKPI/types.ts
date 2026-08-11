import type { LucideIcon } from 'lucide-react';

export interface TrendData {
  period: string;
  value: number;
  previousValue?: number;
}

export interface DrillDownData {
  category: string;
  value: number;
  percentage: number;
  color: string;
}

export type KPIVariant = 'primary' | 'success' | 'warning' | 'info' | 'accent';
export type KPIFormat = 'number' | 'percentage' | 'currency' | 'days';

export interface KPIAction {
  label: string;
  onClick: () => void;
}

export interface InteractiveKPICardProps {
  title: string;
  value: number;
  previousValue?: number;
  target?: number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: KPIVariant;
  trendData?: TrendData[];
  drillDownData?: DrillDownData[];
  comparisonLabel?: string;
  format?: KPIFormat;
  insight?: string;
  actions?: KPIAction[];
  index?: number;
}

export interface VariantStyle {
  gradient: string;
  iconBg: string;
  iconColor: string;
  glow: string;
  border: string;
}

export const variantStyles: Record<KPIVariant, VariantStyle> = {
  primary: {
    gradient: 'from-primary/20 via-primary/10 to-transparent',
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    glow: 'shadow-primary/20',
    border: 'border-primary/20',
  },
  success: {
    gradient: 'from-success/20 via-success/10 to-transparent',
    iconBg: 'bg-success/10',
    iconColor: 'text-success',
    glow: 'shadow-success/20',
    border: 'border-success/20',
  },
  warning: {
    gradient: 'from-warning/20 via-warning/10 to-transparent',
    iconBg: 'bg-warning/10',
    iconColor: 'text-warning',
    glow: 'shadow-warning/20',
    border: 'border-warning/20',
  },
  info: {
    gradient: 'from-info/20 via-info/10 to-transparent',
    iconBg: 'bg-info/10',
    iconColor: 'text-info',
    glow: 'shadow-info/20',
    border: 'border-info/20',
  },
  accent: {
    gradient: 'from-accent/20 via-accent/10 to-transparent',
    iconBg: 'bg-accent/10',
    iconColor: 'text-accent',
    glow: 'shadow-accent/20',
    border: 'border-accent/20',
  },
};

export function formatValue(value: number, format: KPIFormat = 'number'): string {
  switch (format) {
    case 'percentage':
      return `${value.toFixed(1)}%`;
    case 'currency':
      return `R$ ${value.toLocaleString('pt-BR')}`;
    case 'days':
      return `${value} dias`;
    default:
      return value.toLocaleString('pt-BR');
  }
}
