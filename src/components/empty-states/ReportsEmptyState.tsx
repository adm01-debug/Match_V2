/**
 * @fileoverview Empty State para Relatórios
 */

import { useNavigate } from 'react-router-dom';
import { BarChart3, Plus } from 'lucide-react';
import { EmptyStateCard } from './EmptyStateCard';
import { ReportsEmptyIllustration } from './illustrations';

interface ReportsEmptyStateProps {
  context?: 'lista' | 'dados';
}

export function ReportsEmptyState({ context = 'dados' }: ReportsEmptyStateProps) {
  const navigate = useNavigate();

  if (context === 'lista') {
    return (
      <EmptyStateCard
        illustration={<ReportsEmptyIllustration />}
        title="Crie seu primeiro relatório"
        description="Gere relatórios personalizados para acompanhar métricas de recrutamento, desempenho de vagas e eficiência do processo seletivo."
        primaryAction={{
          label: "Criar Relatório",
          onClick: () => navigate('/relatorios/novo'),
          icon: Plus,
        }}
      />
    );
  }

  return (
    <EmptyStateCard
      illustration={<ReportsEmptyIllustration />}
      title="Dados insuficientes"
      description="Ainda não há dados suficientes para gerar este relatório. Continue usando o sistema e os dados serão coletados automaticamente."
      primaryAction={{
        label: "Ver Dashboard",
        onClick: () => navigate('/'),
        icon: BarChart3,
      }}
    />
  );
}

export default ReportsEmptyState;
